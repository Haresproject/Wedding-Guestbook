const API_URL = "https://wedguest.kosthandoko907.workers.dev";

const params = new URLSearchParams(location.search);

const id = params.get("id");
const autoDownload = params.get("download") === "1";

console.log("ID:", id);
console.log("Auto Download:", autoDownload);


// ==========================================
// GET ACTIVE SPREADSHEET
// ==========================================

function getActiveSpreadsheetId() {

    try {

        const user =
            JSON.parse(
                localStorage.getItem("user") || "{}"
            );

        // ======================================
        // SUPER ADMIN
        // ======================================

        if (
            String(user.role || "")
                .trim()
                .toLowerCase() === "superadmin"
        ) {

            console.log(
                "CARD → menggunakan spreadsheet Super Admin"
            );

            return CONFIG.SUPER_ADMIN_SPREADSHEET_ID;

        }


        // ======================================
        // CUSTOMER
        // ======================================

        if (user.spreadsheetId) {

            console.log(
                "CARD → menggunakan spreadsheet customer"
            );

            return user.spreadsheetId;

        }


        // ======================================
        // FALLBACK SUPER ADMIN
        // ======================================

        console.log(
            "CARD → spreadsheet user tidak ditemukan, fallback Super Admin"
        );

        return CONFIG.SUPER_ADMIN_SPREADSHEET_ID;

    } catch (err) {

        console.error(
            "Gagal mengambil spreadsheet:",
            err
        );

        return CONFIG.SUPER_ADMIN_SPREADSHEET_ID;

    }

}


// ==========================================
// LOAD CARD
// ==========================================

async function load() {

    console.log(
        "Mulai load kartu..."
    );


    // ======================================
    // CEK ID
    // ======================================

    if (!id) {

        document.getElementById("name").innerText =
            "ID tamu tidak ditemukan";

        return;

    }


    // ======================================
    // SPREADSHEET
    // ======================================

    const spreadsheetId =
        getActiveSpreadsheetId();


    if (!spreadsheetId) {

        document.getElementById("name").innerText =
            "Spreadsheet customer tidak ditemukan";

        console.error(
            "CARD → spreadsheetId kosong"
        );

        return;

    }


    console.log(
        "Spreadsheet ID:",
        spreadsheetId
    );


    try {

        // ==========================================
        // AMBIL DATA TAMU
        // ==========================================

        const url =
            API_URL +
            "?action=guest" +
            "&id=" +
            encodeURIComponent(id) +
            "&spreadsheetId=" +
            encodeURIComponent(spreadsheetId) +
            "&t=" +
            Date.now();


        console.log(
            "CARD API:",
            url
        );


        const response =
            await fetch(url);


        // ==========================================
        // CEK HTTP
        // ==========================================

        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status
            );

        }


        const result =
            await response.json();


        console.log(
            "RESPONSE API:",
            result
        );


        // ==========================================
        // CEK DATA
        // ==========================================

        if (!result.success) {

            document.getElementById("name").innerText =
                result.message ||
                "Tamu tidak ditemukan";

            return;

        }


        // ==========================================
        // AMBIL GUEST
        // ==========================================

        const guest =
            result.guest || result;


        console.log(
            "GUEST:",
            guest
        );


        if (
            !guest.id &&
            !guest.nama
        ) {

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
            document.getElementById(
                "background"
            );


        if (bg) {

            bg.src =
                "assets/card-background.png";

        }


        // ==========================================
        // QR CODE
        // ==========================================

        const qr =
            document.getElementById("qr");


        if (qr) {

            qr.innerHTML = "";


            new QRCode(
                qr,
                {

                    text:
                        String(guest.id),

                    width:
                        160,

                    height:
                        160,

                    correctLevel:
                        QRCode.CorrectLevel.M

                }
            );

        }


        // ==========================================
        // TUNGGU BACKGROUND
        // ==========================================

        if (bg) {

            await waitImage(bg);

        }


        console.log(
            "Kartu sudah siap"
        );


        // ==========================================
        // AUTO DOWNLOAD
        // ==========================================

        if (autoDownload) {

            console.log(
                "AUTO DOWNLOAD AKTIF"
            );


            setTimeout(
                () => {

                    downloadCard();

                },
                700
            );

        }

    } catch (err) {

        console.error(
            "CARD ERROR:",
            err
        );


        document.getElementById("name").innerText =
            "Terjadi kesalahan saat memuat kartu";

    }

}


// ==========================================
// WAIT IMAGE
// ==========================================

function waitImage(img) {

    return new Promise(
        resolve => {

            if (
                img.complete &&
                img.naturalWidth > 0
            ) {

                resolve();

                return;

            }


            img.onload =
                () => resolve();


            img.onerror =
                () => resolve();

        }
    );

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
            document.getElementById(
                "card"
            );


        if (!card) {

            throw new Error(
                "Element #card tidak ditemukan"
            );

        }


        // ======================================
        // BUAT CANVAS
        // ======================================

        const canvas =
            await html2canvas(
                card,
                {

                    scale:
                        3,

                    useCORS:
                        true,

                    allowTaint:
                        false,

                    backgroundColor:
                        null,

                    logging:
                        false

                }
            );


        // ======================================
        // DOWNLOAD
        // ======================================

        const name =
            document.getElementById(
                "name"
            ).innerText ||
            "Tamu";


        const link =
            document.createElement(
                "a"
            );


        link.download =
            "QR-" +
            name +
            ".png";


        link.href =
            canvas.toDataURL(
                "image/png"
            );


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


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
        (
            resolve,
            reject
        ) => {

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