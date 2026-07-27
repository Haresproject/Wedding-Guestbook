const id = new URLSearchParams(location.search).get("id");

document.getElementById("guestName").innerHTML = id;