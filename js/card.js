const API_URL="https://wedguest.kosthandoko907.workers.dev";

const id=new URLSearchParams(location.search).get("id");

async function load(){

const settings=await fetch(API_URL+"?action=settings").then(r=>r.json());

const guests=await fetch(API_URL+"?action=guests").then(r=>r.json());

const guest=guests.find(g=>String(g.id)==id);

document.getElementById("background").src =
settings.cardBackground;

document.getElementById("name").innerHTML=guest.nama;

document.getElementById("qr").src=
"https://api.qrserver.com/v1/create-qr-code/?size=500x500&data="+guest.id;

}

load();