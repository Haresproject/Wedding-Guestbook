const API =
"https://script.google.com/macros/s/AKfycbxypLyJtFO5DdrkBFHPEE6fGqG8HvHyubI4hxfN4jcb00m5auniNEjIvpfQLrFs5Y7P/exec";

async function loadStats(){

    const res = await fetch(API + "?action=stats");

    const data = await res.json();

    document.getElementById("total").innerHTML = data.total;
    document.getElementById("hadir").innerHTML = data.hadir;
    document.getElementById("belum").innerHTML = data.belum;

}

loadStats();