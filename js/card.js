const API_URL = "https://wedguest.kosthandoko907.workers.dev";

const params = new URLSearchParams(location.search);

const id = params.get("id");
const autoDownload = params.get("download") === "1";

console.log("ID:", id);
console.log("Auto Download:", autoDownload);


async function load() {

    console.log("Mulai load kartu...");

    if (!id) {

        document.getElementById("name").innerText =
            "ID tamu tidak ditemukan";

        return;
    }

    try {

        // ==========================================
        // AMBIL DATA TAMU
        // ==========================================

        const response = await fetch(
            API_URL +
            "?action=guest&id=" +
            encodeURIComponent(id) +
            "&t=" +
            Date.now()
        );

        const result = await response.json();

        console.log("RESPONSE API:", result);


        // ==========================================
        // CEK DATA
        // ==========================================

        if (!result.success) {

            document.getElementById("name").innerText =
                result.message || "Tamu tidak ditemukan";

            return;
        }


        // ==========================================
        // AMBIL GUEST
        // ==========================================

        // Support dua kemungkinan format API:
        //
        // { success:true, guest:{...} }
        //
        // atau
        //
        // { success:true, id:"001", nama:"..." }

        const guest =
            result.guest || result;


        console.log("GUEST:", guest);


        if (!guest.id && !guest.nama) {

            document.getElementById("name").innerText =
                "Data tamu kosong";

            return;
        }


        // ==========================================
        // NAMA TAMU
        // ==========================================

        document.getElementById("name").innerText =
            guest.nama || "Tamu";


        // ==========================================
        // BACKGROUND
        // ==========================================

        const bg =
            document.getElementById("background");

        bg.src =
            "assets/card-background.png";


// ==========================================
// QR CODE
// ==========================================

const qr =
    document.getElementById("qr");

if (qr) {

    qr.innerHTML = "";

    new QRCode(qr, {

        text: String(guest.id),

        width: 300,

        height: 300,

        correctLevel:
            QRCode.CorrectLevel.M

    });

}
        // ==========================================
        // TUNGGU SEMUA GAMBAR
        // ==========================================

        await Promise.all([

            waitImage(bg),

            waitImage(qr)

        ]);


        console.log("Kartu sudah siap");


        // ==========================================
        // AUTO DOWNLOAD
        // ==========================================

        if (autoDownload) {

            console.log(
                "AUTO DOWNLOAD AKTIF"
            );

            setTimeout(() => {

                downloadCard();

            }, 700);

        }


    } catch (err) {

        console.error(
            "CARD ERROR:",
            err
        );

        document.getElementById("name").innerText =
            "Terjadi kesalahan";

    }

}


// ==========================================
// WAIT IMAGE
// ==========================================

function waitImage(img) {

    return new Promise(resolve => {

        if (
            img.complete &&
            img.naturalWidth > 0
        ) {

            resolve();
            return;

        }

        img.onload = () => resolve();

        img.onerror = () => resolve();

    });

}


// ==========================================
// DOWNLOAD
// ==========================================

async function downloadCard() {

    console.log(
        "Mulai membuat PNG..."
    );


    try {

        // ======================================
        // LOAD HTML2CANVAS
        // ======================================

        if (
            typeof html2canvas ===
            "undefined"
        ) {

            await loadHtml2Canvas();

        }


        // ======================================
        // AMBIL CARD
        // ======================================

        const card =
            document.getElementById("card");


        // ======================================
        // BUAT CANVAS
        // ======================================

        const canvas =
            await html2canvas(
                card,
                {

                    scale: 3,

                    useCORS: true,

                    allowTaint: false,

                    backgroundColor: null,

                    logging: false

                }
            );


        // ======================================
        // DOWNLOAD
        // ======================================

        const name =
            document.getElementById(
                "name"
            ).innerText || "Tamu";


        const link =
            document.createElement("a");


        link.download =
            "QR-" +
            name +
            ".png";


        link.href =
            canvas.toDataURL(
                "image/png"
            );


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);


        console.log(
            "DOWNLOAD BERHASIL"
        );


    } catch (err) {

        console.error(
            "DOWNLOAD ERROR:",
            err
        );

    }

}


// ==========================================
// LOAD HTML2CANVAS
// ==========================================

function loadHtml2Canvas() {

    return new Promise(
        (resolve, reject) => {

            const script =
                document.createElement(
                    "script"
                );

            script.src =
                "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";

            script.onload =
                resolve;

            script.onerror =
                reject;

            document.head.appendChild(
                script
            );

        }
    );

}


// ==========================================
// START
// ==========================================

load();