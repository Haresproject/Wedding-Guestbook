const API_URL = "https://wedguest.kosthandoko907.workers.dev";

const id = new URLSearchParams(location.search).get("id");

async function loadGuest() {

    document.getElementById("guestName").innerHTML = "Loading...";

    const res = await fetch(API_URL + "?action=guests");

    const guests = await res.json();

    const guest = guests.find(g => String(g.id) === String(id));

    if (guest) {

        document.getElementById("guestName").innerHTML = guest.nama;

    } else {

        document.getElementById("guestName").innerHTML = "Tamu tidak ditemukan";

    }

}

loadGuest();