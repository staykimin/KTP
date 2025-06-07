export class Driver {
	constructor(url, method='get', header={}, body={}){
		this.url = url;
		this.method = method;
		this.header = header;
		this.body = body;
	}
	async Execute(){
		let hasil = {'status':false};
		try {
			hasil['respon'] = await fetch(this.url, {
				method:this.method.toLowerCase(),
				headers:this.header,
				body: this.method.toLowerCase() !== 'get' ? JSON.stringify(this.body) : null
			})
			if (!hasil['respon'].ok){
				hasil['error'] = hasil['respon'].status;
			} else if (hasil['respon'].ok){
				const respon = hasil['respon'].clone();
				try {
					hasil['data'] = await hasil['respon'].json(); // Coba parse JSON
				} catch (err) {
					hasil['data'] = await respon.blob(); // Jika gagal, jadiin blob
				}
				hasil['respon'] = await hasil['respon']
				hasil['status'] = true;
			}
		} catch (error) {
			console.log(error)
			hasil['error'] = error;
		}
		return hasil;
	}
}