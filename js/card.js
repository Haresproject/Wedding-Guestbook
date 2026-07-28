const API_URL = "https://wedguest.kosthandoko907.workers.dev";

const id = new URLSearchParams(location.search).get("id");

async function load(){

    console.log("ID:", id);

    const settings =
        await fetch(API_URL + "?action=settings")
        .then(r => r.json());

    const result =
    await fetch(API_URL + "?action=guest&id=" + id)
    .then(r => r.json());

if(!result.success){

    alert("Guest tidak ditemukan");

    return;

}

const guest = result.guest;

    const bg = document.getElementById("background");

bg.onload = () => console.log("Background berhasil dimuat");
bg.onerror = () => console.log("Background gagal dimuat");

bg.src = "assets/card-background.png";

    document.getElementById("name").innerHTML =
        guest.nama;

    document.getElementById("qr").src =
        "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=" +
        guest.id;

}

load();