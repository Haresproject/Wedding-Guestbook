const id = new URLSearchParams(location.search).get("id");

// simpan ID tamu
localStorage.setItem("guest_id", id);

// ganti URL ini dengan URL undangan digital yang kamu beli
location.href = "https://UNDANGAN-KAMU.com";