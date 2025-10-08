function passaPorCima() {
    document.getElementById("hover").innerHTML = "1 - Obrigado por passares!"
}

function saiDeCima() {
    document.getElementById("hover").innerHTML = "1 - Passa por aqui"
}

function mudarCor(cor,sitio){
    if(sitio == 1){
        corButao.style.color = cor
    }else{
        corTexto.style.color = cor
    }
    

    //sei que dava para fazer diretamente sem switch mas queria relembrar isto
    //p.s. afinal fiz
    /*switch(cor){
        case 'red':
            corButao.style.color = 'red'
        break;
        case 'green':
            corButao.style.color = 'green'
        break;
        case 'blue':
            corButao.style.color = 'blue'
        break;
    }*/
}

function contadeiro(){
    let numero = document.getElementById("numeroCount")
    numero.innerHTML = parseInt(numero.innerHTML) + 1

}