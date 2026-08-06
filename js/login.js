const API_URL = CONFIG.API_URL;

async function login(){

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try{

        const res = await fetch(API_URL,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                action:"login",

                username,

                password

            })

        });

        const data = await res.json();

       if(data.success){

    localStorage.setItem("login","true");

    localStorage.setItem("user", JSON.stringify({

        username: data.username || username,

        role: data.role || "owner",

        name: data.name || username

    }));

    location.href="/dashboard";

        }else{

            alert("Username atau Password salah.");

        }

    }catch(err){

        console.log(err);

        alert("Tidak dapat terhubung ke server.");

    }

}