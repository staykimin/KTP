import traceback
class Ext:
	def __init__(kimin, **parameter):
		kimin.parameter = parameter
	
	def GetTime(kimin, format="%H:%M:%S"):
		return {"status":True, "data":kimin.parameter['loader'].Load('datetime').datetime.now().strftime(format)} if 'loader' in kimin.parameter else {"status":False, "error":"Modul datetime Tidak Ada"}
	
	def CekFile(kimin, path):
		return {"status":True, "data":kimin.parameter['loader'].Load('os').path.exists(path)} if 'loader' in kimin.parameter else {"status":False, 'error':"modul os Tidak Ada"}
	
	def IsBase64(kimin, data):
		if len(data) %4 != 0:
			return False
		
		patern = kimin.modul['re'].compile(r'^[A-Za-z0-9+/]+={0,2}$')
		if not patern.match(data):
			return False
		
		try:
			tmp = kimin.modul['base64'].b64decode(data, validate=True)
			return True
		except Exception as e:
			return False
	
	def ParseJSON(kimin, data):
		hasil = {"status":False}
		if 'loader' in kimin.parameter:
			json = kimin.parameter['loader'].Load('json')
			try:
				hasil['data'] = json.loads(data)
				hasil['status'] = True
			except json.JSONDecodeError:
				hasil['data'] = data
		return hasil
	
	def File2B64(kimin, base="./db/foto", **parameter):
		hasil = {"status":False}
		try:
			path = f"{base}/{parameter['filename']}"
			if kimin.modul['os'].path.exists(path):
				with open(path, 'rb') as dataku:
					data = dataku.read()
				hasil['data'] = kimin.modul['base64'].b64encode(data).decode('UTF-8')
				hasil['status'] = True
		except Exception as e:
			hasil['error'] = e
		return hasil
	
	def B642File(kimin, **parameter):
		if parameter['tipe'] == 'img':
			data = kimin.modul['base64'].b64decode(parameter['data'].split(",")[-1])
		with open(parameter['path'], 'wb') as dataku:
			dataku.write(data)
		
	def TeleNotif(kimin, **parameter):
		try:
			data = {"chat_id":parameter['chat_id'], 'text':parameter['text']}
			kimin.modul['Driver'].post(f"https://api.telegram.org/bot{parameter['token']}/sendMessage", data=data)
		except Exception as e:
			kimin.Log("error notif")
	
	def Log(kimin, base_path):
		if 'loader' in kimin.parameter:
			os = kimin.parameter['loader'].Load('os')
			path = f"{base_path}/log"
			file = kimin.CekFile(path)
			if file['status'] and not file['data']:
				os.makedirs(path)
			elif file['status'] and 'error' in file:
				return file
			
			tb = traceback.format_exc()
			path = f"{path}/{kimin.GetTime('%d-%m-%Y')['data']}.log"
			data = f"{[kimin.GetTime()['data']]} Error : {tb}"
			x = kimin.MakeFile(path, mode='a', encoding='UTF-8', data=data)
			x['log'] = tb
			return x
		# return False
			

	def MakeFile(kimin, path, **parameter):
		tipe, mode, encoding, data = parameter.get("tipe", "min"), parameter.get("mode", "w"), parameter.get("encoding", None), parameter.get("data", "")
		hasil= {"status":False}
		try:
			if encoding:
				with open(path, mode, encoding=encoding) as dataku:
					if tipe == 'min':
						dataku.write(data)
					elif tipe == 'json':
						kimin.modul['json'].dump(data, dataku, indent=parameter.get('indent', 4))
					elif tipe == 'json-str':
						dataku.write(f"{kimin.modul['json'].dumps(data)}\n")
					else:
						hasil['error'] = f'Mode "{mode}" tidak tersedia'
						return hasil
			else:
				with open(path, mode) as dataku:
					if tipe == 'min':
						dataku.write(data)
					elif tipe == 'json':
						kimin.modul['json'].dump(data, dataku, indent=parameter.get('indent', 4))
					elif tipe == 'json-str':
						dataku.write(f"{kimin.modul['json'].dumps(data)}\n")
					else:
						hasil['error'] = f'Mode "{mode}" tidak tersedia'
						return hasil
			hasil['status'], hasil['data'] = True, path
		except kimin.modul['json'].decoder.JSONDecodeError:
			hasil['error'] = "Format Json Bermasalah"
		except Exception as e:
			hasil['error'] = str(e)
		return hasil
	
	def ReadFile(kimin, path, **parameter):
		tipe, mode, output = parameter.get('tipe', 'min'), parameter.get('mode', 'r'), parameter.get('output', 'text')
		hasil = {"status":False}
		if not 'loader' in kimin.parameter:
			raise ValueError("Loader Tidak Valid")
		os = kimin.parameter['loader'].Load('os')
		json = kimin.parameter['loader'].Load('json')
		if tipe == 'min':
			if os.path.exists(path):
				allow = ['r', 'rb', 'r+']
				if mode in allow:
					try:
						with open(path, mode) as dataku:
							if output == 'text':
								hasil['data'] = dataku.read()
							elif output == 'list':
								hasil['data'] = dataku.read().splitlines()
						hasil['status'] = True
					except Exception as e:
						hasil['error'] = str(e)
				else:
					hasil['error'] = f'mode "{mode}" tidak tersedia'
			else:
				hasil['error'] = f'file "{path}" tidak ditemukan'
		
		elif tipe == 'json':
			if os.path.exists(path):
				allow = ['r']
				if mode in allow:
					try:
						with open(path, mode, encoding='UTF-8') as dataku:
							hasil['data'] = json.loads(dataku.read())
						hasil['status'] = True
					except Exception as e:
						hasil['error'] = str(e)
				else:
					hasil['error'] = f'mode "{mode}" tidak tersedia'
			else:
				hasil['error'] = f'file "{path}" tidak ditemukan'
				
		elif tipe == 'json-str':
			if os.path.exists(path):
				allow = ['r']
				if mode in allow:
					try:
						with open(path, mode) as dataku:
							hasil['data'] = dataku.read().splitlines()
						hasil['data'] = [json.loads(i) for i in hasil['data']]
						hasil['status'] = True
					except Exception as e:
						hasil['error'] = str(e)
				else:
					hasil['error'] = f'mode "{mode}" tidak tersedia'
			else:
				hasil['error'] = f'file "{path}" tidak ditemukan'
		return hasil
			
		