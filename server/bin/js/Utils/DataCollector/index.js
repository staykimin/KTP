export default class Data_Collector{
	constructor (params={}){
		this.Driver = params['driver'];
		this.Enkripsi = params['enkripsi'];
		this.hasil = {"status":false}
	}
	
	async Preprocess(params={}){
		if ('pwd' in params && params['pwd'] !== undefined){
			const data = await this.Enkripsi.GetData(params['pwd'], typeof params['data'] === 'string' ? params['data'] : params['data']['data']);
			if (data !== null){
				const hasil = typeof data === "string" ?  data : JSON.parse(data);
				return hasil
			}
		}
		
		return false;
	}
	
	async HeaderProcessing(params={}){
		return {
			'Accept': 'application/json', 'Content-Type': 'application/json',
			"tid":data['cfg']['csrf'].split("||")[data['cfg']['csrf'].split("||").length-1],
			...params
		}
	}
	
	async PayloadProcessing(params={}){
		return {
			"csrf":data['cfg']['csrf'].split("||")[0],
			...params
		}
	}
	
	async ParamsProcessing(params={}){
		return `?tid=${data['cfg']['csrf'].split("||")[data['cfg']['csrf'].split("||").length-1]}&ac=${data['cfg']['csrf'].split("||")[0]}`
	}
	
	async GetData(params={}){
		const { decrypt, payload, header, base_url, url, pwd, req_id, ...filteredParams } = params;
		// console.log(params)
		if ('pwd' in params && 'req_id' in params && params['pwd'] !== undefined && params['req_id'] !== undefined){
			const respon = new this.Driver(
				`${params['base_url']}${await this.ParamsProcessing()}`,
				"post", 
				await this.HeaderProcessing('header' in params ? params['header'] : {}),
				await this.PayloadProcessing({
					...filteredParams,
					"data":{
						"data":await this.Enkripsi.Encrypt(params['pwd'], JSON.stringify(params['payload'])),
						'req_id':params['req_id']
						}
					}
				)
			);
			return await respon.Execute()
		}
		return {"status":false}
		
	}
	
	async Execute(params={}){
		const requestParams = { ...params };
		
		if (!requestParams.url) {
			requestParams.base_url = '/api/v1/data';
		} else {
			requestParams.base_url = requestParams.url
		}
		const respon = await this.GetData(requestParams);
		if (respon['status']){
			if ('decrypt' in params && params['decrypt']){
				if (respon['data']['status']){
					const data = await this.Preprocess({'data':respon['data']['data'], ...requestParams});
					this.hasil['status'] = data ? true : false;
					this.hasil['data'] = data ? data : null;
				} else {
					this.hasil = respon['data']
				}
			} else {
				this.hasil = respon['data']
			}
			
		} else {
			this.hasil['status'] = false
			this.hasil['error'] = "Gagal Terhubung Dengan Server"
		}
		return this.hasil
	}
}