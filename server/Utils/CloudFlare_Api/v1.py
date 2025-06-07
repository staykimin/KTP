class CF_Control:
	def __init__(kimin, **parameter):
		kimin.parameter = parameter
		if not 'loader' in parameter:
			raise ValueError('Loader Not Defined')
		kimin.loader = parameter['loader']
		kimin.config = {
			"base_url":"https://api.cloudflare.com/client/v4",
			"header":{
				"Authorization":f"Bearer {parameter['token']}",
				"Content-Type":"application/json"
			}
		}
	
	async def GetZoneID(kimin, **parameter):
		hasil = {"status":False}
		if not isinstance(parameter.get('name', ''), str):
			hasil['error'] = 'Parameter "name" Tidak Ada / Tidak Valid'
			return hasil
		driver = kimin.loader.Load('driver')
		try:
			async with driver.AsyncClient() as client:
				respon = await client.get(f"{kimin.config['base_url']}/zones", headers=kimin.config['header'], params={"name": parameter['name']})
				data = respon.json()
				if respon.status_code == 200 and data.get("success") and data["result"]:
					hasil['data'] = data["result"][0]["id"]
					hasil['status'] = True
				return hasil
		except driver.TimeoutException:
			hasil['error'] = 'Tidak Bisa Mengakses Cloudflare'
			return hasil
		except driver.RequestError as e:
			hasil['error'] = f'Bad Gateway\nERROR : {e}'
			return hasil
	
	async def DelDNSRecord(kimin, **parameter):
		hasil = {"status":False}
		if not isinstance(parameter.get('zone_id', ''), str):
			hasil['error'] = 'Parameter "zone_id" Tidak Ada / Tidak Valid'
			return hasil
		if not isinstance(parameter.get('id', ''), str):
			hasil['error'] = 'Parameter "id" Tidak Ada / Tidak Valid'
			return hasil
		
		driver = kimin.loader.Load('driver')
		try:
			async with driver.AsyncClient() as client:
				respon = await client.delete(f"{kimin.config['base_url']}/zones/{parameter['zone_id']}/dns_records/{parameter['id']}", headers=kimin.config['header'])
				data = respon.json()
				if respon.status_code == 200 and data.get("success"):
					hasil['status'] = True
				return hasil
		except driver.TimeoutException:
			hasil['error'] = 'Tidak Bisa Mengakses Cloudflare'
			return hasil
		except driver.RequestError as e:
			if 'log' in kimin.parameter['cfg'] and 'show_log' in kimin.parameter['cfg']['log'] and kimin.parameter['cfg']['log']['show_log']:
				ext = kimin.loader.Load('ext')
				ext(loader=kimin.loader).Log(kimin.parameter['cfg']['log']['path'])
			hasil['error'] = f'Bad Gateway\nERROR : {e}'
			return hasil
		except Exception as e:
			if 'log' in kimin.parameter['cfg'] and 'show_log' in kimin.parameter['cfg']['log'] and kimin.parameter['cfg']['log']['show_log']:
				ext = kimin.loader.Load('ext')
				ext(loader=kimin.loader).Log(kimin.parameter['cfg']['log']['path'])
	
	async def AddDNSRecord(kimin, **parameter):
		hasil = {"status":False}
		if not isinstance(parameter.get('zone_id', ''), str):
			hasil['error'] = 'Parameter "zone_id" Tidak Ada / Tidak Valid'
			return hasil
		if not isinstance(parameter.get('type', ''), str):
			hasil['error'] = 'Parameter "type" Tidak Ada / Tidak Valid'
			return hasil
		if not isinstance(parameter.get('name', ''), str):
			hasil['error'] = 'Parameter "name" Tidak Ada / Tidak Valid'
			return hasil
		if not isinstance(parameter.get('ip_address', ''), str):
			hasil['error'] = 'Parameter "ip_address" Tidak Ada / Tidak Valid'
			return hasil
		if not isinstance(parameter.get('ttl', ''), int):
			hasil['error'] = 'Parameter "ttl" Tidak Ada / Tidak Valid'
			return hasil
		if not isinstance(parameter.get('proxy', ''), bool):
			hasil['error'] = 'Parameter "proxy" Tidak Ada / Tidak Valid'
			return hasil
		
		data = {
			"type":parameter['type'],
			"name":parameter['name'],
			"content":parameter['ip_address'],
			"ttl":parameter['ttl'],
			"proxied":parameter['proxy']
		}
		
		driver = kimin.loader.Load('driver')
		try:
			async with driver.AsyncClient() as client:
				respon = await client.post(f"{kimin.config['base_url']}/zones/{parameter['zone_id']}/dns_records", headers=kimin.config['header'], json=data)
				data = respon.json()
				if respon.status_code == 200 and data.get("success"):
					hasil['data'] = data["result"]
					hasil['status'] = True
				else:
					hasil['error'] = data['errors']
				return hasil
		except driver.TimeoutException:
			hasil['error'] = 'Tidak Bisa Mengakses Cloudflare'
			return hasil
		except driver.RequestError as e:
			if 'log' in kimin.parameter['cfg'] and 'show_log' in kimin.parameter['cfg']['log'] and kimin.parameter['cfg']['log']['show_log']:
				ext = kimin.loader.Load('ext')
				ext(loader=kimin.loader).Log(kimin.parameter['cfg']['log']['path'])
			hasil['error'] = f'Bad Gateway\nERROR : {e}'
			return hasil
		except Exception as e:
			if 'log' in kimin.parameter['cfg'] and 'show_log' in kimin.parameter['cfg']['log'] and kimin.parameter['cfg']['log']['show_log']:
				ext = kimin.loader.Load('ext')
				ext(loader=kimin.loader).Log(kimin.parameter['cfg']['log']['path'])
		
	async def GetDNSRecord(kimin, **parameter):
		hasil = {"status":False}
		if not isinstance(parameter.get('zone_id', ''), str):
			hasil['error'] = 'Parameter "zone_id" Tidak Ada / Tidak Valid'
			return hasil
		params = {}
		if 'name' in parameter:
			params["name"] = parameter['name']
		if 'type' in parameter:
			params["type"] = parameter['type']
		driver = kimin.loader.Load('driver')
		try:
			async with driver.AsyncClient() as client:
				respon = await client.get(f"{kimin.config['base_url']}/zones/{parameter['zone_id']}/dns_records", headers=kimin.config['header'], params=params)
				data = respon.json()
				if respon.status_code == 200 and data.get("success"):
					hasil['data'] = data["result"]
					hasil['status'] = True
				return hasil
		except driver.TimeoutException:
			hasil['error'] = 'Tidak Bisa Mengakses Cloudflare'
			return hasil
		except driver.RequestError as e:
			if 'log' in kimin.parameter['cfg'] and 'show_log' in kimin.parameter['cfg']['log'] and kimin.parameter['cfg']['log']['show_log']:
				ext = kimin.loader.Load('ext')
				ext(loader=kimin.loader).Log(kimin.parameter['cfg']['log']['path'])
			hasil['error'] = f'Bad Gateway\nERROR : {e}'
			return hasil
		except Exception as e:
			if 'log' in kimin.parameter['cfg'] and 'show_log' in kimin.parameter['cfg']['log'] and kimin.parameter['cfg']['log']['show_log']:
				ext = kimin.loader.Load('ext')
				ext(loader=kimin.loader).Log(kimin.parameter['cfg']['log']['path'])