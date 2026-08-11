const API_URL = "https://wedguest.kosthandoko907.workers.dev";

let scanner = null;
let scanning = false;

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

        const res = await fetch(

            API_URL +
            "?action=checkin&id=" +
            encodeURIComponent(decodedText)

        );

        const data = await res.json();

        console.log("Check-in:", data);

        if (data.success) {

            // Nama tamu
            document.getElementById("guestName").innerHTML =
                data.nama || "";

            // Tipe tamu
            document.getElementById("guestType").innerHTML =
                data.tipe || "";

            // Popup
            document.getElementById("popupSuccess").style.display =
                "flex";

            document.getElementById("status").innerHTML =
                "✅ Berhasil Check-in";

            // Getar
            if (navigator.vibrate) {

                navigator.vibrate([
                    200,
                    100,
                    200
                ]);

            }

            // =======================
// SUARA CHECK-IN BERHASIL
// =======================

const beep = new Audio("assets/beep.mp3");

beep.volume = 1;
beep.currentTime = 0;

// Mainkan suara
beep.play().then(() => {

    // Maksimal 3 detik
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

        console.error(err);

        alert(
            "Gagal menghubungi server."
        );

        document.getElementById("status").innerHTML =
            "❌ Gagal menghubungi server";

    }

    // Tunggu sebentar kemudian siap scan lagi
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