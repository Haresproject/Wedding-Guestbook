const API_URL = "https://wedguest.kosthandoko907.workers.dev";

const id = new URLSearchParams(location.search).get("id");

async function loadGuest(){

    console.log("ID =", id);

    try{

        const res = await fetch(API_URL + "?action=guests");

        console.log("Response =", res);

        const guests = await res.json();

        console.log("Guests =", guests);

        const guest = guests.find(g => String(g.id) === String(id));

        console.log("Guest =", guest);

        if(guest){

            document.getElementById("guestName").innerHTML = guest.nama;

        }else{

            document.getElementById("guestName").innerHTML = "Tamu tidak ditemukan";

        }

    }catch(err){

        console.error(err);

        document.getElementById("guestName").innerHTML = "ERROR";

    }

}

loadGuest();