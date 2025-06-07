export class Content_Handler {
	async GetDriver(){
		const { Driver } = await import('/static/js/driver/HttpRequest/driver.js');
		return Driver
	}
	Delay(ms){
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	
	Loading(elemen){
		return `
			<div id="loadingOverlay" class="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
				<svg class="animate-spin h-16 w-16 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
				</svg>
			</div>
		`
	}
	
	async Bagi(data, maxPerCluster){
		const entries = Object.entries(data);
		const clusters = [];
		let cluster = [];

		for (let i = 0; i < entries.length; i++) {
			cluster.push(entries[i]); // Tambahkan pasangan key-value ke cluster
			if (cluster.length === maxPerCluster || i === entries.length - 1) {
				clusters.push(cluster);
				cluster = [];
			}
		}

		return clusters;
	}
	
	RenderEpisode(current, data){
		
	}
	async Player(elemen, name) {
		elemen.innerHTML = this.Loading();
		await this.Delay(3);
		let driver = await this.GetDriver();
		let respon = await new driver(
			'/api/v1/find',
			'post',
			{ 'Accept': 'application/json', 'Content-Type': 'application/json' },
			{ "data": decodeURIComponent(name) }
		).Execute();

		if (respon['status']) {
			if (respon['data']['status']) {
				const vidio = respon['data']['data']; // Array of video URLs
				let currentIndex = 0;

				const renderVideoPlayer = (index) => {
					elemen.innerHTML = `
						<div class="bg-gray-900 text-white min-h-screen flex flex-col">
							<header class="p-4 border-b border-gray-700 text-center md:text-left md:px-8">
								<h1 class="text-3xl font-bold">KIMIN STREAM</h1>
							</header>
							<main class="flex flex-col md:flex-row flex-1 overflow-hidden">
								<section class="flex flex-col flex-1 p-4 md:p-8">
								  <h2 id="episodeTitle" class="text-xl font-semibold mb-4">Memuat episode...</h2>
								  <div class="relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
									<video
									  id="videoPlayer"
									  controls
									  playsinline
									  class="w-full h-full object-contain bg-black"
									  preload="metadata"
									  webkit-playsinline
									>
										<source src="/api/v1/player?path=${vidio[index]}&base=${name}" type="video/mp4">
											Browser kamu tidak mendukung video tag.
									</video>
								  </div>

								  <div class="flex justify-center space-x-6 mt-6">
									<button id="btnPrev" aria-label="Episode sebelumnya" class="bg-indigo-600 hover:bg-indigo-700 p-3 rounded-lg flex items-center justify-center w-12 h-12">
										<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current text-white w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="2">
											<polygon points="19 20 9 12 19 4 19 20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
											<line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
									</button>
									<button id="btnPlayPause" aria-label="Play/Pause" class="bg-indigo-600 hover:bg-indigo-700 p-3 rounded-lg flex items-center justify-center w-12 h-12">
										<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current text-white w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="2">
											<polygon points="5 3 19 12 5 21 5 3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
									</button>
									<button id="btnNext" aria-label="Episode berikutnya" class="bg-indigo-600 hover:bg-indigo-700 p-3 rounded-lg flex items-center justify-center w-12 h-12">
										<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current text-white w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="2">
											<polygon points="5 4 15 12 5 20 5 4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
											<line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
									</button>
								  </div>
								</section>
								<aside class="bg-gray-800 w-full md:w-72 border-t md:border-t-0 md:border-l border-gray-700 p-4 overflow-y-auto max-h-96 md:max-h-full">
									<h3 class="text-lg font-semibold mb-3">Daftar Episode</h3>
									<ul id="episodeList" class="space-y-2"></ul>
								</aside>
							</main>
						</div>
					`;
					
					document.querySelector('#episodeTitle').innerText = `${decodeURIComponent(name)} Episode ${index+1}`
					let current = 0;
					const episode = elemen.querySelector('#episodeList')
					vidio.forEach((item, no) => {
						const li = document.createElement("li");
						li.textContent = `Episode ${no+1}`;
						li.setAttribute("data-index", no);
						li.className = `cursor-pointer rounded px-3 py-2 transition-colors
						  ${no === index ? "bg-indigo-600 font-semibold" : "hover:bg-indigo-500"}`;
						episode.appendChild(li);
					});
					const videoElement = document.getElementById('videoPlayer');

					// Function to enter fullscreen
					const enterFullscreen = async () => {
						if (videoElement.requestFullscreen) {
							await videoElement.requestFullscreen();
						} else if (videoElement.webkitRequestFullscreen) { // Safari compatibility
							await videoElement.webkitRequestFullscreen();
						} else if (videoElement.msRequestFullscreen) { // IE compatibility
							await videoElement.msRequestFullscreen();
						}

						// Adjust video style for fullscreen
						videoElement.style.objectFit = 'contain';
						videoElement.style.width = '100%';
						videoElement.style.height = '100%';
					};
					
					document.querySelector('h1').addEventListener('click', () => {
						window.history.back();
					})
					// Function to exit fullscreen
					const exitFullscreen = async () => {
						if (document.exitFullscreen) {
							await document.exitFullscreen();
						} else if (document.webkitExitFullscreen) { // Safari compatibility
							await document.webkitExitFullscreen();
						} else if (document.msExitFullscreen) { // IE compatibility
							await document.msExitFullscreen();
						}

						// Reset video style when exiting fullscreen
						videoElement.style.objectFit = '';
						videoElement.style.width = '100%';
						videoElement.style.height = 'auto';
					};

					// Event listeners for video element
					
					videoElement.addEventListener('play', enterFullscreen);
					videoElement.addEventListener('pause', exitFullscreen);
					videoElement.addEventListener('ended', () => {
						exitFullscreen();
						if (currentIndex < vidio.length - 1) {
							currentIndex++;
							renderVideoPlayer(currentIndex);
						}
						
					})
					document.querySelector('#btnPlayPause').addEventListener('click', () => {
						if(videoElement.paused) videoElement.play();
						else videoElement.pause();
					})

					// Add event listeners for navigation buttons
					document.querySelector('#btnPrev').addEventListener('click', () => {
						if (currentIndex > 0) {
							currentIndex--;
							renderVideoPlayer(currentIndex);
						}
					});
					
					document.querySelector('#btnNext').addEventListener('click', () => {
						if (currentIndex < vidio.length - 1) {
							currentIndex++;
							renderVideoPlayer(currentIndex);
						}
					});

					const episodeItems = document.querySelectorAll('#episodeList > li');
					episodeItems.forEach(item => {
						item.addEventListener('click', (e) => {
							const newIndex = parseInt(e.target.getAttribute('data-index'));
							currentIndex = newIndex;
							renderVideoPlayer(currentIndex);
						});
					});
				};

				// Initial render
				renderVideoPlayer(currentIndex);
			} else {
				alert("Error Di Sistem Backend");
			}
		} else {
			alert("Error Di Driver");
		}
	}


	async _Render(params={}){
		params['elemen'].innerHTML = this.Loading();
		let tmp = `
			<div class="bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-gray-100 min-h-screen p-6 font-sans relative">
				<header class="mb-6 text-center">
					<h1 class="text-5xl font-extrabold tracking-tight mb-2 drop-shadow-lg">KIMIN STREAM SERVER</h1>
					<p class="text-gray-400 max-w-xl mx-auto">Home Server Untuk Streaming Anime Bebas Kuota / Offline</p>
				</header>
				<main>
					<div class="relative mb-6 max-w-lg mx-auto">
						<svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
						</svg>
						<input type="text" id="searchInput" placeholder="Cari anime berdasarkan judul..." 
							class="w-full rounded-lg px-10 py-3 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition" />
					</div>
					<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
		`
		Object.keys(params['respon']['data']['data']).forEach(kunci => {
			const item = params['respon']['data']['data'][kunci]
			tmp += `
				<article class="relative bg-gray-800 rounded-3xl shadow-lg overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-indigo-600"> 
					<a href="${item['data'].length > 0 ? '/player/'+kunci: '#'}">
						<div class="relative overflow-hidden rounded-3xl aspect-[16/9]">
							<img src="${item['thumbnail'].length > 0 ? '/api/v1/thumbnail?path='+kunci+"/"+item['thumbnail'][0] : 'https://placehold.co/600x400'}" alt="${kunci}" class="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110" loading="lazy" />
							<div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 hover:opacity-50 transition-opacity duration-500"></div>
							<h3 class="absolute bottom-4 left-4 right-4 text-lg font-semibold text-white drop-shadow-lg z-10 overflow-hidden whitespace-nowrap text-ellipsis" title="${kunci}">${kunci}</h3>
						</div>
						<div class="p-4 flex justify-between items-center text-indigo-400 font-medium text-sm select-none">
							<div class="flex items-center space-x-1">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" >
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 19V6h13" />
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 6L5 10m0 0l4 4M5 10h14" />
								</svg>
								<span>480p</span>
							</div>
							<div class="flex items-center space-x-1">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" >
									<path stroke-linecap="round" stroke-linejoin="round" d="M8 17l4-4 4 4m0-10l-4 4-4-4" />
								</svg>
								<span>${item['data'].length} Episodes</span>
							</div>
						</div>
					</a>
				</article>
			`
		});
		
		tmp += `
				</div>
				<nav aria-label="Pagination" class="flex justify-center space-x-2 text-gray-300 select-none">
					<button id="prevBtn" class="px-4 py-2 rounded-md bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50" disabled>Prev</button>
					<div id="pageNumbers" class="flex space-x-1"></div>
					<button id="nextBtn" class="px-4 py-2 rounded-md bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50" disabled>Next</button>
				</nav>
			</main>
		</div>
		`;
		params['elemen'].innerHTML = tmp
		
		const base = params['elemen'].querySelector('#pageNumbers')
		const nextBtn = params['elemen'].querySelector('#nextBtn')
		const prevBtn = params['elemen'].querySelector('#prevBtn')
		
		let pencarian = document.getElementById('searchInput');
		pencarian.value = params?.cari ?? ""
		let timeout = null;
		pencarian.addEventListener('input', (event) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				const query = pencarian.value.trim();
				window.location.href = `/?page=${params['current']}&s=${query}`
			}, 1000);
		});
		// Jika hanya ada satu halaman
		if (params['respon']['data']['total_pages'] === 1) {
			const btn = document.createElement("button");
			btn.textContent = '1';
			btn.className = `px-3 py-1 rounded-md bg-indigo-600 text-white`;
			btn.addEventListener("click", () => {
				// window.location.href = '/?page=1';
				window.location.href = `/?page=1${params['cari'] && params['cari'] !== '' ? `&s=${encodeURIComponent(params['cari'])}` : ''}`;

			});
			base.appendChild(btn)
		} 
		// Jika ada lebih dari satu halaman
		else if (params['respon']['data']['total_pages'] > 1) {
			const maxPagesToShow = 3; // Maksimal jumlah halaman yang ditampilkan di sekitar halaman saat ini

			// Tombol "Previous"
			if (params['current'] > 1) {
				prevBtn.classList.remove('disabled:opacity-50')
				prevBtn.disabled = false
				prevBtn.addEventListener('click', () => {
					window.location.href = `/?page=${params['current']-1}${params['cari'] && params['cari'] !== '' ? `&s=${encodeURIComponent(params['cari'])}` : ''}`;

				});
			}

			// Hitung rentang halaman
			const startPage = Math.max(1, params['current'] - Math.floor(maxPagesToShow / 2));
			const endPage = Math.min(params['respon']['data']['total_pages'], startPage + maxPagesToShow - 1);

			// Tampilkan halaman dalam rentang
			for (let i = startPage; i <= endPage; i++) {
				const btn = document.createElement("button");
				btn.textContent = i;
				if (i === params['current']) {
					btn.className = `px-3 py-1 rounded-md bg-indigo-600 text-white`;
				} else {
					btn.className = `px-3 py-1 rounded-md hover:bg-indigo-600 hover:text-white`;
				}
				btn.addEventListener("click", () => {
					// window.location.href = `/?page=${i}`;
					window.location.href = `/?page=${i}${params['cari'] && params['cari'] !== '' ? `&s=${encodeURIComponent(params['cari'])}` : ''}`;
				});
				base.appendChild(btn)
			}

			// Tombol "Next"
			if (params['current'] < params['respon']['data']['total_pages']) {
				nextBtn.classList.remove('disabled:opacity-50')
				nextBtn.disabled = false
				nextBtn.addEventListener('click', () => {
					window.location.href = `/?page=${params['current']+1}${params['cari'] && params['cari'] !== '' ? `&s=${encodeURIComponent(params['cari'])}` : ''}`;
				});
			}
			
		}
	}
	
	async Home(elemen, page, current, cari) {
		let driver = await this.GetDriver();
		let respon = new driver('/api/v1/data', 'post', {'Accept': 'application/json', 'Content-Type': 'application/json'}, {"page":page, "cari":cari});
		respon = await respon.Execute();
		if (respon['status']){
			if (respon['data']['status']){
				await this._Render({elemen:elemen, page:page, current:current, respon:respon, cari:cari})
			} else {
				alert("Error Di Sistem Backend")
			}
		} else {
			alert("Error Di Driver")
		}
	}
}