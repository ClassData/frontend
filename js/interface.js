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


// ================= ACESSAR TURMA =================
// Clicar em uma turma para abrir detalhes e listar alunos
const acessarTurmaBtns = document.querySelectorAll(".acessar-turma-btn");
acessarTurmaBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const turmaId = btn.getAttribute("data-turma-id");

    // Atualiza visibilidade das seções e títulos
    document.getElementById("home_content").style.display = "none";
    document.getElementById("turmas_content").style.display = "block";
    document.getElementById("turma_titulo").innerText = turmaId;
    document.getElementById("turma_titulo_alunos").innerText = turmaId;
  });
});
