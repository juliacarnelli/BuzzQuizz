var token;
var listaQuizzes = [];
var listaPerguntas = [];

var contadorPerguntas = 1;
var contadorNiveis = 1;
var contadorQuizz = 0;

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

var acertosJogador = 0;


var enunciados = [];
var enunciado;

var indiceQuizz;


var bodies = [];
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
    listaQuizzes = [];
    for (var i = 0; i < resposta.data.length; i++){
        listaQuizzes.push(resposta.data[i]);
    }
    renderizarQuizzesAdmin();
}

function erroPegarTeste(erro){
    console.log(erro);
}

function renderizarQuizzesAdmin(){
    var container = document.querySelector(".container-cartas");
    container.innerHTML = "<li class='carta-adicionar-quizzes' onclick='criarQuiz()'><p>Novo</p><p>Quizz</p><ion-icon name='add-circle'></ion-icon></li>";  
    for(var i = 0; i < listaQuizzes.length; i++){
        var elemento = document.createElement("li");
        elemento.innerHTML = "<p id='' >" + listaQuizzes[i].title + "</p>"; 
        elemento.classList.add("cartas");
        elemento.setAttribute("onclick", "abrirQuiz(this)");
        elemento.setAttribute("id", listaQuizzes[i].id);
        container.appendChild(elemento);
    }
}

function criarQuiz(){
    var elemento = document.querySelector(".admin-quizzes");
    elemento.style.visibility = "hidden";
    elemento = document.querySelector(".criacao-quiz");
    elemento.style.visibility = "visible";   
}

function finalizarQuiz(){
    pegarTestesUser(token);
     var elemento = document.querySelector(".admin-quizzes");
    elemento.style.visibility = "visible";
    elemento = document.querySelector(".criacao-quiz");
    elemento.style.visibility = "hidden";  
    window.scrollTo(0, 0);
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
    var titulo = document.querySelector(".titulo").value;
    titulo = titulo.trim();
    var titulo2 = titulo.charAt(0).toUpperCase() + titulo.slice(1);
    return titulo2;
}

function pegarResposta() {
    var elemento = document.querySelectorAll(".resposta-e-imagem input");
        for(i=0; i<elemento.length; i++){
            var valor = elemento[i].value;
            valor = valor.trim();
            var valor2 = valor.charAt(0).toUpperCase() + valor.slice(1);
            values.push(valor2);
            i++;
            url.push(elemento[i].value);
        }
}
 
function enviarQuiz(){
   var titulo = pegarTitulo();
   pegarResposta();
   var contador = 0;
   var dadosIncorretos = 0;


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
       var enun = document.querySelectorAll(".enunciado-pergunta")[i].value;
       enun = enun.trim();
       var enun2 = enun.charAt(0).toUpperCase() + enun.slice(1);
       console.log("indice" + enun2.indexOf("?"));
       console.log("ultimo indice" + enun2.lastIndexOf("?"));
       if(enun2.lastIndexOf("?") == -1){
           alert("ajeita os dados");
           dadosIncorretos = 1;
       }
       else if (enun2.indexOf("?") !== enun2.lastIndexOf("?")){
            alert("ajeita os dados");
            dadosIncorretos = 1;
       }
       

       listaPerguntas[i].enunciado = enun2;
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
   bodies.push(body);

   if(dadosIncorretos === 1 ){
       criarQuiz();
   } else{
    registrarQuiz();
    finalizarQuiz();
   }
    
}

function registrarQuiz(){
    var postQuiz = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v1/buzzquizz/quizzes", body,
        {headers: {
            'User-Token': token,
            "Content-Type": "application/json"     
}});

    postQuiz.then(teste1).catch(teste2);

}

function teste1(resposta){
    console.log("elalala" + resposta.data);
}

function teste2(resposta){
    console.log("fail");
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
        var titulo = elemento[i].value;
        titulo = titulo.trim();
        var titulo2 = titulo.charAt(0).toUpperCase() + titulo.slice(1);
        titulonivel.push(titulo2);
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
        var desc = elemento[i].value;
        desc = desc.trim();
        var desc2 = desc.charAt(0).toUpperCase() + desc.slice(1);
        descnivel.push(desc2);
    }
}

function abrirQuiz(elemento){
    contadorPerguntas = 0;
    acertosJogador = 0;
    for(var i = 0; i < listaQuizzes.length; i++){
        if(elemento.id == listaQuizzes[i].id){
                indiceQuizz = i;
        } 
    }
    abrirTelaQuiz(); 
}

var ordemPerguntas = 0;
function abrirTelaQuiz (){
    window.scrollTo(0,0);
    var elemento = document.querySelector(".admin-quizzes");
    elemento.style.visibility = "hidden";
    elemento = document.querySelector(".interface-quizz");
    elemento.style.visibility = "visible"; 
    elemento = document.querySelector(".interface-titulo h3");
    elemento.innerText = listaQuizzes[indiceQuizz].title;
    renderizarEnunciado();
    
    contDistribuicao = 0;
    k = 0;
    distribuirRespostas();

}

function renderizarEnunciado(){
    elemento = document.querySelector(".interface-pergunta");
    elemento.innerText = listaQuizzes[indiceQuizz].data.respostas[ordemPerguntas].enunciado;
    var container = document.querySelectorAll(".interface-resposta");
    for(i = 0; i < container.length; i++){
        container[i].style.background = "white";
    }
}

var aleatoriedade = [0,0,0,0];
var indiceCorreta;

function distribuirRespostas(){
    var containerImg = document.querySelectorAll(".interface-resposta img");
    var containerResp = document.querySelectorAll(".interface-resposta p");
    var indiceAleatorio;
    var contDistribuicao = 0;
    var k = 0;
    indiceCorreta = -1;
    while(contDistribuicao < 4){
        indiceAleatorio = getRandomIntInclusive(0,3);
        if(aleatoriedade[indiceAleatorio] === 0){
            containerImg[k].src = listaQuizzes[indiceQuizz].data.respostas[ordemPerguntas].opcoes[indiceAleatorio].url;
            containerResp[k].innerText = listaQuizzes[indiceQuizz].data.respostas[ordemPerguntas].opcoes[indiceAleatorio].valor;
            if(listaQuizzes[indiceQuizz].data.respostas[ordemPerguntas].opcoes[indiceAleatorio].correta === 1){
                indiceCorreta = k;
            }
            aleatoriedade[indiceAleatorio] = 1;
            contDistribuicao++;
            k++;
        }   
    }      
}

contadorAuxiliar = 0;

function proximaPergunta(elemento) {
    aleatoriedade = [0,0,0,0];
    contDistribuicao = 0;
    k = 0;
    ordemPerguntas++;
    elemento.setAttribute("id", "escolhida");
    conferirAcertos();
    tornarVerdeouVermelho();
    if(contadorAuxiliar < listaQuizzes[indiceQuizz].data.respostas.length - 1){
        setTimeout(renderizarEnunciado, 2000)
        setTimeout(distribuirRespostas, 2000);
        contadorAuxiliar++;
    }
    else{
        setTimeout(abrirResultado,2000);
    }

    elemento.setAttribute("id", "");

}

var opcoesEscolhidas;

function conferirAcertos(){
    opcoesEscolhidas = -1;
    var elemento = document.querySelectorAll(".interface-resposta");
    for (var i = 0; i < elemento.length; i++){
        if(elemento[i].id == "escolhida"){
            opcoesEscolhidas = i;
        }
    }
}

function abrirResultado(){
    calculoResultado();
    var elemento = document.querySelector(".results");
    elemento.style.visibility = "visible";
    elemento = document.querySelector(".interface-quizz");
    elemento.style.visibility = "hidden";  
    qualNivel();
}

function qualNivel(){
    for (var i = 0; i < listaQuizzes[indiceQuizz].data.niveis.length; i++){
        console.log(i);
        console.log(listaQuizzes[indiceQuizz].data.niveis[i]);
        if(percentualAcerto >= listaQuizzes[indiceQuizz].data.niveis[i].min && percentualAcerto <= listaQuizzes[indiceQuizz].data.niveis[i].max){
            console.log(listaQuizzes[indiceQuizz].data.niveis[i]);
            renderizarInfoNivel(i);
        } else{
        }
    }
}

function renderizarInfoNivel(indice){
    var elemento = document.querySelector(".titulo-resposta h3");
    elemento.innerText = listaQuizzes[indiceQuizz].title;

    elemento = document.querySelector(".acertos");
    elemento.innerHTML = "<p>Você acertou " + acertosJogador + " de " + listaQuizzes[indiceQuizz].data.respostas.length + " perguntas!</p><p>Score: " + percentualAcerto + "%</p>";
    
    elemento = document.querySelector(".texto-resposta-resultado h4");
    elemento.innerText = listaQuizzes[indiceQuizz].data.niveis[indice].tituloNivel;

    elemento = document.querySelector(".texto-resposta-resultado p");
    elemento.innerText = listaQuizzes[indiceQuizz].data.niveis[indice].descNivel;

    elemento = document.querySelector(".foto-resultado");
    //elemento.innerText = listaQuizzes[indiceQuizz].data.niveis[indice].descNivel;
    elemento.setAttribute("src", listaQuizzes[indiceQuizz].data.niveis[indice].urlNivel);
}

var percentualAcerto;

function calculoResultado(){
    console.log("perguntastotal" + listaQuizzes[indiceQuizz].data.respostas.length);
    percentualAcerto = acertosJogador * 100/listaQuizzes[indiceQuizz].data.respostas.length;
    console.log(percentualAcerto);
    percentualAcerto = Math.round(percentualAcerto);
    console.log(percentualAcerto);
}

function tornarVerdeouVermelho(){
    var containerImg = document.querySelectorAll(".interface-resposta");
    console.log("indiceCorreta", indiceCorreta);
    console.log("OPCOEsescolhidas", opcoesEscolhidas);
    for(i = 0; i < containerImg.length; i++){
        if(i === indiceCorreta){
            containerImg[i].style.background = "#d4fcc3";
        }
        else{
            containerImg[i].style.background = "#ffc9b9";
        }
    }
    if(opcoesEscolhidas === indiceCorreta){
        acertosJogador++;
        console.log("acertos jogador" + acertosJogador);
    }
}

//funcao para gerar numero aleatorio; Auxiliar na distribuicao das respostas
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }