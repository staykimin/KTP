export default class Fingerprint{
	constructor (){
		this.fonts = ["Arial", "Courier", "Times New Roman", "Verdana"];
		this.hasil = {}
	}
	
	async GpuInfo(){
		const gl = document.createElement("canvas").getContext("webgl");
		if(!gl) return "unknown";
		const tmp = gl.getExtension("WEBGL_debug_renderer_info");
		return tmp ? gl.getParameter(tmp.UNMASKED_RENDERER_WEBGL) : "unknown";
	}
	async AudioInfo(){
		const context = new (window.AudioContext || window.webkitAudioContext)();
		const osilator = context.createOscillator();
		const analyser = context.createAnalyser();
		const gain = context.createGain();
		const scriptPro = context.createScriptProcessor(4096, 1, 1);
		return new Promise((resolve) => {
			osilator.type = "triangle";
			osilator.frequency.setValueAtTime(1000, context.currentTime);
			osilator.connect(analyser);
			analyser.connect(scriptPro);
			scriptPro.connect(gain);
			gain.connect(context.destination);
			scriptPro.onaudioprocess = function (event) {
				let fp = event.inputBuffer.getChannelData(0).slice(0, 10).toString();
				resolve(fp);
			};
			osilator.start(0);
			setTimeout(() => {
				osilator.stop();
				context.close();
			}, 500);
		});
	}
	
	async Detect(){
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		ctx.textBaseline = "top";
		ctx.font = "14px Arial";
		ctx.fillText("Fingerprint", 2, 2);
		this.hasil['canvas'] = canvas.toDataURL();
		
		this.hasil['webgl'] = await this.GpuInfo();
		
		this.hasil['audio'] = await this.AudioInfo();
		
		this.hasil['indexDB'] = !!window.indexedDB;
		this.hasil['local_storage'] = !!window.localStorage;
		this.hasil['session_storage'] = !!window.sessionStorage;
		this.hasil['cookie_status'] = navigator.cookieEnabled;
		
		// this.hasil['devicemotion'] = false
		// this.hasil['deviceorientation'] = false
		// window.addEventListener("devicemotion", () => this.hasil['devicemotion'] = true);
		// window.addEventListener("deviceorientation", () => this.hasil['deviceorientation'] = true);
		
		this.hasil['font'] = this.fonts.filter(font => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			ctx.font = `14px ${font}`
			return ctx.measureText("test").width > 0;
		});
		
		this.hasil['plugins'] = Array.from(navigator.plugins).map(p => p.name);
		this.hasil['audio_input'] = 0
		this.hasil['vidio_input'] = 0;
		if (navigator.mediaDevices){
			const devices = await navigator.mediaDevices.enumerateDevices();
			this.hasil['audio_input'] = devices.filter(d => d.kind === 'audioinput').length;
			this.hasil['vidio_input'] = devices.filter(d => d.kind === 'videoinput').length;
		}
		this.hasil['user-agent'] = navigator.userAgent;
		this.hasil['platform'] = navigator.platform;
		this.hasil['timezone'] = Intl.DateTimeFormat().resolvedOptions().timezone;
		this.hasil['timezone_offset'] = new Date().getTimezoneOffset();
		this.hasil['language'] = navigator.language;
		this.hasil['screen_res'] = `${screen.width}x${screen.height}`;
		this.hasil['color_depth'] = screen.colorDepth;
		this.hasil['hardware_concurrency'] = navigator.hardwareConcurrency;
		this.hasil['memory'] = navigator.deviceMemory || "unknown";
		this.hasil['touch_support'] = "ontouchstart" in window;
		this.hasil['dnt'] = navigator.doNotTrack || "unknown"
		return btoa(JSON.stringify(this.hasil));
	}
}