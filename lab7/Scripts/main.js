//Variaveis
const apiUrl = 'https://deisishop.pythonanywhere.com/products';

const produtos = [];

const loadSelecionados = () => {
  try {
    const raw = localStorage.getItem('produtos-selecionados');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Erro ao ler produtos-selecionados:', e);
    localStorage.removeItem('produtos-selecionados');
    return [];
  }
};
const saveSelecionados = (arr) => {
  localStorage.setItem('produtos-selecionados', JSON.stringify(arr));
};

let produtosSelecionados = loadSelecionados();





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
    comprarButton.addEventListener('click', () => {
        addToCesto(produto);
    });


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

const addToCesto = (produto) => {
  // adiciona uma cópia para evitar referências
  produtosSelecionados.push(JSON.parse(JSON.stringify(produto)));
  saveSelecionados(produtosSelecionados);
  renderCesto();
};

const removeFromCesto = (productId) => {
  const idx = produtosSelecionados.findIndex(p => p.id == productId);
  if (idx > -1) {
    produtosSelecionados.splice(idx, 1);
    saveSelecionados(produtosSelecionados);
    renderCesto();
  }
};

const renderCesto = () => {
  const cestoContainer = document.getElementById('cestoArtigos');
  if (!cestoContainer) {
    console.warn('#cestoArtigos não encontrado');
    return;
  }
  cestoContainer.innerHTML = '';
  produtosSelecionados.forEach(produto => {
    const article = document.createElement('article');
    article.className = 'produto';
    article.dataset.id = produto.id;

    const h2 = document.createElement('h2');
    h2.textContent = produto.title;

    const img = document.createElement('img');
    img.src = produto.image || 'assets/placeholder.png';
    img.alt = produto.title || '';

    const desc = document.createElement('p');
    desc.textContent = produto.description || '';

    const precoErating = document.createElement('p');
    const rate = produto.rating?.rate ?? '';
    const count = produto.rating?.count ?? '';
    precoErating.textContent = `Preço: ${produto.price ?? ''}€${rate ? ` | Rating: ${rate} (${count} avaliações)` : ''}`;

    const removerBtn = document.createElement('button');
    removerBtn.textContent = 'Remover';
    removerBtn.addEventListener('click', () => removeFromCesto(produto.id));

    article.appendChild(h2);
    article.appendChild(img);
    article.appendChild(desc);
    article.appendChild(precoErating);
    article.appendChild(removerBtn);

    cestoContainer.appendChild(article);
  });
};




//event listener
document.addEventListener('DOMContentLoaded', async () => {
  await carregarProdutos();
  renderCesto();
});