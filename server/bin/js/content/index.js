export class Content_Handler {
	constructor() {
		this.currentItem = null;
	}
	async GetDriver(){
		const { Driver } = await import('/static/js/Utils/Driver/HttpRequest/driver.js');
		return Driver
	}
	
	async Prepocress(){
		return (await import('/static/js/Utils/DataCollector/index.js')).default;
	}
	
	async GetAlert(){
		return (await import('/static/js/Content/Alert/index.js')).default;
	}
	
	async GetTabel(){
		return (await import('/static/js/Content/Tabel/tabel.js')).default;
	}
	async GetController(){
		return (await import('/static/js/Utils/ContentController/index.js')).default;
	}
	
	async GetModal(){
		return (await import('/static/js/Content/Modal/modal.js')).default;
	}
	
	async GetGenerator(){
		return (await import('/static/js/Content/GenSet/genset-v1.js')).default;
	}
	async GetStruktur(){
		return (await import('/static/js/Content/Struktur/struktur.js')).default;
	}
	
	Delay(ms){
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	
	async Page_Node(elemen, params={}){
		const Generator = await this.GetGenerator()
		const Struktur = await this.GetStruktur()
		const controller = await this.GetController();
		const control = new controller({
			"elemen":elemen, 
			"page":"node", 
			"struktur":new Struktur(elemen, {"generator":Generator}),
			"driver":await this.GetDriver(),
			"store":params['store'],
			"data":data,
			
		});
		await control.Execute();
	}
	async Page_Home(elemen, params={}){
		const Generator = await this.GetGenerator()
		const Struktur = await this.GetStruktur()
		const controller = await this.GetController();
		const control = new controller({
			"elemen":elemen, 
			"page":"home", 
			"struktur":new Struktur(elemen, {"generator":Generator}),
			"store":params['store'],
			"data":data,
			
		});
		await control.Execute();
	}
}