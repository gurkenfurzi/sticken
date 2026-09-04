const encoder = new TextEncoder();
const decoder = new TextDecoder();

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin, env) });
    }

    try {
      let response;
      if (url.pathname === '/api/health' && request.method === 'GET') {
        response = json({ ok: true, service: 'auftragshelfer-cloudflare' });
      } else if (url.pathname === '/api/auth/register' && request.method === 'POST') {
        response = await register(request, env);
      } else if (url.pathname === '/api/auth/login' && request.method === 'POST') {
        response = await login(request, env);
      } else if (url.pathname === '/api/auth/recover' && request.method === 'POST') {
        response = await recoverPassword(request, env);
      } else if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
        response = await logout(request, env);
      } else if (url.pathname === '/api/me' && request.method === 'GET') {
        const user = await requireUser(request, env);
        response = json({ user });
      } else if (url.pathname === '/api/state' && request.method === 'GET') {
        response = await getState(request, env);
      } else if (url.pathname === '/api/state/meta' && request.method === 'GET') {
        response = await getStateMeta(request, env);
      } else if (url.pathname === '/api/state' && request.method === 'PUT') {
        response = await putState(request, env);
      } else if (url.pathname === '/api/upload' && request.method === 'POST') {
        response = await uploadFile(request, env);
      } else if (url.pathname.startsWith('/api/file/') && request.method === 'GET') {
        response = await getFile(request, env, url);
      } else {
        response = json({ error: 'Nicht gefunden' }, 404);
      }
      return withCors(response, origin, env);
    } catch (err) {
      console.error(err);
      const status = Number(err?.status || 500);
      const message = status >= 500 ? 'Serverfehler' : (err?.message || 'Fehler');
      return withCors(json({ error: message }, status), origin, env);
    }
  }
};

function corsHeaders(origin, env) {
  const configured = String(env.ALLOWED_ORIGIN || '*').split(',').map(x => x.trim()).filter(Boolean);
  let allow = '*';
  if (!configured.includes('*')) {
    allow = configured.includes(origin) ? origin : configured[0] || '';
  }
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}
function withCors(response, origin, env) {
  const headers = new Headers(response.headers);
  for (const [k,v] of Object.entries(corsHeaders(origin, env))) headers.set(k,v);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
function json(data, status=200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store' } });
}
function fail(message, status=400) {
  const err = new Error(message); err.status = status; throw err;
}
async function readJson(request) {
  const len = Number(request.headers.get('content-length') || 0);
  if (len > 1_900_000) fail('Anfrage ist zu groß', 413);
  try { return await request.json(); } catch { fail('Ungültige Daten', 400); }
}
function normalizeUsername(username) { return String(username || '').trim(); }
function validUsername(username) { return /^[A-Za-z0-9._-]{3,32}$/.test(username); }
function normalizeRecoveryCode(code) { return String(code || '').trim().toUpperCase(); }

async function register(request, env) {
  const body = await readJson(request);
  const username = normalizeUsername(body.username);
  const password = String(body.password || '');
  if (!validUsername(username)) fail('Benutzername: 3–32 Zeichen, nur Buchstaben, Zahlen, Punkt, _ oder -');
  if (password.length < 8) fail('Passwort muss mindestens 8 Zeichen haben');

  const exists = await env.DB.prepare('SELECT id FROM users WHERE username = ? COLLATE NOCASE').bind(username).first();
  if (exists) fail('Dieser Benutzername ist bereits vergeben', 409);

  const id = crypto.randomUUID();
  const salt = randomBase64(16);
  const hash = await hashPassword(password, salt);
  const recoveryCode = randomRecoveryCode();
  const recoveryHash = await sha256Base64(normalizeRecoveryCode(recoveryCode));
  const now = Date.now();
  await env.DB.prepare('INSERT INTO users (id,username,password_hash,password_salt,recovery_hash,created_at) VALUES (?,?,?,?,?,?)')
    .bind(id, username, hash, salt, recoveryHash, now).run();

  const token = await createSession(id, env);
  return json({ token, user:{ id, username }, recoveryCode }, 201);
}

async function login(request, env) {
  const body = await readJson(request);
  const username = normalizeUsername(body.username);
  const password = String(body.password || '');
  const row = await env.DB.prepare('SELECT id,username,password_hash,password_salt FROM users WHERE username = ? COLLATE NOCASE').bind(username).first();
  if (!row) fail('Benutzername oder Passwort ist falsch', 401);
  const hash = await hashPassword(password, row.password_salt);
  if (!constantTimeEqual(hash, row.password_hash)) fail('Benutzername oder Passwort ist falsch', 401);
  const token = await createSession(row.id, env);
  return json({ token, user:{ id:row.id, username:row.username } });
}

async function recoverPassword(request, env) {
  const body = await readJson(request);
  const username = normalizeUsername(body.username);
  const recoveryCode = normalizeRecoveryCode(body.recoveryCode);
  const newPassword = String(body.newPassword || '');
  if (!validUsername(username)) fail('Benutzername ist ungültig');
  if (!recoveryCode) fail('Wiederherstellungscode fehlt');
  if (newPassword.length < 8) fail('Neues Passwort muss mindestens 8 Zeichen haben');

  const row = await env.DB.prepare('SELECT id,recovery_hash FROM users WHERE username = ? COLLATE NOCASE').bind(username).first();
  if (!row) fail('Benutzername oder Wiederherstellungscode ist falsch', 401);
  const candidateHash = await sha256Base64(recoveryCode);
  if (!constantTimeEqual(candidateHash, row.recovery_hash || '')) fail('Benutzername oder Wiederherstellungscode ist falsch', 401);

  const newSalt = randomBase64(16);
  const newHash = await hashPassword(newPassword, newSalt);
  const nextRecoveryCode = randomRecoveryCode();
  const nextRecoveryHash = await sha256Base64(normalizeRecoveryCode(nextRecoveryCode));
  await env.DB.prepare('UPDATE users SET password_hash=?, password_salt=?, recovery_hash=? WHERE id=?')
    .bind(newHash, newSalt, nextRecoveryHash, row.id).run();
  await env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(row.id).run();
  return json({ ok:true, recoveryCode:nextRecoveryCode });
}

async function logout(request, env) {
  const token = bearerToken(request);
  if (token) {
    const tokenHash = await sha256Base64(token);
    await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(tokenHash).run();
  }
  return json({ ok:true });
}

async function createSession(userId, env) {
  const token = randomBase64Url(32);
  const tokenHash = await sha256Base64(token);
  const now = Date.now();
  const expires = now + 1000 * 60 * 60 * 24 * 30;
  await env.DB.prepare('INSERT INTO sessions (token_hash,user_id,expires_at,created_at) VALUES (?,?,?,?)')
    .bind(tokenHash, userId, expires, now).run();
  return token;
}

function bearerToken(request) {
  const h = request.headers.get('Authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : '';
}
async function requireUser(request, env, queryToken='') {
  const token = bearerToken(request) || queryToken;
  if (!token) fail('Nicht angemeldet', 401);
  const tokenHash = await sha256Base64(token);
  const now = Date.now();
  const row = await env.DB.prepare(`
    SELECT u.id,u.username,s.expires_at
    FROM sessions s JOIN users u ON u.id=s.user_id
    WHERE s.token_hash=?
  `).bind(tokenHash).first();
  if (!row || Number(row.expires_at) <= now) {
    if (row) await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(tokenHash).run();
    fail('Sitzung abgelaufen', 401);
  }
  return { id:row.id, username:row.username };
}

async function getState(request, env) {
  const user = await requireUser(request, env);
  const row = await env.DB.prepare('SELECT data,updated_at FROM app_state WHERE user_id=?').bind(user.id).first();
  if (!row) return json({ data:null, updatedAt:0 });
  let data = null;
  try { data = JSON.parse(row.data); } catch {}
  return json({ data, updatedAt:Number(row.updated_at || 0) });
}
async function getStateMeta(request, env) {
  const user = await requireUser(request, env);
  const row = await env.DB.prepare('SELECT updated_at FROM app_state WHERE user_id=?').bind(user.id).first();
  return json({ updatedAt:Number(row?.updated_at || 0) });
}
async function putState(request, env) {
  const user = await requireUser(request, env);
  const body = await readJson(request);
  if (!body || typeof body.data !== 'object') fail('Ungültiger App-Datenstand');
  const serialized = JSON.stringify(body.data);
  if (encoder.encode(serialized).byteLength > 1_850_000) fail('Der synchronisierte Datenstand ist zu groß', 413);
  const updatedAt = Date.now();
  await env.DB.prepare(`
    INSERT INTO app_state (user_id,data,updated_at) VALUES (?,?,?)
    ON CONFLICT(user_id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at
  `).bind(user.id, serialized, updatedAt).run();
  return json({ ok:true, updatedAt });
}

async function uploadFile(request, env) {
  const user = await requireUser(request, env);
  const type = request.headers.get('content-type') || '';
  if (!type.startsWith('image/')) fail('Nur Bilder sind erlaubt', 415);
  const body = await request.arrayBuffer();
  if (!body.byteLength) fail('Leere Datei');
  if (body.byteLength > 2_500_000) fail('Bild ist zu groß', 413);
  const ext = imageExtension(type);
  const key = `${user.id}/${crypto.randomUUID()}.${ext}`;
  await env.FILES.put(key, body, { httpMetadata:{ contentType:type }, customMetadata:{ userId:user.id } });
  return json({ ref:`r2:${key}` }, 201);
}

async function getFile(request, env, url) {
  const queryToken = url.searchParams.get('token') || '';
  const user = await requireUser(request, env, queryToken);
  const raw = url.pathname.slice('/api/file/'.length);
  let key;
  try { key = decodeURIComponent(raw); } catch { fail('Ungültiger Dateipfad'); }
  if (!key.startsWith(`${user.id}/`)) fail('Kein Zugriff', 403);
  const object = await env.FILES.get(key);
  if (!object) fail('Bild nicht gefunden', 404);
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('Cache-Control','private, max-age=3600');
  headers.set('X-Content-Type-Options','nosniff');
  headers.set('Referrer-Policy','no-referrer');
  return new Response(object.body, { headers });
}

function imageExtension(type) {
  if (type.includes('png')) return 'png';
  if (type.includes('webp')) return 'webp';
  if (type.includes('gif')) return 'gif';
  return 'jpg';
}

async function hashPassword(password, saltB64) {
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name:'PBKDF2', salt:base64ToBytes(saltB64), iterations:120000, hash:'SHA-256' }, keyMaterial, 256);
  return bytesToBase64(new Uint8Array(bits));
}
async function sha256Base64(value) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return bytesToBase64(new Uint8Array(digest));
}
function constantTimeEqual(a, b) {
  const aa = encoder.encode(String(a));
  const bb = encoder.encode(String(b));
  if (aa.length !== bb.length) return false;
  let diff = 0;
  for (let i=0;i<aa.length;i++) diff |= aa[i] ^ bb[i];
  return diff === 0;
}
function randomRecoveryCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  let out = '';
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return `AH-${out.slice(0,4)}-${out.slice(4,8)}-${out.slice(8,12)}-${out.slice(12,16)}-${out.slice(16,20)}`;
}
function randomBase64(length) {
  const bytes = new Uint8Array(length); crypto.getRandomValues(bytes); return bytesToBase64(bytes);
}
function randomBase64Url(length) {
  return randomBase64(length).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function bytesToBase64(bytes) {
  let binary='';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}
function base64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i=0;i<binary.length;i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
