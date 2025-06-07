from fastapi import Request, WebSocket, Response
import asyncio

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
				allow_origins=["*"],
				allow_methods=["*"],
				allow_headers=["*"],
			)
			server._cors_middlerware = True
		
		kimin.parameter['temp_db'] = Routes.temp_db
		kimin.parameter['temp_func'] = Routes.temp_func
		kimin.template = template(directory=kimin.parameter['cfg']['server']['template_path'])
		kimin.parameter['server'].add_event_handler("startup", kimin.OnStart)
	
	async def OnStart(kimin):
		if not 'zone_id' in kimin.parameter['temp_db']:
			cc = kimin.loader.Load('CC')(loader=kimin.loader, token=kimin.parameter['cfg']['server']['cf_token'])
			id = await cc.GetZoneID(name=kimin.parameter['cfg']['server']['zone_name'])
			if id['status']:
				kimin.parameter['temp_db']['zone_id'] = id['data']
		
		if not 'node' in kimin.parameter['temp_db']:
			kimin.parameter['temp_db']['node'] = {}
			asyncio.create_task(kimin._CronJob())
			
	
	async def _CronJob(kimin):
		process = kimin.loader.Load('subprocess')
		json = kimin.loader.Load('json')
		cc = kimin.loader.Load('CC')(loader=kimin.loader, token=kimin.parameter['cfg']['server']['cf_token'])
		api = kimin.loader.Load('api')
		while True:
			await asyncio.sleep(kimin.parameter['cfg']['server']['interval_check'])
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
				disconnect = [addr for addr in kimin.parameter['temp_db']['node'] if addr not in node_addr]
				for i in disconnect:
					item = kimin.parameter['temp_db']['node'][i]
					dns = await cc.GetDNSRecord(zone_id=kimin.parameter['temp_db']['zone_id'], name=item['domain']['name'])
					if not dns['status']:
						continue
					if len(dns['data']) == 0:
						continue
					hapus = await cc.DelDNSRecord(zone_id=kimin.parameter['temp_db']['zone_id'], id=dns['data'][-1]['id'])
					cmd = {
						"args":["rm", "-rf", f"/etc/nginx/sites-enabled/{dns['data'][-1]['id']}.conf"],
						"capture_output":True,
						"text":True,
						"timeout":5
						}
					proc = process.run(**cmd)
					restart = await api(loader=kimin.loader, **kimin.parameter)._ReloadNginx()
					del kimin.parameter['temp_db']['node'][i]
		
	async def API(kimin, version, mode, request: Request, response: Response):
		hasil = {"status": False}
		api = kimin.loader.Load('api')
		not_found = kimin.loader.Load('404')
		if version in kimin.version:
			return await api(loader=kimin.loader, **kimin.parameter).Execute(request=request, response=response, mode=mode)
		else:
			raise not_found(status_code=404)
		return hasil
	
	async def Home(kimin, request: Request):
		data = {
			"cfg":{
				"title":"KTP",
				"current_page":"home"
			}
		}
		return kimin.template.TemplateResponse("content/home.html", {"request":request, "data":data})
	
	async def Node(kimin, request: Request):
		data = {
			"cfg":{
				"title":"KTP",
				"current_page":"node"
			}
		}
		return kimin.template.TemplateResponse("content/node.html", {"request":request, "data":data})
	