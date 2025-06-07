var base_elemen, modul, content, data_db;
(async () => {
	base_elemen = document.querySelector('[kimin-data="block_content"]');
	
	const db = (await import("/static/js/Utils/IndexDb/index.js")).default;
	const store = new db();
	
	const id_user = data?.data?.id_user || null;
	const current_page = data?.cfg?.current_page;
	
	modul = await import('/static/js/content/index.js');
	content = new modul.Content_Handler();
	// Menangani tampilan halaman berdasarkan current_page
	switch (current_page) {
		case 'home':
			await content.Page_Home(base_elemen, {store:store});
			break;
		case 'node':
			await content.Page_Node(base_elemen, {store:store});
			break;
		default:
			console.warn("Halaman tidak dikenali:", current_page);
	}
})();