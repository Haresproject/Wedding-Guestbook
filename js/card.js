const API_URL = "https://wedguest.kosthandoko907.workers.dev";

const id = new URLSearchParams(location.search).get("id");

async function load() {

    try {

        console.log("ID:", id);

        // ==========================
        // LANGSUNG AMBIL DATA TAMU
        // ==========================

        const result = await fetch(
            API_URL + "?action=guest&id=" + encodeURIComponent(id),
            {
                cache: "no-store"
            }
        ).then(r => r.json());

        console.log("Guest API:", result);

        if (!result.success) {
            document.getElementById("name").innerHTML =
                "Tamu tidak ditemukan";
            return;
        }

        const guest = result;

        // ==========================
        // NAMA
        // ==========================

        document.getElementById("name").innerHTML =
            guest.nama;

        // ==========================
        // BACKGROUND
        // ==========================

        const bg =
            document.getElementById("background");

        bg.onload = () =>
            console.log("Background berhasil dimuat");

        bg.onerror = () =>
            console.log("Background gagal dimuat");

        bg.src = "assets/card-background.png";

        // ==========================
        // QR
        // ==========================

        document.getElementById("qr").src =
            "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=" +
            encodeURIComponent(guest.id);

    } catch (error) {

        console.error("ERROR CARD:", error);

        document.getElementById("name").innerHTML =
            "Terjadi kesalahan";

    }

}

load();