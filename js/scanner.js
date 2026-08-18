const API_URL = "https://wedguest.kosthandoko907.workers.dev";

let scanner = null;
let scanning = false;
// =======================
// SUARA CHECK-IN
// =======================

const beep = new Audio("assets/beep.mp3");
beep.volume = 1;

// =======================
// LOAD DAFTAR KAMERA
// =======================

async function loadCameras() {

    const select = document.getElementById("cameraSelect");

    try {

        select.innerHTML = '<option>⏳ Mencari kamera...</option>';

        // Meminta izin kamera terlebih dahulu
        try {
            await navigator.mediaDevices.getUserMedia({
                video: true
            });
        } catch (err) {

            console.error("Izin kamera ditolak:", err);

            select.innerHTML =
                '<option value="">❌ Izin kamera ditolak</option>';

            document.getElementById("status").innerHTML =
                "⚠️ Izinkan akses kamera pada browser";

            return;
        }

        const cameras = await Html5Qrcode.getCameras();

        select.innerHTML = "";

        if (!cameras || cameras.length === 0) {

            select.innerHTML =
                '<option value="">❌ Kamera tidak ditemukan</option>';

            document.getElementById("status").innerHTML =
                "❌ Kamera tidak ditemukan";

            return;
        }

        cameras.forEach((cam, index) => {

            const option = document.createElement("option");

            option.value = cam.id;

            option.text =
                cam.label ||
                `Kamera ${index + 1}`;

            select.appendChild(option);

        });

        // =======================
        // PILIH KAMERA BELAKANG
        // =======================

        for (let i = 0; i < select.options.length; i++) {

            const text =
                select.options[i].text.toLowerCase();

            if (
                text.includes("back") ||
                text.includes("rear") ||
                text.includes("environment") ||
                text.includes("belakang")
            ) {

                select.selectedIndex = i;
                break;

            }

        }

        document.getElementById("status").innerHTML =
            "📷 Pilih kamera lalu tekan Mulai Scanner";

    } catch (err) {

        console.error("Gagal mendapatkan kamera:", err);

        select.innerHTML =
            '<option value="">❌ Gagal membaca kamera</option>';

        document.getElementById("status").innerHTML =
            "❌ Kamera tidak dapat diakses";

    }

}


// =======================
// MULAI SCANNER
// =======================

async function startScanner() {

    const cameraId =
        document.getElementById("cameraSelect").value;

    if (!cameraId) {

        alert("Pilih kamera terlebih dahulu.");

        return;

    }

    try {

        // Kalau scanner sedang berjalan
        if (scanner) {

            try {

                await scanner.stop();

            } catch (e) {

                console.log("Scanner belum berjalan.");

            }

            try {

                scanner.clear();

            } catch (e) {}

        }

        scanner = new Html5Qrcode("reader");

        document.getElementById("status").innerHTML =
            "📷 Membuka kamera...";

        await scanner.start(

            cameraId,

            {

                fps: 10,

                qrbox: {
                    width: 250,
                    height: 250
                }

            },

            onScanSuccess,

            () => {}

        );

        document.getElementById("status").innerHTML =
            "📷 Scanner siap — arahkan kamera ke QR";

    } catch (err) {

        console.error("Gagal memulai scanner:", err);

        document.getElementById("status").innerHTML =
            "❌ Kamera gagal dibuka";

        alert(
            "Kamera tidak dapat dibuka.\n\n" +
            "Pastikan izin kamera sudah diberikan."
        );

    }

}


// =======================
// QR BERHASIL DIBACA
// =======================

async function onScanSuccess(decodedText) {

    if (scanning) return;

    scanning = true;

    document.getElementById("status").innerHTML =
        "⏳ Memproses QR...";

    try {

        console.log("QR TERBACA:", decodedText);

// =================================================
// TENTUKAN SPREADSHEET BERDASARKAN ROLE LOGIN
// =================================================

let spreadsheetId = "";

let savedUser = {};

try {

    savedUser =
        JSON.parse(
            localStorage.getItem("user") || "{}"
        );

} catch (error) {

    console.error(
        "Gagal membaca data user:",
        error
    );

    savedUser = {};

}


// =================================================
// SUPER ADMIN
// =================================================

if (
    String(savedUser.role || "")
        .trim()
        .toLowerCase() === "superadmin"
) {

    spreadsheetId =
        CONFIG.SUPER_ADMIN_SPREADSHEET_ID;

    console.log(
        "MODE SCANNER: SUPER ADMIN"
    );

}


// =================================================
// CUSTOMER
// =================================================

else {

    spreadsheetId =
        localStorage.getItem(
            "spreadsheetId"
        ) || "";

    console.log(
        "MODE SCANNER: CUSTOMER"
    );

}


// =================================================
// DEBUG
// =================================================

console.log(
    "USER:",
    savedUser
);

console.log(
    "ROLE:",
    savedUser.role
);

console.log(
    "SPREADSHEET ID:",
    spreadsheetId
);


// =================================================
// CEK SPREADSHEET
// =================================================

if (!spreadsheetId) {

    alert(
        "Spreadsheet belum tersedia untuk akun ini."
    );

    document.getElementById("status").innerHTML =
        "❌ Spreadsheet belum tersedia";

    scanning = false;

    return;

}

        const checkinUrl =
            API_URL +
            "?action=checkin" +
            "&id=" +
            encodeURIComponent(decodedText) +
            "&spreadsheetId=" +
            encodeURIComponent(spreadsheetId);

        console.log(
            "CHECK-IN URL:",
            checkinUrl
        );

        const res =
            await fetch(checkinUrl, {
                cache: "no-store"
            });

        console.log(
            "HTTP STATUS:",
            res.status
        );

        const contentType =
            res.headers.get("content-type") || "";

        console.log(
            "CONTENT TYPE:",
            contentType
        );

        const text =
            await res.text();

        console.log(
            "RESPON SERVER:",
            text
        );

        // =================================================
        // CEK APAKAH RESPONSE JSON
        // =================================================

        if (
            !contentType.includes("application/json")
        ) {

            console.error(
                "RESPON SERVER BUKAN JSON:",
                text
            );

            alert(
                "Server tidak mengembalikan JSON.\n\n" +
                "Cek Console untuk melihat respon server."
            );

            document.getElementById("status").innerHTML =
                "❌ Server error";

            return;
        }

        const data =
            JSON.parse(text);

        console.log(
            "CHECK-IN DATA:",
            data
        );

        // =================================================
        // BERHASIL
        // =================================================

        if (data.success) {

            document.getElementById("guestName").innerHTML =
                data.nama || "";

            document.getElementById("guestType").innerHTML =
                data.tipe || "";

            document.getElementById("popupSuccess").style.display =
                "flex";

            document.getElementById("status").innerHTML =
                "✅ Berhasil Check-in";

            if (navigator.vibrate) {

                navigator.vibrate([
                    200,
                    100,
                    200
                ]);

            }

            beep.currentTime = 0;

            beep.play().then(() => {

                setTimeout(() => {

                    beep.pause();
                    beep.currentTime = 0;

                }, 3000);

            }).catch(err => {

                console.log(
                    "Gagal memutar suara:",
                    err
                );

            });

        } else {

            alert(
                data.message ||
                "QR tidak valid"
            );

            document.getElementById("status").innerHTML =
                "❌ QR tidak valid";

        }

    } catch (err) {

        console.error(
            "ERROR CHECK-IN:",
            err
        );

        alert(
            "Gagal menghubungi server."
        );

        document.getElementById("status").innerHTML =
            "❌ Gagal menghubungi server";

    }

    setTimeout(() => {

        document.getElementById(
            "popupSuccess"
        ).style.display = "none";

        document.getElementById("status").innerHTML =
            "📷 Scanner siap";

        scanning = false;

    }, 2000);

}


// =======================
// TOMBOL MULAI SCANNER
// =======================

document
    .getElementById("startBtn")
    .addEventListener(
        "click",
        startScanner
    );


// =======================
// LOAD KAMERA SAAT HALAMAN DIBUKA
// =======================

loadCameras();