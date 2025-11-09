// ================= MENU HOVER =================
// Destaca o item do menu quando o mouse passa por cima
let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => item.classList.remove("hovered")); // remove destaque de todos
  this.classList.add("hovered"); // adiciona destaque ao item atual
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));


// ================= MENU TOGGLE =================
// Abrir/fechar o menu lateral e ajustar a área principal
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active"); // alterna menu lateral
  main.classList.toggle("active");       // ajusta conteúdo principal
};


// ================= NAVEGAÇÃO ENTRE SEÇÕES =================
// Mapeia os IDs do menu para as seções correspondentes
const sections = {
  show_home: "home_content",
  show_turmas: "turmas_content",
  show_alunos: "alunos_content",
  show_graficos: "graficos_content"
};

Object.keys(sections).forEach((id) => {
  const menuItem = document.getElementById(id);
  if (menuItem) {
    menuItem.addEventListener("click", (e) => {
      e.preventDefault();

      // Esconde todas as seções
      Object.values(sections).forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) section.style.display = "none";
      });

      // Mostra a seção que foi clicada
      const selectedSection = document.getElementById(sections[id]);
      if (selectedSection) selectedSection.style.display = "block";
    });
  }
});


// ================= BOTÕES VOLTAR =================
// Voltar da página do aluno para a turma
const backToTurmaBtns = document.querySelectorAll(".back-to-turma");
backToTurmaBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("alunos_content").style.display = "none";
    document.getElementById("turmas_content").style.display = "block";
  });
});

// Voltar da página da turma para a home
const backToHomeBtns = document.querySelectorAll(".back-to-home");
backToHomeBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("turmas_content").style.display = "none";
    document.getElementById("home_content").style.display = "block";
  });
});

// ================= INTEGRAÇÃO COM BACKEND =================

// 1. Listar turmas na Home
function carregarTurmas() {
  fetch("http://127.0.0.1:8000/classes")
    .then(res => res.json())
    .then(turmas => {
      const tbody = document.querySelector("#home_content .recentOrders tbody");
      tbody.innerHTML = "";
      turmas.forEach(turma => {
        tbody.innerHTML += `
          <tr>
            <td>${turma.id}</td>
            <td>${turma.nome}</td>
            <td>${turma.disciplina}</td>
            <td>
              <a href="#" class="acessar-turma-btn" data-turma-id="${turma.id}">Acessar</a>
            </td>
          </tr>
        `;
      });
      // Adiciona evento para acessar turma
      document.querySelectorAll(".acessar-turma-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          acessarTurma(btn.getAttribute("data-turma-id"));
        });
      });
    });
}

// 2. Listar alunos de uma turma (simples: mostra todos alunos)
function carregarAlunosDaTurma(turmaId) {
  fetch("http://127.0.0.1:8000/students")
    .then(res => res.json())
    .then(alunos => {
      const tbody = document.getElementById("lista_alunos_turma");
      tbody.innerHTML = "";
      alunos.forEach(aluno => {
        tbody.innerHTML += `
          <tr>
            <td>${aluno.matricula}</td>
            <td>${aluno.nome}</td>
            <td>
              <a href="#" class="acessar-aluno-btn" data-aluno-id="${aluno.matricula}">Ver Dados</a>
            </td>
          </tr>
        `;
      });
      document.querySelectorAll(".acessar-aluno-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          acessarAluno(btn.getAttribute("data-aluno-id"), turmaId);
        });
      });
    });
}

// 3. Detalhar aluno
function acessarAluno(matricula, turmaId) {
  fetch(`http://127.0.0.1:8000/students?registration=${matricula}`)
    .then(res => res.json())
    .then(aluno => {
      document.getElementById("turmas_content").style.display = "none";
      document.getElementById("alunos_content").style.display = "block";
      document.getElementById("aluno_nome").innerText = aluno.nome;
      document.getElementById("aluno_matricula").innerText = aluno.matricula;
      document.getElementById("aluno_nome_completo").innerText = aluno.nome;
      document.getElementById("aluno_coeficiente").innerText = aluno.coeficiente ?? "-";
      // Frequência
      fetch(`http://127.0.0.1:8000/students/${matricula}/frequency/${turmaId}`)
        .then(res => res.json())
        .then(freq => {
          document.getElementById("aluno_presenca_media").innerText = freq.frequencia ?? "-";
        });
      // Notas
      fetch(`http://127.0.0.1:8000/grades/${matricula}/${turmaId}`)
        .then(res => res.json())
        .then(notas => {
          const table = document.querySelector("#alunos_content .recentOrders table");
          table.innerHTML = `
            <tr>
              <td>Nota Final</td>
              <td>${notas.media_final ?? "-"}</td>
            </tr>
          `;
        });
      // Gráficos do aluno
      const chartContainer = document.getElementById("aluno_graficos_container");
      chartContainer.innerHTML = `
        <img src="http://127.0.0.1:8000/graphics/${matricula}/evolucao_das_notas" alt="Evolução das notas" style="max-width:100%;"><br>
        <img src="http://127.0.0.1:8000/graphics/${matricula}/freq_x_media_final" alt="Frequência x Média Final" style="max-width:100%;"><br>
        <img src="http://127.0.0.1:8000/graphics/${matricula}/status_aprovacao" alt="Status aprovação" style="max-width:100%;">
      `;
    });
}

// 4. Detalhar turma
function acessarTurma(turmaId) {
  document.getElementById("home_content").style.display = "none";
  document.getElementById("turmas_content").style.display = "block";
  document.getElementById("turma_titulo").innerText = turmaId;
  document.getElementById("turma_titulo_alunos").innerText = turmaId;
  carregarAlunosDaTurma(turmaId);
}

// 5. Gráficos gerais
function carregarGraficosGerais(disciplina) {
  const container = document.getElementById("graficos_gerais_container");
  container.innerHTML = `
    <img src="http://127.0.0.1:8000/graphics/disciplina/${disciplina}/desempenho_geral" alt="Desempenho geral" style="max-width:100%;">
  `;
}

// 6. Inicialização automática da Home
document.addEventListener("DOMContentLoaded", () => {
  carregarTurmas();
});

// 7. Exemplo de botão para gráficos gerais (adicione evento conforme sua interface)
document.querySelectorAll(".chart-btn[data-chart-type='desempenho_geral']").forEach(btn => {
  btn.addEventListener("click", () => {
    const disciplina = prompt("Digite o nome da disciplina:");
    if (disciplina) carregarGraficosGerais(disciplina);
  });
});