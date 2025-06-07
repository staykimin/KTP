export default class PageHome {
	constructor(params={}){
		this.params = params;
		this.data = {}
	}
	
	formatUptime(seconds) {
		const s = Math.floor(seconds);
		if (s < 60) {
			return `${s} detik`;
		} else if (s < 3600) {
			const m = Math.floor(s / 60);
			return `${m} menit`;
		} else if (s < 86400) {
			const h = Math.floor(s / 3600);
			return `${h} jam`;
		} else {
			const d = Math.floor(s / 86400);
			return `${d} hari`;
		}
	}
	
	async RenderPage(){
		let tmp = ''
		await this.params['struktur'].Node({});
		
		const btn = document.getElementById('hamburger-btn');
		const mobileMenu = document.getElementById('mobile-menu');
		btn.addEventListener('click', () => {
			mobileMenu.classList.toggle('hidden');
		});
		
		const targetDiv = document.querySelector('#list_node .grid.md\\:grid-cols-2');
		const driver = new this.params['driver']("/api/v1/gateway")
		const respon = await driver.Execute()
		tmp = ''
		if (respon.status && respon.data.status){
			respon.data.data.forEach( (item) => {
				tmp += `
					<div class="kartu bg-blue-50 p-6 rounded-xl shadow hover:shadow-md transition transform hover:-translate-y-1 fade-in-up" style="animation-delay: 0.4s;">
						<h3 class="text-lg font-bold text-blue-600 mb-2">Node: <span class="font-mono text-black">${item['domain']}</span></h3>
						<ul class="text-sm text-gray-700 space-y-1">
							<li><strong>Country:</strong> ${item['country']}</li>
							<li><strong>ISP:</strong> ${item['isp']}</li>
							<li><strong>CITY:</strong> ${item['city']}</li>
							<li><strong>Latency:</strong> ${item['latency']}</li>
							<li>
								<strong>Traffic:</strong> ${item['bytes_recv']}
								<span class="inline-block w-2 font-black text-green-600">⬇</span>
								/
								${item['bytes_send']}
								<span class="inline-block w-2 font-black text-red-600">⬆</span>
							</li>
							<li><strong>Uptime:</strong> ${this.formatUptime(item['uptime'])}</li>
					</ul>
					</div>
				`
			});
		}
		if (tmp !== ""){
			targetDiv.innerHTML = tmp
		}
		
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