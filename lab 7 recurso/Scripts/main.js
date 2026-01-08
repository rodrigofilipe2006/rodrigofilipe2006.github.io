// Constantes API
const API_BASE = 'https://deisishop.pythonanywhere.com';
const ENDPOINT_PRODUTOS = `${API_BASE}/products`;
const ENDPOINT_CATEGORIAS = `${API_BASE}/categories`;
const ENDPOINT_BUY = `${API_BASE}/buy`;

// Estado global
let todosProdutos = [];
let produtosCesto = JSON.parse(localStorage.getItem('cesto-roupa-cromo')) || [];

// Elementos DOM
const artigosContainer = document.getElementById('artigos');
const cestoContainer = document.getElementById('cestoArtigos');
const selectOrdenacao = document.getElementById('ordenacao');
const inputPesquisa = document.getElementById('pesquisa');
const checkboxEstudante = document.getElementById('estudante');
const inputCupao = document.getElementById('cupao');
const inputNome = document.getElementById('nome-comprador');
const btnComprar = document.getElementById('btn-comprar');
const btnLimparCesto = document.getElementById('limpar-cesto');
const btnRemoverDuplicados = document.getElementById('remover-duplicados');
const precoTotalEl = document.getElementById('precoTotal');
const mensagemEl = document.getElementById('mensagem-compra');

// Funções auxiliares
function saveCesto() {
    localStorage.setItem('cesto-roupa-cromo', JSON.stringify(produtosCesto));
}

// Total bruto (sem descontos — backend aplica)
function calcularTotalBruto() {
    return produtosCesto.reduce((sum, p) => sum + Number(p.price), 0);
}

function atualizarTotal() {
    precoTotalEl.textContent = calcularTotalBruto().toFixed(2);
}

// Renderiza lista de produtos
function renderizarProdutos(lista) {
    artigosContainer.innerHTML = '';
    lista.forEach(prod => {
        const li = document.createElement('li');
        li.innerHTML = `
            <article>
                <h2>${prod.title}</h2>
                <img src="${API_BASE}/${prod.image}" alt="${prod.title}" loading="lazy">
                <p>${prod.description.substring(0, 120)}${prod.description.length > 120 ? '...' : ''}</p>
                <p><strong>${prod.price} €</strong> | ★ ${prod.rating.rate} (${prod.rating.count})</p>
                <button data-id="${prod.id}">Adicionar ao cesto</button>
            </article>
        `;
        li.querySelector('button').addEventListener('click', () => {
            produtosCesto.push({ ...prod });
            saveCesto();
            renderizarCesto();
            atualizarTotal();
        });
        artigosContainer.appendChild(li);
    });
}

// Renderiza cesto
function renderizarCesto() {
    cestoContainer.innerHTML = '';
    produtosCesto.forEach((prod, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <article>
                <h2>${prod.title}</h2>
                <img src="${API_BASE}/${prod.image}" alt="${prod.title}" loading="lazy">
                <p><strong>${prod.price} €</strong></p>
                <button data-index="${index}">Remover</button>
            </article>
        `;
        li.querySelector('button').addEventListener('click', () => {
            produtosCesto.splice(index, 1);
            saveCesto();
            renderizarCesto();
            atualizarTotal();
        });
        cestoContainer.appendChild(li);
    });
}

// Limpar cesto com mensagem (para o botão Limpar)
function limparCesto() {
    produtosCesto = [];
    saveCesto();
    renderizarCesto();
    atualizarTotal();
    mensagemEl.textContent = 'Cesto limpo!';
    mensagemEl.style.color = 'orange';
    setTimeout(() => mensagemEl.textContent = '', 2000);
}

// Limpar cesto sem mensagem (para após compra)
function limparCestoSilencioso() {
    produtosCesto = [];
    saveCesto();
    renderizarCesto();
    atualizarTotal();
}

// Remover duplicados
function removerDuplicados() {
    const unique = [];
    const seen = new Set();
    for (const prod of produtosCesto) {
        if (!seen.has(prod.id)) {
            seen.add(prod.id);
            unique.push(prod);
        }
    }
    produtosCesto = unique;
    saveCesto();
    renderizarCesto();
    atualizarTotal();
    mensagemEl.textContent = 'Duplicados removidos!';
    mensagemEl.style.color = 'lime';
    setTimeout(() => mensagemEl.textContent = '', 2000);
}

// Filtra e ordena
function aplicarFiltros() {
    let lista = [...todosProdutos];

    const selectItems = document.querySelector('#custom-categorias .select-items');
    const catCheckboxes = selectItems.querySelectorAll('input[type="checkbox"]:not([value="todas"])');
    const categoriasSelecionadas = Array.from(catCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    if (categoriasSelecionadas.length > 0) {
        lista = lista.filter(p => categoriasSelecionadas.includes(p.category));
    } else {
        lista = [];
    }

    const termo = inputPesquisa.value.toLowerCase().trim();
    if (termo) {
        lista = lista.filter(p => p.title.toLowerCase().includes(termo));
    }

    const ordem = selectOrdenacao.value;
    if (ordem === 'preco-asc') {
        lista.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (ordem === 'preco-desc') {
        lista.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (ordem === 'nome-asc') {
        lista.sort((a, b) => a.title.localeCompare(b.title));
    } else if (ordem === 'nome-desc') {
        lista.sort((a, b) => b.title.localeCompare(a.title));
    } else if (ordem === 'rating-asc') {
        lista.sort((a, b) => Number(a.rating.rate) - Number(b.rating.rate));
    } else if (ordem === 'rating-desc') {
        lista.sort((a, b) => Number(b.rating.rate) - Number(a.rating.rate));
    }

    renderizarProdutos(lista);
}

// Carrega categorias e produtos
async function inicializar() {
    try {
        const resCat = await fetch(ENDPOINT_CATEGORIAS);
        const categorias = await resCat.json();

        const selectItems = document.querySelector('#custom-categorias .select-items');
        const selectSelected = document.querySelector('#custom-categorias .select-selected');

        selectItems.innerHTML = '';

        const labelTodas = document.createElement('label');
        const checkTodas = document.createElement('input');
        checkTodas.type = 'checkbox';
        checkTodas.value = 'todas';
        checkTodas.checked = true;
        labelTodas.appendChild(checkTodas);
        labelTodas.appendChild(document.createTextNode(' Todas as categorias'));
        selectItems.appendChild(labelTodas);

        categorias.forEach(cat => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = cat.name;
            checkbox.checked = true;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + cat.name));
            selectItems.appendChild(label);
        });

        selectSelected.addEventListener('click', (e) => {
            e.stopPropagation();
            selectItems.classList.toggle('select-hide');
        });

        document.addEventListener('click', () => {
            selectItems.classList.add('select-hide');
        });

        selectItems.addEventListener('change', (e) => {
            const catCheckboxes = Array.from(selectItems.querySelectorAll('input[type="checkbox"]:not([value="todas"])'));
            const checkTodas = selectItems.querySelector('input[value="todas"]');

            if (e.target.value === 'todas') {
                catCheckboxes.forEach(cb => cb.checked = e.target.checked);
            } else {
                const selectedCount = catCheckboxes.filter(cb => cb.checked).length;

                if (!e.target.checked && selectedCount === categorias.length - 1) {
                    catCheckboxes.forEach(cb => cb.checked = false);
                    e.target.checked = true;
                    checkTodas.checked = false;
                } else {
                    checkTodas.checked = catCheckboxes.every(cb => cb.checked);
                }
            }

            const selecionadas = catCheckboxes.filter(cb => cb.checked).map(cb => cb.value);
            if (selecionadas.length === categorias.length) {
                selectSelected.textContent = 'Todas as categorias';
            } else if (selecionadas.length === 0) {
                selectSelected.textContent = 'Nenhuma categoria';
            } else {
                selectSelected.textContent = selecionadas.join(', ');
            }

            aplicarFiltros();
        });

        const resProd = await fetch(ENDPOINT_PRODUTOS);
        todosProdutos = await resProd.json();

        renderizarProdutos(todosProdutos);
        renderizarCesto();
        atualizarTotal();

    } catch (err) {
        console.error('Erro ao carregar dados da API', err);
        artigosContainer.innerHTML = '<p style="color:red">Erro ao carregar produtos.</p>';
    }
}

// Eventos dos botões do cesto
btnLimparCesto.addEventListener('click', limparCesto);
btnRemoverDuplicados.addEventListener('click', removerDuplicados);

// COMPRA — POST para /buy
btnComprar.addEventListener('click', async () => {
    if (produtosCesto.length === 0) {
        mensagemEl.textContent = 'O cesto está vazio!';
        mensagemEl.style.color = 'orange';
        return;
    }

    const nome = inputNome.value.trim();
    if (!nome) {
        mensagemEl.textContent = 'Insere o teu nome para concluir a compra!';
        mensagemEl.style.color = 'red';
        return;
    }

    const estudante = checkboxEstudante.checked;
    const cupaoInput = inputCupao.value.trim();
    const cupao = cupaoInput || "";

    // Total bruto para calcular poupança e percentagem
    const totalBruto = calcularTotalBruto();

    const body = {
        products: produtosCesto.map(p => p.id),
        student: estudante,
        coupon: cupao,
        name: nome
    };

    console.log('Enviando POST /buy com body:', body);

    try {
        const response = await fetch(ENDPOINT_BUY, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const resultado = await response.json();

        console.log('Resposta do /buy (status:', response.status, '):', resultado);

        if (!response.ok) {
            let erroMsg = resultado.error || resultado.message || JSON.stringify(resultado.detail || resultado);
            throw new Error(erroMsg);
        }

        // Mensagem base de sucesso
        let msg = `${resultado.message} Referência: ${resultado.reference || '—'} | Total final: ${resultado.totalCost} €`;

        // Calcula desconto se houver diferença
        const totalFinal = Number(resultado.totalCost);
        if (totalFinal < totalBruto) {
            const poupado = (totalBruto - totalFinal).toFixed(2);
            const percentagem = ((poupado / totalBruto) * 100).toFixed(1);

            let agradecimento = 'Desconto aplicado!';
            if (estudante) {
                agradecimento = 'Obrigado por seres estudante do DEISI!';
            }

            msg += `<br><strong>${agradecimento} Poupaste ${poupado} € (${percentagem}% de desconto).</strong>`;
        }

        mensagemEl.innerHTML = msg; // innerHTML para <br> e <strong>
        mensagemEl.style.color = 'lime';

        limparCestoSilencioso();

    } catch (err) {
        console.error('Erro na compra:', err);
        mensagemEl.textContent = `Erro na compra: ${err.message}`;
        mensagemEl.style.color = 'red';
    }
});

// Eventos de filtro
selectOrdenacao.addEventListener('change', aplicarFiltros);
inputPesquisa.addEventListener('input', aplicarFiltros);
checkboxEstudante.addEventListener('change', atualizarTotal);
inputCupao.addEventListener('input', atualizarTotal);

// Início
document.addEventListener('DOMContentLoaded', inicializar);