const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const todayISO = () => new Date().toISOString().slice(0,10);
const fmtDate = (s) => {
  if(!s) return "";
  const d = new Date(s + (s.length <= 10 ? "T12:00:00" : ""));
  return new Intl.DateTimeFormat("de-DE", { day:"2-digit", month:"2-digit", year:"numeric" }).format(d);
};
const fmtDateTime = (s) => {
  if(!s) return "";
  const d = new Date(s);
  return new Intl.DateTimeFormat("de-DE", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" }).format(d);
};
const money = (n) => new Intl.NumberFormat("de-DE", { style:"currency", currency:"EUR" }).format(Number(n || 0));
const moneyMaybe = (n) => (n === null || n === undefined || n === "") ? "Nicht eingetragen" : money(n);
const parseOptionalPrice = (value) => {
  const raw = String(value ?? '').trim();
  if(!raw) return null;
  const num = parseFloat(raw.replace(',', '.'));
  return Number.isFinite(num) ? num : null;
};
const escapeHTML = (s="") => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const attr = (s="") => escapeHTML(s).replace(/"/g, "&quot;");

const ICONS = {
  home:`<svg class="icon" viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-6h5v6"/></svg>`,
  calendar:`<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 9h18"/></svg>`,
  orders:`<svg class="icon" viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5h6M8 9h8M8 13h8M8 17h5"/></svg>`,
  bag:`<svg class="icon" viewBox="0 0 24 24"><path d="M5 8h14l1 12H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>`,
  more:`<svg class="icon" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>`,
  plus:`<svg class="icon" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>`,
  back:`<svg class="icon" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>`,
  bell:`<svg class="icon" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>`,
  search:`<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`,
  phone:`<svg class="icon" viewBox="0 0 24 24"><path d="M6.5 3.5 9 8l-2 2c1.5 3 4 5.5 7 7l2-2 4.5 2.5c-1 3-3 4-5.5 3.5C9 20 4 15 3 9c-.5-2.5.5-4.5 3.5-5.5Z"/></svg>`,
  camera:`<svg class="icon" viewBox="0 0 24 24"><path d="M4 8h4l1.5-2h5L16 8h4v11H4Z"/><circle cx="12" cy="13" r="3.5"/></svg>`,
  tag:`<svg class="icon" viewBox="0 0 24 24"><path d="m3 12 9 9 9-9-9-9H3v9Z"/><circle cx="8" cy="8" r="1"/></svg>`,
  send:`<svg class="icon" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/></svg>`,
  settings:`<svg class="icon" viewBox="0 0 24 24"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="3.5"/></svg>`,
  whatsapp:`<svg class="icon" viewBox="0 0 24 24"><path d="M20 11.5A8.5 8.5 0 0 1 7.6 19l-3.6 1 1-3.5A8.5 8.5 0 1 1 20 11.5Z"/><path d="M9.2 8.7c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.3l.8 1.8c.1.2.1.4 0 .5l-.4.6c-.1.1-.1.3 0 .4.4.8 1 1.4 1.8 1.8.1.1.3.1.4 0l.6-.4c.2-.1.4-.1.5 0l1.8.8c.3.1.3.3.3.5v.5c0 .3 0 .5-.4.7-.4.2-1 .3-1.7.1-2-.5-4.7-3.1-5.2-5.2-.2-.7-.1-1.3.1-1.7Z"/></svg>`,
  cloud:`<svg class="icon" viewBox="0 0 24 24"><path d="M7 18h10a4 4 0 0 0 .8-7.9A6 6 0 0 0 6.4 8.4 4.8 4.8 0 0 0 7 18Z"/><path d="M12 10v6M9.5 13.5 12 16l2.5-2.5"/></svg>`,
  user:`<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4.5 20c.8-4 3.3-6 7.5-6s6.7 2 7.5 6"/></svg>`
};

const defaults = {
  orders:[
    {id:"o1",customerId:"c1",name:"Frigo Trans",phone:"01701234567",accepted:todayISO(),due:todayISO(),price:120,location:"Regal A",text:"Dubbeglas mit Druck",status:"progress",photos:[],informed:false,ready:false,reminder:false,reminderAt:null,reminded:false,paid:false},
    {id:"o2",customerId:"c2",name:"Klara Meier",phone:"01721234567",accepted:todayISO(),due:new Date(Date.now()+86400000).toISOString().slice(0,10),price:42,location:"Regal B · Fach 2",text:"1× Schorli Kuscheltier mit Name.",status:"open",photos:[],informed:false,ready:false,reminder:false,reminderAt:null,reminded:false,paid:false}
  ],
  customers:[
    {id:"c1",name:"Frigo Trans",phone:"01701234567",email:"",address:"",note:""},
    {id:"c2",name:"Klara Meier",phone:"01721234567",email:"",address:"",note:""}
  ],
  supplies:[
    {id:"s1",name:"Dubbegläser",amount:"6 Stk.",photo:"",ordered:false},
    {id:"s2",name:"Schorli Kuscheltiere",amount:"3 Stk.",photo:"",ordered:false},
    {id:"s3",name:"Transferfolie weiß",amount:"5 m",photo:"",ordered:false}
  ],
  prices:[
    {id:"p1",name:"Dubbeglas mit Druck",price:12,photo:""},
    {id:"p2",name:"Tasche mit Druck",price:19,photo:""},
    {id:"p3",name:"Shirt mit Druck",price:25,photo:""},
    {id:"p4",name:"Jacke mit Stick",price:59,photo:""}
  ],
  offers:[
    {id:"a1",name:"5 Dubbegläser mit Druck",price:50,valid:"2026-12-31",photo:""},
    {id:"a2",name:"10 Shirts mit Druck",price:120,valid:"2026-12-31",photo:""}
  ],
  events:[
    {id:"e1",date:todayISO(),time:"11:00",title:"Kunde holt ab",note:"Klara Meier",type:"pickup"}
  ],
  settings:{theme:"beige"}
};

function normalizeStateShape(s){
  const merged = {...defaults, ...(s || {}), settings:{...defaults.settings, ...((s || {}).settings || {})}};
  merged.orders = (merged.orders || []).map(o => ({customerId:null, paid:false, reminder:false, reminderAt:null, reminded:false, informed:false, ready:false, photos:[], locationPhoto:"", status:"open", ...o}));
  merged.customers = (merged.customers || []).map(c => ({name:"", phone:"", email:"", address:"", note:"", ...c}));
  merged.supplies = (merged.supplies || []).map(s => ({photo:"", ordered:false, ...s}));
  merged.prices = (merged.prices || []).map(p => ({photo:"", price:null, ...p}));
  merged.offers = (merged.offers || []).map(o => ({photo:"", price:null, valid:"", ...o}));
  merged.events = merged.events || [];
  return merged;
}
function loadState(){
  try{
    const saved = JSON.parse(localStorage.getItem("auftragshelfer"));
    return normalizeStateShape(saved || structuredClone(defaults));
  }catch(e){ return normalizeStateShape(structuredClone(defaults)); }
}
function saveLocalOnly(){ localStorage.setItem("auftragshelfer", JSON.stringify(state)); }
function saveState(){
  saveLocalOnly();
  if(currentUser && cloudConfigured && !cloudInitializing) scheduleCloudSave();
}
function setTheme(name){
  const root = document.documentElement;
  const themes = {
    beige:{accent:"#bb8f67", accent2:"#e8d5bd", strong:"#9b6f48", bg:"#f8f3ec", surface2:"#f3e8db", surface3:"#ead7c0"},
    sand:{accent:"#c29a6b", accent2:"#ead5b5", strong:"#997450", bg:"#faf4eb", surface2:"#f3e8da", surface3:"#ead9c6"},
    rose:{accent:"#c48b80", accent2:"#efd1ca", strong:"#9f665d", bg:"#fcf3f1", surface2:"#f6e2de", surface3:"#efd1ca"},
    sage:{accent:"#97a087", accent2:"#d9e0d1", strong:"#727d66", bg:"#f5f6f1", surface2:"#e7ebdf", surface3:"#dce3d3"}
  };
  const t = themes[name] || themes.beige;
  root.style.setProperty("--accent", t.accent);
  root.style.setProperty("--accent-2", t.accent2);
  root.style.setProperty("--accent-strong", t.strong);
  root.style.setProperty("--bg", t.bg);
  root.style.setProperty("--surface-2", t.surface2);
  root.style.setProperty("--surface-3", t.surface3);
}

let state = loadState();
let route = {page:"home", id:null};
let selectedDate = todayISO();
let modal = null;
let reminderTimer = null;
let currentUser = null;
let cloudConfigured = false;
let cloudSyncState = 'local';
let cloudSaveTimer = null;
let cloudInitializing = false;
let cloudToken = localStorage.getItem('auftragshelfer_cloud_token') || '';
let cloudLastUpdated = 0;
let cloudPollTimer = null;
let selectedCustomerForNewOrder = null;
setTheme(state.settings.theme);

function cloudConfigValid(){
  const cfg = window.CLOUD_CONFIG || {};
  return Boolean(cfg.apiBase && !String(cfg.apiBase).includes('DEINE_') && !String(cfg.apiBase).includes('YOUR_'));
}
function cloudBase(){ return String(window.CLOUD_CONFIG?.apiBase || '').replace(/\/$/, ''); }
async function cloudRequest(path, options={}){
  if(!cloudConfigured) throw new Error('Cloud ist noch nicht eingerichtet.');
  const headers = new Headers(options.headers || {});
  if(cloudToken) headers.set('Authorization', `Bearer ${cloudToken}`);
  if(options.body && !(options.body instanceof Blob) && !(options.body instanceof ArrayBuffer) && !headers.has('Content-Type')) headers.set('Content-Type','application/json');
  const response = await fetch(`${cloudBase()}${path}`, {...options, headers});
  let data = null;
  const type = response.headers.get('content-type') || '';
  if(type.includes('application/json')) data = await response.json().catch(()=>null);
  if(!response.ok){
    const err = new Error(data?.error || `Cloud-Fehler (${response.status})`);
    err.status = response.status;
    throw err;
  }
  return data;
}
function photoSrc(ref){
  if(!ref) return '';
  if(String(ref).startsWith('r2:') && cloudConfigured && cloudToken){
    const key = String(ref).slice(3);
    return `${cloudBase()}/api/file/${encodeURIComponent(key)}?token=${encodeURIComponent(cloudToken)}`;
  }
  return ref;
}
async function uploadCloudPhoto(ref){
  if(!ref || !String(ref).startsWith('data:image/')) return ref;
  const blob = await fetch(ref).then(r=>r.blob());
  const result = await cloudRequest('/api/upload', {method:'POST', headers:{'Content-Type':blob.type || 'image/jpeg'}, body:blob});
  return result.ref;
}
async function prepareStateForCloud(){
  for(const o of state.orders){
    o.locationPhoto = await uploadCloudPhoto(o.locationPhoto);
    o.photos = await Promise.all((o.photos || []).map(uploadCloudPhoto));
  }
  for(const s of state.supplies) s.photo = await uploadCloudPhoto(s.photo);
  for(const p of state.prices) p.photo = await uploadCloudPhoto(p.photo);
  for(const a of state.offers) a.photo = await uploadCloudPhoto(a.photo);
  saveLocalOnly();
  return JSON.parse(JSON.stringify(state));
}
async function initCloud(){
  cloudConfigured = cloudConfigValid();
  if(!cloudConfigured) return;
  if(!cloudToken) return;
  cloudInitializing = true;
  try{
    const me = await cloudRequest('/api/me');
    currentUser = me.user;
    await pullCloudState();
    startCloudPolling();
  }catch(err){
    if(err.status === 401){
      cloudToken = '';
      localStorage.removeItem('auftragshelfer_cloud_token');
      currentUser = null;
      cloudSyncState = 'local';
    }else{
      console.error(err);
      cloudSyncState = 'error';
    }
  }finally{ cloudInitializing = false; }
}
function scheduleCloudSave(){
  clearTimeout(cloudSaveTimer);
  cloudSyncState = 'saving';
  cloudSaveTimer = setTimeout(pushCloudState, 700);
}
async function pushCloudState(){
  if(!currentUser || !cloudToken || !cloudConfigured) return;
  cloudSyncState = 'saving';
  try{
    const cloudState = await prepareStateForCloud();
    const result = await cloudRequest('/api/state', {method:'PUT', body:JSON.stringify({data:cloudState})});
    cloudLastUpdated = Number(result?.updatedAt || Date.now());
    cloudSyncState = 'synced';
  }catch(err){
    console.error(err);
    cloudSyncState = 'error';
  }
  if(route.page === 'more') updateCloudStatusOnly();
}
async function pullCloudState(){
  if(!currentUser || !cloudToken || !cloudConfigured) return;
  cloudSyncState = 'syncing';
  try{
    const result = await cloudRequest('/api/state');
    if(result?.data){
      cloudLastUpdated = Number(result.updatedAt || Date.now());
      state = normalizeStateShape(result.data);
      saveLocalOnly();
      setTheme(state.settings.theme);
      cloudSyncState = 'synced';
      renderCurrent();
    }else{
      await pushCloudState();
    }
  }catch(err){
    console.error(err);
    cloudSyncState = 'error';
  }
}
function updateCloudStatusOnly(){
  const el = document.querySelector('[data-cloud-status]');
  if(el) el.textContent = cloudStatusText();
}
function cloudStatusText(){
  if(!cloudConfigured) return 'Cloudflare noch nicht eingerichtet';
  if(!currentUser) return 'Nicht angemeldet';
  if(cloudSyncState === 'saving' || cloudSyncState === 'syncing') return 'Synchronisiert…';
  if(cloudSyncState === 'error') return 'Sync-Fehler';
  return 'Synchronisiert';
}
async function cloudSignUp(email, password){
  const result = await cloudRequest('/api/auth/register', {method:'POST', body:JSON.stringify({email,password})});
  cloudToken = result.token;
  localStorage.setItem('auftragshelfer_cloud_token', cloudToken);
  currentUser = result.user;
  await pushCloudState();
  startCloudPolling();
  return result;
}
async function cloudSignIn(email, password){
  const result = await cloudRequest('/api/auth/login', {method:'POST', body:JSON.stringify({email,password})});
  cloudToken = result.token;
  localStorage.setItem('auftragshelfer_cloud_token', cloudToken);
  currentUser = result.user;
  await pullCloudState();
  startCloudPolling();
  return result;
}
async function cloudSignOut(){
  try{ if(cloudToken && cloudConfigured) await cloudRequest('/api/auth/logout', {method:'POST'}); }catch(e){}
  cloudToken = '';
  localStorage.removeItem('auftragshelfer_cloud_token');
  currentUser = null;
  cloudSyncState = 'local';
  cloudLastUpdated = 0;
  if(cloudPollTimer) clearInterval(cloudPollTimer);
}
async function checkCloudUpdates(){
  if(!currentUser || !cloudConfigured || cloudSyncState === 'saving' || cloudSyncState === 'syncing') return;
  try{
    const meta = await cloudRequest('/api/state/meta');
    if(Number(meta?.updatedAt || 0) > cloudLastUpdated) await pullCloudState();
  }catch(err){ if(err.status !== 401) console.warn('Cloud check failed', err); }
}
function startCloudPolling(){
  if(cloudPollTimer) clearInterval(cloudPollTimer);
  cloudPollTimer = setInterval(checkCloudUpdates, 30000);
}

function toast(msg){
  document.querySelector('.toast')?.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1800);
}

function dueLabel(date){
  const t = todayISO();
  if(date === t) return 'Heute';
  const diff = (new Date(date + 'T12:00:00') - new Date(t + 'T12:00:00')) / 86400000;
  if(diff === 1) return 'Morgen';
  if(diff < 0) return 'Überfällig';
  return fmtDate(date);
}
function statusLabel(s){ return ({open:'Offen', progress:'In Arbeit', done:'Fertig'})[s] || 'Offen'; }
function orderBadge(o){
  if(o.ready) return `<span class="badge ready">Abholbereit</span>`;
  return `<span class="badge ${o.status}">${statusLabel(o.status)}</span>`;
}
function orderThumb(o){
  if(o.photos?.length) return `<img class="thumb" src="${photoSrc(o.photos[0])}" alt="">`;
  return `<div class="thumb placeholder">${ICONS.orders}</div>`;
}
function orderCard(o){
  return `<div class="card order-card pressable" data-order="${o.id}">
    ${orderThumb(o)}
    <div class="order-main">
      <strong>${escapeHTML(o.name)}</strong>
      <div class="desc">${escapeHTML((o.text || '').split('\n')[0] || 'Auftrag')}</div>
      <div class="order-meta"><span>${dueLabel(o.due)}</span>${orderBadge(o)}${o.paid ? `<span class="badge paid">Bezahlt</span>` : ``}</div>
    </div>
    <div class="order-side"><span class="price">${moneyMaybe(o.price)}</span></div>
  </div>`;
}

function nav(){
  const items = [
    ['home','Übersicht','home'],
    ['calendar','Kalender','calendar'],
    ['orders','Aufträge','orders'],
    ['supplies','Bestellen','bag'],
    ['more','Mehr','more']
  ];
  return `<nav class="nav">${items.map(([p,l,i])=>`
    <button data-nav="${p}" class="nav-btn pressable ${route.page===p?'active':''}">
      ${ICONS[i]}<span>${l}</span>
    </button>`).join('')}</nav>`;
}
function topbar(title, back=false, actions=''){
  return `<div class="topbar">
    <div class="top-side">${back ? `<button class="icon-btn pressable" data-back>${ICONS.back}</button>` : `<span></span>`}</div>
    <h1>${title}</h1>
    <div class="top-actions">${actions}</div>
  </div>`;
}
function modalHTML(){
  if(!modal) return '';
  if(modal.type === 'event'){
    return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Termin eintragen</h2><button class="icon-btn pressable" data-close>×</button></div>
      <form id="eventForm" class="form">
        <div class="field"><label>Titel</label><input name="title" required placeholder="z. B. Kunde holt ab"></div>
        <div class="grid2"><div class="field"><label>Datum</label><input type="date" name="date" value="${modal.date}" required></div><div class="field"><label>Uhrzeit</label><input type="time" name="time" value="10:00"></div></div>
        <div class="field"><label>Notiz</label><textarea name="note" style="min-height:76px"></textarea></div>
        <button class="primary-btn pressable">Termin speichern</button>
      </form></div></div>`;
  }
  if(modal.type === 'editEvent'){
    const e = state.events.find(x => x.id === modal.id);
    if(!e) return '';
    return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Termin bearbeiten</h2><button class="icon-btn pressable" data-close>×</button></div>
      <form id="editEventForm" class="form">
        <div class="field"><label>Titel</label><input name="title" value="${attr(e.title)}" required></div>
        <div class="grid2"><div class="field"><label>Datum</label><input type="date" name="date" value="${e.date}" required></div><div class="field"><label>Uhrzeit</label><input type="time" name="time" value="${e.time || ''}"></div></div>
        <div class="field"><label>Notiz</label><textarea name="note" style="min-height:76px">${escapeHTML(e.note || '')}</textarea></div>
        <button class="primary-btn pressable">Änderungen speichern</button>
        <button type="button" class="secondary-btn pressable danger-btn" data-action="deleteEvent">Termin löschen</button>
      </form></div></div>`;
  }
  if(modal.type === 'supply'){
    return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Zu „Bestellen“ hinzufügen</h2><button class="icon-btn pressable" data-close>×</button></div>
      <form id="supplyForm" class="form">
        <div class="field"><label>Artikel</label><input name="name" required></div>
        <div class="field"><label>Menge</label><input name="amount"></div>
        <label class="photo-picker pressable"><input id="supplyPhoto" type="file" accept="image/*"><div class="photo-trigger">${ICONS.camera}<span><b>Eigenes Foto</b><br><span class="small-note">Optional</span></span></div><div id="supplyPreview" class="photos"></div></label>
        <button class="primary-btn pressable">Hinzufügen</button>
      </form></div></div>`;
  }
  if(modal.type === 'editSupply'){
    const s = state.supplies.find(x => x.id === modal.id);
    if(!s) return '';
    return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Bestellung bearbeiten</h2><button class="icon-btn pressable" data-close>×</button></div>
      <form id="editSupplyForm" class="form">
        <div class="field"><label>Artikel</label><input name="name" value="${attr(s.name)}" required></div>
        <div class="field"><label>Menge</label><input name="amount" value="${attr(s.amount)}"></div>
        <label class="photo-picker pressable"><input id="editSupplyPhoto" type="file" accept="image/*"><div class="photo-trigger">${ICONS.camera}<span><b>Foto</b><br><span class="small-note">Optional ändern</span></span></div><div id="editSupplyPreview" class="photos">${s.photo ? `<img class="photo" src="${photoSrc(s.photo)}">` : ``}</div></label>
        <label class="toggle-line"><input type="checkbox" name="ordered" ${s.ordered ? 'checked' : ''}> <span>Bereits bestellt</span></label>
        <button class="primary-btn pressable">Änderungen speichern</button>
        <button type="button" class="secondary-btn pressable danger-btn" data-action="deleteSupply">Eintrag löschen</button>
      </form></div></div>`;
  }
  if(modal.type === 'customer'){
    return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Kunde speichern</h2><button class="icon-btn pressable" data-close>×</button></div>
      <form id="customerForm" class="form">
        <div class="field"><label>Name / Firma</label><input name="name" placeholder="optional"></div>
        <div class="field"><label>Telefonnummer</label><input name="phone" inputmode="tel" placeholder="optional"></div>
        <div class="field"><label>E-Mail</label><input name="email" type="email" placeholder="optional"></div>
        <div class="field"><label>Adresse</label><textarea name="address" style="min-height:76px" placeholder="optional"></textarea></div>
        <div class="field"><label>Notiz</label><textarea name="note" style="min-height:76px" placeholder="optional"></textarea></div>
        <p class="small-note">Du musst nicht alles eintragen. Eine Nummer allein reicht auch.</p>
        <button class="primary-btn pressable">Kunde speichern</button>
      </form></div></div>`;
  }
  if(modal.type === 'editCustomer'){
    const c = state.customers.find(x => x.id === modal.id);
    if(!c) return '';
    return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Kunde bearbeiten</h2><button class="icon-btn pressable" data-close>×</button></div>
      <form id="editCustomerForm" class="form">
        <div class="field"><label>Name / Firma</label><input name="name" value="${attr(c.name)}"></div>
        <div class="field"><label>Telefonnummer</label><input name="phone" inputmode="tel" value="${attr(c.phone)}"></div>
        <div class="field"><label>E-Mail</label><input name="email" type="email" value="${attr(c.email)}"></div>
        <div class="field"><label>Adresse</label><textarea name="address" style="min-height:76px">${escapeHTML(c.address)}</textarea></div>
        <div class="field"><label>Notiz</label><textarea name="note" style="min-height:76px">${escapeHTML(c.note)}</textarea></div>
        <button class="primary-btn pressable">Änderungen speichern</button>
        <button type="button" class="secondary-btn pressable danger-btn" data-action="deleteCustomer">Kunde löschen</button>
      </form></div></div>`;
  }
  if(modal.type === 'price'){
    return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Preis / Angebot hinzufügen</h2><button class="icon-btn pressable" data-close>×</button></div>
      <form id="priceForm" class="form">
        <div class="field"><label>Name</label><input name="name" required></div>
        <div class="field"><label>Preis</label><input name="price" inputmode="decimal" placeholder="frei lassen wenn offen"></div>
        <div class="field"><label>Art</label><select name="kind"><option value="prices" ${modal.tab==='prices'?'selected':''}>Preis</option><option value="offers" ${modal.tab==='offers'?'selected':''}>Angebot</option></select></div>
        <div class="field"><label>Gültig bis (nur Angebot)</label><input name="valid" type="date"></div>
        <label class="photo-picker pressable"><input id="pricePhoto" type="file" accept="image/*"><div class="photo-trigger">${ICONS.camera}<span><b>Bild</b><br><span class="small-note">Optional</span></span></div><div id="pricePreview" class="photos"></div></label>
        <button class="primary-btn pressable">Speichern</button>
      </form></div></div>`;
  }
  if(modal.type === 'reminder'){
    const o = state.orders.find(x => x.id === modal.id);
    const d = o.reminderAt ? o.reminderAt.slice(0,10) : (o.due || todayISO());
    const t = o.reminderAt ? o.reminderAt.slice(11,16) : '09:00';
    return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Erinnerung</h2><button class="icon-btn pressable" data-close>×</button></div>
      <form id="reminderForm" class="form">
        <div class="field"><label>Für</label><input value="${attr(o.name)}" disabled></div>
        <div class="grid2"><div class="field"><label>Datum</label><input name="date" type="date" value="${d}" required></div><div class="field"><label>Uhrzeit</label><input name="time" type="time" value="${t}" required></div></div>
        <p class="small-note">Die Erinnerung zeigt eine echte Benachrichtigung, wenn Benachrichtigungen erlaubt sind.</p>
        <button class="primary-btn pressable">Erinnerung speichern</button>
        ${o.reminder ? `<button type="button" class="secondary-btn pressable danger-btn" data-action="removeReminder">Erinnerung entfernen</button>` : ``}
      </form></div></div>`;
  }
  if(modal.type === 'editOrder'){
    const o = state.orders.find(x => x.id === modal.id);
    return `<div class="modal-backdrop"><div class="modal"><div class="modal-head"><h2>Auftrag bearbeiten</h2><button class="icon-btn pressable" data-close>×</button></div>
      <form id="editOrderForm" class="form">
        <div class="field"><label>Name / Firma</label><input name="name" value="${attr(o.name)}" required></div>
        <div class="field"><label>Telefonnummer</label><input name="phone" value="${attr(o.phone)}"></div>
        <div class="grid2"><div class="field"><label>Fällig bis</label><input name="due" type="date" value="${o.due}"></div><div class="field"><label>Preis</label><input name="price" value="${o.price ?? ''}" placeholder="frei lassen wenn offen"></div></div>
        <div class="field"><label>Wo liegt es?</label><input name="location" value="${attr(o.location)}"></div>
        <label class="photo-picker pressable"><input id="editLocationPhoto" type="file" accept="image/*"><div class="photo-trigger">${ICONS.camera}<span><b>Ablagefoto</b><br><span class="small-note">Optional</span></span></div><div id="editLocationPreview" class="photos">${o.locationPhoto ? `<img class="photo" src="${photoSrc(o.locationPhoto)}">` : ``}</div></label>
        <div class="field"><label>Auftrag</label><textarea name="text">${escapeHTML(o.text)}</textarea></div>
        <button class="primary-btn pressable">Änderungen speichern</button>
        <button type="button" class="secondary-btn pressable danger-btn" data-action="deleteOrder">Auftrag löschen</button>
      </form></div></div>`;
  }
  return '';
}

function layout(content){
  $('#app').innerHTML = `<main class="app-shell"><section class="screen">${content}</section>${nav()}${modal ? modalHTML() : ''}</main>`;
  bindGlobal();
}

function home(){
  const t = todayISO();
  const today = state.orders.filter(o => o.due === t && o.status !== 'done').length;
  const progress = state.orders.filter(o => o.status === 'progress').length;
  const done = state.orders.filter(o => o.status === 'done' || o.ready).length;
  const upcoming = [...state.orders].filter(o => o.status !== 'done').sort((a,b) => a.due.localeCompare(b.due)).slice(0,3);
  layout(`
    ${topbar('Übersicht', false, `<button class="icon-btn pressable" data-nav="more">${ICONS.settings}</button>`)}
    <button class="quick-cta pressable" data-nav="new">${ICONS.plus}<span>Schneller Auftrag</span></button>
    <div class="metrics">
      <div class="metric today"><div class="label">Heute fällig</div><div class="num">${today}</div></div>
      <div class="metric progress"><div class="label">In Arbeit</div><div class="num">${progress}</div></div>
      <div class="metric done"><div class="label">Fertig</div><div class="num">${done}</div></div>
    </div>
    <div class="section-head"><h2>Nächste fällige Aufträge</h2><button class="ghost-btn pressable" data-nav="orders">Alle anzeigen</button></div>
    <div class="list">${upcoming.length ? upcoming.map(orderCard).join('') : `<div class="card empty">Keine offenen Aufträge</div>`}</div>
    <div class="section-head"><h2>Bestellen</h2><button class="ghost-btn pressable" data-nav="supplies">Alle anzeigen</button></div>
    <div class="card mini-list">${state.supplies.filter(s => !s.ordered).map(s => `<div class="mini-row"><span class="grow">${escapeHTML(s.name)}</span><small>${escapeHTML(s.amount)}</small></div>`).join('') || `<div class="empty">Nichts offen</div>`}</div>
  `);
}

function newOrder(){
  const now = todayISO();
  layout(`
    ${topbar('Schneller Auftrag', true)}
    <form id="orderForm" class="form">
      <div class="autocomplete-wrap">
        <div class="field"><label>Name / Firma</label><input id="orderCustomerName" name="name" autocomplete="off"></div>
        <div id="customerSuggestions" class="suggestions" hidden></div>
      </div>
      <div class="field"><label>Telefonnummer</label><input id="orderCustomerPhone" name="phone" inputmode="tel"></div>
      <div class="grid2">
        <div class="field"><label>Angenommen am</label><input type="date" name="accepted" value="${now}"></div>
        <div class="field"><label>Fertig bis</label><input type="date" name="due" value="${now}" required></div>
      </div>
      <div class="grid2">
        <div class="field"><label>Preis</label><input name="price" inputmode="decimal" placeholder="frei lassen wenn noch offen"></div>
        <div class="field"><label>Wo liegt es?</label><input name="location" placeholder="z. B. Regal B · Fach 2"></div>
      </div>
      <label class="photo-picker pressable"><input id="locationPhotoInput" type="file" accept="image/*"><div class="photo-trigger">${ICONS.camera}<span><b>Ablagefoto</b><br><span class="small-note">Wo es liegt fotografieren</span></span></div><div id="locationPhotoPreview" class="photos"></div></label>
      <label class="photo-picker pressable"><input id="photoInput" type="file" accept="image/*" multiple><div class="photo-trigger">${ICONS.camera}<span><b>Fotos</b><br><span class="small-note">Mehrere Bilder möglich</span></span></div><div id="newPhotos" class="photos"></div></label>
      <div class="field"><label>Auftrag</label><textarea name="text" id="orderText" placeholder="Einfach alles reinschreiben – das Feld wächst automatisch mit." required></textarea></div>
      <button class="primary-btn pressable" type="submit">Auftrag speichern</button>
    </form>`);
  const ta = $('#orderText');
  const grow = () => { ta.style.height = 'auto'; ta.style.height = Math.max(110, ta.scrollHeight) + 'px'; };
  ta.addEventListener('input', grow); grow();
  let photos = [];
  let locationPhoto = "";
  selectedCustomerForNewOrder = null;
  bindCustomerAutocomplete();
  $('#locationPhotoInput').addEventListener('change', async e => { const file = e.target.files[0]; if(file){ locationPhoto = await compressImage(file); $('#locationPhotoPreview').innerHTML = `<img class="photo" src="${locationPhoto}">`; } });
  $('#photoInput').addEventListener('change', async e => {
    for(const f of [...e.target.files]) photos.push(await compressImage(f));
    $('#newPhotos').innerHTML = photos.map(src => `<img class="photo" src="${photoSrc(src)}">`).join('');
  });
  $('#orderForm').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const o = {
      id:uid(),
      customerId:selectedCustomerForNewOrder,
      name:String(fd.get('name')||'').trim(),
      phone:String(fd.get('phone')||'').trim(),
      accepted:fd.get('accepted'),
      due:fd.get('due'),
      price:parseOptionalPrice(fd.get('price')),
      location:String(fd.get('location')||'').trim(),
      locationPhoto,
      text:String(fd.get('text')||'').trim(),
      status:'open', photos, informed:false, ready:false, reminder:false, reminderAt:null, reminded:false, paid:false
    };
    state.orders.unshift(o); saveState(); toast('Auftrag gespeichert'); route = {page:'detail', id:o.id}; detail(o.id);
  });
}

function bindCustomerAutocomplete(){
  const input = $('#orderCustomerName');
  const phone = $('#orderCustomerPhone');
  const box = $('#customerSuggestions');
  if(!input || !box) return;
  const normalize = s => String(s || '').toLocaleLowerCase('de-DE').trim();
  const render = () => {
    const q = normalize(input.value);
    if(!q){ box.hidden = true; box.innerHTML = ''; selectedCustomerForNewOrder = null; return; }
    const matches = state.customers
      .filter(c => normalize(c.name).includes(q) || normalize(c.phone).includes(q))
      .sort((a,b) => {
        const ap = normalize(a.name).startsWith(q) ? 0 : 1;
        const bp = normalize(b.name).startsWith(q) ? 0 : 1;
        return ap-bp || normalize(a.name).localeCompare(normalize(b.name),'de');
      })
      .slice(0,5);
    if(!matches.length){ box.hidden = true; box.innerHTML = ''; selectedCustomerForNewOrder = null; return; }
    box.innerHTML = matches.map(c => `<button type="button" class="suggestion pressable" data-customer-suggest="${c.id}"><strong>${escapeHTML(c.name || c.phone || 'Kunde')}</strong>${c.phone ? `<span>${escapeHTML(c.phone)}</span>` : ''}${c.email ? `<small>${escapeHTML(c.email)}</small>` : ''}</button>`).join('');
    box.hidden = false;
    $$('[data-customer-suggest]', box).forEach(btn => btn.addEventListener('click', () => {
      const c = state.customers.find(x => x.id === btn.dataset.customerSuggest);
      if(!c) return;
      selectedCustomerForNewOrder = c.id;
      input.value = c.name || '';
      phone.value = c.phone || '';
      box.hidden = true;
      box.innerHTML = '';
      toast('Kundendaten übernommen');
    }));
    bindPressables();
  };
  input.addEventListener('input', () => { selectedCustomerForNewOrder = null; render(); });
  input.addEventListener('focus', render);
  document.addEventListener('click', e => { if(!e.target.closest('.autocomplete-wrap')) box.hidden = true; }, {once:false});
}

function orders(){
  layout(`
    ${topbar('Aufträge', false, `<button class="icon-btn pressable" data-nav="new">${ICONS.plus}</button>`)}
    <div class="search">${ICONS.search}<input id="orderSearch" placeholder="Suchen"></div>
    <div class="filters" id="orderFilters"><button class="filter active pressable" data-filter="all">Alle</button><button class="filter pressable" data-filter="open">Offen</button><button class="filter pressable" data-filter="progress">In Arbeit</button><button class="filter pressable" data-filter="done">Fertig</button></div>
    <div id="ordersList" class="list"></div>
  `);
  let filter = 'all';
  const render = () => {
    const q = $('#orderSearch').value.toLowerCase().trim();
    const list = state.orders.filter(o => (filter === 'all' || (filter === 'done' ? (o.status === 'done' || o.ready) : o.status === filter)) && `${o.name} ${o.text} ${o.location}`.toLowerCase().includes(q));
    $('#ordersList').innerHTML = list.length ? list.map(orderCard).join('') : `<div class="card empty">Keine Aufträge gefunden.</div>`;
    bindOrderCards();
    bindPressables();
  };
  $('#orderSearch').addEventListener('input', render);
  $$('#orderFilters .filter').forEach(btn => btn.addEventListener('click', () => {
    $$('#orderFilters .filter').forEach(x => x.classList.remove('active')); btn.classList.add('active'); filter = btn.dataset.filter; render();
  }));
  render();
}

function detail(id){
  const o = state.orders.find(x => x.id === id);
  if(!o){ route = {page:'orders'}; return orders(); }
  layout(`
    ${topbar('Auftragsdetails', true, `<button class="icon-btn pressable" data-action="editOrder">${ICONS.more}</button>`)}
    <div class="card detail-body top-detail-card">
      <h3>Auftrag</h3>
      <div class="detail-text">${escapeHTML(o.text || '')}</div>
    </div>
    <div class="info-grid">
      <div class="info-box"><small>Fällig bis</small><strong>${fmtDate(o.due)}</strong></div>
      <div class="info-box"><small>Preis</small><strong>${moneyMaybe(o.price)}</strong></div>
      <div class="info-box location-box"><small>Wo liegt es?</small><strong>${escapeHTML(o.location || 'Nicht eingetragen')}</strong>${o.locationPhoto ? `<img class="location-photo" src="${photoSrc(o.locationPhoto)}" alt="Ablagefoto">` : `<div class="small-note">Optional kann auch ein Bild vom Ablageort gespeichert werden.</div>`}</div>
    </div>
    <div class="section-head photos-head"><h2>Fotos</h2></div>
    <div class="photos">${(o.photos || []).map(src => `<img class="photo" src="${photoSrc(src)}">`).join('')}<button class="photo-add pressable" data-action="addPhotos">${ICONS.plus}</button></div>
    <input id="detailPhotoInput" type="file" accept="image/*" multiple hidden>
    <div class="section-head"><h2>Status</h2></div>
    <div class="status-row">${['open','progress','done'].map(s => `<button class="status-btn pressable ${o.status===s?'active':''}" data-status="${s}">${statusLabel(s)}</button>`).join('')}</div>
    <div class="section-head mini-head"><h2>Bezahlung</h2></div>
    <div class="status-row two-col"><button class="status-btn pressable ${!o.paid?'active':''}" data-paid="no">Nicht bezahlt</button><button class="status-btn pressable ${o.paid?'active':''}" data-paid="yes">Bezahlt</button></div>
    <div class="action-row four-actions">
      <button class="action-tile pressable ${o.informed?'active':''}" data-action="toggleInformed">${ICONS.send}<span>${o.informed ? 'Kunde informiert ✓' : 'Kunde informiert'}</span></button>
      <button class="action-tile pressable ${o.ready?'active':''}" data-action="toggleReady">${ICONS.bag}<span>${o.ready ? 'Abholbereit ✓' : 'Abholbereit'}</span></button>
      <button class="action-tile pressable ${o.reminder?'active':''}" data-action="toggleReminder">${ICONS.bell}<span>${o.reminder ? 'Erinnerung aktiv' : 'Erinnerung'}</span></button>
      <button class="action-tile pressable" data-action="openWhatsApp">${ICONS.whatsapp}<span>WhatsApp</span></button>
    </div>
    ${o.reminder && o.reminderAt ? `<div class="small-note reminder-note">Erinnerung: ${fmtDateTime(o.reminderAt)}</div>` : ``}
    <div class="inline-actions"><button class="secondary-btn pressable wide-btn" data-action="icsOrder">${ICONS.calendar} Kalender</button><button class="secondary-btn pressable wide-btn" data-action="copyOrder">Auftrag kopieren</button></div>
  `);
  $$('.status-btn[data-status]').forEach(btn => btn.addEventListener('click', () => { o.status = btn.dataset.status; if(o.status === 'done') o.ready = true; saveState(); toast(`Status: ${statusLabel(o.status)}`); detail(id); }));
  $$('.status-btn[data-paid]').forEach(btn => btn.addEventListener('click', () => { o.paid = btn.dataset.paid === 'yes'; saveState(); toast(o.paid ? 'Als bezahlt markiert' : 'Als nicht bezahlt markiert'); detail(id); }));
  $('[data-action="toggleInformed"]').addEventListener('click', () => { o.informed = !o.informed; saveState(); toast(o.informed ? 'Kunde als informiert markiert' : 'Kunde informiert entfernt'); detail(id); });
  $('[data-action="toggleReady"]').addEventListener('click', () => { o.ready = !o.ready; if(o.ready && o.status === 'open') o.status = 'done'; saveState(); toast(o.ready ? 'Als abholbereit markiert' : 'Abholbereit entfernt'); detail(id); });
  $('[data-action="toggleReminder"]').addEventListener('click', () => openReminderModal(o));
  $('[data-action="openWhatsApp"]').addEventListener('click', () => {
    const number = String(o.phone || '').replace(/[^\d+]/g, '').replace(/^00/, '');
    if(!number){ toast('Keine Telefonnummer eingetragen'); return; }
    const clean = number.replace(/^\+/, '');
    const msg = encodeURIComponent(`Hallo ${o.name}, wegen deinem Auftrag:`);
    window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
  });
  $('[data-action="copyOrder"]').addEventListener('click', () => { const c = {...o, id:uid(), name:o.name + ' (Kopie)', accepted:todayISO(), status:'open', informed:false, ready:false, paid:false}; state.orders.unshift(c); saveState(); toast('Auftrag kopiert'); route = {page:'detail', id:c.id}; detail(c.id); });
  $('[data-action="icsOrder"]').addEventListener('click', () => downloadICS({date:o.due, time:'09:00', title:`Auftrag: ${o.name}`, note:o.text}));
  $('[data-action="editOrder"]').addEventListener('click', () => openEditOrder(o));
  const input = $('#detailPhotoInput');
  $('[data-action="addPhotos"]').addEventListener('click', () => input.click());
  input.addEventListener('change', async e => { for(const f of [...e.target.files]) o.photos.push(await compressImage(f)); saveState(); toast('Bilder hinzugefügt'); detail(id); });
}

function calendar(){
  layout(`
    ${topbar('Kalender', false, `<button class="circle-btn pressable" data-action="addEvent">${ICONS.plus}</button>`)}
    <div class="calendar-head"><strong id="monthTitle"></strong><div class="month-actions"><button class="icon-btn pressable" data-cal="-1">${ICONS.back}</button><button class="icon-btn pressable rotate-180" data-cal="1">${ICONS.back}</button></div></div>
    <div id="monthGrid" class="month-grid"></div>
    <div class="section-head"><h2 id="dayTitle"></h2><button class="ghost-btn pressable" data-action="addEvent">+ Termin</button></div>
    <div id="schedule" class="schedule"></div>
  `);
  let base = new Date(selectedDate + 'T12:00:00');
  let viewYear = base.getFullYear(), viewMonth = base.getMonth();
  const eventsForDate = (date) => {
    const orderEvents = state.orders.filter(o => o.due === date).map(o => ({id:`order-${o.id}`, date:o.due, time:'09:00', title:`${o.name} – fällig`, note:(o.text || '').split('\n')[0], orderId:o.id}));
    const map = new Map();
    [...state.events.filter(e => e.date === date), ...orderEvents].forEach(e => map.set(e.id, e));
    return [...map.values()];
  };
  function drawSchedule(){
    const d = new Date(selectedDate + 'T12:00:00');
    $('#dayTitle').textContent = new Intl.DateTimeFormat('de-DE', { weekday:'long', day:'2-digit', month:'long' }).format(d);
    const ev = eventsForDate(selectedDate).sort((a,b) => (a.time || '').localeCompare(b.time || ''));
    $('#schedule').innerHTML = ev.length ? ev.map(e => `<div class="card event-card pressable" data-event-open="${e.orderId || ''}" data-event-edit="${e.orderId ? '' : e.id}"><div class="event-time">${escapeHTML(e.time || '')}</div><div class="event-line"></div><div class="event-info"><strong>${escapeHTML(e.title)}</strong><span>${escapeHTML(e.note || '')}</span></div><button class="icon-btn pressable" data-event-ics="${e.id}">${ICONS.calendar}</button></div>`).join('') : `<div class="card empty">Keine Termine an diesem Tag.</div>`;
    $$('[data-event-ics]').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); const all = [...state.events, ...eventsForDate(selectedDate)]; const item = all.find(x => x.id === btn.dataset.eventIcs); if(item) downloadICS(item); }));
    $$('[data-event-open]').forEach(card => card.addEventListener('click', () => {
      if(card.dataset.eventOpen){ route = {page:'detail', id:card.dataset.eventOpen}; detail(card.dataset.eventOpen); }
      else if(card.dataset.eventEdit){ openEditEventModal(card.dataset.eventEdit); }
    }));
    bindPressables();
  }
  function draw(){
    const first = new Date(viewYear, viewMonth, 1), last = new Date(viewYear, viewMonth + 1, 0);
    $('#monthTitle').textContent = new Intl.DateTimeFormat('de-DE', { month:'long', year:'numeric' }).format(first);
    const names = ['Mo','Di','Mi','Do','Fr','Sa','So'];
    let html = names.map(n => `<div class="day-name">${n}</div>`).join('');
    const mondayIndex = (first.getDay() + 6) % 7;
    for(let i=0;i<mondayIndex;i++){
      const d = new Date(viewYear, viewMonth, 1 - (mondayIndex - i));
      html += `<button class="day muted" data-date="${d.toISOString().slice(0,10)}">${d.getDate()}</button>`;
    }
    for(let day=1; day<=last.getDate(); day++){
      const dt = new Date(viewYear, viewMonth, day), iso = dt.toISOString().slice(0,10);
      html += `<button class="day pressable ${iso===selectedDate?'selected':''} ${eventsForDate(iso).length ? 'has-events':''}" data-date="${iso}">${day}</button>`;
    }
    const cells = mondayIndex + last.getDate(); const tail = (7 - (cells % 7)) % 7;
    for(let i=1;i<=tail;i++){
      const d = new Date(viewYear, viewMonth + 1, i);
      html += `<button class="day muted" data-date="${d.toISOString().slice(0,10)}">${d.getDate()}</button>`;
    }
    $('#monthGrid').innerHTML = html;
    $$('[data-date]').forEach(btn => btn.addEventListener('click', () => { selectedDate = btn.dataset.date; draw(); drawSchedule(); }));
    drawSchedule();
    bindPressables();
  }
  $$('[data-cal]').forEach(btn => btn.addEventListener('click', () => { viewMonth += Number(btn.dataset.cal); if(viewMonth < 0){ viewMonth = 11; viewYear--; } if(viewMonth > 11){ viewMonth = 0; viewYear++; } draw(); }));
  $$('[data-action="addEvent"]').forEach(btn => btn.addEventListener('click', () => openEventModal(selectedDate)));
  draw();
}

function supplies(){
  layout(`
    ${topbar('Bestellen', false, `<button class="icon-btn pressable" data-action="addSupply">${ICONS.plus}</button>`)}
    <div class="search">${ICONS.search}<input id="supplySearch" placeholder="Suchen"></div>
    <div class="filters"><button class="filter active pressable" data-sfilter="open">Offen</button><button class="filter pressable" data-sfilter="ordered">Bestellt</button><button class="filter pressable" data-sfilter="all">Alle</button></div>
    <div id="supplyList" class="list"></div>
  `);
  let filter = 'open';
  const render = () => {
    const q = $('#supplySearch').value.toLowerCase();
    const list = state.supplies.filter(s => (filter === 'all' || (filter === 'open' ? !s.ordered : s.ordered)) && s.name.toLowerCase().includes(q));
    $('#supplyList').innerHTML = list.length ? list.map(s => `<div class="card supply-card pressable" data-supply-edit="${s.id}">${s.photo ? `<img class="thumb" src="${photoSrc(s.photo)}">` : `<div class="thumb placeholder">${ICONS.bag}</div>`}<div><strong>${escapeHTML(s.name)}</strong><br><small>Menge: ${escapeHTML(s.amount)}</small></div><button class="secondary-btn pressable" data-supply-toggle="${s.id}">${s.ordered ? 'Offen' : 'Bestellt'}</button></div>`).join('') : `<div class="card empty">Keine Einträge.</div>`;
    $$('[data-supply-toggle]').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); const s = state.supplies.find(x => x.id === btn.dataset.supplyToggle); s.ordered = !s.ordered; saveState(); toast(s.ordered ? 'Als bestellt markiert' : 'Wieder offen'); render(); }));
    $$('[data-supply-edit]').forEach(card => card.addEventListener('click', () => openEditSupplyModal(card.dataset.supplyEdit)));
    bindPressables();
  };
  $('#supplySearch').addEventListener('input', render);
  $$('[data-sfilter]').forEach(btn => btn.addEventListener('click', () => { $$('[data-sfilter]').forEach(x => x.classList.remove('active')); btn.classList.add('active'); filter = btn.dataset.sfilter; render(); }));
  $('[data-action="addSupply"]').addEventListener('click', openSupplyModal);
  render();
}

function prices(){
  layout(`
    ${topbar('Preise & Angebote', true, `<button class="icon-btn pressable" data-action="addPrice">${ICONS.plus}</button>`)}
    <div class="tabs"><button class="tab active pressable" data-tab="prices">Preise</button><button class="tab pressable" data-tab="offers">Angebote</button></div>
    <div class="search compact-search">${ICONS.search}<input id="priceSearch" placeholder="Suchen"></div>
    <div id="priceContent"></div>
  `);
  let tab = 'prices';
  const render = () => {
    const q = $('#priceSearch').value.toLowerCase().trim();
    if(tab === 'prices'){
      const filtered = state.prices.filter(p => p.name.toLowerCase().includes(q));
      $('#priceContent').innerHTML = `<div class="list">${filtered.length ? filtered.map(p => `<div class="card price-card">${p.photo ? `<img class="thumb" src="${photoSrc(p.photo)}">` : `<div class="thumb placeholder">${ICONS.tag}</div>`}<div><strong>${escapeHTML(p.name)}</strong><br><small>Standardpreis</small></div><div class="price-value">${moneyMaybe(p.price)}</div></div>`).join('') : `<div class="card empty">Keine Preise gefunden.</div>`}</div>`;
    }else{
      const filtered = state.offers.filter(a => a.name.toLowerCase().includes(q));
      $('#priceContent').innerHTML = `<div class="list">${filtered.length ? filtered.map(a => `<div class="card price-card">${a.photo ? `<img class="thumb" src="${photoSrc(a.photo)}">` : `<div class="thumb placeholder">${ICONS.tag}</div>`}<div><strong>${escapeHTML(a.name)}</strong><br><small>Gültig bis ${fmtDate(a.valid)}</small></div><div class="price-value">${moneyMaybe(a.price)}</div></div>`).join('') : `<div class="card empty">Keine Angebote gefunden.</div>`}</div>`;
    }
  };
  $('#priceSearch').addEventListener('input', render);
  $$('.tab').forEach(btn => btn.addEventListener('click', () => { $$('.tab').forEach(x => x.classList.remove('active')); btn.classList.add('active'); tab = btn.dataset.tab; render(); }));
  $('[data-action="addPrice"]').addEventListener('click', () => openPriceModal(tab));
  render();
}

function customers(){
  layout(`
    ${topbar('Kunden', true, `<button class="top-text-btn pressable" data-action="addCustomer">Neu</button>`)}
    <div class="search">${ICONS.search}<input id="customerSearch" placeholder="Name, Firma, Nummer, E-Mail …"></div>
    <div id="customerList" class="list"></div>
  `);
  const render = () => {
    const q = String($('#customerSearch').value || '').toLocaleLowerCase('de-DE').trim();
    const list = state.customers.filter(c => `${c.name} ${c.phone} ${c.email} ${c.address}`.toLocaleLowerCase('de-DE').includes(q));
    $('#customerList').innerHTML = list.length ? list.map(c => `<button class="card customer-card pressable" data-customer-edit="${c.id}"><div class="customer-avatar">${ICONS.user}</div><div class="customer-main"><strong>${escapeHTML(c.name || c.phone || c.email || 'Kunde')}</strong>${c.phone ? `<span>${escapeHTML(c.phone)}</span>` : ''}${c.email ? `<small>${escapeHTML(c.email)}</small>` : ''}</div><span class="chevron">›</span></button>`).join('') : `<div class="card empty">Keine Kunden gefunden.</div>`;
    $$('[data-customer-edit]').forEach(card => card.addEventListener('click', () => openEditCustomerModal(card.dataset.customerEdit)));
    bindPressables();
  };
  $('#customerSearch').addEventListener('input', render);
  $('[data-action="addCustomer"]').addEventListener('click', openCustomerModal);
  render();
}

function cloudAccountHTML(){
  if(!cloudConfigured){
    return `<div class="card cloud-card">
      <div class="cloud-head">${ICONS.cloud}<div><strong>Cloud-Konto</strong><small data-cloud-status>${cloudStatusText()}</small></div></div>
      <p class="small-note">Für Konten und Geräte-Sync muss einmal der mitgelieferte Cloudflare Worker eingerichtet werden. Danach reicht die Worker-Adresse in <b>cloud-config.js</b>.</p>
    </div>`;
  }
  if(currentUser){
    return `<div class="card cloud-card">
      <div class="cloud-head">${ICONS.cloud}<div class="grow"><strong>Cloud-Konto</strong><small>${escapeHTML(currentUser.email || '')}</small></div><span class="sync-pill" data-cloud-status>${cloudStatusText()}</span></div>
      <div class="cloud-actions"><button class="secondary-btn pressable" data-action="cloudSync">Jetzt synchronisieren</button><button class="secondary-btn pressable" data-action="cloudLogout">Abmelden</button></div>
    </div>`;
  }
  return `<div class="card cloud-card">
    <div class="cloud-head">${ICONS.cloud}<div><strong>Cloud-Konto</strong><small data-cloud-status>${cloudStatusText()}</small></div></div>
    <form id="cloudLoginForm" class="form cloud-form">
      <div class="field"><label>E-Mail</label><input name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label>Passwort</label><input name="password" type="password" autocomplete="current-password" minlength="8" required></div>
      <div class="cloud-actions"><button class="primary-btn pressable" type="submit">Anmelden</button><button class="secondary-btn pressable" type="button" data-action="cloudSignup">Konto erstellen</button></div>
    </form>
  </div>`;
}

function more(){
  layout(`
    ${topbar('Mehr')}
    <div class="section-head"><h2>Cloud & Konto</h2></div>
    ${cloudAccountHTML()}
    <div class="section-head"><h2>Verwaltung</h2></div>
    <div class="card mini-list more-list">
      <button class="mini-row full-row pressable" data-nav="customers"><span class="grow"><b>Kunden</b><br><small>Name/Firma, Telefon, Adresse und E-Mail</small></span><span>›</span></button>
      <button class="mini-row full-row pressable" data-nav="prices"><span class="grow"><b>Preise & Angebote</b><br><small>Standardpreise und laufende Angebote</small></span><span>›</span></button>
      <button class="mini-row full-row pressable" data-action="exportAll"><span class="grow"><b>Kalender exportieren</b><br><small>Als .ics Datei öffnen</small></span><span>›</span></button>
    </div>
    <div class="section-head"><h2>Einstellungen</h2></div>
    <div class="card settings-card" style="padding:14px">
      <div class="setting-row"><span>Farbthema</span><div class="palette">${['beige','sand','rose','sage'].map(t => `<button class="swatch pressable ${state.settings.theme===t?'active':''}" data-theme="${t}"></button>`).join('')}</div></div>
      <div class="setting-row"><span>Beispieldaten</span><button class="ghost-btn pressable danger-btn" data-action="reset">Zurücksetzen</button></div>
    </div>
  `);
  $$('[data-theme]').forEach(btn => btn.addEventListener('click', () => { state.settings.theme = btn.dataset.theme; saveState(); setTheme(btn.dataset.theme); toast('Theme geändert'); more(); }));
  $('[data-action="exportAll"]').addEventListener('click', downloadICSAll);
  $('[data-action="reset"]').addEventListener('click', () => { if(confirm('Beispieldaten wirklich zurücksetzen?')){ state = normalizeStateShape(structuredClone(defaults)); saveState(); setTheme(state.settings.theme); scheduleReminderChecks(); home(); } });

  $('#cloudLoginForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try{
      await cloudSignIn(String(f.get('email')||'').trim(), String(f.get('password')||''));
      toast('Angemeldet und synchronisiert');
      more();
    }catch(err){ toast(err.message || 'Anmeldung fehlgeschlagen'); }
  });
  $('[data-action="cloudSignup"]')?.addEventListener('click', async () => {
    const form = $('#cloudLoginForm');
    if(!form?.reportValidity()) return;
    const f = new FormData(form);
    try{
      await cloudSignUp(String(f.get('email')||'').trim(), String(f.get('password')||''));
      toast('Konto erstellt und synchronisiert');
      more();
    }catch(err){ toast(err.message || 'Konto konnte nicht erstellt werden'); }
  });
  $('[data-action="cloudSync"]')?.addEventListener('click', async () => { await pushCloudState(); toast(cloudSyncState === 'synced' ? 'Cloud synchronisiert' : 'Sync fehlgeschlagen'); more(); });
  $('[data-action="cloudLogout"]')?.addEventListener('click', async () => { await cloudSignOut(); toast('Abgemeldet'); more(); });
}

function openEventModal(date){ modal = {type:'event', date}; renderCurrent(); }
function openEditEventModal(id){ modal = {type:'editEvent', id}; renderCurrent(); }
function openSupplyModal(){ modal = {type:'supply'}; renderCurrent(); }
function openEditSupplyModal(id){ modal = {type:'editSupply', id}; renderCurrent(); }
function openCustomerModal(){ modal = {type:'customer'}; renderCurrent(); }
function openEditCustomerModal(id){ modal = {type:'editCustomer', id}; renderCurrent(); }
function openPriceModal(tab='prices'){ modal = {type:'price', tab}; renderCurrent(); }
function openEditOrder(o){ modal = {type:'editOrder', id:o.id}; renderCurrent(); }
function openReminderModal(o){ modal = {type:'reminder', id:o.id}; renderCurrent(); }

function bindOrderCards(){ $$('[data-order]').forEach(card => card.addEventListener('click', () => { route = {page:'detail', id:card.dataset.order}; detail(card.dataset.order); })); }
function bindPressables(){ $$('.pressable').forEach(el => { el.addEventListener('touchstart', () => el.classList.add('pressed'), {passive:true}); ['touchend','touchcancel','mouseup','mouseleave'].forEach(evt => el.addEventListener(evt, () => el.classList.remove('pressed'))); }); }
function bindModal(){
  if(!modal) return;
  $$('[data-close]').forEach(btn => btn.addEventListener('click', () => { modal = null; renderCurrent(); }));
  $('.modal-backdrop')?.addEventListener('click', e => { if(e.target.classList.contains('modal-backdrop')){ modal = null; renderCurrent(); } });

  if(modal.type === 'event'){
    $('#eventForm').addEventListener('submit', e => {
      e.preventDefault(); const f = new FormData(e.currentTarget);
      state.events.push({id:uid(), date:f.get('date'), time:f.get('time'), title:String(f.get('title')||'').trim(), note:String(f.get('note')||'').trim()});
      saveState(); modal = null; selectedDate = f.get('date'); toast('Termin gespeichert'); calendar();
    });
  }
  if(modal.type === 'editEvent'){
    const item = state.events.find(x => x.id === modal.id);
    $('#editEventForm').addEventListener('submit', e => {
      e.preventDefault(); const f = new FormData(e.currentTarget);
      item.title = String(f.get('title')||'').trim(); item.date = f.get('date'); item.time = f.get('time'); item.note = String(f.get('note')||'').trim();
      selectedDate = item.date; saveState(); modal = null; toast('Termin aktualisiert'); calendar();
    });
    $('[data-action="deleteEvent"]').addEventListener('click', () => {
      if(confirm('Termin wirklich löschen?')){ state.events = state.events.filter(x => x.id !== item.id); saveState(); modal = null; toast('Termin gelöscht'); calendar(); }
    });
  }
  if(modal.type === 'supply'){
    let photo = '';
    $('#supplyPhoto').addEventListener('change', async e => { const file = e.target.files[0]; if(file){ photo = await compressImage(file); $('#supplyPreview').innerHTML = `<img class="photo" src="${photo}">`; } });
    $('#supplyForm').addEventListener('submit', e => {
      e.preventDefault(); const f = new FormData(e.currentTarget);
      state.supplies.unshift({id:uid(), name:String(f.get('name')||'').trim(), amount:String(f.get('amount')||'').trim(), photo, ordered:false});
      saveState(); modal = null; toast('Zu Bestellen hinzugefügt'); supplies();
    });
  }
  if(modal.type === 'editSupply'){
    const s = state.supplies.find(x => x.id === modal.id);
    let photo = s.photo || '';
    $('#editSupplyPhoto').addEventListener('change', async e => { const file = e.target.files[0]; if(file){ photo = await compressImage(file); $('#editSupplyPreview').innerHTML = `<img class="photo" src="${photo}">`; } });
    $('#editSupplyForm').addEventListener('submit', e => {
      e.preventDefault(); const f = new FormData(e.currentTarget);
      s.name = String(f.get('name')||'').trim(); s.amount = String(f.get('amount')||'').trim(); s.photo = photo; s.ordered = !!f.get('ordered');
      saveState(); modal = null; toast('Bestellung aktualisiert'); supplies();
    });
    $('[data-action="deleteSupply"]').addEventListener('click', () => {
      if(confirm('Eintrag wirklich löschen?')){ state.supplies = state.supplies.filter(x => x.id !== s.id); saveState(); modal = null; toast('Eintrag gelöscht'); supplies(); }
    });
  }
  if(modal.type === 'customer'){
    $('#customerForm').addEventListener('submit', e => {
      e.preventDefault(); const f = new FormData(e.currentTarget);
      const c = {id:uid(), name:String(f.get('name')||'').trim(), phone:String(f.get('phone')||'').trim(), email:String(f.get('email')||'').trim(), address:String(f.get('address')||'').trim(), note:String(f.get('note')||'').trim()};
      if(!c.name && !c.phone && !c.email){ toast('Bitte mindestens Name, Nummer oder E-Mail eintragen'); return; }
      state.customers.unshift(c); saveState(); modal = null; toast('Kunde gespeichert'); customers();
    });
  }
  if(modal.type === 'editCustomer'){
    const c = state.customers.find(x => x.id === modal.id);
    $('#editCustomerForm').addEventListener('submit', e => {
      e.preventDefault(); const f = new FormData(e.currentTarget);
      c.name=String(f.get('name')||'').trim(); c.phone=String(f.get('phone')||'').trim(); c.email=String(f.get('email')||'').trim(); c.address=String(f.get('address')||'').trim(); c.note=String(f.get('note')||'').trim();
      if(!c.name && !c.phone && !c.email){ toast('Bitte mindestens Name, Nummer oder E-Mail eintragen'); return; }
      for(const o of state.orders.filter(o => o.customerId === c.id)){ if(c.name) o.name = c.name; if(c.phone) o.phone = c.phone; }
      saveState(); modal = null; toast('Kunde aktualisiert'); customers();
    });
    $('[data-action="deleteCustomer"]').addEventListener('click', () => {
      if(confirm('Kunde wirklich löschen?')){ state.customers = state.customers.filter(x => x.id !== c.id); state.orders.forEach(o => { if(o.customerId === c.id) o.customerId = null; }); saveState(); modal = null; toast('Kunde gelöscht'); customers(); }
    });
  }
  if(modal.type === 'price'){
    let photo = '';
    $('#pricePhoto').addEventListener('change', async e => { const file = e.target.files[0]; if(file){ photo = await compressImage(file); $('#pricePreview').innerHTML = `<img class="photo" src="${photo}">`; } });
    $('#priceForm').addEventListener('submit', e => {
      e.preventDefault(); const f = new FormData(e.currentTarget);
      const item = {id:uid(), name:String(f.get('name')||'').trim(), price:parseOptionalPrice(f.get('price')), photo};
      if(f.get('kind') === 'offers') state.offers.unshift({...item, valid:f.get('valid') || '2026-12-31'}); else state.prices.unshift(item);
      saveState(); modal = null; toast('Gespeichert'); prices();
    });
  }
  if(modal.type === 'reminder'){
    const o = state.orders.find(x => x.id === modal.id);
    $('#reminderForm').addEventListener('submit', async e => {
      e.preventDefault(); const f = new FormData(e.currentTarget);
      o.reminder = true; o.reminderAt = `${f.get('date')}T${f.get('time')}:00`; o.reminded = false;
      if('Notification' in window){ try{ if(Notification.permission !== 'granted') await Notification.requestPermission(); }catch(err){} }
      saveState(); scheduleReminderChecks(); modal = null; toast('Erinnerung gespeichert'); detail(o.id);
    });
    $('[data-action="removeReminder"]')?.addEventListener('click', () => { o.reminder = false; o.reminderAt = null; o.reminded = false; saveState(); modal = null; scheduleReminderChecks(); toast('Erinnerung entfernt'); detail(o.id); });
  }
  if(modal.type === 'editOrder'){
    const o = state.orders.find(x => x.id === modal.id);
    let locationPhoto = o.locationPhoto || '';
    $('#editLocationPhoto').addEventListener('change', async e => { const file = e.target.files[0]; if(file){ locationPhoto = await compressImage(file); $('#editLocationPreview').innerHTML = `<img class="photo" src="${locationPhoto}">`; } });
    $('#editOrderForm').addEventListener('submit', e => {
      e.preventDefault(); const f = new FormData(e.currentTarget);
      o.name = String(f.get('name')||'').trim(); o.phone = String(f.get('phone')||'').trim(); o.due = f.get('due'); o.price = parseOptionalPrice(f.get('price')); o.location = String(f.get('location')||'').trim(); o.locationPhoto = locationPhoto; o.text = String(f.get('text')||'').trim();
      saveState(); modal = null; toast('Auftrag aktualisiert'); detail(o.id);
    });
    $('[data-action="deleteOrder"]').addEventListener('click', () => {
      if(confirm('Auftrag wirklich löschen?')){ state.orders = state.orders.filter(x => x.id !== o.id); saveState(); modal = null; toast('Auftrag gelöscht'); route = {page:'orders'}; orders(); }
    });
  }
}

function bindGlobal(){
  $$('[data-nav]').forEach(btn => btn.addEventListener('click', () => go(btn.dataset.nav)));
  $$('[data-back]').forEach(btn => btn.addEventListener('click', () => { if(route.page === 'detail') go('orders'); else if(route.page === 'prices' || route.page === 'customers') go('more'); else go('home'); }));
  bindOrderCards(); bindModal(); bindPressables();
}
function go(page){
  if(page === 'new'){ route = {page:'new'}; return newOrder(); }
  if(page === 'home'){ route = {page}; return home(); }
  if(page === 'calendar'){ route = {page}; return calendar(); }
  if(page === 'orders'){ route = {page}; return orders(); }
  if(page === 'supplies'){ route = {page}; return supplies(); }
  if(page === 'more'){ route = {page}; return more(); }
  if(page === 'prices'){ route = {page}; return prices(); }
  if(page === 'customers'){ route = {page}; return customers(); }
}
function renderCurrent(){
  if(route.page === 'detail') detail(route.id);
  else if(route.page === 'new') newOrder();
  else if(route.page === 'calendar') calendar();
  else if(route.page === 'orders') orders();
  else if(route.page === 'supplies') supplies();
  else if(route.page === 'more') more();
  else if(route.page === 'prices') prices();
  else if(route.page === 'customers') customers();
  else home();
}

async function compressImage(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 800, scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas'); c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', .68));
      };
      img.onerror = reject; img.src = reader.result;
    };
    reader.onerror = reject; reader.readAsDataURL(file);
  });
}
function icsEscape(s=''){ return String(s).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;'); }
function toICSDate(date, time='09:00'){ return date.replaceAll('-', '') + 'T' + (time || '09:00').replace(':', '') + '00'; }
function downloadBlob(text, type, name){ const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], {type})); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
function downloadICS(ev){
  const start = toICSDate(ev.date, ev.time || '09:00');
  const endDate = new Date(ev.date + 'T' + (ev.time || '09:00') + ':00'); endDate.setHours(endDate.getHours() + 1);
  const end = endDate.getFullYear() + String(endDate.getMonth()+1).padStart(2,'0') + String(endDate.getDate()).padStart(2,'0') + 'T' + String(endDate.getHours()).padStart(2,'0') + String(endDate.getMinutes()).padStart(2,'0') + '00';
  const text = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Auftragshelfer//DE\nBEGIN:VEVENT\nUID:${uid()}@auftragshelfer\nDTSTART:${start}\nDTEND:${end}\nSUMMARY:${icsEscape(ev.title)}\nDESCRIPTION:${icsEscape(ev.note || '')}\nEND:VEVENT\nEND:VCALENDAR`;
  downloadBlob(text, 'text/calendar;charset=utf-8', 'termin.ics');
}
function downloadICSAll(){
  const events = [...state.events, ...state.orders.map(o => ({date:o.due, time:'09:00', title:`Auftrag: ${o.name}`, note:o.text}))];
  const body = events.map(ev => `BEGIN:VEVENT\nUID:${uid()}@auftragshelfer\nDTSTART:${toICSDate(ev.date, ev.time || '09:00')}\nDURATION:PT1H\nSUMMARY:${icsEscape(ev.title)}\nDESCRIPTION:${icsEscape(ev.note || '')}\nEND:VEVENT`).join('\n');
  downloadBlob(`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Auftragshelfer//DE\n${body}\nEND:VCALENDAR`, 'text/calendar;charset=utf-8', 'auftragshelfer-kalender.ics');
}

function showReminderNotification(order){
  const title = `Erinnerung: ${order.name}`;
  const body = `${(order.text || 'Auftrag').split('\n')[0]} · fällig bis ${fmtDate(order.due)}`;
  if('Notification' in window && Notification.permission === 'granted'){
    try{ new Notification(title, { body }); }
    catch(err){ toast(title); }
  }else{
    toast(title);
  }
}
function runReminderCheck(){
  const now = Date.now();
  let changed = false;
  state.orders.forEach(order => {
    if(order.reminder && order.reminderAt && !order.reminded){
      const t = new Date(order.reminderAt).getTime();
      if(!Number.isNaN(t) && t <= now){ order.reminded = true; changed = true; showReminderNotification(order); }
    }
  });
  if(changed) saveState();
}
function scheduleReminderChecks(){
  if(reminderTimer) clearInterval(reminderTimer);
  reminderTimer = setInterval(runReminderCheck, 30000);
  setTimeout(runReminderCheck, 1000);
}
window.addEventListener('focus', runReminderCheck);
document.addEventListener('visibilitychange', () => { if(!document.hidden) runReminderCheck(); });
if('serviceWorker' in navigator){ window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {})); }
scheduleReminderChecks();
home();
initCloud();
