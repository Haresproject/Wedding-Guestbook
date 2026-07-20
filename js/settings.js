const API_URL = "https://script.google.com/macros/s/AKfycbxypLyJtFO5DdrkBFHPEE6fGqG8HvHyubI4hxfN4jcb00m5auniNEjIvpfQLrFs5Y7P/exec";

// ================= LOAD SETTINGS =================

async function loadSettings(){

    try{

        const res = await fetch(API_URL + "?action=settings");

        const data = await res.json();

        document.getElementById("bride").value = data.bride || "";
        document.getElementById("groom").value = data.groom || "";
        document.getElementById("venue").value = data.venue || "";
        document.getElementById("logo").value = data.logo || "";
        document.getElementById("background").value = data.background || "";
        document.getElementById("theme").value = data.theme || "emerald";
        applyTheme(data.theme || "emerald");

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

    venue:document.getElementById("venue").value,

    logo:document.getElementById("logo").value,

    background:document.getElementById("background").value,

    theme:document.getElementById("theme").value

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
document
.getElementById("theme")
.addEventListener("change", function(){

    applyTheme(this.value);

});

function applyTheme(theme){

    const themes = {

        emerald:{
            primary:"#214E43",
            secondary:"#2f6a5c",
            accent:"#E8C547"
        },

        gold:{
            primary:"#B8860B",
            secondary:"#D4AF37",
            accent:"#F5DEB3"
        },

        rosegold:{
            primary:"#B76E79",
            secondary:"#D98C99",
            accent:"#F4D6CC"
        },

        royalblue:{
            primary:"#1E3A8A",
            secondary:"#2563EB",
            accent:"#60A5FA"
        },

        black:{
            primary:"#222222",
            secondary:"#444444",
            accent:"#C9A227"
        }

    };

    const c = themes[theme];

    document.documentElement.style
        .setProperty("--primary", c.primary);

    document.documentElement.style
        .setProperty("--secondary", c.secondary);

    document.documentElement.style
        .setProperty("--accent", c.accent);

}
// ================= PREVIEW LOGO =================

document
.getElementById("logoFile")
.addEventListener("change",function(){

    const file=this.files[0];

    if(!file) return;

    const reader=new FileReader();

    reader.onload=function(e){

        const img=document.getElementById("logoPreview");

        img.src=e.target.result;

        img.style.display="block";

    };

    reader.readAsDataURL(file);

});

// ================= PREVIEW BACKGROUND =================

document
.getElementById("bgFile")
.addEventListener("change",function(){

    const file=this.files[0];

    if(!file) return;

    const reader=new FileReader();

    reader.onload=function(e){

        const img=document.getElementById("bgPreview");

        img.src=e.target.result;

        img.style.display="block";

    };

    reader.readAsDataURL(file);

});