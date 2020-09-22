var token;

var login = {
    "email": "lala@123.com",
    "password": "123456"
}


function validarLogin () {
    var email = document.querySelector(".email");
    var senha = document.querySelector(".senha");

    if(email.value === "" || senha.value === ""){
        alert("Por favor preencha os campos corretamente!");
        return;
    }
    login.email = email.value;
    login.password = senha.value;
    enviarLoginServidor();
}

function enviarLoginServidor() {
    var elemento = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v1/buzzquizz/users", login);
    elemento.then(loginSucesso).catch(loginIncorreto);
    desabilitarBotao();
        
}

function desabilitarBotao(){
    var elemento = document.querySelector(".botao-login");
    elemento.disabled = true;
}

function habilitarBotao(){
    var elemento = document.querySelector(".botao-login");
    elemento.disabled = false;
}

function irParaTelaAdmin() {
    var elemento = document.querySelector(".login");
    elemento.style.visibility = "hidden";
    elemento = document.querySelector(".admin-quizzes");
    elemento.style.visibility = "visible";
    pegarTestesUser(token);
}

function loginSucesso (resposta){
    token = resposta.data.token;
    //header["User-Token"] = token;
    //console.log(header);
    irParaTelaAdmin();
    habilitarBotao();
}

function loginIncorreto (erro){
    if(erro.response.status === 401){
        alert("E-mail ou senha incorretos");
    }
    habilitarBotao();
}


function pegarTestesUser(token){
    var quizzes = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v1/buzzquizz/quizzes", { 
        headers: {
            "User-Token": token     
        }
    });
    quizzes.then(teste1).catch(teste2);
}

function teste1(resposta){
    console.log(resposta);
}

function teste2(erro){
    console.log(erro);
}

function criarQuiz(){
    var elemento = document.querySelector(".admin-quizzes");
    elemento.style.visibility = "hidden";
    elemento = document.querySelector(".criacao-quiz");
    elemento.style.visibility = "visible";   
}