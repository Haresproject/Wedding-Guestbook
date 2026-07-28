const API_URL = "https://wedguest.kosthandoko907.workers.dev";

const id = new URLSearchParams(location.search).get("id");

async function load(){

    console.log("ID:", id);

    const settings =
        await fetch(API_URL + "?action=settings")
        .then(r => r.json());

    const guests =
        await fetch(API_URL + "?action=guests")
        .then(r => r.json());

    console.log(guests);

    const guest =
        guests.find(g => String(g.id).trim() === String(id).trim());

    if(!guest){

        alert("Guest tidak ditemukan");

        return;

    }

    document.getElementById("background").src =
        settings.cardBackground;

    document.getElementById("name").innerHTML =
        guest.nama;

    document.getElementById("qr").src =
        "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=" +
        guest.id;

}

load();