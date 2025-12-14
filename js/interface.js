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
  console.log("Iniciando busca de turmas..."); // Log para debug

  fetch("http://127.0.0.1:8000/classes")
    .then(res => res.json())
    .then(turmas => {
      console.log("Turmas recebidas:", turmas); 

      const tbody = document.querySelector("#home_content .recentOrders tbody");
      
      // Se não achou a tabela, para tudo para não dar erro
      if (!tbody) {
          console.error("Erro: Tabela não encontrada no HTML!");
          return;
      }

      tbody.innerHTML = ""; // Limpa a tabela

      turmas.forEach(turma => {
        // SEGURANÇA: Garante que os campos existam mesmo se o backend falhar
        const idCurto = turma.id ? turma.id.substring(0, 8) + "..." : "ID Nulo";
        
        // Tenta pegar o nome da matéria com segurança
        let nomeDisciplina = "Sem Matéria";
        if (turma.subjects && turma.subjects.name) {
            nomeDisciplina = turma.subjects.name;
        } else if (turma.disciplina) { // Caso antigo
            nomeDisciplina = turma.disciplina;
        }

        const nomeTurma = turma.nome || "Sem Nome";
        const semestre = nomeTurma.includes("20") ? nomeTurma.split("-").pop() : "-";

        tbody.innerHTML += `
          <tr>
            <td title="${turma.id || ''}"><span class="status pending">${idCurto}</span></td>
            <td style="font-weight: bold;">${nomeDisciplina}</td>
            <td>${nomeTurma}</td>
            <td>${semestre}</td>
            <td>
              <a href="#" class="btn status return acessar-turma-btn" data-turma-id="${turma.id}">Acessar</a>
            </td>
          </tr>
        `;
      });

      // Reativa os botões
      document.querySelectorAll(".acessar-turma-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          if (typeof acessarTurma === "function") {
              acessarTurma(btn.getAttribute("data-turma-id"));
          } else {
              console.error("Função acessarTurma não existe!");
          }
        });
      });
    })
    .catch(err => {
        console.error("Erro fatal ao carregar turmas:", err);
        const tbody = document.querySelector("#home_content .recentOrders tbody");
        if(tbody) tbody.innerHTML = "<tr><td colspan='5'>Erro ao carregar dados. Verifique o console (F12).</td></tr>";
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
// Adicionei a classe 'chart-img' e usei flexbox na div container (via CSS)
chartContainer.innerHTML = `
  <div style="display: flex; gap: 20px; flex-wrap: wrap;">
    <div style="flex: 1; min-width: 300px;">
        <h4>Evolução</h4>
        <img src="http://127.0.0.1:8000/graphics/${matricula}/evolucao_das_notas" class="chart-img" style="width: 100%; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
    </div>
    <div style="flex: 1; min-width: 300px;">
        <h4>Frequência vs Nota</h4>
        <img src="http://127.0.0.1:8000/graphics/${matricula}/freq_x_media_final" class="chart-img" style="width: 100%; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
    </div>
  </div>
`;

carregarSelectDisciplinas(matricula);
      
    });
}

// 3.9 carregar Turma 
function carregarDisciplinasDoAluno(matricula) {
    fetch(`http://127.0.0.1:8000/students/${matricula}/disciplines`)
        .then(res => res.json())
        .then(lista => {
            console.log("Disciplinas encontradas:", lista);
            
            // Exemplo: Preenchendo um <select id="filtro_disciplina">
            const select = document.getElementById("filtro_disciplina");
            select.innerHTML = "<option value=''>Selecione uma matéria...</option>";
            
            lista.forEach(item => {
                // item.class_id = ID da turma
                // item.label = "Banco de Dados (Turma A)"
                select.innerHTML += `<option value="${item.class_id}">${item.label}</option>`;
            });
        })
        .catch(err => console.error("Erro ao carregar disciplinas:", err));
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

// função para conseguir pegar os nomes das disciplinas 
function carregarSelectDisciplinas(matricula) {
    const select = document.getElementById("select_disciplina_aluno");

    // 1. Busca a lista no Backend
    fetch(`http://127.0.0.1:8000/students/${matricula}/disciplines`)
        .then(res => res.json())
        .then(lista => {
            // Limpa o select
            select.innerHTML = '<option value="">Todas as Disciplinas</option>';

            if (lista.length === 0) {
                select.innerHTML += '<option disabled>Nenhuma disciplina encontrada</option>';
                return;
            }

            // 2. Preenche com os dados vindos do Python
            lista.forEach(item => {
                // item.class_id = ID da turma
                // item.label = "Banco de Dados (Turma A)"
                select.innerHTML += `<option value="${item.class_id}">${item.label}</option>`;
            });

            // 3. Adiciona evento de mudança
            // Quando o usuário escolhe uma matéria, podemos atualizar um gráfico específico
            select.addEventListener("change", function() {
                const turmaId = this.value;
                const imgEvolucao = document.getElementById("img_evolucao");
                
                if (turmaId) {
                    console.log("Usuário selecionou a turma ID:", turmaId);
                    alert("Você selecionou: " + this.options[this.selectedIndex].text);
                } else {
                    // Reseta para o gráfico geral
                    imgEvolucao.src = `http://127.0.0.1:8000/graphics/${matricula}/evolucao_das_notas`;
                }
            });

        })
        .catch(err => {
            console.error("Erro ao carregar disciplinas:", err);
            select.innerHTML = '<option>Erro ao carregar</option>';
        });
}