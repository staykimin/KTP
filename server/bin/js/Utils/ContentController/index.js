export default class Content_Controller {
	constructor(params={}){
		this.base_elemen = params['elemen'];
		this.params = params;
	}
	
	async PageHome(){
		const modul = (await import("/static/js/Content/Page/home.js")).default;
		const page_data = new modul(this.params)
		return await page_data.Execute();
	}
	
	async PageNode(){
		const modul = (await import("/static/js/Content/Page/node.js")).default;
		const page_data = new modul(this.params)
		return await page_data.Execute();
	}
	
	async Execute(){
		if (this.params['page'] === 'home'){
			return await this.PageHome();
		} else if (this.params['page'] === 'node'){
			return await this.PageNode();
		}
	}
}