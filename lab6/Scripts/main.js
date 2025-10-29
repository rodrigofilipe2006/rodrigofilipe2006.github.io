//Variaveis
import { produtos } from './produtos.js'; 


//Funções
const carregarProdutos = () => {
  produtos.forEach(produto => {
    console.log(`Id: ${produto.id} | Titulo: ${produto.title} | Preço: ${produto.price}
        Descrição: ${produto.description}`);
  });
};


//Event Listener
document.addEventListener('DOMContentLoaded', () => carregarProdutos(produtos));