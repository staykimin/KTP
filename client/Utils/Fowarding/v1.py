class Forwarding:
	def __init__(kimin, **parameter):
		kimin.parameter = parameter
		if not 'loader' in parameter:
			raise ValueError("Loader Belum Didefinisikan")
		if not 'engine' in parameter:
			raise ValueError("engine Belum Didefinisikan")
		
		kimin.loader = parameter['loader']
		kimin.cfg = {
			"1":{
				"version":"0.5.12",
				"name":"yggdrasil"
				},
			"2":{
				"version":"0.58",
				"name":"frpc"
			}
		}
	
	def _GetEngine(kimin, **parameter):
		hasil = {"status":False}
		if parameter['engine']['name'] == "yggdrasil":
			hasil['status'] = True
			hasil['data'] = f"https://github.com/yggdrasil-network/yggdrasil-go/releases/download/v{parameter['version']}/{parameter['filename']}.{parameter['ext']}"
		elif parameter['engine']['name'] == "frpc":
			hasil['status'] = True
			hasil['data'] = f"https://github.com/fatedier/frp/releases/download/v{kimin.cfg['version']}/"
		else:
			hasil['error'] = f"Engine '{kimin.parameter['engine']}' Tidak Tersedia"
		return hasil
	
	def _GetPath(kimin, **parameter):
		os = kimin.loader.Load('os')
		path = os.path.join(os.getcwd(), "tmp", f"{parameter['filename']}.{parameter['ext']}")
		return path
	
	def _GetURL(kimin):
		hasil = {"status":False, 'engine':kimin.parameter['engine']}
		tipe = kimin.loader.Load('platform')
		sys_name = tipe.system().lower()
		arch = tipe.machine().lower()
		if 'x86_64' in arch or 'amd64' in arch:
			arch = 'amd64'
		elif 'arm' in arch:
			arch = 'arm64'
		hasil['os_tipe'] = sys_name
		hasil['arch'] = arch
		if hasil['os_tipe'].lower() == 'linux':
			hasil['engine'] = kimin.cfg[hasil['engine']]
			hasil['ext'] = 'deb'
			hasil['name'] = hasil['engine']['name']
			if kimin.parameter['engine'] == "1":
				hasil['version'] = hasil['engine']['version']
				hasil['filename'] = f"yggdrasil-{hasil['version']}-{arch}"
				hasil['url'] = kimin._GetEngine(**hasil)
				hasil['status'] = hasil['url']['status']
				if hasil['url']['status']:
					hasil['url'] = hasil['url']['data']
				else:
					return hasil['url']
			
			elif kimin.parameter['engine'] == "2":
				hasil['version'] = hasil['engine']['version']
				hasil['filename'] = f"frp_{hasil['version']}_linux_{arch}"
				hasil['url'] = kimin._GetEngine(**hasil)
				hasil['status'] = hasil['url']['status']
				if hasil['url']['status']:
					hasil['url'] = hasil['url']['data']
				else:
					return hasil['url']
		
		elif hasil['os_tipe'].lower() == 'windows':
			hasil['ext'] = 'msi'
			hasil['engine'] = kimin.cfg[hasil['engine']]
			hasil['name'] = hasil['engine']['name']
			if kimin.parameter['engine'] == "1":
				hasil['version'] = hasil['engine']['version']
				arch = "".join([i for i in arch if i.isnumeric()])
				arch = "32" if arch == '32' else "86"
				hasil['filename'] = f"yggdrasil-{hasil['version']}-x{arch}"
				hasil['url'] = kimin._GetEngine(**hasil)
				hasil['status'] = hasil['url']['status']
				if hasil['url']['status']:
					hasil['url'] = hasil['url']['data']
				else:
					return hasil['url']
			
			elif kimin.parameter['engine'] == "2":
				hasil['version'] = hasil['engine']['version']
				hasil['filename'] = f"frp_{hasil['version']}_windows_{arch}"
				hasil['url'] = kimin._GetEngine(**hasil)
				hasil['status'] = hasil['url']['status']
				if hasil['url']['status']:
					hasil['url'] = hasil['url']['data']
				else:
					return hasil['url']
		else:
			hasil['error'] = f"Arsitektur '{arch}' Tidak Di Support"
		return hasil
	
	def _Ready(kimin, **parameter):
		os = kimin.loader.Load('os')
		shutil = kimin.loader.Load('shutil')
		if parameter['os_tipe'] == "windows":
			# Cek apakah folder instalasi umum ada
			paths = [
				f"C:\\Program Files\\{parameter['name'].capitalize()}\\yggdrasil.exe",
				f"C:\\Program Files (x86)\\{parameter['name'].capitalize()}\\yggdrasil.exe",
			]
			for path in paths:
				if os.path.exists(path):
					return path
			
			# Tambahan: cek apakah bisa ditemukan via PATH
			found = shutil.which(parameter['name'])
			return found if found else None
		else:
			# Di Linux: cek via which
			found = shutil.which(parameter['name'])
			return found if found else None
	
	def _Install(kimin):
		os = kimin.loader.Load('os')
		requests = kimin.loader.Load('requests')
		process = kimin.loader.Load('subprocess')
		tmp = kimin._GetURL()
		if not tmp['status']:
			return tmp
		
		path = kimin._GetPath(**tmp)
		tmp['app'] = kimin._Ready(**tmp)
		if os.path.exists(path):
			if not tmp['app']:
				if tmp['os_tipe'] == 'windows':
					process.run(['msiexec', '/i', path], check=False)
					tmp['app'] = kimin._Ready(**tmp)
				else:
					process.run(['sudo', 'apt', 'install', '-y', str(path)], check=False)
					tmp['app'] = kimin._Ready(**tmp)
			kimin._GenService(**tmp)
			return tmp
				
		print(f"Download -> Engine {kimin.parameter['engine']}")
		response = requests.get(f"{tmp['url']}")
		with open(path, 'wb') as dataku:
			dataku.write(response.content)
		
		print(f"Download Engine {kimin.parameter['engine']} Sukses!")
		if tmp['os_tipe'] == 'windows':
			process.run(['msiexec', '/i', path], check=False)
			tmp['app'] = kimin._Ready(**tmp)
		else:
			process.run(['sudo', 'apt', 'install', '-y', str(path)], check=False)
			tmp['app'] = kimin._Ready(**tmp)
		kimin._GenService(**tmp)
		return tmp

	def _GenConfig(kimin, **parameter):
		json = kimin.loader.Load('json')
		os = kimin.loader.Load('os')
		path = os.path.abspath(f"./cfg/forwading.json")
		if parameter['engine']['name'] == "yggdrasil":
			if os.path.exists(path):
				return path
			
			config = {
				"IfName": "node1",
				"Listen": [],
				"Peers": [i['url'] for i in kimin.parameter['cfg']['gateway']['peers']],
				"AdminListen": f"tcp://127.0.0.1:{kimin.parameter['cfg']['gateway']['admin_port']}",
				"Interfaces": {
				"FastAPI": {
						"Listen": f"tcp://0.0.0.0:{kimin.parameter['cfg']['server']['port']}",
						"Target": f"127.0.0.1:{kimin.parameter['cfg']['server']['port']}"
					}
				}
			}
			
			with open(path, "w") as f:
				json.dump(config, f, indent=4)
			return path
		return None
	
	def _GenService(kimin, **parameter):
		process = kimin.loader.Load('subprocess')
		time = kimin.loader.Load('time')
		if parameter['os_tipe'] == 'windows':
			kwargs = {
				"args": ['sc', 'stop', 'yggdrasil'],
				"capture_output":True,
				"text":True,
				"timeout":5
			}
			process.run(**kwargs)
			time.sleep(5)
			kwargs = {
				"args": ['sc', 'delete', 'yggdrasil'],
				"capture_output":True,
				"text":True,
				"timeout":5
			}
			process.run(**kwargs)
			process.run(['powershell', '-Command', 'Get-NetAdapter -Name "yggdrasil" | Disable-NetAdapter -Confirm:$false'], capture_output=True, text=True)
			time.sleep(2)
	
		elif parameter['os_tipe'] == 'linux':
			kwargs = {
				"args": ['sudo', 'systemctl', 'stop', 'yggdrasil.service'],
				"capture_output":True,
				"text":True,
				"timeout":5,
			}
			process.run(**kwargs)
			time.sleep(5)
			kwargs = {
				"args": ['sudo', 'systemctl', 'disable', 'yggdrasil.service'],
				"capture_output":True,
				"text":True,
				"timeout":5,
			}
			process.run(**kwargs)
			time.sleep(2)
	
	def _ForceKill(kimin):
		psutil = kimin.loader.Load('psutil')
		for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
			try:
				cmdline = proc.info.get('cmdline') or []
				if isinstance(cmdline, list) and 'yggdrasil' in ' '.join(cmdline).lower():
					proc.kill()
					
			except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
				continue

	def Execute(kimin):
		kimin._ForceKill()
		process = kimin.loader.Load('subprocess')
		json = kimin.loader.Load('json')
		time = kimin.loader.Load('time')
		path = kimin._Install()
		cfg = kimin._GenConfig(**path)
		if cfg and path['app']:
			kwargs = {
				"args": [path['app'], "-useconffile", str(cfg)],
				"stdout": process.DEVNULL,
				"stderr": process.DEVNULL
			}
			if path['os_tipe'] == "windows":
				kwargs["creationflags"] = process.CREATE_NO_WINDOW
			else:
				kwargs["start_new_session"] = True
			hasil = {"pid":process.Popen(**kwargs), 'engine':path['engine']}
			time.sleep(2)
			ctl_args = [
				path['app'].replace("yggdrasil", "yggdrasilctl"),
				f"-endpoint=tcp://127.0.0.1:{kimin.parameter['cfg']['gateway']['admin_port']}",
				"-json",
				"getself"
			]
			ctl_proc = process.run(ctl_args, capture_output=True, text=True, timeout=5)
			if ctl_proc.returncode == 0:
				data = json.loads(ctl_proc.stdout)
				hasil['address'] = data['address']
				hasil['port'] = kimin.parameter['cfg']['server']['port']
				hasil['public_url'] = f"http://[{hasil['address']}]:{hasil['port']}"
			return hasil