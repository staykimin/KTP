export default class IndexDBHandler {
	constructor(params = {}) {
		this.params = params;
		this.hasil = {"status":false};
	}
	
	async AksesDB(params={}){
		return new Promise((sukses, tolak) => {
			const request = indexedDB.open(params['db_name'], 1);
			request.onupgradeneeded  = (event) => {
				const db = event.target.result;
				if (!db.objectStoreNames.contains(params['tabel'])){
					db.createObjectStore(params['tabel'], {keyPath: "id", autoIncrement: true});
				}
			};
			
			request.onsuccess = (event) => sukses(event.target.result);
			request.onerror = (event) => tolak(event.target.error);
		});
	}
	
	async AddData(params={}){
		const db = await this.AksesDB(params);
		return new Promise((sukses, tolak) => {
			const transaksi = db.transaction(params['tabel'], "readwrite");
			const store = transaksi.objectStore(params['tabel']);
			const request = store.add(params['data']);
			request.onsuccess = () => sukses(request.result);
			request.onerror = () => tolak(request.error);
		});
	}
	
	async ReadData(params={}){
		const db = await this.AksesDB(params);
		return new Promise((sukses, tolak) => {
			const transaksi = db.transaction(params['tabel'], 'readonly');
			const store = transaksi.objectStore(params['tabel']);
			const request = store.get(params['id']);
			
			request.onsuccess = () => sukses(request.result);
			request.onerror = () => tolak(request.error);
		});
	}
	
	async UpdateData(params={}){
		const db = await this.AksesDB(params);
		return new Promise((sukses, tolak) => {
			const transaksi = db.transaction(params['tabel'], 'readwrite');
			const store = transaksi.objectStore(params['tabel']);
			const request = store.put(params['data']);
			
			request.onsuccess = () => sukses(request.result);
			request.onerror = () => tolak(request.error);
		});
	}
	
	async ShowAll(params={}){
		const db = await this.AksesDB(params);
		return new Promise((sukses, tolak) => {
			const transaksi = db.transaction(params['tabel'], 'readonly');
			const store = transaksi.objectStore(params['tabel']);
			const request = store.getAll();
			
			request.onsuccess = () => sukses(request.result);
			request.onerror = () => tolak(request.error);
		});
	}
	
	async DeleteData(params={}){
		const db = await this.AksesDB(params);
		return new Promise((sukses, tolak) => {
			const transaksi = db.transaction(params['tabel'], 'readwrite');
			const store = transaksi.objectStore(params['tabel']);
			const request = store.delete(params['id']);
			
			request.onsuccess = () => sukses(request.result);
			request.onerror = () => tolak(request.error);
		});
	}
}