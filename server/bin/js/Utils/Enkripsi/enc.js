export default class Enkripsi {
	constructor(params = {}) {
		this.params = params;
		this.hasil = {"status":false};
	}

	async FingerPrint(){
		const modul = (await import('/static/js/Utils/Fingerprint/fp.js')).default;
		let fp = new modul();
		return await fp.Detect()
	}
	
	async Kunci(params={}){
		const fp = await this.FingerPrint();
		const { Driver } = await import('/static/js/Utils/Driver/HttpRequest/driver.js')
		let respon = new Driver(
			`/api/v1/gkeys?tid=${data['cfg']['csrf'].split("||")[data['cfg']['csrf'].split("||").length-1]}&ac=${data['cfg']['csrf'].split("||")[0]}`, "post", {'Accept': 'application/json', 'Content-Type': 'application/json', "tid":data['cfg']['csrf'].split("||")[data['cfg']['csrf'].split("||").length-1]}, 
			{
				"sig":fp, 
				"csrf":data['cfg']['csrf'].split("||")[0],
				"secret":params['secret'],
				"key":params['kunci'],
				"req_id":params['req_id']
			}
		);
		respon = await respon.Execute();
		this.hasil = respon['data']
		return this.hasil
	}
	
	async Access(){
		const fp = await this.FingerPrint();
		const { Driver } = await import('/static/js/Utils/Driver/HttpRequest/driver.js')
		let respon = new Driver(
			`/api/v1/access?tid=${data['cfg']['csrf'].split("||")[data['cfg']['csrf'].split("||").length-1]}&ac=${data['cfg']['csrf'].split("||")[0]}`, "post", {'Accept': 'application/json', 'Content-Type': 'application/json', "tid":data['cfg']['csrf'].split("||")[data['cfg']['csrf'].split("||").length-1]}, 
			{
				"sig":fp, 
				"csrf":data['cfg']['csrf'].split("||")[0]}
		);
		respon = await respon.Execute();
		this.hasil = respon['data']
		return this.hasil;
	}
	
	
	async decryptRSA(encryptedDataBase64, privateKeyBase64, mode="pem") {
		// Konversi private key dari Base64 ke teks PEM
		const privateKeyPem = this.Base64Decode(privateKeyBase64);
	
		// Konversi private key RSA dari format PEM ke CryptoKey
		const privateKey = await window.crypto.subtle.importKey(
			"pkcs8",
			mode === "pem" ? this.pemToArrayBuffer(privateKeyPem) : this.base64ToArrayBuffer(privateKeyBase64),
			{
				name: "RSA-OAEP",
				hash: "SHA-256",
			},
			false,
			["decrypt"]
		);

		// Konversi data terenkripsi dari Base64 ke Uint8Array
		const encryptedData = this.base64ToUint8Array(encryptedDataBase64);

		// Dekripsi data dengan private key
		const decryptedBuffer = await window.crypto.subtle.decrypt(
			{ name: "RSA-OAEP" },
			privateKey,
			encryptedData
		);

		return new TextDecoder().decode(decryptedBuffer);
	}
	
	// fungsin untuk konversi Base64 ke ArrayBuffer
	base64ToArrayBuffer(base64) {
		const binaryString = atob(base64);
		const len = binaryString.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes.buffer;
	}

	
	// Fungsi konversi private key dari PEM ke ArrayBuffer
	pemToArrayBuffer(pem) {
		const base64Key = pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
		const binaryKey = atob(base64Key);
		const keyArrayBuffer = new ArrayBuffer(binaryKey.length);
		const keyArray = new Uint8Array(keyArrayBuffer);
		for (let i = 0; i < binaryKey.length; i++) {
			keyArray[i] = binaryKey.charCodeAt(i);
		}
		return keyArrayBuffer;
	}

	// Fungsi dekode Base64 ke string
	Base64Decode(data) {
		return atob(data);
	}

	// Fungsi konversi Base64 ke Uint8Array (untuk data terenkripsi)
	base64ToUint8Array(base64String) {
		const binaryString = atob(base64String);
		const len = binaryString.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes;
	}
	
	async GenKey(){
		const kunci = await window.crypto.subtle.generateKey(
			{
				name: "RSA-OAEP",
				modulusLength: 2048,          // Panjang bit RSA (2048 atau lebih untuk keamanan tinggi)
				publicExponent: new Uint8Array([1, 0, 1]),  // Eksponen publik (65537)
				hash: "SHA-256",              // Algoritma hash yang digunakan
			},
			true,
			["encrypt", "decrypt"]
		);
		
		const publicKey = await window.crypto.subtle.exportKey(
			"spki",
			kunci.publicKey
		);
		const privateKey = await window.crypto.subtle.exportKey(
			"pkcs8",
			kunci.privateKey
		);
		return {
			"public":btoa(String.fromCharCode(...new Uint8Array(publicKey))),
			"private":btoa(String.fromCharCode(...new Uint8Array(privateKey)))
		}
	}
	
	async GetData(pwd, encryptedData){
		try{
			const data = new Uint8Array(atob(encryptedData).split("").map(c => c.charCodeAt(0)));
			const salt = data.slice(0, 16);
			const iv = data.slice(16, 32);
			const encryptedBytes = data.slice(32);
			
			const km = await window.crypto.subtle.importKey("raw", new TextEncoder().encode(pwd), {name:"PBKDF2"}, false, ["deriveKey"]);
			const kunci = await window.crypto.subtle.deriveKey({name:"PBKDF2", salt:salt, iterations:100000, hash:"SHA-256"}, km, {name:"AES-CBC", length:256}, true, ["decrypt"]);
			
			const decryptedData = await window.crypto.subtle.decrypt({name:"AES-CBC", iv:iv}, kunci, encryptedBytes);
			return new TextDecoder().decode(decryptedData);
		} catch(error){
			console.log(`Dekripsi Error : ${error}`);
			return null;
		}
	}
	
	async Encrypt(pwd, data){
		try{
			const salt = crypto.getRandomValues(new Uint8Array(16));
			const iv = crypto.getRandomValues(new Uint8Array(16));
			const km = await window.crypto.subtle.importKey("raw", new TextEncoder().encode(pwd), {name:"PBKDF2"}, false, ["deriveKey"]);
			const kunci = await window.crypto.subtle.deriveKey({name:"PBKDF2", salt:salt, iterations:100000, hash:"SHA-256"}, km, {name:"AES-CBC", length:256}, true, ["encrypt"]);
			const encodeData = new TextEncoder().encode(data);
			const encryptData = await window.crypto.subtle.encrypt({name:"AES-CBC", iv:iv}, kunci, encodeData);
			const hasil = new Uint8Array([...salt, ...iv, ...new Uint8Array(encryptData)]);
			return btoa(String.fromCharCode(...hasil));
		} catch(error){
			console.log(`Enkripsi Error : ${error}`);
			return null;
		}
	}
	// Fungsi utama untuk dekripsi
	async Decrypt() {
		try {
			const kunciBase64 = this.params['c']; // Private key dalam Base64
			const dataBase64 = this.params['s']; // Data terenkripsi dalam Base64
			const data = await this.decryptRSA(dataBase64, kunciBase64);
			this.hasil['data'] = data;
			this.hasil['status'] = true;
		} catch (error) {
			this.hasil['error'] = error
			this.hasil['status'] = false;
		}
		return this.hasil
	}
}
