const API_URL = "https://wedguest.kosthandoko907.workers.dev";

const params = new URLSearchParams(location.search);

const id = params.get("id");
const autoDownload = params.get("download") === "1";

console.log("ID:", id);
console.log("Auto Download:", autoDownload);


// =====================================================
// LOAD GUEST
// =====================================================

async function load() {

    if (!id) {

        document.getElementById("name").innerText =
            "ID tamu tidak ditemukan";

        return;
    }

    try {

        const result = await fetch(
            API_URL +
            "?action=guest&id=" +
            encodeURIComponent(id)
        ).then(r => r.json());

        console.log("Guest:", result);

        if (!result.success) {

            document.getElementById("name").innerText =
                "Tamu tidak ditemukan";

            return;
        }

        /*
         * Worker kamu mengembalikan:
         *
         * {
         *   success:true,
         *   guest:{...}
         * }
         */

        const guest = result.guest;

        if (!guest) {

            document.getElementById("name").innerText =
                "Data tamu kosong";

            return;
        }


        // =================================================
        // NAMA
        // =================================================

        document.getElementById("name").innerText =
            guest.nama || "Tamu";


        // =================================================
        // BACKGROUND
        // =================================================

        const bg =
            document.getElementById("background");

        bg.src = "assets/card-background.png";


        // =================================================
        // QR
        // =================================================

        const qr =
            document.getElementById("qr");

        qr.src =
            "https://api.qrserver.com/v1/create-qr-code/" +
            "?size=500x500&data=" +
            encodeURIComponent(guest.id);


        // =================================================
        // TUNGGU GAMBAR SELESAI
        // =================================================

        await waitForImage(bg);
        await waitForImage(qr);


        console.log("Background + QR sudah siap");


        // =================================================
        // AUTO DOWNLOAD
        // =================================================

        if (autoDownload) {

            console.log("Mode DOWNLOAD aktif");

            // beri sedikit waktu agar DOM benar-benar selesai
            setTimeout(() => {

                downloadCard();

            }, 500);

        }

    } catch (err) {

        console.error("ERROR:", err);

        document.getElementById("name").innerText =
            "Terjadi kesalahan";

    }

}


// =====================================================
// TUNGGU IMAGE
// =====================================================

function waitForImage(img) {

    return new Promise(resolve => {

        if (img.complete && img.naturalWidth > 0) {

            resolve();
            return;
        }

        img.onload = () => resolve();

        img.onerror = () => resolve();

    });

}


// =====================================================
// DOWNLOAD
// =====================================================

async function downloadCard() {

    console.log("Membuat kartu PNG...");

    try {

        // Load html2canvas jika belum tersedia
        if (typeof html2canvas === "undefined") {

            await loadHtml2Canvas();

        }


        const card =
            document.getElementById("card");


        const canvas =
            await html2canvas(card, {

                scale: 3,

                useCORS: true,

                allowTaint: false,

                backgroundColor: null,

                logging: false

            });


        const link =
            document.createElement("a");


        const guestName =
            document.getElementById("name").innerText
            || "Tamu";


        link.download =
            "QR-" +
            guestName +
            ".png";


        link.href =
            canvas.toDataURL("image/png");


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);


        console.log("Download selesai");


    } catch (err) {

        console.error(
            "Gagal download:",
            err
        );

    }

}


// =====================================================
// LOAD HTML2CANVAS
// =====================================================

function loadHtml2Canvas() {

    return new Promise((resolve, reject) => {

        const script =
            document.createElement("script");

        script.src =
            "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";

        script.onload = resolve;

        script.onerror = reject;

        document.head.appendChild(script);

    });

}


// =====================================================
// START
// =====================================================

load();