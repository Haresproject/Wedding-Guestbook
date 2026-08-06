function getUser(){

    const user = localStorage.getItem("user");

    if(!user){

        return null;

    }

    return JSON.parse(user);

}

function isLogin(){

    return localStorage.getItem("login") === "true";

}

function logout(){

    localStorage.removeItem("login");
    localStorage.removeItem("user");

    location.href = "index.html";

}