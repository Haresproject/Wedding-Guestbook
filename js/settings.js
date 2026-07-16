const API_URL = "https://script.google.com/macros/s/AKfycbxypLyJtFO5DdrkBFHPEE6fGqG8HvHyubI4hxfN4jcb00m5auniNEjIvpfQLrFs5Y7P/exec";

// ================= LOAD SETTINGS =================

async function loadSettings(){

    try{

        const res = await fetch(API_URL + "?action=settings");

        const data = await res.json();

        document.getElementById("bride").value = data.bride || "";
        document.getElementById("groom").value = data.groom || "";
        document.getElementById("venue").value = data.venue || "";

        if(data.date){

            const d = new Date(data.date);

            document.getElementById("date").value =
                d.toISOString().split("T")[0];

        }

    }catch(err){

        console.error(err);

    }

}

// ================= SAVE SETTINGS =================

async function saveSettings(){

    const body = {

        action:"saveSettings",

        bride:document.getElementById("bride").value,

        groom:document.getElementById("groom").value,

        date:document.getElementById("date").value,

        venue:document.getElementById("venue").value

    };

    try{

        const res = await fetch(API_URL,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(body)

        });

        const result = await res.json();

        alert(result.message);

    }catch(err){

        console.error(err);

        alert("Gagal menyimpan.");

    }

}

document
.getElementById("saveBtn")
.addEventListener("click",saveSettings);

loadSettings();