class Driver:
	def __init__(kimin, modul, **parameter):
		kimin.parameter = parameter
		kimin.modul = modul
		kimin.client = kimin.modul['httpx'].AsyncClient()
		kimin.hasil = {'status':False}
	
	async def Parse(kimin, respon):
		content_type = respon.headers.get("Content-Type", "")
		if "image" in content_type or "video" in content_type:
			return respon.content
		try:
			return respon.json()
		except kimin.modul['json'].JSONDecodeError:
			return respon.text
	
	async def Execute(kimin):
		try:
			method, url = kimin.parameter.get("method", 'get').lower(), kimin.parameter.get('url')
			files = kimin.parameter.get("file", None)
			if not url:
				kimin.hasil['error'] = 'Url Tidak Boleh Kosong'
				return kimin.hasil
			
			if method in ['get', 'post', 'patch']:
				tipe = kimin.parameter.get('data_type', 'form').lower()
				data = kimin.parameter.get('data', {})
				params = {
					"method":method,
					"url":url,
					"headers":kimin.parameter.get('header', {}),
					"cookies":kimin.parameter.get('cookie', {}),
					"timeout":kimin.parameter.get('timeout', 10),
					"params":kimin.parameter.get('params', {})
				}
				# if method  == 'get':
					# params["allow_redirects"] = kimin.parameter.get('redirect', True)
				
				if method in ['post', 'patch']:
					if tipe == 'json':
						params['json'] = data
					elif tipe == 'form':
						params['data'] = data
					else:
						kimin.hasil['error'] = f'data_type "{tipe}" Tidak Tersedia'
						return kimin.hasil
					if files:
						params['files'] = files
				respon = await kimin.client.request(**params)
			else:
				kimin.hasil['error'] = f'method "{method}" Tidak Tersedia'
				return kimin.hasil
			if respon.status_code < 400:
				parse = await kimin.Parse(respon)
			else:
				parse = respon.text
			kimin.hasil.update({
				"status":True,
				"content":await kimin.Parse(respon) if respon.status_code < 400 else respon.text,
				"status_code":respon.status_code,
				"header":dict(respon.headers),
				"cookie":respon.cookies
				
			})
		except kimin.modul['httpx'].TimeoutException:
			kimin.hasil['error'] = 'Request Timeout'
		except kimin.modul['httpx'].RequestError as e:
			kimin.hasil['error'] = f"Gagal Menghubungi Server!!\nError : {str(e)}"
		return kimin.hasil