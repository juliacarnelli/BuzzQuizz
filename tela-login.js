var login = {
    "email": "lala@123.com",
    "password": "123456"
}


function validarLogin () {
    var email = document.querySelector(".email");
    var senha = document.querySelector(".senha");

    console.log(email.value);
    console.log(senha.value);
    if(email.value === "" || senha.value === ""){
        alert("Por favor preencha os campos corretamente!");
        return;
    }

    enviarLoginServidor();
}

function enviarLoginServidor() {
    var elemento
}