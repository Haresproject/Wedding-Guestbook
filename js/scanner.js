const API_URL = "https://wedguest.kosthandoko907.workers.dev";

let scanner = null;
let scanning = false;

// =======================
// Load daftar kamera
// =======================

async function loadCameras() {

    const cameras = await Html5Qrcode.getCameras();

    const select = document.getElementById("cameraSelect");

    select.innerHTML = "";

    cameras.forEach(cam => {

        const option = document.createElement("option");

        option.value = cam.id;

        option.text = cam.label || "Camera";

        select.appendChild(option);

    });

    // Pilih kamera belakang otomatis jika ada
    for (let i = 0; i < select.options.length; i++) {

        const text = select.options[i].text.toLowerCase();

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

}

// =======================
// Mulai Scanner
// =======================

async function startScanner() {

    if (scanner) {

        try {
            await scanner.stop();
        } catch (e) {}

        scanner.clear();

    }

    const cameraId = document.getElementById("cameraSelect").value;

    scanner = new Html5Qrcode("reader");

    scanner.start(

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

}

// =======================
// Saat QR berhasil dibaca
// =======================

async function onScanSuccess(decodedText) {

    if (scanning) return;

    scanning = true;

    document.getElementById("status").innerHTML = "⏳ Memproses...";

    try {

        const res = await fetch(

            API_URL +
            "?action=checkin&id=" +
            encodeURIComponent(decodedText)

        );

        const data = await res.json();

        if (data.success) {

            // Popup
            document.getElementById("guestName").innerHTML = data.nama;

            document.getElementById("guestType").innerHTML = data.tipe || "";

            document.getElementById("popupSuccess").style.display = "flex";

            document.getElementById("status").innerHTML = "✅ Berhasil";

            // Getar
            if (navigator.vibrate) {

                navigator.vibrate([200,100,200]);

            }

    // Bunyi beep
const beep = new Audio("assets/beep.mp3");

beep.volume = 1;

beep.play().catch(err => {
    console.log("Gagal memutar beep", err);
});

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.log(err);

        alert("Gagal menghubungi server");

    }

    setTimeout(() => {

        document.getElementById("popupSuccess").style.display = "none";

        document.getElementById("status").innerHTML = "📷 Scanner siap";

        scanning = false;

    }, 2000);

}

// =======================

document

.getElementById("startBtn")

.addEventListener("click", startScanner);

loadCameras();