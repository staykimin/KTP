class API_Handler:
	def __init__(kimin, loader, **parameter):
		kimin.loader, kimin.parameter = loader, parameter
	
	async def _PayloadType(kimin, request):
		try:
			data = await request.json()
			return data
		except Exception:
			if 'log' in kimin.parameter['cfg'] and 'show_log' in kimin.parameter['cfg']['log'] and kimin.parameter['cfg']['log']['show_log']:
				ext = kimin.loader.Load('ext')
				ext(loader=kimin.loader).Log(kimin.parameter['cfg']['log']['path'])
			return False
	
	async def _ReloadNginx(kimin):
		process = kimin.loader.Load('subprocess')
		try:
			cmd = {
				"args":["nginx", "-s", "reload"],
				"capture_output":True,
				"text":True,
				"timeout":5
			}
			reload_proc = process.run(**cmd)
			if reload_proc.returncode == 0:
				return True
			
		except Exception as e:
			if 'log' in kimin.parameter['cfg'] and 'show_log' in kimin.parameter['cfg']['log'] and kimin.parameter['cfg']['log']['show_log']:
				ext = kimin.loader.Load('ext')
				ext(loader=kimin.loader).Log(kimin.parameter['cfg']['log']['path'])
		return False
	
	async def _GenNginx(kimin, **parameter):
		os = kimin.loader.Load('os')
		sites_enabled = "/etc/nginx/sites-enabled"
		conf_file = f"{parameter['id']}.conf"
		path_enabled = os.path.join(sites_enabled, conf_file)
		
		config_content = f"""\
server {{
	listen 80;
	server_name {parameter['domain']}.{kimin.parameter['cfg']['server']['zone_name']};

	return 301 https://$host$request_uri;
}}

server {{
	listen 443 ssl;
	server_name {parameter['domain']}.{kimin.parameter['cfg']['server']['zone_name']};

	ssl_certificate /etc/ssl/certs/cloudflare-origin.pem;
	ssl_certificate_key /etc/ssl/private/cloudflare-origin.key;

	ssl_protocols TLSv1.2 TLSv1.3;
	ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:...'; # Sesuaikan
	ssl_prefer_server_ciphers off;
	ssl_session_timeout 10m;
	ssl_session_cache shared:SSL:10m;
	ssl_session_tickets off;

	ssl_stapling on;
	ssl_stapling_verify on;
	resolver 8.8.8.8 8.8.4.4 valid=300s;
	resolver_timeout 5s;

	location / {{
		proxy_pass http://[{parameter['address']}]:{parameter['port']};
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;

		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";

		proxy_connect_timeout 3s;
		proxy_send_timeout 5s;
		proxy_read_timeout 5s;
		send_timeout 5s;
	}}
}}
"""
		try:
			# Tulis config di sites-available
			with open(path_enabled, "w") as f:
				f.write(config_content)
			return True
		except Exception as e:
			if 'log' in kimin.parameter['cfg'] and 'show_log' in kimin.parameter['cfg']['log'] and kimin.parameter['cfg']['log']['show_log']:
				ext = kimin.loader.Load('ext')
				ext(loader=kimin.loader).Log(kimin.parameter['cfg']['log']['path'])
		return False
	
	async def _GetDetail(kimin, **parameter):
		hasil = {"status":False}
		driver = kimin.loader.Load('driver')
		try:
			async with driver.AsyncClient() as client:
				respon = await client.get(f"http://ip-api.com/json/{parameter['ip']}")
				data = respon.json()
				if respon.status_code == 200:
					hasil['data'] = data
					hasil['status'] = True
				return hasil
		except driver.TimeoutException:
			hasil['error'] = 'Tidak Bisa Mengakses "ip-api"'
			return hasil
		except driver.RequestError as e:
			hasil['error'] = f'Bad Gateway\nERROR : {e}'
			return hasil
	
	def format_bytes(kimin, data):
		if data < 1024:
			return f"{data} B"
		elif data < 1024 ** 2:
			return f"{data / 1024:.2f} KB"
		elif data < 1024 ** 3:
			return f"{data / 1024 ** 2:.2f} MB"
		else:
			return f"{data / 1024 ** 3:.2f} GB"

	async def Execute(kimin, **parameter):
		hasil = {'status':False}
		request = parameter.get('request')
		mode = parameter.get('mode')
		response = parameter.get('response')
		if not mode:
			return hasil
		
		if not response:
			return hasil
		
		if request and request.method == 'POST':
			data = await kimin._PayloadType(request)
			if not data:
				return hasil
			
			if mode == 'gateway':
				if not all(k in data for k in ['req_domain', 'engine', 'port', 'address']):
					return hasil
				
				req_domain = data['req_domain']
				engine = data['engine']
				address = data['address']
				port = data['port']
				if not isinstance(engine.get('name', None), str):
					return hasil
				if not isinstance(req_domain, str) or not req_domain:
					return hasil
				if not isinstance(address, str) or not address:
					return hasil
				if not isinstance(port, (str, int)) or not port:
					return hasil
				if not isinstance(data.get('mode', None), str):
					return hasil
				
				allow_engine = ['yggdrasil', 'frpc']
				if not engine['name'] in allow_engine:
					return hasil
				
				cc = kimin.loader.Load('CC')(loader=kimin.loader, token=kimin.parameter['cfg']['server']['cf_token'])
				process = kimin.loader.Load('subprocess')
				json = kimin.loader.Load('json')
				
				if data['mode'] == 'konek':
					if engine['name'] == 'yggdrasil':
						cmd = {
							"args":["yggdrasilctl", "-json", "getPeers"],
							"capture_output":True,
							"text":True,
							"timeout":5
						}
						node = process.run(**cmd)
						if node.returncode == 0:
							node = json.loads(node.stdout)
							node = [i for i in node['peers'] if i['address'] == address]
							if len(node) == 0:
								hasil['error'] = 'Address Belum Terkoneksi'
								return hasil
							node = node[-1]
						else:
							hasil['error'] = 'Address Belum Terkoneksi'
							return hasil
					else:
						hasil['error'] = 'Engine Not Implemented!'
						return hasil
					
					dns = await cc.GetDNSRecord(zone_id=kimin.parameter['temp_db']['zone_id'], type="A")
					if not dns['status']:
						return hasil
					
					if req_domain in [i['name'].split(f".{kimin.parameter['cfg']['server']['zone_name']}")[0] for i in dns['data']]:
						hasil['error'] = 'Subdomain Already Exists!'
						return hasil
					
					add = await cc.AddDNSRecord(zone_id=kimin.parameter['temp_db']['zone_id'], type="A", name=req_domain, ip_address=kimin.parameter['cfg']['server']['public_ip'], ttl=1, proxy=True)
					if not add['status']:
						return hasil
					config = {"address":address, "port":port, "id":add['data']['id'], 'domain':req_domain}
					config = await kimin._GenNginx(**config)
					if not config:
						hapus = await cc.DelDNSRecord(zone_id=kimin.parameter['temp_db']['zone_id'], id=add['data']['id'])
						hasil['error'] = f'Gagal generate config'
						return hasil
					
					restart = await kimin._ReloadNginx()
					if not restart:
						cmd = {
							"args":["rm", "-rf", f"/etc/nginx/sites-enabled/{add['data']['id']}.conf"],
							"capture_output":True,
							"text":True,
							"timeout":5
						}
						node = process.run(**cmd)
						hapus = await cc.DelDNSRecord(zone_id=kimin.parameter['temp_db']['zone_id'], id=add['data']['id'])
						hasil['error'] = f'Gagal Reload Service!!'
						return hasil
					
					
					hasil['status'] = True
					hasil['data'] = {'url': add['data']['name'], 'detail':node}
					detail = await kimin._GetDetail(ip=node['remote'].split('://')[-1].split(':')[0])
					if detail['status']:
						node['country'] = detail['data']['country']
						node['isp'] = detail['data']['isp']
						node['city'] = detail['data']['city']
					node['bytes_recvd'] = kimin.format_bytes(node['bytes_recvd'])
					node['bytes_sent'] = kimin.format_bytes(node['bytes_sent'])
					node['latency'] = f"{node['latency'] / 1000000:.2f} ms"
					kimin.parameter['temp_db']['node'][node['address']] = {"domain":add['data'], "detail":node}
					return hasil
		
		elif request and request.method == 'GET':
			if not mode == 'gateway':
				return hasil
			process = kimin.loader.Load('subprocess')
			json = kimin.loader.Load('json')
			hasil['data'] = []
			cmd = {
				"args":["yggdrasilctl", "-json", "getPeers"],
				"capture_output":True,
				"text":True,
				"timeout":5
			}
			node = process.run(**cmd)
			if node.returncode == 0:
				node = json.loads(node.stdout)
				node_addr = {i['address'] for i in node['peers']}
				node = {i['address']:i for i in node['peers']}
				konek = [addr for addr in kimin.parameter['temp_db']['node'] if addr in node_addr]
				for i in konek:
					item = kimin.parameter['temp_db']['node'][i]
					item['detail']['bytes_recvd'] = kimin.format_bytes(node[i]['bytes_recvd'])
					item['detail']['bytes_sent'] = kimin.format_bytes(node[i]['bytes_sent'])
					item['detail']['latency'] = f"{node[i]['latency'] / 1000000:.2f} ms"
					hasil['data'].append({
						"domain":item['domain']['name'],
						"country":item['detail'].get('country', 'Tidak Diketahui'),
						"isp":item['detail'].get('isp', 'Tidak Diketahui'),
						'city':item['detail'].get('city', 'Tidak Diketahui'),
						'latency':item['detail']['latency'],
						'bytes_recv':item['detail']['bytes_recvd'],
						'bytes_send':item['detail']['bytes_sent'],
						"uptime":item['detail']['uptime']
					})
			hasil['status'] = True
		
		return hasil
