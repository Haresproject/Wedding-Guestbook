const API_URL = "https://script.google.com/macros/s/AKfycbxypLyJtFO5DdrkBFHPEE6fGqG8HvHyubI4hxfN4jcb00m5auniNEjIvpfQLrFs5Y7P/exec";

const scanner = new Html5Qrcode("reader");

let scanning = false;

async function onScanSuccess(decodedText){

    if(scanning) return;

    scanning = true;

    document.getElementById("status").innerHTML =
        "⏳ Memproses...";

    try{

        const res = await fetch(
            API_URL +
            "?action=checkin&id=" +
            encodeURIComponent(decodedText)
        );

        const data = await res.json();

        if(data.success){

            document.getElementById("status").innerHTML =
                "✅ " + data.nama + " berhasil check-in";

            // Getar HP
            if(navigator.vibrate){
                navigator.vibrate(200);
            }

            // Bunyi beep
            const audio = new Audio(
                "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"
            );
            audio.play();

        }else{

            document.getElementById("status").innerHTML =
                "❌ " + data.message;

        }

    }catch(err){

        document.getElementById("status").innerHTML =
            "❌ Gagal menghubungi server";

        console.log(err);

    }

    setTimeout(()=>{
        scanning = false;
        document.getElementById("status").innerHTML =
            "Arahkan kamera ke QR Code";
    },2000);

}

function onScanFailure(){}

Html5Qrcode.getCameras().then(cameras=>{

    if(cameras.length){

        scanner.start(
            cameras[0].id,
            {
                fps:10,
                qrbox:250
            },
            onScanSuccess,
            onScanFailure
        );

    }

});