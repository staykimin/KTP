export default class Tabel {
	constructor(elemen, header, aksi = true, params = {}){
		this.elemen = elemen;
		this.header = header;
		this.aksi = aksi;
		this.params = params;
	}
	
	renderTabel(tmp_data){
		let tmp = `
			<div class="table-responsive">
				<table class="table">
					<thead>
						<tr>
							<th scope="col">No</th>
							${this.header.map((header) => `<th scope="col">${header}</th>`).join("")}
							${this.aksi ? `<th scope="col"></th>` : ""}
						</tr>
					</thead>
					<tbody>
		`;
		tmp_data.forEach( (item, index) => {
			tmp += `
				<tr>
					<td>${this.params['current_page']-1 > 0 ? (this.params['current_page']-1) * 10 + index + 1 : index + 1}</td>
					${this.header.map( (kunci) => `<td>${item[kunci] !== undefined ? item[kunci] : ""}</td>`).join("")}
					${this.aksi ? `<td class='text-center'>${'aksi' in item ? item['aksi'] : ""}</td>` : ""}
				</tr>
			`;
		});
		tmp += `
					</tbody>
				</table>
			</div>
			<nav aria-label="Page navigation">
				<ul class='pagination justify-content-center' ${'navName' in this.params ? `id="${this.params['navName']}"` : ''}"></ul>
			</nav>
		`
		this.elemen.innerHTML = tmp;
	}
	renderPagination(params={}){
		if ('navName' in this.params && 'current_page' in this.params && 'total_page' in this.params){
			const nav = document.getElementById(this.params['navName'])
			if (!nav) return;
			let tmp = `
			`
			const start = Math.max(1, this.params['current_page'] -1);
			const end = Math.min(this.params['total_page'], start + 2);
			for (let i = start; i <= end; i++){
				tmp += `
					<li class="page-item ${i === this.params['current_page'] ? "active" : ""}">
						<a class="page-link" href="#" data-page="${i}" kimin-data="${this.params['navName']}">${i}</a>
					</li>
				`
			};
			nav.innerHTML = tmp;
			const navigasi = document.querySelectorAll(`[kimin-data="${this.params['navName']}"]`);
			if (navigasi){
				navigasi.forEach( (item) => {
					if ('callback' in params){
						item.addEventListener('click', async function(event) {
							await params['callback'].call(this, event, params);
						});
					}
				});
			}
		}
	}
	
	updateTabel(params={}){
		this.renderTabel(params['data']);
	}
}