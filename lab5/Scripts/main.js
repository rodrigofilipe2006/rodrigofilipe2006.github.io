//variaveis
const hoverText = document.querySelector('#hover p');
const colorText1 = document.querySelector('#colorButton p')

//funções
passaPorCima = (estado) => {
    //true = em cima
    //false = fora
    if(estado === true){
        hoverText.innerHTML = "1 - Obrigado por passares!"
    }else{
        hoverText.innerHTML = "1 - Passa por aqui"
    }
}

mudaCor = (cor) => {
    colorText1.style.color = cor
}

//Event listener

//1
hoverText.onmouseover = () => passaPorCima(true)
hoverText.onmouseout = () => passaPorCima(false)

//2

