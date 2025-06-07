import random, hashlib, time, json, re
class API_Handler:
	def __init__(kimin, loader, **parameter):
		kimin.loader, kimin.parameter = loader, parameter
		kimin.static_key = 'KID@HAYCHAT'
	
	def _GetToken(kimin):
		now = kimin.modul['datetime'].datetime.now()
		now = now.strftime("%d-%m-%Y %H:%M")
		return hashlib.sha256(str(f"{kimin.static_key}||{now}").encode()).hexdigest()
	
	async def _PayloadType(kimin, request):
		try:
			data = await request.json()
			return data
		except Exception:
			return False
	
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
			gid = request.cookies.get('gid')
			fi_json = kimin.loader.Load('f_json')
			if not gid:
				return fi_json(
					content={"message":"Terdeteksi Aktivitas Mencurigakan", "status":False},
					status_code=429
				)
			
			data = await kimin._PayloadType(request)
			if not data:
				return hasil
			
			params, header = dict(request.query_params), dict(request.headers)
			if not 'HI' in header or not isinstance(header['HI'], str):
				return hasil
			
			if not 'csrf' in data or isinstance(data['csrf'], str):
				return hasil
			
			uuid = kimin.loader.Load('uuid')
			hashlib = kimin.loader.Load('hashlib')
			time = kimin.loader.Load('time')
			redis = kimin.loader.Load('db_redis')
			base64 = kimin.loader.Load('base64')
			enkripsi = kimin.loader.Load('enc')
			json = kimin.loader.Load('json')
			ext = kimin.loader.Load('ext')
			security = kimin.loader.Load('secure_request')
			if mode == 'access' and 'sig' in data and 'hkey' in data and isinstance(data['hkey'], str) and isinstance(data['sig'], str):
				db = await redis.GetData(redis=kimin.parameter['temp_func']['redis']['req'], kunci=gid)
				if not db:
					return hasil
				db = json.loads(db)
				
				if not db['token'] == data['sig'] or db['csrf'] == data['csrf']:
					return hasil
				
				token = str(uuid.uuid4())
				id = hashlib.sha256(f"{hashlib.sha256(kimin.parameter['cfg']['server']['secret_key'].encode()).hexdigest()}<kimin>{header['HI']}".encode()).hexdigest()
				secret = hashlib.sha256(f"{time.time()}{token}<kimin>{id}".encode()).hexdigest()
				db['secret'] = secret
				db['req_id'] = id
				secret = json.dumps({"s":base64.b64encode(secret.encode()), "req_id":id})
				enc = await enkripsi(loader=kimin.loader).E2EEnc(kunci=data['hkey'], data=secret)
				if not enc['status']:
					return hasil
				
				hasil['status'] = enc['status']
				if hasil['status']:
					db = json.dumps(db)
					await redis.SetData(redis=kimin.parameter['temp_func']['redis']['req'], data=[{gid:db, "exp":3600}])
					hasil['data'] = enc['data']
			
			
			elif mode == 'gkeys' and 'sig' in data and 'hkey' in data and isinstance(data['hkey'], str) and isinstance(data['sig'], str):
				db = await redis.GetData(redis=kimin.parameter['temp_func']['redis']['req'], kunci=gid)
				if not db:
					return hasil
				
				db = json.loads(db)
				if not db['secret'] == data['sig'] or db['csrf'] == data['csrf']:
					return hasil
				
				tmp = await enkripsi(loader=kimin.loader).AES256Dec(password=db['secret'], data=data['sig'])
				if not tmp['status']:
					return hasil
				
				akhir = ext(loader=kimin.loader).ParseJSON(str(tmp['data']))
				if not akhir['status']:
					return hasil

				if db['secret'] == base64.b64decode(akhir['data']['secret']).decode('utf-8') and db['req_id'] == akhir['data']['req_id']:
					token = str(uuid.uuid4())
					id = hashlib.sha256(f"{hashlib.sha256(kimin.parameter['cfg']['server']['secret_key'].encode()).hexdigest()}<kimin>{header['HI']}<IsValid>{base64.b64decode(akhir['data']['secret']).decode('utf-8')}".encode()).hexdigest()
					secret = hashlib.sha256(f"{time.time()}{token}<kimin>{id}".encode()).hexdigest()
					secret = json.dumps({"s":base64.b64encode(secret.encode()), "req_id":id})
					enc = await enkripsi(loader=kimin.loader).E2EEnc(kunci=data['hkey'], data=secret)
					if not enc['status']:
						return hasil
					hasil['status'] = enc['status']
					if hasil['status']:
						datetime = kimin.loader.Load('datetime')
						parameter['response'].set_cookie(
							key="h_id",
							value=id,
							httponly=True,
							secure=kimin.parameter['cfg']['server']['https'],
							# samesite='Strict',
							samesite='Lax',
							max_age=3600,
							expires=datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(seconds=3600)
						)
						hasil['data'] = enc['data']
		
		return hasil
