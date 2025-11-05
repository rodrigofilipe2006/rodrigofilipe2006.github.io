//Variaveis
const apiUrl = 'https://deisishop.pythonanywhere.com/products';

const produtos = [];

let produtosSelecionados = new Array(60)

if(!localStorage.getItem('produtos-selecionados')){
    localStorage.setItem('produtos-selecionados',produtosSelecionados);
}else{
    produtosSelecionados = localStorage.getItem('produtos-selecionados');
}





//Funções
fetch(apiUrl)
.then (response => response.json())
.then (data => {
    console.log(data);
    produtos.length = 0;  
    produtos.push(...data);
})



async function fetchProdutos() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}
const criarProduto = (produto) => {
    const article = document.createElement('article');
    article.className = 'produto';
    article.dataset.id = produto.id;

    
    const h2 = document.createElement('h2');
    h2.textContent = produto.title;

    const img = document.createElement('img');
    img.src = produto.image
    img.alt = produto.title 
    
    const desc = document.createElement('p');
    desc.textContent = produto.description;
    const precoErating = document.createElement('p');
    precoErating.textContent = `Preço: ${produto.price}€ | Rating: ${produto.rating.rate} (${produto.rating.count} avaliações)`;

    const comprarButton = document.createElement('button');
    comprarButton.textContent = 'Comprar';

    comprarButton.onclick = () => {
        criaProdutoCesto(produto)
        produtosSelecionados.push(...produto);
        localStorage.setItem('produtos-selecionados', produtosSelecionados);
    }

    article.appendChild(h2);
    article.appendChild(img);
    article.appendChild(desc);
    article.appendChild(precoErating);
    article.appendChild(comprarButton);
    

    return article;
}

const carregarProdutos = async () => {
  const container = document.getElementById('artigos')

  const data = await fetchProdutos();
  produtos.length = 0;
  produtos.push(...data);

  produtos.forEach(produto => {
    const el = criarProduto(produto);
    container.appendChild(el);
    console.log(`Id: ${produto.id} | Titulo: ${produto.title} | Preço: ${produto.price}
        Descrição: ${produto.description}`);
  });
};

const criaProdutoCesto = (produto) => {
    
}





//Event Listener
document.addEventListener('DOMContentLoaded', () => carregarProdutos());
