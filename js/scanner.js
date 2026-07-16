const scanner = new Html5Qrcode("reader");

function onScanSuccess(decodedText) {

    document.getElementById("status").innerHTML =
        "✅ QR berhasil dibaca";

    scanner.stop().then(() => {

        window.location.href = decodedText;

    });

}

function onScanFailure(error){}

// Ambil daftar kamera
Html5Qrcode.getCameras().then(cameras => {

    if(cameras && cameras.length){

        // Cari kamera belakang
        let cameraId = cameras[0].id;

        cameras.forEach(cam => {

            const name = cam.label.toLowerCase();

            if(
                name.includes("back") ||
                name.includes("rear") ||
                name.includes("environment") ||
                name.includes("belakang")
            ){
                cameraId = cam.id;
            }

        });

        scanner.start(
            cameraId,
            {
                fps:10,
                qrbox:250
            },
            onScanSuccess,
            onScanFailure
        );

    }

}).catch(err=>{

    document.getElementById("status").innerHTML =
        "❌ Kamera tidak ditemukan";

    console.log(err);

});