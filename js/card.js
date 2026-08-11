const API_URL = "https://wedguest.kosthandoko907.workers.dev";

const id = new URLSearchParams(location.search).get("id");

async function load() {

    try {

        console.log("ID:", id);

        // ==========================
        // SETTINGS
        // ==========================

        const settings =
            await fetch(API_URL + "?action=settings")
            .then(r => r.json());

        // ==========================
        // AMBIL DATA TAMU
        // ==========================

        const result =
            await fetch(
                API_URL + "?action=guest&id=" + encodeURIComponent(id)
            )
            .then(r => r.json());

        console.log("Guest API:", result);

        if (!result.success) {

            alert("Guest tidak ditemukan");

            return;
        }

        // ==========================================
        // DATA TAMU LANGSUNG DARI RESULT
        // ==========================================

        const guest = result;

        console.log("Guest:", guest);

        // ==========================================
        // BACKGROUND
        // ==========================================

        const bg =
            document.getElementById("background");

        bg.onload = () =>
            console.log("Background berhasil dimuat");

        bg.onerror = () =>
            console.log("Background gagal dimuat");

        bg.src =
            "assets/card-background.png";

        // ==========================================
        // NAMA TAMU
        // ==========================================

        document.getElementById("name").innerHTML =
            guest.nama;

        // ==========================================
        // QR CODE
        // ISI QR = ID TAMU
        // ==========================================

        document.getElementById("qr").src =
            "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=" +
            encodeURIComponent(guest.id);

    } catch (error) {

        console.error("ERROR CARD:", error);

        alert("Terjadi kesalahan saat mengambil data tamu");

    }

}

load();