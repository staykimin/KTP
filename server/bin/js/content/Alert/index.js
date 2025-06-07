export default class AlertHandler{
	constructor (params={}){
		this.elemen = params['elemen']
	}
	
	async Execute(params={}){
		const elemen = document.createElement("div")
		elemen.innerHTML = `
			<div class="alert alert-${params['type']} alert-dismissible fade show" role="alert">
				<div>${params['pesan']}</div>
				<button type="button" class="btn-close" aria-label="Close"></button>
			</div>
		`;
		const alertBox = elemen.firstElementChild;
		this.elemen.append(elemen)
		document.querySelectorAll('.btn-close').forEach( (item) => {
			item.addEventListener('click', function () {
				alertBox.remove();
			});
		});
	}
}