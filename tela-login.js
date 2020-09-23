var token;
var listaQuizzes = [];
var listaPerguntas = [];

var contadorPerguntas = 1;
var contadorNiveis = 1;

var qqrcoisa;

var responses = [];
var values = [];
var url = [];

var infoNiveis = [];

var min = [];
var max = [];
var titulonivel = [];
var urlnivel = [];
var descnivel = [];


var enunciados = [];
var enunciado;



var body = {
    "title": '',
    "data": {
    }
}


var data = {
    "perguntas": [{
        "titulo": "Pergunta x",
        "respostas": [{
            "valor": "lalal",
            "url": "#",
            "correta": "1"//0 para incorretas 1 para correta
        },
        {
            "valor": "lalal",
            "url": "#",
            "correta": "0"//0 para incorretas 1 para correta
        },
        {
            "valor": "lalal",
            "url": "#",
            "correta": "0"//0 para incorretas 1 para correta
        },
        {
            "valor": "lalal",
            "url": "#",
            "correta": "0"//0 para incorretas 1 para correta
        },
        ]
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

function finalizarQuiz(){
    var elemento = document.querySelector(".admin-quizzes");
    elemento.style.visibility = "visible";
    elemento = document.querySelector(".criacao-quiz");
    elemento.style.visibility = "hidden";   
}

function adicionarPerguntas (){

    var contadorRespostas = 1;
    contadorPerguntas++;
    var container = document.querySelector(".lista-perguntas");
    var elemento = document.createElement("li");
    elemento.innerHTML = "<p class='num-pergunta'>Pergunta "+ contadorPerguntas +"</p>";
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

    contadorNiveis++;
    var container = document.querySelector(".niveis-acerto");
    var elemento = document.createElement("li");
    elemento.innerHTML = "<p class='num-pergunta'>Nivel " + contadorNiveis +"</p>";
    elemento.innerHTML += "<div class='entre-acertos'><input type='text' placeholder='Minima % de acerto do nível' class='resposta-pergunta'><input type='text' placeholder='Máxima % de acerto do nivel' class='resposta-pergunta'></div>";
    elemento.innerHTML += "<input placeholder='Titulo do Nivel' class='titulo-nivel'>";
    elemento.innerHTML += "<input placeholder='Link da imagem do nivel' class='url-img-nivel'>";
    elemento.innerHTML += "<input placeholder='Descricao do nivel' class='descricao-nivel'>"

    elemento.classList.add("perguntas");

    container.appendChild(elemento);
}


function pegarTitulo() {
    return document.querySelector(".titulo").value;
}

function pegarResposta() {
    var elemento = document.querySelectorAll(".resposta-e-imagem input");
        for(i=0; i<elemento.length; i++){
            values.push(elemento[i].value);
            i++;
            url.push(elemento[i].value);
        }
}
 
function enviarQuiz(){
   var titulo = pegarTitulo();
   pegarResposta();
   var contador = 0

   body.title = titulo;

   for(var i = 0; i < contadorPerguntas; i++){
        listaPerguntas.push({});
        for (var j = 0; j < 4; j++){
            responses.push({});
            responses[j].valor = values[contador];
            responses[j].url = url[contador];
            if (j === 0){
                responses[j].correta = 1;
            } else{
                responses[j].correta = 0;
            }
            contador++;
       }
       listaPerguntas[i].enunciado = document.querySelectorAll(".enunciado-pergunta")[i].value;
       listaPerguntas[i].opcoes = responses;
       responses = [];
   }

   body.data.respostas = listaPerguntas;



   pegarMinMax();
   pegarTituloNivel();
   pegarURLNivel();
   pegarDescricaoNivel();

   for(i = 0; i < contadorNiveis; i++){
       infoNiveis.push({});
       infoNiveis[i].min = min[i];
       infoNiveis[i].max = max[i];
       infoNiveis[i].tituloNivel = titulonivel[i];
       infoNiveis[i].urlNivel = urlnivel[i];
       infoNiveis[i].descNivel = descnivel[i];
   }

   body.data.niveis = infoNiveis;
   console.log(body);
   
   
   //finalizarQuiz();
    
}


function pegarMinMax(){
    var elemento = document.querySelectorAll(".entre-acertos input");
    for(i=0; i<elemento.length; i++){
        min.push(elemento[i].value);
        i++;
        max.push(elemento[i].value);
    }

}
function pegarTituloNivel(){
    var elemento = document.querySelectorAll(".titulo-nivel");
    for(i=0; i<elemento.length; i++){
        titulonivel.push(elemento[i].value);
    }
}
function pegarURLNivel(){
    var elemento = document.querySelectorAll(".url-img-nivel");
    for(i=0; i<elemento.length; i++){
        urlnivel.push(elemento[i].value);
    }

}
function pegarDescricaoNivel(){
    var elemento = document.querySelectorAll(".descricao-nivel");
    for(i=0; i<elemento.length; i++){
        descnivel.push(elemento[i].value);
    }
}
