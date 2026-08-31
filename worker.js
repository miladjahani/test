const Version = '2026-08-11 14:45:22';
let config_JSON, cacheSOCKS5whitelist = null, debuglog = false;
let SOCKS5whitelist = ['*tapecontent.net', '*cloudatacdn.com', '*loadshare.org', '*cdn-centaurus.com', 'scholar.google.com'];
const Pagesstaticpagepage = 'https://edt-pages.github.io';
const WSdatamaxbytes = 8 * 1024, WSdatamaxheaderlong = Math.ceil(WSdatamaxbytes * 4 / 3) + 4;
const uplinemergetargetbytes = 20 * 1024, uplinequeuemaxbytes = 16 * 1024 * 1024, uplinequeuemaxitems = 4096;
const downstreamGrainbytes = 32 * 1024, downstreamGrainfooterpartthreshold = 512, downstreamGrainlowbytes = Math.max(4096, downstreamGrainfooterpartthreshold * 12), downstreamGrainmax = 4;
let TCPconcurrent_dial = 2, proxyconcurrent_dial = 1, preload = false;
const dictionary = [
	(Proxy.name + "IP").toUpperCase(),
	(String.fromCharCode(67, 109) + URL.name[2] + 'i' + URL.name[0]).toLowerCase(),
	String(2407 * 300 - 10).split('').reverse().join('')
];
export default {
	async fetch(request, env, ctx) {
		let requestURLtext = request.url.replace(/%5[Cc]/g, '').replace(/\\/g, '');
		const requestURL = requestURLtext.indexOf('#');
		const requestURLpartial = requestURL === -1 ? requestURLtext : requestURLtext.slice(0, requestURL);
		if (!requestURLpartial.includes('?') && /%3f/i.test(requestURLpartial)) {
			const requestURLpartial = requestURL === -1 ? '' : requestURLtext.slice(requestURL);
			requestURLtext = requestURLpartial.replace(/%3f/i, '?') + requestURLpartial;
		}
		const url = new URL(requestURLtext);
		const UA = request.headers.get('User-Agent') || 'null';
		const upgradeHeader = (request.headers.get('Upgrade') || '').toLowerCase(), contentType = (request.headers.get('content-type') || '').toLowerCase();
		const admin_password = env.ADMIN || env.admin || env.PASSWORD || env.password || env.pswd || env.TOKEN || env.KEY || env.UUID || env.uuid;
		const encryption_key = env.KEY || 'defaultkey，haslineaddKEYline';
		const userIDMD5 = await MD5MD5(admin_password + encryption_key);
		const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
		const envUUID = env.UUID || env.uuid;
		const userID = (envUUID && uuidRegex.test(envUUID)) ? envUUID.toLowerCase() : [userIDMD5.slice(0, 8), userIDMD5.slice(8, 12), '4' + userIDMD5.slice(13, 16), '8' + userIDMD5.slice(17, 20), userIDMD5.slice(20)].join('-');
		const hosts = env.HOST ? (await array(env.HOST)).map(h => h.toLowerCase().replace(/^https?:\/\//, '').split('/')[0].split(':')[0]) : [url.hostname];
		const host = hosts[0];
		const access_path = url.pathname.slice(1).toLowerCase();
		debuglog = ['1', 'true'].includes(env.DEBUG) || debuglog;
		preload = ['1', 'true'].includes(env.PRELOAD_RACE_DIAL) || preload;
		proxyconcurrent_dial = Math.max(1, Number(env.PROXY_CONCURRENT_DIAL) || proxyconcurrent_dial);
		TCPconcurrent_dial = Math.max(1, Number(env.TCP_CONCURRENT_DIAL) || TCPconcurrent_dial);
		if (!env.TCP_CONCURRENT_DIAL && TCPconcurrent_dial !== 1 && (request) === 'cmcc') TCPconcurrent_dial = 1;
		let defaultproxyIP = (`${request.cf.colo}.${dictionary[0]}.${dictionary[1]}SsSs.nEt`).toLowerCase(), defaultproxy_fallback = true;
		if (env.PROXYIP) {
			const proxyIPs = await array(env.PROXYIP);
			defaultproxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];
			defaultproxy_fallback = false;
		};
		const accessIP = request.headers.get('CF-Connecting-IP') || request.headers.get('True-Client-IP') || request.headers.get('X-Real-IP') || request.headers.get('X-Forwarded-For') || request.headers.get('Fly-Client-IP') || request.headers.get('X-Appengine-Remote-Addr') || request.headers.get('X-Cluster-Client-IP') || 'IP';
		if (cacheSOCKS5whitelist === null) {
			if (env.GO2SOCKS5) SOCKS5whitelist = [...new Set(SOCKS5whitelist.concat(await array(env.GO2SOCKS5)))];
			cacheSOCKS5whitelist = SOCKS5whitelist;
		} else SOCKS5whitelist = cacheSOCKS5whitelist;
		if (access_path === 'version') {// info
			const requestUUID = (url.searchParams.get('uuid') || '').toLowerCase();
			if (uuidRegex.test(requestUUID)) {
				const targetUUID = String(userID).toLowerCase();
				let requestfront8 = 0, targetfront8 = 0;
				for (let i = 0; i < 8; i++) {
					const request = requestUUID.charCodeAt(i);
					requestfront8 += request <= 57 ? request - 48 : request - 87;
					const target = targetUUID.charCodeAt(i);
					targetfront8 += target <= 57 ? target - 48 : target - 87;
				}
				if (requestfront8 === targetfront8 && requestUUID.slice(-12) === targetUUID.slice(-12)) return new Response(JSON.stringify({ Version: Number(String(Version).replace(/\D+/g, '')) }), { status: 200, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
			}
		} else if (admin_password && upgradeHeader === 'websocket') {// WebSocket
			const proxy_context = await proxyparamget(url, userID, defaultproxyIP, defaultproxy_fallback);
			log(`[WebSocket] request: ${url.pathname}${url.search}`);
			return await processWSrequest(request, userID, url, proxy_context);
		} else if (admin_password && !access_path.startsWith('admin/') && access_path !== 'login' && request.method === 'POST') {// gRPC/HTTP
			const proxy_context = await proxyparamget(url, userID, defaultproxyIP, defaultproxy_fallback);
			const { header: localPaddingheader, : localPadding } = getHTTPPadding(userID);
			const HTTP = !!request.headers.get(localPaddingheader) || !!url.searchParams.get(localPadding);
			if (!HTTP && contentType.startsWith('application/grpc')) {
				log(`[gRPC] request: ${url.pathname}${url.search}`);
				return await processgRPCrequest(request, userID, proxy_context);
			}
			log(`[HTTP] request: ${url.pathname}${url.search}`);
			return await processHTTPrequest(request, userID, proxy_context);
		} else {
			if (url.protocol === 'http:') return Response.redirect(url.href.replace(`http://${url.hostname}`, `https://${url.hostname}`), 301);
			if (!admin_password) return fetch(Pagesstaticpagepage + '/noADMIN').then(r => { const headers = new Headers(r.headers); headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate'); headers.set('Pragma', 'no-cache'); headers.set('Expires', '0'); return new Response(r.body, { status: 404, statusText: r.statusText, headers }) });
			if (env.KV && typeof env.KV.get === 'function') {
				const sizeaccess_path = url.pathname.slice(1);
				if (sizeaccess_path === encryption_key && encryption_key !== 'defaultkey，haslineaddKEYline') {
					const params = new URLSearchParams(url.search);
					params.set('token', await MD5MD5(host + userID));
					return new Response('...', { status: 302, headers: { 'Location': `/sub?${params.toString()}` } });
				} else if (access_path === 'login') {//page
					const cookies = request.headers.get('Cookie') || '';
					const authCookie = cookies.split(';').find(c => c.trim().startsWith('auth='))?.split('=')[1];
					if (authCookie == await MD5MD5(UA + encryption_key + admin_password)) return new Response('...', { status: 302, headers: { 'Location': '/admin' } });
					if (request.method === 'POST') {
						const formData = await request.text();
						const params = new URLSearchParams(formData);
						const inputpassword = params.get('password');
						if (inputpassword === (typeof admin_password === 'string' ? admin_password.replace(/[\r\n]/g, '') : admin_password)) {
							const response = new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
							response.headers.set('Set-Cookie', `auth=${await MD5MD5(UA + encryption_key + admin_password)}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Lax`);
							return response;
						}
					}
					return fetch(Pagesstaticpagepage + '/login');
				} else if (access_path.startsWith("admin/api/users")) {
					return manageUsersAPI(env, request, url);
				} else if (access_path === 'admin' || access_path.startsWith('admin/')) {//cookiepage
					const cookies = request.headers.get('Cookie') || '';
					const authCookie = cookies.split(';').find(c => c.trim().startsWith('auth='))?.split('=')[1];
					if (!authCookie || authCookie !== await MD5MD5(UA + encryption_key + admin_password)) return new Response('...', { status: 302, headers: { 'Location': '/login' } });
					if (access_path === 'admin/log.json') {// log
						const readlogcontent = await env.KV.get('log.json') || '[]';
						return new Response(readlogcontent, { status: 200, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
					} else if (sizeaccess_path === 'admin/getCloudflareUsage') {
						try {
							const Usage_JSON = await getCloudflareUsage(url.searchParams.get('Email'), url.searchParams.get('GlobalAPIKey'), url.searchParams.get('AccountID'), url.searchParams.get('APIToken'));
							return new Response(JSON.stringify(Usage_JSON, null, 2), { status: 200, headers: { 'Content-Type': 'application/json' } });
						} catch (err) {
							const errorResponse = { msg: 'queryrequestfailure，failure：' + err.message, error: err.message };
							return new Response(JSON.stringify(errorResponse, null, 2), { status: 500, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
						}
					} else if (sizeaccess_path === 'admin/getADDAPI') {// API
						if (url.searchParams.get('url')) {
							const validatepreferredURL = url.searchParams.get('url');
							try {
								new URL(validatepreferredURL);
								const requestpreferredAPIcontent = await requestpreferredAPI([validatepreferredURL], url.searchParams.get('port') || '443');
								let preferredAPIIP = requestpreferredAPIcontent[0].length > 0 ? requestpreferredAPIcontent[0] : requestpreferredAPIcontent[1];
								preferredAPIIP = preferredAPIIP.map(item => item.replace(/#(.+)$/, (_, remark) => '#' + decodeURIComponent(remark)));
								return new Response(JSON.stringify({ success: true, data: preferredAPIIP }, null, 2), { status: 200, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
							} catch (err) {
								const errorResponse = { msg: 'validatepreferredAPIfailure，failure：' + err.message, error: err.message };
								return new Response(JSON.stringify(errorResponse, null, 2), { status: 500, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
							}
						}
						return new Response(JSON.stringify({ success: false, data: [] }, null, 2), { status: 403, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
					} else if (access_path === 'admin/check') {
						const proxyprotocol = ['socks5', 'http', 'https', 'turn', 'sstp'].find(type => url.searchParams.has(type)) || null;
						if (!proxyprotocol) return new Response(JSON.stringify({ error: 'fewproxyparam' }), { status: 400, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
						const proxyparam = url.searchParams.get(proxyprotocol);
						const startTime = Date.now();
						let detectproxyresponse;
						try {
							const checkParsed = await getSOCKS5account(proxyparam, getproxydefaultport(proxyprotocol));
							const { username, password, hostname, port } = checkParsed;
							const completeproxyparam = username && password ? `${username}:${password}@${hostname}:${port}` : `${hostname}:${port}`;
							try {
								const detect = 'cloudflare.com', detectport = 443, encoder = new TextEncoder(), decoder = new TextDecoder();
								const TCPconnect = createrequestTCPconnect(request);
								let tcpSocket = null, tlsSocket = null;
								try {
									tcpSocket = proxyprotocol === 'socks5'
										? await socks5Connect(detect, detectport, new Uint8Array(0), TCPconnect, checkParsed)
										: proxyprotocol === 'turn'
											? await turnConnect(checkParsed, detect, detectport, TCPconnect)
											: proxyprotocol === 'sstp'
												? await sstpConnect(checkParsed, detect, detectport, TCPconnect)
												: (proxyprotocol === 'https' && isIPHostname(hostname)
													? await httpsConnect(detect, detectport, new Uint8Array(0), TCPconnect, checkParsed)
													: await httpConnect(detect, detectport, new Uint8Array(0), proxyprotocol === 'https', TCPconnect, checkParsed));
									if (!tcpSocket) throw new Error('noneconnectproxy');
									tlsSocket = new TlsClient(tcpSocket, { serverName: detect, insecure: true });
									await tlsSocket.handshake();
									await tlsSocket.write(encoder.encode(`GET /cdn-cgi/trace HTTP/1.1\r\nHost: ${detect}\r\nUser-Agent: Mozilla/5.0\r\nConnection: close\r\n\r\n`));
									let responseBuffer = new Uint8Array(0), headerEndIndex = -1, contentLength = null, chunked = false;
									const maxresponsebytes = 64 * 1024;
									while (responseBuffer.length < maxresponsebytes) {
										const value = await tlsSocket.read();
										if (!value) break;
										if (value.byteLength === 0) continue;
										responseBuffer = concat_bytes(responseBuffer, value);
										if (headerEndIndex === -1) {
											const crlfcrlf = responseBuffer.findIndex((_, i) => i < responseBuffer.length - 3 && responseBuffer[i] === 0x0d && responseBuffer[i + 1] === 0x0a && responseBuffer[i + 2] === 0x0d && responseBuffer[i + 3] === 0x0a);
											if (crlfcrlf !== -1) {
												headerEndIndex = crlfcrlf + 4;
												const headers = decoder.decode(responseBuffer.slice(0, headerEndIndex));
												const statusLine = headers.split('\r\n')[0] || '';
												const statusMatch = statusLine.match(/HTTP\/\d\.\d\s+(\d+)/);
												const statusCode = statusMatch ? parseInt(statusMatch[1], 10) : NaN;
												if (!Number.isFinite(statusCode) || statusCode < 200 || statusCode >= 300) throw new Error(`proxydetectrequestfailure: ${statusLine || 'invalidresponse'}`);
												const lengthMatch = headers.match(/\r\nContent-Length:\s*(\d+)/i);
												if (lengthMatch) contentLength = parseInt(lengthMatch[1], 10);
												chunked = /\r\nTransfer-Encoding:\s*chunked/i.test(headers);
											}
										}
										if (headerEndIndex !== -1 && contentLength !== null && responseBuffer.length >= headerEndIndex + contentLength) break;
										if (headerEndIndex !== -1 && chunked && decoder.decode(responseBuffer).includes('\r\n0\r\n\r\n')) break;
									}
									if (headerEndIndex === -1) throw new Error('proxydetectresponseheaderlonginvalid');
									const response = decoder.decode(responseBuffer);
									const ip = response.match(/(?:^|\n)ip=(.*)/)?.[1];
									const loc = response.match(/(?:^|\n)loc=(.*)/)?.[1];
									if (!ip || !loc) throw new Error('proxydetectresponseinvalid');
									detectproxyresponse = { success: true, proxy: proxyprotocol + "://" + , ip, loc, responseTime: Date.now() - startTime };
								} finally {
									try { tlsSocket ? tlsSocket.close() : await tcpSocket?.close?.() } catch (e) { }
								}
							} catch (error) {
								detectproxyresponse = { success: false, error: error.message, proxy: proxyprotocol + "://" + , responseTime: Date.now() - startTime };
							}
						} catch (err) {
							detectproxyresponse = { success: false, error: err.message, proxy: proxyprotocol + "://" + , responseTime: Date.now() - startTime };
						}
						return new Response(JSON.stringify(detectproxyresponse, null, 2), { status: 200, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
					}

					config_JSON = await readconfig_JSON(env, host, userID, UA);

					if (access_path === 'admin/init') {// configdefault
						try {
							config_JSON = await readconfig_JSON(env, host, userID, UA, true);
							ctx.waitUntil(requestlogrecord(env, request, accessIP, 'Init_Config', config_JSON));
							config_JSON.init = 'configresetdefault';
							return new Response(JSON.stringify(config_JSON, null, 2), { status: 200, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
						} catch (err) {
							const errorResponse = { msg: 'configresetfailure，failure：' + err.message, error: err.message };
							return new Response(JSON.stringify(errorResponse, null, 2), { status: 500, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
						}
					} else if (request.method === 'POST') {// KV （POST ）
						if (access_path === 'admin/config.json') { // saveconfig.jsonconfig
							try {
								const newConfig = await request.json();
								if (!newConfig.UUID || !newConfig.HOST) return new Response(JSON.stringify({ error: 'configcomplete' }), { status: 400, headers: { 'Content-Type': 'application/json;charset=utf-8' } });

								await env.KV.put('config.json', JSON.stringify(newConfig, null, 2));
								ctx.waitUntil(requestlogrecord(env, request, accessIP, 'Save_Config', config_JSON));
								return new Response(JSON.stringify({ success: true, message: 'configsave' }), { status: 200, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
							} catch (error) {
								console.error('saveconfigfailure:', error);
								return new Response(JSON.stringify({ error: 'saveconfigfailure: ' + error.message }), { status: 500, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
							}
						} else if (access_path === 'admin/cf.json') { // savecf.jsonconfig
							try {
								const newConfig = await request.json();
								const CF_JSON = { Email: null, GlobalAPIKey: null, AccountID: null, APIToken: null, UsageAPI: null };
								if (!newConfig.init || newConfig.init !== true) {
									if (newConfig.Email && newConfig.GlobalAPIKey) {
										CF_JSON.Email = newConfig.Email;
										CF_JSON.GlobalAPIKey = newConfig.GlobalAPIKey;
									} else if (newConfig.AccountID && newConfig.APIToken) {
										CF_JSON.AccountID = newConfig.AccountID;
										CF_JSON.APIToken = newConfig.APIToken;
									} else if (newConfig.UsageAPI) {
										CF_JSON.UsageAPI = newConfig.UsageAPI;
									} else {
										return new Response(JSON.stringify({ error: 'configcomplete' }), { status: 400, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
									}
								}

								await env.KV.put('cf.json', JSON.stringify(CF_JSON, null, 2));
								ctx.waitUntil(requestlogrecord(env, request, accessIP, 'Save_Config', config_JSON));
								return new Response(JSON.stringify({ success: true, message: 'configsave' }), { status: 200, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
							} catch (error) {
								console.error('saveconfigfailure:', error);
								return new Response(JSON.stringify({ error: 'saveconfigfailure: ' + error.message }), { status: 500, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
							}
						} else if (access_path === 'admin/tg.json') { // savetg.jsonconfig
							try {
								const newConfig = await request.json();
								if (newConfig.init && newConfig.init === true) {
									const TG_JSON = { BotToken: null, ChatID: null };
									await env.KV.put('tg.json', JSON.stringify(TG_JSON, null, 2));
								} else {
									if (!newConfig.BotToken || !newConfig.ChatID) return new Response(JSON.stringify({ error: 'configcomplete' }), { status: 400, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
									await env.KV.put('tg.json', JSON.stringify(newConfig, null, 2));
								}
								ctx.waitUntil(requestlogrecord(env, request, accessIP, 'Save_Config', config_JSON));
								return new Response(JSON.stringify({ success: true, message: 'configsave' }), { status: 200, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
							} catch (error) {
								console.error('saveconfigfailure:', error);
								return new Response(JSON.stringify({ error: 'saveconfigfailure: ' + error.message }), { status: 500, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
							}
						} else if (sizeaccess_path === 'admin/ADD.txt') { // savecustomIP
							try {
								const customIPs = await request.text();
								await env.KV.put('ADD.txt', customIPs);// save KV
								ctx.waitUntil(requestlogrecord(env, request, accessIP, 'Save_Custom_IPs', config_JSON));
								return new Response(JSON.stringify({ success: true, message: 'customIPsave' }), { status: 200, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
							} catch (error) {
								console.error('savecustomIPfailure:', error);
								return new Response(JSON.stringify({ error: 'savecustomIPfailure: ' + error.message }), { status: 500, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
							}
						} else return new Response(JSON.stringify({ error: 'POSTrequestpath' }), { status: 404, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
					} else if (access_path === 'admin/config.json') {// admin/config.json ，backJSON
						return new Response(JSON.stringify(config_JSON, null, 2), { status: 200, headers: { 'Content-Type': 'application/json' } });
					} else if (sizeaccess_path === 'admin/ADD.txt') {// admin/ADD.txt ，backlocalIP
						let localpreferredIP = await env.KV.get('ADD.txt') || 'null';
						if (localpreferredIP == 'null') localpreferredIP = (await generaterandomIP(request, config_JSON.preferredsubscribegenerate.localIP.randomquantity, config_JSON.preferredsubscribegenerate.localIP.port))[1];
						return new Response(localpreferredIP, { status: 200, headers: { 'Content-Type': 'text/plain;charset=utf-8', 'asn': request.cf.asn } });
					} else if (access_path === 'admin/cf.json') {// CFconfig
						return new Response(JSON.stringify(request.cf, null, 2), { status: 200, headers: { 'Content-Type': 'application/json;charset=utf-8' } });
					}

					ctx.waitUntil(requestlogrecord(env, request, accessIP, 'Admin_Login', config_JSON));
					return fetch(Pagesstaticpagepage + '/admin' + url.search);
				} else if (access_path === 'logout' || uuidRegex.test(access_path)) {//cookiejump_topage
					const response = new Response('...', { status: 302, headers: { 'Location': '/login' } });
					response.headers.set('Set-Cookie', 'auth=; Path=/; Max-Age=0; HttpOnly');
					return response;
				} else if (access_path === 'sub') {
					const subscribeTOKEN = await MD5MD5(host + userID), aspreferredsubscribegenerator = ['1', 'true'].includes(env.BEST_SUB) && url.searchParams.get('host') === 'example.com' && url.searchParams.get('uuid') === '00000000-0000-4000-8000-000000000000' && UA.toLowerCase().includes('tunnel (https://github.com/' + [1] + '/edge');
					const requestTOKEN = url.searchParams.get('token');
					const userrequestsubscribe = requestTOKEN === subscribeTOKEN;
					const current = Math.floor(Date.now() / 86400000);
					const subscription_convertbackTOKENchild = base64SecretEncode(subscribeTOKEN, userID);
					const [subscription_convertbackTOKEN, subscription_convertbackTOKEN] = await Promise.all([
						MD5MD5(subscription_convertbackTOKENchild + current),
						MD5MD5(subscription_convertbackTOKENchild + (current - 1)),
					]);
					const subscription_convertbackrequestsubscribe = requestTOKEN === subscription_convertbackTOKEN || requestTOKEN === subscription_convertbackTOKEN;
					// Check sub-user limits
					const subUserToken = url.searchParams.get("uuid");
					if (subUserToken) {
						const limitCheck = await checkUserLimits(env, subUserToken, 0);
						if (!limitCheck.allowed) {
							return new Response(JSON.stringify({ error: limitCheck.reason }), { status: 403, headers: { "Content-Type": "application/json" } });
						}
					}
					if (userrequestsubscribe || subscription_convertbackrequestsubscribe || aspreferredsubscribegenerator) {
						config_JSON = await readconfig_JSON(env, host, userID, UA);
						if (aspreferredsubscribegenerator) ctx.waitUntil(requestlogrecord(env, request, accessIP, 'Get_Best_SUB', config_JSON, false));
						else ctx.waitUntil(requestlogrecord(env, request, accessIP, 'Get_SUB', config_JSON));
						const ua = UA.toLowerCase();
						const responseHeaders = {
							"content-type": "text/plain; charset=utf-8",
							"Profile-Update-Interval": config_JSON.preferredsubscribegenerate.SUBUpdateTime,
							"Profile-web-page-url": url.protocol + '//' + url.host + '/admin',
							"Cache-Control": "no-store",
						};
						if (config_JSON.CF.Usage.success) {
							const pagesSum = config_JSON.CF.Usage.pages;
							const workersSum = config_JSON.CF.Usage.workers;
							const total = Number.isFinite(config_JSON.CF.Usage.max) ? (config_JSON.CF.Usage.max / 1000) * 1024 : 1024 * 100;
							responseHeaders["Subscription-Userinfo"] = `upload=${pagesSum}; download=${workersSum}; total=${total}; expire=4102329600`; // 2099-12-31 
						}
						const isSubConverterRequest = url.searchParams.has('b64') || url.searchParams.has('base64') || request.headers.get('subconverter-request') || request.headers.get('subconverter-version') || ua.includes('subconverter') || ua.includes(('CF-Workers-SUB').toLowerCase()) || aspreferredsubscribegenerator;
						const subscribetype = isSubConverterRequest
							? 'mixed'
							: url.searchParams.has('target')
								? url.searchParams.get('target')
								: url.searchParams.has('clash') || ua.includes('clash') || ua.includes('meta') || ua.includes('mihomo')
									? 'clash'
									: url.searchParams.has('sb') || url.searchParams.has('singbox') || ua.includes('singbox') || ua.includes('sing-box')
										? 'singbox'
										: url.searchParams.has('surge') || ua.includes('surge')
											? 'surge&ver=4'
											: url.searchParams.has('quanx') || ua.includes('quantumult')
												? 'quanx'
												: url.searchParams.has('loon') || ua.includes('loon')
													? 'loon'
													: 'mixed';

						if (!ua.includes('mozilla')) responseHeaders["Content-Disposition"] = `attachment; filename*=utf-8''${encodeURIComponent(config_JSON.preferredsubscribegenerate.SUBNAME)}`;
						const protocoltype = ((url.searchParams.has('surge') || ua.includes('surge')) && config_JSON.protocoltype !== 'ss') ? 'tro' + 'jan' : config_JSON.protocoltype;
						let subscription_content = '';
						if (subscribetype === 'mixed') {
							const TLSparam = config_JSON.TLS == 'Shadowrocket' ? `&fragment=${encodeURIComponent('1,40-60,30-50,tlshello')}` : config_JSON.TLS == 'Happ' ? `&fragment=${encodeURIComponent('3,1,tlshello')}` : '';
							let completepreferredIP = [], other_nodesLINK = '', proxyIP = [];

							if (!url.searchParams.has('sub') && config_JSON.preferredsubscribegenerate.local) { // local
								const completepreferredlist = config_JSON.preferredsubscribegenerate.localIP.randomIP ? (
									await generaterandomIP(request, config_JSON.preferredsubscribegenerate.localIP.randomquantity, config_JSON.preferredsubscribegenerate.localIP.port)
								)[0] : await env.KV.get('ADD.txt') ? await array(await env.KV.get('ADD.txt')) : (
									await generaterandomIP(request, config_JSON.preferredsubscribegenerate.localIP.randomquantity, config_JSON.preferredsubscribegenerate.localIP.port)
								)[0];
								const preferredAPI = [], preferredIP = [], other_nodes = [];
								for (const element of completepreferredlist) {
									if (element.toLowerCase().startsWith('sub://')) {
										preferredAPI.push(element);
									} else {
										const remarkposition = element.indexOf('#');
										const addresspartial = remarkposition > -1 ? element.slice(0, remarkposition) : element;
										const remarkpartial = remarkposition > -1 ? element.slice(remarkposition) : '';
										const subMatch = element.match(/sub\s*=\s*([^\s&#]+)/i);
										if (subMatch && subMatch[1].trim().includes('.')) {
											const preferredIPasproxyIP = element.toLowerCase().includes('proxyip=true');
											if (preferredIPasproxyIP) preferredAPI.push('sub://' + subMatch[1].trim() + "?proxyip=true" + (.includes('#') ? ('#' + .split('#')[1]) : ''));
											else preferredAPI.push('sub://' + subMatch[1].trim() + (.includes('#') ? ('#' + .split('#')[1]) : ''));
										} else if (addresspartial.toLowerCase().startsWith('https://')) {
											preferredAPI.push(element);
										} else if (addresspartial.toLowerCase().includes('://')) {
											if (element.includes('#')) {
												const addressremark = element.split('#');
												other_nodes.push(addressremark[0] + '#' + encodeURIComponent(decodeURIComponent(addressremark[1])));
											} else other_nodes.push(element);
										} else {
											if (addresspartial.includes('*')) {
												preferredIP.push(replacerandom(addresspartial) + remarkpartial);
											} else preferredIP.push(element);
										}
									}
								}
								const requestpreferredAPIcontent = await requestpreferredAPI(preferredAPI, '443');
								const mergeother_nodesarray = [...new Set(other_nodes.concat(requestpreferredAPIcontent[1]))];
								other_nodesLINK = mergeother_nodesarray.length > 0 ? mergeother_nodesarray.join('\n') + '\n' : '';
								const preferredAPIIP = requestpreferredAPIcontent[0];
								proxyIP = requestpreferredAPIcontent[3] || [];
								completepreferredIP = [...new Set(preferredIP.concat(preferredAPIIP))];
							} else {
								let preferredsubscribegeneratorHOST = url.searchParams.get('sub') || config_JSON.preferredsubscribegenerate.SUB;
								const [preferredgeneratorIParray, preferredgeneratorother_nodes] = await getpreferredsubscribegeneratordata(preferredsubscribegeneratorHOST);
								completepreferredIP = completepreferredIP.concat(preferredgeneratorIParray);
								other_nodesLINK += preferredgeneratorother_nodes;
							}
							const ECHLINKparam = config_JSON.ECH ? `&ech=${encodeURIComponent((config_JSON.ECHConfig.SNI ? config_JSON.ECHConfig.SNI + '+' : '') + config_JSON.ECHConfig.DNS)}` : '';
							const isLoonOrSurge = ua.includes('loon') || ua.includes('surge');
							const { type: transportprotocol, path, domain } = gettransportprotocolconfig(config_JSON);
							subscription_content = other_nodesLINK + completepreferredIP.map(originaladdress => {
								const regex = /^(\[[\da-fA-F:]+\]|[\d.]+|[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*)(?::(\d+))?(?:#(.+))?$/;
								const match = originaladdress.match(regex);

								let node_address, node_port = "443", noderemark;

								if (match) {
									node_address = match[1]; // IPaddressdomain()
									node_port = match[2] ? match[2] : '443'; // portdefault443，SS noTLS
									noderemark = match[3] || node_address; // ,defaultaddress
								} else {
									console.warn(`[subscription_content] IPignore: ${originaladdress}`);
									return null;
								}

								let completenode_path = config_JSON.completenode_path;

								const chainproxymatch = noderemark.match(/\$(socks5|http|https|turn|sstp):\/\/([^#\s]+)/i);
								if (chainproxymatch) {
									try {
										const proxyprotocol = chainproxymatch[1].toLowerCase(), proxyparam = chainproxymatch[2];
										const chainproxydata = { type: proxyprotocol, ...getSOCKS5account(proxyparam, getproxydefaultport(proxyprotocol)) };
										completenode_path = `/video/${base64SecretEncode(JSON.stringify(chainproxydata), userID) + (config_JSON.enable0RTT ? '?ed=2560' : '')}`;
										noderemark = noderemark.replace(chainproxymatch[0], '').trim() || node_address;
									} catch (error) {
										console.warn(`[subscription_content] chainproxyparsefailure，ignore: ${chainproxymatch[0]} (${error && error.message ? error.message : error})`);
									}
								} else if (proxyIP.length > 0) {
									const matchproxyIP = proxyIP.find(p => p.includes(node_address));
									if (matchproxyIP) completenode_path = (`${config_JSON.PATH}/proxyip=${matchproxyIP}`).replace(/\/\//g, '/') + (config_JSON.enable0RTT ? '?ed=2560' : '');
								}
								if (isLoonOrSurge) completenode_path = completenode_path.replace(/,/g, '%2C');

								if (protocoltype === 'ss' && !aspreferredsubscribegenerator) {
									if (!config_JSON.SS.TLS) {
										const TLSport = [443, 2053, 2083, 2087, 2096, 8443];
										const NOTLSport = [80, 2052, 2082, 2086, 2095, 8080];
										node_port = String(NOTLSport[TLSport.indexOf(Number(node_port))] ?? node_port);
									}
									completenode_path = (completenode_path.includes('?') ? completenode_path.replace('?', '?enc=' + config_JSON.SS.encrypted + '&') : (completenode_path + '?enc=' + config_JSON.SS.encrypted)).replace(/([=,])/g, '\\$1');
									if (!isSubConverterRequest) completenode_path = completenode_path + ';mux=0';
									return `${protocoltype}://${btoa(config_JSON.SS. + ':00000000-0000-4000-8000-000000000000')}@${node_address}:${node_port}?plugin=v2${encodeURIComponent('ray-plugin;mode=websocket;host=example.com;path=' + (config_JSON.path ? path(node_path) : node_path) + (config_JSON.SS.TLS ? ';tls' : '')) + ECHLINK + TLS}#${encodeURIComponent()}`;
								} else {
									const transportpathparam = gettransportpathparam(config_JSON, completenode_path, aspreferredsubscribegenerator);
									return `${protocoltype}://00000000-0000-4000-8000-000000000000@${node_address}:${node_port}?security=tls&type=${protocol + ECHLINK}&${domain}=example.com&fp=${config_JSON.Fingerprint}&sni=example.com&${path}=${encodeURIComponent(path) + TLS}&encryption=none#${encodeURIComponent()}`;
								}
							}).filter(item => item !== null).join('\n');
						} else { // subscription_convert
							const subscription_convertURL = `${config_JSON.subscription_convertconfig.SUBAPI}/sub?target=${subscribetype}&url=${encodeURIComponent(url.protocol + '//' + url.host + '/sub?target=mixed&token=' + subscription_convertTOKEN + '&cnIspCode=' + (request) + (url.searchParams.has('sub') && url.searchParams.get('sub') != '' ? `&sub=${url.searchParams.get('sub')}` : ''))}&config=${encodeURIComponent(config_JSON.subscription_convertconfig.SUBCONFIG)}&emoji=${config_JSON.subscription_convertconfig.SUBEMOJI}&list=${config_JSON.subscription_convertconfig.SUBLIST}&scv=${config_JSON.skip}&xudp=${config_JSON.subscription_convertconfig.XUDP}&udp=${config_JSON.subscription_convertconfig.UDP}&tls13=${config_JSON.subscription_convertconfig.TLS13}&append_type=${config_JSON.subscription_convertconfig.APPEND_TYPE}&sort=${config_JSON.subscription_convertconfig.SORT}`;
							try {
								const response = await fetch(subscription_convertURL, { headers: { 'User-Agent': 'Subconverter for ' + subscribetype + ' edge' + 'tunnel (https://github.com/' + [1] + '/edge' + 'tunnel)' } });
								if (response.ok) {
									subscription_content = await response.text();
									if (url.searchParams.has('surge') || ua.includes('surge')) subscription_content = Surgesubscribeconfig(subscription_content, url.protocol + '//' + url.host + '/sub?token=' + TOKEN + '&surge', config_JSON);
								} else return new Response('subscription_convertback：' + response.statusText, { status: response.status });
							} catch (error) {
								return new Response('subscription_convertback：' + error.message, { status: 403 });
							}
						}

						if (!ua.includes('subconverter') && userrequestsubscribe) {
							const backHOSTS = [...config_JSON.HOSTS].sort(() => Math.random() - 0.5);
							let replacedomain = 0, currentrandomHOST = null;
							subscription_content = subscription_content
								.replace(/00000000-0000-4000-8000-000000000000/g, config_JSON.UUID)
								.replace(/MDAwMDAwMDAtMDAwMC00MDAwLTgwMDAtMDAwMDAwMDAwMDAw/g, btoa(config_JSON.UUID))
								.replace(/example\.com/g, () => {
									if (replacedomain % 2 === 0) {
										const originalhost = backHOSTS[Math.floor(replacedomain / 2) % backHOSTS.length];
										currentrandomHOST = replacerandom(originalhost);
									}
									replacedomain++;
									return currentrandomHOST;
								});
						}

						if (subscribetype === 'mixed' && (!ua.includes('mozilla') || url.searchParams.has('b64') || url.searchParams.has('base64'))) subscription_content = btoa(subscription_content);

						if (subscribetype === 'singbox') {
							subscription_content = await Singboxsubscribeconfig(subscription_content, config_JSON);
							responseHeaders["content-type"] = 'application/json; charset=utf-8';
						} else if (subscribetype === 'clash') {
							subscription_content = Clashsubscribeconfig(subscription_content, config_JSON);
							responseHeaders["content-type"] = 'application/x-yaml; charset=utf-8';
						}
						return new Response(subscription_content, { status: 200, headers: responseHeaders });
					}
				} else if (access_path === 'locations') {//locations
					const cookies = request.headers.get('Cookie') || '';
					const authCookie = cookies.split(';').find(c => c.trim().startsWith('auth='))?.split('=')[1];
					if (authCookie && authCookie == await MD5MD5(UA + encryption_key + admin_password)) return fetch(new Request('https://speed.cloudflare.com/locations', { headers: { 'Referer': 'https://speed.cloudflare.com/' } }));
				} else if (access_path === 'robots.txt') return new Response('User-agent: *\nDisallow: /', { status: 200, headers: { 'Content-Type': 'text/plain; charset=UTF-8' } });
			} else if (!envUUID) return fetch(Pagesstaticpagepage + '/noKV').then(r => { const headers = new Headers(r.headers); headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate'); headers.set('Pragma', 'no-cache'); headers.set('Expires', '0'); return new Response(r.body, { status: 404, statusText: r.statusText, headers }) });
		}

		let disguisepageURL = env.URL || 'nginx';
		if (disguisepageURL && disguisepageURL !== 'nginx' && disguisepageURL !== '1101') {
			disguisepageURL = disguisepageURL.trim().replace(/\/$/, '');
			if (!disguisepageURL.match(/^https?:\/\//i)) pageURL = 'https://' + pageURL;
			if (disguisepageURL.toLowerCase().startsWith('http://')) pageURL = 'https://' + pageURL.substring(7);
			try { const u = new URL(disguisepageURL); disguisepageURL = u.protocol + '//' + u.host } catch (e) { pageURL = 'nginx' }
		}
		if (disguisepageURL === '1101') return new Response(await html1101(url.host, accessIP), { status: 200, headers: { 'Content-Type': 'text/html; charset=UTF-8' } });
		try {
			const proxyURL = new URL(disguisepageURL), newrequestheader = new Headers(request.headers);
			newrequestheader.set('Host', proxyURL.host);
			newrequestheader.set('Referer', proxyURL.origin);
			newrequestheader.set('Origin', proxyURL.origin);
			if (!newrequestheader.has('User-Agent') && UA && UA !== 'null') newrequestheader.set('User-Agent', UA);
			const proxyresponse = await fetch(proxyURL.origin + url.pathname + url.search, { method: request.method, headers: newrequestheader, body: request.body, cf: request.cf });
			const contenttype = proxyresponse.headers.get('content-type') || '';
			if (/text|javascript|json|xml/.test(contenttype)) {
				const responsecontent = (await proxyresponse.text()).replaceAll(proxyURL.host, url.host);
				return new Response(responsecontent, { status: proxyresponse.status, headers: { ...Object.fromEntries(proxyresponse.headers), 'Cache-Control': 'no-store' } });
			}
			return proxyresponse;
		} catch (error) { }
		return new Response(await nginx(), { status: 200, headers: { 'Content-Type': 'text/html; charset=UTF-8' } });
	}
};
const HPACKHuffmanlong = [
	13, 23, 28, 28, 28, 28, 28, 28, 28, 24, 30, 28, 28, 30, 28, 28,
	28, 28, 28, 28, 28, 28, 30, 28, 28, 28, 28, 28, 28, 28, 28, 28,
	6, 10, 10, 12, 13, 6, 8, 11, 10, 10, 8, 11, 8, 6, 6, 6,
	5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 7, 8, 15, 6, 12, 10,
	13, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
	7, 7, 7, 7, 7, 7, 7, 7, 8, 7, 8, 13, 19, 13, 14, 6,
	15, 5, 6, 5, 6, 5, 6, 6, 6, 5, 7, 7, 6, 6, 6, 5,
	6, 7, 6, 5, 5, 6, 7, 7, 7, 7, 7, 15, 11, 14, 13, 28,
	20, 22, 20, 20, 22, 22, 22, 23, 22, 23, 23, 23, 23, 23, 24, 23,
	24, 24, 22, 23, 24, 23, 23, 23, 23, 21, 22, 23, 22, 23, 23, 24,
	22, 21, 20, 22, 22, 23, 23, 21, 23, 22, 22, 24, 21, 22, 23, 23,
	21, 21, 22, 21, 23, 22, 23, 23, 20, 22, 22, 22, 23, 22, 22, 23,
	26, 26, 20, 19, 22, 23, 22, 25, 26, 26, 26, 27, 27, 26, 24, 25,
	19, 21, 26, 27, 27, 26, 27, 24, 21, 21, 26, 26, 28, 27, 27, 27,
	20, 24, 20, 21, 22, 21, 21, 23, 22, 22, 25, 25, 24, 24, 26, 23,
	26, 27, 26, 26, 27, 27, 27, 27, 27, 28, 27, 27, 27, 27, 27, 26,
	30
];

function getHTTPPadding(yourUUID) {
	return { header: yourUUID.slice(1, 7), : '_' + yourUUID.slice(25, 31) };
}

function HPACKHuffmanbyteslong(string) {
	const bytes = new TextEncoder().encode(string);
	let = 0;
	for (let i = 0; i < bytes.length; i++) {
		 += HPACKHuffmanlong[bytes[i]];
	}
	return Math.ceil( / 8);
}

function HTTPPadding(request, localPaddingheader, localPadding) {
	const header = request.headers.get(localPaddingheader);
	if (header) {
		try {
			const parseURL = new URL(header, 'https://x.invalid');
			const query = parseURL.searchParams.get(localPadding);
			if (query) return query;
		} catch (e) { }
		return header;
	}
	const requestURL = new URL(request.url);
	return requestURL.searchParams.get(localPadding) || '';
}

function HTTPPadding(request, localPaddingheader, localPadding) {
	const padding = HTTPPadding(request, localPaddingheader, localPadding);
	if (!padding) return true;
	const huffmanlong = HPACKHuffmanbyteslong(padding);
	return huffmanlong >= 98 && huffmanlong <= 1002;
}

const HTTPBase62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
function generateHTTPPadding(long) {
	const long = HTTPBase62.length;
	let result = '';
	for (let i = 0; i < long; i++) {
		result += HTTPBase62[Math.floor(Math.random() * long)];
	}
	return result;
}

async function processHTTPrequest(request, yourUUID, proxy_context = {}) {
	if (!request.body) return new Response('Bad Request', { status: 400 });
	const { header: localPaddingheader, : localPadding } = getHTTPPadding(yourUUID);
	if (!HTTPPadding(request, localPaddingheader, localPadding)) return new Response('Bad Request', { status: 400 });
	const reader = request.body.getReader();
	const first_packet = await readHTTPfirst_packet(reader, yourUUID);
	if (!first_packet) {
		try { reader.releaseLock() } catch (e) { }
		return new Response('Invalid request', { status: 400 });
	}
	if (isSpeedTestSite(first_packet.hostname) && proxy_context.proxytype === null) {
		try { reader.releaseLock() } catch (e) { }
		return new Response(local204response(first_packet.respHeader), {
			status: 200,
			headers: {
				'Content-Type': 'application/octet-stream',
				'X-Accel-Buffering': 'no',
				'Cache-Control': 'no-store'
			}
		});
	}
	if (first_packet.isUDP && first_packet.protocol !== 'trojan' && first_packet.port !== 53) {
		try { reader.releaseLock() } catch (e) { }
		return new Response('UDP is not supported', { status: 400 });
	}

	const responseHeaders = new Headers({
		'Content-Type': 'application/octet-stream',
		'X-Accel-Buffering': 'no',
		'Cache-Control': 'no-store'
	});

	try {
		const responseURL = new URL('https://x.invalid/');
		responseURL.searchParams.set(localPadding, generateHTTPPadding(100 + Math.floor(Math.random() * 901)));
		responseHeaders.set(localPaddingheader, responseURL.toString());
	} catch (e) { }

	if (first_packet.isUDP) return processHTTPUDPrequest(first_packet, reader, request, proxy_context, responseHeaders);

	try { reader.releaseLock() } catch (e) { }

	const remoteConnWrapper = { socket: null, connectingPromise: null, retryConnect: null, downlinkDrain: Promise.resolve() };
	const abortController = new AbortController();
	let cleanup = false;
	const cleanup = (reason) => {
		if (cleanup) return;
		cleanup = true;
		try { abortController.abort(reason) } catch (e) { }
		TCPconnectgeneration(remoteConnWrapper);
	};

	const WS = { readyState: WebSocket.OPEN };

	let socket;
	try {
		socket = await forwardataTCP(first_packet.hostname, first_packet.port, first_packet.rawData, WS, first_packet.respHeader, remoteConnWrapper, yourUUID, request, proxy_context, first_packet.protocol === 'trojan', first_packet.originaldata, true);
	} catch (err) {
		log(`[HTTP-Pipe] connectfailure: ${err?.message || err}`);
		cleanup(err);
		return new Response('bad gateway', { status: 502 });
	}
	if (!socket) {
		cleanup(new Error('socket is null'));
		return new Response('bad gateway', { status: 502 });
	}

	const uplinePromise = (async () => {
		const uplinemerge = createuplineGrainmerge();
		const Promise = uplinemerge.readable.pipeTo(socket.writable, { signal: abortController.signal });
		void Promise.catch(cleanup);
		const uplinereader = request.body.getReader();
		const canceluplinereader = () => {
			try { uplinereader.cancel(abortController.signal.reason).catch(() => { }); } catch (e) { }
		};
		abortController.signal.addEventListener('abort', canceluplinereader, { once: true });
		try {
			try {
				while (true) {
					const { done, value } = await uplinereader.read();
					if (done) break;
					if (value?.byteLength) await uplinemerge.write(value);
				}
			} finally {
				abortController.signal.removeEventListener('abort', canceluplinereader);
				try { uplinereader.releaseLock() } catch (e) { }
			}
		} finally {
			try { await uplinemerge.end() } catch (e) { }
		}
		await Promise;
	})();

	const response = typeof IdentityTransformStream !== 'undefined'
		? new IdentityTransformStream()
		: new TransformStream();
	const downstreamPromise = (async () => {
		const writer = response.writable.getWriter();
		try {
			if (validdata_length(first_packet.respHeader) > 0) await writer.write(first_packet.respHeader);
		} catch (error) {
			try { await writer.abort(error) } catch (e) { }
			throw error;
		} finally {
			try { writer.releaseLock() } catch (e) { }
		}
		await socket.readable.pipeTo(response.writable, { signal: abortController.signal });
	})();

	void uplinePromise.catch(cleanup);
	void downstreamPromise.then(() => cleanup(), cleanup);
	void Promise.allSettled([uplinePromise, downstreamPromise]);

	return new Response(response.readable, { status: 200, headers: responseHeaders });
}

function processHTTPUDPrequest(first_packet, reader, request, proxy_context, responseHeaders) {
	const trojanUDPcontext = { cache: new Uint8Array(0), proxyaddress: proxy_context.trojanproxyaddress };
	return new Response(new ReadableStream({
		async start(controller) {
			let close = false;
			let udpRespHeader = first_packet.respHeader;
			const = {
				readyState: WebSocket.OPEN,
				send(data) {
					if (close) return;
					try {
						const chunk = data instanceof Uint8Array
							? data
							: data instanceof ArrayBuffer
								? new Uint8Array(data)
								: ArrayBuffer.isView(data)
									? new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
									: new Uint8Array(data);
						controller.enqueue(chunk);
					} catch (e) {
						close = true;
						this.readyState = WebSocket.CLOSED;
					}
				},
				close() {
					if (close) return;
					close = true;
					this.readyState = WebSocket.CLOSED;
					try { controller.close() } catch (e) { }
				}
			};
			let forwardfailure = false;
			try {
				if (first_packet.protocol === 'trojan') {
					trojanUDPcontext.target = first_packet.hostname;
					trojanUDPcontext.targetport = first_packet.port;
					if (trojanUDPcontext.proxyaddress) await forwardtrojanUDPdata(first_packet.originaldata, , trojanUDPcontext, request);
				}
				if (!(first_packet.protocol === 'trojan' && trojanUDPcontext.proxyaddress) && first_packet.rawData?.byteLength) {
					if (first_packet.protocol === 'trojan') await forwardtrojanUDPdata(first_packet.rawData, , trojanUDPcontext, request);
					else await forwardataudp(first_packet.rawData, , udpRespHeader, request);
					udpRespHeader = null;
				}
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					if (!value || value.byteLength === 0) continue;
					if (first_packet.protocol === 'trojan') await forwardtrojanUDPdata(value, , trojanUDPcontext, request);
					else await forwardataudp(value, , udpRespHeader, request);
					udpRespHeader = null;
				}
			} catch (err) {
				forwardfailure = true;
				log(`[HTTPforward] processfailure: ${err?.message || err}`);
				closeSocketQuietly();
			} finally {
			const trojanUDPproxydownstream = !forwardfailure && first_packet.protocol === 'trojan' && trojanUDPcontext.proxyaddress && trojanUDPcontext.proxySocket;
			if (!trojanUDPproxydownstream) {
				try { trojanUDPcontext.proxySocket?.close() } catch (e) { }
				closeSocketQuietly();
			}
			try { reader.releaseLock() } catch (e) { }
			}
		},
		cancel() {
			try { trojanUDPcontext.proxySocket?.close() } catch (e) { }
			try { reader.releaseLock() } catch (e) { }
		}
	}), { status: 200, headers: responseHeaders });
}

function validdata_length(data) {
	if (!data) return 0;
	if (typeof data.byteLength === 'number') return data.byteLength;
	if (typeof data.length === 'number') return data.length;
	return 0;
}

function TCPconnectgeneration(remoteConnWrapper) {
	if (!remoteConnWrapper) return;
	remoteConnWrapper.generation = (Number.isInteger(remoteConnWrapper.generation) ? remoteConnWrapper.generation : 0) + 1;
	const socket = remoteConnWrapper.socket;
	remoteConnWrapper.socket = null;
	remoteConnWrapper.downlinkController = null;
	remoteConnWrapper.downlinkDrain = Promise.resolve();
	try { socket?.close?.() } catch (e) { }
}

function startTCPconnectgeneration(remoteConnWrapper) {
	if (!Number.isInteger(remoteConnWrapper.generation)) remoteConnWrapper.generation = 0;
	const generation = ++remoteConnWrapper.generation;
	const previousSocket = remoteConnWrapper.socket;
	remoteConnWrapper.socket = null;
	const previousDownlink = remoteConnWrapper.downlinkController;
	remoteConnWrapper.downlinkController = null;
	const previousDrain = remoteConnWrapper.downlinkDrain || Promise.resolve();
	let currentDrain;
	try { currentDrain = previousDownlink?.stoprefresh?.() || Promise.resolve() }
	catch (error) { currentDrain = Promise.reject(error) }
	const downlinkDrain = Promise.all([previousDrain, currentDrain]);
	// Installation awaits this promise; attach a handler immediately in case draining fails before dialing completes.
	downlinkDrain.catch(() => { });
	remoteConnWrapper.downlinkDrain = downlinkDrain;
	try { previousSocket?.close?.() } catch (e) { }
	return { generation, downlinkDrain };
}

async function readHTTPfirst_packet(reader, token) {
	const decoder = vlesstextdecode;

	const parsevlessfirst_packet = (data) => {
		const length = data.byteLength;
		if (length < 18) return { status: 'need_more' };
		if (!UUIDbytesmatch(data, 1, token)) return { status: 'invalid' };

		const optLen = data[17];
		const cmdIndex = 18 + optLen;
		if (length < cmdIndex + 1) return { status: 'need_more' };

		const cmd = data[cmdIndex];
		if (cmd !== 1 && cmd !== 2) return { status: 'invalid' };

		const portIndex = cmdIndex + 1;
		if (length < portIndex + 3) return { status: 'need_more' };

		const port = (data[portIndex] << 8) | data[portIndex + 1];
		const addressType = data[portIndex + 2];
		const addressIndex = portIndex + 3;
		let headerLen = -1;
		let hostname = '';

		if (addressType === 1) {
			if (length < addressIndex + 4) return { status: 'need_more' };
			hostname = `${data[addressIndex]}.${data[addressIndex + 1]}.${data[addressIndex + 2]}.${data[addressIndex + 3]}`;
			headerLen = addressIndex + 4;
		} else if (addressType === 2) {
			if (length < addressIndex + 1) return { status: 'need_more' };
			const domainLen = data[addressIndex];
			if (length < addressIndex + 1 + domainLen) return { status: 'need_more' };
			hostname = decoder.decode(data.subarray(addressIndex + 1, addressIndex + 1 + domainLen));
			headerLen = addressIndex + 1 + domainLen;
		} else if (addressType === 3) {
			if (length < addressIndex + 16) return { status: 'need_more' };
			const ipv6 = [];
			for (let i = 0; i < 8; i++) {
				const base = addressIndex + i * 2;
				ipv6.push(((data[base] << 8) | data[base + 1]).toString(16));
			}
			hostname = ipv6.join(':');
			headerLen = addressIndex + 16;
		} else return { status: 'invalid' };

		if (!hostname) return { status: 'invalid' };

		return {
			status: 'ok',
			result: {
				protocol: 'vl' + 'ess',
				hostname,
				port,
				isUDP: cmd === 2,
				rawData: data.subarray(headerLen),
				respHeader: new Uint8Array([data[0], 0]),
				originaldata: null,
			}
		};
	};

	const parsetrojanfirst_packet = (data) => {
		const passwordhash = sha224(token);
		const passwordhashbytes = new TextEncoder().encode(passwordhash);
		const length = data.byteLength;
		if (length < 58) return { status: 'need_more' };
		if (data[56] !== 0x0d || data[57] !== 0x0a) return { status: 'invalid' };
		for (let i = 0; i < 56; i++) {
			if (data[i] !== passwordhashbytes[i]) return { status: 'invalid' };
		}

		const socksStart = 58;
		if (length < socksStart + 2) return { status: 'need_more' };
		const cmd = data[socksStart];
		if (cmd !== 1 && cmd !== 3) return { status: 'invalid' };
		const isUDP = cmd === 3;

		const atype = data[socksStart + 1];
		let cursor = socksStart + 2;
		let hostname = '';

		if (atype === 1) {
			if (length < cursor + 4) return { status: 'need_more' };
			hostname = `${data[cursor]}.${data[cursor + 1]}.${data[cursor + 2]}.${data[cursor + 3]}`;
			cursor += 4;
		} else if (atype === 3) {
			if (length < cursor + 1) return { status: 'need_more' };
			const domainLen = data[cursor];
			if (length < cursor + 1 + domainLen) return { status: 'need_more' };
			hostname = decoder.decode(data.subarray(cursor + 1, cursor + 1 + domainLen));
			cursor += 1 + domainLen;
		} else if (atype === 4) {
			if (length < cursor + 16) return { status: 'need_more' };
			const ipv6 = [];
			for (let i = 0; i < 8; i++) {
				const base = cursor + i * 2;
				ipv6.push(((data[base] << 8) | data[base + 1]).toString(16));
			}
			hostname = ipv6.join(':');
			cursor += 16;
		} else return { status: 'invalid' };

		if (!hostname) return { status: 'invalid' };
		if (length < cursor + 4) return { status: 'need_more' };

		const port = (data[cursor] << 8) | data[cursor + 1];
		if (data[cursor + 2] !== 0x0d || data[cursor + 3] !== 0x0a) return { status: 'invalid' };
		const dataOffset = cursor + 4;

		return {
			status: 'ok',
			result: {
				protocol: 'trojan',
				hostname,
				port,
				isUDP,
				rawData: data.subarray(dataOffset),
				originaldata: data,
				respHeader: null,
			}
		};
	};

	let buffer = new Uint8Array(1024);
	let offset = 0;

	while (true) {
		const { value, done } = await reader.read();
		if (done) {
			if (offset === 0) return null;
			break;
		}

		const chunk = value instanceof Uint8Array ? value : new Uint8Array(value);
		if (offset + chunk.byteLength > buffer.byteLength) {
			const newBuffer = new Uint8Array(Math.max(buffer.byteLength * 2, offset + chunk.byteLength));
			newBuffer.set(buffer.subarray(0, offset));
			buffer = newBuffer;
		}

		buffer.set(chunk, offset);
		offset += chunk.byteLength;

		const currentdata = buffer.subarray(0, offset);
		const trojanresult = parsetrojanfirst_packet(currentdata);
		if (trojanresult.status === 'ok') return { ...trojanresult.result, reader };

		const vlessresult = parsevlessfirst_packet(currentdata);
		if (vlessresult.status === 'ok') return { ...vlessresult.result, reader };

		if (trojanresult.status === 'invalid' && vlessresult.status === 'invalid') return null;
	}

	const data = buffer.subarray(0, offset);
	const trojanresult = parsetrojanfirst_packet(data);
	if (trojanresult.status === 'ok') return { ...trojanresult.result, reader };
	const vlessresult = parsevlessfirst_packet(data);
	if (vlessresult.status === 'ok') return { ...vlessresult.result, reader };
	return null;
}
async function processgRPCrequest(request, yourUUID, proxy_context = {}) {
	if (!request.body) return new Response('Bad Request', { status: 400 });
	const reader = request.body.getReader();
	const remoteConnWrapper = { socket: null, connectingPromise: null, retryConnect: null, downlinkDrain: Promise.resolve() };
	const connect = () => TCPconnectgeneration(remoteConnWrapper);
	let isDnsQuery = false;
	const trojanUDPcontext = { cache: new Uint8Array(0), proxyaddress: proxy_context.trojanproxyaddress };
	let checkyesnoyestrojan = null;
	let currentwriteSocket = null;
	let remote_writer = null;
	let GRPCuplinewritequeue = null;
	const grpcHeaders = new Headers({
		'Content-Type': 'application/grpc',
		'grpc-status': '0',
		'X-Accel-Buffering': 'no',
		'Cache-Control': 'no-store'
	});

	const downstreamcacheup = downstreamGrainbytes;
	const downstreamrefresh = 1;

	return new Response(new ReadableStream({
		async start(controller) {
			let close = false;
			let send_queue = [];
			let queuebyte_count = 0;
			let refreshtimer = null;
			let refreshMicrotask = false;
			const grpcBridge = {
				readyState: WebSocket.OPEN,
				send(data) {
					if (close) return;
					const chunk = data instanceof Uint8Array ? data : new Uint8Array(data);
					const lenBytesarray = [];
					let remaining = chunk.byteLength >>> 0;
					while (remaining > 127) {
						lenBytesarray.push((remaining & 0x7f) | 0x80);
						remaining >>>= 7;
					}
					lenBytesarray.push(remaining);
					const lenBytes = new Uint8Array(lenBytesarray);
					const protobufLen = 1 + lenBytes.length + chunk.byteLength;
					const frame = new Uint8Array(5 + protobufLen);
					frame[0] = 0;
					frame[1] = (protobufLen >>> 24) & 0xff;
					frame[2] = (protobufLen >>> 16) & 0xff;
					frame[3] = (protobufLen >>> 8) & 0xff;
					frame[4] = protobufLen & 0xff;
					frame[5] = 0x0a;
					frame.set(lenBytes, 6);
					frame.set(chunk, 6 + lenBytes.length);
					send_queue.push(frame);
					queuebyte_count += frame.byteLength;
					refreshsend_queue();
				},
				close() {
					if (this.readyState === WebSocket.CLOSED) return;
					refreshsend_queue(true);
					close = true;
					this.readyState = WebSocket.CLOSED;
					try { controller.close() } catch (e) { }
				}
			};

			const refreshsend_queue = (force = false) => {
				refreshMicrotask = false;
				if (refreshtimer) {
					clearTimeout(refreshtimer);
					refreshtimer = null;
				}
				if ((!force && close) || queuebyte_count === 0) return;
				const out = new Uint8Array(queuebyte_count);
				let offset = 0;
				for (const item of send_queue) {
					out.set(item, offset);
					offset += item.byteLength;
				}
				send_queue = [];
				queuebyte_count = 0;
				try {
					controller.enqueue(out);
				} catch (e) {
					close = true;
					grpcBridge.readyState = WebSocket.CLOSED;
				}
			};

			const refreshsend_queue = () => {
				if (queuebyte_count >= downstreamcacheup) {
					refreshsend_queue();
					return;
				}
				if (refreshMicrotask || refreshtimer) return;
				refreshMicrotask = true;
				queueMicrotask(() => {
					refreshMicrotask = false;
					if (close || queuebyte_count === 0 || refreshtimer) return;
					refreshtimer = setTimeout(refreshsend_queue, downstreamrefresh);
				});
			};

			const closeconnect = () => {
				if (close) return;
				GRPCuplinewritequeue?.clear();
				connect();
				refreshsend_queue(true);
				close = true;
				grpcBridge.readyState = WebSocket.CLOSED;
				if (refreshtimer) clearTimeout(refreshtimer);
				if (remote_writer) {
					try { remote_writer.releaseLock() } catch (e) { }
					remote_writer = null;
				}
				currentwriteSocket = null;
				try { reader.releaseLock() } catch (e) { }
				try { trojanUDPcontext.proxySocket?.close() } catch (e) { }
				try { controller.close() } catch (e) { }
			};

			const releaseremote_writer = () => {
				if (remote_writer) {
					try { remote_writer.releaseLock() } catch (e) { }
					remote_writer = null;
				}
				currentwriteSocket = null;
			};

			const uplinewritequeue = GRPCuplinewritequeue = createuplinewritequeue({
				getwrite: () => {
					const socket = remoteConnWrapper.socket;
					if (!socket) return null;
					if (socket !== currentwriteSocket) {
						releaseremote_writer();
						currentwriteSocket = socket;
						remote_writer = socket.writable.getWriter();
					}
					return remote_writer;
				},
				getconnecttask: () => remoteConnWrapper.connectingPromise,
				releasewrite: releaseremote_writer,
				retryconnect: async () => {
					if (typeof remoteConnWrapper.retryConnect !== 'function') throw new Error('retry unavailable');
					await remoteConnWrapper.retryConnect();
				},
				closeconnect,
				name: 'gRPCupline'
			});

			const write = async (payload, allowRetry = true) => {
				return uplinewritequeue.write(payload, allowRetry);
			};

			let forwardfailure = false;
			try {
				let pending = new Uint8Array(0);
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					if (!value || value.byteLength === 0) continue;
					const current = value instanceof Uint8Array ? value : new Uint8Array(value);
					const merged = new Uint8Array(pending.length + current.length);
					merged.set(pending, 0);
					merged.set(current, pending.length);
					pending = merged;
					while (pending.byteLength >= 5) {
						const grpcLen = ((pending[1] << 24) >>> 0) | (pending[2] << 16) | (pending[3] << 8) | pending[4];
						const frameSize = 5 + grpcLen;
						if (pending.byteLength < frameSize) break;
						const grpcPayload = pending.subarray(5, frameSize);
						pending = pending.slice(frameSize);
						if (!grpcPayload.byteLength) continue;
						let payload = grpcPayload;
						if (payload.byteLength >= 2 && payload[0] === 0x0a) {
							let shift = 0;
							let offset = 1;
							let varintvalid = false;
							while (offset < payload.length) {
								const current = payload[offset++];
								if ((current & 0x80) === 0) {
									varintvalid = true;
									break;
								}
								shift += 7;
								if (shift > 35) break;
							}
							if (varintvalid) payload = payload.subarray(offset);
						}
						if (!payload.byteLength) continue;
						if (isDnsQuery) {
							if (checkyesnoyestrojan) await forwardtrojanUDPdata(payload, grpcBridge, trojanUDPcontext, request);
							else await forwardataudp(payload, grpcBridge, null, request);
							continue;
						}
						if (remoteConnWrapper.socket || remoteConnWrapper.connectingPromise) {
							if (!(await write(payload))) throw new Error('Remote socket is not ready');
						} else {
							const first_packetbytes = data_transformUint8Array(payload);
							if (checkyesnoyestrojan === null) checkyesnoyestrojan = first_packetbytes.byteLength >= 58 && first_packetbytes[56] === 0x0d && first_packetbytes[57] === 0x0a;
							if (checkyesnoyestrojan) {
								const parse_result = parsetrojanrequest(first_packetbytes, yourUUID);
								if (parse_result?.hasError) throw new Error(parse_result.message || 'Invalid trojan request');
								const { port, hostname, rawClientData, isUDP } = parse_result;
								log(`[gRPC] trojanfirst_packet: ${hostname}:${port} | UDP: ${isUDP ? 'yes' : 'no'}`);
								if (isSpeedTestSite(hostname) && proxy_context.proxytype === null) {
									grpcBridge.send(local204response());
									return;
								}
								if (isUDP) {
									isDnsQuery = true;
									trojanUDPcontext.target = hostname;
									trojanUDPcontext.targetport = port;
									if (trojanUDPcontext.proxyaddress) await forwardtrojanUDPdata(first_packetbytes, grpcBridge, trojanUDPcontext, request);
									else if (validdata_length(rawClientData) > 0) await forwardtrojanUDPdata(rawClientData, grpcBridge, trojanUDPcontext, request);
								} else {
									await forwardataTCP(hostname, port, rawClientData, grpcBridge, null, remoteConnWrapper, yourUUID, request, proxy_context, true, first_packetbytes);
								}
							} else {
								checkyesnoyestrojan = false;
								const parse_result = parsevlessrequest(first_packetbytes, yourUUID);
								if (parse_result?.hasError) throw new Error(parse_result.message || 'Invalid vless request');
								const { port, hostname, version, isUDP, rawClientData } = parse_result;
								log(`[gRPC] vlessfirst_packet: ${hostname}:${port} | UDP: ${isUDP ? 'yes' : 'no'}`);
								const respHeader = new Uint8Array([version, 0]);
								if (isSpeedTestSite(hostname) && proxy_context.proxytype === null) {
									grpcBridge.send(local204response(respHeader));
									return;
								}
								if (isUDP) {
									if (port !== 53) throw new Error('UDP is not supported');
									isDnsQuery = true;
								}
								grpcBridge.send(respHeader);
								const rawData = rawClientData;
								if (isDnsQuery) {
									if (checkyesnoyestrojan) await forwardtrojanUDPdata(rawData, grpcBridge, trojanUDPcontext, request);
									else await forwardataudp(rawData, grpcBridge, null, request);
								}
								else await forwardataTCP(hostname, port, rawData, grpcBridge, null, remoteConnWrapper, yourUUID, request, proxy_context);
							}
						}
					}
					refreshsend_queue();
				}
				await uplinewritequeue.empty();
			} catch (err) {
				forwardfailure = true;
				log(`[gRPCforward] processfailure: ${err?.message || err}`);
			} finally {
				const trojanUDPproxydownstream = !forwardfailure && isDnsQuery && checkyesnoyestrojan && trojanUDPcontext.proxyaddress && trojanUDPcontext.proxySocket;
				if (trojanUDPproxydownstream) {
					uplinewritequeue.clear();
					connect();
					releaseremote_writer();
					try { reader.releaseLock() } catch (e) { }
				} else {
					closeconnect();
				}
			}
		},
		cancel() {
			GRPCuplinewritequeue?.clear();
			connect();
			try { trojanUDPcontext.proxySocket?.close() } catch (e) { }
			try { reader.releaseLock() } catch (e) { }
		}
	}), { status: 200, headers: grpcHeaders });
}

function yesvalidWSdata(bytes, token) {
	if (!bytes?.byteLength) return false;
	if (bytes.byteLength >= 18 && UUIDbytesmatch(bytes, 1, token)) return true;
	if (bytes.byteLength < 58 || bytes[56] !== 0x0d || bytes[57] !== 0x0a) return false;

	const trojanPassword = sha224(token);
	for (let i = 0; i < 56; i++) {
		if (bytes[i] !== trojanPassword.charCodeAt(i)) return false;
	}
	return true;
}

function decodeWSdata(header, token) {
	if (!header) return null;
	if (header.length > WSdatamaxheaderlong) throw new Error('early data is too large');

	let bytes;
	const Uint8ArrayBase64 = /** @type {any} */ (Uint8Array);
	if (typeof Uint8ArrayBase64.fromBase64 === 'function') {
		try {
			bytes = Uint8ArrayBase64.fromBase64(header, { alphabet: 'base64url' });
		} catch (_) { }
	}
	if (!bytes) {
		let normalized = header.replace(/-/g, '+').replace(/_/g, '/');
		const padding = normalized.length % 4;
		if (padding) normalized += '='.repeat(4 - padding);
		let binaryString;
		try {
			binaryString = atob(normalized);
		} catch (_) {
			return null;
		}
		bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
	}

	if (bytes.byteLength > WSdatamaxbytes) throw new Error('early data is too large');
	return yesvalidWSdata(bytes, token) ? bytes : null;
}

async function processWSrequest(request, yourUUID, url, proxy_context = {}) {
	const WScorrect = new WebSocketPair();
	const [clientSock, serverSock] = Object.values(WScorrect);
	try { (/** @type {any} */ (serverSock)).accept({ allowHalfOpen: true }) }
	catch (_) { serverSock.accept() }
	serverSock.binaryType = 'arraybuffer';
	let remoteConnWrapper = { socket: null, connectingPromise: null, retryConnect: null, downlinkDrain: Promise.resolve() };
	const connect = () => TCPconnectgeneration(remoteConnWrapper);
	let isDnsQuery = false;
	let checkyesnoyestrojan = null;
	const trojanUDPcontext = { cache: new Uint8Array(0), proxyaddress: proxy_context.trojanproxyaddress };
	const earlyDataHeader = request.headers.get('sec-websocket-protocol') || '';
	const SSdisableEarlyData = !!url.searchParams.get('enc');
	let WSuplinewritequeue = null;
	let WSexplicit_transport = Promise.resolve();
	let WSexplicit_transportstopreceive = false, WSexplicit_transportfailure = false, WSexplicit_transportfooter = false;
	let WSexplicitqueuebytes = 0, WSexplicitqueueitems = 0;
	let checkprotocoltype = null, currentwriteSocket = null, remote_writer = null;
	let sscontext = null, ssinittask = null;
	let WSlocalspeedtest = false, WSlocalspeedtestSocket = null;
	let WSlocalspeedtestrequestcache = new Uint8Array(0);
	let WSlocalspeedtestfirst_packetresponseheader = null;
	const WSlocalspeedtestrequestup = 64 * 1024;

	const sendWSlocalspeedtestresponse = async () => {
		if (!WSlocalspeedtestSocket) return;
		const respHeader = WSlocalspeedtestfirst_packetresponseheader;
		WSlocalspeedtestfirst_packetresponseheader = null;
		await WebSocketsend(WSlocalspeedtestSocket, WSlocal204response(respHeader));
	};

	const HTTPrequestheaderfooter = (data) => {
		for (let i = 0; i <= data.byteLength - 4; i++) {
			if (data[i] === 0x0d && data[i + 1] === 0x0a && data[i + 2] === 0x0d && data[i + 3] === 0x0a) return i + 4;
		}
		return -1;
	};

	const processWSlocalspeedtestdata = async (data) => {
		const chunk = data_transformUint8Array(data);
		if (!chunk.byteLength) return;
		if (WSlocalspeedtestrequestcache.byteLength + chunk.byteLength > WSlocalspeedtestrequestup) throw new Error('WS local speed-test request is too large');
		WSlocalspeedtestrequestcache = concat_bytes(WSlocalspeedtestrequestcache, chunk);

		while (WSlocalspeedtestrequestcache.byteLength) {
			const headerEnd = HTTPrequestheaderfooter(WSlocalspeedtestrequestcache);
			if (headerEnd === -1) return;
			const headerText = vlesstextdecode.decode(WSlocalspeedtestrequestcache.subarray(0, headerEnd));
			const contentLengthMatch = headerText.match(/(?:^|\r\n)content-length\s*:\s*(\d+)/i);
			const contentLength = contentLengthMatch ? Number(contentLengthMatch[1]) : 0;
			const requestLength = headerEnd + contentLength;
			if (!Number.isSafeInteger(contentLength) || requestLength > WSlocalspeedtestrequestup) throw new Error('WS local speed-test request body is too large');
			if (WSlocalspeedtestrequestcache.byteLength < requestLength) return;
			WSlocalspeedtestrequestcache = WSlocalspeedtestrequestcache.slice(requestLength);
			await sendWSlocalspeedtestresponse();
		}
	};

	const enableWSlocalspeedtest = async (Socket, respHeader = null, firstrequestdata = null) => {
		WSlocalspeedtest = true;
		WSlocalspeedtestSocket = Socket;
		WSlocalspeedtestrequestcache = new Uint8Array(0);
		WSlocalspeedtestfirst_packetresponseheader = respHeader;
		if (validdata_length(firstrequestdata) > 0) await processWSlocalspeedtestdata(firstrequestdata);
	};

	const releaseremote_writer = () => {
		if (remote_writer) {
			try { remote_writer.releaseLock() } catch (e) { }
			remote_writer = null;
		}
		currentwriteSocket = null;
	};

	const uplinewritequeue = WSuplinewritequeue = createuplinewritequeue({
		getwrite: () => {
			const socket = remoteConnWrapper.socket;
			if (!socket) return null;
			if (socket !== currentwriteSocket) {
				releaseremote_writer();
				currentwriteSocket = socket;
				remote_writer = socket.writable.getWriter();
			}
			return remote_writer;
		},
		getconnecttask: () => remoteConnWrapper.connectingPromise,
		releasewrite: releaseremote_writer,
		retryconnect: async () => {
			if (typeof remoteConnWrapper.retryConnect !== 'function') throw new Error('retry unavailable');
			await remoteConnWrapper.retryConnect();
		},
		closeconnect: err => processWSexplicit_transporterror(err),
		name: 'WSupline'
	});

	const write = async (chunk, allowRetry = true) => {
		return uplinewritequeue.write(chunk, allowRetry);
	};

	const getSScontext = async () => {
		if (sscontext) return sscontext;
		if (!ssinittask) {
			ssinittask = (async () => {
				const requestencrypted = (url.searchParams.get('enc') || '').toLowerCase();
				const firstencryptedconfig = SSencryptedconfig[requestencrypted] || SSencryptedconfig['aes-128-gcm'];
				const inboundcandidateencryptedconfig = [firstencryptedconfig, ...Object.values(SSencryptedconfig).filter(c => c.method !== firstencryptedconfig.method)];
				const inboundkeytaskcache = new Map();
				const inboundkeytask = (config) => {
					if (!inboundkeytaskcache.has(config.method)) inboundkeytaskcache.set(config.method, SSkey(yourUUID, config.keyLen));
					return inboundkeytaskcache.get(config.method);
				};
				const inboundstatus = {
					buffer: new Uint8Array(0),
					hasSalt: false,
					waitPayloadLength: null,
					decryptKey: null,
					nonceCounter: new Uint8Array(SSNoncelong),
					encryptedconfig: null,
				};
				const initinbounddecryptstatus = async () => {
					const lengthCipherTotalLength = 2 + SSAEADlabellong;
					const maxlong = Math.max(...inboundcandidateencryptedconfig.map(c => c.saltLen));
					const maxalignbytes = 16;
					const max = Math.min(maxalignbytes, Math.max(0, inboundstatus.buffer.byteLength - (lengthCipherTotalLength + Math.min(...inboundcandidateencryptedconfig.map(c => c.saltLen)))));
					for (let offset = 0; offset <= max; offset++) {
						for (const encryptedconfig of inboundcandidateencryptedconfig) {
							const initsmalllong = offset + encryptedconfig.saltLen + lengthCipherTotalLength;
							if (inboundstatus.buffer.byteLength < initsmalllong) continue;
							const salt = inboundstatus.buffer.subarray(offset, offset + encryptedconfig.saltLen);
							const lengthCipher = inboundstatus.buffer.subarray(offset + encryptedconfig.saltLen, initsmalllong);
							const masterKey = await inboundkeytask(encryptedconfig);
							const decryptKey = await SSkey(encryptedconfig, masterKey, salt, ['decrypt']);
							const nonceCounter = new Uint8Array(SSNoncelong);
							try {
								const lengthPlain = await SSAEADdecrypt(decryptKey, nonceCounter, lengthCipher);
								if (lengthPlain.byteLength !== 2) continue;
								const payloadLength = (lengthPlain[0] << 8) | lengthPlain[1];
								if (payloadLength < 0 || payloadLength > encryptedconfig.maxChunk) continue;
								if (offset > 0) log(`[SSinbound] detectfront ${offset}B，autoalign`);
								if (encryptedconfig.method !== firstencryptedconfig.method) log(`[SSinbound] URL enc=${requestencrypted || firstencryptedconfig.method} ${encryptedconfig.method} ，auto`);
								inboundstatus.buffer = inboundstatus.buffer.subarray(initsmalllong);
								inboundstatus.decryptKey = decryptKey;
								inboundstatus.nonceCounter = nonceCounter;
								inboundstatus.waitPayloadLength = payloadLength;
								inboundstatus.encryptedconfig = encryptedconfig;
								inboundstatus.hasSalt = true;
								return true;
							} catch (_) { }
						}
					}
					const initfailurelong = maxlong + lengthCipherTotalLength + maxalignbytes;
					if (inboundstatus.buffer.byteLength >= initfailurelong) {
						throw new Error(`SS handshake decrypt failed (enc=${requestencrypted || 'auto'}, candidates=${inboundcandidateencryptedconfig.map(c => c.method).join('/')})`);
					}
					return false;
				};
				const inbounddecrypt = {
					async input(dataChunk) {
						const chunk = data_transformUint8Array(dataChunk);
						if (chunk.byteLength > 0) inboundstatus.buffer = concat_bytes(inboundstatus.buffer, chunk);
						if (!inboundstatus.hasSalt) {
							const initsuccess = await initinbounddecryptstatus();
							if (!initsuccess) return [];
						}
						const plaintextChunks = [];
						while (true) {
							if (inboundstatus.waitPayloadLength === null) {
								const lengthCipherTotalLength = 2 + SSAEADlabellong;
								if (inboundstatus.buffer.byteLength < lengthCipherTotalLength) break;
								const lengthCipher = inboundstatus.buffer.subarray(0, lengthCipherTotalLength);
								inboundstatus.buffer = inboundstatus.buffer.subarray(lengthCipherTotalLength);
								const lengthPlain = await SSAEADdecrypt(inboundstatus.decryptKey, inboundstatus.nonceCounter, lengthCipher);
								if (lengthPlain.byteLength !== 2) throw new Error('SS length decrypt failed');
								const payloadLength = (lengthPlain[0] << 8) | lengthPlain[1];
								if (payloadLength < 0 || payloadLength > inboundstatus.encryptedconfig.maxChunk) throw new Error(`SS payload length invalid: ${payloadLength}`);
								inboundstatus.waitPayloadLength = payloadLength;
							}
							const payloadCipherTotalLength = inboundstatus.waitPayloadLength + SSAEADlabellong;
							if (inboundstatus.buffer.byteLength < payloadCipherTotalLength) break;
							const payloadCipher = inboundstatus.buffer.subarray(0, payloadCipherTotalLength);
							inboundstatus.buffer = inboundstatus.buffer.subarray(payloadCipherTotalLength);
							const payloadPlain = await SSAEADdecrypt(inboundstatus.decryptKey, inboundstatus.nonceCounter, payloadCipher);
							plaintextChunks.push(payloadPlain);
							inboundstatus.waitPayloadLength = null;
						}
						return plaintextChunks;
					},
				};
				let outboundencrypted = null;
				const SSmaxbytes = 32 * 1024;
				const getoutboundencrypted = async () => {
					if (outboundencrypted) return outboundencrypted;
					if (!inboundstatus.encryptedconfig) throw new Error('SS cipher is not negotiated');
					const outboundencryptedconfig = inboundstatus.encryptedconfig;
					const outboundkey = await SSkey(yourUUID, outboundencryptedconfig.keyLen);
					const outboundrandombytes = crypto.getRandomValues(new Uint8Array(outboundencryptedconfig.saltLen));
					const outboundencryptedkey = await SSkey(outboundencryptedconfig, outboundkey, outboundrandombytes, ['encrypt']);
					const outboundNonce = new Uint8Array(SSNoncelong);
					let randombytessend = false;
					outboundencrypted = {
						async encryptedsend(dataChunk, sendChunk) {
							const plaintextData = data_transformUint8Array(dataChunk);
							if (!randombytessend) {
								await sendChunk(outboundrandombytes);
								randombytessend = true;
							}
							if (plaintextData.byteLength === 0) return;
							let offset = 0;
							while (offset < plaintextData.byteLength) {
								const end = Math.min(offset + outboundencryptedconfig.maxChunk, plaintextData.byteLength);
								const payloadPlain = plaintextData.subarray(offset, end);
								const lengthPlain = new Uint8Array(2);
								lengthPlain[0] = (payloadPlain.byteLength >>> 8) & 0xff;
								lengthPlain[1] = payloadPlain.byteLength & 0xff;
								const lengthCipher = await SSAEADencrypted(outboundencryptedkey, outboundNonce, lengthPlain);
								const payloadCipher = await SSAEADencrypted(outboundencryptedkey, outboundNonce, payloadPlain);
								const frame = new Uint8Array(lengthCipher.byteLength + payloadCipher.byteLength);
								frame.set(lengthCipher, 0);
								frame.set(payloadCipher, lengthCipher.byteLength);
								await sendChunk(frame);
								offset = end;
							}
						},
					};
					return outboundencrypted;
				};
				let SSsend_queue = Promise.resolve();
				const SSsend = (chunk) => {
					SSsend_queue = SSsend_queue.then(async () => {
						if (serverSock.readyState !== WebSocket.OPEN) return;
						const initoutboundencrypted = await getoutboundencrypted();
						await initoutboundencrypted.encryptedsend(chunk, async (encryptedChunk) => {
							if (encryptedChunk.byteLength > 0 && serverSock.readyState === WebSocket.OPEN) {
								await WebSocketsend(serverSock, encryptedChunk.buffer);
							}
						});
					}).catch((error) => {
						log(`[SSsend] encryptedfailure: ${error?.message || error}`);
						closeSocketQuietly(serverSock);
					});
					return SSsend_queue;
				};
				const Socket = {
					get readyState() {
						return serverSock.readyState;
					},
					send(data) {
						const chunk = data_transformUint8Array(data);
						if (chunk.byteLength <= SSmaxbytes) {
							return SSsend(chunk);
						}
						for (let i = 0; i < chunk.byteLength; i += SSmaxbytes) {
							SSsend(chunk.subarray(i, Math.min(i + SSmaxbytes, chunk.byteLength)));
						}
						return SSsend_queue;
					},
					close() {
						closeSocketQuietly(serverSock);
					}
				};
				sscontext = {
					inbounddecrypt,
					Socket,
					first_packet: false,
					target: '',
					targetport: 0,
				};
				return sscontext;
			})().finally(() => { ssinittask = null });
		}
		return ssinittask;
	};

	const processSSdata = async (chunk) => {
		const context = await getSScontext();
		let array = null;
		try {
			array = await context.inbounddecrypt.input(chunk);
		} catch (err) {
			const msg = err?.message || `${err}`;
			if (msg.includes('Decryption failed') || msg.includes('SS handshake decrypt failed') || msg.includes('SS length decrypt failed')) {
				log(`[SSinbound] decryptfailure，connectclose: ${msg}`);
				closeSocketQuietly(serverSock);
				return;
			}
			throw err;
		}
		for (const of array) {
			if (WSlocalspeedtest) {
				await processWSlocalspeedtestdata();
				continue;
			}
			let write = false;
			try {
				write = await write(, false);
			} catch (err) {
				if ((/** @type {any} */ (err))?.isQueueOverflow) throw err;
				write = false;
			}
			if (write) continue;
			if (context.first_packet && context.target && context.targetport > 0) {
				await forwardataTCP(context.target, context.targetport, , context.Socket, null, remoteConnWrapper, yourUUID, request, proxy_context);
				continue;
			}
			const plaintext_data = data_transformUint8Array();
			if (plaintext_data.byteLength < 3) throw new Error('invalid ss data');
			const addressType = plaintext_data[0];
			let cursor = 1;
			let hostname = '';
			if (addressType === 1) {
				if (plaintext_data.byteLength < cursor + 4 + 2) throw new Error('invalid ss ipv4 length');
				hostname = `${plaintext_data[cursor]}.${plaintext_data[cursor + 1]}.${plaintext_data[cursor + 2]}.${plaintext_data[cursor + 3]}`;
				cursor += 4;
			} else if (addressType === 3) {
				if (plaintext_data.byteLength < cursor + 1) throw new Error('invalid ss domain length');
				const domainLength = plaintext_data[cursor];
				cursor += 1;
				if (plaintext_data.byteLength < cursor + domainLength + 2) throw new Error('invalid ss domain data');
				hostname = SStextdecode.decode(plaintext_data.subarray(cursor, cursor + domainLength));
				cursor += domainLength;
			} else if (addressType === 4) {
				if (plaintext_data.byteLength < cursor + 16 + 2) throw new Error('invalid ss ipv6 length');
				const ipv6 = [];
				const ipv6View = new DataView(plaintext_data.buffer, plaintext_data.byteOffset + cursor, 16);
				for (let i = 0; i < 8; i++) ipv6.push(ipv6View.getUint16(i * 2).toString(16));
				hostname = ipv6.join(':');
				cursor += 16;
			} else {
				throw new Error(`invalid ss addressType: ${addressType}`);
			}
			if (!hostname) throw new Error(`invalid ss address: ${addressType}`);
			const port = (plaintext_data[cursor] << 8) | plaintext_data[cursor + 1];
			cursor += 2;
			const rawClientData = plaintext_data.subarray(cursor);
			if (isSpeedTestSite(hostname) && proxy_context.proxytype === null) {
				await enableWSlocalspeedtest(context.Socket, null, rawClientData);
				return;
			}
			context.first_packet = true;
			context.target = hostname;
			context.targetport = port;
			await forwardataTCP(hostname, port, rawClientData, context.Socket, null, remoteConnWrapper, yourUUID, request, proxy_context);
		}
	};

	const processWSinbounddata = async (chunk) => {
		let currentbytes = null;
		if (isDnsQuery) {
			if (checkyesnoyestrojan) return await forwardtrojanUDPdata(chunk, serverSock, trojanUDPcontext, request);
			return await forwardataudp(chunk, serverSock, null, request);
		}
		if (checkprotocoltype === 'ss') {
			await processSSdata(chunk);
			return;
		}
		if (WSlocalspeedtest) {
			await processWSlocalspeedtestdata(chunk);
			return;
		}
		if (await write(chunk)) return;

		if (checkprotocoltype === null) {
			if (url.searchParams.get('enc')) checkprotocoltype = 'ss';
			else {
				currentbytes = currentbytes || data_transformUint8Array(chunk);
				const bytes = currentbytes;
				checkprotocoltype = bytes.byteLength >= 58 && bytes[56] === 0x0d && bytes[57] === 0x0a ? 'trojan' : 'vless';
			}
			checkyesnoyestrojan = checkprotocoltype === 'trojan';
			log(`[WSforward] protocoltype: ${checkprotocoltype} | : ${url.host} | UA: ${request.headers.get('user-agent') || ''}`);
		}

		if (checkprotocoltype === 'ss') {
			await processSSdata(chunk);
			return;
		}
		if (await write(chunk)) return;
		if (checkprotocoltype === 'trojan') {
			const parse_result = parsetrojanrequest(chunk, yourUUID);
			if (parse_result?.hasError) throw new Error(parse_result.message || 'Invalid trojan request');
			const { port, hostname, rawClientData, isUDP } = parse_result;
			if (isSpeedTestSite(hostname) && proxy_context.proxytype === null) {
				await enableWSlocalspeedtest(serverSock, null, rawClientData);
				return;
			}
			if (isUDP) {
				isDnsQuery = true;
				trojanUDPcontext.target = hostname;
				trojanUDPcontext.targetport = port;
				if (trojanUDPcontext.proxyaddress) return forwardtrojanUDPdata(currentbytes || data_transformUint8Array(chunk), serverSock, trojanUDPcontext, request);
				if (validdata_length(rawClientData) > 0) return forwardtrojanUDPdata(rawClientData, serverSock, trojanUDPcontext, request);
				return;
			}
			await forwardataTCP(hostname, port, rawClientData, serverSock, null, remoteConnWrapper, yourUUID, request, proxy_context, true, currentbytes || data_transformUint8Array(chunk));
		} else {
			checkyesnoyestrojan = false;
			currentbytes = currentbytes || data_transformUint8Array(chunk);
			const bytes = currentbytes;
			const parse_result = parsevlessrequest(bytes, yourUUID);
			if (parse_result?.hasError) throw new Error(parse_result.message || 'Invalid vless request');
			const { port, hostname, version, isUDP, rawClientData } = parse_result;
			const respHeader = new Uint8Array([version, 0]);
			if (isSpeedTestSite(hostname) && proxy_context.proxytype === null) {
				await enableWSlocalspeedtest(serverSock, respHeader, rawClientData);
				return;
			}
			if (isUDP) {
				if (port === 53) isDnsQuery = true;
				else throw new Error('UDP is not supported');
			}
			const rawData = rawClientData;
			if (isDnsQuery) {
				if (checkyesnoyestrojan) return forwardtrojanUDPdata(rawData, serverSock, trojanUDPcontext, request);
				return forwardataudp(rawData, serverSock, respHeader, request);
			}
			await forwardataTCP(hostname, port, rawData, serverSock, respHeader, remoteConnWrapper, yourUUID, request, proxy_context);
		}
	};

	const processWSexplicit_transporterror = (err) => {
		if (WSexplicit_transportfailure) return;
		WSexplicit_transportfailure = true;
		WSexplicit_transportstopreceive = true;
		WSexplicitqueuebytes = 0;
		WSexplicitqueueitems = 0;
		const msg = err?.message || `${err}`;
		if (msg.includes('Network connection lost') || msg.includes('ReadableStream is closed')) {
			log(`[WSforward] connectend: ${msg}`);
		} else {
			log(`[WSforward] processfailure: ${msg}`);
		}
		uplinewritequeue.clear();
		releaseremote_writer();
		connect();
		try { trojanUDPcontext.proxySocket?.close() } catch (e) { }
		closeSocketQuietly(serverSock);
	};

	const appendWSexplicit_transporttask = (task) => {
		WSexplicit_transport = WSexplicit_transport.then(task).catch(processWSexplicit_transporterror);
		return WSexplicit_transport;
	};

	const WSexplicit_transport = (data) => {
		if (WSexplicit_transportstopreceive || WSexplicit_transportfailure) return;
		const chunkSize = Math.max(0, validdata_length(data));
		const nextBytes = WSexplicitqueuebytes + chunkSize;
		const nextItems = WSexplicitqueueitems + 1;
		if (nextBytes > uplinequeuemaxbytes || nextItems > uplinequeuemaxitems) {
			processWSexplicit_transporterror(new Error(`[WSexplicit_transport] queue: ${nextBytes}B/${nextItems}`));
			return;
		}
		WSexplicitqueuebytes = nextBytes;
		WSexplicitqueueitems = nextItems;
		appendWSexplicit_transporttask(async () => {
			WSexplicitqueuebytes = Math.max(0, WSexplicitqueuebytes - chunkSize);
			WSexplicitqueueitems = Math.max(0, WSexplicitqueueitems - 1);
			if (WSexplicit_transportfailure) return;
			await processWSinbounddata(data);
		});
	};

	const footerWSexplicit_transport = () => {
		if (WSexplicit_transportfooter) return;
		WSexplicit_transportfooter = true;
		WSexplicit_transportstopreceive = true;
		appendWSexplicit_transporttask(async () => {
			if (WSexplicit_transportfailure) return;
			await uplinewritequeue.empty();
			releaseremote_writer();
			connect();
			try { trojanUDPcontext.proxySocket?.close() } catch (e) { }
		});
	};

	serverSock.addEventListener('message', (event) => {
		WSexplicit_transport(event.data);
	});
	serverSock.addEventListener('close', () => {
		closeSocketQuietly(serverSock);
		footerWSexplicit_transport();
	});
	serverSock.addEventListener('error', (err) => {
		processWSexplicit_transporterror(err);
	});

	if (!SSdisableEarlyData && earlyDataHeader) {
		try {
			const bytes = decodeWSdata(earlyDataHeader, yourUUID);
			if (bytes?.byteLength) WSexplicit_transport(bytes.buffer);
		} catch (error) {
			processWSexplicit_transporterror(error);
		}
	}

	return new Response(null, { status: 101, webSocket: clientSock, headers: { 'Sec-WebSocket-Extensions': '' } });
}

const trojantextdecode = new TextDecoder();

function parsetrojanproxyaddress(address) {
	const raw = String(address || '').trim();
	if (!raw || raw.includes('/') || raw.includes('@') || raw.includes('://')) throw new Error(' host:port');
	let hostname = '', portText = '';
	if (raw.startsWith('[')) {
		const match = raw.match(/^(\[[^\]]+\]):(\d+)$/);
		if (!match) throw new Error('invalid IPv6 trojanproxyaddress');
		hostname = match[1];
		portText = match[2];
	} else {
		const parts = raw.split(':');
		if (parts.length !== 2) throw new Error('trojanproxy host:port');
		hostname = parts[0];
		portText = parts[1];
	}
	const port = Number(portText);
	if (!hostname || !Number.isInteger(port) || port < 1 || port > 65535) throw new Error('invalidtrojanproxyport');
	return { hostname, port };
}

async function connecttrojanproxy(first_packetdata, TCPconnect, trojanproxytarget) {
	if (!trojanproxytarget) throw new Error('trojan fallback is not configured');
	const socket = TCPconnect({ hostname: stripIPv6Brackets(trojanproxytarget.hostname), port: trojanproxytarget.port });
	let writer = null;
	try {
		if (socket.opened) await socket.opened;
		if (validdata_length(first_packetdata) > 0) {
			writer = socket.writable.getWriter();
			await writer.write(data_transformUint8Array(first_packetdata));
		}
		return socket;
	} catch (error) {
		try { socket?.close?.() } catch (e) { }
		throw error;
	} finally {
		try { writer?.releaseLock() } catch (e) { }
	}
}

function trojanproxydata(first_packetdata, rawData) {
	const first_packet = data_transformUint8Array(first_packetdata);
	const payload = data_transformUint8Array(rawData);
	if (!payload.byteLength) return first_packet;
	const long = first_packet.byteLength - payload.byteLength;
	if (long <= 0) return first_packet;
	for (let i = 0; i < payload.byteLength; i++) {
		if (first_packet[long + i] !== payload[i]) return first_packet;
	}
	return first_packet.subarray(0, long);
}

async function forwardtrojanUDPproxydata(chunk, webSocket, context, request) {
	const data = data_transformUint8Array(chunk);
	if (!context.proxySocket) {
		const TCPconnect = createrequestTCPconnect(request);
		const socket = await connecttrojanproxy(data, TCPconnect, context.proxyaddress);
		context.proxySocket = socket;
		socket.closed.catch(() => { }).finally(() => closeSocketQuietly(webSocket));
		connectStreams(socket, webSocket, null, null);
		return;
	}
	if (!data.byteLength) return;
	const writer = context.proxySocket.writable.getWriter();
	try { await writer.write(data) }
	finally { try { writer.releaseLock() } catch (e) { } }
}

function parsetrojanrequest(buffer, passwordPlainText) {
	const data = data_transformUint8Array(buffer);
	const sha224Password = sha224(passwordPlainText);
	if (data.byteLength < 58) return { hasError: true, message: "invalid data" };
	let crLfIndex = 56;
	if (data[crLfIndex] !== 0x0d || data[crLfIndex + 1] !== 0x0a) return { hasError: true, message: "invalid header format" };
	for (let i = 0; i < crLfIndex; i++) {
		if (data[i] !== sha224Password.charCodeAt(i)) return { hasError: true, message: "invalid password" };
	}

	const socks5Index = crLfIndex + 2;
	if (data.byteLength < socks5Index + 6) return { hasError: true, message: "invalid S5 request data" };

	const cmd = data[socks5Index];
	if (cmd !== 1 && cmd !== 3) return { hasError: true, message: "unsupported command, only TCP/UDP is allowed" };
	const isUDP = cmd === 3;

	const atype = data[socks5Index + 1];
	let addressLength = 0;
	let addressIndex = socks5Index + 2;
	let address = "";
	switch (atype) {
		case 1: // IPv4
			addressLength = 4;
			if (data.byteLength < addressIndex + addressLength + 4) return { hasError: true, message: "invalid S5 request data" };
			address = `${data[addressIndex]}.${data[addressIndex + 1]}.${data[addressIndex + 2]}.${data[addressIndex + 3]}`;
			break;
		case 3: // Domain
			if (data.byteLength < addressIndex + 1) return { hasError: true, message: "invalid S5 request data" };
			addressLength = data[addressIndex];
			addressIndex += 1;
			if (data.byteLength < addressIndex + addressLength + 4) return { hasError: true, message: "invalid S5 request data" };
			address = trojantextdecode.decode(data.subarray(addressIndex, addressIndex + addressLength));
			break;
		case 4: // IPv6
			addressLength = 16;
			if (data.byteLength < addressIndex + addressLength + 4) return { hasError: true, message: "invalid S5 request data" };
			const ipv6 = [];
			for (let i = 0; i < 8; i++) {
				const partIndex = addressIndex + i * 2;
				ipv6.push(((data[partIndex] << 8) | data[partIndex + 1]).toString(16));
			}
			address = ipv6.join(":");
			break;
		default:
			return { hasError: true, message: `invalid addressType is ${atype}` };
	}

	if (!address) {
		return { hasError: true, message: `address is empty, addressType is ${atype}` };
	}

	const portIndex = addressIndex + addressLength;
	if (data.byteLength < portIndex + 4) return { hasError: true, message: "invalid S5 request data" };
	const portRemote = (data[portIndex] << 8) | data[portIndex + 1];

	return {
		hasError: false,
		addressType: atype,
		port: portRemote,
		hostname: address,
		isUDP,
		rawClientData: data.subarray(portIndex + 4)
	};
}

const UUIDbytescache = new Map();
const vlesstextdecode = new TextDecoder();

function readbytes(code) {
	if (code >= 48 && code <= 57) return code - 48;
	code |= 32;
	if (code >= 97 && code <= 102) return code - 87;
	return -1;
}

function getUUIDbytes(uuid) {
	const key = String(uuid || '');
	let cached = UUIDbytescache.get(key);
	if (cached) return cached;

	const clean = key.replace(/-/g, '');
	if (clean.length !== 32) return null;

	const bytes = new Uint8Array(16);
	for (let i = 0; i < 16; i++) {
		const high = readbytes(clean.charCodeAt(i * 2));
		const low = readbytes(clean.charCodeAt(i * 2 + 1));
		if (high < 0 || low < 0) return null;
		bytes[i] = (high << 4) | low;
	}

	if (UUIDbytescache.size >= 32) UUIDbytescache.clear();
	UUIDbytescache.set(key, bytes);
	return bytes;
}

function UUIDbytesmatch(data, offset, uuid) {
	const expected = getUUIDbytes(uuid);
	if (!expected || data.byteLength < offset + 16) return false;
	for (let i = 0; i < 16; i++) {
		if (data[offset + i] !== expected[i]) return false;
	}
	return true;
}

function parsevlessrequest(chunk, token) {
	const data = data_transformUint8Array(chunk);
	const length = data.byteLength;
	if (length < 24) return { hasError: true, message: 'Invalid data' };
	const version = data[0];
	if (!UUIDbytesmatch(data, 1, token)) return { hasError: true, message: 'Invalid uuid' };

	const optLen = data[17];
	const cmdIndex = 18 + optLen;
	if (length < cmdIndex + 4) return { hasError: true, message: 'Invalid data' };

	const cmd = data[cmdIndex];
	let isUDP = false;
	if (cmd === 1) { } else if (cmd === 2) { isUDP = true } else { return { hasError: true, message: 'Invalid command' } }

	const portIdx = cmdIndex + 1;
	const port = (data[portIdx] << 8) | data[portIdx + 1];
	let addrValIdx = portIdx + 3, addrLen = 0, hostname = '';
	const addressType = data[portIdx + 2];
	switch (addressType) {
		case 1:
			addrLen = 4;
			if (length < addrValIdx + addrLen) return { hasError: true, message: 'Invalid IPv4 address length' };
			hostname = `${data[addrValIdx]}.${data[addrValIdx + 1]}.${data[addrValIdx + 2]}.${data[addrValIdx + 3]}`;
			break;
		case 2:
			if (length < addrValIdx + 1) return { hasError: true, message: 'Invalid domain length' };
			addrLen = data[addrValIdx];
			addrValIdx += 1;
			if (length < addrValIdx + addrLen) return { hasError: true, message: 'Invalid domain data' };
			hostname = vlesstextdecode.decode(data.subarray(addrValIdx, addrValIdx + addrLen));
			break;
		case 3:
			addrLen = 16;
			if (length < addrValIdx + addrLen) return { hasError: true, message: 'Invalid IPv6 address length' };
			const ipv6 = [];
			for (let i = 0; i < 8; i++) {
				const base = addrValIdx + i * 2;
				ipv6.push(((data[base] << 8) | data[base + 1]).toString(16));
			}
			hostname = ipv6.join(':');
			break;
		default:
			return { hasError: true, message: `Invalid address type: ${addressType}` };
	}
	if (!hostname) return { hasError: true, message: `Invalid address: ${addressType}` };
	const rawIndex = addrValIdx + addrLen;
	return { hasError: false, addressType, port, hostname, isUDP, rawClientData: data.subarray(rawIndex), version };
}

const SSencryptedconfig = {
	'aes-128-gcm': { method: 'aes-128-gcm', keyLen: 16, saltLen: 16, maxChunk: 0x3fff, aesLength: 128 },
	'aes-256-gcm': { method: 'aes-256-gcm', keyLen: 32, saltLen: 32, maxChunk: 0x3fff, aesLength: 256 },
};

const SSAEADlabellong = 16, SSNoncelong = 12;
const SSchildkeyinfo = new TextEncoder().encode('ss-subkey');
const SStextencode = new TextEncoder(), SStextdecode = new TextDecoder(), SSkeycache = new Map();

function data_transformUint8Array(data) {
	if (data instanceof Uint8Array) return data;
	if (data instanceof ArrayBuffer) return new Uint8Array(data);
	if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
	return new Uint8Array(data || 0);
}

function concat_bytes(...chunkList) {
	if (!chunkList || chunkList.length === 0) return new Uint8Array(0);
	const chunks = chunkList.map(data_transformUint8Array);
	const total = chunks.reduce((sum, c) => sum + c.byteLength, 0);
	const result = new Uint8Array(total);
	let offset = 0;
	for (const c of chunks) { result.set(c, offset); offset += c.byteLength }
	return result;
}

async function forwardtrojanUDPdata(chunk, webSocket, context, request) {
	const current = data_transformUint8Array(chunk);
	if (context?.proxyaddress) return forwardtrojanUDPproxydata(current, webSocket, context, request);
	const cache = context?.cache instanceof Uint8Array ? context.cache : new Uint8Array(0);
	const input = cache.byteLength ? concat_bytes(cache, current) : current;
	let cursor = 0;

	while (cursor < input.byteLength) {
		const packetStart = cursor;
		const atype = input[cursor];
		let addrCursor = cursor + 1;
		let addrLen = 0;
		if (atype === 1) addrLen = 4;
		else if (atype === 4) addrLen = 16;
		else if (atype === 3) {
			if (input.byteLength < addrCursor + 1) break;
			addrLen = 1 + input[addrCursor];
		} else throw new Error(`invalid trojan udp addressType: ${atype}`);

		const portCursor = addrCursor + addrLen;
		if (input.byteLength < portCursor + 6) break;

		const port = (input[portCursor] << 8) | input[portCursor + 1];
		const payloadLength = (input[portCursor + 2] << 8) | input[portCursor + 3];
		if (input[portCursor + 4] !== 0x0d || input[portCursor + 5] !== 0x0a) throw new Error('invalid trojan udp delimiter');

		const payloadStart = portCursor + 6;
		const payloadEnd = payloadStart + payloadLength;
		if (input.byteLength < payloadEnd) break;

		const addressportheader = input.slice(packetStart, portCursor + 2);
		const payload = input.slice(payloadStart, payloadEnd);
		cursor = payloadEnd;

		if (port !== 53) throw new Error('UDP is not supported');
		if (!payload.byteLength) continue;

		let tcpDNSquery = payload;
		if (payload.byteLength < 2 || ((payload[0] << 8) | payload[1]) !== payload.byteLength - 2) {
			tcpDNSquery = new Uint8Array(payload.byteLength + 2);
			tcpDNSquery[0] = (payload.byteLength >>> 8) & 0xff;
			tcpDNSquery[1] = payload.byteLength & 0xff;
			tcpDNSquery.set(payload, 2);
		}

		const dnsresponsecontext = { cache: new Uint8Array(0) };
		await forwardataudp(tcpDNSquery, webSocket, null, request, (dnsRespChunk) => {
			const currentresponse = data_transformUint8Array(dnsRespChunk);
			const responseinput = dnsresponsecontext.cache.byteLength ? concat_bytes(dnsresponsecontext.cache, currentresponse) : currentresponse;
			const responselist = [];
			let responseCursor = 0;
			while (responseCursor + 2 <= responseinput.byteLength) {
				const dnsLen = (responseinput[responseCursor] << 8) | responseinput[responseCursor + 1];
				const dnsStart = responseCursor + 2;
				const dnsEnd = dnsStart + dnsLen;
				if (dnsEnd > responseinput.byteLength) break;
				const dnsPayload = responseinput.slice(dnsStart, dnsEnd);
				const frame = new Uint8Array(addressportheader.byteLength + 4 + dnsPayload.byteLength);
				frame.set(addressportheader, 0);
				frame[addressportheader.byteLength] = (dnsPayload.byteLength >>> 8) & 0xff;
				frame[addressportheader.byteLength + 1] = dnsPayload.byteLength & 0xff;
				frame[addressportheader.byteLength + 2] = 0x0d;
				frame[addressportheader.byteLength + 3] = 0x0a;
				frame.set(dnsPayload, addressportheader.byteLength + 4);
				responselist.push(frame);
				responseCursor = dnsEnd;
			}
			dnsresponsecontext.cache = responseinput.slice(responseCursor);
			return responselist.length ? responselist : new Uint8Array(0);
		});
	}

	if (context) context.cache = input.slice(cursor);
}

function SSNonce(counter) {
	for (let i = 0; i < counter.length; i++) { counter[i] = (counter[i] + 1) & 0xff; if (counter[i] !== 0) return }
}

async function SSkey(passwordText, keyLen) {
	const cacheKey = `${keyLen}:${passwordText}`;
	if (SSkeycache.has(cacheKey)) return SSkeycache.get(cacheKey);
	const deriveTask = (async () => {
		const pwBytes = SStextencode.encode(passwordText || '');
		let prev = new Uint8Array(0), result = new Uint8Array(0);
		while (result.byteLength < keyLen) {
			const input = new Uint8Array(prev.byteLength + pwBytes.byteLength);
			input.set(prev, 0); input.set(pwBytes, prev.byteLength);
			prev = new Uint8Array(await crypto.subtle.digest('MD5', input));
			result = concat_bytes(result, prev);
		}
		return result.slice(0, keyLen);
	})();
	SSkeycache.set(cacheKey, deriveTask);
	try { return await deriveTask }
	catch (error) { SSkeycache.delete(cacheKey); throw error }
}

async function SSkey(config, masterKey, salt, usages) {
	const hmacOpts = { name: 'HMAC', hash: 'SHA-1' };
	const saltHmacKey = await crypto.subtle.importKey('raw', salt, hmacOpts, false, ['sign']);
	const prk = new Uint8Array(await crypto.subtle.sign('HMAC', saltHmacKey, masterKey));
	const prkHmacKey = await crypto.subtle.importKey('raw', prk, hmacOpts, false, ['sign']);
	const subKey = new Uint8Array(config.keyLen);
	let prev = new Uint8Array(0), written = 0, counter = 1;
	while (written < config.keyLen) {
		const input = concat_bytes(prev, SSchildkeyinfo, new Uint8Array([counter]));
		prev = new Uint8Array(await crypto.subtle.sign('HMAC', prkHmacKey, input));
		const copyLen = Math.min(prev.byteLength, config.keyLen - written);
		subKey.set(prev.subarray(0, copyLen), written);
		written += copyLen; counter += 1;
	}
	return crypto.subtle.importKey('raw', subKey, { name: 'AES-GCM', length: config.aesLength }, false, usages);
}

async function SSAEADencrypted(cryptoKey, nonceCounter, plaintext) {
	const iv = nonceCounter.slice();
	const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, cryptoKey, plaintext);
	SSNonce(nonceCounter);
	return new Uint8Array(ct);
}

async function SSAEADdecrypt(cryptoKey, nonceCounter, ciphertext) {
	const iv = nonceCounter.slice();
	const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv, tagLength: 128 }, cryptoKey, ciphertext);
	SSNonce(nonceCounter);
	return new Uint8Array(pt);
}

async function forwardataTCP(host, portNum, rawData, ws, respHeader, remoteConnWrapper, yourUUID, request = null, proxy_context = {}, trojanproxy = false, trojanproxyfirst_packetdata = null, connect = false) {
	const ctxproxyIP = proxy_context.proxyIP || '';
	const ctxproxytype = proxy_context.proxytype !== undefined ? proxy_context.proxytype : null;
	const ctxproxyglobal = proxy_context.proxyglobal !== undefined ? proxy_context.proxyglobal : false;
	const ctxproxyparam = proxy_context.proxyparam || {};
	const ctxproxy_fallback = proxy_context.proxy_fallback !== undefined ? proxy_context.proxy_fallback : true;
	let proxyarray = 0;
	log(`[TCPforward] target: ${host}:${portNum} | proxyIP: ${ctxproxyIP} | proxy_fallback: ${ctxproxy_fallback ? 'yes' : 'no'} | proxytype: ${ctxproxytype || 'proxyip'} | global: ${ctxproxyglobal ? 'yes' : 'no'}`);
	const connecttimeout = 1000;
	let proxysendfirst_packet = false;
	const TCPconnect = createrequestTCPconnect(request);
	const usetrojanproxy = trojanproxy && (proxy_context.trojanproxyaddress || null);
	const trojanproxytarget = usetrojanproxy ? proxy_context.trojanproxyaddress : null;
	const trojanproxydata = usetrojanproxy ? trojanproxydata(trojanproxyfirst_packetdata, rawData) : null;
	let sendresponseheader = respHeader;
	const responseheader = () => {
		const header = sendresponseheader;
		sendresponseheader = null;
		return header;
	};
	if (!Number.isInteger(remoteConnWrapper.generation)) remoteConnWrapper.generation = 0;

	const currentconnect = async (socket, generation, downlinkDrain, retryFunc = null) => {
		try { await downlinkDrain } catch (e) {
			if (remoteConnWrapper.downlinkDrain === downlinkDrain) remoteConnWrapper.downlinkDrain = Promise.resolve();
			try { socket?.close?.() } catch (_) { }
			if (remoteConnWrapper.generation === generation) closeSocketQuietly(ws);
			throw e;
		}
		if (remoteConnWrapper.downlinkDrain === downlinkDrain) remoteConnWrapper.downlinkDrain = Promise.resolve();
		const connectvalid = () => remoteConnWrapper.generation === generation && remoteConnWrapper.socket === socket;
		if (remoteConnWrapper.generation !== generation || ws.readyState !== WebSocket.OPEN) {
			try { socket?.close?.() } catch (e) { }
			if (remoteConnWrapper.generation === generation) remoteConnWrapper.socket = null;
			throw new Error('connection superseded or client closed');
		}
		remoteConnWrapper.socket = socket;
		if (connect) return socket;
		connectStreams(socket, ws, responseheader, retryFunc, connectvalid, remoteConnWrapper).catch(err => {
			if (!connectvalid()) return;
			log(`[TCPdownstream] processfailure: ${err?.message || err}`);
			try { socket?.close?.() } catch (e) { }
			closeSocketQuietly(ws);
		});
		return true;
	};

	async function connect(remoteSock, timeoutMs = connecttimeout) {
		await Promise.race([
			remoteSock.opened,
			new Promise((_, reject) => setTimeout(() => reject(new Error('connecttimeout')), timeoutMs))
		]);
	}

	async function openTCPconnect(address, port) {
		const remoteSock = TCPconnect({ hostname: address, port });
		try {
			await connect(remoteSock);
			return remoteSock;
		} catch (err) {
			try { remoteSock?.close?.() } catch (e) { }
			throw err;
		}
	}

	async function writefirst_packet(remoteSock, data) {
		if (validdata_length(data) <= 0) return;
		const writer = remoteSock.writable.getWriter();
		try { await writer.write(data_transformUint8Array(data)) }
		finally { try { writer.releaseLock() } catch (e) { } }
	}

	async function opencandidateconnect(candidate_list) {
		if (candidate_list.length === 1) {
			const candidate = candidate_list[0];
			return { socket: await openTCPconnect(candidate.hostname, candidate.port), candidate: candidate };
		}
		const attempts = candidate_list.map(candidate => openTCPconnect(candidate.hostname, candidate.port).then(socket => ({ socket, candidate: candidate })));
		let winner = null;
		try {
			winner = await Promise.any(attempts);
			return winner;
		} finally {
			if (winner) {
				for (const attempt of attempts) {
					attempt.then(({ socket }) => {
						if (socket !== winner.socket) {
							try { socket?.close?.() } catch (e) { }
						}
					}).catch(() => { });
				}
			}
		}
	}

	async function preloadcandidate_list(address, port) {
		if (!preload || isIPHostname(address)) return null;
		log(`[TCP] preloadon，startquery ${address} A/AAAA record`);
		const [aRecords, aaaaRecords] = await Promise.all([
			DoHquery(address, 'A'),
			DoHquery(address, 'AAAA')
		]);
		const ipv4List = [...new Set(aRecords.flatMap(r => {
			const data = r.data;
			return r.type === 1 && typeof data === 'string' && isIPv4(data) ? [data] : [];
		}))];
		const ipv6List = [...new Set(aaaaRecords.flatMap(r => {
			const data = r.data;
			return r.type === 28 && typeof data === 'string' && isIPHostname(data) ? [data] : [];
		}))];
		const up = Math.max(1, TCPconcurrent_dial | 0);
		const ipList = ipv4List.length >= up
			? ipv4List.slice(0, up)
			: ipv4List.concat(ipv6List.slice(0, up - ipv4List.length));
		const userecordtype = ipv4List.length > 0
			? (ipList.length > ipv4List.length ? 'A+AAAA' : 'A')
			: 'AAAA';
		if (ipList.length === 0) {
			log(`[TCP] ${address} A/AAAA availableparse_result，preloadunavailable，original hostname 。`);
			return null;
		}
		const selectedIPlist = ipList;
		log(`[TCP] ${address} Arecord:${ipv4List.length} AAAArecord:${ipv6List.length}，use${userecordtype}record， ${selectedIPlist.length}/${up}: ${selectedIPlist.join(', ')}`);
		return selectedIPlist.map((hostname, attempt) => ({ hostname, port, attempt, resolvedFrom: address }));
	}

	async function connectDirect(address, port, data = null, enablepreload = false) {
		const preloadcandidate_list = enablepreload ? await preloadcandidate_list(address, port) : null;
		const candidate_list = preloadcandidate_list || Array.from({ length: TCPconcurrent_dial }, (_, attempt) => ({ hostname: address, port, attempt }));
		log(preloadcandidate_list
			? `[TCP] ${candidate_list.length} : ${candidate_list.map(candidate => `${candidate.hostname}:${candidate.port}`).join(', ')}`
			: `[TCP] ${candidate_list.length} : ${address}:${port}`);
		let socket = null;
		try {
			const connectresult = await opencandidateconnect(candidate_list);
			socket = connectresult.socket;
			if (preloadcandidate_list) {
				const winner = connectresult.candidate;
				log(`[TCP] preloadresult: ${winner.hostname}:${winner.port} ，domain: ${winner.resolvedFrom || address}`);
			}
			await writefirst_packet(socket, data);
			return socket;
		} catch (err) {
			try { socket?.close?.() } catch (e) { }
			if (preloadcandidate_list) log(`[TCP] preloadfailure: ${err.message || err}`);
			throw err;
		}
	}

	async function connectProxyIP(address, port, data = null, all_proxy_array = null, enableproxyfailure = true) {
		if (all_proxy_array && all_proxy_array.length > 0) {
			const = Math.max(1, Math.floor(Number(proxyconcurrent_dial) || 1));
			for (let i = 0; i < all_proxy_array.length; i += ) {
				const candidate_list = [];
				for (let j = 0; j < && i + j < all_proxy_array.length; j++) {
					const = (proxyarray + i + j) % all_proxy_array.length;
					const [proxyaddress, proxyport] = all_proxy_array[];
					candidate_list.push({ hostname: proxyaddress, port: proxyport, index: });
				}
				let socket = null, candidate = null;
				try {
					log(`[proxyconnect] ${candidate_list.length} : ${candidate_list.map(candidate => `${candidate.hostname}:${candidate.port}`).join(', ')}`);
					const connectresult = await opencandidateconnect(candidate_list);
					socket = connectresult.socket;
					candidate = connectresult.candidate;
					await writefirst_packet(socket, data);
					log(`[proxyconnect] successconnect: ${candidate.hostname}:${candidate.port} (: ${candidate.index})`);
					proxyarray = candidate.index;
					return socket;
				} catch (err) {
					try { socket?.close?.() } catch (e) { }
					log(`[proxyconnect] connectfailure: ${err.message || err}`);
				}
			}
		}

		if (enableproxyfailure) return connectDirect(address, port, data, false);
		else {
			throw new Error('[proxyconnect] hasproxyconnectfailure，enableproxy_fallback，connect。');
		}
	}

	async function connecttoPry(sendfirst_packet = true) {
		if (remoteConnWrapper.connectingPromise) {
			await remoteConnWrapper.connectingPromise;
			return;
		}
		const { generation: currentconnectgeneration, downlinkDrain } = startTCPconnectgeneration(remoteConnWrapper);

		let currentsendfirst_packet = false, currentfirst_packetdata = null;
		if (usetrojanproxy) {
			if (sendfirst_packet && !proxysendfirst_packet && validdata_length(trojanproxyfirst_packetdata) > 0) {
				currentfirst_packetdata = trojanproxyfirst_packetdata;
				currentsendfirst_packet = validdata_length(rawData) > 0;
			} else {
				currentfirst_packetdata = trojanproxydata;
			}
		} else {
			currentsendfirst_packet = sendfirst_packet && !proxysendfirst_packet && validdata_length(rawData) > 0;
			currentfirst_packetdata = currentsendfirst_packet ? rawData : null;
		}

		const currentconnecttask = (async () => {
			let newSocket = null;
			try {
				if (usetrojanproxy) {
					log(`[trojanproxy] proxy: ${host}:${portNum}`);
					newSocket = await connecttrojanproxy(currentfirst_packetdata, TCPconnect, trojanproxytarget);
				} else if (ctxproxytype === 'socks5') {
					log(`[SOCKS5proxy] proxy: ${host}:${portNum}`);
					newSocket = await socks5Connect(host, portNum, currentfirst_packetdata, TCPconnect, ctxproxyparam);
				} else if (ctxproxytype === 'http') {
					log(`[HTTPproxy] proxy: ${host}:${portNum}`);
					newSocket = await httpConnect(host, portNum, currentfirst_packetdata, false, TCPconnect, ctxproxyparam);
				} else if (ctxproxytype === 'https') {
					log(`[HTTPSproxy] proxy: ${host}:${portNum}`);
					newSocket = isIPHostname(ctxproxyparam.hostname)
						? await httpsConnect(host, portNum, currentfirst_packetdata, TCPconnect, ctxproxyparam)
						: await httpConnect(host, portNum, currentfirst_packetdata, true, TCPconnect, ctxproxyparam);
				} else if (ctxproxytype === 'turn') {
					log(`[TURNproxy] proxy: ${host}:${portNum}`);
					newSocket = await turnConnect(ctxproxyparam, host, portNum, TCPconnect);
					if (validdata_length(currentfirst_packetdata) > 0) {
						const writer = newSocket.writable.getWriter();
						try { await writer.write(data_transformUint8Array(currentfirst_packetdata)) }
						finally { try { writer.releaseLock() } catch (e) { } }
					}
				} else if (ctxproxytype === 'sstp') {
					log(`[SSTPproxy] proxy: ${host}:${portNum}`);
					newSocket = await sstpConnect(ctxproxyparam, host, portNum, TCPconnect);
					if (validdata_length(currentfirst_packetdata) > 0) {
						const writer = newSocket.writable.getWriter();
						try { await writer.write(data_transformUint8Array(currentfirst_packetdata)) }
						finally { try { writer.releaseLock() } catch (e) { } }
					}
				} else {
					log(`[proxyconnect] proxy: ${host}:${portNum}`);
					const all_proxy_array = await parseaddressport(ctxproxyIP, host, yourUUID);
					newSocket = await connectProxyIP(`${dictionary[0]}.tp1.${dictionary[2]}.xyz`, 1, currentfirst_packetdata, all_proxy_array, ctxproxy_fallback);
				}
				await currentconnect(newSocket, currentconnectgeneration, downlinkDrain);
				if (currentsendfirst_packet) proxysendfirst_packet = true;
			} catch (err) {
				try { newSocket?.close?.() } catch (e) { }
				if (remoteConnWrapper.generation === currentconnectgeneration) {
					remoteConnWrapper.socket = null;
					closeSocketQuietly(ws);
					throw err;
				}
			}
		})();

		remoteConnWrapper.connectingPromise = currentconnecttask;
		try {
			await currentconnecttask;
		} finally {
			if (remoteConnWrapper.connectingPromise === currentconnecttask) {
				remoteConnWrapper.connectingPromise = null;
			}
		}
	}
	remoteConnWrapper.retryConnect = async () => connecttoPry(!proxysendfirst_packet);

	if (ctxproxytype && (ctxproxyglobal || SOCKS5whitelist.some(p => new RegExp(`^${p.replace(/\*/g, '.*')}$`, 'i').test(host)))) {
		log(`[TCPforward] enable SOCKS5/HTTP/HTTPS/TURN/SSTP globalproxy`);
		try {
			await connecttoPry();
			if (connect) return remoteConnWrapper.socket;
		} catch (err) {
			log(`[TCPforward] SOCKS5/HTTP/HTTPS/TURN/SSTP proxyconnectfailure: ${err.message}`);
			throw err;
		}
	} else {
		let generation = remoteConnWrapper.generation;
		try {
			log(`[TCPforward] : ${host}:${portNum}`);
			const generationconnect = startTCPconnectgeneration(remoteConnWrapper);
			generation = generationconnect.generation;
			const initialSocket = await connectDirect(host, portNum, rawData, true);
			await currentconnect(initialSocket, generation, generationconnect.downlinkDrain, async () => {
				if (remoteConnWrapper.generation !== generation || remoteConnWrapper.socket !== initialSocket) return;
				await connecttoPry();
			});
			if (connect) return initialSocket;
		} catch (err) {
			log(`[TCPforward] ${host}:${portNum} failure: ${err.message}`);
			if (remoteConnWrapper.generation !== generation) throw err;
			if (err instanceof Error && err.name === 'preloadparseempty') {
				closeSocketQuietly(ws);
				throw err;
			}
			if (ws.readyState !== WebSocket.OPEN) throw err;
			await connecttoPry();
			if (connect) return remoteConnWrapper.socket;
		}
	}
}

async function forwardataudp(udpChunk, webSocket, respHeader, request, response = null) {
	const requestdata = data_transformUint8Array(udpChunk);
	const requestbyte_count = requestdata.byteLength;
	log(`[UDPforward] DNS request: ${requestbyte_count}B -> 8.8.4.4:53`);
	try {
		const TCPconnect = createrequestTCPconnect(request);
		const tcpSocket = TCPconnect({ hostname: '8.8.4.4', port: 53 });
		let vlessHeader = respHeader;
		const writer = tcpSocket.writable.getWriter();
		await writer.write(requestdata);
		log(`[UDPforward] DNS requestwriteup: ${requestbyte_count}B`);
		writer.releaseLock();
		await tcpSocket.readable.pipeTo(new WritableStream({
			async write(chunk) {
				const originalresponse = data_transformUint8Array(chunk);
				log(`[UDPforward] DNS response: ${originalresponse.byteLength}B`);
				const result = response ? await response(originalresponse) : originalresponse;
				const sendlist = Array.isArray(result) ? result : [result];
				if (!sendlist.length) return;
				if (webSocket.readyState !== WebSocket.OPEN) return;
				for (const fragment of sendlist) {
					const forwardresponse = data_transformUint8Array(fragment);
					if (!forwardresponse.byteLength) continue;
					if (vlessHeader) {
						const response = new Uint8Array(vlessHeader.length + forwardresponse.byteLength);
						response.set(vlessHeader, 0);
						response.set(forwardresponse, vlessHeader.length);
						await WebSocketsend(webSocket, response.buffer);
						vlessHeader = null;
					} else {
						await WebSocketsend(webSocket, forwardresponse);
					}
				}
			},
		}));
	} catch (error) {
		log(`[UDPforward] DNS forwardfailure: ${error?.message || error}`);
	}
}

function closeSocketQuietly(socket) {
	try {
		if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CLOSING) {
			socket.close();
		}
	} catch (error) { }
}

function formatIdentifier(arr, offset = 0) {
	const hex = [...arr.slice(offset, offset + 16)].map(b => b.toString(16).padStart(2, '0')).join('');
	return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}`;
}

async function WebSocketsend(webSocket, payload) {
	const sendResult = webSocket.send(payload);
	if (sendResult && typeof sendResult.then === 'function') await sendResult;
}

function createGrain(, copymergeresult = false) {
	let queue = [];
	let header = 0;
	let byte_count = 0;
	let mergebuffer = null;

	const empty = () => header >= queue.length;
	const compressed = () => {
		if (header > 32 && header * 2 >= queue.length) {
			queue = queue.slice(header);
			header = 0;
		}
	};
	const = () => {
		if (empty()) return null;
		const item = queue[header];
		queue[header++] = undefined;
		byte_count -= item.chunk.byteLength;
		compressed();
		return item;
	};

	return {
		get byte_count() { return byte_count },
		get items() { return queue.length - header },
		get empty() { return empty() },
		clear(process = null) {
			if (process) {
				for (let i = header; i < queue.length; i++) {
					if (queue[i]) process(queue[i]);
				}
			}
			queue = [];
			header = 0;
			byte_count = 0;
		},
		(item) {
			if (!item?.chunk?.byteLength) return false;
			queue.push(item);
			byte_count += item.chunk.byteLength;
			return true;
		},
		merge() {
			const first = ();
			if (!first) return null;
			const items = [first];
			if (empty() || first.chunk.byteLength >= ) return { chunk: first.chunk, items };

			let totalBytes = first.chunk.byteLength;
			let end = header;
			while (end < queue.length) {
				const nextBytes = totalBytes + queue[end].chunk.byteLength;
				if (nextBytes > ) break;
				totalBytes = nextBytes;
				end++;
			}
			if (end === header) return { chunk: first.chunk, items };

			const output = (mergebuffer ||= new Uint8Array());
			output.set(first.chunk, 0);
			let offset = first.chunk.byteLength;
			while (header < end) {
				const next = queue[header];
				queue[header++] = undefined;
				byte_count -= next.chunk.byteLength;
				items.push(next);
				output.set(next.chunk, offset);
				offset += next.chunk.byteLength;
			}
			compressed();
			const bundled = output.subarray(0, totalBytes);
			return { chunk: copymergeresult ? bundled.slice() : bundled, items };
		}
	};
}

function createuplineGrainmerge(targetbytes = uplinemergetargetbytes) {
	const identity = typeof IdentityTransformStream !== 'undefined'
		? new IdentityTransformStream()
		: new TransformStream();
	const writer = identity.writable.getWriter();
	const buffer = new Uint8Array(targetbytes);
	let bufferlong = 0;
	let timer = null;
	let = null;
	let = Promise.resolve();

	const cleanuptimer = () => {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	};

	const line = async (chunk) => {
		if () await ;
		 = writer.write(chunk);
		try { await } finally { = null; }
	};

	const = async () => {
		if (bufferlong) {
			const chunk = buffer.slice(0, bufferlong);
			bufferlong = 0;
			await line(chunk);
		}
	};

	const = () => {
		 = .then(() => ()).catch(() => { });
	};

	const timer = () => {
		if (timer) return;
		timer = setTimeout(() => {
			timer = null;
			();
		}, 1);
	};

	return {
		readable: identity.readable,
		write: async (chunk) => {
			const data = data_transformUint8Array(chunk);
			if (!data.byteLength) return;
			if (data.byteLength >= targetbytes) {
				cleanuptimer();
				if (bufferlong) await ();
				await line(data);
				return;
			}
			if (bufferlong + data.byteLength >= targetbytes) {
				const output = new Uint8Array(bufferlong + data.byteLength);
				output.set(buffer.subarray(0, bufferlong), 0);
				output.set(data, bufferlong);
				bufferlong = 0;
				cleanuptimer();
				await line(output);
			} else {
				buffer.set(data, bufferlong);
				bufferlong += data.byteLength;
				timer();
			}
		},
		end: async () => {
			cleanuptimer();
			try {
				await ;
				await ();
				await writer.close();
			} finally {
				try { writer.releaseLock() } catch (e) { }
			}
		}
	};
}

function createuplinewritequeue({ getwrite, getconnecttask = null, releasewrite, retryconnect, closeconnect, name = 'uplinequeue' }) {
	const grain = createGrain(uplinemergetargetbytes);
	let draining = false;
	let closed = false;
	let idleResolvers = [];
	let activeCompletions = null;

	const settleCompletions = (completions, err = null) => {
		if (!completions) return;
		for (const completion of completions) {
			if (err) completion.reject(err);
			else completion.resolve();
		}
	};

	const resolveIdle = () => {
		if (grain.byte_count || draining || !idleResolvers.length) return;
		const resolvers = idleResolvers;
		idleResolvers = [];
		for (const resolve of resolvers) resolve();
	};

	const clear = (err = null) => {
		const closeErr = err || (closed ? new Error(`${name}: queue closed`) : null);
		if (closeErr) {
			grain.clear(item => settleCompletions(item.completions, closeErr));
			settleCompletions(activeCompletions, closeErr);
			activeCompletions = null;
		} else grain.clear();
		resolveIdle();
	};

	const bundle = () => {
		const packed = grain.merge();
		if (!packed) return null;
		let allowRetry = true;
		let completions = null;
		for (const item of packed.items) {
			allowRetry = allowRetry && item.allowRetry;
			if (item.completions) completions = completions ? completions.concat(item.completions) : item.completions;
		}
		return { chunk: packed.chunk, allowRetry, completions };
	};

	const availablewrite = async () => {
		let writer = getwrite();
		if (writer) return writer;
		const connectionTask = getconnecttask?.();
		if (connectionTask) await connectionTask;
		return getwrite();
	};

	const drain = async () => {
		if (draining || closed) return;
		draining = true;
		try {
			for (; ;) {
				if (closed) break;
				const item = bundle();
				if (!item) break;
				const completions = item.completions || null;
				activeCompletions = completions;
				try {
					let writer = await availablewrite();
					if (closed) break;
					if (!writer) throw new Error(`${name}: remote writer unavailable`);
					try {
						await writer.write(item.chunk);
					} catch (err) {
						releasewrite?.();
						if (closed) break;
						if (!item.allowRetry || typeof retryconnect !== 'function') throw err;
						await retryconnect();
						if (closed) break;
						writer = getwrite();
						if (!writer) throw err;
						await writer.write(item.chunk);
					}
					settleCompletions(completions);
				} catch (err) {
					settleCompletions(completions, err);
					throw err;
				} finally {
					if (activeCompletions === completions) activeCompletions = null;
				}
			}
		} catch (err) {
			closed = true;
			clear(err);
			log(`[${name}] writefailure: ${err?.message || err}`);
			try { closeconnect?.(err) } catch (_) { }
		} finally {
			draining = false;
			if (!closed && !grain.empty) drain();
			else resolveIdle();
		}
	};

	const enqueue = (data, allowRetry = true, waitForFlush = false) => {
		if (closed) return false;
		if (!getwrite() && !getconnecttask?.()) return false;
		const chunk = data_transformUint8Array(data);
		if (!chunk.byteLength) return true;
		const nextBytes = grain.byte_count + chunk.byteLength;
		const nextItems = grain.items + 1;
		if (nextBytes > uplinequeuemaxbytes || nextItems > uplinequeuemaxitems) {
			closed = true;
			const err = Object.assign(new Error(`${name}: upload queue overflow (${nextBytes}B/${nextItems})`), { isQueueOverflow: true });
			clear(err);
			log(`[${name}] queue，closeconnect`);
			try { closeconnect?.(err) } catch (_) { }
			throw err;
		}
		let completionPromise = null;
		let completions = null;
		if (waitForFlush) {
			completions = [];
			completionPromise = new Promise((resolve, reject) => completions.push({ resolve, reject }));
		}
		grain.({ chunk, allowRetry, completions });
		if (!draining) drain();
		return waitForFlush ? completionPromise.then(() => true) : true;
	};

	return {
		write(data, allowRetry = true) {
			return enqueue(data, allowRetry, false);
		},
		write(data, allowRetry = true) {
			return enqueue(data, allowRetry, true);
		},
		async empty() {
			if (!grain.byte_count && !draining) return;
			await new Promise(resolve => idleResolvers.push(resolve));
		},
		clear() {
			closed = true;
			clear();
		}
	};
}

function createdownstreamGrainsend(webSocket, headerData = null, isActive = null) {
	const packetCap = downstreamGrainbytes;
	const tailBytes = downstreamGrainfooterpartthreshold;
	const grain = createGrain(packetCap, true);
	let header = typeof headerData === 'function' ? null : headerData;
	const getresponseheader = typeof headerData === 'function' ? headerData : () => {
		const value = header;
		header = null;
		return value;
	};
	let flushTimer = null;
	let generation = 0;
	let scheduledGeneration = 0;
	let waitRounds = 0;
	let flushPromise = null;
	let directSendPromise = null;
	let empty = false;
	let stopstart = false;
	let activesend = 0;
	let active = 0;
	let activesenderror = null;
	let activesend = [];
	const activesenddone = () => {
		if (!activesend && !active) return Promise.resolve();
		return new Promise(resolve => activesend.push(resolve));
	};
	const marksenddone = () => {
		if (activesend || active || !activesend.length) return;
		const resolvers = activesend;
		activesend = [];
		for (const resolve of resolvers) resolve();
	};
	const checkactivesenderror = () => {
		if (!activesenderror) return;
		const err = activesenderror;
		grain.clear();
		throw err;
	};
	const currentsendvalid = () => empty || !isActive || isActive();
	const closeactiveconnect = () => {
		if (currentsendvalid()) closeSocketQuietly(webSocket);
	};

	const sendoriginal = async (chunk) => {
		if (!currentsendvalid()) return;
		if (webSocket.readyState !== WebSocket.OPEN) throw new Error('ws.readyState is not open');
		chunk = responseheader(chunk);
		await WebSocketsend(webSocket, chunk);
	};

	const linesendoriginal = async (chunk) => {
		while (directSendPromise) await directSendPromise;
		const sendTask = sendoriginal(chunk);
		directSendPromise = sendTask;
		try { await sendTask }
		finally {
			if (directSendPromise === sendTask) directSendPromise = null;
		}
	};

	const responseheader = (chunk) => {
		const responseHeader = getresponseheader();
		if (!responseHeader) return chunk;
		const merged = new Uint8Array(responseHeader.length + chunk.byteLength);
		merged.set(responseHeader, 0);
		merged.set(chunk, responseHeader.length);
		return merged;
	};

	const flush = async () => {
		while (flushPromise) await flushPromise;
		if (flushTimer) clearTimeout(flushTimer);
		flushTimer = null;
		waitRounds = 0;
		if (!currentsendvalid()) {
			grain.clear();
			return;
		}
		const sendtask = (async () => {
			for (; ;) {
				if (!currentsendvalid()) {
					grain.clear();
					break;
				}
				const packed = grain.merge();
				if (!packed) break;
				await linesendoriginal(packed.chunk);
			}
		})();
		flushPromise = sendtask.catch(err => {
			activesenderror ||= err;
			throw err;
		}).finally(() => { flushPromise = null });
		return flushPromise;
	};

	const scheduleFlush = () => {
		if (!currentsendvalid()) {
			grain.clear();
			return;
		}
		if (grain.empty || flushTimer) return;
		if (grain.byte_count >= packetCap || packetCap - grain.byte_count < tailBytes) {
			flush().catch(closeactiveconnect);
			return;
		}
		flushTimer = setTimeout(() => {
			flushTimer = null;
			if (!currentsendvalid()) {
				grain.clear();
				return;
			}
			if (grain.empty) return;
			if (grain.byte_count >= packetCap || packetCap - grain.byte_count < tailBytes) {
				flush().catch(closeactiveconnect);
				return;
			}
			if (waitRounds < downstreamGrainmax && (generation !== scheduledGeneration || grain.byte_count < downstreamGrainlowbytes)) {
				waitRounds++;
				scheduledGeneration = generation;
				scheduleFlush();
				return;
			}
			flush().catch(closeactiveconnect);
		}, 1);
	};

	return {
		async send(data) {
			if (stopstart || !currentsendvalid()) return;
			active++;
			try {
				const chunk = data_transformUint8Array(data);
				if (!chunk.byteLength) return;
				await linesendoriginal(chunk);
			} catch (err) {
				activesenderror ||= err;
				throw err;
			} finally {
				active--;
				marksenddone();
			}
		},
		async send(data) {
			if (stopstart || !currentsendvalid()) return;
			activesend++;
			try {
				const chunk = data_transformUint8Array(data);
				if (!chunk.byteLength) return;
				let offset = 0;
				const totalBytes = chunk.byteLength;
				while (offset < totalBytes) {
					const remainingBytes = totalBytes - offset;
					if (grain.empty && remainingBytes >= packetCap) {
						const sendBytes = Math.min(packetCap, remainingBytes);
						const view = offset || sendBytes !== totalBytes ? chunk.subarray(offset, offset + sendBytes) : chunk;
						await linesendoriginal(view);
						offset += sendBytes;
						continue;
					}
					const copyBytes = Math.min(packetCap - grain.byte_count, totalBytes - offset);
					if (!copyBytes) {
						await flush();
						continue;
					}
					grain.({ chunk: offset || copyBytes !== totalBytes ? chunk.subarray(offset, offset + copyBytes) : chunk });
					offset += copyBytes;
					generation++;
					if (grain.byte_count >= packetCap || packetCap - grain.byte_count < tailBytes) await flush();
					else scheduleFlush();
				}
			} catch (err) {
				activesenderror ||= err;
				throw err;
			} finally {
				activesend--;
				marksenddone();
			}
		},
		flush,
		async stoprefresh() {
			if (stopstart) {
				await activesenddone();
				while (directSendPromise) await directSendPromise;
				checkactivesenderror();
				await flush();
				return;
			}
			stopstart = true;
			empty = true;
			if (flushTimer) clearTimeout(flushTimer);
			flushTimer = null;
			await activesenddone();
			while (directSendPromise) await directSendPromise;
			checkactivesenderror();
			await flush();
		}
	};
}

async function connectStreams(remoteSocket, webSocket, headerData, retryFunc, isCurrentSocket = null, remoteConnWrapper = null) {
	let header = headerData, hasData = false, reader, useBYOB = false, readError = null;
	const BYOBreadup = 64 * 1024;
	const currentconnectvalid = () => !isCurrentSocket || isCurrentSocket();
	const downstreamsend = createdownstreamGrainsend(webSocket, header, currentconnectvalid);
	header = null;
	const downstream = { stoprefresh: () => downstreamsend.stoprefresh() };
	if (remoteConnWrapper) remoteConnWrapper.downlinkController = downstream;
	try { remoteSocket.closed?.catch?.(() => { }) } catch (e) { }

	try { reader = remoteSocket.readable.getReader({ mode: 'byob' }); useBYOB = true }
	catch (e) { reader = remoteSocket.readable.getReader() }

	try {
		if (!useBYOB) {
			while (true) {
				const { done, value } = await reader.read();
				if (!currentconnectvalid()) break;
				if (done) break;
				if (!value || value.byteLength === 0) continue;
				hasData = true;
				if (value.byteLength >= downstreamGrainbytes) {
					await downstreamsend.flush();
					await downstreamsend.send(value);
				} else {
					await downstreamsend.send(value);
				}
			}
		} else {
			let readBuffer = new ArrayBuffer(BYOBreadup);
			while (true) {
				const { done, value } = await reader.read(new Uint8Array(readBuffer, 0, BYOBreadup));
				if (!currentconnectvalid()) break;
				if (done) break;
				if (!value || value.byteLength === 0) continue;
				hasData = true;
				if (value.byteLength >= downstreamGrainbytes) {
					await downstreamsend.flush();
					await downstreamsend.send(value);
					readBuffer = new ArrayBuffer(BYOBreadup);
				} else {
					await downstreamsend.send(value.slice());
					readBuffer = value.buffer.byteLength >= BYOBreadup ? value.buffer : new ArrayBuffer(BYOBreadup);
				}
			}
		}
		if (currentconnectvalid()) await downstreamsend.flush();
	} catch (err) { readError = err }
	finally {
		if (currentconnectvalid() && webSocket.readyState === WebSocket.OPEN) {
			try { await downstreamsend.stoprefresh() } catch (err) { readError ||= err }
		}
		if (remoteConnWrapper?.downlinkController === downstream) remoteConnWrapper.downlinkController = null;
		try { await reader.cancel() } catch (e) { }
		try { reader.releaseLock() } catch (e) { }
		try { remoteSocket.close() } catch (e) { }
	}
	if (!hasData && retryFunc && webSocket.readyState === WebSocket.OPEN && currentconnectvalid()) {
		try {
			await retryFunc();
			return;
		} catch (err) {
			readError ||= err;
		}
	}
	if (!currentconnectvalid()) return;
	if (readError) log(`[TCPdownstream] readfailure: ${readError?.message || readError}`);
	closeSocketQuietly(webSocket);
}

function isSpeedTestSite(hostname) {
	const speedTestDomains = ['speed.cloudflare.com', 'cp.cloudflare.com'];
	hostname = hostname.toLowerCase();
	return speedTestDomains.some(domain => hostname === domain || hostname.endsWith('.' + domain));
}

function local204response(respHeader = null) {
	const local204response = new TextEncoder().encode(
		'HTTP/1.1 204 No Content\r\n' +
		'Content-Length: 0\r\n' +
		'Connection: close\r\n' +
		'\r\n'
	);
	if (validdata_length(respHeader) === 0) return local204response;
	const protocolresponseheader = data_transformUint8Array(respHeader);
	const response = new Uint8Array(protocolresponseheader.byteLength + local204response.byteLength);
	response.set(protocolresponseheader, 0);
	response.set(local204response, protocolresponseheader.byteLength);
	log(`[TCPforward] local204response: ${response.byteLength}B`);
	return response;
}

function WSlocal204response(respHeader = null) {
	const WSlocal204response = new TextEncoder().encode(
		'HTTP/1.1 204 No Content\r\n' +
		'Content-Length: 0\r\n' +
		'Connection: keep-alive\r\n' +
		'\r\n'
	);
	if (validdata_length(respHeader) === 0) return WSlocal204response;
	const protocolresponseheader = data_transformUint8Array(respHeader);
	const response = new Uint8Array(protocolresponseheader.byteLength + WSlocal204response.byteLength);
	response.set(protocolresponseheader, 0);
	response.set(WSlocal204response, protocolresponseheader.byteLength);
	return response;
}

async function socks5Connect(targetHost, targetPort, initialData, TCPconnect, parsedSocks5) {
	const { username, password, hostname, port } = parsedSocks5 || {};
	const socket = TCPconnect({ hostname, port }), writer = socket.writable.getWriter(), reader = socket.readable.getReader();
	try {
		const authMethods = username && password ? new Uint8Array([0x05, 0x02, 0x00, 0x02]) : new Uint8Array([0x05, 0x01, 0x00]);
		await writer.write(authMethods);
		let response = await reader.read();
		if (response.done || response.value.byteLength < 2) throw new Error('S5 method selection failed');

		const selectedMethod = new Uint8Array(response.value)[1];
		if (selectedMethod === 0x02) {
			if (!username || !password) throw new Error('S5 requires authentication');
			const userBytes = new TextEncoder().encode(username), passBytes = new TextEncoder().encode(password);
			const authPacket = new Uint8Array([0x01, userBytes.length, ...userBytes, passBytes.length, ...passBytes]);
			await writer.write(authPacket);
			response = await reader.read();
			if (response.done || new Uint8Array(response.value)[1] !== 0x00) throw new Error('S5 authentication failed');
		} else if (selectedMethod !== 0x00) throw new Error(`S5 unsupported auth method: ${selectedMethod}`);

		const hostBytes = new TextEncoder().encode(targetHost);
		const connectPacket = new Uint8Array([0x05, 0x01, 0x00, 0x03, hostBytes.length, ...hostBytes, targetPort >> 8, targetPort & 0xff]);
		await writer.write(connectPacket);
		response = await reader.read();
		if (response.done || new Uint8Array(response.value)[1] !== 0x00) throw new Error('S5 connection failed');

		if (validdata_length(initialData) > 0) await writer.write(initialData);
		writer.releaseLock(); reader.releaseLock();
		return socket;
	} catch (error) {
		try { writer.releaseLock() } catch (e) { }
		try { reader.releaseLock() } catch (e) { }
		try { socket.close() } catch (e) { }
		throw error;
	}
}

async function httpConnect(targetHost, targetPort, initialData, HTTPSproxy = false, TCPconnect, parsedSocks5) {
	const { username, password, hostname, port } = parsedSocks5 || {};
	const socket = HTTPSproxy
		? TCPconnect({ hostname, port }, { secureTransport: 'on', allowHalfOpen: false })
		: TCPconnect({ hostname, port });
	const writer = socket.writable.getWriter(), reader = socket.readable.getReader();
	const encoder = new TextEncoder();
	const decoder = new TextDecoder();
	try {
		if (HTTPSproxy) await socket.opened;

		const auth = username && password ? `Proxy-Authorization: Basic ${btoa(`${username}:${password}`)}\r\n` : '';
		const request = `CONNECT ${targetHost}:${targetPort} HTTP/1.1\r\nHost: ${targetHost}:${targetPort}\r\n${auth}User-Agent: Mozilla/5.0\r\nConnection: keep-alive\r\n\r\n`;
		await writer.write(encoder.encode(request));
		writer.releaseLock();

		let responseBuffer = new Uint8Array(0), headerEndIndex = -1, bytesRead = 0;
		while (headerEndIndex === -1 && bytesRead < 8192) {
			const { done, value } = await reader.read();
			if (done || !value) throw new Error(`${HTTPSproxy ? 'HTTPS' : 'HTTP'} proxyback CONNECT responsefrontcloseconnect`);
			responseBuffer = new Uint8Array([...responseBuffer, ...value]);
			bytesRead = responseBuffer.length;
			const crlfcrlf = responseBuffer.findIndex((_, i) => i < responseBuffer.length - 3 && responseBuffer[i] === 0x0d && responseBuffer[i + 1] === 0x0a && responseBuffer[i + 2] === 0x0d && responseBuffer[i + 3] === 0x0a);
			if (crlfcrlf !== -1) headerEndIndex = crlfcrlf + 4;
		}

		if (headerEndIndex === -1) throw new Error('proxy CONNECT responseheaderlonginvalid');
		const statusMatch = decoder.decode(responseBuffer.slice(0, headerEndIndex)).split('\r\n')[0].match(/HTTP\/\d\.\d\s+(\d+)/);
		const statusCode = statusMatch ? parseInt(statusMatch[1], 10) : NaN;
		if (!Number.isFinite(statusCode) || statusCode < 200 || statusCode >= 300) throw new Error(`Connection failed: HTTP ${statusCode}`);

		reader.releaseLock();

		if (validdata_length(initialData) > 0) {
			const remote_writer = socket.writable.getWriter();
			await remote_writer.write(initialData);
			remote_writer.releaseLock();
		}

		if (bytesRead > headerEndIndex) {
			const { readable, writable } = new TransformStream();
			const transformWriter = writable.getWriter();
			await transformWriter.write(responseBuffer.subarray(headerEndIndex, bytesRead));
			transformWriter.releaseLock();
			socket.readable.pipeTo(writable).catch(() => { });
			return { readable, writable: socket.writable, closed: socket.closed, close: () => socket.close() };
		}

		return socket;
	} catch (error) {
		try { writer.releaseLock() } catch (e) { }
		try { reader.releaseLock() } catch (e) { }
		try { socket.close() } catch (e) { }
		throw error;
	}
}

async function httpsConnect(targetHost, targetPort, initialData, TCPconnect, parsedSocks5) {
	const { username, password, hostname, port } = parsedSocks5 || {};
	const encoder = new TextEncoder();
	const decoder = new TextDecoder();
	let tlsSocket = null;
	const tlsServerName = isIPHostname(hostname) ? '' : stripIPv6Brackets(hostname);
	const openHTTPSproxyTLS = async (allowChacha = false) => {
		const proxySocket = TCPconnect({ hostname, port });
		try {
			await proxySocket.opened;
			const socket = new TlsClient(proxySocket, { serverName: tlsServerName, insecure: true, allowChacha });
			await socket.handshake();
			log(`[HTTPSproxy] TLS: ${socket.isTls13 ? '1.3' : '1.2'} | Cipher: 0x${socket.cipherSuite.toString(16)}${socket.cipherConfig?.chacha ? ' (ChaCha20)' : ' (AES-GCM)'}`);
			return socket;
		} catch (error) {
			try { proxySocket.close() } catch (e) { }
			throw error;
		}
	};
	try {
		try {
			tlsSocket = await openHTTPSproxyTLS(false);
		} catch (error) {
			if (!/cipher|handshake|TLS Alert|ServerHello|Finished|Unsupported|Missing TLS/i.test(error?.message || `${error || ''}`)) throw error;
			log(`[HTTPSproxy] AES-GCM TLS failure， ChaCha20 : ${error?.message || error}`);
			tlsSocket = await openHTTPSproxyTLS(true);
		}

		const auth = username && password ? `Proxy-Authorization: Basic ${btoa(`${username}:${password}`)}\r\n` : '';
		const request = `CONNECT ${targetHost}:${targetPort} HTTP/1.1\r\nHost: ${targetHost}:${targetPort}\r\n${auth}User-Agent: Mozilla/5.0\r\nConnection: keep-alive\r\n\r\n`;
		await tlsSocket.write(encoder.encode(request));

		let responseBuffer = new Uint8Array(0), headerEndIndex = -1, bytesRead = 0;
		while (headerEndIndex === -1 && bytesRead < 8192) {
			const value = await tlsSocket.read();
			if (!value) throw new Error('HTTPS proxyback CONNECT responsefrontcloseconnect');
			responseBuffer = concat_bytes(responseBuffer, value);
			bytesRead = responseBuffer.length;
			const crlfcrlf = responseBuffer.findIndex((_, i) => i < responseBuffer.length - 3 && responseBuffer[i] === 0x0d && responseBuffer[i + 1] === 0x0a && responseBuffer[i + 2] === 0x0d && responseBuffer[i + 3] === 0x0a);
			if (crlfcrlf !== -1) headerEndIndex = crlfcrlf + 4;
		}

		if (headerEndIndex === -1) throw new Error('HTTPS proxy CONNECT responseheaderlonginvalid');
		const statusMatch = decoder.decode(responseBuffer.slice(0, headerEndIndex)).split('\r\n')[0].match(/HTTP\/\d\.\d\s+(\d+)/);
		const statusCode = statusMatch ? parseInt(statusMatch[1], 10) : NaN;
		if (!Number.isFinite(statusCode) || statusCode < 200 || statusCode >= 300) throw new Error(`Connection failed: HTTP ${statusCode}`);

		if (validdata_length(initialData) > 0) await tlsSocket.write(data_transformUint8Array(initialData));
		const bufferedData = bytesRead > headerEndIndex ? responseBuffer.subarray(headerEndIndex, bytesRead) : null;
		let closedSettled = false, resolveClosed, rejectClosed;
		const settleClosed = (settle, value) => {
			if (!closedSettled) {
				closedSettled = true;
				settle(value);
			}
		};
		const closed = new Promise((resolve, reject) => {
			resolveClosed = resolve;
			rejectClosed = reject;
		});
		const close = () => {
			try { tlsSocket.close() } catch (e) { }
			settleClosed(resolveClosed);
		};
		const readable = new ReadableStream({
			async start(controller) {
				try {
					if (validdata_length(bufferedData) > 0) controller.enqueue(bufferedData);
					while (true) {
						const data = await tlsSocket.read();
						if (!data) break;
						if (data.byteLength > 0) controller.enqueue(data);
					}
					try { controller.close() } catch (e) { }
					settleClosed(resolveClosed);
				} catch (error) {
					try { controller.error(error) } catch (e) { }
					settleClosed(rejectClosed, error);
				}
			},
			cancel() {
				close();
			}
		});
		const writable = new WritableStream({
			async write(chunk) {
				await tlsSocket.write(data_transformUint8Array(chunk));
			},
			close,
			abort(error) {
				close();
				if (error) settleClosed(rejectClosed, error);
			}
		});
		return { readable, writable, closed, close };
	} catch (error) {
		try { tlsSocket?.close() } catch (e) { }
		throw error;
	}
}

function createrequestTCPconnect(request) {
	const requestcorrect = /** @type {any} */ (request);
	const fetcher = requestcorrect?.fetcher;
	if (!fetcher || typeof fetcher.connect !== 'function') throw new Error('request.fetcher.connect unavailable');
	return (options, init) => init === undefined ? fetcher.connect(options) : fetcher.connect(options, init);
}
////////////////////////////////////////////TLSClient by: @Alexandre_Kojeve////////////////////////////////////////////////
const TLS_VERSION_10 = 769, TLS_VERSION_12 = 771, TLS_VERSION_13 = 772;
const CONTENT_TYPE_CHANGE_CIPHER_SPEC = 20, CONTENT_TYPE_ALERT = 21, CONTENT_TYPE_HANDSHAKE = 22, CONTENT_TYPE_APPLICATION_DATA = 23;
const HANDSHAKE_TYPE_CLIENT_HELLO = 1, HANDSHAKE_TYPE_SERVER_HELLO = 2, HANDSHAKE_TYPE_NEW_SESSION_TICKET = 4, HANDSHAKE_TYPE_ENCRYPTED_EXTENSIONS = 8, HANDSHAKE_TYPE_CERTIFICATE = 11, HANDSHAKE_TYPE_SERVER_KEY_EXCHANGE = 12, HANDSHAKE_TYPE_CERTIFICATE_REQUEST = 13, HANDSHAKE_TYPE_SERVER_HELLO_DONE = 14, HANDSHAKE_TYPE_CERTIFICATE_VERIFY = 15, HANDSHAKE_TYPE_CLIENT_KEY_EXCHANGE = 16, HANDSHAKE_TYPE_FINISHED = 20, HANDSHAKE_TYPE_KEY_UPDATE = 24;
const EXT_SERVER_NAME = 0, EXT_SUPPORTED_GROUPS = 10, EXT_EC_POINT_FORMATS = 11, EXT_SIGNATURE_ALGORITHMS = 13, EXT_APPLICATION_LAYER_PROTOCOL_NEGOTIATION = 16, EXT_SUPPORTED_VERSIONS = 43, EXT_PSK_KEY_EXCHANGE_MODES = 45, EXT_KEY_SHARE = 51;

const ALERT_CLOSE_NOTIFY = 0, ALERT_LEVEL_WARNING = 1, ALERT_UNRECOGNIZED_NAME = 112;
const shouldIgnoreTlsAlert = fragment => fragment?.[0] === ALERT_LEVEL_WARNING && fragment?.[1] === ALERT_UNRECOGNIZED_NAME;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const EMPTY_BYTES = new Uint8Array(0);

const CIPHER_SUITES_BY_ID = new Map([
	[4865, { id: 4865, keyLen: 16, ivLen: 12, hash: "SHA-256", tls13: !0 }],
	[4866, { id: 4866, keyLen: 32, ivLen: 12, hash: "SHA-384", tls13: !0 }],
	[4867, { id: 4867, keyLen: 32, ivLen: 12, hash: "SHA-256", tls13: !0, chacha: !0 }],
	[49199, { id: 49199, keyLen: 16, ivLen: 4, hash: "SHA-256", kex: "ECDHE" }],
	[49200, { id: 49200, keyLen: 32, ivLen: 4, hash: "SHA-384", kex: "ECDHE" }],
	[52392, { id: 52392, keyLen: 32, ivLen: 12, hash: "SHA-256", kex: "ECDHE", chacha: !0 }],
	[49195, { id: 49195, keyLen: 16, ivLen: 4, hash: "SHA-256", kex: "ECDHE" }],
	[49196, { id: 49196, keyLen: 32, ivLen: 4, hash: "SHA-384", kex: "ECDHE" }],
	[52393, { id: 52393, keyLen: 32, ivLen: 12, hash: "SHA-256", kex: "ECDHE", chacha: !0 }]
]);
const GROUPS_BY_ID = new Map([[29, "X25519"], [23, "P-256"]]);
const SUPPORTED_SIGNATURE_ALGORITHMS = [2052, 2053, 2054, 1025, 1281, 1537, 1027, 1283, 1539];

const tlsBytes = (...parts) => {
	const flattenBytes = values => values.flatMap(value => value instanceof Uint8Array ? [...value] : Array.isArray(value) ? flattenBytes(value) : "number" == typeof value ? [value] : []);
	return new Uint8Array(flattenBytes(parts))
};
const uint16be = value => [value >> 8 & 255, 255 & value];
const readUint16 = (buffer, offset) => buffer[offset] << 8 | buffer[offset + 1];
const readUint24 = (buffer, offset) => buffer[offset] << 16 | buffer[offset + 1] << 8 | buffer[offset + 2];
const concatBytes = (...chunks) => {
	const nonEmptyChunks = chunks.filter((chunk => chunk && chunk.length > 0)),
		length = nonEmptyChunks.reduce(((total, chunk) => total + chunk.length), 0),
		result = new Uint8Array(length);
	let offset = 0;
	for (const chunk of nonEmptyChunks) result.set(chunk, offset), offset += chunk.length;
	return result
};
const randomBytes = length => crypto.getRandomValues(new Uint8Array(length));
const constantTimeEqual = (left, right) => {
	if (!left || !right || left.length !== right.length) return !1;
	let diff = 0; for (let index = 0; index < left.length; index++) diff |= left[index] ^ right[index];
	return 0 === diff
};
const hashByteLength = hash => "SHA-512" === hash ? 64 : "SHA-384" === hash ? 48 : 32;
async function hmac(hash, key, data) {
	const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash }, !1, ["sign"]);
	return new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, data))
}
async function digestBytes(hash, data) { return new Uint8Array(await crypto.subtle.digest(hash, data)) }
async function tls12Prf(secret, label, seed, length, hash = "SHA-256") {
	const labelSeed = concatBytes(textEncoder.encode(label), seed);
	let output = new Uint8Array(0),
		currentA = labelSeed;
	for (; output.length < length;) {
		currentA = await hmac(hash, secret, currentA);
		const block = await hmac(hash, secret, concatBytes(currentA, labelSeed));
		output = concatBytes(output, block)
	}
	return output.slice(0, length)
}
async function hkdfExtract(hash, salt, inputKeyMaterial) {
	return salt && salt.length || (salt = new Uint8Array(hashByteLength(hash))), hmac(hash, salt, inputKeyMaterial)
}
async function hkdfExpandLabel(hash, secret, label, context, length) {
	const fullLabel = textEncoder.encode("tls13 " + label);
	return async function (hash, secret, info, length) {
		const hashLen = hashByteLength(hash),
			roundCount = Math.ceil(length / hashLen);
		let output = new Uint8Array(0),
			previousBlock = new Uint8Array(0);
		for (let round = 1; round <= roundCount; round++) previousBlock = await hmac(hash, secret, concatBytes(previousBlock, info, [round])), output = concatBytes(output, previousBlock);
		return output.slice(0, length)
	}(hash, secret, tlsBytes(uint16be(length), fullLabel.length, fullLabel, context.length, context), length)
}
async function generateKeyShare(group = "P-256") {
	const algorithm = "X25519" === group ? { name: "X25519" } : { name: "ECDH", namedCurve: group };
	const keyPair = /** @type {CryptoKeyPair} */ (await crypto.subtle.generateKey(algorithm, !0, ["deriveBits"]));
	const publicKeyRaw = /** @type {ArrayBuffer} */ (await crypto.subtle.exportKey("raw", keyPair.publicKey));
	return { keyPair, publicKeyRaw: new Uint8Array(publicKeyRaw) }
}
async function deriveSharedSecret(privateKey, peerPublicKey, group = "P-256") {
	const algorithm = "X25519" === group ? { name: "X25519" } : { name: "ECDH", namedCurve: group },
		peerKey = await crypto.subtle.importKey("raw", peerPublicKey, algorithm, !1, []),
		bits = "P-384" === group ? 384 : "P-521" === group ? 528 : 256;
	return new Uint8Array(await crypto.subtle.deriveBits(/** @type {any} */({ name: algorithm.name, public: peerKey }), privateKey, bits))
}
async function importAesGcmKey(key, usages) { return crypto.subtle.importKey("raw", key, { name: "AES-GCM" }, !1, usages) }
async function aesGcmEncryptWithKey(cryptoKey, initializationVector, plaintext, additionalData) {
	return new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: initializationVector, additionalData, tagLength: 128 }, cryptoKey, plaintext))
}
async function aesGcmDecryptWithKey(cryptoKey, initializationVector, ciphertext, additionalData) {
	return new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: initializationVector, additionalData, tagLength: 128 }, cryptoKey, ciphertext))
}

function rotateLeft32(value, bits) { return (value << bits | value >>> 32 - bits) >>> 0 }

function chachaQuarterRound(state, indexA, indexB, indexC, indexD) {
	state[indexA] = state[indexA] + state[indexB] >>> 0, state[indexD] = rotateLeft32(state[indexD] ^ state[indexA], 16), state[indexC] = state[indexC] + state[indexD] >>> 0, state[indexB] = rotateLeft32(state[indexB] ^ state[indexC], 12), state[indexA] = state[indexA] + state[indexB] >>> 0, state[indexD] = rotateLeft32(state[indexD] ^ state[indexA], 8), state[indexC] = state[indexC] + state[indexD] >>> 0, state[indexB] = rotateLeft32(state[indexB] ^ state[indexC], 7)
}

function chacha20Block(key, counter, nonce) {
	const state = new Uint32Array(16);
	state[0] = 1634760805, state[1] = 857760878, state[2] = 2036477234, state[3] = 1797285236;
	const keyView = new DataView(key.buffer, key.byteOffset, key.byteLength);
	for (let wordIndex = 0; wordIndex < 8; wordIndex++) state[4 + wordIndex] = keyView.getUint32(4 * wordIndex, !0);
	state[12] = counter;
	const nonceView = new DataView(nonce.buffer, nonce.byteOffset, nonce.byteLength);
	state[13] = nonceView.getUint32(0, !0), state[14] = nonceView.getUint32(4, !0), state[15] = nonceView.getUint32(8, !0);
	const workingState = new Uint32Array(state);
	for (let round = 0; round < 10; round++) chachaQuarterRound(workingState, 0, 4, 8, 12), chachaQuarterRound(workingState, 1, 5, 9, 13), chachaQuarterRound(workingState, 2, 6, 10, 14), chachaQuarterRound(workingState, 3, 7, 11, 15), chachaQuarterRound(workingState, 0, 5, 10, 15), chachaQuarterRound(workingState, 1, 6, 11, 12), chachaQuarterRound(workingState, 2, 7, 8, 13), chachaQuarterRound(workingState, 3, 4, 9, 14);
	for (let wordIndex = 0; wordIndex < 16; wordIndex++) workingState[wordIndex] = workingState[wordIndex] + state[wordIndex] >>> 0;
	return new Uint8Array(workingState.buffer.slice(0))
}

function chacha20Xor(key, nonce, data) {
	const output = new Uint8Array(data.length);
	let counter = 1;
	for (let offset = 0; offset < data.length; offset += 64) {
		const block = chacha20Block(key, counter++, nonce),
			blockLength = Math.min(64, data.length - offset);
		for (let index = 0; index < blockLength; index++) output[offset + index] = data[offset + index] ^ block[index]
	}
	return output
}

function poly1305Mac(key, message) {
	const rKey = function (rBytes) {
		const clamped = new Uint8Array(rBytes);
		return clamped[3] &= 15, clamped[7] &= 15, clamped[11] &= 15, clamped[15] &= 15, clamped[4] &= 252, clamped[8] &= 252, clamped[12] &= 252, clamped
	}(key.slice(0, 16)),
		sKey = key.slice(16, 32);
	let accumulator = [0n, 0n, 0n, 0n, 0n];
	const rLimbs = [0x3ffffffn & BigInt(rKey[0] | rKey[1] << 8 | rKey[2] << 16 | rKey[3] << 24), 0x3ffffffn & BigInt(rKey[3] >> 2 | rKey[4] << 6 | rKey[5] << 14 | rKey[6] << 22), 0x3ffffffn & BigInt(rKey[6] >> 4 | rKey[7] << 4 | rKey[8] << 12 | rKey[9] << 20), 0x3ffffffn & BigInt(rKey[9] >> 6 | rKey[10] << 2 | rKey[11] << 10 | rKey[12] << 18), 0x3ffffffn & BigInt(rKey[13] | rKey[14] << 8 | rKey[15] << 16)];
	for (let offset = 0; offset < message.length; offset += 16) {
		const chunk = message.slice(offset, offset + 16),
			paddedChunk = new Uint8Array(17);
		paddedChunk.set(chunk), paddedChunk[chunk.length] = 1, accumulator[0] += BigInt(paddedChunk[0] | paddedChunk[1] << 8 | paddedChunk[2] << 16 | (3 & paddedChunk[3]) << 24), accumulator[1] += BigInt(paddedChunk[3] >> 2 | paddedChunk[4] << 6 | paddedChunk[5] << 14 | (15 & paddedChunk[6]) << 22), accumulator[2] += BigInt(paddedChunk[6] >> 4 | paddedChunk[7] << 4 | paddedChunk[8] << 12 | (63 & paddedChunk[9]) << 20), accumulator[3] += BigInt(paddedChunk[9] >> 6 | paddedChunk[10] << 2 | paddedChunk[11] << 10 | paddedChunk[12] << 18), accumulator[4] += BigInt(paddedChunk[13] | paddedChunk[14] << 8 | paddedChunk[15] << 16 | paddedChunk[16] << 24);
		const product = [0n, 0n, 0n, 0n, 0n];
		for (let accIndex = 0; accIndex < 5; accIndex++)
			for (let rIndex = 0; rIndex < 5; rIndex++) {
				const limbIndex = accIndex + rIndex;
				limbIndex < 5 ? product[limbIndex] += accumulator[accIndex] * rLimbs[rIndex] : product[limbIndex - 5] += accumulator[accIndex] * rLimbs[rIndex] * 5n
			}
		let carry = 0n;
		for (let index = 0; index < 5; index++) product[index] += carry, accumulator[index] = 0x3ffffffn & product[index], carry = product[index] >> 26n;
		accumulator[0] += 5n * carry, carry = accumulator[0] >> 26n, accumulator[0] &= 0x3ffffffn, accumulator[1] += carry
	}
	let tagValue = accumulator[0] | accumulator[1] << 26n | accumulator[2] << 52n | accumulator[3] << 78n | accumulator[4] << 104n;
	tagValue = tagValue + sKey.reduce(((total, byte, index) => total + (BigInt(byte) << BigInt(8 * index))), 0n) & (1n << 128n) - 1n;
	const tag = new Uint8Array(16);
	for (let index = 0; index < 16; index++) tag[index] = Number(tagValue >> BigInt(8 * index) & 0xffn);
	return tag
}

function chacha20Poly1305Encrypt(key, nonce, plaintext, additionalData) {
	const polyKey = chacha20Block(key, 0, nonce).slice(0, 32),
		ciphertext = chacha20Xor(key, nonce, plaintext),
		aadPadding = (16 - additionalData.length % 16) % 16,
		ciphertextPadding = (16 - ciphertext.length % 16) % 16,
		macData = new Uint8Array(additionalData.length + aadPadding + ciphertext.length + ciphertextPadding + 16);
	macData.set(additionalData, 0), macData.set(ciphertext, additionalData.length + aadPadding);
	const lengthView = new DataView(macData.buffer, additionalData.length + aadPadding + ciphertext.length + ciphertextPadding);
	lengthView.setBigUint64(0, BigInt(additionalData.length), !0), lengthView.setBigUint64(8, BigInt(ciphertext.length), !0);
	const tag = poly1305Mac(polyKey, macData);
	return concatBytes(ciphertext, tag)
}

function chacha20Poly1305Decrypt(key, nonce, ciphertext, additionalData) {
	if (ciphertext.length < 16) throw new Error("Ciphertext too short");
	const tag = ciphertext.slice(-16),
		encryptedData = ciphertext.slice(0, -16),
		polyKey = chacha20Block(key, 0, nonce).slice(0, 32),
		aadPadding = (16 - additionalData.length % 16) % 16,
		ciphertextPadding = (16 - encryptedData.length % 16) % 16,
		macData = new Uint8Array(additionalData.length + aadPadding + encryptedData.length + ciphertextPadding + 16);
	macData.set(additionalData, 0), macData.set(encryptedData, additionalData.length + aadPadding);
	const lengthView = new DataView(macData.buffer, additionalData.length + aadPadding + encryptedData.length + ciphertextPadding);
	lengthView.setBigUint64(0, BigInt(additionalData.length), !0), lengthView.setBigUint64(8, BigInt(encryptedData.length), !0);
	const expectedTag = poly1305Mac(polyKey, macData);
	let diff = 0;
	for (let index = 0; index < 16; index++) diff |= tag[index] ^ expectedTag[index];
	if (0 !== diff) throw new Error("ChaCha20-Poly1305 authentication failed");
	return chacha20Xor(key, nonce, encryptedData)
}

const TLS_MAX_PLAINTEXT_FRAGMENT = 16 * 1024;
function buildTlsRecord(contentType, fragment, version = TLS_VERSION_12) {
	const data = data_transformUint8Array(fragment);
	const record = new Uint8Array(5 + data.byteLength);
	record[0] = contentType;
	record[1] = version >> 8 & 255;
	record[2] = version & 255;
	record[3] = data.byteLength >> 8 & 255;
	record[4] = data.byteLength & 255;
	record.set(data, 5);
	return record;
}
function buildHandshakeMessage(handshakeType, body) { return tlsBytes(handshakeType, (length => [length >> 16 & 255, length >> 8 & 255, 255 & length])(body.length), body) }
class TlsRecordParser {
	constructor() { this.buffer = new Uint8Array(0) }
	feed(chunk) {
		const bytes = data_transformUint8Array(chunk);
		this.buffer = this.buffer.length ? concatBytes(this.buffer, bytes) : bytes
	}
	next() {
		if (this.buffer.length < 5) return null;
		const contentType = this.buffer[0],
			version = readUint16(this.buffer, 1),
			length = readUint16(this.buffer, 3);
		if (this.buffer.length < 5 + length) return null;
		const fragment = this.buffer.subarray(5, 5 + length);
		return this.buffer = this.buffer.subarray(5 + length), { type: contentType, version, length, fragment }
	}
}
class TlsHandshakeParser {
	constructor() { this.buffer = new Uint8Array(0) }
	feed(chunk) {
		const bytes = data_transformUint8Array(chunk);
		this.buffer = this.buffer.length ? concatBytes(this.buffer, bytes) : bytes
	}
	next() {
		if (this.buffer.length < 4) return null;
		const handshakeType = this.buffer[0],
			length = readUint24(this.buffer, 1);
		if (this.buffer.length < 4 + length) return null;
		const body = this.buffer.subarray(4, 4 + length),
			raw = this.buffer.subarray(0, 4 + length);
		return this.buffer = this.buffer.subarray(4 + length), { type: handshakeType, length, body, raw }
	}
}

function parseServerHello(body) {
	let offset = 0;
	const legacyVersion = readUint16(body, offset);
	offset += 2;
	const serverRandom = body.slice(offset, offset + 32);
	offset += 32;
	const sessionIdLength = body[offset++],
		sessionId = body.slice(offset, offset + sessionIdLength);
	offset += sessionIdLength;
	const cipherSuite = readUint16(body, offset);
	offset += 2;
	const compression = body[offset++];
	let selectedVersion = legacyVersion,
		keyShare = null,
		alpn = null;
	if (offset < body.length) {
		const extensionsLength = readUint16(body, offset);
		offset += 2;
		const extensionsEnd = offset + extensionsLength;
		for (; offset + 4 <= extensionsEnd;) {
			const extensionType = readUint16(body, offset);
			offset += 2;
			const extensionLength = readUint16(body, offset);
			offset += 2;
			const extensionData = body.slice(offset, offset + extensionLength);
			if (offset += extensionLength, extensionType === EXT_SUPPORTED_VERSIONS && extensionLength >= 2) selectedVersion = readUint16(extensionData, 0);
			else if (extensionType === EXT_KEY_SHARE && extensionLength >= 4) {
				const group = readUint16(extensionData, 0),
					keyLength = readUint16(extensionData, 2);
				keyShare = { group, key: extensionData.slice(4, 4 + keyLength) }
			} else extensionType === EXT_APPLICATION_LAYER_PROTOCOL_NEGOTIATION && extensionLength >= 3 && (alpn = textDecoder.decode(extensionData.slice(3, 3 + extensionData[2])))
		}
	}
	const helloRetryRequestRandom = new Uint8Array([207, 33, 173, 116, 229, 154, 97, 17, 190, 29, 140, 2, 30, 101, 184, 145, 194, 162, 17, 22, 122, 187, 140, 94, 7, 158, 9, 226, 200, 168, 51, 156]);
	return { version: legacyVersion, serverRandom, sessionId, cipherSuite, compression, selectedVersion, keyShare, alpn, isHRR: constantTimeEqual(serverRandom, helloRetryRequestRandom), isTls13: selectedVersion === TLS_VERSION_13 }
}

function parseServerKeyExchange(body) {
	let offset = 1;
	const namedCurve = readUint16(body, offset);
	offset += 2;
	const keyLength = body[offset++];
	return { namedCurve, serverPublicKey: body.slice(offset, offset + keyLength) }
}

function extractLeafCertificate(body, hasContext = 0) {
	let offset = 0;
	if (hasContext) {
		const contextLength = body[offset++];
		offset += contextLength
	}
	if (offset + 3 > body.length) return null;
	const certificateListLength = readUint24(body, offset);
	if (offset += 3, !certificateListLength || offset + 3 > body.length) return null;
	const certificateLength = readUint24(body, offset);
	return offset += 3, certificateLength ? body.slice(offset, offset + certificateLength) : null
}

function parseEncryptedExtensions(body) {
	const parsed = { alpn: null };
	let offset = 2;
	const extensionsEnd = 2 + readUint16(body, 0);
	for (; offset + 4 <= extensionsEnd;) {
		const extensionType = readUint16(body, offset);
		offset += 2;
		const extensionLength = readUint16(body, offset);
		if (offset += 2, extensionType === EXT_APPLICATION_LAYER_PROTOCOL_NEGOTIATION && extensionLength >= 3) {
			const protocolLength = body[offset + 2];
			protocolLength > 0 && offset + 3 + protocolLength <= offset + extensionLength && (parsed.alpn = textDecoder.decode(body.slice(offset + 3, offset + 3 + protocolLength)))
		}
		offset += extensionLength
	}
	return parsed
}

function buildClientHello(clientRandom, serverName, keyShares, { tls13: enableTls13 = !0, tls12: enableTls12 = !0, alpn = null, chacha = !0 } = {}) {
	const cipherIds = [];
	enableTls13 && cipherIds.push(4865, 4866, ...(chacha ? [4867] : [])), enableTls12 && cipherIds.push(49199, 49200, 49195, 49196, ...(chacha ? [52392, 52393] : []));
	const cipherBytes = tlsBytes(...cipherIds.flatMap(uint16be)),
		extensions = [tlsBytes(255, 1, 0, 1, 0)];
	if (serverName) {
		const serverNameBytes = textEncoder.encode(serverName),
			serverNameList = tlsBytes(0, uint16be(serverNameBytes.length), serverNameBytes);
		extensions.push(tlsBytes(uint16be(EXT_SERVER_NAME), uint16be(serverNameList.length + 2), uint16be(serverNameList.length), serverNameList))
	}
	extensions.push(tlsBytes(uint16be(EXT_EC_POINT_FORMATS), 0, 2, 1, 0)), extensions.push(tlsBytes(uint16be(EXT_SUPPORTED_GROUPS), 0, 6, 0, 4, 0, 29, 0, 23));
	const signatureBytes = tlsBytes(...SUPPORTED_SIGNATURE_ALGORITHMS.flatMap(uint16be));
	extensions.push(tlsBytes(uint16be(EXT_SIGNATURE_ALGORITHMS), uint16be(signatureBytes.length + 2), uint16be(signatureBytes.length), signatureBytes));
	const protocols = Array.isArray(alpn) ? alpn.filter(Boolean) : alpn ? [alpn] : [];
	if (protocols.length) {
		const alpnBytes = concatBytes(...protocols.map((protocol => { const protocolBytes = textEncoder.encode(protocol); return tlsBytes(protocolBytes.length, protocolBytes) })));
		extensions.push(tlsBytes(uint16be(EXT_APPLICATION_LAYER_PROTOCOL_NEGOTIATION), uint16be(alpnBytes.length + 2), uint16be(alpnBytes.length), alpnBytes))
	}
	if (enableTls13 && keyShares) {
		let keyShareBytes;
		if (extensions.push(enableTls12 ? tlsBytes(uint16be(EXT_SUPPORTED_VERSIONS), 0, 5, 4, 3, 4, 3, 3) : tlsBytes(uint16be(EXT_SUPPORTED_VERSIONS), 0, 3, 2, 3, 4)), extensions.push(tlsBytes(uint16be(EXT_PSK_KEY_EXCHANGE_MODES), 0, 2, 1, 1)), keyShares?.x25519 && keyShares?.p256) keyShareBytes = concatBytes(tlsBytes(0, 29, uint16be(keyShares.x25519.length), keyShares.x25519), tlsBytes(0, 23, uint16be(keyShares.p256.length), keyShares.p256));
		else if (keyShares?.x25519) keyShareBytes = tlsBytes(0, 29, uint16be(keyShares.x25519.length), keyShares.x25519);
		else if (keyShares?.p256) keyShareBytes = tlsBytes(0, 23, uint16be(keyShares.p256.length), keyShares.p256);
		else {
			if (!(keyShares instanceof Uint8Array)) throw new Error("Invalid keyShares");
			keyShareBytes = tlsBytes(0, 23, uint16be(keyShares.length), keyShares)
		}
		extensions.push(tlsBytes(uint16be(EXT_KEY_SHARE), uint16be(keyShareBytes.length + 2), uint16be(keyShareBytes.length), keyShareBytes))
	}
	const extensionsBytes = concatBytes(...extensions);
	return buildHandshakeMessage(HANDSHAKE_TYPE_CLIENT_HELLO, tlsBytes(uint16be(TLS_VERSION_12), clientRandom, 0, uint16be(cipherBytes.length), cipherBytes, 1, 0, uint16be(extensionsBytes.length), extensionsBytes))
}
const uint64be = sequenceNumber => { const bytes = new Uint8Array(8); return new DataView(bytes.buffer).setBigUint64(0, sequenceNumber, !1), bytes },
	xorSequenceIntoIv = (initializationVector, sequenceNumber) => {
		const nonce = initializationVector.slice(),
			sequenceBytes = uint64be(sequenceNumber);
		for (let index = 0; index < 8; index++) nonce[nonce.length - 8 + index] ^= sequenceBytes[index];
		return nonce
	},
	deriveTrafficKeys = (hash, secret, keyLen, ivLen) => Promise.all([hkdfExpandLabel(hash, secret, "key", EMPTY_BYTES, keyLen), hkdfExpandLabel(hash, secret, "iv", EMPTY_BYTES, ivLen)]);
class TlsClient {
	constructor(socket, options = {}) {
		if (this.socket = socket, this.serverName = options.serverName || "", this.supportTls13 = !1 !== options.tls13, this.supportTls12 = !1 !== options.tls12, !this.supportTls13 && !this.supportTls12) throw new Error("At least one TLS version must be enabled");
		this.alpnProtocols = Array.isArray(options.alpn) ? options.alpn : options.alpn ? [options.alpn] : null, this.allowChacha = options.allowChacha !== false, this.timeout = options.timeout ?? 3e4, this.clientRandom = randomBytes(32), this.serverRandom = null, this.handshakeChunks = [], this.handshakeComplete = !1, this.negotiatedAlpn = null, this.cipherSuite = null, this.cipherConfig = null, this.isTls13 = !1, this.masterSecret = null, this.handshakeSecret = null, this.clientWriteKey = null, this.serverWriteKey = null, this.clientWriteIv = null, this.serverWriteIv = null, this.clientHandshakeKey = null, this.serverHandshakeKey = null, this.clientHandshakeIv = null, this.serverHandshakeIv = null, this.clientAppKey = null, this.serverAppKey = null, this.clientAppIv = null, this.serverAppIv = null, this.clientWriteCryptoKey = null, this.serverWriteCryptoKey = null, this.clientHandshakeCryptoKey = null, this.serverHandshakeCryptoKey = null, this.clientAppCryptoKey = null, this.serverAppCryptoKey = null, this.clientSeqNum = 0n, this.serverSeqNum = 0n, this.recordParser = new TlsRecordParser, this.handshakeParser = new TlsHandshakeParser, this.keyPairs = new Map, this.ecdhKeyPair = null, this.sawCert = !1
	}
	recordHandshake(chunk) { this.handshakeChunks.push(chunk) }
	transcript() { return 1 === this.handshakeChunks.length ? this.handshakeChunks[0] : concatBytes(...this.handshakeChunks) }
	getCipherConfig(cipherSuite) { return CIPHER_SUITES_BY_ID.get(cipherSuite) || null }
	async readChunk(reader) { return this.timeout ? Promise.race([reader.read(), new Promise(((resolve, reject) => setTimeout((() => reject(new Error("TLS read timeout"))), this.timeout)))]) : reader.read() }
	async readRecordsUntil(reader, predicate, closedError) {
		for (; ;) {
			let record;
			for (; record = this.recordParser.next();)
				if (await predicate(record)) return;
			const { value, done } = await this.readChunk(reader);
			if (done) throw new Error(closedError);
			this.recordParser.feed(value)
		}
	}
	async readHandshakeUntil(reader, predicate, closedError) {
		for (let message; message = this.handshakeParser.next();)
			if (await predicate(message)) return;
		return this.readRecordsUntil(reader, (async record => {
			if (record.type === CONTENT_TYPE_ALERT) {
				if (shouldIgnoreTlsAlert(record.fragment)) return;
				throw new Error(`TLS Alert: ${record.fragment[1]}`);
			}
			if (record.type === CONTENT_TYPE_HANDSHAKE) {
				this.handshakeParser.feed(record.fragment);
				for (let message; message = this.handshakeParser.next();)
					if (await predicate(message)) return 1
			}
		}), closedError)
	}
	async acceptCertificate(certificate) { if (!certificate?.length) throw new Error("Empty certificate"); this.sawCert = !0 }
	async handshake() {
		const [p256Share, x25519Share] = await Promise.all([generateKeyShare("P-256"), generateKeyShare("X25519")]);
		this.keyPairs = new Map([[23, p256Share], [29, x25519Share]]), this.ecdhKeyPair = p256Share.keyPair;
		const reader = this.socket.readable.getReader(),
			writer = this.socket.writable.getWriter();
		try {
			const clientHello = buildClientHello(this.clientRandom, this.serverName, { x25519: x25519Share.publicKeyRaw, p256: p256Share.publicKeyRaw }, { tls13: this.supportTls13, tls12: this.supportTls12, alpn: this.alpnProtocols, chacha: this.allowChacha });
			this.recordHandshake(clientHello), await writer.write(buildTlsRecord(CONTENT_TYPE_HANDSHAKE, clientHello, TLS_VERSION_10));
			const serverHello = await this.receiveServerHello(reader);
			if (serverHello.isHRR) throw new Error("HelloRetryRequest is not supported by TLSClientMini");
			if (serverHello.keyShare?.group && this.keyPairs.has(serverHello.keyShare.group)) {
				const selectedKeyPair = this.keyPairs.get(serverHello.keyShare.group);
				this.ecdhKeyPair = selectedKeyPair.keyPair
			}
			serverHello.isTls13 ? await this.handshakeTls13(reader, writer, serverHello) : await this.handshakeTls12(reader, writer), this.handshakeComplete = !0
		} finally {
			reader.releaseLock(), writer.releaseLock()
		}
	}
	async receiveServerHello(reader) {
		for (; ;) {
			const { value, done } = await this.readChunk(reader);
			if (done) throw new Error("Connection closed waiting for ServerHello");
			let record;
			for (this.recordParser.feed(value); record = this.recordParser.next();) {
				if (record.type === CONTENT_TYPE_ALERT) {
					if (shouldIgnoreTlsAlert(record.fragment)) continue;
					throw new Error(`TLS Alert: level=${record.fragment[0]}, desc=${record.fragment[1]}`);
				}
				if (record.type !== CONTENT_TYPE_HANDSHAKE) continue;
				let message;
				for (this.handshakeParser.feed(record.fragment); message = this.handshakeParser.next();) {
					if (message.type !== HANDSHAKE_TYPE_SERVER_HELLO) continue;
					this.recordHandshake(message.raw);
					const serverHello = parseServerHello(message.body);
					if (this.serverRandom = serverHello.serverRandom, this.cipherSuite = serverHello.cipherSuite, this.cipherConfig = this.getCipherConfig(serverHello.cipherSuite), this.isTls13 = serverHello.isTls13, this.negotiatedAlpn = serverHello.alpn || null, !this.cipherConfig) throw new Error(`Unsupported cipher suite: 0x${serverHello.cipherSuite.toString(16)}`);
					return serverHello
				}
			}
		}
	}
	async handshakeTls12(reader, writer) {
		/** @type {{ namedCurve: number, serverPublicKey: Uint8Array } | null} */
		let serverKeyExchange = null;
		let sawServerHelloDone = !1;
		if (await this.readHandshakeUntil(reader, (async message => {
			switch (message.type) {
				case HANDSHAKE_TYPE_CERTIFICATE: {
					this.recordHandshake(message.raw);
					const certificate = extractLeafCertificate(message.body, 1);
					if (!certificate) throw new Error("Missing TLS 1.2 certificate");
					await this.acceptCertificate(certificate);
					break
				}
				case HANDSHAKE_TYPE_SERVER_KEY_EXCHANGE:
					this.recordHandshake(message.raw), serverKeyExchange = parseServerKeyExchange(message.body);
					break;
				case HANDSHAKE_TYPE_SERVER_HELLO_DONE:
					return this.recordHandshake(message.raw), sawServerHelloDone = !0, 1;
				case HANDSHAKE_TYPE_CERTIFICATE_REQUEST:
					throw new Error("Client certificate is not supported");
				default:
					this.recordHandshake(message.raw)
			}
		}), "Connection closed during TLS 1.2 handshake"), !this.sawCert) throw new Error("Missing TLS 1.2 leaf certificate");
		const serverKeyExchangeData = /** @type {{ namedCurve: number, serverPublicKey: Uint8Array } | null} */ (serverKeyExchange);
		if (!serverKeyExchangeData) throw new Error("Missing TLS 1.2 ServerKeyExchange");
		const curveName = GROUPS_BY_ID.get(serverKeyExchangeData.namedCurve);
		if (!curveName) throw new Error(`Unsupported named curve: 0x${serverKeyExchangeData.namedCurve.toString(16)}`);
		const keyShare = this.keyPairs.get(serverKeyExchangeData.namedCurve);
		if (!keyShare) throw new Error(`Missing key pair for curve: 0x${serverKeyExchangeData.namedCurve.toString(16)}`);
		const preMasterSecret = await deriveSharedSecret(keyShare.keyPair.privateKey, serverKeyExchangeData.serverPublicKey, curveName),
			clientKeyExchange = buildHandshakeMessage(HANDSHAKE_TYPE_CLIENT_KEY_EXCHANGE, tlsBytes(keyShare.publicKeyRaw.length, keyShare.publicKeyRaw));
		this.recordHandshake(clientKeyExchange);
		const hashName = this.cipherConfig.hash;
		this.masterSecret = await tls12Prf(preMasterSecret, "master secret", concatBytes(this.clientRandom, this.serverRandom), 48, hashName);
		const keyLen = this.cipherConfig.keyLen,
			ivLen = this.cipherConfig.ivLen,
			keyBlock = await tls12Prf(this.masterSecret, "key expansion", concatBytes(this.serverRandom, this.clientRandom), 2 * keyLen + 2 * ivLen, hashName);
		this.clientWriteKey = keyBlock.slice(0, keyLen), this.serverWriteKey = keyBlock.slice(keyLen, 2 * keyLen), this.clientWriteIv = keyBlock.slice(2 * keyLen, 2 * keyLen + ivLen), this.serverWriteIv = keyBlock.slice(2 * keyLen + ivLen, 2 * keyLen + 2 * ivLen);
		if (!this.cipherConfig.chacha) [this.clientWriteCryptoKey, this.serverWriteCryptoKey] = await Promise.all([importAesGcmKey(this.clientWriteKey, ["encrypt"]), importAesGcmKey(this.serverWriteKey, ["decrypt"])]);
		await writer.write(buildTlsRecord(CONTENT_TYPE_HANDSHAKE, clientKeyExchange)), await writer.write(buildTlsRecord(CONTENT_TYPE_CHANGE_CIPHER_SPEC, tlsBytes(1)));
		const clientVerifyData = await tls12Prf(this.masterSecret, "client finished", await digestBytes(hashName, this.transcript()), 12, hashName),
			finishedMessage = buildHandshakeMessage(HANDSHAKE_TYPE_FINISHED, clientVerifyData);
		this.recordHandshake(finishedMessage), await writer.write(buildTlsRecord(CONTENT_TYPE_HANDSHAKE, await this.encryptTls12(finishedMessage, CONTENT_TYPE_HANDSHAKE)));
		let sawChangeCipherSpec = !1;
		await this.readRecordsUntil(reader, (async record => {
			if (record.type === CONTENT_TYPE_ALERT) {
				if (shouldIgnoreTlsAlert(record.fragment)) return;
				throw new Error(`TLS Alert: ${record.fragment[1]}`);
			}
			if (record.type === CONTENT_TYPE_CHANGE_CIPHER_SPEC) return void (sawChangeCipherSpec = !0);
			if (record.type !== CONTENT_TYPE_HANDSHAKE || !sawChangeCipherSpec) return;
			const decrypted = await this.decryptTls12(record.fragment, CONTENT_TYPE_HANDSHAKE);
			if (decrypted[0] !== HANDSHAKE_TYPE_FINISHED) return;
			const verifyLength = readUint24(decrypted, 1),
				verifyData = decrypted.slice(4, 4 + verifyLength),
				expectedVerifyData = await tls12Prf(this.masterSecret, "server finished", await digestBytes(hashName, this.transcript()), 12, hashName);
			if (!constantTimeEqual(verifyData, expectedVerifyData)) throw new Error("TLS 1.2 server Finished verify failed");
			return 1
		}), "Connection closed waiting for TLS 1.2 Finished")
	}
	async handshakeTls13(reader, writer, serverHello) {
		const groupName = GROUPS_BY_ID.get(serverHello.keyShare?.group);
		if (!groupName || !serverHello.keyShare?.key?.length) throw new Error("Missing TLS 1.3 key_share");
		const hashName = this.cipherConfig.hash,
			hashLen = hashByteLength(hashName),
			keyLen = this.cipherConfig.keyLen,
			ivLen = this.cipherConfig.ivLen,
			sharedSecret = await deriveSharedSecret(this.ecdhKeyPair.privateKey, serverHello.keyShare.key, groupName),
			earlySecret = await hkdfExtract(hashName, null, new Uint8Array(hashLen)),
			derivedSecret = await hkdfExpandLabel(hashName, earlySecret, "derived", await digestBytes(hashName, EMPTY_BYTES), hashLen);
		this.handshakeSecret = await hkdfExtract(hashName, derivedSecret, sharedSecret);
		const transcriptHash = await digestBytes(hashName, this.transcript()),
			clientHandshakeTrafficSecret = await hkdfExpandLabel(hashName, this.handshakeSecret, "c hs traffic", transcriptHash, hashLen),
			serverHandshakeTrafficSecret = await hkdfExpandLabel(hashName, this.handshakeSecret, "s hs traffic", transcriptHash, hashLen);
		[this.clientHandshakeKey, this.clientHandshakeIv] = await deriveTrafficKeys(hashName, clientHandshakeTrafficSecret, keyLen, ivLen), [this.serverHandshakeKey, this.serverHandshakeIv] = await deriveTrafficKeys(hashName, serverHandshakeTrafficSecret, keyLen, ivLen);
		if (!this.cipherConfig.chacha) [this.clientHandshakeCryptoKey, this.serverHandshakeCryptoKey] = await Promise.all([importAesGcmKey(this.clientHandshakeKey, ["encrypt"]), importAesGcmKey(this.serverHandshakeKey, ["decrypt"])]);
		const serverFinishedKey = await hkdfExpandLabel(hashName, serverHandshakeTrafficSecret, "finished", EMPTY_BYTES, hashLen);
		let serverFinishedReceived = !1;
		const handleHandshakeMessage = async message => {
			switch (message.type) {
				case HANDSHAKE_TYPE_ENCRYPTED_EXTENSIONS: {
					const encryptedExtensions = parseEncryptedExtensions(message.body);
					encryptedExtensions.alpn && (this.negotiatedAlpn = encryptedExtensions.alpn), this.recordHandshake(message.raw);
					break
				}
				case HANDSHAKE_TYPE_CERTIFICATE: {
					const certificate = extractLeafCertificate(message.body);
					if (!certificate) throw new Error("Missing TLS 1.3 certificate");
					await this.acceptCertificate(certificate), this.recordHandshake(message.raw);
					break
				}
				case HANDSHAKE_TYPE_CERTIFICATE_REQUEST:
					throw new Error("Client certificate is not supported");
				case HANDSHAKE_TYPE_CERTIFICATE_VERIFY:
					this.recordHandshake(message.raw);
					break;
				case HANDSHAKE_TYPE_FINISHED: {
					const expectedVerifyData = await hmac(hashName, serverFinishedKey, await digestBytes(hashName, this.transcript()));
					if (!constantTimeEqual(expectedVerifyData, message.body)) throw new Error("TLS 1.3 server Finished verify failed");
					this.recordHandshake(message.raw), serverFinishedReceived = !0;
					break
				}
				default:
					this.recordHandshake(message.raw)
			}
		};
		await this.readRecordsUntil(reader, (async record => {
			if (record.type === CONTENT_TYPE_CHANGE_CIPHER_SPEC || record.type === CONTENT_TYPE_HANDSHAKE) return;
			if (record.type === CONTENT_TYPE_ALERT) {
				if (shouldIgnoreTlsAlert(record.fragment)) return;
				throw new Error(`TLS Alert: ${record.fragment[1]}`);
			}
			if (record.type !== CONTENT_TYPE_APPLICATION_DATA) return;
			const decrypted = await this.decryptTls13Handshake(record.fragment),
				innerType = decrypted[decrypted.length - 1],
				plaintext = decrypted.slice(0, -1);
			if (innerType === CONTENT_TYPE_HANDSHAKE) {
				this.handshakeParser.feed(plaintext);
				for (let message; message = this.handshakeParser.next();)
					if (await handleHandshakeMessage(message), serverFinishedReceived) return 1
			}
		}), "Connection closed during TLS 1.3 handshake");
		const applicationTranscriptHash = await digestBytes(hashName, this.transcript()),
			masterDerivedSecret = await hkdfExpandLabel(hashName, this.handshakeSecret, "derived", await digestBytes(hashName, EMPTY_BYTES), hashLen),
			masterSecret = await hkdfExtract(hashName, masterDerivedSecret, new Uint8Array(hashLen)),
			clientAppTrafficSecret = await hkdfExpandLabel(hashName, masterSecret, "c ap traffic", applicationTranscriptHash, hashLen),
			serverAppTrafficSecret = await hkdfExpandLabel(hashName, masterSecret, "s ap traffic", applicationTranscriptHash, hashLen);
		[this.clientAppKey, this.clientAppIv] = await deriveTrafficKeys(hashName, clientAppTrafficSecret, keyLen, ivLen), [this.serverAppKey, this.serverAppIv] = await deriveTrafficKeys(hashName, serverAppTrafficSecret, keyLen, ivLen);
		if (!this.cipherConfig.chacha) [this.clientAppCryptoKey, this.serverAppCryptoKey] = await Promise.all([importAesGcmKey(this.clientAppKey, ["encrypt"]), importAesGcmKey(this.serverAppKey, ["decrypt"])]);
		const clientFinishedKey = await hkdfExpandLabel(hashName, clientHandshakeTrafficSecret, "finished", EMPTY_BYTES, hashLen),
			clientFinishedVerifyData = await hmac(hashName, clientFinishedKey, await digestBytes(hashName, this.transcript())),
			clientFinishedMessage = buildHandshakeMessage(HANDSHAKE_TYPE_FINISHED, clientFinishedVerifyData);
		this.recordHandshake(clientFinishedMessage), await writer.write(buildTlsRecord(CONTENT_TYPE_APPLICATION_DATA, await this.encryptTls13Handshake(concatBytes(clientFinishedMessage, [CONTENT_TYPE_HANDSHAKE])))), this.clientSeqNum = 0n, this.serverSeqNum = 0n
	}
	async encryptTls12(plaintext, contentType) {
		const sequenceNumber = this.clientSeqNum++,
			sequenceBytes = uint64be(sequenceNumber),
			additionalData = concatBytes(sequenceBytes, [contentType], uint16be(TLS_VERSION_12), uint16be(plaintext.length));
		if (this.cipherConfig.chacha) {
			const nonce = xorSequenceIntoIv(this.clientWriteIv, sequenceNumber);
			return chacha20Poly1305Encrypt(this.clientWriteKey, nonce, plaintext, additionalData)
		}
		const explicitNonce = randomBytes(8);
		if (!this.clientWriteCryptoKey) this.clientWriteCryptoKey = await importAesGcmKey(this.clientWriteKey, ["encrypt"]);
		return concatBytes(explicitNonce, await aesGcmEncryptWithKey(this.clientWriteCryptoKey, concatBytes(this.clientWriteIv, explicitNonce), plaintext, additionalData))
	}
	async decryptTls12(ciphertext, contentType) {
		const sequenceNumber = this.serverSeqNum++,
			sequenceBytes = uint64be(sequenceNumber);
		if (this.cipherConfig.chacha) {
			const nonce = xorSequenceIntoIv(this.serverWriteIv, sequenceNumber);
			return chacha20Poly1305Decrypt(this.serverWriteKey, nonce, ciphertext, concatBytes(sequenceBytes, [contentType], uint16be(TLS_VERSION_12), uint16be(ciphertext.length - 16)))
		}
		const explicitNonce = ciphertext.subarray(0, 8),
			encryptedData = ciphertext.subarray(8);
		if (!this.serverWriteCryptoKey) this.serverWriteCryptoKey = await importAesGcmKey(this.serverWriteKey, ["decrypt"]);
		return aesGcmDecryptWithKey(this.serverWriteCryptoKey, concatBytes(this.serverWriteIv, explicitNonce), encryptedData, concatBytes(sequenceBytes, [contentType], uint16be(TLS_VERSION_12), uint16be(encryptedData.length - 16)))
	}
	async encryptTls13Handshake(plaintext) {
		const nonce = xorSequenceIntoIv(this.clientHandshakeIv, this.clientSeqNum++),
			additionalData = tlsBytes(CONTENT_TYPE_APPLICATION_DATA, 3, 3, uint16be(plaintext.length + 16));
		if (this.cipherConfig.chacha) return chacha20Poly1305Encrypt(this.clientHandshakeKey, nonce, plaintext, additionalData);
		if (!this.clientHandshakeCryptoKey) this.clientHandshakeCryptoKey = await importAesGcmKey(this.clientHandshakeKey, ["encrypt"]);
		return aesGcmEncryptWithKey(this.clientHandshakeCryptoKey, nonce, plaintext, additionalData)
	}
	async decryptTls13Handshake(ciphertext) {
		const nonce = xorSequenceIntoIv(this.serverHandshakeIv, this.serverSeqNum++),
			additionalData = tlsBytes(CONTENT_TYPE_APPLICATION_DATA, 3, 3, uint16be(ciphertext.length));
		const decrypted = this.cipherConfig.chacha ? await chacha20Poly1305Decrypt(this.serverHandshakeKey, nonce, ciphertext, additionalData) : await aesGcmDecryptWithKey(this.serverHandshakeCryptoKey || (this.serverHandshakeCryptoKey = await importAesGcmKey(this.serverHandshakeKey, ["decrypt"])), nonce, ciphertext, additionalData);
		let innerTypeIndex = decrypted.length - 1;
		for (; innerTypeIndex >= 0 && !decrypted[innerTypeIndex];) innerTypeIndex--;
		return innerTypeIndex < 0 ? EMPTY_BYTES : decrypted.slice(0, innerTypeIndex + 1)
	}
	async encryptTls13(data) {
		const plaintext = concatBytes(data, [CONTENT_TYPE_APPLICATION_DATA]),
			nonce = xorSequenceIntoIv(this.clientAppIv, this.clientSeqNum++),
			additionalData = tlsBytes(CONTENT_TYPE_APPLICATION_DATA, 3, 3, uint16be(plaintext.length + 16));
		if (this.cipherConfig.chacha) return chacha20Poly1305Encrypt(this.clientAppKey, nonce, plaintext, additionalData);
		if (!this.clientAppCryptoKey) this.clientAppCryptoKey = await importAesGcmKey(this.clientAppKey, ["encrypt"]);
		return aesGcmEncryptWithKey(this.clientAppCryptoKey, nonce, plaintext, additionalData)
	}
	async decryptTls13(ciphertext) {
		const nonce = xorSequenceIntoIv(this.serverAppIv, this.serverSeqNum++),
			additionalData = tlsBytes(CONTENT_TYPE_APPLICATION_DATA, 3, 3, uint16be(ciphertext.length)),
			plaintext = this.cipherConfig.chacha ? await chacha20Poly1305Decrypt(this.serverAppKey, nonce, ciphertext, additionalData) : await aesGcmDecryptWithKey(this.serverAppCryptoKey || (this.serverAppCryptoKey = await importAesGcmKey(this.serverAppKey, ["decrypt"])), nonce, ciphertext, additionalData);
		let innerTypeIndex = plaintext.length - 1;
		for (; innerTypeIndex >= 0 && !plaintext[innerTypeIndex];) innerTypeIndex--;
		if (innerTypeIndex < 0) return {
			data: EMPTY_BYTES,
			type: 0
		};
		return {
			data: plaintext.slice(0, innerTypeIndex),
			type: plaintext[innerTypeIndex]
		}
	}
	async write(data) {
		if (!this.handshakeComplete) throw new Error("Handshake not complete");
		const plaintext = data_transformUint8Array(data);
		if (!plaintext.byteLength) return;
		const writer = this.socket.writable.getWriter();
		try {
			const records = [];
			for (let offset = 0; offset < plaintext.byteLength; offset += TLS_MAX_PLAINTEXT_FRAGMENT) {
				const chunk = plaintext.subarray(offset, Math.min(offset + TLS_MAX_PLAINTEXT_FRAGMENT, plaintext.byteLength));
				const encrypted = this.isTls13 ? await this.encryptTls13(chunk) : await this.encryptTls12(chunk, CONTENT_TYPE_APPLICATION_DATA);
				records.push(buildTlsRecord(CONTENT_TYPE_APPLICATION_DATA, encrypted));
			}
			await writer.write(records.length === 1 ? records[0] : concatBytes(...records))
		} finally {
			writer.releaseLock()
		}
	}
	async read() {
		for (; ;) {
			let record;
			for (; record = this.recordParser.next();) {
				if (record.type === CONTENT_TYPE_ALERT) {
					if (record.fragment[1] === ALERT_CLOSE_NOTIFY) return null;
					throw new Error(`TLS Alert: ${record.fragment[1]}`)
				}
				if (record.type !== CONTENT_TYPE_APPLICATION_DATA) continue;
				if (!this.isTls13) return this.decryptTls12(record.fragment, CONTENT_TYPE_APPLICATION_DATA);
				const { data, type } = await this.decryptTls13(record.fragment);
				if (type === CONTENT_TYPE_APPLICATION_DATA) return data;
				if (type === CONTENT_TYPE_ALERT) {
					if (data[1] === ALERT_CLOSE_NOTIFY) return null;
					throw new Error(`TLS Alert: ${data[1]}`)
				}
				if (type !== CONTENT_TYPE_HANDSHAKE) continue;
				let message;
				for (this.handshakeParser.feed(data); message = this.handshakeParser.next();)
					if (message.type !== HANDSHAKE_TYPE_NEW_SESSION_TICKET && message.type === HANDSHAKE_TYPE_KEY_UPDATE) throw new Error("TLS 1.3 KeyUpdate is not supported by TLSClientMini")
			}
			const reader = this.socket.readable.getReader();
			try {
				const { value, done } = await this.readChunk(reader);
				if (done) return null;
				this.recordParser.feed(value)
			} finally {
				reader.releaseLock()
			}
		}
	}
	close() { this.socket.close() }
}

function stripIPv6Brackets(hostname = '') {
	const host = String(hostname || '').trim();
	return host.startsWith('[') && host.endsWith(']') ? host.slice(1, -1) : host;
}

function isIPHostname(hostname = '') {
	const host = stripIPv6Brackets(hostname);
	const ipv4Regex = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
	if (ipv4Regex.test(host)) return true;
	if (!host.includes(':')) return false;
	try {
		new URL(`http://[${host}]/`);
		return true;
	} catch (e) {
		return false;
	}
}

//////////////////////////////////////////////////turnConnect///////////////////////////////////////////////
const CONNECT_TIMEOUT_MS = 9999;
const TURN_STUN_MAGIC_COOKIE = new Uint8Array([0x21, 0x12, 0xa4, 0x42]);
const TURN_STUN_TYPE = {
	ALLOCATE_REQUEST: 0x0003, ALLOCATE_SUCCESS: 0x0103, ALLOCATE_ERROR: 0x0113,
	CREATE_PERMISSION_REQUEST: 0x0008, CREATE_PERMISSION_SUCCESS: 0x0108,
	CONNECT_REQUEST: 0x000a, CONNECT_SUCCESS: 0x010a,
	CONNECTION_BIND_REQUEST: 0x000b, CONNECTION_BIND_SUCCESS: 0x010b
};
const TURN_STUN_ATTR = {
	USERNAME: 0x0006, MESSAGE_INTEGRITY: 0x0008, ERROR_CODE: 0x0009,
	XOR_PEER_ADDRESS: 0x0012, REALM: 0x0014, NONCE: 0x0015,
	REQUESTED_TRANSPORT: 0x0019, CONNECTION_ID: 0x002a
};

async function withTimeout(promise, timeoutMs, message) {
	let timer;
	try {
		return await Promise.race([
			promise,
			new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(message)), timeoutMs) })
		]);
	} finally {
		clearTimeout(timer);
	}
}

function isIPv4(value) {
	const parts = String(value || '').split('.');
	return parts.length === 4 && parts.every(part => /^\d{1,3}$/.test(part) && Number(part) >= 0 && Number(part) <= 255);
}

function turnStunPadding(length) {
	return -length & 3;
}

function createTurnStunAttribute(type, value) {
	const body = data_transformUint8Array(value);
	const attribute = new Uint8Array(4 + body.byteLength + turnStunPadding(body.byteLength));
	const view = new DataView(attribute.buffer);
	view.setUint16(0, type);
	view.setUint16(2, body.byteLength);
	attribute.set(body, 4);
	return attribute;
}

function createTurnStunMessage(type, transactionId, attributes) {
	const body = concat_bytes(...attributes);
	const header = new Uint8Array(20);
	const view = new DataView(header.buffer);
	view.setUint16(0, type);
	view.setUint16(2, body.byteLength);
	header.set(TURN_STUN_MAGIC_COOKIE, 4);
	header.set(transactionId, 8);
	return concat_bytes(header, body);
}

function parseTurnErrorCode(data) {
	return data?.byteLength >= 4 ? (data[2] & 7) * 100 + data[3] : 0;
}

function randomTurnTransactionId() {
	return crypto.getRandomValues(new Uint8Array(12));
}

async function addTurnMessageIntegrity(message, key) {
	const signedMessage = new Uint8Array(message);
	const view = new DataView(signedMessage.buffer);
	view.setUint16(2, view.getUint16(2) + 24);
	const hmacKey = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
	const signature = await crypto.subtle.sign('HMAC', hmacKey, signedMessage);
	return concat_bytes(signedMessage, createTurnStunAttribute(TURN_STUN_ATTR.MESSAGE_INTEGRITY, new Uint8Array(signature)));
}

async function readTurnStunMessage(reader, bufferedData = null, timeoutMessage = 'TURN response timed out') {
	let buffer = validdata_length(bufferedData) ? data_transformUint8Array(bufferedData) : new Uint8Array(0);
	const pull = async () => {
		const { done, value } = await withTimeout(reader.read(), CONNECT_TIMEOUT_MS, timeoutMessage);
		if (done) throw new Error('TURN server closed connection');
		if (value?.byteLength) buffer = concat_bytes(buffer, value);
	};
	while (buffer.byteLength < 20) await pull();

	const messageLength = 20 + ((buffer[2] << 8) | buffer[3]);
	if (messageLength > 65555) throw new Error('TURN response is too large');
	while (buffer.byteLength < messageLength) await pull();
	const messageBuffer = buffer.subarray(0, messageLength);
	if (TURN_STUN_MAGIC_COOKIE.some((value, index) => messageBuffer[4 + index] !== value)) throw new Error('Invalid TURN/STUN response');

	const view = new DataView(messageBuffer.buffer, messageBuffer.byteOffset, messageBuffer.byteLength);
	const attributes = {};
	for (let offset = 20; offset + 4 <= messageLength;) {
		const type = view.getUint16(offset);
		const length = view.getUint16(offset + 2);
		if (offset + 4 + length > messageBuffer.byteLength) break;
		attributes[type] = messageBuffer.slice(offset + 4, offset + 4 + length);
		offset += 4 + length + turnStunPadding(length);
	}
	return {
		message: { type: view.getUint16(0), attributes },
		extraData: buffer.byteLength > messageLength ? buffer.subarray(messageLength) : null
	};
}

async function writeTurnBytes(writer, bytes, timeoutMessage) {
	await withTimeout(writer.write(bytes), CONNECT_TIMEOUT_MS, timeoutMessage);
}

async function turnConnect(proxy, targetHost, targetPort, TCPconnect) {
	proxy = { ...proxy, username: proxy.username ?? null, password: proxy.password ?? null };
	const resolvedTargetHost = stripIPv6Brackets(targetHost);
	/** @type {string | null} */
	let targetIp = isIPv4(resolvedTargetHost) ? resolvedTargetHost : null;
	if (!targetIp) {
		const records = await DoHquery(resolvedTargetHost, 'A');
		const recordData = records.find(item => item.type === 1 && isIPv4(item.data))?.data;
		targetIp = typeof recordData === 'string' ? recordData : null;
	}
	if (!targetIp) throw new Error(`Could not resolve ${targetHost} to an IPv4 address for TURN CONNECT`);

	const turnHost = stripIPv6Brackets(proxy.hostname);
	let controlSocket = null, dataSocket = null, controlWriter = null, controlReader = null, dataWriter = null, dataReader = null, dataReaderReleased = false;
	const close = () => {
		try { controlSocket?.close?.() } catch (e) { }
		try { dataSocket?.close?.() } catch (e) { }
	};
	const releaseDataReader = () => {
		if (dataReaderReleased) return;
		dataReaderReleased = true;
		try { dataReader?.releaseLock?.() } catch (e) { }
	};

	try {
		controlSocket = TCPconnect({ hostname: turnHost, port: proxy.port });
		await withTimeout(controlSocket.opened, CONNECT_TIMEOUT_MS, 'TURN server connection timed out');
		controlWriter = controlSocket.writable.getWriter();
		controlReader = controlSocket.readable.getReader();

		const xorPeerAddress = new Uint8Array(8);
		xorPeerAddress[1] = 1;
		new DataView(xorPeerAddress.buffer).setUint16(2, targetPort ^ 0x2112);
		targetIp.split('.').forEach((value, index) => {
			xorPeerAddress[4 + index] = Number(value) ^ TURN_STUN_MAGIC_COOKIE[index];
		});
		const peerAddress = createTurnStunAttribute(TURN_STUN_ATTR.XOR_PEER_ADDRESS, xorPeerAddress);
		const requestedTransport = new Uint8Array([6, 0, 0, 0]);

		await writeTurnBytes(controlWriter, createTurnStunMessage(
			TURN_STUN_TYPE.ALLOCATE_REQUEST,
			randomTurnTransactionId(),
			[createTurnStunAttribute(TURN_STUN_ATTR.REQUESTED_TRANSPORT, requestedTransport)]
		), 'TURN Allocate request timed out');

		let turnResponse = await readTurnStunMessage(controlReader, null, 'TURN Allocate response timed out');
		let message = turnResponse.message;
		let bufferedData = turnResponse.extraData;
		let integrityKey = null;
		let authAttributes = [];
		const sign = messageToSign => integrityKey ? addTurnMessageIntegrity(messageToSign, integrityKey) : Promise.resolve(messageToSign);

		if (
			message.type === TURN_STUN_TYPE.ALLOCATE_ERROR
			&& proxy.username !== null
			&& proxy.password !== null
			&& parseTurnErrorCode(message.attributes[TURN_STUN_ATTR.ERROR_CODE]) === 401
		) {
			const realmBytes = message.attributes[TURN_STUN_ATTR.REALM];
			const nonce = message.attributes[TURN_STUN_ATTR.NONCE];
			if (!realmBytes || !nonce?.byteLength) throw new Error('TURN authentication challenge is missing realm or nonce');

			const realm = textDecoder.decode(realmBytes);
			integrityKey = new Uint8Array(await crypto.subtle.digest('MD5', textEncoder.encode(`${proxy.username}:${realm}:${proxy.password}`)));
			authAttributes = [
				createTurnStunAttribute(TURN_STUN_ATTR.USERNAME, textEncoder.encode(proxy.username)),
				createTurnStunAttribute(TURN_STUN_ATTR.REALM, textEncoder.encode(realm)),
				createTurnStunAttribute(TURN_STUN_ATTR.NONCE, nonce)
			];

			const allocateRequest = await addTurnMessageIntegrity(createTurnStunMessage(
				TURN_STUN_TYPE.ALLOCATE_REQUEST,
				randomTurnTransactionId(),
				[
					createTurnStunAttribute(TURN_STUN_ATTR.REQUESTED_TRANSPORT, requestedTransport),
					...authAttributes
				]
			), integrityKey);
			const pipelinedMessages = await Promise.all([
				sign(createTurnStunMessage(TURN_STUN_TYPE.CREATE_PERMISSION_REQUEST, randomTurnTransactionId(), [peerAddress, ...authAttributes])),
				sign(createTurnStunMessage(TURN_STUN_TYPE.CONNECT_REQUEST, randomTurnTransactionId(), [peerAddress, ...authAttributes]))
			]);
			await writeTurnBytes(controlWriter, concat_bytes(allocateRequest, ...pipelinedMessages), 'TURN authenticated Allocate request timed out');
			turnResponse = await readTurnStunMessage(controlReader, bufferedData, 'TURN authenticated Allocate response timed out');
			message = turnResponse.message;
			bufferedData = turnResponse.extraData;
		} else if (message.type === TURN_STUN_TYPE.ALLOCATE_SUCCESS) {
			const pipelinedMessages = await Promise.all([
				sign(createTurnStunMessage(TURN_STUN_TYPE.CREATE_PERMISSION_REQUEST, randomTurnTransactionId(), [peerAddress, ...authAttributes])),
				sign(createTurnStunMessage(TURN_STUN_TYPE.CONNECT_REQUEST, randomTurnTransactionId(), [peerAddress, ...authAttributes]))
			]);
			if (pipelinedMessages.length) await writeTurnBytes(controlWriter, concat_bytes(...pipelinedMessages), 'TURN pipelined request timed out');
		}

		if (message.type !== TURN_STUN_TYPE.ALLOCATE_SUCCESS) {
			const errorCode = parseTurnErrorCode(message.attributes[TURN_STUN_ATTR.ERROR_CODE]);
			throw new Error(errorCode ? `TURN Allocate failed with ${errorCode}` : 'TURN Allocate failed');
		}

		dataSocket = TCPconnect({ hostname: turnHost, port: proxy.port });
		turnResponse = await readTurnStunMessage(controlReader, bufferedData, 'TURN CreatePermission response timed out');
		message = turnResponse.message;
		bufferedData = turnResponse.extraData;
		if (message.type !== TURN_STUN_TYPE.CREATE_PERMISSION_SUCCESS) throw new Error('TURN CreatePermission failed');

		turnResponse = await readTurnStunMessage(controlReader, bufferedData, 'TURN CONNECT response timed out');
		message = turnResponse.message;
		bufferedData = turnResponse.extraData;
		if (message.type !== TURN_STUN_TYPE.CONNECT_SUCCESS || !message.attributes[TURN_STUN_ATTR.CONNECTION_ID]) throw new Error('TURN CONNECT failed');

		await withTimeout(dataSocket.opened, CONNECT_TIMEOUT_MS, 'TURN data connection timed out');
		dataWriter = dataSocket.writable.getWriter();
		dataReader = dataSocket.readable.getReader();
		await writeTurnBytes(dataWriter, await sign(createTurnStunMessage(
			TURN_STUN_TYPE.CONNECTION_BIND_REQUEST,
			randomTurnTransactionId(),
			[
				createTurnStunAttribute(TURN_STUN_ATTR.CONNECTION_ID, message.attributes[TURN_STUN_ATTR.CONNECTION_ID]),
				...authAttributes
			]
		)), 'TURN ConnectionBind request timed out');

		turnResponse = await readTurnStunMessage(dataReader, null, 'TURN ConnectionBind response timed out');
		message = turnResponse.message;
		const extraPayload = turnResponse.extraData;
		if (message.type !== TURN_STUN_TYPE.CONNECTION_BIND_SUCCESS) throw new Error('TURN ConnectionBind failed');

		controlWriter.releaseLock();
		controlWriter = null;
		controlReader.releaseLock();
		controlReader = null;
		dataWriter.releaseLock();
		dataWriter = null;

		const readable = new ReadableStream({
			start(controller) {
				if (extraPayload?.byteLength) controller.enqueue(extraPayload);
			},
			pull(controller) {
				return dataReader.read().then(({ done, value }) => {
					if (done) {
						releaseDataReader();
						controller.close();
					} else if (value?.byteLength) controller.enqueue(new Uint8Array(value));
				});
			},
			cancel() {
				try { dataReader?.cancel?.() } catch (e) { }
				releaseDataReader();
				close();
			}
		});

		return { readable, writable: dataSocket.writable, closed: dataSocket.closed, close };
	} catch (error) {
		try { controlWriter?.releaseLock?.() } catch (e) { }
		try { controlReader?.releaseLock?.() } catch (e) { }
		try { dataWriter?.releaseLock?.() } catch (e) { }
		releaseDataReader();
		close();
		throw error;
	}
}
//////////////////////////////////////////////////sstpConnect///////////////////////////////////////////////
const SSTP_TCP_MSS = 1400;
const SSTP_EMPTY_BYTES = new Uint8Array(0);

function readSstpUint16(bytes, offset = 0) {
	return (bytes[offset] << 8) | bytes[offset + 1];
}

function readSstpUint32(bytes, offset = 0) {
	return ((bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]) >>> 0;
}

function randomSstpUint16() {
	return readSstpUint16(crypto.getRandomValues(new Uint8Array(2)));
}

function internetChecksum(bytes, offset, length) {
	let sum = 0;
	for (let index = offset; index < offset + length - 1; index += 2) sum += readSstpUint16(bytes, index);
	if (length & 1) sum += bytes[offset + length - 1] << 8;
	while (sum >> 16) sum = (sum & 0xffff) + (sum >> 16);
	return (~sum) & 0xffff;
}

async function sstpConnect(proxy, targetHost, targetPort, TCPconnect) {
	proxy = { ...proxy, username: proxy.username ?? null, password: proxy.password ?? null };
	let bufferedBytes = SSTP_EMPTY_BYTES, pppIdentifier = 1, socket = null, reader = null, writer = null;
	let closedSettled = false, resolveClosed, rejectClosed;
	const closed = new Promise((resolve, reject) => {
		resolveClosed = resolve;
		rejectClosed = reject;
	});
	const settleClosed = (settle, value) => {
		if (closedSettled) return;
		closedSettled = true;
		settle(value);
	};
	const close = () => {
		try { reader?.cancel?.().catch?.(() => { }) } catch (e) { }
		try { reader?.releaseLock?.() } catch (e) { }
		try { writer?.close?.().catch?.(() => { }) } catch (e) { }
		try { writer?.releaseLock?.() } catch (e) { }
		try { socket?.close?.() } catch (e) { }
		settleClosed(resolveClosed);
	};

	const readSocketChunk = async () => {
		const { value, done } = await reader.read();
		if (done || !value) throw new Error('SSTP socket closed');
		return data_transformUint8Array(value);
	};
	const readBytes = async length => {
		while (bufferedBytes.byteLength < length) {
			const chunk = await readSocketChunk();
			bufferedBytes = bufferedBytes.byteLength ? concat_bytes(bufferedBytes, chunk) : chunk;
		}
		const result = bufferedBytes.subarray(0, length);
		bufferedBytes = bufferedBytes.subarray(length);
		return result;
	};
	const readHttpLine = async () => {
		for (; ;) {
			const lineEnd = bufferedBytes.indexOf(10);
			if (lineEnd >= 0) {
				const line = textDecoder.decode(bufferedBytes.subarray(0, lineEnd));
				bufferedBytes = bufferedBytes.subarray(lineEnd + 1);
				return line.replace(/\r$/, '');
			}
			const chunk = await readSocketChunk();
			bufferedBytes = bufferedBytes.byteLength ? concat_bytes(bufferedBytes, chunk) : chunk;
		}
	};
	const readPacket = async (timeoutMs = CONNECT_TIMEOUT_MS) => {
		const header = await withTimeout(readBytes(4), timeoutMs, 'SSTP read timeout');
		const length = readSstpUint16(header, 2) & 0x0fff;
		if (length < 4) throw new Error('Invalid SSTP packet length');
		return {
			isControl: (header[1] & 1) !== 0,
			body: length > 4 ? await withTimeout(readBytes(length - 4), timeoutMs, 'SSTP packet body read timeout') : SSTP_EMPTY_BYTES
		};
	};
	const buildSstpDataPacket = pppFrame => {
		const packetLength = 6 + pppFrame.byteLength;
		const packet = new Uint8Array(packetLength);
		packet.set([0x10, 0x00, ((packetLength >> 8) & 0x0f) | 0x80, packetLength & 0xff, 0xff, 0x03]);
		packet.set(pppFrame, 6);
		return packet;
	};
	const buildPppConfigurePacket = (protocol, code, id, options = []) => {
		const optionsLength = options.reduce((size, option) => size + 2 + option.data.byteLength, 0);
		const frame = new Uint8Array(6 + optionsLength);
		const view = new DataView(frame.buffer);
		view.setUint16(0, protocol);
		frame[2] = code;
		frame[3] = id;
		view.setUint16(4, 4 + optionsLength);
		options.reduce((offset, option) => {
			frame[offset] = option.type;
			frame[offset + 1] = 2 + option.data.byteLength;
			frame.set(option.data, offset + 2);
			return offset + 2 + option.data.byteLength;
		}, 6);
		return frame;
	};
	const parsePPPFrame = data => {
		const offset = data.byteLength >= 2 && data[0] === 0xff && data[1] === 0x03 ? 2 : 0;
		if (data.byteLength - offset < 4) return null;
		const protocol = readSstpUint16(data, offset);
		if (protocol === 0x0021) return { protocol, ipPacket: data.subarray(offset + 2) };
		if (data.byteLength - offset < 6) return null;
		return { protocol, code: data[offset + 2], id: data[offset + 3], payload: data.subarray(offset + 6), rawPacket: data.subarray(offset) };
	};
	const parsePppOptions = data => {
		const options = [];
		for (let offset = 0; offset + 2 <= data.byteLength;) {
			const type = data[offset];
			const length = data[offset + 1];
			if (length < 2 || offset + length > data.byteLength) break;
			options.push({ type, data: data.subarray(offset + 2, offset + length) });
			offset += length;
		}
		return options;
	};

	try {
		const serverHost = stripIPv6Brackets(proxy.hostname);
		const serverPort = proxy.port;
		socket = TCPconnect({ hostname: serverHost, port: serverPort }, { secureTransport: 'on', allowHalfOpen: false });
		await withTimeout(socket.opened, CONNECT_TIMEOUT_MS, 'SSTP server connection timed out');
		reader = socket.readable.getReader();
		writer = socket.writable.getWriter();

		const displayHost = serverHost.includes(':') ? `[${serverHost}]` : serverHost;
		const httpRequest = textEncoder.encode(
			`SSTP_DUPLEX_POST /sra_{BA195980-CD49-458b-9E23-C84EE0ADCD75}/ HTTP/1.1\r\n`
			+ `Host: ${Number(serverPort) === 443 ? displayHost : `${displayHost}:${serverPort}`}\r\n`
			+ 'Content-Length: 18446744073709551615\r\n'
			+ `SSTPCORRELATIONID: {${crypto.randomUUID()}}\r\n\r\n`
		);
		const encapsulatedProtocol = new Uint8Array(2);
		new DataView(encapsulatedProtocol.buffer).setUint16(0, 1);
		const maximumReceiveUnit = new Uint8Array(2);
		new DataView(maximumReceiveUnit.buffer).setUint16(0, 1500);
		const sstpConnectRequest = new Uint8Array(12 + encapsulatedProtocol.byteLength);
		const sstpConnectView = new DataView(sstpConnectRequest.buffer);
		sstpConnectRequest[0] = 0x10;
		sstpConnectRequest[1] = 0x01;
		sstpConnectView.setUint16(2, sstpConnectRequest.byteLength | 0x8000);
		sstpConnectView.setUint16(4, 0x0001);
		sstpConnectView.setUint16(6, 1);
		sstpConnectRequest[9] = 1;
		sstpConnectView.setUint16(10, 4 + encapsulatedProtocol.byteLength);
		sstpConnectRequest.set(encapsulatedProtocol, 12);

		await withTimeout(writer.write(concat_bytes(
			httpRequest,
			sstpConnectRequest,
			buildSstpDataPacket(buildPppConfigurePacket(0xc021, 1, pppIdentifier++, [
				{ type: 1, data: maximumReceiveUnit }
			]))
		)), CONNECT_TIMEOUT_MS, 'SSTP HTTP handshake request timed out');

		const statusLine = await withTimeout(readHttpLine(), CONNECT_TIMEOUT_MS, 'SSTP HTTP handshake timed out');
		for (; ;) {
			const line = await withTimeout(readHttpLine(), CONNECT_TIMEOUT_MS, 'SSTP HTTP header read timed out');
			if (line === '') break;
		}
		if (!/HTTP\/\d(?:\.\d)?\s+2\d\d/i.test(statusLine)) throw new Error(`SSTP HTTP handshake failed: ${statusLine || 'invalid status'}`);

		let localLcpAcked = false, peerLcpAcked = false, papRequired = false, papSent = false, papDone = false, ipcpStarted = false, ipcpFinished = false, sourceIp = null;
		const sendPapIfReady = async () => {
			if (!localLcpAcked || !peerLcpAcked || !papRequired || papSent) return;
			if (proxy.username === null || proxy.password === null) throw new Error('SSTP server requires PAP authentication');
			const username = textEncoder.encode(proxy.username);
			const password = textEncoder.encode(proxy.password);
			if (username.byteLength > 255 || password.byteLength > 255) throw new Error('SSTP username/password is too long');
			const papLength = 6 + username.byteLength + password.byteLength;
			const frame = new Uint8Array(2 + papLength);
			const view = new DataView(frame.buffer);
			view.setUint16(0, 0xc023);
			frame[2] = 1;
			frame[3] = pppIdentifier++;
			view.setUint16(4, papLength);
			frame[6] = username.byteLength;
			frame.set(username, 7);
			frame[7 + username.byteLength] = password.byteLength;
			frame.set(password, 8 + username.byteLength);
			await withTimeout(writer.write(buildSstpDataPacket(frame)), CONNECT_TIMEOUT_MS, 'SSTP PAP authentication request timed out');
			papSent = true;
		};
		const startIpcpIfReady = async () => {
			if (!localLcpAcked || !peerLcpAcked || ipcpStarted || (papRequired && !papDone)) return;
			await withTimeout(writer.write(buildSstpDataPacket(buildPppConfigurePacket(0x8021, 1, pppIdentifier++, [
				{ type: 3, data: new Uint8Array(4) }
			]))), CONNECT_TIMEOUT_MS, 'SSTP IPCP request timed out');
			ipcpStarted = true;
		};

		for (let round = 0; round < 50 && !ipcpFinished; round++) {
			const packet = await readPacket(CONNECT_TIMEOUT_MS);
			if (packet.isControl) continue;
			const ppp = parsePPPFrame(packet.body);
			if (!ppp) continue;

			if (ppp.protocol === 0xc021) {
				if (ppp.code === 1) {
					const authOption = parsePppOptions(ppp.payload).find(option => option.type === 3);
					if (authOption?.data?.byteLength >= 2) {
						const authProtocol = readSstpUint16(authOption.data);
						if (authProtocol !== 0xc023) throw new Error(`SSTP unsupported PPP authentication protocol: 0x${authProtocol.toString(16)}`);
						papRequired = true;
					}
					const ack = new Uint8Array(ppp.rawPacket);
					ack[2] = 2;
					await withTimeout(writer.write(buildSstpDataPacket(ack)), CONNECT_TIMEOUT_MS, 'SSTP LCP Configure-Ack timed out');
					peerLcpAcked = true;
					await sendPapIfReady();
					await startIpcpIfReady();
				} else if (ppp.code === 2) {
					localLcpAcked = true;
					await sendPapIfReady();
					await startIpcpIfReady();
				}
				continue;
			}

			if (ppp.protocol === 0xc023) {
				if (ppp.code === 2) {
					papDone = true;
					await startIpcpIfReady();
				} else if (ppp.code === 3) throw new Error('SSTP PAP authentication failed');
				continue;
			}

			if (ppp.protocol === 0x8021) {
				if (ppp.code === 1) {
					const ack = new Uint8Array(ppp.rawPacket);
					ack[2] = 2;
					await withTimeout(writer.write(buildSstpDataPacket(ack)), CONNECT_TIMEOUT_MS, 'SSTP IPCP Configure-Ack timed out');
					await startIpcpIfReady();
				} else if (ppp.code === 3) {
					const addressOption = parsePppOptions(ppp.payload).find(option => option.type === 3);
					if (addressOption?.data?.byteLength === 4) {
						sourceIp = [...addressOption.data].join('.');
						await withTimeout(writer.write(buildSstpDataPacket(buildPppConfigurePacket(0x8021, 1, pppIdentifier++, [
							{ type: 3, data: addressOption.data }
						]))), CONNECT_TIMEOUT_MS, 'SSTP IPCP address request timed out');
						ipcpStarted = true;
					}
				} else if (ppp.code === 2) {
					const addressOption = parsePppOptions(ppp.payload).find(option => option.type === 3);
					if (addressOption?.data?.byteLength === 4) sourceIp = [...addressOption.data].join('.');
					ipcpFinished = true;
				}
			}
		}
		if (!sourceIp) throw new Error('SSTP did not assign an IPv4 address');

		const target = stripIPv6Brackets(targetHost);
		/** @type {string | null} */
		let targetIp = isIPv4(target) ? target : null;
		if (!targetIp) {
			const records = await DoHquery(target, 'A');
			const recordData = records.find(item => item.type === 1 && isIPv4(item.data))?.data;
			targetIp = typeof recordData === 'string' ? recordData : null;
		}
		if (!targetIp) throw new Error(`Could not resolve ${targetHost} to an IPv4 address for SSTP`);

		const sourcePort = 10000 + (randomSstpUint16() % 50000);
		const sourceAddress = new Uint8Array(String(sourceIp || '').split('.').map(Number));
		const destinationAddress = new Uint8Array(String(targetIp || '').split('.').map(Number));
		let sequenceNumber = readSstpUint32(crypto.getRandomValues(new Uint8Array(4)));
		let acknowledgementNumber = 0;
		const ipHeaderTemplate = new Uint8Array(20);
		ipHeaderTemplate.set([0x45, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 64, 6]);
		ipHeaderTemplate.set(sourceAddress, 12);
		ipHeaderTemplate.set(destinationAddress, 16);
		const tcpPseudoHeader = new Uint8Array(1432);
		tcpPseudoHeader.set(sourceAddress);
		tcpPseudoHeader.set(destinationAddress, 4);
		tcpPseudoHeader[9] = 6;
		const buildTcpFrame = (flags, payload = SSTP_EMPTY_BYTES) => {
			const bytes = data_transformUint8Array(payload);
			const payloadLength = bytes.byteLength;
			const tcpLength = 20 + payloadLength;
			const ipLength = 20 + tcpLength;
			const sstpLength = 8 + ipLength;
			const frame = new Uint8Array(sstpLength);
			const view = new DataView(frame.buffer);
			frame.set([0x10, 0x00, ((sstpLength >> 8) & 0x0f) | 0x80, sstpLength & 0xff, 0xff, 0x03, 0x00, 0x21]);
			frame.set(ipHeaderTemplate, 8);
			view.setUint16(10, ipLength);
			view.setUint16(12, randomSstpUint16());
			view.setUint16(18, internetChecksum(frame, 8, 20));
			view.setUint16(28, sourcePort);
			view.setUint16(30, targetPort);
			view.setUint32(32, sequenceNumber);
			view.setUint32(36, acknowledgementNumber);
			frame[40] = 0x50;
			frame[41] = flags;
			view.setUint16(42, 65535);
			if (payloadLength) frame.set(bytes, 48);
			tcpPseudoHeader[10] = tcpLength >> 8;
			tcpPseudoHeader[11] = tcpLength & 0xff;
			tcpPseudoHeader.set(frame.subarray(28, 28 + tcpLength), 12);
			view.setUint16(44, internetChecksum(tcpPseudoHeader, 0, 12 + tcpLength));
			return frame;
		};
		const matchIncomingIpPacket = ipPacket => {
			if (ipPacket.byteLength < 40 || ipPacket[9] !== 6) return null;
			const ipHeaderLength = (ipPacket[0] & 0x0f) * 4;
			if (ipPacket.byteLength < ipHeaderLength + 20) return null;
			if (readSstpUint16(ipPacket, ipHeaderLength) !== targetPort) return null;
			if (readSstpUint16(ipPacket, ipHeaderLength + 2) !== sourcePort) return null;
			return {
				flags: ipPacket[ipHeaderLength + 13],
				sequence: readSstpUint32(ipPacket, ipHeaderLength + 4),
				payloadOffset: ipHeaderLength + ((ipPacket[ipHeaderLength + 12] >> 4) & 0x0f) * 4
			};
		};

		await withTimeout(writer.write(buildTcpFrame(0x02)), CONNECT_TIMEOUT_MS, 'SSTP TCP SYN write timed out');
		sequenceNumber = (sequenceNumber + 1) >>> 0;
		let tcpReady = false;
		for (let attempt = 0; attempt < 30; attempt++) {
			const packet = await readPacket(CONNECT_TIMEOUT_MS);
			if (packet.isControl) continue;
			const ppp = parsePPPFrame(packet.body);
			if (!ppp || ppp.protocol !== 0x0021) continue;
			const tcp = matchIncomingIpPacket(ppp.ipPacket);
			if (!tcp || (tcp.flags & 0x12) !== 0x12) continue;
			acknowledgementNumber = (tcp.sequence + 1) >>> 0;
			await withTimeout(writer.write(buildTcpFrame(0x10)), CONNECT_TIMEOUT_MS, 'SSTP TCP ACK write timed out');
			tcpReady = true;
			break;
		}
		if (!tcpReady) throw new Error('TCP handshake through SSTP timed out');

		/** @type {ReadableStreamDefaultController<Uint8Array> | null} */
		let streamController = null;
		const readable = new ReadableStream({
			start(controller) {
				streamController = controller;
			},
			cancel() {
				close();
			}
		});

		(async () => {
			try {
				let pendingChunks = [], pendingLength = 0;
				const flush = () => {
					if (!pendingLength) return;
					if (!streamController) throw new Error('SSTP readable stream is not ready');
					streamController.enqueue(pendingChunks.length === 1 ? pendingChunks[0] : concat_bytes(...pendingChunks));
					pendingChunks = [];
					pendingLength = 0;
					writer.write(buildTcpFrame(0x10)).catch(() => { });
				};

				for (; ;) {
					const packet = await readPacket(60000);
					if (packet.isControl) continue;
					const ppp = parsePPPFrame(packet.body);
					if (!ppp || ppp.protocol !== 0x0021) continue;
					const incoming = matchIncomingIpPacket(ppp.ipPacket);
					if (!incoming) continue;

					if (incoming.payloadOffset < ppp.ipPacket.byteLength) {
						const payload = ppp.ipPacket.subarray(incoming.payloadOffset);
						if (payload.byteLength) {
							acknowledgementNumber = (incoming.sequence + payload.byteLength) >>> 0;
							pendingChunks.push(new Uint8Array(payload));
							pendingLength += payload.byteLength;
						}
					}

					if (incoming.flags & 0x01) {
						flush();
						acknowledgementNumber = (acknowledgementNumber + 1) >>> 0;
						writer.write(buildTcpFrame(0x11)).catch(() => { });
						const controller = streamController;
						if (controller) {
							try { controller.close() } catch (e) { }
						}
						close();
						return;
					}

					if (bufferedBytes.byteLength < 4 || pendingLength >= 32768) flush();
				}
			} catch (error) {
				const controller = streamController;
				if (controller) {
					try { controller.error(error) } catch (e) { }
				}
				settleClosed(rejectClosed, error);
				try { socket?.close?.() } catch (e) { }
			}
		})();

		const writable = new WritableStream({
			async write(chunk) {
				const bytes = data_transformUint8Array(chunk);
				if (!bytes.byteLength) return;
				if (bytes.byteLength <= SSTP_TCP_MSS) {
					await writer.write(buildTcpFrame(0x18, bytes));
					sequenceNumber = (sequenceNumber + bytes.byteLength) >>> 0;
					return;
				}
				const frames = [];
				for (let offset = 0; offset < bytes.byteLength; offset += SSTP_TCP_MSS) {
					const segment = bytes.subarray(offset, Math.min(offset + SSTP_TCP_MSS, bytes.byteLength));
					frames.push(buildTcpFrame(0x18, segment));
					sequenceNumber = (sequenceNumber + segment.byteLength) >>> 0;
				}
				await writer.write(concat_bytes(...frames));
			},
			close() {
				return writer.write(buildTcpFrame(0x11)).catch(() => { });
			},
			abort(error) {
				close();
				if (error) settleClosed(rejectClosed, error);
			}
		});

		return { readable, writable, closed, close };
	} catch (error) {
		close();
		throw error;
	}
}
/**
 * Base64 encode
 * @param {string} plaintext - originalstring
 * @param {string} secret - string（ "KEY123"）
 * @returns {string} process Base64 string
 */
function base64SecretEncode(plaintext, secret) {
	const encoder = new TextEncoder();
	const data = encoder.encode(plaintext);
	const key = encoder.encode(secret);
	const mixed = new Uint8Array(data.length);

	for (let i = 0; i < data.length; i++) {
		mixed[i] = data[i] ^ key[i % key.length];
	}

	let binary = '';
	for (let i = 0; i < mixed.length; i++) {
		binary += String.fromCharCode(mixed[i]);
	}
	return btoa(binary);
}

/**
 * Base64 decode
 * @param {string} encoded - process Base64 string
 * @param {string} secret - string（encode）
 * @returns {string} decodebackoriginalstring
 */
function base64SecretDecode(encoded, secret) {
	const binary = atob(encoded);
	const mixed = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		mixed[i] = binary.charCodeAt(i);
	}

	const encoder = new TextEncoder();
	const key = encoder.encode(secret);
	const data = new Uint8Array(mixed.length);

	for (let i = 0; i < mixed.length; i++) {
		data[i] = mixed[i] ^ key[i % key.length];
	}

	const decoder = new TextDecoder();
	return decoder.decode(data);
}

function gettransportprotocolconfig(config = {}) {
	const yesgRPC = config.transportprotocol === 'grpc';
	const { header: localPaddingheader, : localPadding } = getHTTPPadding(config.UUID);
	const JSON = {
		"xPaddingObfsMode": true,
		"xPaddingMethod": "tokenish",
		"xPaddingPlacement": "queryInHeader",
		"xPaddingHeader": localPaddingheader,
		"xPaddingKey": localPadding
	};
	return {
		type: yesgRPC ? (config.gRPC === 'multi' ? 'grpc&mode=multi' : 'grpc&mode=gun') : (config.transportprotocol === 'xhttp' ? `xhttp&mode=stream-one&extra=${encodeURIComponent(JSON.stringify(JSON))}` : 'ws'),
		path: yesgRPC ? 'serviceName' : 'path',
		domain: yesgRPC ? 'authority' : 'host'
	};
}

function gettransportpathparam(config = {}, node_path = '/', aspreferredsubscribegenerator = false) {
	const path = aspreferredsubscribegenerator ? '/' : (config.randompath ? randompath(node_path) : node_path);
	if (config.transportprotocol !== 'grpc') return path;
	return path.split('?')[0] || '/';
}

function log(...args) {
	if (debuglog) console.log(...args);
}

function Clashsubscribeconfig(Clash_originalsubscription_content, config_JSON = {}) {
	const uuid = config_JSON?.UUID || null;
	const ECHenable = Boolean(config_JSON?.ECH);
	const HOSTS = Array.isArray(config_JSON?.HOSTS) ? [...config_JSON.HOSTS] : [];
	const ECH_SNI = config_JSON?.ECHConfig?.SNI || null;
	const ECH_DNS = config_JSON?.ECHConfig?.DNS;
	const needprocessECH = Boolean(uuid && ECHenable);
	const gRPCUserAgent = (typeof config_JSON?.gRPCUserAgent === 'string' && config_JSON.gRPCUserAgent.trim()) ? config_JSON.gRPCUserAgent.trim() : null;
	const needprocessgRPC = config_JSON?.transportprotocol === "grpc" && Boolean(gRPCUserAgent);
	const gRPCUserAgentYAML = gRPCUserAgent ? JSON.stringify(gRPCUserAgent) : null;
	let clash_yaml = Clash_originalsubscription_content.replace(/mode:\s*Rule\b/g, 'mode: rule');

	const baseDnsBlock = `dns:
 enable: true
 default-nameserver:
 - 223.5.5.5
 - 119.29.29.29
 - 114.114.114.114
 use-hosts: true
 nameserver:
 - https://sm2.doh.pub/dns-query
 - https://dns.alidns.com/dns-query
 fallback:
 - 8.8.4.4
 - 208.67.220.220
 fallback-filter:
 geoip: true
 geoip-code: CN
 ipcidr:
 - 240.0.0.0/4
 - 127.0.0.1/32
 - 0.0.0.0/32
 domain:
 - '+.google.com'
 - '+.facebook.com'
 - '+.youtube.com'
`;

	const addInlineGrpcUserAgent = (text) => text.replace(/grpc-opts:\s*\{([\s\S]*?)\}/i, (all, inner) => {
		if (/grpc-user-agent\s*:/i.test(inner)) return all;
		let content = inner.trim();
		if (content.endsWith(',')) content = content.slice(0, -1).trim();
		const patchedContent = content ? `${content}, grpc-user-agent: ${gRPCUserAgentYAML}` : `grpc-user-agent: ${gRPCUserAgentYAML}`;
		return `grpc-opts: {${patchedContent}}`;
	});
	const matchgRPCnetwork = (text) => /(?:^|[,{])\s*network:\s*(?:"grpc"|'grpc'|grpc)(?=\s*(?:[,}\n#]|$))/mi.test(text);
	const getproxytype = (nodeText) => nodeText.match(/type:\s*(\w+)/)?.[1] || 'vl' + 'ess';
	const get = (nodeText, isFlowStyle) => {
		const credentialField = getproxytype(nodeText) === 'trojan' ? 'password' : 'uuid';
		const pattern = new RegExp(`${credentialField}:\\s*${isFlowStyle ? '([^,}\\n]+)' : '([^\\n]+)'}`);
		return nodeText.match(pattern)?.[1]?.trim() || null;
	};
	const insertNameserverPolicy = (yaml, hostsEntries) => {
		if (/^\s{2}nameserver-policy:\s*(?:\n|$)/m.test(yaml)) {
			return yaml.replace(/^(\s{2}nameserver-policy:\s*\n)/m, `$1${hostsEntries}\n`);
		}
		const lines = yaml.split('\n');
		let dnsBlockEndIndex = -1;
		let inDnsBlock = false;
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			if (/^dns:\s*$/.test(line)) {
				inDnsBlock = true;
				continue;
			}
			if (inDnsBlock && /^[a-zA-Z]/.test(line)) {
				dnsBlockEndIndex = i;
				break;
			}
		}
		const nameserverPolicyBlock = ` nameserver-policy:\n${hostsEntries}`;
		if (dnsBlockEndIndex !== -1) lines.splice(dnsBlockEndIndex, 0, nameserverPolicyBlock);
		else lines.push(nameserverPolicyBlock);
		return lines.join('\n');
	};
	const addFlowgRPCUserAgent = (nodeText) => {
		if (!matchgRPCnetwork(nodeText) || /grpc-user-agent\s*:/i.test(nodeText)) return nodeText;
		if (/grpc-opts:\s*\{/i.test(nodeText)) return addInlineGrpcUserAgent(nodeText);
		return nodeText.replace(/\}(\s*)$/, `, grpc-opts: {grpc-user-agent: ${gRPCUserAgentYAML}}}$1`);
	};
	const addBlockgRPCUserAgent = (nodeLines, topLevelIndent) => {
		const = ' '.repeat(topLevelIndent);
		let grpcOptsIndex = -1;
		for (let idx = 0; idx < nodeLines.length; idx++) {
			const line = nodeLines[idx];
			if (!line.trim()) continue;
			const indent = line.search(/\S/);
			if (indent !== topLevelIndent) continue;
			if (/^\s*grpc-opts:\s*(?:#.*)?$/.test(line) || /^\s*grpc-opts:\s*\{.*\}\s*(?:#.*)?$/.test(line)) {
				grpcOptsIndex = idx;
				break;
			}
		}
		if (grpcOptsIndex === -1) {
			let insertIndex = -1;
			for (let j = nodeLines.length - 1; j >= 0; j--) {
				if (nodeLines[j].trim()) {
					insertIndex = j;
					break;
				}
			}
			if (insertIndex >= 0) nodeLines.splice(insertIndex + 1, 0, `${}grpc-opts:`, `${} grpc-user-agent: ${gRPCUserAgentYAML}`);
			return nodeLines;
		}
		const grpcLine = nodeLines[grpcOptsIndex];
		if (/^\s*grpc-opts:\s*\{.*\}\s*(?:#.*)?$/.test(grpcLine)) {
			if (!/grpc-user-agent\s*:/i.test(grpcLine)) nodeLines[grpcOptsIndex] = addInlineGrpcUserAgent(grpcLine);
			return nodeLines;
		}
		let blockEndIndex = nodeLines.length;
		let child = topLevelIndent + 2;
		let hasgRPCUserAgent = false;
		for (let idx = grpcOptsIndex + 1; idx < nodeLines.length; idx++) {
			const line = nodeLines[idx];
			const trimmed = line.trim();
			if (!trimmed) continue;
			const indent = line.search(/\S/);
			if (indent <= topLevelIndent) {
				blockEndIndex = idx;
				break;
			}
			if (indent > topLevelIndent && child === topLevelIndent + 2) child = indent;
			if (/^grpc-user-agent\s*:/.test(trimmed)) {
				hasgRPCUserAgent = true;
				break;
			}
		}
		if (!hasgRPCUserAgent) nodeLines.splice(blockEndIndex, 0, `${' '.repeat(child)}grpc-user-agent: ${gRPCUserAgentYAML}`);
		return nodeLines;
	};
	const addBlockECHOpts = (nodeLines, topLevelIndent) => {
		let insertIndex = -1;
		for (let j = nodeLines.length - 1; j >= 0; j--) {
			if (nodeLines[j].trim()) {
				insertIndex = j;
				break;
			}
		}
		if (insertIndex < 0) return nodeLines;
		const indent = ' '.repeat(topLevelIndent);
		const echOptsLines = [`${indent}ech-opts:`, `${indent} enable: true`];
		if (ECH_SNI) echOptsLines.push(`${indent} query-server-name: ${ECH_SNI}`);
		nodeLines.splice(insertIndex + 1, 0, ...echOptsLines);
		return nodeLines;
	};

	if (!/^dns:\s*(?:\n|$)/m.test(clash_yaml)) clash_yaml = baseDnsBlock + clash_yaml;
	if (ECH_SNI && !HOSTS.includes(ECH_SNI)) HOSTS.push(ECH_SNI);

	if (ECHenable && HOSTS.length > 0) {
		const hostsEntries = HOSTS.map(host => ` "${host}": ${ECH_DNS ? ECH_DNS : ''}`).join('\n');
		clash_yaml = insertNameserverPolicy(clash_yaml, hostsEntries);
	}

	if (!needprocessECH && !needprocessgRPC) return clash_yaml;

	const lines = clash_yaml.split('\n');
	const processedLines = [];
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];
		const trimmedLine = line.trim();

		if (trimmedLine.startsWith('- {')) {
			let fullNode = line;
			let braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
			while (braceCount > 0 && i + 1 < lines.length) {
				i++;
				fullNode += '\n' + lines[i];
				braceCount += (lines[i].match(/\{/g) || []).length - (lines[i].match(/\}/g) || []).length;
			}
			if (needprocessgRPC) fullNode = addFlowgRPCUserAgent(fullNode);
			if (needprocessECH && get(fullNode, true) === uuid.trim()) {
				fullNode = fullNode.replace(/\}(\s*)$/, `, ech-opts: {enable: true${ECH_SNI ? `, query-server-name: ${ECH_SNI}` : ''}}}$1`);
			}
			processedLines.push(fullNode);
			i++;
		} else if (trimmedLine.startsWith('- name:')) {
			let nodeLines = [line];
			let baseIndent = line.search(/\S/);
			let topLevelIndent = baseIndent + 2;
			i++;
			while (i < lines.length) {
				const nextLine = lines[i];
				const nextTrimmed = nextLine.trim();
				if (!nextTrimmed) {
					nodeLines.push(nextLine);
					i++;
					break;
				}
				const nextIndent = nextLine.search(/\S/);
				if (nextIndent <= baseIndent && nextTrimmed.startsWith('- ')) {
					break;
				}
				if (nextIndent < baseIndent && nextTrimmed) {
					break;
				}
				nodeLines.push(nextLine);
				i++;
			}
			let nodeText = nodeLines.join('\n');
			if (needprocessgRPC && matchgRPCnetwork(nodeText)) {
				nodeLines = addBlockgRPCUserAgent(nodeLines, topLevelIndent);
				nodeText = nodeLines.join('\n');
			}
			if (needprocessECH && get(nodeText, false) === uuid.trim()) nodeLines = addBlockECHOpts(nodeLines, topLevelIndent);
			processedLines.push(...nodeLines);
		} else {
			processedLines.push(line);
			i++;
		}
	}

	return processedLines.join('\n');
}

async function Singboxsubscribeconfig(SingBox_originalsubscription_content, config_JSON = {}) {
	const uuid = config_JSON?.UUID || null;
	const fingerprint = config_JSON?.Fingerprint || "chrome";
	const ECHenable = Boolean(config_JSON?.ECH);
	const ECH_SNI = config_JSON?.ECHConfig?.SNI || "cloudflare-ech.com";
	const sb_json_text = SingBox_originalsubscription_content.replace('1.1.1.1', '8.8.8.8').replace('1.0.0.1', '8.8.4.4');
	try {
		const config = JSON.parse(sb_json_text);
		const array = value => value === undefined || value === null ? [] : (Array.isArray(value) ? value : [value]);
		const Route = () => config.route = config.route && typeof config.route === 'object' ? config.route : {};
		const getDNS = rule => rule && typeof rule === 'object' && !Array.isArray(rule) && typeof rule.server === 'string' ? rule.server : null;
		const add = (type, code) => {
			if (!code || typeof code !== 'string') return null;
			const route = Route(), tag = `${type}-${code}`, ruleSet = Array.isArray(route.rule_set) ? route.rule_set : array(route.rule_set);
			if (!ruleSet.some(item => item?.tag === tag)) {
				const legacyOptions = type === 'geoip' ? route.geoip : route.geosite;
				ruleSet.push({ tag, type: 'remote', format: 'binary', url: `https://raw.githubusercontent.com/SagerNet/sing-${type}/rule-set/${tag}.srs`, ...(legacyOptions?.download_detour ? { download_detour: legacyOptions.download_detour } : {}) });
				config.experimental = config.experimental && typeof config.experimental === 'object' ? config.experimental : {};
				config.experimental.cache_file = config.experimental.cache_file && typeof config.experimental.cache_file === 'object' ? config.experimental.cache_file : {};
				config.experimental.cache_file.enabled ??= true;
			}
			route.rule_set = ruleSet;
			return tag;
		};

		const = rule => {
			if (!rule || typeof rule !== 'object' || Array.isArray(rule)) return rule;
			if (rule.type === 'logical' && Array.isArray(rule.rules)) {
				rule.rules = rule.rules.map();
				return rule;
			}
			const tags = [];
			for (const geoip of array(rule.geoip)) {
				if (typeof geoip !== 'string') continue;
				if (geoip.toLowerCase() === 'private') rule.ip_is_private = true;
				else tags.push(add('geoip', geoip));
			}
			for (const sourceGeoip of array(rule.source_geoip)) {
				if (typeof sourceGeoip !== 'string') continue;
				tags.push(add('geoip', sourceGeoip));
				rule.rule_set_ip_cidr_match_source = true;
			}
			for (const geosite of array(rule.geosite)) if (typeof geosite === 'string') tags.push(add('geosite', geosite));
			if (tags.length) rule.rule_set = [...new Set([...array(rule.rule_set), ...tags].filter(Boolean))];
			delete rule.geoip;
			delete rule.source_geoip;
			delete rule.geosite;
			return rule;
		};

		const DNS = (rule, rcodeServerMap) => {
			rule = (rule);
			if (!rule || typeof rule !== 'object' || Array.isArray(rule)) return rule;
			if (rule.type === 'logical' && Array.isArray(rule.rules)) {
				rule.rules = rule.rules.map(childRule => DNS(childRule, rcodeServerMap));
				return rule;
			}
			const serverTag = getDNS(rule);
			if (serverTag && rcodeServerMap.has(serverTag)) {
				for (const key of ['server', 'strategy', 'disable_cache', 'rewrite_ttl', 'client_subnet', 'timeout']) delete rule[key];
				rule.action = 'predefined';
				rule.rcode = rcodeServerMap.get(serverTag);
			} else if (serverTag && !rule.action) rule.action = 'route';
			return rule;
		};

		if (Array.isArray(config.inbounds)) {
			for (const inbound of config.inbounds) {
				if (!inbound || typeof inbound !== 'object' || inbound.type !== 'tun') continue;
				for (const migration of [
					{ targetKey: 'address', sourceKeys: ['inet4_address', 'inet6_address'] },
					{ targetKey: 'route_address', sourceKeys: ['inet4_route_address', 'inet6_route_address'] },
					{ targetKey: 'route_exclude_address', sourceKeys: ['inet4_route_exclude_address', 'inet6_route_exclude_address'] }
				]) {
					const values = array(inbound[migration.targetKey]);
					for (const sourceKey of migration.sourceKeys) values.push(...array(inbound[sourceKey]));
					if (values.length) inbound[migration.targetKey] = [...new Set(values)];
					for (const sourceKey of migration.sourceKeys) delete inbound[sourceKey];
				}
				if (inbound.tag) {
					const addedRules = [];
					if (inbound.domain_strategy) addedRules.push({ inbound: inbound.tag, action: 'resolve', strategy: inbound.domain_strategy });
					if (inbound.sniff) {
						const sniffRule = { inbound: inbound.tag, action: 'sniff' };
						if (inbound.sniff_timeout) sniffRule.timeout = inbound.sniff_timeout;
						addedRules.push(sniffRule);
					}
					if (addedRules.length) {
						const route = Route();
						route.rules = [...addedRules, ...array(route.rules)];
					}
				}
				delete inbound.sniff;
				delete inbound.sniff_timeout;
				delete inbound.domain_strategy;
			}
		}

		if (config?.route && typeof config.route === 'object' && Array.isArray(config.route.rules)) {
			const = rule => {
				rule = (rule);
				if (rule?.type === 'logical' && Array.isArray(rule.rules)) rule.rules = rule.rules.map();
				else if (rule && typeof rule === 'object' && !Array.isArray(rule) && rule.outbound && !rule.action) rule.action = 'route';
				return rule;
			};
			config.route.rules = config.route.rules.map();
		}

		const dns = config?.dns;
		if (dns && typeof dns === 'object') {
			const legacyFakeIP = dns.fakeip && typeof dns.fakeip === 'object' ? dns.fakeip : null;
			const rcodeServerMap = new Map();
			const DNSaddressprotocoltype = { 'tcp:': 'tcp', 'udp:': 'udp', 'tls:': 'tls', 'quic:': 'quic', 'https:': 'https', 'h3:': 'h3' };
			const RCodemap = { success: 'NOERROR', format_error: 'FORMERR', server_failure: 'SERVFAIL', name_error: 'NXDOMAIN', not_implemented: 'NOTIMP', refused: 'REFUSED' };
			let hasFakeIPServer = false;

			if (Array.isArray(dns.servers)) {
				const migratedServers = [];
				for (const originalServer of dns.servers) {
					if (!originalServer || typeof originalServer !== 'object' || Array.isArray(originalServer)) {
						migratedServers.push(originalServer);
						continue;
					}

					const server = { ...originalServer };
					let parsedAddress = null, parsedRCode = '', rawAddress = typeof server.address === 'string' ? server.address.trim() : '';
					if (rawAddress) {
						const lowerAddress = rawAddress.toLowerCase();
						if (lowerAddress === 'fakeip') parsedAddress = { type: 'fakeip' };
						else if (lowerAddress === 'local') parsedAddress = { type: 'local' };
						else if (lowerAddress.startsWith('rcode://')) {
							parsedAddress = { type: 'rcode' };
							parsedRCode = rawAddress.slice('rcode://'.length).toLowerCase();
						}
						else if (lowerAddress.startsWith('dhcp://')) {
							const dhcpInterface = rawAddress.slice('dhcp://'.length);
							parsedAddress = dhcpInterface && dhcpInterface.toLowerCase() !== 'auto' ? { type: 'dhcp', interface: dhcpInterface } : { type: 'dhcp' };
						} else {
							try {
								const addressURL = new URL(rawAddress);
								const type = DNSaddressprotocoltype[addressURL.protocol.toLowerCase()];
								if (type) {
									const parsedServer = addressURL.hostname?.startsWith('[') && addressURL.hostname.endsWith(']') ? addressURL.hostname.slice(1, -1) : addressURL.hostname;
									parsedAddress = {
										type,
										server: parsedServer || addressURL.host || rawAddress,
										...(addressURL.port ? { server_port: Number(addressURL.port) } : {}),
										...((type === 'https' || type === 'h3') && addressURL.pathname && addressURL.pathname !== '/dns-query' ? { path: addressURL.pathname } : {})
									};
								}
							} catch (_) { }
							if (!parsedAddress) parsedAddress = { type: 'udp', server: rawAddress };
						}
					}

					if (parsedAddress?.type === 'rcode') {
						const rcode = RCodemap[parsedRCode] || 'NOERROR';
						if (typeof server.tag === 'string' && server.tag) {
							rcodeServerMap.set(server.tag, rcode);
							rcodeServerMap.set(server.tag.startsWith('dns_') ? server.tag.slice(4) : `dns_${server.tag}`, rcode);
						}
						continue;
					}

					if (parsedAddress) {
						delete server.address;
						Object.assign(server, parsedAddress);
					}
					if (server.address_resolver !== undefined && server.domain_resolver === undefined) server.domain_resolver = server.address_resolver;
					if (server.address_strategy !== undefined && server.domain_strategy === undefined) server.domain_strategy = server.address_strategy;
					delete server.address_resolver;
					delete server.address_strategy;
					if (server.detour === 'DIRECT') delete server.detour;

					if (server.type === 'fakeip') {
						hasFakeIPServer = true;
						if (legacyFakeIP) {
							for (const key of ['inet4_range', 'inet6_range']) {
								if (legacyFakeIP[key] !== undefined && server[key] === undefined) server[key] = legacyFakeIP[key];
							}
						}
					}
					migratedServers.push(server);
				}
				dns.servers = migratedServers;
			}

			if (legacyFakeIP && !hasFakeIPServer && legacyFakeIP.enabled !== false) {
				const fakeIPServer = { type: 'fakeip', tag: 'fakeip' };
				for (const rule of Array.isArray(dns.rules) ? dns.rules : []) {
					const serverTag = getDNS(rule);
					if (serverTag && serverTag.toLowerCase().includes('fakeip')) {
						fakeIPServer.tag = serverTag;
						break;
					}
				}
				for (const key of ['inet4_range', 'inet6_range']) {
					if (legacyFakeIP[key] !== undefined) fakeIPServer[key] = legacyFakeIP[key];
				}
				if (Array.isArray(dns.servers)) dns.servers.push(fakeIPServer);
				else dns.servers = [fakeIPServer];
			}

			if (Array.isArray(dns.rules)) {
				const migratedRules = [];
				for (const rule of dns.rules) {
					const serverTag = getDNS(rule);
					const outbound = array(rule?.outbound);
					const DNS = new Set(['outbound', 'server', 'action', 'strategy', 'disable_cache', 'rewrite_ttl', 'client_subnet', 'timeout']);
					const isOutboundAnyDNSRule = rule && typeof rule === 'object' && !Array.isArray(rule) && rule.type !== 'logical'
						&& serverTag && outbound.includes('any') && Object.keys(rule).every(key => DNS.has(key));
					if (isOutboundAnyDNSRule) {
						const route = Route();
						if (route.default_domain_resolver === undefined) {
							const resolver = { server: serverTag };
							for (const key of ['strategy', 'disable_cache', 'rewrite_ttl', 'client_subnet', 'timeout']) {
								if (rule[key] !== undefined) resolver[key] = rule[key];
							}
							route.default_domain_resolver = Object.keys(resolver).length === 1 ? resolver.server : resolver;
						}
						continue;
					}
					migratedRules.push(DNS(rule, rcodeServerMap));
				}
				dns.rules = migratedRules;
			}

			delete dns.fakeip;
			delete dns.independent_cache;
		}

		if (config?.route && typeof config.route === 'object') {
			delete config.route.geoip;
			delete config.route.geosite;
		}
		if (config?.ntp?.detour === 'DIRECT') delete config.ntp.detour;

		if (Array.isArray(config.outbounds)) {
			const outboundTags = new Set(config.outbounds.map(outbound => outbound?.tag).filter(Boolean));
			const REJECT = value => value === 'REJECT' || (value && typeof value === 'object' && (Array.isArray(value) ? value.some(REJECT) : Object.values(value).some(REJECT)));
			if (!outboundTags.has('REJECT') && REJECT({ outbounds: config.outbounds, route: config.route })) config.outbounds.push({ type: 'block', tag: 'REJECT' });
		}

		if (uuid) {
			config.outbounds?.forEach(outbound => {
				if ((outbound.uuid && outbound.uuid === uuid) || (outbound.password && outbound.password === uuid)) {
					if (!outbound.tls) {
						outbound.tls = { enabled: true };
					}

					// add/update utls config
					if (fingerprint) {
						outbound.tls.utls = {
							enabled: true,
							fingerprint: fingerprint
						};
					}

					if (ECHenable) {
						outbound.tls.ech = {
							enabled: true,
							query_server_name: ECH_SNI,// 1.13.0+ 
							//config: `-----BEGIN ECH CONFIGS-----\n${ech_config}\n-----END ECH CONFIGS-----`
						};
					}
				}
			});
		}

		return JSON.stringify(config, null, 2);
	} catch (e) {
		console.error("Singboxlinefailure:", e);
		return JSON.stringify(JSON.parse(sb_json_text), null, 2);
	}
}

function Surgesubscribeconfig(content, url, config_JSON) {
	const linecontent = content.includes('\r\n') ? content.split('\r\n') : content.split('\n');
	const completenode_path = config_JSON.randompath ? randompath(config_JSON.completenode_path) : config_JSON.completenode_path;
	let content = "";
	for (let x of linecontent) {
		if (x.includes('= tro' + 'jan,') && !x.includes('ws=true') && !x.includes('ws-path=')) {
			const host = x.split("sni=")[1].split(",")[0];
			const content = `sni=${host}, skip-cert-verify=${config_JSON.skipvalidate}`;
			const content = `sni=${host}, skip-cert-verify=${config_JSON.skipvalidate}, ws=true, ws-path=${completenode_path.replace(/,/g, '%2C')}, ws-headers=Host:"${host}"`;
			content += x.replace(new RegExp(content, 'g'), content).replace("[", "").replace("]", "") + '\n';
		} else {
			content += x + '\n';
		}
	}

	content = `#!MANAGED-CONFIG ${url} interval=${config_JSON.preferredsubscribegenerate.SUBUpdateTime * 60 * 60} strict=false` + content.substring(content.indexOf('\n'));
	return content;
}

async function requestlogrecord(env, request, accessIP, requesttype = "Get_SUB", config_JSON, yesnowriteKVlog = true) {
	try {
		const currenttime = new Date();
		const logcontent = { TYPE: requesttype, IP: accessIP, ASN: `AS${request.cf.asn || '0'} ${request.cf.asOrganization || 'Unknown'}`, CC: `${request.cf.country || 'N/A'} ${request.cf.city || 'N/A'}`, URL: request.url, UA: request.headers.get('User-Agent') || 'Unknown', TIME: currenttime.getTime() };
		if (config_JSON.TG.enable) {
			try {
				const TG_TXT = await env.KV.get('tg.json');
				const TG_JSON = JSON.parse(TG_TXT);
				if (TG_JSON?.BotToken && TG_JSON?.ChatID) {
					const requesttime = new Date(logcontent.TIME).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
					const requestURL = new URL(logcontent.URL);
					const msg = `<b>#${config_JSON.preferredsubscribegenerate.SUBNAME} lognotification</b>\n\n` +
						`📌 <b>type：</b>#${logcontent.TYPE}\n` +
						`🌐 <b>IP：</b><code>${logcontent.IP}</code>\n` +
						`📍 <b>position：</b>${logcontent.CC}\n` +
						`🏢 <b>ASN：</b>${logcontent.ASN}\n` +
						`🔗 <b>domain：</b><code>${requestURL.host}</code>\n` +
						`🔍 <b>path：</b><code>${requestURL.pathname + requestURL.search}</code>\n` +
						`🤖 <b>UA：</b><code>${logcontent.UA}</code>\n` +
						`📅 <b>time：</b>${requesttime}\n` +
						`${config_JSON.CF.Usage.success ? `📊 <b>request：</b>${config_JSON.CF.Usage.total}/${config_JSON.CF.Usage.max} <b>${((config_JSON.CF.Usage.total / config_JSON.CF.Usage.max) * 100).toFixed(2)}%</b>\n` : ''}`;
					await fetch(`https://api.telegram.org/bot${TG_JSON.BotToken}/sendMessage?chat_id=${TG_JSON.ChatID}&parse_mode=HTML&text=${encodeURIComponent(msg)}`, {
						method: 'GET',
						headers: {
							'Accept': 'text/html,application/xhtml+xml,application/xml;',
							'Accept-Encoding': 'gzip, deflate, br',
							'User-Agent': logcontent.UA || 'Unknown',
						}
					});
				}
			} catch (error) { console.error(`readtg.jsonwrong: ${error.message}`) }
		}
		yesnowriteKVlog = ['1', 'true'].includes(env.OFF_LOG) ? false : yesnowriteKVlog;
		if (!yesnowriteKVlog) return;
		let logarray = [];
		const haslog = await env.KV.get('log.json'), KV = 4;//MB
		if (haslog) {
			try {
				logarray = JSON.parse(haslog);
				if (!Array.isArray(logarray)) { logarray = [logcontent] }
				else if (requesttype !== "Get_SUB") {
					const fronttime = currenttime.getTime() - 30 * 60 * 1000;
					if (logarray.some(log => log.TYPE !== "Get_SUB" && log.IP === accessIP && log.URL === request.url && log.UA === (request.headers.get('User-Agent') || 'Unknown') && log.TIME >= fronttime)) return;
					logarray.push(logcontent);
					while (JSON.stringify(logarray, null, 2).length > KV * 1024 * 1024 && logarray.length > 0) logarray.shift();
				} else {
					logarray.push(logcontent);
					while (JSON.stringify(logarray, null, 2).length > KV * 1024 * 1024 && logarray.length > 0) logarray.shift();
				}
			} catch (e) { logarray = [logcontent] }
		} else { logarray = [logcontent] }
		await env.KV.put('log.json', JSON.stringify(logarray, null, 2));
	} catch (error) { console.error(`logrecordfailure: ${error.message}`) }
}

function info(text, frontlong = 3, backlong = 2) {
	if (!text || typeof text !== 'string') return text;
	if (text.length <= frontlong + backlong) return text; // ，back

	const front = text.slice(0, frontlong);
	const back = text.slice(-backlong);
	const quantity = text.length - frontlong - backlong;

	return `${front}${'*'.repeat(quantity)}${back}`;
}

async function MD5MD5(text) {
	const encode = new TextEncoder();

	const pagehash = await crypto.subtle.digest('MD5', encode.encode(text));
	const pagehasharray = Array.from(new Uint8Array(pagehash));
	const page = pagehasharray.map(bytes => bytes.toString(16).padStart(2, '0')).join('');

	const pagehash = await crypto.subtle.digest('MD5', encode.encode(page.slice(7, 27)));
	const pagehasharray = Array.from(new Uint8Array(pagehash));
	const page = pagehasharray.map(bytes => bytes.toString(16).padStart(2, '0')).join('');

	return page.toLowerCase();
}

function randompath(completenode_path = "/") {
	const path = ["about", "account", "acg", "act", "activity", "ad", "ads", "ajax", "album", "albums", "anime", "api", "app", "apps", "archive", "archives", "article", "articles", "ask", "auth", "avatar", "bbs", "bd", "blog", "blogs", "book", "books", "bt", "buy", "cart", "category", "categories", "cb", "channel", "channels", "chat", "china", "city", "class", "classify", "clip", "clips", "club", "cn", "code", "collect", "collection", "comic", "comics", "community", "company", "config", "contact", "content", "course", "courses", "cp", "data", "detail", "details", "dh", "directory", "discount", "discuss", "dl", "dload", "doc", "docs", "document", "documents", "doujin", "download", "downloads", "drama", "edu", "en", "ep", "episode", "episodes", "event", "events", "f", "faq", "favorite", "favourites", "favs", "feedback", "file", "files", "film", "films", "forum", "forums", "friend", "friends", "game", "games", "gif", "go", "go.html", "go.php", "group", "groups", "help", "home", "hot", "htm", "html", "image", "images", "img", "index", "info", "intro", "item", "items", "ja", "jp", "jump", "jump.html", "jump.php", "jumping", "knowledge", "lang", "lesson", "lessons", "lib", "library", "link", "links", "list", "live", "lives", "m", "mag", "magnet", "mall", "manhua", "map", "member", "members", "message", "messages", "mobile", "movie", "movies", "music", "my", "new", "news", "note", "novel", "novels", "online", "order", "out", "out.html", "out.php", "outbound", "p", "page", "pages", "pay", "payment", "pdf", "photo", "photos", "pic", "pics", "picture", "pictures", "play", "player", "playlist", "post", "posts", "product", "products", "program", "programs", "project", "qa", "question", "rank", "ranking", "read", "readme", "redirect", "redirect.html", "redirect.php", "reg", "register", "res", "resource", "retrieve", "sale", "search", "season", "seasons", "section", "seller", "series", "service", "services", "setting", "settings", "share", "shop", "show", "shows", "site", "soft", "sort", "source", "special", "star", "stars", "static", "stock", "store", "stream", "streaming", "streams", "student", "study", "tag", "tags", "task", "teacher", "team", "tech", "temp", "test", "thread", "tool", "tools", "topic", "topics", "torrent", "trade", "travel", "tv", "txt", "type", "u", "upload", "uploads", "url", "urls", "user", "users", "v", "version", "videos", "view", "vip", "vod", "watch", "web", "wenku", "wiki", "work", "www", "zh", "zh-cn", "zh-tw", "zip"];
	const random = Math.floor(Math.random() * 3 + 1);
	const randompath = path.sort(() => 0.5 - Math.random()).slice(0, random).join('/');
	if (completenode_path === "/") return `/${randompath}`;
	else return `/${randompath + completenode_path.replace('/?', '?')}`;
}

function replacerandom(content) {
	if (typeof content !== 'string' || !content.includes('*')) return content;
	const = 'abcdefghijklmnopqrstuvwxyz0123456789';
	return content.replace(/\*/g, () => {
		let s = '';
		for (let i = 0; i < Math.floor(Math.random() * 14) + 3; i++) s += [Math.floor(Math.random() * .length)];
		return s;
	});
}

const DoHcache = {};
const DoHcachemaxitems = 256;
const DoHrecordtypemap = { A: 1, NS: 2, CNAME: 5, MX: 15, TXT: 16, AAAA: 28, SRV: 33, HTTPS: 65 };
async function DoHquery(domain, recordtype, DoHparse = "https://cloudflare-dns.com/dns-query") {
	const domain = String(domain || '').trim().toLowerCase().replace(/\.$/, '');
	const recordtype = String(recordtype || '').trim().toUpperCase();
	const cache = `${domain}:${recordtype}`;
	const qtype = DoHrecordtypemap[recordtype] || 1;
	const currenttime = Date.now();
	const cache = DoHcache[cache];
	if (cache && currenttime < cache.expiry_time) {
		log(`[DoHquery] cache ${domain} ${recordtype} via ${DoHparse}`);
		return cache.data.map(data => ({ type: qtype, data }));
	}
	const starttime = performance.now();
	log(`[DoHquery] startquery ${domain} ${recordtype} via ${DoHparse}`);
	try {
		const encodedomain = (name) => {
			const parts = name.endsWith('.') ? name.slice(0, -1).split('.') : name.split('.');
			const bufs = [];
			for (const label of parts) {
				const enc = new TextEncoder().encode(label);
				bufs.push(new Uint8Array([enc.length]), enc);
			}
			bufs.push(new Uint8Array([0]));
			const total = bufs.reduce((s, b) => s + b.length, 0);
			const result = new Uint8Array(total);
			let off = 0;
			for (const b of bufs) { result.set(b, off); off += b.length }
			return result;
		};

		const qname = encodedomain(domain);
		const query = new Uint8Array(12 + qname.length + 4);
		const qview = new DataView(query.buffer);
		qview.setUint16(0, crypto.getRandomValues(new Uint16Array(1))[0]); // ID (random per RFC 1035)
		qview.setUint16(2, 0x0100); // Flags: RD=1 ()
		qview.setUint16(4, 1); // QDCOUNT
		query.set(qname, 12);
		qview.setUint16(12 + qname.length, qtype);
		qview.setUint16(12 + qname.length + 2, 1); // QCLASS = IN

		log(`[DoHquery] sendquery ${domain} via ${DoHparse} (type=${qtype}, ${query.length}bytes)`);
		const response = await fetch(DoHparse, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/dns-message',
				'Accept': 'application/dns-message',
			},
			body: query,
		});
		if (!response.ok) {
			console.warn(`[DoHquery] requestfailure ${domain} ${recordtype} via ${DoHparse} response:${response.status}`);
			return [];
		}

		const buf = new Uint8Array(await response.arrayBuffer());
		const dv = new DataView(buf.buffer);
		const qdcount = dv.getUint16(4);
		const ancount = dv.getUint16(6);
		log(`[DoHquery] response ${domain} ${recordtype} via ${DoHparse} (${buf.length}bytes, ${ancount}items)`);

		const parsedomain = (pos) => {
			const labels = [];
			let p = pos, jumped = false, endPos = -1, safe = 128;
			while (p < buf.length && safe-- > 0) {
				const len = buf[p];
				if (len === 0) { if (!jumped) endPos = p + 1; break }
				if ((len & 0xC0) === 0xC0) {
					if (!jumped) endPos = p + 2;
					p = ((len & 0x3F) << 8) | buf[p + 1];
					jumped = true;
					continue;
				}
				labels.push(new TextDecoder().decode(buf.slice(p + 1, p + 1 + len)));
				p += len + 1;
			}
			if (endPos === -1) endPos = p + 1;
			return [labels.join('.'), endPos];
		};

		// skip Question Section
		let offset = 12;
		for (let i = 0; i < qdcount; i++) {
			const [, end] = parsedomain(offset);
			offset = /** @type {number} */ (end) + 4; // +4 skip QTYPE + QCLASS
		}

		const answers = [];
		for (let i = 0; i < ancount && offset < buf.length; i++) {
			const [name, nameEnd] = parsedomain(offset);
			offset = /** @type {number} */ (nameEnd);
			const type = dv.getUint16(offset); offset += 2;
			offset += 2; // CLASS
			const ttl = dv.getUint32(offset); offset += 4;
			const rdlen = dv.getUint16(offset); offset += 2;
			const rdata = buf.slice(offset, offset + rdlen);
			offset += rdlen;

			let data;
			if (type === 1 && rdlen === 4) {
				// A record
				data = `${rdata[0]}.${rdata[1]}.${rdata[2]}.${rdata[3]}`;
			} else if (type === 28 && rdlen === 16) {
				// AAAA record
				const segs = [];
				for (let j = 0; j < 16; j += 2) segs.push(((rdata[j] << 8) | rdata[j + 1]).toString(16));
				data = segs.join(':');
			} else if (type === 16) {
				let tOff = 0;
				const parts = [];
				while (tOff < rdlen) {
					const tLen = rdata[tOff++];
					parts.push(new TextDecoder().decode(rdata.slice(tOff, tOff + tLen)));
					tOff += tLen;
				}
				data = parts.join('');
			} else if (type === 5) {
				// CNAME record
				const [cname] = parsedomain(offset - rdlen);
				data = cname;
			} else {
				data = Array.from(rdata).map(b => b.toString(16).padStart(2, '0')).join('');
			}
			answers.push({ name, type, TTL: ttl, data, rdata });
		}
		const = (performance.now() - starttime).toFixed(2);
		log(`[DoHquery] querydone ${domain} ${recordtype} via ${DoHparse} ${}ms total${answers.length}itemsresult${answers.length > 0 ? '\n' + answers.map((a, i) => ` ${i + 1}. ${a.name} type=${a.type} TTL=${a.TTL} data=${a.data}`).join('\n') : ''}`);
		const offrecord = answers.filter(answer => answer.type === qtype);
		const smallTTL = offrecord.length > 0 ? Math.min(...offrecord.map(a => a.TTL)) : 0;
		const cacheTTL = Math.max(smallTTL, 5 * 60);
		const cacheexpiry_time = Date.now() + cacheTTL * 1000;
		const cachedata = offrecord.map(answer => answer.data);
		if (cachedata.length > 0 || answers.length === 0) {
			if (Object.keys(DoHcache).length >= DoHcachemaxitems) {
				const cleanuptime = Date.now();
				for (const [cacheitems, cacheitems] of Object.entries(DoHcache)) {
					if (cleanuptime >= cacheitems.expiry_time) delete DoHcache[cacheitems];
				}
				if (Object.keys(DoHcache).length >= DoHcachemaxitems) {
					delete DoHcache[Object.keys(DoHcache)[0]];
				}
			}
			DoHcache[cache] = { data: cachedata, expiry_time: cacheexpiry_time };
			log(`[DoHquery] writecache ${domain} ${recordtype} TTL=${cacheTTL}s${cachedata.length === 0 ? '（emptyresult）' : ''}`);
		}
		return answers;
	} catch (error) {
		const = (performance.now() - starttime).toFixed(2);
		console.error(`[DoHquery] queryfailure ${domain} ${recordtype} via ${DoHparse} ${}ms:`, error);
		return [];
	}
}


// ═══════════════════════════════════════════════════════════════════════════
// Sub-User Management System
// ═══════════════════════════════════════════════════════════════════════════

async function getUsers(env) {
	try {
		const data = await env.KV.get('users.json', 'json');
		return Array.isArray(data) ? data : [];
	} catch { return []; }
}

async function saveUsers(env, users) {
	await env.KV.put('users.json', JSON.stringify(users));
}

function generateSubToken(userID, index) {
	const encoder = new TextEncoder();
	return crypto.subtle.importKey('raw', encoder.encode(userID + index), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']).then(key =>
		 crypto.subtle.sign('HMAC', key, encoder.encode('sub-' + Date.now())).then(sig =>
			 Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32)
		 )
	);
}

async function checkUserLimits(env, userToken, trafficBytes) {
	const users = await getUsers(env);
	const user = users.find(u => u.token === userToken);
	if (!user) return { allowed: false, reason: 'user_not_found' };
	if (!user.enabled) return { allowed: false, reason: 'user_disabled' };
	if (user.expires_at && new Date(user.expires_at) < new Date()) return { allowed: false, reason: 'user_expired' };
	if (user.quota_bytes && (user.used_bytes + trafficBytes) > user.quota_bytes) return { allowed: false, reason: 'traffic_limit_exceeded' };
	return { allowed: true, user };
}

async function updateTrafficUsed(env, userToken, bytesUsed) {
	const users = await getUsers(env);
	const idx = users.findIndex(u => u.token === userToken);
	if (idx === -1) return;
	users[idx].used_bytes = (users[idx].used_bytes || 0) + bytesUsed;
	users[idx].last_activity = new Date().toISOString();
	await saveUsers(env, users);
}

async function manageUsersAPI(env, request, url) {
	const method = request.method;
	const pathParts = url.pathname.split('/').filter(Boolean);
	const userIdx = pathParts.length >= 3 ? pathParts[2] : null;

	if (method === 'GET' && !userIdx) {
		const users = await getUsers(env);
		return new Response(JSON.stringify({ data: users }), {
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	if (method === 'POST' && !userIdx) {
		const body = await request.json().catch(() => ({}));
		if (!body.name) return new Response(JSON.stringify({ error: 'name_required' }), { status: 400 });
		const users = await getUsers(env);
		const token = await generateSubToken(body.name, users.length);
		const newUser = {
			id: crypto.randomUUID(),
			name: body.name,
			token: token,
			enabled: true,
			expires_at: body.expires_at || null,
			quota_bytes: body.quota_bytes || null,
			used_bytes: 0,
			ip_limit: body.ip_limit || null,
			created_at: new Date().toISOString(),
			last_activity: null,
		};
		users.push(newUser);
		await saveUsers(env, users);
		return new Response(JSON.stringify({ data: newUser }), {
			status: 201,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	if (userIdx && (method === 'PUT' || method === 'PATCH')) {
		const users = await getUsers(env);
		const idx = users.findIndex(u => u.id === userIdx);
		if (idx === -1) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404 });
		const body = await request.json().catch(() => ({}));
		if (body.name !== undefined) users[idx].name = body.name;
		if (body.enabled !== undefined) users[idx].enabled = body.enabled;
		if (body.expires_at !== undefined) users[idx].expires_at = body.expires_at;
		if (body.quota_bytes !== undefined) users[idx].quota_bytes = body.quota_bytes;
		if (body.ip_limit !== undefined) users[idx].ip_limit = body.ip_limit;
		await saveUsers(env, users);
		return new Response(JSON.stringify({ data: users[idx] }), {
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	if (userIdx && method === 'DELETE') {
		const users = await getUsers(env);
		const filtered = users.filter(u => u.id !== userIdx);
		if (filtered.length === users.length) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404 });
		await saveUsers(env, filtered);
		return new Response(JSON.stringify({ success: true }), {
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
		});
	}

	return new Response(JSON.stringify({ error: 'invalid_request' }), { status: 400 });
}

async function readconfig_JSON(env, hostname, userID, UA = "Mozilla/5.0", resetconfig = false) {
	const _p = dictionary[0];
	const host = hostname, Ali_DoH = "https://dns.alidns.com/dns-query", ECH_SNI = "cloudflare-ech.com", = '{{IP:PORT}}', start = performance.now(), defaultconfigJSON = {
		TIME: new Date().toISOString(),
		HOST: host,
		HOSTS: [hostname],
		UUID: userID,
		PATH: "/",
		protocoltype: "v" + "le" + "ss",
		transportprotocol: "ws",
		gRPC: "gun",
		gRPCUserAgent: UA,
		skipvalidate: false,
		enable0RTT: false,
		TLS: null,
		randompath: false,
		ECH: false,
		ECHConfig: {
			DNS: Ali_DoH,
			SNI: ECH_SNI,
		},
		SS: {
			encrypted: "aes-128-gcm",
			TLS: true,
		},
		Fingerprint: "chrome",
		preferredsubscribegenerate: {
			local: true, // true: localaddress false: 
			localIP: {
				randomIP: true, // IP true，enableIPquantity，noKVADD.txt
				randomquantity: 16,
				port: -1,
			},
			SUB: null,
			SUBNAME: "edge" + "tunnel",
			SUBUpdateTime: 3, // update（）
			TOKEN: await MD5MD5(hostname + userID),
		},
		subscription_convertconfig: {
			SUBAPI: `https://SUBAPI.${[1]}ssss.net`,
			SUBCONFIG: `https://raw.githubusercontent.com/${[1]}/ACL4SSR/refs/heads/main/Clash/config/ACL4SSR_Online_Mini_MultiMode_CF.ini`,
			SUBEMOJI: false,
			SUBLIST: false, //info
			UDP: false, // enable UDP
			XUDP: false, // enable XUDP
			TLS13: false, // enable TLS 1.3
			APPEND_TYPE: false, // type
			SORT: false, // sort
		},
		proxy: {
			[_p]: "auto",
			SOCKS5: {
				enable: null,
				global: false,
				account: '',
				whitelist: SOCKS5whitelist,
			},
			pathtemplate: {
				[_p]: "proxyip=" + placeholder,
				SOCKS5: {
					global: "socks5://" + ,
					standard: "socks5=" + placeholder
				},
				HTTP: {
					global: "http://" + ,
					standard: "http=" + placeholder
				},
				HTTPS: {
					global: "https://" + ,
					standard: "https=" + placeholder
				},
				TURN: {
					global: "turn://" + ,
					standard: "turn=" + placeholder
				},
				SSTP: {
					global: "sstp://" + ,
					standard: "sstp=" + placeholder
				},
			},
		},
		TG: {
			enable: false,
			BotToken: null,
			ChatID: null,
		},
		CF: {
			Email: null,
			GlobalAPIKey: null,
			AccountID: null,
			APIToken: null,
			UsageAPI: null,
			Usage: {
				success: false,
				pages: 0,
				workers: 0,
				total: 0,
				max: 100000,
			},
		}
	};

	try {
		let configJSON = await env.KV.get('config.json');
		if (!configJSON || resetconfig == true) {
			await env.KV.put('config.json', JSON.stringify(defaultconfigJSON, null, 2));
			config_JSON = defaultconfigJSON;
		} else {
			config_JSON = JSON.parse(configJSON);
		}
	} catch (error) {
		console.error(`readconfig_JSONwrong: ${error.message}`);
		config_JSON = defaultconfigJSON;
	}

	if (!config_JSON.subscription_convertconfig.SUBLIST) config_JSON.subscription_convertconfig.SUBLIST = false;
	if (!config_JSON.subscription_convertconfig.UDP) config_JSON.subscription_convertconfig.UDP = false;
	if (!config_JSON.subscription_convertconfig.XUDP) config_JSON.subscription_convertconfig.XUDP = false;
	if (!config_JSON.subscription_convertconfig.TLS13) config_JSON.subscription_convertconfig.TLS13 = false;
	if (!config_JSON.subscription_convertconfig.APPEND_TYPE) config_JSON.subscription_convertconfig.APPEND_TYPE = false;
	if (!config_JSON.subscription_convertconfig.SORT) config_JSON.subscription_convertconfig.SORT = false;
	if (!config_JSON.gRPCUserAgent) config_JSON.gRPCUserAgent = UA;
	config_JSON.HOST = host;
	if (!config_JSON.HOSTS) config_JSON.HOSTS = [hostname];
	if (env.HOST) config_JSON.HOSTS = (await array(env.HOST)).map(h => h.toLowerCase().replace(/^https?:\/\//, '').split('/')[0].split(':')[0]);
	config_JSON.UUID = userID;
	if (!config_JSON.randompath) config_JSON.randompath = false;
	if (!config_JSON.enable0RTT) config_JSON.enable0RTT = false;

	if (env.PATH) config_JSON.PATH = env.PATH.startsWith('/') ? env.PATH : '/' + env.PATH;
	else if (!config_JSON.PATH) config_JSON.PATH = '/';

	if (!config_JSON.gRPC) config_JSON.gRPC = 'gun';
	if (!config_JSON.SS) config_JSON.SS = { encrypted: "aes-128-gcm", TLS: false };

	if (!config_JSON.proxy.pathtemplate?.[_p]) {
		config_JSON.proxy.pathtemplate = {
			[_p]: "proxyip=" + placeholder,
			SOCKS5: {
				global: "socks5://" + ,
				standard: "socks5=" + placeholder
			},
			HTTP: {
				global: "http://" + ,
				standard: "http=" + placeholder
			},
			HTTPS: {
				global: "https://" + ,
				standard: "https=" + placeholder
			},
			TURN: {
				global: "turn://" + ,
				standard: "turn=" + placeholder
			},
			SSTP: {
				global: "sstp://" + ,
				standard: "sstp=" + placeholder
			},
		};
	}
	if (!config_JSON.proxy.pathtemplate.HTTPS) config_JSON.proxy.pathtemplate.HTTPS = { global: "https://" + , : "https=" + };
	if (!config_JSON.proxy.pathtemplate.TURN) config_JSON.proxy.pathtemplate.TURN = { global: "turn://" + , : "turn=" + };
	if (!config_JSON.proxy.pathtemplate.SSTP) config_JSON.proxy.pathtemplate.SSTP = { global: "sstp://" + , : "sstp=" + };

	const proxyconfig = config_JSON.proxy.pathtemplate[config_JSON.proxy.SOCKS5.enable?.toUpperCase()];

	let pathproxyparam = '';
	if (proxyconfig && config_JSON.proxy.SOCKS5.account) pathproxyparam = (config_JSON.proxy.SOCKS5.global ? proxyconfig.global : proxyconfig.standard).replace(placeholder, config_JSON.proxy.SOCKS5.account);
	else if (config_JSON.proxy[_p] !== 'auto') pathproxyparam = config_JSON.proxy.pathtemplate[_p].replace(placeholder, config_JSON.proxy[_p]);

	let proxyqueryparam = '';
	if (pathproxyparam.includes('?')) {
		const [proxypathpartial, proxyquerypartial] = pathproxyparam.split('?');
		pathproxyparam = proxypathpartial;
		proxyqueryparam = proxyquerypartial;
	}

	config_JSON.PATH = config_JSON.PATH.replace(pathproxyparam, '').replace('//', '/');
	const normalizedPath = config_JSON.PATH === '/' ? '' : config_JSON.PATH.replace(/\/+(?=\?|$)/, '').replace(/\/+$/, '');
	const [pathpartial, ...queryarray] = normalizedPath.split('?');
	const querypartial = queryarray.length ? '?' + queryarray.join('?') : '';
	const querypartial = proxyqueryparam ? (querypartial ? querypartial + '&' + proxyqueryparam : '?' + proxyqueryparam) : querypartial;
	config_JSON.completenode_path = (pathpartial || '/') + (pathpartial && pathproxyparam ? '/' : '') + pathproxyparam + querypartial + (config_JSON.enable0RTT ? (querypartial ? '&' : '?') + 'ed=2560' : '');

	if (!config_JSON.TLS && config_JSON.TLS !== null) config_JSON.TLS = null;
	const TLSparam = config_JSON.TLS == 'Shadowrocket' ? `&fragment=${encodeURIComponent('1,40-60,30-50,tlshello')}` : config_JSON.TLS == 'Happ' ? `&fragment=${encodeURIComponent('3,1,tlshello')}` : '';
	if (!config_JSON.Fingerprint) config_JSON.Fingerprint = "chrome";
	if (!config_JSON.ECH) config_JSON.ECH = false;
	if (!config_JSON.ECHConfig) config_JSON.ECHConfig = { DNS: Ali_DoH, SNI: ECH_SNI };
	const ECHLINKparam = config_JSON.ECH ? `&ech=${encodeURIComponent((config_JSON.ECHConfig.SNI ? config_JSON.ECHConfig.SNI + '+' : '') + config_JSON.ECHConfig.DNS)}` : '';
	const { type: transportprotocol, path, domain } = gettransportprotocolconfig(config_JSON);
	const transportpathparam = gettransportpathparam(config_JSON, config_JSON.completenode_path);
	config_JSON.LINK = config_JSON.protocoltype === 'ss'
		? `${config_JSON.protocoltype}://${btoa(config_JSON.SS. + ':' + userID)}@${host}:${config_JSON.SS.TLS ? '443' : '80'}?plugin=v2${encodeURIComponent(`ray-plugin;mode=websocket;host=${host};path=${((config_JSON.node_path.includes('?') ? config_JSON.node_path.replace('?', '?enc=' + config_JSON.SS. + '&') : (config_JSON.node_path + '?enc=' + config_JSON.SS.)) + (config_JSON.SS.TLS ? ';tls' : ''))};mux=0`) + ECHLINK}#${encodeURIComponent(config_JSON..SUBNAME)}`
		: `${config_JSON.protocoltype}://${userID}@${host}:443?security=tls&type=${protocol + ECHLINK}&${domain}=${host}&fp=${config_JSON.Fingerprint}&sni=${host}&${path}=${encodeURIComponent(path) + TLS}&encryption=none#${encodeURIComponent(config_JSON..SUBNAME)}`;
	config_JSON.preferredsubscribegenerate.TOKEN = await MD5MD5(hostname + userID);

	const initTG_JSON = { BotToken: null, ChatID: null };
	config_JSON.TG = { enable: config_JSON.TG.enable ? config_JSON.TG.enable : false, ...initTG_JSON };
	try {
		const TG_TXT = await env.KV.get('tg.json');
		if (!TG_TXT) {
			await env.KV.put('tg.json', JSON.stringify(initTG_JSON, null, 2));
		} else {
			const TG_JSON = JSON.parse(TG_TXT);
			config_JSON.TG.ChatID = TG_JSON.ChatID ? TG_JSON.ChatID : null;
			config_JSON.TG.BotToken = TG_JSON.BotToken ? info(TG_JSON.BotToken) : null;
		}
	} catch (error) {
		console.error(`readtg.jsonwrong: ${error.message}`);
	}

	const initCF_JSON = { Email: null, GlobalAPIKey: null, AccountID: null, APIToken: null, UsageAPI: null };
	config_JSON.CF = { ...initCF_JSON, Usage: { success: false, pages: 0, workers: 0, total: 0, max: 100000 } };
	try {
		const CF_TXT = await env.KV.get('cf.json');
		if (!CF_TXT) {
			await env.KV.put('cf.json', JSON.stringify(initCF_JSON, null, 2));
		} else {
			const CF_JSON = JSON.parse(CF_TXT);
			if (CF_JSON.UsageAPI) {
				try {
					const response = await fetch(CF_JSON.UsageAPI);
					const Usage = await response.json();
					config_JSON.CF.Usage = Usage;
				} catch (err) {
					console.error(`request CF_JSON.UsageAPI failure: ${err.message}`);
				}
			} else {
				config_JSON.CF.Email = CF_JSON.Email ? CF_JSON.Email : null;
				config_JSON.CF.GlobalAPIKey = CF_JSON.GlobalAPIKey ? info(CF_JSON.GlobalAPIKey) : null;
				config_JSON.CF.AccountID = CF_JSON.AccountID ? info(CF_JSON.AccountID) : null;
				config_JSON.CF.APIToken = CF_JSON.APIToken ? info(CF_JSON.APIToken) : null;
				config_JSON.CF.UsageAPI = null;
				const Usage = await getCloudflareUsage(CF_JSON.Email, CF_JSON.GlobalAPIKey, CF_JSON.AccountID, CF_JSON.APIToken);
				config_JSON.CF.Usage = Usage;
			}
		}
	} catch (error) {
		console.error(`readcf.jsonwrong: ${error.message}`);
	}

	config_JSON.loadingtime = (performance.now() - initstarttime).toFixed(2) + 'ms';
	return config_JSON;
}

function (request) {
	const cf = request?.cf;
	const ASNmap = {
		'4134': 'ct',
		'4809': 'ct',
		'4811': 'ct',
		'4812': 'ct',
		'4815': 'ct',
		'4837': 'cu',
		'4814': 'cu',
		'9929': 'cu',
		'17623': 'cu',
		'17816': 'cu',
		'9808': 'cmcc',
		'24400': 'cmcc',
		'56040': 'cmcc',
		'56041': 'cmcc',
		'56044': 'cmcc',
	};
	const offmap = [
		{ code: 'ct', pattern: /chinanet|chinatelecom|china telecom|cn2|shtel/ },
		{ code: 'cmcc', pattern: /cmi|cmnet|chinamobile|china mobile|cmcc|mobile communications/ },
		{ code: 'cu', pattern: /china169|china unicom|chinaunicom|cucc|cncgroup|cuii|netcom/ },
	];
	if (String(cf?.country || '').toLowerCase() !== 'cn') return 'cf';
	const name = String(cf?.asOrganization || '').toLowerCase();
	const = offmap.find(({ pattern }) => pattern.test(name))?.code;
	return || ASNmap[String(cf?.asn || '')] || 'cf';
}

async function generaterandomIP(request, count = 16, port = -1) {
	const url = new URL(request.url);
	const queryparam = String(url.searchParams.get('cnIspCode') || '').toLowerCase();
	const = ['ct', 'cu', 'cmcc', 'cf'].includes(queryparam) ? queryparam : (request);
	const namemap = {
		cmcc: 'CFpreferred',
		cu: 'CFpreferred',
		ct: 'CFpreferred',
		cf: 'CFpreferred',
	};
	const cidr_url = === 'cf' ? `https://raw.githubusercontent.com/${[1]}/${[1]}/main/CF-CIDR.txt` : `https://raw.githubusercontent.com/${[1]}/${[1]}/main/CF-CIDR/${}.txt`;
	const cfname = namemap[] || 'CFpreferred';
	const cfport = [443, 2053, 2083, 2087, 2096, 8443];
	let cidrList = [];
	try { const res = await fetch(cidr_url); cidrList = res.ok ? await array(await res.text()) : ['104.16.0.0/13'] } catch { cidrList = ['104.16.0.0/13'] }

	const generateRandomIPFromCIDR = (cidr) => {
		const [baseIP, prefixLength] = cidr.split('/'), prefix = parseInt(prefixLength), hostBits = 32 - prefix;
		const ipInt = baseIP.split('.').reduce((a, p, i) => a | (parseInt(p) << (24 - i * 8)), 0);
		const randomOffset = Math.floor(Math.random() * Math.pow(2, hostBits));
		const mask = (0xFFFFFFFF << hostBits) >>> 0, randomIP = (((ipInt & mask) >>> 0) + randomOffset) >>> 0;
		return [(randomIP >>> 24) & 0xFF, (randomIP >>> 16) & 0xFF, (randomIP >>> 8) & 0xFF, randomIP & 0xFF].join('.');
	};
	const randomIPs = Array.from({ length: count }, (_, index) => {
		const ip = generateRandomIPFromCIDR(cidrList[Math.floor(Math.random() * cidrList.length)]);
		const targetport = port === -1
			? cfport[Math.floor(Math.random() * cfport.length)]
			: port;
		return `${ip}:${targetport}#${cfname}${index + 1}`;
	});
	return [randomIPs, randomIPs.join('\n')];
}

async function array(content) {
	var replacebackcontent = content.replace(/[	"'\r\n]+/g, ',').replace(/,+/g, ',');
	if (replacebackcontent.charAt(0) == ',') replacebackcontent = replacebackcontent.slice(1);
	if (replacebackcontent.charAt(replacebackcontent.length - 1) == ',') replacebackcontent = replacebackcontent.slice(0, replacebackcontent.length - 1);
	const addressarray = replacebackcontent.split(',');
	return addressarray;
}

async function getpreferredsubscribegeneratordata(preferredsubscribegeneratorHOST) {
	let preferredIP = [], other_nodesLINK = '', formatHOST = preferredsubscribegeneratorHOST.replace(/^sub:\/\//i, 'https://').split('#')[0].split('?')[0];
	if (!/^https?:\/\//i.test(HOST)) HOST = `https://${HOST}`;

	try {
		const url = new URL(formatHOST);
		formatHOST = url.origin;
	} catch (error) {
		preferredIP.push(`127.0.0.1:1234#${preferredsubscribegeneratorHOST}preferredsubscribegeneratorformat:${error.message}`);
		return [preferredIP, other_nodesLINK];
	}

	const preferredsubscribegeneratorURL = `${formatHOST}/sub?host=example.com&uuid=00000000-0000-4000-8000-000000000000`;

	try {
		const response = await fetch(preferredsubscribegeneratorURL, {
			headers: { 'User-Agent': 'v2rayN/edge' + 'tunnel (https://github.com/' + [1] + '/edge' + 'tunnel)' }
		});

		if (!response.ok) {
			preferredIP.push(`127.0.0.1:1234#${preferredsubscribegeneratorHOST}preferredsubscribegenerator:${response.statusText}`);
			return [preferredIP, other_nodesLINK];
		}

		const preferredsubscribegeneratorbacksubscription_content = atob(await response.text());
		const subscribelinelist = preferredsubscribegeneratorbacksubscription_content.includes('\r\n')
			? preferredsubscribegeneratorbacksubscription_content.split('\r\n')
			: preferredsubscribegeneratorbacksubscription_content.split('\n');

		for (const linecontent of subscribelinelist) {
			if (!linecontent.trim()) continue; // skip
			if (linecontent.includes('00000000-0000-4000-8000-000000000000') && linecontent.includes('example.com')) {
				const addressmatch = linecontent.match(/:\/\/[^@]+@([^?]+)/);
				if (addressmatch) {
					let addressport = addressmatch[1], remark = ''; // domain:port IP:port
					const remarkmatch = linecontent.match(/#(.+)$/);
					if (remarkmatch) remark = '#' + decodeURIComponent(remarkmatch[1]);
					preferredIP.push(addressport + remark);
				}
			} else {
				other_nodesLINK += linecontent + '\n';
			}
		}
	} catch (error) {
		preferredIP.push(`127.0.0.1:1234#${preferredsubscribegeneratorHOST}preferredsubscribegenerator:${error.message}`);
	}

	return [preferredIP, other_nodesLINK];
}

async function requestpreferredAPI(urls, defaultport = '443', timeouttime = 3000) {
	if (!urls?.length) return [[], [], [], []];
	const results = new Set(), proxyIP = new Set();
	let subscriberesponseLINKcontent = '', needsubscription_convertsubscribeURLs = [];
	await Promise.allSettled(urls.map(async (url) => {
		const hashIndex = url.indexOf('#');
		const urlWithoutHash = hashIndex > -1 ? url.substring(0, hashIndex) : url;
		const APIremark = hashIndex > -1 ? decodeURIComponent(url.substring(hashIndex + 1)) : null;
		const preferredIPasproxyIP = url.toLowerCase().includes('proxyip=true');
		if (urlWithoutHash.toLowerCase().startsWith('sub://')) {
			try {
				const [preferredIP, other_nodesLINK] = await getpreferredsubscribegeneratordata(urlWithoutHash);
				if (APIremark) {
					for (const ip of preferredIP) {
						const processbackIP = ip.includes('#')
							? `${ip} [${APIremark}]`
							: `${ip}#[${APIremark}]`;
						results.add(processbackIP);
						if (preferredIPasproxyIP) proxyIP.add(ip.split('#')[0]);
					}
				} else {
					for (const ip of preferredIP) {
						results.add(ip);
						if (preferredIPasproxyIP) proxyIP.add(ip.split('#')[0]);
					}
				}
				if (other_nodesLINK && typeof other_nodesLINK === 'string' && APIremark) {
					const processbackLINKcontent = other_nodesLINK.replace(/([a-z][a-z0-9+\-.]*:\/\/[^\r\n]*?)(\r?\n|$)/gi, (match, link, lineEnd) => {
						const complete = link.includes('#')
							? `${link}${encodeURIComponent(` [${APIremark}]`)}`
							: `${link}${encodeURIComponent(`#[${APIremark}]`)}`;
						return `${complete}${lineEnd}`;
					});
					subscriberesponseLINKcontent += processbackLINKcontent;
				} else if (other_nodesLINK && typeof other_nodesLINK === 'string') {
					subscriberesponseLINKcontent += other_nodesLINK;
				}
			} catch (e) { }
			return;
		}

		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), timeouttime);
			const response = await fetch(urlWithoutHash, { signal: controller.signal });
			clearTimeout(timeoutId);
			let text = '';
			try {
				const buffer = await response.arrayBuffer();
				const contentType = (response.headers.get('content-type') || '').toLowerCase();
				const charset = contentType.match(/charset=([^\s;]+)/i)?.[1]?.toLowerCase() || '';

				let decoders = ['utf-8', 'gb2312']; // default UTF-8
				if (charset.includes('gb') || charset.includes('gbk') || charset.includes('gb2312')) {
					decoders = ['gb2312', 'utf-8']; // GB ， GB2312
				}

				let decodeSuccess = false;
				for (const decoder of decoders) {
					try {
						const decoded = new TextDecoder(decoder).decode(buffer);
						if (decoded && decoded.length > 0 && !decoded.includes('\ufffd')) {
							text = decoded;
							decodeSuccess = true;
							break;
						} else if (decoded && decoded.length > 0) {
							continue;
						}
					} catch (e) {
						continue;
					}
				}

				if (!decodeSuccess) {
					text = await response.text();
				}

				if (!text || text.trim().length === 0) {
					return;
				}
			} catch (e) {
				console.error('Failed to decode response:', e);
				return;
			}

			/*
			if (text.includes('proxies:') || (text.includes('outbounds"') && text.includes('inbounds"'))) {// Clash Singbox config
				needsubscription_convertsubscribeURLs.add(url);
				return;
			}
			*/

			let processsubscribecontent = text;
			const cleanText = typeof text === 'string' ? text.replace(/\s/g, '') : '';
			if (cleanText.length > 0 && cleanText.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(cleanText)) {
				try {
					const bytes = new Uint8Array(atob(cleanText).split('').map(c => c.charCodeAt(0)));
					processsubscribecontent = new TextDecoder('utf-8').decode(bytes);
				} catch { }
			}
			if (processsubscribecontent.split('#')[0].includes('://')) {
				if (APIremark) {
					const processbackLINKcontent = processsubscribecontent.replace(/([a-z][a-z0-9+\-.]*:\/\/[^\r\n]*?)(\r?\n|$)/gi, (match, link, lineEnd) => {
						const complete = link.includes('#')
							? `${link}${encodeURIComponent(` [${APIremark}]`)}`
							: `${link}${encodeURIComponent(`#[${APIremark}]`)}`;
						return `${complete}${lineEnd}`;
					});
					subscriberesponseLINKcontent += processbackLINKcontent + '\n';
				} else {
					subscriberesponseLINKcontent += processsubscribecontent + '\n';
				}
				return;
			}

			const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l);
			const isCSV = lines.length > 1 && lines[0].includes(',');
			const IPV6_PATTERN = /^[^\[\]]*:[^\[\]]*:[^\[\]]/;
			const parsedUrl = new URL(urlWithoutHash);
			if (!isCSV) {
				lines.forEach(line => {
					const lineHashIndex = line.indexOf('#');
					const [hostPart, remark] = lineHashIndex > -1 ? [line.substring(0, lineHashIndex), line.substring(lineHashIndex)] : [line, ''];
					let hasPort = false;
					if (hostPart.startsWith('[')) {
						hasPort = /\]:(\d+)$/.test(hostPart);
					} else {
						const colonIndex = hostPart.lastIndexOf(':');
						hasPort = colonIndex > -1 && /^\d+$/.test(hostPart.substring(colonIndex + 1));
					}
					const port = parsedUrl.searchParams.get('port') || defaultport;
					const ipItem = hasPort ? line : `${hostPart}:${port}${remark}`;
					if (APIremark) {
						const processbackIP = ipItem.includes('#')
							? `${ipItem} [${APIremark}]`
							: `${ipItem}#[${APIremark}]`;
						results.add(processbackIP);
					} else {
						results.add(ipItem);
					}
					if (preferredIPasproxyIP) proxyIP.add(ipItem.split('#')[0]);
				});
			} else {
				const headers = lines[0].split(',').map(h => h.trim());
				const dataLines = lines.slice(1);
				if (headers.includes('IPaddress') && headers.includes('port') && headers.includes('data')) {
					const ipIdx = headers.indexOf('IPaddress'), portIdx = headers.indexOf('port');
					const remarkIdx = headers.indexOf('country') > -1 ? headers.indexOf('country') :
						headers.indexOf('city') > -1 ? headers.indexOf('city') : headers.indexOf('data');
					const tlsIdx = headers.indexOf('TLS');
					dataLines.forEach(line => {
						const cols = line.split(',').map(c => c.trim());
						if (tlsIdx !== -1 && cols[tlsIdx]?.toLowerCase() !== 'true') return;
						const wrappedIP = IPV6_PATTERN.test(cols[ipIdx]) ? `[${cols[ipIdx]}]` : cols[ipIdx];
						const ipItem = `${wrappedIP}:${cols[portIdx]}#${cols[remarkIdx]}`;
						if (APIremark) {
							const processbackIP = `${ipItem} [${APIremark}]`;
							results.add(processbackIP);
						} else {
							results.add(ipItem);
						}
						if (preferredIPasproxyIP) proxyIP.add(`${wrappedIP}:${cols[portIdx]}`);
					});
				} else if (headers.some(h => h.includes('IP')) && headers.some(h => h.includes('')) && headers.some(h => h.includes('download'))) {
					const ipIdx = headers.findIndex(h => h.includes('IP'));
					const delayIdx = headers.findIndex(h => h.includes(''));
					const speedIdx = headers.findIndex(h => h.includes('download'));
					const port = parsedUrl.searchParams.get('port') || defaultport;
					dataLines.forEach(line => {
						const cols = line.split(',').map(c => c.trim());
						const wrappedIP = IPV6_PATTERN.test(cols[ipIdx]) ? `[${cols[ipIdx]}]` : cols[ipIdx];
						const ipItem = `${wrappedIP}:${port}#CFpreferred ${cols[delayIdx]}ms ${cols[speedIdx]}MB/s`;
						if (APIremark) {
							const processbackIP = `${ipItem} [${APIremark}]`;
							results.add(processbackIP);
						} else {
							results.add(ipItem);
						}
						if (preferredIPasproxyIP) proxyIP.add(`${wrappedIP}:${port}`);
					});
				}
			}
		} catch (e) { }
	}));
	const LINKarray = subscriberesponseLINKcontent.trim() ? [...new Set(subscriberesponseLINKcontent.split(/\r?\n/).filter(line => line.trim() !== ''))] : [];
	return [Array.from(results), LINKarray, needsubscription_convertsubscribeURLs, Array.from(proxyIP)];
}

async function proxyparamget(url, uuid, defaultproxyIP = '', defaultproxy_fallback = true) {
	const { searchParams } = url;
	const pathname = decodeURIComponent(url.pathname);
	const pathLower = pathname.toLowerCase();
	let proxyIP = defaultproxyIP, enableSOCKS5proxy = null, enableSOCKS5globalproxy = false, SOCKS5account = '', parsedSocks5Address = {}, enableproxy_fallback = defaultproxy_fallback;
	const proxy_context = { trojanproxyaddress: null, proxyIP, proxytype: null, proxyaccount: '', proxyglobal: false, proxyparam: {}, proxy_fallback: enableproxy_fallback };
	const savefast = () => {
		proxy_context.proxyIP = proxyIP;
		proxy_context.proxytype = enableSOCKS5proxy;
		proxy_context.proxyaccount = SOCKS5account;
		proxy_context.proxyglobal = enableSOCKS5globalproxy;
		proxy_context.proxyparam = { ...parsedSocks5Address };
		proxy_context.proxy_fallback = enableproxy_fallback;
	};

	const chainproxypathmatch = pathname.match(/\/video\/(.+)$/i);
	if (chainproxypathmatch) {
		try {
			const chainproxy = base64SecretDecode(chainproxypathmatch[1].replace(/\/+$/, ''), uuid);
			const { type, ...chainproxyaddress } = JSON.parse(chainproxy);
			if (!type || !proxyprotocoldefaultport[String(type).toLowerCase()]) throw new Error('chainproxytypeinvalid');
			if (!chainproxyaddress.hostname || !chainproxyaddress.port) throw new Error('chainproxyaddressfew hostname port');
			SOCKS5account = '';
			proxyIP = 'chainproxy';
			enableproxy_fallback = false;
			enableSOCKS5globalproxy = true;
			enableSOCKS5proxy = String(type).toLowerCase();
			parsedSocks5Address = {
				username: chainproxyaddress.username,
				password: chainproxyaddress.password,
				hostname: chainproxyaddress.hostname,
				port: Number(chainproxyaddress.port)
			};
			if (isNaN(parsedSocks5Address.port)) throw new Error('chainproxyportinvalid');
			savefast();
			return proxy_context;
		} catch (err) {
			console.error('parsechainproxyparamfailure:', err.message);
		}
	}

	SOCKS5account = searchParams.get('socks5') || searchParams.get('http') || searchParams.get('https') || searchParams.get('turn') || searchParams.get('sstp') || null;
	enableSOCKS5globalproxy = searchParams.has('globalproxy');
	if (searchParams.get('socks5')) enableSOCKS5proxy = 'socks5';
	else if (searchParams.get('http')) enableSOCKS5proxy = 'http';
	else if (searchParams.get('https')) enableSOCKS5proxy = 'https';
	else if (searchParams.get('turn')) enableSOCKS5proxy = 'turn';
	else if (searchParams.get('sstp')) enableSOCKS5proxy = 'sstp';

	const parseproxyURL = (, global = true) => {
		const match = /^(socks5|http|https|turn|sstp):\/\/(.+)$/i.exec( || '');
		if (!match) return false;
		enableSOCKS5proxy = match[1].toLowerCase();
		SOCKS5account = match[2].split('/')[0];
		if (global) enableSOCKS5globalproxy = true;
		return true;
	};

	const settingsproxyIP = () => {
		proxyIP = ;
		enableSOCKS5proxy = null;
		enableproxy_fallback = false;
	};

	const path = () => {
		if (!.includes('://')) {
			const = .indexOf('/');
			return > 0 ? .slice(0, ) : ;
		}
		const protocol = .split('://');
		if (protocol.length !== 2) return ;
		const = protocol[1].indexOf('/');
		return > 0 ? `${protocol[0]}://${protocol[1].slice(0, )}` : ;
	};

	const trojanpathmatch = /\/trojan=([^?#\s]+)/i.exec(pathname);
	if (trojanpathmatch) {
		try {
			proxy_context.trojanproxyaddress = parsetrojanproxyaddress(trojanpathmatch[1].replace(/\/+$/, ''));
		} catch (err) {
			console.error('parsetrojanproxyaddressfailure:', err.message);
			proxy_context.trojanproxyaddress = null;
		}
	}

	const queryproxyIP = searchParams.get('proxyip');
	if (queryproxyIP !== null) {
		if (!parseproxyURL(queryproxyIP)) {
			settingsproxyIP(queryproxyIP);
			savefast();
			return proxy_context;
		}
	} else {
		let match = /\/(socks5?|http|https|turn|sstp):\/?\/?([^/?#\s]+)/i.exec(pathname);
		if (match) {
			const type = match[1].toLowerCase();
			enableSOCKS5proxy = type === 'sock' || type === 'socks' ? 'socks5' : type;
			SOCKS5account = match[2].split('/')[0];
			enableSOCKS5globalproxy = true;
		} else if ((match = /\/(g?s5|socks5|g?http|g?https|g?turn|g?sstp)=([^/?#\s]+)/i.exec(pathname))) {
			const type = match[1].toLowerCase();
			SOCKS5account = match[2].split('/')[0];
			enableSOCKS5proxy = type.includes('sstp') ? 'sstp' : (type.includes('turn') ? 'turn' : (type.includes('https') ? 'https' : (type.includes('http') ? 'http' : 'socks5')));
			if (type.startsWith('g')) enableSOCKS5globalproxy = true;
		} else if ((match = /\/(proxyip[.=]|pyip=|ip=)([^?#\s]+)/.exec(pathLower))) {
			const pathproxy = path(match[2]);
			if (!parseproxyURL(pathproxy)) {
				settingsproxyIP(pathproxy);
				savefast();
				return proxy_context;
			}
		}
	}

	if (!SOCKS5account) {
		enableSOCKS5proxy = null;
		savefast();
		return proxy_context;
	}

	try {
		parsedSocks5Address = await getSOCKS5account(SOCKS5account, getproxydefaultport(enableSOCKS5proxy));
		if (searchParams.get('socks5')) enableSOCKS5proxy = 'socks5';
		else if (searchParams.get('http')) enableSOCKS5proxy = 'http';
		else if (searchParams.get('https')) enableSOCKS5proxy = 'https';
		else if (searchParams.get('turn')) enableSOCKS5proxy = 'turn';
		else if (searchParams.get('sstp')) enableSOCKS5proxy = 'sstp';
		else enableSOCKS5proxy = enableSOCKS5proxy || 'socks5';
	} catch (err) {
		console.error('parseSOCKS5addressfailure:', err.message);
		enableSOCKS5proxy = null;
	}
	savefast();
	return proxy_context;
}

const proxyprotocoldefaultport = { socks5: 1080, http: 80, https: 443, turn: 3478, sstp: 443 };
function getproxydefaultport(type) {
	return proxyprotocoldefaultport[String(type || '').toLowerCase()] || 80;
}

const SOCKS5accountBase64 = /^(?:[A-Z0-9+/]{4})*(?:[A-Z0-9+/]{2}==|[A-Z0-9+/]{3}=)?$/i, IPv6 = /^\[.*\]$/;
function getSOCKS5account(address, defaultport = 80) {
	address = String(address || '').trim().replace(/^(socks5|http|https|turn|sstp):\/\//i, '').split('#')[0].trim();
	const firstAt = address.lastIndexOf("@");
	if (firstAt !== -1) {
		let auth = address.slice(0, firstAt).replaceAll("%3D", "=");
		if (!auth.includes(":") && SOCKS5accountBase64.test(auth)) auth = atob(auth);
		address = `${auth}@${address.slice(firstAt + 1)}`;
	}

	const atIndex = address.lastIndexOf("@");
	const hostPart = (atIndex === -1 ? address : address.slice(atIndex + 1)).split('/')[0];
	const authPart = atIndex === -1 ? "" : address.slice(0, atIndex);
	const [username, password] = authPart ? authPart.split(":") : [];
	if (authPart && !password) throw new Error('invalid SOCKS address：partialyes "username:password" ');

	let hostname = hostPart, port = defaultport;
	if (hostPart.includes("]:")) {
		const [ipv6Host, ipv6Port = ""] = hostPart.split("]:");
		hostname = ipv6Host + "]";
		port = Number(ipv6Port.replace(/[^\d]/g, ""));
	} else if (!hostPart.startsWith("[")) {
		const parts = hostPart.split(":");
		if (parts.length === 2) {
			hostname = parts[0];
			port = Number(parts[1].replace(/[^\d]/g, ""));
		}
	}

	if (isNaN(port)) throw new Error('invalid SOCKS address：portyes');
	if (hostname.includes(":") && !IPv6.test(hostname)) throw new Error('invalid SOCKS address：IPv6 address， [2001:db8::1]');
	return { username, password, hostname, port };
}

async function getCloudflareUsage(Email, GlobalAPIKey, AccountID, APIToken) {
	const API = "https://api.cloudflare.com/client/v4";
	const sum = (a) => a?.reduce((t, i) => t + (i?.sum?.requests || 0), 0) || 0;
	const cfg = { "Content-Type": "application/json" };

	try {
		if (!AccountID && (!Email || !GlobalAPIKey)) return { success: false, pages: 0, workers: 0, total: 0, max: 100000 };

		if (!AccountID) {
			const r = await fetch(`${API}/accounts`, {
				method: "GET",
				headers: { ...cfg, "X-AUTH-EMAIL": Email, "X-AUTH-KEY": GlobalAPIKey }
			});
			if (!r.ok) throw new Error(`getfailure: ${r.status}`);
			const d = await r.json();
			if (!d?.result?.length) throw new Error("");
			const idx = d.result.findIndex(a => a.name?.toLowerCase().startsWith(Email.toLowerCase()));
			AccountID = d.result[idx >= 0 ? idx : 0]?.id;
		}

		const now = new Date();
		now.setUTCHours(0, 0, 0, 0);
		const hdr = APIToken ? { ...cfg, "Authorization": `Bearer ${APIToken}` } : { ...cfg, "X-AUTH-EMAIL": Email, "X-AUTH-KEY": GlobalAPIKey };

		const res = await fetch(`${API}/graphql`, {
			method: "POST",
			headers: hdr,
			body: JSON.stringify({
				query: `query getBillingMetrics($AccountID: String!, $filter: AccountWorkersInvocationsAdaptiveFilter_InputObject) {
					viewer { accounts(filter: {accountTag: $AccountID}) {
						pagesFunctionsInvocationsAdaptiveGroups(limit: 1000, filter: $filter) { sum { requests } }
						workersInvocationsAdaptive(limit: 10000, filter: $filter) { sum { requests } }
					} }
				}`,
				variables: { AccountID, filter: { datetime_geq: now.toISOString(), datetime_leq: new Date().toISOString() } }
			})
		});

		if (!res.ok) throw new Error(`queryfailure: ${res.status}`);
		const result = await res.json();
		if (result.errors?.length) throw new Error(result.errors[0].message);

		const acc = result?.data?.viewer?.accounts?.[0];
		if (!acc) throw new Error("data");

		const pages = sum(acc.pagesFunctionsInvocationsAdaptiveGroups);
		const workers = sum(acc.workersInvocationsAdaptive);
		const total = pages + workers;
		const max = 100000;
		log(`statisticsresult - Pages: ${pages}, Workers: ${workers}, : ${total}, up: 100000`);
		return { success: true, pages, workers, total, max };

	} catch (error) {
		console.error('getuseerror:', error.message);
		return { success: false, pages: 0, workers: 0, total: 0, max: 100000 };
	}
}

function sha224(s) {
	const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
	const r = (n, b) => ((n >>> b) | (n << (32 - b))) >>> 0;
	s = unescape(encodeURIComponent(s));
	const l = s.length * 8; s += String.fromCharCode(0x80);
	while ((s.length * 8) % 512 !== 448) s += String.fromCharCode(0);
	const h = [0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939, 0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4];
	const hi = Math.floor(l / 0x100000000), lo = l & 0xFFFFFFFF;
	s += String.fromCharCode((hi >>> 24) & 0xFF, (hi >>> 16) & 0xFF, (hi >>> 8) & 0xFF, hi & 0xFF, (lo >>> 24) & 0xFF, (lo >>> 16) & 0xFF, (lo >>> 8) & 0xFF, lo & 0xFF);
	const w = []; for (let i = 0; i < s.length; i += 4)w.push((s.charCodeAt(i) << 24) | (s.charCodeAt(i + 1) << 16) | (s.charCodeAt(i + 2) << 8) | s.charCodeAt(i + 3));
	for (let i = 0; i < w.length; i += 16) {
		const x = new Array(64).fill(0);
		for (let j = 0; j < 16; j++)x[j] = w[i + j];
		for (let j = 16; j < 64; j++) {
			const s0 = r(x[j - 15], 7) ^ r(x[j - 15], 18) ^ (x[j - 15] >>> 3);
			const s1 = r(x[j - 2], 17) ^ r(x[j - 2], 19) ^ (x[j - 2] >>> 10);
			x[j] = (x[j - 16] + s0 + x[j - 7] + s1) >>> 0;
		}
		let [a, b, c, d, e, f, g, h0] = h;
		for (let j = 0; j < 64; j++) {
			const S1 = r(e, 6) ^ r(e, 11) ^ r(e, 25), ch = (e & f) ^ (~e & g), t1 = (h0 + S1 + ch + K[j] + x[j]) >>> 0;
			const S0 = r(a, 2) ^ r(a, 13) ^ r(a, 22), maj = (a & b) ^ (a & c) ^ (b & c), t2 = (S0 + maj) >>> 0;
			h0 = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
		}
		for (let j = 0; j < 8; j++)h[j] = (h[j] + (j === 0 ? a : j === 1 ? b : j === 2 ? c : j === 3 ? d : j === 4 ? e : j === 5 ? f : j === 6 ? g : h0)) >>> 0;
	}
	let hex = '';
	for (let i = 0; i < 7; i++) {
		for (let j = 24; j >= 0; j -= 8)hex += ((h[i] >>> j) & 0xFF).toString(16).padStart(2, '0');
	}
	return hex;
}

async function parseaddressport(proxyIP, targetdomain = 'dash.cloudflare.com', UUID = '00000000-0000-4000-8000-000000000000') {
	proxyIP = proxyIP.toLowerCase();
	function parseaddressportstring(str) {
		let address = str, port = 443;
		if (str.includes(']:')) {
			const parts = str.split(']:');
			address = parts[0] + ']';
			port = parseInt(parts[1], 10) || port;
		} else if ((str.match(/:/g) || []).length === 1 && !str.startsWith('[')) {
			const colonIndex = str.lastIndexOf(':');
			address = str.slice(0, colonIndex);
			port = parseInt(str.slice(colonIndex + 1), 10) || port;
		}
		return [address, port];
	}

	function parseTXTproxyrecord(txtData) {
		return txtData.flatMap(data => {
			if (data.startsWith('"') && data.endsWith('"')) data = data.slice(1, -1);
			return data.replace(/\\010/g, ',').replace(/\n/g, ',').split(',').map(s => s.trim()).filter(Boolean);
		}).map(prefix => parseaddressportstring(prefix));
	}

	const proxyIParray = await array(proxyIP);
	let all_proxy_array = [];
	const ipv4Regex = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
	const ipv6Regex = /^\[?(?:[a-fA-F0-9]{0,4}:){1,7}[a-fA-F0-9]{0,4}\]?$/;

	for (const singleProxyIP of proxyIParray) {
		let [address, port] = parseaddressportstring(singleProxyIP);

		if (singleProxyIP.includes('.tp')) {
			const tpMatch = singleProxyIP.match(/\.tp(\d+)/);
			if (tpMatch) port = parseInt(tpMatch[1], 10);
		}

		if (ipv4Regex.test(address) || ipv6Regex.test(address)) {
			log(`[proxyparse] ${address} IPaddress，use`);
			all_proxy_array.push([address, port]);
			continue;
		}

		const [txtRecords, aRecords] = await Promise.all([
			DoHquery(address, 'TXT'),
			DoHquery(address, 'A')
		]);

		const txtData = txtRecords.filter(r => r.type === 16).map(r => (r.data));
		const txtAddresses = parseTXTproxyrecord(txtData);
		if (txtAddresses.length > 0) {
			log(`[proxyparse] ${address} useTXTrecord，total${txtAddresses.length}result`);
			all_proxy_array.push(...txtAddresses);
			continue;
		}

		const ipv4List = aRecords.filter(r => r.type === 1).map(r => r.data);
		if (ipv4List.length > 0) {
			log(`[proxyparse] ${address} getTXTrecord，useArecord，total${ipv4List.length}result`);
			all_proxy_array.push(...ipv4List.map(ip => [ip, port]));
			continue;
		}

		const aaaaRecords = await DoHquery(address, 'AAAA');
		const ipv6List = aaaaRecords.filter(r => r.type === 28).map(r => `[${r.data}]`);
		if (ipv6List.length > 0) {
			log(`[proxyparse] ${address} getTXTArecord，useAAAArecord，total${ipv6List.length}result`);
			all_proxy_array.push(...ipv6List.map(ip => [ip, port]));
		} else {
			log(`[proxyparse] ${address} getTXT、AAAAArecord，domain`);
			all_proxy_array.push([address, port]);
		}
	}
	const sortbackarray = all_proxy_array.sort((a, b) => a[0].localeCompare(b[0]));
	const targetrootdomain = targetdomain.includes('.') ? targetdomain.split('.').slice(-2).join('.') : targetdomain;
	let randomchild = [...(targetrootdomain + UUID)].reduce((a, c) => a + c.charCodeAt(0), 0);
	log(`[proxyparse] randomchild: ${randomchild}\ntarget: ${targetrootdomain}`)
	const back = [...sortbackarray].sort(() => (randomchild = (randomchild * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff - 0.5);
	const parse_result = back.slice(0, 8);
	log(`[proxyparse] parsedone : ${parse_result.length}\n${parse_result.map(([ip, port], index) => `${index + 1}. ${ip}:${port}`).join('\n')}`);
	return parse_result;
}

async function nginx() {
	return `
	<!DOCTYPE html>
	<html>
	<head>
	<title>Welcome to nginx!</title>
	<style>
		body {
			width: 35em;
			margin: 0 auto;
			font-family: Tahoma, Verdana, Arial, sans-serif;
		}
	</style>
	</head>
	<body>
	<h1>Welcome to nginx!</h1>
	<p>If you see this page, the nginx web server is successfully installed and
	working. Further configuration is required.</p>

	<p>For online documentation and support please refer to
	<a href="http://nginx.org/">nginx.org</a>.<br/>
	Commercial support is available at
	<a href="http://nginx.com/">nginx.com</a>.</p>

	<p><em>Thank you for using nginx.</em></p>
	</body>
	</html>
	`
}

async function html1101(host, accessIP) {
	const now = new Date();
	const formattime = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
	const randomstring = Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b => b.toString(16).padStart(2, '0')).join('');

	return `<!DOCTYPE html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en-US"> <![endif]-->
<!--[if IE 7]> <html class="no-js ie7 oldie" lang="en-US"> <![endif]-->
<!--[if IE 8]> <html class="no-js ie8 oldie" lang="en-US"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en-US"> <!--<![endif]-->
<head>
<title>Worker threw exception | ${host} | Cloudflare</title>
<meta charset="UTF-8" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
<meta name="robots" content="noindex, nofollow" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<link rel="stylesheet" id="cf_styles-css" href="/cdn-cgi/styles/cf.errors.css" />
<!--[if lt IE 9]><link rel="stylesheet" id='cf_styles-ie-css' href="/cdn-cgi/styles/cf.errors.ie.css" /><![endif]-->
<style>body{margin:0;padding:0}</style>


<!--[if gte IE 10]><!-->
<script>
 if (!navigator.cookieEnabled) {
 window.addEventListener('DOMContentLoaded', function () {
 var cookieEl = document.getElementById('cookie-alert');
 cookieEl.style.display = 'block';
 })
 }
</script>
<!--<![endif]-->

</head>
<body>
 <div id="cf-wrapper">
 <div class="cf-alert cf-alert-error cf-cookie-error" id="cookie-alert" data-translate="enable_cookies">Please enable cookies.</div>
 <div id="cf-error-details" class="cf-error-details-wrapper">
 <div class="cf-wrapper cf-header cf-error-overview">
 <h1>
 <span class="cf-error-type" data-translate="error">Error</span>
 <span class="cf-error-code">1101</span>
 <small class="heading-ray-id">Ray ID: ${randomstring} &bull; ${formattime} UTC</small>
 </h1>
 <h2 class="cf-subheadline" data-translate="error_desc">Worker threw exception</h2>
 </div><!-- /.header -->

 <section></section><!-- spacer -->

 <div class="cf-section cf-wrapper">
 <div class="cf-columns two">
 <div class="cf-column">
 <h2 data-translate="what_happened">What happened?</h2>
 <p>You've requested a page on a website (${host}) that is on the <a href="https://www.cloudflare.com/5xx-error-landing?utm_source=error_100x" target="_blank">Cloudflare</a> network. An unknown error occurred while rendering the page.</p>
 </div>

 <div class="cf-column">
 <h2 data-translate="what_can_i_do">What can I do?</h2>
 <p><strong>If you are the owner of this website:</strong><br />refer to <a href="https://developers.cloudflare.com/workers/observability/errors/" target="_blank">Workers - Errors and Exceptions</a> and check Workers Logs for ${host}.</p>
 </div>

 </div>
 </div><!-- /.section -->

 <div class="cf-error-footer cf-wrapper w-240 lg:w-full py-10 sm:py-4 sm:px-8 mx-auto text-center sm:text-left border-solid border-0 border-t border-gray-300">
 <p class="text-13">
 <span class="cf-footer-item sm:block sm:mb-1">Cloudflare Ray ID: <strong class="font-semibold"> ${randomstring}</strong></span>
 <span class="cf-footer-separator sm:hidden">&bull;</span>
 <span id="cf-footer-item-ip" class="cf-footer-item hidden sm:block sm:mb-1">
 Your IP:
 <button type="button" id="cf-footer-ip-reveal" class="cf-footer-ip-reveal-btn">Click to reveal</button>
 <span class="hidden" id="cf-footer-ip">${accessIP}</span>
 <span class="cf-footer-separator sm:hidden">&bull;</span>
 </span>
 <span class="cf-footer-item sm:block sm:mb-1"><span>Performance &amp; security by</span> <a rel="noopener noreferrer" href="https://www.cloudflare.com/5xx-error-landing" id="brand_link" target="_blank">Cloudflare</a></span>

 </p>
 <script>(function(){function d(){var b=a.getElementById("cf-footer-item-ip"),c=a.getElementById("cf-footer-ip-reveal");b&&"classList"in b&&(b.classList.remove("hidden"),c.addEventListener("click",function(){c.classList.add("hidden");a.getElementById("cf-footer-ip").classList.remove("hidden")}))}var a=document;document.addEventListener&&a.addEventListener("DOMContentLoaded",d)})();</script>
 </div><!-- /.error-footer -->

 </div><!-- /#cf-error-details -->
 </div><!-- /#cf-wrapper -->

 <script>
 window._cf_translation = {};


 </script>
</body>
</html>`;
}
