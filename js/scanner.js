const API_URL = "https://script.google.com/macros/s/AKfycbxypLyJtFO5DdrkBFHPEE6fGqG8HvHyubI4hxfN4jcb00m5auniNEjIvpfQLrFs5Y7P/exec";

let scanner = null;
let scanning = false;

// ========================
// Load Kamera
// ========================

async function loadCameras(){

    const cameras = await Html5Qrcode.getCameras();

    const select = document.getElementById("cameraSelect");

    select.innerHTML = "";

    cameras.forEach(cam=>{

        const option=document.createElement("option");

        option.value=cam.id;

        option.text=cam.label || "Camera";

        select.appendChild(option);

    });

    // otomatis pilih kamera belakang kalau ada
    for(let i=0;i<select.options.length;i++){

        const text=select.options[i].text.toLowerCase();

        if(
            text.includes("back") ||
            text.includes("rear") ||
            text.includes("environment") ||
            text.includes("belakang")
        ){

            select.selectedIndex=i;

            break;

        }

    }

}

// ========================
// Mulai Scanner
// ========================

async function startScanner(){

    const cameraId=document.getElementById("cameraSelect").value;

    scanner=new Html5Qrcode("reader");

    await scanner.start(

        cameraId,

        {

            fps:10,

            qrbox:250

        },

        onScanSuccess,

        ()=>{}

    );

}

// ========================
// Scan Berhasil
// ========================

async function onScanSuccess(decodedText){

    if(scanning) return;

    scanning=true;

    document.getElementById("status").innerHTML="⏳ Memproses...";

    try{

        const res=await fetch(

            API_URL+

            "?action=checkin&id="+

            encodeURIComponent(decodedText)

        );

        const data=await res.json();

        if(data.success){

            document.getElementById("status").innerHTML=

            "✅ "+data.nama+" berhasil check-in";

            if(navigator.vibrate){

                navigator.vibrate(200);

            }

            const audio=new Audio(

                "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"

            );

            audio.play();

        }else{

            document.getElementById("status").innerHTML=

            "❌ "+data.message;

        }

    }catch(e){

        document.getElementById("status").innerHTML=

        "❌ Gagal menghubungi server";

        console.log(e);

    }

    setTimeout(()=>{

        scanning=false;

        document.getElementById("status").innerHTML=

        "Siap scan berikutnya";

    },2000);

}

document

.getElementById("startBtn")

.addEventListener("click",startScanner);

loadCameras();