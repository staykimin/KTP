export default class Struktur {
	constructor(elemen, params = {}){
		this.elemen = elemen;
		this.params = params;
	}
	
	async Node(params={}){
		const hasil = `
		<!-- Node List -->
		<section id="list_node" class="py-24 bg-gradient-to-br from-blue-50 to-white min-h-screen">
			<div class="max-w-6xl mx-auto px-6">
				<h2 class="text-3xl font-bold text-center mb-12 text-blue-700 fade-in-up" style="animation-delay: 0.3s;">List Node Yang Terhubung</h2>
				<div class="grid md:grid-cols-2 gap-10">
					<p class="text-center text-gray-500 col-span-full">Belum ada node yang terhubung.</p>
				</div>
			</div>
		</section>
		<!-- Support Us Section -->
		<section id="support" class="bg-gray-900 text-white py-14 fade-in-up">
			<div class="max-w-4xl mx-auto px-6 text-center">
				<h2 class="text-3xl font-bold mb-4">Dukung KTP, Proyek Tunneling untuk Semua</h2>
				<p class="text-gray-300 mb-8">KTP adalah proyek open-source buatan komunitas. Dukunganmu membantu kami tetap mandiri, bebas biaya, dan terus berkembang.</p>
				<div class="flex justify-center flex-wrap gap-6 mb-6">
					<a href="https://github.com/staykimin/KTP" target="_blank" class="hover:text-blue-400 transition flex items-center space-x-2">
						<i class="fab fa-github text-2xl"></i> 
						<span class="hidden sm:inline">GitHub</span>
					</a>
					<a href="https://www.facebook.com/staykimin/" target="_blank" class="hover:text-blue-300 transition flex items-center space-x-2">
						<i class="fab fa-facebook text-2xl"></i>
						<span class="hidden sm:inline">Facebook</span>
					</a>
				</div>
			</div>
		</section>
		
		<!-- Footer -->
		<footer class="w-full h-12 bg-gray-900 text-white z-50 flex items-center justify-center fade-in">
			<div>&copy; 2025 KTP. All rights reserved.</div>
		</footer>
		`
		this.elemen.innerHTML = hasil
	}
	async Home(params={}){
		const hasil = `
		<!-- Hero Section -->
		<section class="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-white">
			<div class="max-w-6xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center">
				<div class="md:w-1/2 fade-in-up">
					<h1 class="text-4xl md:text-5xl font-bold mb-4 text-blue-700">Buka Akses Lokalmu ke Internet, Tanpa Ribet</h1>
					<p class="text-lg mb-6 text-gray-700">KTP (KAF Tunnels Project) adalah proyek open-source untuk mengekspose layanan lokal ke internet tanpa IP publik, tanpa domain, dan tanpa ribet.</p>
					<a href="https://github.com/staykimin/KTP" class="bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 btn-animated inline-block transition">Mulai Sekarang</a>
				</div>
				<div class="md:w-1/2 mb-10 md:mb-0 fade-in-up flex justify-center md:justify-end">
					<!-- Lottie Animasi dari CDN publik LottieFiles -->
					<lottie-player
						src="/static/animasi/networking.json"
						background="transparent"
						speed="1"
						style="width: 300px; height: 200px"
						loop
						autoplay
					></lottie-player>
				</div>
			</div>
		</section>

		<!-- Features -->
		<section id="features" class="py-16 bg-white">
			<div class="max-w-6xl mx-auto px-6">
				<h2 class="text-3xl font-bold text-center mb-12 text-blue-700 fade-in-up" style="animation-delay: 0.3s;">Fitur</h2>
				<div class="grid md:grid-cols-3 gap-10">
					<div class="kartu bg-blue-50 p-6 rounded-xl shadow hover:shadow-md transition transform hover:-translate-y-1 fade-in-up" style="animation-delay: 0.4s;">
						<h3 class="text-xl font-semibold mb-2 text-blue-600">Expose Instan</h3>
						<p>Expose layanan lokal ke internet dalam hitungan detik tanpa IP publik atau domain</p>
					</div>
					<div class="kartu bg-blue-50 p-6 rounded-xl shadow hover:shadow-md transition transform hover:-translate-y-1 fade-in-up" style="animation-delay: 0.6s;">
						<h3 class="text-xl font-semibold mb-2 text-blue-600">Subdomain Custom</h3>
						<p>Bebas memilih subdomain unik untuk layananmu langsung dari konfiguras</p>
					</div>
					<div class="kartu bg-blue-50 p-6 rounded-xl shadow hover:shadow-md transition transform hover:-translate-y-1 fade-in-up" style="animation-delay: 0.8s;">
						<h3 class="text-xl font-semibold mb-2 text-blue-600">Tanpa IP Publik</h3>
						<p>Akses dari luar tanpa butuh IP statis, domain, atau port forwarding</p>
					</div>
					<div class="kartu bg-blue-50 p-6 rounded-xl shadow hover:shadow-md transition transform hover:-translate-y-1 fade-in-up" style="animation-delay: 0.8s;">
						<h3 class="text-xl font-semibold mb-2 text-blue-600">Multi Engine</h3>
						<p>Pilih engine tunneling yang kamu suka: Yggdrasil, FRPC, atau lainnya.</p>
					</div>
				
					<div class="kartu bg-blue-50 p-6 rounded-xl shadow hover:shadow-md transition transform hover:-translate-y-1 fade-in-up" style="animation-delay: 0.8s;">
						<h3 class="text-xl font-semibold mb-2 text-blue-600">Relay Mandiri</h3>
						<p>Bangun gateway kamu sendiri atau bergabung dengan gateway komunitas</p>
					</div>
					<div class="kartu bg-blue-50 p-6 rounded-xl shadow hover:shadow-md transition transform hover:-translate-y-1 fade-in-up" style="animation-delay: 0.8s;">
						<h3 class="text-xl font-semibold mb-2 text-blue-600">Komunitas Terbuka</h3>
						<p>Dirancang untuk kolaborasi terbuka antar pengguna dan pembuat gateway</p>
					</div>
				</div>
			</div>
		</section>

		<!-- How To Section -->
		<section id="howtowork" class="py-20 bg-gradient-to-br from-blue-50 to-white">
			<div class="max-w-6xl mx-auto px-6 md:px-12">
				<h2 class="text-4xl font-extrabold text-center text-blue-700 mb-10 fade-in-up" style="animation-delay: 0.2s;">
					Cara Kerja
				</h2>
				<p class="max-w-3xl mx-auto text-center text-blue-900 text-lg mb-16 fade-in-up" style="animation-delay: 0.4s;">
					KTP membuat layanan lokal kamu dapat diakses dari internet tanpa ribet, hanya dengan memilih engine dan gateway yang kamu inginkan.
				</p>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-12">
					<div class="kartu bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500 fade-in-up" style="animation-delay: 0.6s;">
						<h3 class="text-2xl font-semibold text-indigo-700 mb-4">1. Pilih Engine</h3>
						<p class="text-gray-700 leading-relaxed">
							Pilih engine seperti Yggdrasil, FRPC, atau yang lainnya — KTP akan mengunduh dan menjalankannya otomatis.
						</p>
					</div>
					<div class="kartu bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500 fade-in-up" style="animation-delay: 0.8s;">
						<h3 class="text-2xl font-semibold text-indigo-700 mb-4">2. Tentukan Gateway</h3>
						<p class="text-gray-700 leading-relaxed">
							Sambungkan ke salah satu gateway publik atau buat dan gunakan gateway milikmu sendiri.
						</p>
					</div>
					<div class="kartu bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500 fade-in-up" style="animation-delay: 1s;">
						<h3 class="text-2xl font-semibold text-indigo-700 mb-4">3. Online</h3>
						<p class="text-gray-700 leading-relaxed">
							Layanan lokalmu kini bisa diakses dari luar lewat subdomain yang kamu pilih sendiri. Mudah dan cepat.
						</p>
					</div>
				</div>
			</div>
		</section>

		<section id="about" class="py-16 bg-gradient-to-br from-blue-100 to-blue-50">
			<div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center">
		
				<!-- Teks kiri -->
				<div class="md:w-1/2 fade-in-up">
					<h2 class="text-4xl font-extrabold text-blue-700 mb-6">Tentang KTP</h2>
					<p class="text-blue-800 text-lg mb-4 leading-relaxed">
						KTP (KAF Tunnels Project) adalah alternatif open-source untuk layanan seperti Ngrok dan Cloudflare Tunnels — sebuah platform yang memungkinkan siapa pun mengakses layanan lokal dari internet tanpa IP publik, tanpa domain, dan tanpa setup rumit.
					</p>
					<p class="text-blue-800 text-lg leading-relaxed">
						Berbasis arsitektur terdesentralisasi, KTP membuka kesempatan bagi siapa saja untuk menjadi pengguna <em>maupun</em> penyedia gateway publik. Gunakan engine seperti Yggdrasil atau FRPC, pilih subdomain-mu sendiri, dan langsung online.
					</p>
				</div>
			
				<!-- Animasi kanan -->
				<div class="md:w-1/2 mt-10 md:mt-0 fade-in-up">
					<lottie-player
						src="/static/animasi/about.json"
						background="transparent"
						speed="1"
						style="width: 100%; max-width: 400px; margin: 0 auto;"
						loop
						autoplay
					></lottie-player>
				</div>
			</div>
		</section>

		<section id="kenapa-pakai-ktp" class="bg-gradient-to-br from-blue-50 to-white py-16 px-6">
			<div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
		
				<!-- Lottie Animation di kiri -->
				<div class="flex-1 max-w-md">
					<lottie-player 
						src="/static/animasi/why_us.json"
						background="transparent"  
						speed="1"  
						loop  
						autoplay
						style="width: 100%; height: 100%;">
					</lottie-player>
				</div>
		
				<!-- Card content di kanan -->
				<div class="flex-1">
					<h2 class="text-4xl font-bold mb-12 text-blue-700 text-center md:text-left">Kenapa Pilih KTP?</h2>

					<div class="flex flex-col gap-8">
						<div class="kartu bg-gray-100 rounded-lg p-8 shadow-md hover:shadow-blue-300 transition-shadow duration-300 fade-in-up">
						<h3 class="text-2xl font-semibold mb-4 text-blue-700">Tanpa IP Publik & Domain</h3>
						<p class="leading-relaxed text-gray-700 text-lg">
							Jalankan server lokal dan akses dari mana saja — cukup pilih subdomain dan gateway, tidak perlu repot dengan IP statis maupun DNS.
						</p>
					</div>

					<div class="kartu bg-gray-100 rounded-lg p-8 shadow-md hover:shadow-green-300 transition-shadow duration-300 fade-in-up">
						<h3 class="text-2xl font-semibold mb-4 text-green-700">Bebas Bangun Gateway Sendiri</h3>
						<p class="leading-relaxed text-gray-700 text-lg">
							Ingin kontrol penuh? Jalankan node gateway milikmu sendiri dan bantu perluas jaringan relay Kiminet secara desentralisasi.
						</p>
					</div>

					<div class="kartu bg-gray-100 rounded-lg p-8 shadow-md hover:shadow-yellow-300 transition-shadow duration-300 fade-in-up">
						<h3 class="text-2xl font-semibold mb-4 text-yellow-600">Engine Modular & Otomatis</h3>
						<p class="leading-relaxed text-gray-700 text-lg">
							Pilih engine seperti Yggdrasil atau FRPC hanya dengan angka — sistem akan otomatis download, install, dan jalankan untukmu.
						</p>
					</div>
				</div>
			</div>
		</section>


		<!-- Call to Action -->
		<section class="py-16 bg-blue-600 text-white text-center fade-in-up" style="animation-delay: 1s;">
			<h2 class="text-3xl font-bold mb-4">Siap Coba KTP?</h2>
			<p class="mb-6 text-lg">Mulai expose localhost kamu sekarang. Tanpa IP publik, tanpa ribet, sepenuhnya gratis dan open-source.</p>
			<a href="https://github.com/staykimin/KTP" class="bg-white text-blue-600 px-6 py-3 rounded-full shadow hover:bg-gray-100 btn-animated inline-block transition">Mulai Sekarang</a>
		</section>

		<!-- Support Us Section -->
		<section id="support" class="bg-gray-900 text-white py-14 fade-in-up">
			<div class="max-w-4xl mx-auto px-6 text-center">
				<h2 class="text-3xl font-bold mb-4">Dukung KTP, Proyek Tunneling untuk Semua</h2>
				<p class="text-gray-300 mb-8">KTP adalah proyek open-source buatan komunitas. Dukunganmu membantu kami tetap mandiri, bebas biaya, dan terus berkembang.</p>
				<div class="flex justify-center flex-wrap gap-6 mb-6">
					<a href="https://github.com/staykimin/KTP" target="_blank" class="hover:text-blue-400 transition flex items-center space-x-2">
						<i class="fab fa-github text-2xl"></i> 
						<span class="hidden sm:inline">GitHub</span>
					</a>
					<a href="https://www.facebook.com/staykimin/" target="_blank" class="hover:text-blue-300 transition flex items-center space-x-2">
						<i class="fab fa-facebook text-2xl"></i>
						<span class="hidden sm:inline">Facebook</span>
					</a>
				</div>
			</div>
		</section>
		
		<!-- Footer -->
		<footer class="w-full h-12 bg-gray-900 text-white z-50 flex items-center justify-center fade-in">
			<div>&copy; 2025 KTP. All rights reserved.</div>
		</footer>
		`
		this.elemen.innerHTML = hasil
	}
}