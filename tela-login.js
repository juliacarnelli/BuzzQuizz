var token;
var listaQuizzes = [];
var listaPerguntas = [];

var contadorPerguntas = 2;
var contadorNiveis = 2;

var qqrcoisa;


var data = {
    "perguntas": [{
        "titulo": "Pergunta x",
        "respostas": [{
            "valor": "lalal",
            "url": "#",
            "correta": "1"//0 para incorretas 1 para correta
        }]
    }
    ]
}

var quiz = {
	"title": "Título do meu quizz",
	"data": data,
}

listaQuizzes.push(quiz);
renderizarQuizzesAdmin();



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
    var quizzes = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v1/buzzquizz/quizzes", { params:{},
        headers: {
            'User-Token': token     
        }
    });
    quizzes.then(adicionarTestesUser).catch(erroPegarTeste);
}

function adicionarTestesUser(resposta){
    console.log(resposta);
    for (var i = 0; i < resposta.data.length; i++){
        listaQuizzes.push(resposta.data);
    }
    console.log(listaQuizzes);
    renderizarQuizzesAdmin();
}

function erroPegarTeste(erro){
    console.log(erro);
}

function renderizarQuizzesAdmin(){
    var container = document.querySelector(".container-cartas");
    for(var i = 0; i < listaQuizzes.length; i++){
        var elemento = document.createElement("li");
        elemento.innerHTML = "<p>" + listaQuizzes[i].title + "</p>"; 
        elemento.classList.add("cartas");
        elemento.setAttribute("onclick", "abrirQuiz(this)")
        container.appendChild(elemento);
    }
    console.log(listaQuizzes);
}

function criarQuiz(){
    var elemento = document.querySelector(".admin-quizzes");
    elemento.style.visibility = "hidden";
    elemento = document.querySelector(".criacao-quiz");
    elemento.style.visibility = "visible";   
}

function adicionarPerguntas (){

    var contadorRespostas = 1;
    var container = document.querySelector(".lista-perguntas");
    var elemento = document.createElement("li");
    elemento.innerHTML = "<p class='num-pergunta'>Pergunta "+ contadorPerguntas++ +"</p>";
    elemento.innerHTML += "<input placeholder='Digite a Pergunta' class='enunciado-pergunta'></input>";
    elemento.innerHTML += "<div class='resposta-e-imagem'><input type='text' placeholder='Digite a Resposta Correta' class='resposta-pergunta correta'><input type='text' placeholder='Link imagem correta' class='resposta-pergunta correta'></div>";
    while (contadorRespostas < 4){
        elemento.innerHTML += "<div class='resposta-e-imagem'><input type='text' placeholder='Digite a Resposta Errada " + contadorRespostas + "' class='resposta-pergunta errada'><input type='text' placeholder='Link imagem errada " + contadorRespostas + "' class='resposta-pergunta errada'></div>";
        contadorRespostas++;
    }

    elemento.classList.add("perguntas");

    container.appendChild(elemento);
}

function adicionarNiveis (){

    var container = document.querySelector(".niveis-acerto");
    var elemento = document.createElement("li");
    elemento.innerHTML = "<p class='num-pergunta'>Nivel " + contadorNiveis++ +"</p>";
    elemento.innerHTML += "<div class='entre-acertos'><input type='text' placeholder='Minima % de acerto do nível' class='resposta-pergunta'><input type='text' placeholder='Máxima % de acerto do nivel' class='resposta-pergunta'></div>";
    elemento.innerHTML += "<input placeholder='Titulo do Nivel' class='titulo-nivel'>";
    elemento.innerHTML += "<input placeholder='Link da imagem do nivel' class='url-img-nivel'>";
    elemento.innerHTML += "<input placeholder='Descricao do nivel' class='descricao-nivel'>"

    elemento.classList.add("perguntas");

    container.appendChild(elemento);
}


function pegarPergunta() {
    return document.querySelector(".enunciado-pergunta").value;
}

function pegarResposta() {
    var perg = 0;
    var resp = 0;
    var elemento = document.querySelectorAll(".resposta-e-imagem input");

        console.log( data);
        console.log( data.perguntas[perg]);
        console.log( data.perguntas[perg].respostas[resp]);
        console.log( data.perguntas[perg].respostas[resp].valor);
        console.log(elemento[0].value);
    for(i=0; i<elemento.length; i++){
        data.perguntas[perg].respostas[resp].valor = elemento[i++].value;
        data.perguntas[perg].respostas[resp].url = elemento[i].value;
        if(i === 2){
            data.perguntas[perg].respostas[resp++].correta = 1;
        } else{
            data.perguntas[perg].respostas[resp++].correta = 0;
        }

        if(resp === 3){
            resp = 0;
            perg++;
        }
    }
}
 
function enviarQuiz(){
    for(var i = 1; i < contadorPerguntas; i++){
        data.perguntas.titulo = pegarPergunta();
    }
    pegarResposta();
}
