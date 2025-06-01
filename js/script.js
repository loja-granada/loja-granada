// Lista de produtos disponíveis
const produtos = [
  {
    nome: "Camisa Preta Oficial - Atlética Granada",
    categoria: "Roupa",
    descricao: "Mostre seu orgulho e espírito esportivo com a Camisa Oficial da Atlética Granada! Desenvolvida para quem vive a intensidade das competições e a vibração da torcida, essa peça une conforto, estilo e identidade.",
    imagens: ["img/fcamisav.png", "img/ccamisav.jpg"],
    valor: 55
  },
  {
    nome: "Camisa Branca Oficial - Atlética Granada",
    categoria: "Roupa",
    descricao: "Mostre seu orgulho e espírito esportivo com a Camisa Oficial da Atlética Granada! Desenvolvida para quem vive a intensidade das competições e a vibração da torcida, essa peça une conforto, estilo e identidade.",
    imagens: ["img/fcamisab.jpeg", "img/ccamisab.jpeg"],
    valor: 55
  },
  {
    nome: "Kit Granada - Copo + Tirante",
    categoria: "Acessório",
    descricao: "Copo resistente, preto fosco, com estampa exclusiva e tirante personalizado — pronto pra festa, jogos e o rolê universitário.",
    imagens: ["img/copoetirante.jpeg"],
    valor: 45
  },
  {
    nome: "Copo Granada",
    categoria: "Acessório",
    descricao: "Copo preto fosco com estampa exclusiva da Atlética Granada. Resistente, estiloso e ideal para o rolê universitário",
    imagens: ["img/copo.jpg",],
    valor: 35
  },
  {
    nome: " Tirante Granada",
    categoria: "Acessório",
    descricao: " Perfeito para segurar seu copo com estilo nos jogos e eventos.",
    imagens: ["img/tirante.jpg"],
    valor: 15
  }
];

// Função para exibir os cards dos produtos
function mostrarCards(listaProdutos) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = ""; // Limpa o container antes de preencher

  listaProdutos.forEach(produto => {
    const card = document.createElement("div");
    card.classList.add("card", "m-2", "produto-card");
    card.style.width = "25rem";

    // Define atributos para uso posterior
    card.dataset.nome = produto.nome;
    card.dataset.categoria = produto.categoria;
    card.dataset.tamanho = "";
    card.dataset.valor = produto.valor;

    // Gerar o conteúdo de imagem: carrossel se houver mais de uma imagem
    let imagemHTML = "";
    if (produto.imagens.length > 1) {
      const carouselId = `carousel-${produto.nome.replace(/\s+/g, '')}`;
      imagemHTML = `
        <div id="${carouselId}" class="carousel slide" data-ride="carousel" data-interval="false">
          <div class="carousel-inner">
            ${produto.imagens.map((img, idx) => `
              <div class="carousel-item ${idx === 0 ? "active" : ""}">
                <img class="d-block w-100" src="${img}" alt="Imagem ${idx + 1} de ${produto.nome}">
              </div>`).join("")}
          </div>
          <a class="carousel-control-prev" href="#${carouselId}" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Anterior</span>
          </a>
          <a class="carousel-control-next" href="#${carouselId}" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Próximo</span>
          </a>
        </div>`;
    } else {
      // Se só tiver uma imagem
      imagemHTML = `<img class="card-img-top" src="${produto.imagens[0]}" alt="${produto.nome}">`;
    }

    // Conteúdo HTML do card
    card.innerHTML = `
      ${imagemHTML}
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
    const botoesTamanho = card.querySelectorAll(".btn-tamanho");

    // Lógica ao clicar em "Selecionar"
    btnSelecionar.addEventListener("click", () => {
      card.classList.toggle("selecionado");

      if (!card.classList.contains("selecionado")) {
        card.dataset.tamanho = "";
        botoesTamanho.forEach(b => b.classList.remove("active"));
      }

      atualizarSelecionados();
      esconderErro();
    });

    // Lógica para selecionar tamanho de roupa
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

// Atualiza lista de produtos selecionados e campos ocultos do formulário
function atualizarSelecionados() {
  const selecionados = Array.from(document.querySelectorAll(".produto-card.selecionado"));

  const nomes = selecionados.map(card =>
    card.dataset.categoria === "Roupa"
      ? `${card.dataset.nome} - ${card.dataset.tamanho || "Sem tamanho"}`
      : card.dataset.nome
  );

  const tamanhos = selecionados
    .map(card =>
      card.dataset.categoria === "Roupa" ? `${card.dataset.nome}: ${card.dataset.tamanho || "Sem tamanho"}` : ""
    ).filter(t => t !== "");

  // Atualiza o visual da lista e os inputs ocultos
  document.getElementById("produtosSelecionados").innerHTML = nomes.map(n => `<li class="list-group-item">${n}</li>`).join("");
  document.getElementById("produtosInput").value = nomes.join(", ");
  document.getElementById("tamanhosInput").value = tamanhos.join(", ");

  atualizarValorTotal();
}

// Calcula e exibe o valor total dos produtos selecionados
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

// Função de busca por nome ou categoria
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

// Valida se produtos foram selecionados e se roupas têm tamanho
function validarFormulario() {
  const selecionados = Array.from(document.querySelectorAll(".produto-card.selecionado"));
  const erro = document.getElementById("mensagemErro");
  erro.style.display = "none";

  if (selecionados.length === 0) {
    erro.textContent = "Por favor, selecione pelo menos um produto.";
    erro.style.display = "block";
    return false;
  }

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

// Mostra os produtos assim que a página carrega
mostrarCards(produtos);

// Envio do formulário e exibição de modal
const form = document.getElementById('pedidoForm');
const modal = $('#sucessoModal'); // Modal via jQuery

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validarFormulario()) return;

  const dados = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: dados,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      form.reset();
      modal.modal('show');

      // Limpa seleção de produtos após envio
      const selecionados = document.querySelectorAll('.card.selecionado');
      selecionados.forEach(card => card.classList.remove('selecionado'));
      atualizarSelecionados();
    } else {
      alert('Erro ao enviar o pedido. Tente novamente mais tarde.');
    }
  } catch (error) {
    alert('Erro na conexão. Tente novamente mais tarde.');
  }
});
