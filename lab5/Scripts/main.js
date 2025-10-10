//variaveis

//1
const hoverText = document.querySelector('#hover p');

//2
const colorText1 = document.querySelector('#colorButton p');
const buttons = document.querySelectorAll('#colorButton button');
const butaoRed = buttons[0];
const butaoGreen = buttons[1];
const butaoBlue = buttons[2];

//3


//4
const textoFundo = document.querySelector('#corFundo input')
const botaoFundo = document.querySelector('#corFundo button')

//5
const botaoConta = document.querySelector('#conta button')
const numeroConta = document.querySelector('#conta p:last-child')

//6


//7



//funções

//1
passaPorCima = (estado) => {
    //true = em cima
    //false = fora
    if(estado === true){
        hoverText.innerHTML = "1 - Obrigado por passares!"
    }else{
        hoverText.innerHTML = "1 - Passa por aqui"
    }
}

//2
mudaCorTexto = (cor) => {
    colorText1.style.color = cor
}

//3


//4

mudaCorFundo = (cor) => {
    document.body.style.backgroundColor = cor
}

//5
contador = () => {

    numeroConta.innerHTML  = parseInt(numeroConta.innerHTML) + 1
}

//6


//7



//Event listener

//1
hoverText.onmouseover = () => passaPorCima(true)
hoverText.onmouseout = () => passaPorCima(false)

//2
butaoRed.onclick = () => mudaCorTexto('red')
butaoGreen.onclick = () => mudaCorTexto('green')
butaoBlue.onclick = () => mudaCorTexto('blue')

//3


//4
botaoFundo.onclick = () => mudaCorFundo(textoFundo.value)

//5
botaoConta.onclick = () => contador()

//6


//7

