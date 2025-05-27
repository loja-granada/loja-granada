// Lista de produtos disponíveis
const produtos = [
  { nome: "Camisa Verde", categoria: "Roupa", descricao: "Camisa totalmente verde", imagem: "img/camisaverde.png", valor: 50 },
  { nome: "Camisa Preta", categoria: "Roupa", descricao: "Camisa de cor preta com verde", imagem: "img/camisapreta.png", valor: 55 },
  { nome: "Camisa Branca", categoria: "Roupa", descricao: "Camisa branca com as mangas verdes", imagem: "img/camisabranca.png", valor: 60 },
  { nome: "Garrafa Granada", categoria: "Acessório", descricao: "Garrafa personalizada da A.A.A Granada", imagem: "img/1.png", valor: 30 },
  { nome: "Copo Granada", categoria: "Acessório", descricao: "Copo + tirante personalizados da A.A.A Granada", imagem: "img/copo.png", valor: 40 },
  { nome: "Moletom Branco", categoria: "Roupa", descricao: "", imagem: "img/1.png", valor: 120 }
];

// Função para exibir os cards dos produtos
function mostrarCards(listaProdutos) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = ""; // Limpa o container antes de preencher

  listaProdutos.forEach(produto => {
    // Cria o card do produto
    const card = document.createElement("div");
    card.classList.add("card", "m-2", "produto-card");
    card.style.width = "18rem";

    // Guarda informações nos atributos dataset para uso posterior
    card.dataset.nome = produto.nome;
    card.dataset.categoria = produto.categoria;
    card.dataset.tamanho = "";
    card.dataset.valor = produto.valor;

    // Conteúdo HTML do card, incluindo botões para selecionar e tamanhos (se for roupa)
    card.innerHTML = `
      <img class="card-img-top" src="${produto.imagem}" alt="Imagem de ${produto.nome}" />
      <div class="card-body d-flex flex-column">
        <div>
          <h5 class="card-title">${produto.nome}</h5>
          <p class="card-text">${produto.descricao}</p>
          <p><b>R$ ${produto.valor.toFixed(2)}</b></p>
        </div>
        <div>
          <button class="btn btn-outline-primary btn-sm btn-selecionar" type="button">Selecionar</button>
          ${produto.categoria === "Roupa" ? `
            <div class="tamanhos mt-2">
              <p class="descricao_texto mb-1">Tamanho</p>
              <button class="btn btn-outline-secondary btn-sm btn-tamanho" type="button">P</button>
              <button class="btn btn-outline-secondary btn-sm btn-tamanho" type="button">M</button>
              <button class="btn btn-outline-secondary btn-sm btn-tamanho" type="button">G</button>
              <button class="btn btn-outline-secondary btn-sm btn-tamanho" type="button">GG</button>
            </div>
          ` : ""}
        </div>
      </div>
    `;

    // Botão de selecionar produto
    const btnSelecionar = card.querySelector(".btn-selecionar");
    // Botões de tamanhos para roupas
    const botoesTamanho = card.querySelectorAll(".btn-tamanho");

    // Toggle seleção do produto
    btnSelecionar.addEventListener("click", () => {
      card.classList.toggle("selecionado");
      // Se desmarcar, limpa tamanho selecionado e botão ativo
      if (!card.classList.contains("selecionado")) {
        card.dataset.tamanho = "";
        botoesTamanho.forEach(b => b.classList.remove("active"));
      }
      atualizarSelecionados();
      esconderErro();
    });

    // Selecionar tamanho — ativa só um botão e atualiza dataset
    botoesTamanho.forEach(botao => {
      botao.addEventListener("click", () => {
        botoesTamanho.forEach(b => b.classList.remove("active"));
        botao.classList.add("active");
        card.dataset.tamanho = botao.textContent;
        atualizarSelecionados();
        esconderErro();
      });
    });

    container.appendChild(card);
  });
}

// Atualiza a lista de produtos selecionados e campos ocultos para envio
function atualizarSelecionados() {
  const selecionados = Array.from(document.querySelectorAll(".produto-card.selecionado"));

  // Nomes com tamanho para roupas, só nome para acessórios
  const nomes = selecionados.map(card =>
    card.dataset.categoria === "Roupa"
      ? `${card.dataset.nome} - ${card.dataset.tamanho || "Sem tamanho"}`
      : card.dataset.nome
  );

  // Lista de tamanhos para envio, só para roupas
  const tamanhos = selecionados
    .map(card =>
      card.dataset.categoria === "Roupa" ? `${card.dataset.nome}: ${card.dataset.tamanho || "Sem tamanho"}` : ""
    ).filter(t => t !== "");

  // Atualiza visual e campos ocultos do formulário
  document.getElementById("produtosSelecionados").innerHTML = nomes.map(n => `<li class="list-group-item">${n}</li>`).join("");
  document.getElementById("produtosInput").value = nomes.join(", ");
  document.getElementById("tamanhosInput").value = tamanhos.join(", ");

  atualizarValorTotal();
}

// Atualiza o valor total dos produtos selecionados e exibe na página
function atualizarValorTotal() {
  const selecionados = Array.from(document.querySelectorAll(".produto-card.selecionado"));
  let total = 0;
  selecionados.forEach(card => total += parseFloat(card.dataset.valor));

  let el = document.getElementById("totalPedido");
  if (!el) {
    el = document.createElement("p");
    el.id = "totalPedido";
    el.classList.add("mt-3", "font-weight-bold");
    document.querySelector(".container.mt-4").appendChild(el);
  }
  el.textContent = `Valor total: R$ ${total.toFixed(2)}`;
}

// Pesquisa produtos por nome ou categoria
function pesquisarProduto(event) {
  event.preventDefault();
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const resultadoDiv = document.getElementById("searchResult");
  resultadoDiv.innerHTML = "";

  if (!query) {
    resultadoDiv.innerHTML = "<p>Digite algo para pesquisar.</p>";
    mostrarCards(produtos);
    return false;
  }

  const resultados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(query) || produto.categoria.toLowerCase().includes(query)
  );

  if (resultados.length === 0) {
    resultadoDiv.innerHTML = "<p>Nenhum produto encontrado.</p>";
    return false;
  }

  resultadoDiv.innerHTML = `<p><b>${resultados.length}</b> produto(s) encontrado(s):</p>`;
  mostrarCards(resultados);
  return false;
}

// Valida o formulário antes do envio
function validarFormulario() {
  const selecionados = Array.from(document.querySelectorAll(".produto-card.selecionado"));
  const erro = document.getElementById("mensagemErro");
  erro.style.display = "none";

  if (selecionados.length === 0) {
    erro.textContent = "Por favor, selecione pelo menos um produto.";
    erro.style.display = "block";
    return false;
  }

  // Verifica se para roupas o tamanho está selecionado
  for (const card of selecionados) {
    if (card.dataset.categoria === "Roupa" && !card.dataset.tamanho) {
      erro.textContent = `Selecione o tamanho para a roupa "${card.dataset.nome}".`;
      erro.style.display = "block";
      return false;
    }
  }

  return true;
}

// Esconde mensagens de erro
function esconderErro() {
  const erro = document.getElementById("mensagemErro");
  erro.style.display = "none";
  erro.textContent = "";
}

// Inicializa exibindo todos os produtos
mostrarCards(produtos);

// Código para envio do formulário e exibição do modal de sucesso
const form = document.getElementById('pedidoForm');
const modal = $('#sucessoModal'); // modal via jQuery + Bootstrap

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Valida formulário
  if (!validarFormulario()) return;

  const dados = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: dados,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      form.reset(); // limpa formulário
      // Exibe o modal de sucesso
      modal.modal('show');
    } else {
      alert('Erro ao enviar o pedido. Tente novamente mais tarde.');
    }
  } catch (error) {
    alert('Erro na conexão. Tente novamente mais tarde.');
  }
});
