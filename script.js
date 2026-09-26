const API_BASE=(window.WAWA_API_BASE||"").replace(/\/+$/,"");
const $=id=>document.getElementById(id);
let pollTimer,currentId;

async function api(path, options={}){
  const r=await fetch(API_BASE+path,{
    ...options,
    headers:{"Content-Type":"application/json",...(options.headers||{})}
  });
  const text=await r.text();
  let d;
  try{ d=JSON.parse(text); }
  catch{
    const preview=text.replace(/\s+/g," ").slice(0,180);
    throw new Error(`API mengembalikan HTML/non-JSON (${r.status}). Cek reverse proxy ${API_BASE} → Pterodactyl:2011. ${preview}`);
  }
  if(!r.ok) throw new Error(d.message||`API error ${r.status}`);
  return d;
}

$("go").onclick=async()=>{
  const name=$("name").value.trim();
  const number=$("number").value.replace(/\D/g,"");
  if(!name||number.length<10)return alert("Nama dan nomor WhatsApp wajib diisi.");
  $("go").disabled=true;
  $("box").classList.remove("hide");
  $("state").textContent="Membuat bot...";
  $("code").textContent="";
  $("info").textContent="";
  $("copy").classList.add("hide");
  $("stop").classList.add("hide");
  try{
    const d=await api("/api/create",{
      method:"POST",
      body:JSON.stringify({name,number})
    });
    if(!d.sessionId)throw Error(d.message||"Gagal membuat bot");
    currentId=d.sessionId;
    $("stop").classList.remove("hide");
    poll(currentId);
  }catch(e){
    $("state").textContent="Gagal";
    $("info").textContent=e.message;
    $("go").disabled=false;
  }
};

$("copy").onclick=async()=>{
  try{
    await navigator.clipboard.writeText($("code").textContent);
    $("info").textContent="Kode berhasil disalin.";
  }catch{$("info").textContent="Salin kode secara manual."}
};

$("stop").onclick=async()=>{
  if(!currentId)return;
  try{await api("/api/stop/"+encodeURIComponent(currentId),{method:"POST"})}catch{}
  clearInterval(pollTimer);
  $("state").textContent="Bot dihentikan";
  $("go").disabled=false;
  $("stop").classList.add("hide");
};

function poll(id){
  clearInterval(pollTimer);
  let n=0;
  pollTimer=setInterval(async()=>{
    if(++n>120){
      clearInterval(pollTimer);
      $("state").textContent="Waktu tunggu habis";
      $("info").textContent="Pairing belum selesai.";
      $("go").disabled=false;
      return;
    }
    try{
      const d=await api("/api/status/"+encodeURIComponent(id));
      if(d.pairingCode){
        $("state").textContent="Pairing code WhatsApp";
        $("code").textContent=d.pairingCode;
        $("copy").classList.remove("hide");
        $("info").textContent="WhatsApp → Perangkat tertaut → Tautkan dengan nomor telepon";
      }else if(d.status==="starting"){
        $("state").textContent="Menghubungkan ke WhatsApp...";
      }
      if(d.status==="online"){
        clearInterval(pollTimer);
        $("state").textContent="Bot online ✓";
        $("info").textContent="Bot berhasil terhubung.";
        $("go").disabled=false;
        $("stop").classList.remove("hide");
      }
      if(d.status==="error"){
        clearInterval(pollTimer);
        $("state").textContent="Gagal";
        $("info").textContent=d.message||"Session error";
        $("go").disabled=false;
        $("stop").classList.add("hide");
      }
    }catch(e){
      if(n===1)$("info").textContent=e.message||"API tidak dapat dihubungi.";
    }
  },1500);
}
