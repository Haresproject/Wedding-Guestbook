const API_URL = "https://wedguest.kosthandoko907.workers.dev";
async function loadStats(){

    const res = await fetch(API + "?action=stats");

    const data = await res.json();

    document.getElementById("total").innerHTML = data.total;
    document.getElementById("hadir").innerHTML = data.hadir;
    document.getElementById("belum").innerHTML = data.belum;

}

loadStats();