//Variaveis
import { produtos } from './produtos.js'; 


//Funções


const criarProduto = (produto) => {
    const article = document.createElement('article');
    article.className = 'produto';
    article.dataset.id = produto.id;

    
    const h2 = document.createElement('h2');
    h2.textContent = produto.title;

    const img = document.createElement('img');
    img.src = produto.image || 'assets/placeholder.png';
    img.alt = produto.title || 'Imagem do produto';

    
    const desc = document.createElement('p');
    desc.textContent = produto.description;
    const precoErating = document.createElement('p');
    precoErating.textContent = `Preço: ${produto.price}€ | Rating: ${produto.rating.rate} (${produto.rating.count} avaliações)`;

    const comprarButton = document.createElement('button');
    comprarButton.textContent = 'Comprar';

    article.appendChild(h2);
    article.appendChild(img);
    article.appendChild(desc);
    article.appendChild(precoErating);
    article.appendChild(comprarButton);
    

    return article;
}

const carregarProdutos = () => {
  const container = document.getElementById('artigos') || document.body;
  
  produtos.forEach(produto => {
    const el = criarProduto(produto);
    container.appendChild(el);
    console.log(`Id: ${produto.id} | Titulo: ${produto.title} | Preço: ${produto.price}
        Descrição: ${produto.description}`);
  });
};


//Event Listener
document.addEventListener('DOMContentLoaded', () => carregarProdutos());
