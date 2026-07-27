const API_URL = "https://wedguest.kosthandoko907.workers.dev";

const id = new URLSearchParams(location.search).get("id");

async function loadInvitation(){

    try{

        // ==========================
        // SETTINGS
        // ==========================
        const settingsRes = await fetch(API_URL + "?action=settings");
        const settings = await settingsRes.json();

        document.getElementById("couple").innerHTML =
            settings.appName || "Wedding Invitation";

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

        // ==========================
        // GUEST
        // ==========================
        const guestRes = await fetch(API_URL + "?action=guests");
        const guests = await guestRes.json();

        const guest = guests.find(g =>
            String(g.id).trim() === String(id).trim()
        );

        if(!guest){

            document.getElementById("guestName").innerHTML =
                "Tamu tidak ditemukan";

            return;
        }

        document.getElementById("guestName").innerHTML =
            guest.nama;

        // ==========================
        // QR (AMBIL DARI SPREADSHEET)
        // ==========================
        if(guest.qrUrl){

            document.getElementById("qr").src = guest.qrUrl;

        }

    }catch(err){

        console.error(err);

        document.getElementById("guestName").innerHTML =
            "Terjadi kesalahan";

    }

}

loadInvitation();