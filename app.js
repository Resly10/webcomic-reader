const demo = [
 {id:"solo",title:"Solo Leveling — Demo",author:"Demo Author",status:"Completed",genres:["Action","Fantasy"],cover:"",desc:"Data demo untuk menguji library dan reader.",chapters:[{name:"Chapter 01",url:""},{name:"Chapter 02",url:""}]},
 {id:"moon",title:"Moonlit Archive — Demo",author:"Demo Author",status:"Ongoing",genres:["Adventure","Mystery"],cover:"",desc:"Contoh judul kedua.",chapters:[{name:"Chapter 01",url:""}]},
 {id:"tower",title:"Tower Chronicle — Demo",author:"Demo Author",status:"Ongoing",genres:["Action","Drama"],cover:"",desc:"Contoh judul ketiga.",chapters:[{name:"Chapter 01",url:""}]}
];

const KEY="webcomic_state_v1";
let state=JSON.parse(localStorage.getItem(KEY)||'null')||{library:[],history:[],theme:"dark",reader:{mode:"webtoon",direction:"ltr",fit:"width",gap:true}};
function save(){localStorage.setItem(KEY,JSON.stringify(state)); updateCount()}
function updateCount(){document.getElementById("libraryCount").textContent=state.library.length}

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function toast(msg){const d=document.createElement("div");d.className="toast";d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
function coverHTML(m){return m.cover?`<img src="${esc(m.cover)}" alt="">`:`<div class="placeholder">📖</div>`}
function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function findManga(id){return demo.find(x=>x.id===id)||state.library.find(x=>x.id===id)}
function card(m){const fav=state.library.includes(m.id);return `<article class="card" onclick="openDetail('${esc(m.id)}')"><div class="cover">${coverHTML(m)}</div><div class="card-body"><div class="title">${esc(m.title)}</div><div class="meta">${esc(m.status||"Unknown")} · ${fav?"★ Library":"Not added"}</div></div></article>`}

function render(view="home"){
  $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  const c=$("#content");
  if(view==="home") c.innerHTML=home();
  if(view==="library") c.innerHTML=library();
  if(view==="history") c.innerHTML=history();
  if(view==="updates") c.innerHTML=updates();
  if(view==="sources") c.innerHTML=sources();
  if(view==="settings") c.innerHTML=settings();
  bindDynamic();
}
function home(){return `<div class="page">
 <section class="hero"><div><h1>Komik di satu tempat.</h1><p>Web reader modern untuk library pribadi, CBZ/ZIP, URL chapter, riwayat membaca dan mode reader yang dapat disesuaikan.</p><div class="hero-actions"><button class="primary" onclick="document.getElementById('openUrlBtn').click()">＋ Buka URL Comic</button><button class="secondary" onclick="render('library')">★ Buka Library</button></div></div><div class="hero-art">📚</div></section>
 <section class="section"><div class="section-head"><h2>Rekomendasi</h2><span class="muted">Demo catalog</span></div><div class="grid">${demo.map(card).join("")}</div></section>
 <section class="section"><div class="section-head"><h2>Lanjut Membaca</h2></div>${state.history.length?`<div class="grid">${state.history.slice(0,6).map(h=>card(h)).join("")}</div>`:`<div class="empty">Belum ada riwayat membaca.</div>`}</section>
 </div>`}
function library(){const list=demo.filter(m=>state.library.includes(m.id));return `<div class="page"><div class="section-head"><h1>Library</h1><span class="muted">${list.length} judul</span></div>${list.length?`<div class="grid">${list.map(card).join("")}</div>`:`<div class="empty">Library masih kosong.<br>Tambahkan judul dari halaman detail.</div>`}</div>`}
function history(){return `<div class="page"><div class="section-head"><h1>Riwayat</h1><button class="secondary" onclick="clearHistory()">Hapus riwayat</button></div>${state.history.length?`<div class="grid">${state.history.map(card).join("")}</div>`:`<div class="empty">Belum ada riwayat.</div>`}</div>`}
function updates(){return `<div class="page"><h1>Update</h1><div class="empty">Feed update siap dihubungkan ke API katalog milikmu.</div></div>`}
function sources(){return `<div class="page"><h1>Sumber</h1><p class="muted">Arsitektur sumber dibuat terpisah agar kamu dapat menambahkan API/parser yang memang kamu miliki izin untuk digunakan.</p><div class="grid">${["Local / GitHub","JSON Catalog","CBZ URL","Custom API"].map(x=>`<div class="card"><div class="card-body"><h3>${x}</h3><div class="meta">Template source adapter</div></div></div>`).join("")}</div></div>`}
function settings(){return `<div class="page settings"><h1>Pengaturan</h1>
 <div class="setting"><div><b>Tema</b><div class="muted">Mode tampilan aplikasi</div></div><select id="themeSelect"><option value="dark" ${state.theme==="dark"?"selected":""}>Dark</option><option value="light" ${state.theme==="light"?"selected":""}>Light</option></select></div>
 <div class="setting"><div><b>Mode reader</b><div class="muted">Default reader</div></div><select id="modeSelect"><option value="webtoon" ${state.reader.mode==="webtoon"?"selected":""}>Webtoon / Vertical</option><option value="single" ${state.reader.mode==="single"?"selected":""}>Single Page</option><option value="double" ${state.reader.mode==="double"?"selected":""}>Two Page</option></select></div>
 <div class="setting"><div><b>Jarak halaman</b><div class="muted">Berikan gap antar halaman</div></div><input id="gapSelect" type="checkbox" ${state.reader.gap?"checked":""}></div>
 </div>`}

function openDetail(id){
 const m=findManga(id); if(!m)return;
 $("#content").innerHTML=`<div class="page"><button class="secondary" onclick="render('home')">← Kembali</button><section class="section detail"><div class="detail-cover">${coverHTML(m)}</div><div><h1>${esc(m.title)}</h1><p class="muted">${esc(m.author)} · ${esc(m.status)}</p><div class="tags">${m.genres.map(g=>`<span class="tag">${esc(g)}</span>`).join("")}</div><p>${esc(m.desc)}</p><div class="toolbar"><button class="primary" onclick="toggleLibrary('${esc(m.id)}')">${state.library.includes(m.id)?"★ Hapus dari Library":"☆ Tambah ke Library"}</button></div></div></section><section class="section"><div class="section-head"><h2>Chapter</h2></div><div class="chapters">${m.chapters.map((ch,i)=>`<div class="chapter"><div><b>${esc(ch.name)}</b><small>Chapter ${i+1}</small></div><button class="primary" onclick="openChapter('${esc(m.id)}',${i})">Baca</button></div>`).join("")}</div></section></div>`;
}
function toggleLibrary(id){const i=state.library.indexOf(id);i>=0?state.library.splice(i,1):state.library.push(id);save();openDetail(id);toast(i>=0?"Dihapus dari Library":"Ditambahkan ke Library")}
function clearHistory(){state.history=[];save();render("history")}
function bindDynamic(){
 $("#themeSelect")?.addEventListener("change",e=>{state.theme=e.target.value;document.body.classList.toggle("light",state.theme==="light");save()});
 $("#modeSelect")?.addEventListener("change",e=>{state.reader.mode=e.target.value;save()});
 $("#gapSelect")?.addEventListener("change",e=>{state.reader.gap=e.target.checked;save()});
}
async function openChapter(id,index){
 const m=findManga(id), ch=m?.chapters[index]; if(!ch)return;
 if(!ch.url){toast("Demo chapter. Gunakan Buka URL untuk CBZ nyata.");return}
 const urls=await loadComic(ch.url);
 openReader(m.title+" · "+ch.name,urls);
}
async function loadComic(url){
 const res=await fetch(url); if(!res.ok)throw new Error("HTTP "+res.status);
 const blob=await res.blob(); const zip=await JSZip.loadAsync(blob);
 const names=Object.keys(zip.files).filter(n=>/\.(jpg|jpeg|png|webp|gif)$/i.test(n)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
 if(!names.length)throw new Error("CBZ tidak berisi gambar.");
 const urls=[]; for(const n of names)urls.push(URL.createObjectURL(await zip.files[n].async("blob"))); return urls;
}
function openReader(title,urls){
 const box=document.createElement("div");box.className="reader";box.id="reader";
 box.innerHTML=`<div class="reader-bar" id="readerBar"><button class="icon-btn" onclick="closeReader()">←</button><div class="reader-title">${esc(title)}</div><button class="secondary" onclick="readerMode('webtoon')">Webtoon</button><button class="secondary" onclick="readerMode('single')">Single</button><button class="secondary" onclick="readerMode('double')">2P</button><button class="secondary" onclick="toggleReaderBar()">☰</button></div><div class="reader-main"><div id="readerPages" class="reader-pages"></div></div><div class="reader-bottom"><span class="counter" id="readerCounter">1 / ${urls.length}</span><input id="readerRange" class="range" type="range" min="1" max="${urls.length}" value="1"><button class="secondary" onclick="scrollReader(-1)">↑</button><button class="secondary" onclick="scrollReader(1)">↓</button></div>`;
 document.body.appendChild(box); window.readerURLs=urls; window.readerIndex=0; window.readerTitle=title; renderReaderPages();
 box.addEventListener("keydown",readerKeys);box.tabIndex=0;box.focus();
}
function renderReaderPages(){
 const p=$("#readerPages");if(!p)return;p.className="reader-pages "+state.reader.mode+(state.reader.gap?" gap":"");p.innerHTML="";
 const start=state.reader.mode==="single"?window.readerIndex:0;
 const end=state.reader.mode==="double"?Math.min(window.readerIndex+2,window.readerURLs.length):state.reader.mode==="single"?start+1:window.readerURLs.length;
 for(let i=start;i<end;i++){const img=document.createElement("img");img.className="reader-page";img.src=window.readerURLs[i];img.dataset.index=i;p.appendChild(img)}
 $("#readerCounter").textContent=`${window.readerIndex+1} / ${window.readerURLs.length}`;
 $("#readerRange").value=window.readerIndex+1;
 if(state.reader.mode==="webtoon")observeReader();
}
function readerMode(mode){state.reader.mode=mode;save();renderReaderPages()}
function scrollReader(dir){if(state.reader.mode==="single"||state.reader.mode==="double"){window.readerIndex=Math.max(0,Math.min(window.readerURLs.length-1,window.readerIndex+dir));renderReaderPages()}else window.scrollBy({top:dir*window.innerHeight*.8,behavior:"smooth"})}
function observeReader(){const imgs=$$(".reader-page");if(!imgs.length)return;const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){window.readerIndex=Number(e.target.dataset.index);$("#readerCounter").textContent=`${window.readerIndex+1} / ${window.readerURLs.length}`;$("#readerRange").value=window.readerIndex+1}}),{threshold:.4});imgs.forEach(i=>obs.observe(i))}
function readerKeys(e){if(e.key==="Escape")closeReader();if(e.key==="ArrowRight"||e.key==="ArrowDown")scrollReader(1);if(e.key==="ArrowLeft"||e.key==="ArrowUp")scrollReader(-1)}
function toggleReaderBar(){$("#readerBar")?.classList.toggle("hidden")}
function closeReader(){const r=$("#reader");if(r){window.readerURLs?.forEach(u=>URL.revokeObjectURL(u));r.remove()}}
document.addEventListener("change",e=>{if(e.target.id==="readerRange"){window.readerIndex=Number(e.target.value)-1;renderReaderPages();if(state.reader.mode==="webtoon")$("#readerPages").children[window.readerIndex]?.scrollIntoView({behavior:"smooth",block:"start"})}});
$("#nav").addEventListener("click",e=>{const b=e.target.closest(".nav-item");if(b)render(b.dataset.view)});
$("#themeBtn").onclick=()=>{state.theme=state.theme==="dark"?"light":"dark";document.body.classList.toggle("light",state.theme==="light");save()};
$("#aboutBtn").onclick=()=>$("#aboutDialog").showModal();
$("#mobileMenu").onclick=()=>$(".sidebar").classList.toggle("open");
$("#openUrlBtn").onclick=()=>$("#urlDialog").showModal();
$("#urlForm").addEventListener("submit",async e=>{e.preventDefault();const url=$("#urlInput").value.trim(),title=$("#titleInput").value.trim()||"Online Comic";try{$("#urlDialog").close();toast("Memuat comic...");const urls=await loadComic(url);openReader(title,urls)}catch(err){toast("Gagal: "+err.message)}});
$("#searchInput").addEventListener("input",e=>{const q=e.target.value.trim().toLowerCase();if(!q){render("home");return}const found=demo.filter(m=>(m.title+" "+m.author+" "+m.genres.join(" ")).toLowerCase().includes(q));$("#content").innerHTML=`<div class="page"><div class="section-head"><h1>Hasil pencarian</h1><span class="muted">${found.length} hasil</span></div>${found.length?`<div class="grid">${found.map(card).join("")}</div>`:`<div class="empty">Tidak ada hasil.</div>`}</div>`});
document.body.classList.toggle("light",state.theme==="light");updateCount();render("home");
