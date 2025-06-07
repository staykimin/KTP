export default class PageHome {
	constructor(params={}){
		this.params = params;
		this.data = {}
	}
	
	async RenderPage(){
		let tmp = ''
		await this.params['struktur'].Home({});
		const btn = document.getElementById('hamburger-btn');
		const mobileMenu = document.getElementById('mobile-menu');

		btn.addEventListener('click', () => {
			mobileMenu.classList.toggle('hidden');
		});
		const faders = document.querySelectorAll('.fade-in-up');

		const appearOptions = {
			threshold: 0.1,
			rootMargin: "0px 0px -50px 0px"
		};

		const appearOnScroll = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					if (entry.target.classList.contains("kartu")) {
						const parent = entry.target.closest('section')
						const cards = parent.querySelectorAll(".kartu");
						cards.forEach((card, index) => {
							setTimeout(() => {
								card.classList.add("visible");
							}, (index+1) * 200); // Delay antar card 200ms
						});
					} else {
						entry.target.classList.add('visible');
					}
				// Ketika elemen masuk viewport → tambah kelas visible → animasi fade-in
				} else {
				// Ketika elemen keluar viewport → hapus kelas visible → animasi fade-out
					entry.target.classList.remove('visible');
				}
			});
		}, appearOptions);

		faders.forEach(fader => {
			appearOnScroll.observe(fader);
		});
}
	
	async Execute(){
		await this.RenderPage();
	}
}