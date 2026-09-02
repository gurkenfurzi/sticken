
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const fmtDate = (s) => {
  if(!s) return "";
  const d = new Date(s+"T12:00:00");
  return new Intl.DateTimeFormat("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"}).format(d);
};
const money = n => new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"}).format(Number(n||0));
const todayISO = () => new Date().toISOString().slice(0,10);
const uid = () => Math.random().toString(36).slice(2)+Date.now().toString(36);

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
  pin:`<svg class="icon" viewBox="0 0 24 24"><path d="M12 21s6-5 6-11a6 6 0 1 0-12 0c0 6 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/></svg>`,
  tag:`<svg class="icon" viewBox="0 0 24 24"><path d="m3 12 9 9 9-9-9-9H3v9Z"/><circle cx="8" cy="8" r="1"/></svg>`,
  send:`<svg class="icon" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/></svg>`,
  check:`<svg class="icon" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>`,
  clock:`<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>`,
  trash:`<svg class="icon" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14"/></svg>`
};

const defaults = {
  orders:[
    {id:"o1",name:"Frigo Trans",phone:"",accepted:"2025-05-10",due:todayISO(),price:120,location:"Regal A",text:"Dubbeglas mit Druck",status:"progress",photos:[],informed:false,ready:false,reminder:true},
    {id:"o2",name:"Klara Meier",phone:"0172 1234567",accepted:"2025-05-12",due:new Date(Date.now()+86400000).toISOString().slice(0,10),price:42,location:"Regal B · Fach 2",text:"1× Schorli Kuscheltier (braun) mit Name „Klara“ auf dem Shirt in weiß.\nBitte hochwertig besticken, Schrift mittig und gut lesbar.",status:"progress",photos:[],informed:false,ready:false,reminder:true},
    {id:"o3",name:"Sportverein Süd",phone:"",accepted:"2025-05-13",due:new Date(Date.now()+3*86400000).toISOString().slice(0,10),price:150,location:"Pressentisch",text:"Shirts mit Druck",status:"open",photos:[],informed:false,ready:false,reminder:false},
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
    {id:"p4",name:"Jacke mit Stick",price:59,photo:""},
    {id:"p5",name:"Schorli Kuscheltier",price:42,photo:""}
  ],
  offers:[
    {id:"a1",name:"5 Dubbegläser mit Druck",price:50,valid:"2026-12-31"},
    {id:"a2",name:"10 Shirts mit Druck",price:120,valid:"2026-12-31"}
  ],
  events:[
    {id:"e1",date:todayISO(),time:"09:00",title:"Frigo Trans – fällig",note:"Dubbeglas mit Druck",type:"order"},
    {id:"e2",date:todayISO(),time:"11:00",title:"Kunde holt ab",note:"Klara Meier",type:"pickup"},
    {id:"e3",date:todayISO(),time:"14:00",title:"Lieferung",note:"Transferfolie & Dubbegläser",type:"delivery"}
  ],
  settings:{theme:"beige"}
};

let state = loadState();
let route = {page:"home", id:null};
let selectedDate = todayISO();
let modal = null;

function loadState(){
  try{
    const saved = JSON.parse(localStorage.getItem("auftragshelfer"));
    return saved ? {...defaults,...saved,settings:{...defaults.settings,...(saved.settings||{})}} : structuredClone(defaults);
  }catch(e){return structuredClone(defaults)}
}
function saveState(){
  localStorage.setItem("auftragshelfer",JSON.stringify(state));
}
function setTheme(name){
  const root = document.documentElement;
  const themes = {
    beige:{accent:"#b8895f",accent2:"#d9b590",strong:"#9d6f47",bg:"#f8f2e9",surface2:"#f3e8da"},
    sand:{accent:"#b39a78",accent2:"#d8c5aa",strong:"#8f7657",bg:"#f6f1e9",surface2:"#ede4d6"},
    rose:{accent:"#b98275",accent2:"#dfb7ae",strong:"#9e6659",bg:"#faf1ee",surface2:"#f4e1dc"},
    sage:{accent:"#86927a",accent2:"#bec9b4",strong:"#6e7d66",bg:"#f3f5ef",surface2:"#e4e9de"}
  };
  const t=themes[name]||themes.beige;
  root.style.setProperty("--accent",t.accent);
  root.style.setProperty("--accent-2",t.accent2);
  root.style.setProperty("--accent-strong",t.strong);
  root.style.setProperty("--bg",t.bg);
  root.style.setProperty("--surface-2",t.surface2);
}
setTheme(state.settings.theme);

function nav(){
  const items=[
    ["home","Übersicht","home"],
    ["calendar","Kalender","calendar"],
    ["new","", "plus"],
    ["orders","Aufträge","orders"],
    ["supplies","Bestellen","bag"],
  ];
  return `<nav class="nav">${items.map(([p,l,i])=>`
    <button data-nav="${p}" class="${route.page===p?"active":""}">
      ${p==="new"?`<span class="plus">${ICONS.plus}</span>`:ICONS[i]}
      ${l?`<span>${l}</span>`:""}
    </button>`).join("")}
  </nav>`;
}

function layout(content){
  $("#app").innerHTML=`<main class="app-shell"><section class="screen">${content}</section>${nav()}${modal?modalHTML():""}</main>`;
  bindGlobal();
}
function topbar(title,back=false,actions=""){
  return `<div class="topbar">
    <div>${back?`<button class="icon-btn" data-back>${ICONS.back}</button>`:""}</div>
    <h1>${title}</h1>
    <div class="top-actions">${actions}</div>
  </div>`;
}
function statusLabel(s){return ({open:"Offen",progress:"In Arbeit",done:"Fertig"})[s]||"Offen"}
function statusBadge(s){return `<span class="badge ${s}">${statusLabel(s)}</span>`}
function dueLabel(date){
  const t=todayISO();
  if(date===t) return "Heute";
  const d=(new Date(date+"T12:00:00")-new Date(t+"T12:00:00"))/86400000;
  if(d===1) return "Morgen";
  if(d<0) return "Überfällig";
  return fmtDate(date);
}
function orderThumb(o){
  if(o.photos?.length) return `<img class="thumb" src="${o.photos[0]}" alt="">`;
  return `<div class="thumb placeholder">${ICONS.orders}</div>`;
}
function orderCard(o){
  return `<div class="card order-card" data-order="${o.id}">
    ${orderThumb(o)}
    <div class="order-main">
      <strong>${escapeHTML(o.name)}</strong>
      <div class="desc">${escapeHTML(o.text.split("\n")[0]||"Auftrag")}</div>
      <div class="order-meta"><span>${dueLabel(o.due)}</span>${statusBadge(o.status)}</div>
    </div>
    <div class="order-side"><span class="price">${money(o.price)}</span></div>
  </div>`;
}

function home(){
  const t=todayISO();
  const today = state.orders.filter(o=>o.due===t && o.status!=="done").length;
  const progress = state.orders.filter(o=>o.status==="progress").length;
  const done = state.orders.filter(o=>o.status==="done").length;
  const upcoming=[...state.orders].filter(o=>o.status!=="done").sort((a,b)=>a.due.localeCompare(b.due)).slice(0,3);
  layout(`
    ${topbar("Übersicht",false,`<button class="icon-btn" data-action="reminders">${ICONS.bell}</button>`)}
    <button class="quick-cta" data-nav="new">${ICONS.plus}<span>Schneller Auftrag</span></button>
    <div class="metrics">
      <div class="metric today"><div class="label">Heute fällig</div><div class="num">${today}</div></div>
      <div class="metric progress"><div class="label">In Arbeit</div><div class="num">${progress}</div></div>
      <div class="metric done"><div class="label">Fertig</div><div class="num">${done}</div></div>
    </div>

    <div class="section-head"><h2>Nächste fällige Aufträge</h2><button class="ghost-btn" data-nav="orders">Alle anzeigen</button></div>
    <div class="list">${upcoming.length?upcoming.map(orderCard).join(""):`<div class="card empty">Keine offenen Aufträge 🎉</div>`}</div>

    <div class="section-head"><h2>Bestellen</h2><button class="ghost-btn" data-nav="supplies">Alle anzeigen</button></div>
    <div class="card mini-list">
      ${state.supplies.filter(x=>!x.ordered).slice(0,3).map(x=>`<div class="mini-row"><span class="grow">${escapeHTML(x.name)}</span><small>${escapeHTML(x.amount)}</small></div>`).join("") || `<div class="empty">Nichts offen</div>`}
    </div>
  `);
}

function newOrder(){
  const now=todayISO();
  layout(`
    ${topbar("Schneller Auftrag",true)}
    <form id="orderForm" class="form">
      <div class="field"><label>Name / Firma</label><input name="name" autocomplete="name" placeholder="z. B. Klara Meier" required></div>
      <div class="field"><label>Telefonnummer</label><input name="phone" inputmode="tel" placeholder="z. B. 0172 1234567"></div>
      <div class="grid2">
        <div class="field"><label>Angenommen am</label><input type="date" name="accepted" value="${now}"></div>
        <div class="field"><label>Fertig bis</label><input type="date" name="due" value="${now}" required></div>
      </div>
      <div class="grid2">
        <div class="field"><label>Preis</label><input name="price" inputmode="decimal" placeholder="0,00 €"></div>
        <div class="field"><label>Wo liegt es?</label><input name="location" placeholder="z. B. Regal B · Fach 2"></div>
      </div>

      <label class="photo-picker">
        <input id="photoInput" type="file" accept="image/*" multiple>
        <div class="photo-trigger">${ICONS.camera}<span><b>Fotos hinzufügen</b><br><span class="small-note">Mehrere Bilder sind möglich</span></span></div>
        <div id="newPhotos" class="photos"></div>
      </label>

      <div class="field">
        <label>Auftrag</label>
        <textarea name="text" id="orderText" rows="4" placeholder="Einfach alles reinschreiben – das Feld wächst automatisch mit." required></textarea>
      </div>
      <label class="small-note"><input type="checkbox" name="reminder" checked> Erinnerung aktivieren</label>
      <button class="primary-btn" type="submit">Auftrag speichern</button>
    </form>
  `);
  const ta=$("#orderText");
  const grow=()=>{ta.style.height="auto";ta.style.height=Math.max(110,ta.scrollHeight)+"px"};
  ta.addEventListener("input",grow);
  let photos=[];
  $("#photoInput").addEventListener("change",async e=>{
    const files=[...e.target.files];
    for(const f of files){photos.push(await compressImage(f));}
    $("#newPhotos").innerHTML=photos.map(src=>`<img class="photo" src="${src}">`).join("");
  });
  $("#orderForm").addEventListener("submit",e=>{
    e.preventDefault();
    const fd=new FormData(e.currentTarget);
    const o={
      id:uid(),name:fd.get("name").trim(),phone:fd.get("phone").trim(),
      accepted:fd.get("accepted"),due:fd.get("due"),price:parseFloat(String(fd.get("price")||"0").replace(",","."))||0,
      location:fd.get("location").trim(),text:fd.get("text").trim(),status:"open",
      photos,informed:false,ready:false,reminder:!!fd.get("reminder")
    };
    state.orders.unshift(o);
    state.events.push({id:uid(),date:o.due,time:"09:00",title:`${o.name} – fällig`,note:o.text.split("\n")[0],type:"order",orderId:o.id});
    saveState(); toast("Auftrag gespeichert"); route={page:"detail",id:o.id}; detail(o.id);
  });
}

function orders(){
  layout(`
    ${topbar("Aufträge",false,`<button class="icon-btn" data-nav="new">${ICONS.plus}</button>`)}
    <div class="search">${ICONS.search}<input id="orderSearch" placeholder="Suchen"></div>
    <div class="filters" id="orderFilters">
      <button class="filter active" data-filter="all">Alle</button>
      <button class="filter" data-filter="open">Offen</button>
      <button class="filter" data-filter="progress">In Arbeit</button>
      <button class="filter" data-filter="done">Fertig</button>
    </div>
    <div id="ordersList" class="list"></div>
  `);
  let filter="all";
  function render(){
    const q=$("#orderSearch").value.toLowerCase().trim();
    const list=state.orders.filter(o=>(filter==="all"||o.status===filter)&&(`${o.name} ${o.text} ${o.location}`.toLowerCase().includes(q)));
    $("#ordersList").innerHTML=list.length?list.map(orderCard).join(""):`<div class="card empty">Keine Aufträge gefunden.</div>`;
    bindOrderCards();
  }
  $("#orderSearch").addEventListener("input",render);
  $$("#orderFilters .filter").forEach(b=>b.addEventListener("click",()=>{
    $$("#orderFilters .filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");filter=b.dataset.filter;render();
  }));
  render();
}

function detail(id){
  const o=state.orders.find(x=>x.id===id); if(!o){route={page:"orders"};return orders()}
  layout(`
    ${topbar("Auftragsdetails",true,`<button class="icon-btn" data-action="editOrder">${ICONS.more}</button>`)}
    <div class="card detail-head">
      <div class="avatar">${escapeHTML((o.name||"?").split(/\s+/).map(x=>x[0]).slice(0,2).join("").toUpperCase())}</div>
      <div class="grow"><strong>${escapeHTML(o.name)}</strong><small>${escapeHTML(o.phone||"Keine Telefonnummer")}</small></div>
      ${o.phone?`<a class="circle-btn" href="tel:${escapeHTML(o.phone)}">${ICONS.phone}</a>`:""}
    </div>

    <div class="card detail-body">
      <h3>Auftrag</h3>
      <div class="detail-text">${escapeHTML(o.text)}</div>
    </div>

    <div class="info-grid">
      <div class="info-box"><small>Fällig bis</small><strong>${fmtDate(o.due)}</strong></div>
      <div class="info-box"><small>Preis</small><strong>${money(o.price)}</strong></div>
      <div class="info-box location-box"><small>Wo liegt es?</small><strong>${escapeHTML(o.location||"Nicht eingetragen")}</strong></div>
    </div>

    <div class="section-head"><h2>Fotos</h2><button class="ghost-btn" data-action="addPhotos">+ Hinzufügen</button></div>
    <div class="photos" id="detailPhotos">
      ${(o.photos||[]).map(src=>`<img class="photo" src="${src}">`).join("")}
      <button class="photo-add" data-action="addPhotos">${ICONS.plus}</button>
    </div>
    <input id="detailPhotoInput" type="file" accept="image/*" multiple hidden>

    <div class="section-head"><h2>Status</h2></div>
    <div class="status-row">
      ${["open","progress","done"].map(s=>`<button class="status-btn ${o.status===s?"active":""}" data-status="${s}">${statusLabel(s)}</button>`).join("")}
    </div>

    <div class="action-row">
      <button class="action-tile ${o.informed?"active":""}" data-action="toggleInformed">${ICONS.send}<span>Kunde informiert</span></button>
      <button class="action-tile ${o.ready?"active":""}" data-action="toggleReady">${ICONS.bag}<span>Abholbereit</span></button>
      <button class="action-tile ${o.reminder?"active":""}" data-action="toggleReminder">${ICONS.bell}<span>Erinnerung</span></button>
    </div>

    <div class="inline-actions">
      <button class="secondary-btn" data-action="icsOrder">${ICONS.calendar} Kalender</button>
      <button class="secondary-btn" data-action="copyOrder">Auftrag kopieren</button>
    </div>
  `);
  $$(".status-btn").forEach(b=>b.addEventListener("click",()=>{
    o.status=b.dataset.status; if(o.status==="done") o.ready=true; saveState(); detail(id);
  }));
  $('[data-action="toggleInformed"]').addEventListener("click",()=>{o.informed=!o.informed;saveState();detail(id)});
  $('[data-action="toggleReady"]').addEventListener("click",()=>{o.ready=!o.ready;saveState();detail(id)});
  $('[data-action="toggleReminder"]').addEventListener("click",()=>{o.reminder=!o.reminder;saveState();detail(id)});
  $('[data-action="copyOrder"]').addEventListener("click",()=>{
    const c={...o,id:uid(),name:o.name+" (Kopie)",accepted:todayISO(),status:"open",informed:false,ready:false};
    state.orders.unshift(c);saveState();toast("Auftrag kopiert");route={page:"detail",id:c.id};detail(c.id)
  });
  $('[data-action="icsOrder"]').addEventListener("click",()=>downloadICS({date:o.due,time:"09:00",title:`Auftrag: ${o.name}`,note:o.text}));
  const input=$("#detailPhotoInput");
  $$('[data-action="addPhotos"]').forEach(b=>b.addEventListener("click",()=>input.click()));
  input.addEventListener("change",async e=>{
    for(const f of [...e.target.files]) o.photos.push(await compressImage(f));
    saveState();detail(id);
  });
  $('[data-action="editOrder"]').addEventListener("click",()=>openEditOrder(o));
}

function calendar(){
  layout(`
    ${topbar("Kalender",false,`<button class="circle-btn" data-action="addEvent">${ICONS.plus}</button>`)}
    <div class="calendar-head"><strong id="monthTitle"></strong><div><button class="icon-btn" data-cal="-1">${ICONS.back}</button> <button class="icon-btn" data-cal="1" style="transform:rotate(180deg)">${ICONS.back}</button></div></div>
    <div id="monthGrid" class="month-grid"></div>
    <div class="section-head"><h2 id="dayTitle"></h2><button class="ghost-btn" data-action="addEvent">+ Termin</button></div>
    <div id="schedule" class="schedule"></div>
  `);
  let base = new Date(selectedDate+"T12:00:00");
  let viewYear=base.getFullYear(), viewMonth=base.getMonth();
  function draw(){
    const first=new Date(viewYear,viewMonth,1), last=new Date(viewYear,viewMonth+1,0);
    $("#monthTitle").textContent=new Intl.DateTimeFormat("de-DE",{month:"long",year:"numeric"}).format(first);
    const names=["Mo","Di","Mi","Do","Fr","Sa","So"];
    let html=names.map(n=>`<div class="day-name">${n}</div>`).join("");
    const mondayIndex=(first.getDay()+6)%7;
    for(let i=0;i<mondayIndex;i++){
      const d=new Date(viewYear,viewMonth,1-(mondayIndex-i));
      html+=`<button class="day muted" data-date="${d.toISOString().slice(0,10)}">${d.getDate()}</button>`;
    }
    for(let d=1;d<=last.getDate();d++){
      const dt=new Date(viewYear,viewMonth,d), iso=dt.toISOString().slice(0,10);
      const has=eventsForDate(iso).length>0;
      html+=`<button class="day ${iso===selectedDate?"selected":""} ${has?"has-events":""}" data-date="${iso}">${d}</button>`;
    }
    const cells=mondayIndex+last.getDate(), tail=(7-(cells%7))%7;
    for(let i=1;i<=tail;i++){
      const d=new Date(viewYear,viewMonth+1,i);
      html+=`<button class="day muted" data-date="${d.toISOString().slice(0,10)}">${d.getDate()}</button>`;
    }
    $("#monthGrid").innerHTML=html;
    $$(".day[data-date]").forEach(b=>b.addEventListener("click",()=>{selectedDate=b.dataset.date;draw();drawSchedule()}));
    drawSchedule();
  }
  function drawSchedule(){
    const d=new Date(selectedDate+"T12:00:00");
    $("#dayTitle").textContent=new Intl.DateTimeFormat("de-DE",{weekday:"long",day:"2-digit",month:"long"}).format(d);
    const ev=eventsForDate(selectedDate).sort((a,b)=>(a.time||"").localeCompare(b.time||""));
    $("#schedule").innerHTML=ev.length?ev.map(e=>`
      <div class="card event-card" data-event="${e.id}">
        <div class="event-time">${escapeHTML(e.time||"")}</div><div class="event-line"></div>
        <div class="event-info"><strong>${escapeHTML(e.title)}</strong><span>${escapeHTML(e.note||"")}</span></div>
        <button class="icon-btn" data-event-ics="${e.id}">${ICONS.calendar}</button>
      </div>`).join(""):`<div class="card empty">Keine Termine an diesem Tag.</div>`;
    $$("[data-event-ics]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();const ev=state.events.find(x=>x.id===b.dataset.eventIcs);downloadICS(ev)}));
  }
  function eventsForDate(date){
    const orderEvents=state.orders.filter(o=>o.due===date).map(o=>({id:"order-"+o.id,date:o.due,time:"09:00",title:o.name+" – fällig",note:o.text.split("\n")[0],orderId:o.id,type:"order"}));
    const map=new Map();
    [...state.events.filter(e=>e.date===date),...orderEvents].forEach(e=>map.set(e.id,e));
    return [...map.values()];
  }
  $$("[data-cal]").forEach(b=>b.addEventListener("click",()=>{viewMonth+=Number(b.dataset.cal);if(viewMonth<0){viewMonth=11;viewYear--}if(viewMonth>11){viewMonth=0;viewYear++}draw()}));
  $$('[data-action="addEvent"]').forEach(b=>b.addEventListener("click",()=>openEventModal(selectedDate)));
  draw();
}

function supplies(){
  layout(`
    ${topbar("Bestellen",false,`<button class="icon-btn" data-action="addSupply">${ICONS.plus}</button>`)}
    <div class="search">${ICONS.search}<input id="supplySearch" placeholder="Suchen"></div>
    <div class="filters">
      <button class="filter active" data-sfilter="open">Offen</button>
      <button class="filter" data-sfilter="ordered">Bestellt</button>
      <button class="filter" data-sfilter="all">Alle</button>
    </div>
    <div id="supplyList" class="list"></div>
  `);
  let filter="open";
  function render(){
    const q=$("#supplySearch").value.toLowerCase();
    const list=state.supplies.filter(s=>(filter==="all"||(filter==="open"?!s.ordered:s.ordered))&&s.name.toLowerCase().includes(q));
    $("#supplyList").innerHTML=list.length?list.map(s=>`
      <div class="card supply-card">
        ${s.photo?`<img class="thumb" src="${s.photo}">`:`<div class="thumb placeholder">${ICONS.bag}</div>`}
        <div><strong>${escapeHTML(s.name)}</strong><br><small>Menge: ${escapeHTML(s.amount)}</small></div>
        <button class="secondary-btn" data-supply-toggle="${s.id}">${s.ordered?"Offen":"Bestellt"}</button>
      </div>`).join(""):`<div class="card empty">Keine Einträge.</div>`;
    $$("[data-supply-toggle]").forEach(b=>b.addEventListener("click",()=>{const s=state.supplies.find(x=>x.id===b.dataset.supplyToggle);s.ordered=!s.ordered;saveState();render()}));
  }
  $("#supplySearch").addEventListener("input",render);
  $$("[data-sfilter]").forEach(b=>b.addEventListener("click",()=>{$$("[data-sfilter]").forEach(x=>x.classList.remove("active"));b.classList.add("active");filter=b.dataset.sfilter;render()}));
  $('[data-action="addSupply"]').addEventListener("click",openSupplyModal);
  render();
}

function more(){
  layout(`
    ${topbar("Mehr")}
    <div class="card mini-list">
      <button class="mini-row" data-nav="prices" style="width:100%;border-left:0;border-right:0;border-top:0;background:transparent;text-align:left"><span class="grow"><b>Preise & Angebote</b><br><small>Standardpreise und laufende Angebote</small></span>›</button>
      <button class="mini-row" data-action="exportAll" style="width:100%;border-left:0;border-right:0;border-top:0;background:transparent;text-align:left"><span class="grow"><b>Kalender verbinden</b><br><small>Alle Termine als Kalenderdatei exportieren</small></span>›</button>
    </div>

    <div class="section-head"><h2>Design</h2></div>
    <div class="card" style="padding:14px">
      <div class="setting-row"><span>Farbthema</span>
        <div class="palette">
          ${["beige","sand","rose","sage"].map(t=>`<button class="swatch ${state.settings.theme===t?"active":""}" data-theme="${t}" aria-label="${t}"></button>`).join("")}
        </div>
      </div>
      <div class="setting-row"><span>Daten</span><button class="ghost-btn danger-btn" data-action="reset">Beispieldaten zurücksetzen</button></div>
    </div>
    <p class="small-note" style="margin-top:14px">Die App speichert deine Daten direkt auf diesem Gerät. Sie funktioniert auch offline, nachdem sie einmal geöffnet wurde.</p>
  `);
  $$("[data-theme]").forEach(b=>b.addEventListener("click",()=>{state.settings.theme=b.dataset.theme;saveState();setTheme(b.dataset.theme);more()}));
  $('[data-action="exportAll"]').addEventListener("click",()=>downloadICSAll());
  $('[data-action="reset"]').addEventListener("click",()=>{if(confirm("Beispieldaten wirklich zurücksetzen?")){state=structuredClone(defaults);saveState();setTheme(state.settings.theme);home()}});
}

function prices(){
  layout(`
    ${topbar("Preise & Angebote",true,`<button class="icon-btn" data-action="addPrice">${ICONS.plus}</button>`)}
    <div class="tabs"><button class="tab active" data-tab="prices">Preise</button><button class="tab" data-tab="offers">Angebote</button></div>
    <div id="priceContent"></div>
  `);
  let tab="prices";
  function render(){
    if(tab==="prices"){
      $("#priceContent").innerHTML=`<div class="list">${state.prices.map(p=>`
        <div class="card price-card">
          ${p.photo?`<img class="thumb" src="${p.photo}">`:`<div class="thumb placeholder">${ICONS.tag}</div>`}
          <div><strong>${escapeHTML(p.name)}</strong><br><small>Standardpreis</small></div>
          <div class="price-value">${money(p.price)}</div>
        </div>`).join("")}</div>`;
    }else{
      $("#priceContent").innerHTML=`<div class="list">${state.offers.map(a=>`
        <div class="card price-card">
          <div class="thumb placeholder">${ICONS.tag}</div>
          <div><strong>${escapeHTML(a.name)}</strong><br><small>Gültig bis ${fmtDate(a.valid)}</small></div>
          <div class="price-value">${money(a.price)}</div>
        </div>`).join("") || `<div class="card empty">Keine Angebote.</div>`}</div>`;
    }
  }
  $$(".tab").forEach(b=>b.addEventListener("click",()=>{$$(".tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");tab=b.dataset.tab;render()}));
  $('[data-action="addPrice"]').addEventListener("click",()=>openPriceModal(tab));
  render();
}

function openEventModal(date){
  modal={type:"event",date};
  renderCurrent();
}
function openSupplyModal(){modal={type:"supply"};renderCurrent()}
function openPriceModal(tab="prices"){modal={type:"price",tab};renderCurrent()}
function openEditOrder(o){modal={type:"editOrder",id:o.id};renderCurrent()}

function modalHTML(){
  if(!modal) return "";
  if(modal.type==="event"){
    return `<div class="modal-backdrop"><div class="modal">
      <div class="modal-head"><h2>Termin eintragen</h2><button class="icon-btn" data-close>×</button></div>
      <form id="eventForm" class="form">
        <div class="field"><label>Titel</label><input name="title" required placeholder="z. B. Kunde holt ab"></div>
        <div class="grid2"><div class="field"><label>Datum</label><input name="date" type="date" value="${modal.date}" required></div><div class="field"><label>Uhrzeit</label><input name="time" type="time" value="10:00"></div></div>
        <div class="field"><label>Notiz</label><textarea name="note" rows="3" style="min-height:75px" placeholder="Optional"></textarea></div>
        <button class="primary-btn">Termin speichern</button>
      </form>
    </div></div>`;
  }
  if(modal.type==="supply"){
    return `<div class="modal-backdrop"><div class="modal">
      <div class="modal-head"><h2>Zu „Bestellen“ hinzufügen</h2><button class="icon-btn" data-close>×</button></div>
      <form id="supplyForm" class="form">
        <div class="field"><label>Artikel</label><input name="name" required placeholder="z. B. Dubbegläser"></div>
        <div class="field"><label>Menge</label><input name="amount" placeholder="z. B. 10 Stk."></div>
        <label class="photo-picker"><input id="supplyPhoto" type="file" accept="image/*"><div class="photo-trigger">${ICONS.camera}<span>Eigenes Foto (optional)</span></div><div id="supplyPreview" class="photos"></div></label>
        <button class="primary-btn">Hinzufügen</button>
      </form>
    </div></div>`;
  }
  if(modal.type==="price"){
    return `<div class="modal-backdrop"><div class="modal">
      <div class="modal-head"><h2>Preis / Angebot hinzufügen</h2><button class="icon-btn" data-close>×</button></div>
      <form id="priceForm" class="form">
        <div class="field"><label>Name</label><input name="name" required placeholder="z. B. Tasche mit Druck"></div>
        <div class="field"><label>Preis</label><input name="price" inputmode="decimal" required placeholder="19,00"></div>
        <div class="field"><label>Art</label><select name="kind"><option value="prices">Preis</option><option value="offers">Angebot</option></select></div>
        <div class="field"><label>Gültig bis (nur Angebot)</label><input name="valid" type="date"></div>
        <button class="primary-btn">Speichern</button>
      </form>
    </div></div>`;
  }
  if(modal.type==="editOrder"){
    const o=state.orders.find(x=>x.id===modal.id);
    return `<div class="modal-backdrop"><div class="modal">
      <div class="modal-head"><h2>Auftrag bearbeiten</h2><button class="icon-btn" data-close>×</button></div>
      <form id="editOrderForm" class="form">
        <div class="field"><label>Name / Firma</label><input name="name" value="${attr(o.name)}" required></div>
        <div class="field"><label>Telefonnummer</label><input name="phone" value="${attr(o.phone)}"></div>
        <div class="grid2"><div class="field"><label>Fertig bis</label><input name="due" type="date" value="${o.due}"></div><div class="field"><label>Preis</label><input name="price" value="${o.price}"></div></div>
        <div class="field"><label>Wo liegt es?</label><input name="location" value="${attr(o.location)}"></div>
        <div class="field"><label>Auftrag</label><textarea name="text">${escapeHTML(o.text)}</textarea></div>
        <button class="primary-btn">Änderungen speichern</button>
        <button type="button" class="secondary-btn danger-btn" data-action="deleteOrder">Auftrag löschen</button>
      </form>
    </div></div>`;
  }
  return "";
}

function bindModal(){
  if(!modal) return;
  $$("[data-close]").forEach(b=>b.addEventListener("click",()=>{modal=null;renderCurrent()}));
  $(".modal-backdrop")?.addEventListener("click",e=>{if(e.target.classList.contains("modal-backdrop")){modal=null;renderCurrent()}});
  if(modal.type==="event"){
    $("#eventForm").addEventListener("submit",e=>{
      e.preventDefault();const f=new FormData(e.currentTarget);
      state.events.push({id:uid(),date:f.get("date"),time:f.get("time"),title:f.get("title").trim(),note:f.get("note").trim(),type:"custom"});
      saveState();selectedDate=f.get("date");modal=null;calendar();toast("Termin gespeichert");
    });
  }
  if(modal.type==="supply"){
    let photo="";
    $("#supplyPhoto").addEventListener("change",async e=>{const f=e.target.files[0];if(f){photo=await compressImage(f);$("#supplyPreview").innerHTML=`<img class="photo" src="${photo}">`}});
    $("#supplyForm").addEventListener("submit",e=>{
      e.preventDefault();const f=new FormData(e.currentTarget);
      state.supplies.unshift({id:uid(),name:f.get("name").trim(),amount:f.get("amount").trim(),photo,ordered:false});saveState();modal=null;supplies();toast("Hinzugefügt");
    });
  }
  if(modal.type==="price"){
    $("#priceForm").addEventListener("submit",e=>{
      e.preventDefault();const f=new FormData(e.currentTarget);const kind=f.get("kind");const item={id:uid(),name:f.get("name").trim(),price:parseFloat(String(f.get("price")).replace(",","."))||0};
      if(kind==="offers"){item.valid=f.get("valid")||"2026-12-31";state.offers.unshift(item)}else state.prices.unshift({...item,photo:""});
      saveState();modal=null;prices();toast("Gespeichert");
    });
  }
  if(modal.type==="editOrder"){
    const o=state.orders.find(x=>x.id===modal.id);
    $("#editOrderForm").addEventListener("submit",e=>{
      e.preventDefault();const f=new FormData(e.currentTarget);
      o.name=f.get("name").trim();o.phone=f.get("phone").trim();o.due=f.get("due");o.price=parseFloat(String(f.get("price")).replace(",","."))||0;o.location=f.get("location").trim();o.text=f.get("text").trim();
      saveState();modal=null;detail(o.id);toast("Auftrag aktualisiert");
    });
    $('[data-action="deleteOrder"]').addEventListener("click",()=>{
      if(confirm("Auftrag wirklich löschen?")){state.orders=state.orders.filter(x=>x.id!==o.id);saveState();modal=null;route={page:"orders"};orders();toast("Auftrag gelöscht")}
    });
  }
}

function bindGlobal(){
  $$("[data-nav]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.nav)));
  $$("[data-back]").forEach(b=>b.addEventListener("click",()=>{if(route.page==="detail")go("orders");else if(route.page==="prices")go("more");else go("home")}));
  bindOrderCards();
  bindModal();
  // Long-press-ish access to More via active screen top action is kept simple:
  if(route.page==="home"){
    $('[data-action="reminders"]')?.addEventListener("click",()=>toast("Erinnerungen sind bei jedem Auftrag einstellbar."));
  }
}
function bindOrderCards(){
  $$("[data-order]").forEach(c=>c.addEventListener("click",()=>{route={page:"detail",id:c.dataset.order};detail(c.dataset.order)}));
}
function go(page){
  if(page==="new"){route={page:"new"};return newOrder()}
  if(page==="home"){route={page};return home()}
  if(page==="calendar"){route={page};return calendar()}
  if(page==="orders"){route={page};return orders()}
  if(page==="supplies"){route={page};return supplies()}
  if(page==="more"){route={page};return more()}
  if(page==="prices"){route={page};return prices()}
}
function renderCurrent(){
  const p=route.page;
  if(p==="detail") detail(route.id);
  else if(p==="new") newOrder();
  else if(p==="calendar") calendar();
  else if(p==="orders") orders();
  else if(p==="supplies") supplies();
  else if(p==="more") more();
  else if(p==="prices") prices();
  else home();
}

function toast(msg){
  document.querySelector(".toast")?.remove();
  const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);
  setTimeout(()=>t.remove(),1800);
}
function escapeHTML(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function attr(s=""){return escapeHTML(s).replace(/"/g,"&quot;")}

async function compressImage(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        const max=1100, scale=Math.min(1,max/Math.max(img.width,img.height));
        const c=document.createElement("canvas");c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);
        c.getContext("2d").drawImage(img,0,0,c.width,c.height);
        resolve(c.toDataURL("image/jpeg",.72));
      };
      img.onerror=reject;img.src=reader.result;
    };
    reader.onerror=reject;reader.readAsDataURL(file);
  });
}
function icsEscape(s=""){return String(s).replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;")}
function toICSDate(date,time="09:00"){
  return date.replaceAll("-","") + "T" + (time||"09:00").replace(":","") + "00";
}
function downloadICS(ev){
  const start=toICSDate(ev.date,ev.time||"09:00");
  const endDate=new Date(ev.date+"T"+(ev.time||"09:00")+":00");endDate.setHours(endDate.getHours()+1);
  const end=endDate.getFullYear()+String(endDate.getMonth()+1).padStart(2,"0")+String(endDate.getDate()).padStart(2,"0")+"T"+String(endDate.getHours()).padStart(2,"0")+String(endDate.getMinutes()).padStart(2,"0")+"00";
  const text=`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Auftragshelfer//DE
BEGIN:VEVENT
UID:${uid()}@auftragshelfer
DTSTART:${start}
DTEND:${end}
SUMMARY:${icsEscape(ev.title)}
DESCRIPTION:${icsEscape(ev.note||"")}
END:VEVENT
END:VCALENDAR`;
  downloadBlob(text,"text/calendar;charset=utf-8","termin.ics");
}
function downloadICSAll(){
  const events=[...state.events,...state.orders.map(o=>({date:o.due,time:"09:00",title:`Auftrag: ${o.name}`,note:o.text}))];
  let body=events.map(ev=>{
    const start=toICSDate(ev.date,ev.time||"09:00");
    return `BEGIN:VEVENT
UID:${uid()}@auftragshelfer
DTSTART:${start}
DURATION:PT1H
SUMMARY:${icsEscape(ev.title)}
DESCRIPTION:${icsEscape(ev.note||"")}
END:VEVENT`;
  }).join("\n");
  downloadBlob(`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Auftragshelfer//DE
${body}
END:VCALENDAR`,"text/calendar;charset=utf-8","auftragshelfer-kalender.ics");
}
function downloadBlob(text,type,name){
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000);
}

if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}))}
home();
