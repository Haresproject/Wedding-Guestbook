const API_URL = "https://wedguest.kosthandoko907.workers.dev";

const id = new URLSearchParams(location.search).get("id");

async function loadInvitation(){

    // ambil settings
    const settingsRes = await fetch(API_URL + "?action=settings");
    const settings = await settingsRes.json();

        document.getElementById("venue").innerHTML =
        "📍 " + settings.venue;

    document.getElementById("date").innerHTML =
        "📅 " + new Date(settings.date).toLocaleDateString("id-ID",{
            day:"numeric",
            month:"long",
            year:"numeric"
        });

    if(settings.logo){
        document.getElementById("logo").src = settings.logo;
    }

    // ambil tamu
    const guestRes = await fetch(API_URL + "?action=guests");
    const guests = await guestRes.json();

    const guest = guests.find(g=>String(g.id).trim()==String(id).trim());

    if(guest){

        document.getElementById("guestName").innerHTML =
            guest.nama;

    }else{

        document.getElementById("guestName").innerHTML =
            "Tamu tidak ditemukan";

    }

    // QR
    document.getElementById("qr").src =
        "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data="
        + encodeURIComponent(
            "https://script.google.com/macros/s/AKfycbxypLyJtFO5DdrkBFHPEE6fGqG8HvHyubI4hxfN4jcb00m5auniNEjIvpfQLrFs5Y7P/exec?id="
            + id
        );

}

loadInvitation();