const scanner = new Html5Qrcode("reader");

async function startScanner() {

    try {

        const cameras = await Html5Qrcode.getCameras();

        if (cameras.length === 0) {
            document.getElementById("status").innerHTML =
                "❌ Tidak ada kamera yang ditemukan";
            return;
        }

        await scanner.start(
            cameras[0].id,
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            (decodedText) => {

                document.getElementById("status").innerHTML =
                    "✅ QR berhasil dibaca";

                scanner.stop();

                window.location.href = decodedText;

            },
            () => {}
        );

    } catch (err) {

        console.error(err);

        document.getElementById("status").innerHTML =
            JSON.stringify(err);

    }

}

startScanner();