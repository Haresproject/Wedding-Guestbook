const API_URL = CONFIG.API_URL;

const id = new URLSearchParams(window.location.search).get("id");

async function loadInvitation() {

    try {

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
            "📅 " + new Date(settings.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });

        if (settings.logo) {
            document.getElementById("logo").src = settings.logo;
        }

        // ==========================
        // AMBIL DATA TAMU
        // ==========================
        const guestRes = await fetch(API_URL + "?action=guests");
        const guests = await guestRes.json();

        const guest = guests.find(g =>
            String(g.id).trim() === String(id).trim()
        );

        if (!guest) {

            document.getElementById("guestName").innerHTML =
                "Tamu tidak ditemukan";

            return;
        }

        document.getElementById("guestName").innerHTML =
            guest.nama;

        // ==========================
        // QR (ISI HANYA ID)
        // ==========================
        document.getElementById("qr").src =
    "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data="
    + encodeURIComponent(guest.id);

// AUTO DOWNLOAD
if(autoDownload){

    // tunggu QR selesai dimuat
    document.getElementById("qr").onload = async function(){

        await downloadCard();

        setTimeout(()=>{

            window.close();

        },500);

    };

}

} catch (err) {

        console.error(err);

        document.getElementById("guestName").innerHTML =
            "Terjadi kesalahan";

    }

}

document
.getElementById("downloadBtn")
.addEventListener("click",downloadCard);
async function downloadCard(){

    const card = document.querySelector(".card");

    const canvas = await html2canvas(card,{
        scale:3,
        useCORS:true,
        backgroundColor:null
    });

    const a = document.createElement("a");

    a.download =
        document.getElementById("guestName").innerText +
        ".png";

    a.href =
        canvas.toDataURL("image/png");

    a.click();

}
const autoDownload =
new URLSearchParams(location.search)
.get("download");

loadInvitation();