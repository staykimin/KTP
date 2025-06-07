export default class Modal {
	constructor(header_elemen, body_elemen, footer_elemen, params={}){
		this.header=header_elemen;
		this.body=body_elemen;
		this.footer=footer_elemen;
		this.params=params;
		this.modal = new bootstrap.Modal(document.getElementById('ModalPopUp'));
	}
	
	Validation(params={}){
		if (params['tipe'] == 'nomor_telp'){
			const elemen = document.getElementById(params['id']);
			elemen.addEventListener('input', function() {
				const value = this.value;
				if (!value.startsWith('62') || /\D/.test(value)) {
					this.value = value.replace(/\D/g, '').replace(/^0+/, '');
					if (!this.value.startsWith('62')) {
						this.value = '62' + this.value;
					}
				}
			});
		} else if (params['tipe'] == 'number'){
			const elemen = document.getElementById(params['id']);
			elemen.addEventListener('input', function() {
				this.value = this.value.replace(/\D/g, '');
				if (this.value === '') {
					return;
				}
				if (parseInt(this.value) < 0) {
					this.value = 0;
				}
			});
		}
	}
	
	SuksesStat(data){
		return `
		<div class="text-center">
			<i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
			<h5 class="text-success mt-3" style="color:black">${data}</h5>
		</div>
		`
	}
	FailedStat(data){
		return `
		<div class="text-center">
			<i class="bi bi-x-circle-fill text-danger" style="font-size: 4rem;"></i>
			<h5 class="text-danger mt-3" style="color:black">${data}</h5>
		</div>
		`
	}
	LoadingStat(){
		return `<div class="text-center">
			<div class="spinner-border" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		</div>`
	}
	
	renderModal(params={}){
		let tmp = ``
		let data = {}
		if ('input' in params){
			Object.keys(params['input']).forEach((item) => {
				tmp += `
					${'elemen' in  params['input'][item] && params['input'][item]['elemen'] && 'child' in params['input'][item]['elemen'] && params['input'][item]['elemen']['child']  ? '' : `<div class="mb-3 input-handler">`}
				`
				if ('elemen' in params['input'][item] && params['input'][item]['elemen'] && 'start' in params['input'][item]['elemen']){
					tmp += params['input'][item]['elemen']['start']
				}
				tmp += `
					${ 'elemen' in params['input'][item] && params['input'][item]['elemen'] && 'class' in params['input'][item]['elemen'] ? `<div class="${params['input'][item]['elemen']['class']}">` : ""}
					<label for="${item}" class="form-label"><b>${params['input'][item]['label']}</b></label>
					${params['input'][item]['type'] == 'text' 
						? `<input type="text" class="form-control" id="${item}" placeholder="${params['input'][item]['placeholder']}" value="${params['input'][item]['value'] ?? ''}" ${'readonly' in params['input'][item] && params['input'][item]['readonly'] ? 'disabled' : ""}/>`
						: params['input'][item]['type'] == 'number' 
						? `<input type="number" class="form-control" id="${item}" placeholder="${params['input'][item]['placeholder']}" value="${params['input'][item]['value'] ?? ''}" ${'readonly' in params['input'][item] && params['input'][item]['readonly'] ? 'disabled' : ""}/>` 
						: params['input'][item]['type'] == 'textarea'
						? `<textarea class="form-control" id="${item}" placeholder="${params['input'][item]['placeholder']}" style="height:175px;" ${'readonly' in params['input'][item] && params['input'][item]['readonly'] ? 'disabled' : ""}/>${params['input'][item]['value'] ?? ''}</textarea>`
						: params['input'][item]['type'] == 'option'
						? `<select class="form-select" id="${item}"><option value="${params['input'][item]['default']['value']}" ${'readonly' in params['input'][item] && params['input'][item]['readonly'] ? 'disabled' : ""} selected>${params['input'][item]['default']['label']}</option></select>`
						: params['input'][item]['type'] == 'date'
						? `<input type="date" class="form-control" id="${item}" placeholder="${params['input'][item]['placeholder']}" value="${params['input'][item]['value'] ?? ''}" ${'readonly' in params['input'][item] && params['input'][item]['readonly'] ? 'disabled' : ""}/>`
						: params['input'][item]['type'] == 'datetime'
						? `<input type="datetime-local" class="form-control" id="${item}" placeholder="${params['input'][item]['placeholder']}" value="${params['input'][item]['value'] ?? ''}" ${'readonly' in params['input'][item] && params['input'][item]['readonly'] ? 'disabled' : ""}/>`
						: params['input'][item]['type'] == 'content'
						? `
						<div class="mb-3">
							<input type="file" class="form-control w-100" kimin-data="input_content" id="${item}" placeholder="${params['input'][item]['placeholder']}" value="${params['input'][item]['value'] ?? ''}" ${'readonly' in params['input'][item] && params['input'][item]['readonly'] ? 'disabled' : ""} accept="image/png, video/mp4"/>
							<img kimin-data="imagePreview_${item}" src="${params['input'][item]['value'] ?? ''}" class="img-fluid border mt-3" style="width: 100%; max-height: 300px; display: none; object-fit: contain;">
							<video kimin-data="videoPreview_${item}" class="mt-3" style="width: 100%; max-height: 300px; display: none; object-fit: contain;" controls></video>
						</div>
						`
						: params['input'][item]['type'] == 'elemen'
						? `${params['input'][item]['value']}`
						: params['input'][item]['type'] == 'password'
						? `
							<div class="form-group mb-3">
								<div class="row position-relative">
									<div class="col-12">
										<input id='${item}' type="password" class="form-control" placeholder="${params['input'][item]['placeholder']}">
										<i kimin-data-id="${item}" class="bi bi-eye-slash position-absolute" kimin-data="showPwd" style="color:black; font-size: 1.5rem; top: 50%; right: 20px; cursor: pointer; transform: translateY(-50%);"></i>
									</div>
								</div>
							<div>
							`
						: ""}
					<div class="text-danger mt-2" kimin-data="error_${item}" style="display: none;"></div>
					${'elemen' in params['input'][item] && params['input'][item]['elemen'] && 'end' in params['input'][item]['elemen'] ? params['input'][item]['elemen']['end'] : "</div>"}
				${'elemen' in  params['input'][item] && params['input'][item]['elemen'] && 'child' in params['input'][item]['elemen'] && params['input'][item]['elemen']['child'] ? '' : `</div>`}
				`
			})
		}
		this.body.innerHTML = tmp
		
		document.querySelectorAll('[kimin-data="showPwd"]').forEach( (item) => {
			item.addEventListener("click", function(){
				const id = this.getAttribute('kimin-data-id')
				const type = document.getElementById(id).getAttribute('type') === 'password' ? 'text' : 'password';
				document.getElementById(id).setAttribute('type', type);
				this.classList.toggle('bi-eye');
				this.classList.toggle('bi-eye-slash');
			});
		});
		
		document.querySelectorAll('[kimin-data="input_content"]').forEach((item) => {
			const id = item.getAttribute('id');
			const previewImage = document.querySelector(`[kimin-data="imagePreview_${id}"]`);
			const previewVideo = document.querySelector(`[kimin-data="videoPreview_${id}"]`);
			
			const value = item.getAttribute('value');
			if (value) {

				fetch(value)
					.then(response => {
						const contentType = response.headers.get("Content-Type");
						if (contentType.includes("image/png")) {
							previewImage.src = value;
							previewImage.style.display = "block";
							previewVideo.style.display = "none";
						} else if (contentType.includes("video/mp4")) {
							previewVideo.src = value;
							previewVideo.style.display = "block";
							previewVideo.controls = true;
							previewImage.style.display = "none";
						} else {
							console.error("Tipe file tidak didukung:", contentType);
						}
					})
					.catch(error => {
						console.error("Gagal mengambil data:", error);
					});
			} else {
				previewImage.style.display = "none";
				previewVideo.style.display = "none";
			}

			item.addEventListener('change', function(event){
				const file = event.target.files[0];
				
				previewImage.style.display = "none";
				previewVideo.style.display = "none";
				previewImage.src = "";
				previewVideo.src = "";
				
				if (!file) return;
				
				const maxSizeMB = 10;
				if (file.size > maxSizeMB * 1024 * 1024) {
					alert(`Ukuran file tidak boleh lebih dari ${maxSizeMB} MB.`);
					item.value = ''; // Reset input
					return;
				}
				
				if (file.type === "image/png") {
					const reader = new FileReader();
					reader.onload = function(e) {
						previewImage.src = e.target.result;
						previewImage.style.display = "block";  // Tampilkan gambar
						data[id] = {"size":file.size, "base64":e.target.result, "mime":"image/png"};  // Simpan base64
					};
					reader.readAsDataURL(file);
				} else if (file.type === "video/mp4") {
					const reader = new FileReader();
					reader.onload = function(e) {
						previewVideo.src = e.target.result;
						previewVideo.style.display = "block";  // Tampilkan video
						previewVideo.controls = true;  // Aktifkan kontrol video
						data[id] = {"size":file.size, "base64":e.target.result, "mime":"video/mp4"};  // Simpan base64
					};
					reader.readAsDataURL(file);
				} else {
					alert("Hanya file PNG (gambar) atau MP4 (video) yang diperbolehkan.");
					item.value = ''; // Reset input
				}
			});
		});
		if ('input' in params){
			Object.keys(params['input']).forEach( (item) => {
				if ('validation' in params['input'][item] && 'tipe' in params['input'][item]['validation']){
					this.Validation({id:item, tipe:params['input'][item]['validation']['tipe']})
				}
				
				if (params['input'][item]['type'] == 'option' && 'data' in params['input'][item] && 'data' in params['input'][item]['data']){
					tmp = ``
					params['input'][item]['data']['data'].forEach( (x) => {
						if (x[params['input'][item]['data']['kunci']] != params['input'][item]['default']['value']){
							tmp += `<option value="${x[params['input'][item]['data']['kunci']]}">${x[params['input'][item]['data']['label']]}</option>`
						}
					});
					document.getElementById(item).innerHTML += tmp
				}
			});
		}
		this.modal.show()
		document.querySelectorAll('[aria-label="Close"]').forEach( (item) => {
			item.addEventListener('click', () => {
				this.modal.hide();
				document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
			});
		});
		
		if ('callback' in params['footer'] && 'kunci' in params['footer']){
			params['output'] = {}
			document.querySelector(params['footer']['kunci']).addEventListener('click', async () => {
				let stat = true;
				Object.keys(params['input']).forEach((item, index) => {
					if (params['input'][item]['type'] == 'content'){
						params['output'][item] = data[item]
					} else {
						params['output'][item] = document.getElementById(item).value
					}
					
					if ('required' in params['input'][item] && params['input'][item]['required']){
						document.querySelector(`[kimin-data="error_${item}"]`).style.display = 'none';
						if (!params['output'][item]){
							document.querySelector(`[kimin-data="error_${item}"]`).style.display = 'block';
							document.querySelector(`[kimin-data="error_${item}"]`).innerText = `${params['input'][item]['label']} Tidak Boleh Kosong`;
							stat = false;
							return;
						}
					}
				});
				if (stat){
					await params['footer']['callback'].call(this, event, params);
				}
				
			});
		}
	}
	
	updateModal(params={}){
		document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
		// if (this.modal.classList.contains('show')) {
			// console.log("Close")
			// this.modal.hide();
		// }

		if ('header' in params){
			this.header.innerHTML = params['header'];
		}
		if ('footer' in params){
			this.footer.innerHTML = params['footer']['elemen'];
		}
		if ('body' in params && 'tipe' in params['body']){
			if (params['body']['tipe'] == 'loading'){
				this.body.innerHTML = this.LoadingStat()
				this.modal.show()
				document.querySelectorAll('[aria-label="Close"]').forEach( (item) => {
					item.addEventListener('click', () => {
						this.modal.hide();
						document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
					});
				});
				if ('callback' in params['footer'] && 'kunci' in params['footer']){
					document.querySelector(params['footer']['kunci']).addEventListener('click', async () => {
						await params['footer']['callback'].call(this, event, params);
					});
				}
			} else if (params['body']['tipe'] == 'sukses') {
				this.body.innerHTML = this.SuksesStat(params['body']['data'])
				this.modal.show()
				document.querySelectorAll('[aria-label="Close"]').forEach( (item) => {
					item.addEventListener('click', () => {
						this.modal.hide();
						document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
					});
				});
			} else if (params['body']['tipe'] == 'elemen'){
				this.body.innerHTML = params['body']['data'];
				this.modal.show()
				document.querySelectorAll('[aria-label="Close"]').forEach( (item) => {
					item.addEventListener('click', () => {
						this.modal.hide();
						document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
					});
				});
				
				if ('callback' in params['footer'] && 'kunci' in params['footer']){
					document.querySelector(params['footer']['kunci']).addEventListener('click', async () => {
						await params['footer']['callback'].call(this, event, params);
					});
				}
				
			} else if (params['body']['tipe'] == 'failed'){
				this.body.innerHTML = this.FailedStat(params['body']['data'])
				this.modal.show()
				document.querySelectorAll('[aria-label="Close"]').forEach( (item) => {
					item.addEventListener('click', () => {
						this.modal.hide();
						document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
					});
				});
			}
			
		} else {
			this.renderModal(params)
		}
		
	}
}