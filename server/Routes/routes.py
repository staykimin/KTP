from fastapi import Request, WebSocket, Response
import asyncio, signal

class Routes:
	temp_db = {"websocket": {}, 'temp_data':{}}  # Static property
	temp_func = {"redis":{}}
	def __init__(kimin, loader, **parameter):
		kimin.loader, kimin.parameter = loader, parameter
		middle = loader.Load('middle')
		template = loader.Load('template')
		kimin.version = ['v1']
		sesi = kimin.loader.Load('session')
		server = kimin.parameter['server']
		if not hasattr(server, '_session_middlerware'):
			server.add_middleware(sesi, secret_key=kimin.parameter['cfg']['server']['secret_key'])
			server._session_middlerware = True
		
		if not hasattr(server, '_cors_middlerware'):
			server.add_middleware(
				middle,
				allow_origins=["*"],  # Anda bisa mengganti "*" dengan domain ngrok spesifik untuk keamanan
				allow_methods=["*"],
				allow_headers=["*"],
			)
			server._cors_middlerware = True
		
		kimin.parameter['temp_db'] = Routes.temp_db
		kimin.parameter['temp_func'] = Routes.temp_func
		kimin.template = template(directory=kimin.parameter['cfg']['server']['template_path'])
		
		kimin.parameter['server'].add_event_handler("startup", kimin.OnStart)
		kimin.parameter['server'].add_event_handler("shutdown", kimin.OnExit)
		kimin.excluded_header = {
			"connection", "keep-alive", "proxy-authenticate", "proxy-authorization",
			"te", "trailers", "transfer-encoding", "upgrade"
		}
		if not getattr(server, '_middleware_registered', False):
			server._middleware_registered = True
			
			@server.middleware("http")
			async def log_requests(request: Request, call_next):
				driver = kimin.loader.Load('driver')
				urljoin = kill.loader.Load('urljoin')
				path = request.url.path
				url = urljoin(kimin.parameter['cfg']['server']['expose']['url'], path)
				header = {kunci:isi for kunci, isi in request.headers.items()}
				body = await request.body()
				try:
					async with driver.AsyncClient(follow_redirects=True) as client:
						respon = await client.request(
							method=request.method,
							url=url,
							headers=header,
							content=body,
							params=request.query_params,
							cookies=request.cookies,
							timeout=kimin.parameter['cfg']['server']['expose']['timeout']
						)
				except driver.TimeoutException:
					return Response(content=f"Tidak Bisa Mengakses Localhost", status_code=504)
				except driver.RequestError as e:
					if 'log' in kimin.parameter['cfg'] and 'show_log' in kimin.parameter['cfg']['log'] and kimin.parameter['cfg']['log']['show_log']:
						ext = kimin.loader.Load('ext')
						ext(loader=kimin.loader).Log(kimin.parameter['cfg']['log']['path'])
					return Response(content=f"Bad Gateway : {str(e)}", status_code=502)
				except Exception as e:
					if 'log' in kimin.parameter['cfg'] and 'show_log' in kimin.parameter['cfg']['log'] and kimin.parameter['cfg']['log']['show_log']:
						ext = kimin.loader.Load('ext')
						ext(loader=kimin.loader).Log(kimin.parameter['cfg']['log']['path'])
					return Response(content=f"Error Yang Belum Di Handle : {str(e)}", status_code=500)
				respon_header = {kunci:isi for kunci, isi in respon.headers.items() if kunci.lower() not in kimin.excluded_header}
				if 'set-cookie' in respon.headers:
					respon_header['set-cookie'] = respon.headers['set-cookie']
				return Response(content=respon.content, status_code=respon.status_code, headers=respon_header,  media_type=respon.headers.get("content-type"))
	
	async def OnExit(kimin):
		print("Server Dimatikan Secara Normal!!")
		if kimin.parameter['temp_func']['forwarding']['pid'] and kimin.parameter['temp_func']['forwarding']['pid'].poll() is None:
			kimin.parameter['temp_func']['forwarding']['pid'].terminate()
			kimin.parameter['temp_func']['forwarding']['pid'].wait(timeout=5)
	
	async def OnStart(kimin):
		forward = kimin.loader.Load('forwarding')
		if not 'forwarding' in kimin.parameter['temp_func']:
			kimin.parameter['temp_func']['forwarding'] = forward(loader=kimin.loader, cfg=kimin.parameter['cfg'], engine=str(kimin.parameter['cfg']['gateway']['engine'])).Execute()
			await kimin._CheckKoneksi()
			
	
	async def _ToGateway(kimin, **parameter):
		driver = kimin.loader.Load('driver')
		async with driver.AsyncClient(timeout=10) as client:
			parameter['data'] = {i:parameter['data'][i] for i in parameter['data'] if not i == 'pid'}
			parameter['data']['req_domain'] = kimin.parameter['cfg']['gateway']['req_domain']
			parameter['data']['mode'] = 'konek'
			respon = await client.post(f"https://{parameter['url']}/api/v1/gateway", json=parameter['data'])
			respon.raise_for_status()
			hasil = respon.json()
			if 'status' in hasil:
				return hasil
			return False
	
	async def _CheckKoneksi(kimin):
		gateway = []
		for a in kimin.parameter['cfg']['gateway']['peers']:
			try:
				cek = await asyncio.wait_for(kimin._ToGateway(url=a['endpoint'], data=kimin.parameter['temp_func']['forwarding']), timeout=10)
				if cek:
					if not cek['status']:
						print(f"Gagal Konek Ke Gateway : {a['url']} -> {cek['error']}")
						continue
					cek['data']['node'] = a['url']
					gateway.append(cek['data'])
			except Exception as e:
				if 'log' in kimin.parameter['cfg'] and 'show_log' in kimin.parameter['cfg']['log'] and kimin.parameter['cfg']['log']['show_log']:
					ext = kimin.loader.Load('ext')
					ext(loader=kimin.loader).Log(kimin.parameter['cfg']['log']['path'])
					break
		
		if len(gateway) == 0:
			asyncio.create_task(kimin.StopServer(error="Gagal Konek Ke Semua Gateway"))
		else:
			print("="*50)
			print(f"- Peer Address     : {kimin.parameter['temp_func']['forwarding']['public_url']}")
			print(f"- Conneted Gateway : {len(gateway)}")
			print("="*50)
			no = 0
			for i in gateway:
				print(f"- Public Domain {no+1} : {i['url']} -> {i['detail']['latency']}")
				no +=1
				
	async def StopServer(kimin, **parameter):
		await asyncio.sleep(1)
		print(f"Server Dimatikan Paksa!!\nError : {parameter['error']}")
		if kimin.parameter['temp_func']['forwarding']['pid'] and kimin.parameter['temp_func']['forwarding']['pid'].poll() is None:
			kimin.parameter['temp_func']['forwarding']['pid'].terminate()
			kimin.parameter['temp_func']['forwarding']['pid'].wait(timeout=5)
		os = kimin.loader.Load('os')
		os.kill(os.getpid(), signal.SIGTERM)