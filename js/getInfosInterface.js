import { fetchStudentByRegistration } from "../services/students/fetchStudentByRegistration.js";
import { fetchClassesByID } from "../services/students/fetchClassesByID.js";

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search_input");
    const searchAlunoBtn = document.getElementById("search_aluno_btn");
    const searchTurmaBtn = document.getElementById("search_turma_btn");

    searchAlunoBtn.addEventListener("click", async () => {
        const matricula = searchInput.value.trim();
        if (!matricula) return alert("Digite a matrícula do aluno");

        try {
            searchStudent(matricula);
        } catch (err) {
            console.error(err);
            alert("Erro ao buscar aluno");
        }
    });

    searchTurmaBtn.addEventListener("click", async () => {
        const turmaId = searchInput.value.trim();
        if (!turmaId) return alert("Digite o código da turma");

        try {
            searchClass(turmaId);
        } catch (err) {
            console.error(err);
            alert("Erro ao buscar turma");
        }
    });

    // Enter = busca aluno por padrão (opcional)
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            searchAlunoBtn.click();
        }
    });
});

async function searchStudent(value) {
  const aluno = await fetchStudentByRegistration(value);

  if (!aluno) {
    alert("Aluno não encontrado!");
    return;
  }

  console.log("RESPOSTA: ",aluno);

  document.getElementById("aluno_nome").textContent = aluno.nome;
  document.getElementById("aluno_matricula").textContent = aluno.matricula;
  document.getElementById("aluno_nome_completo").textContent = aluno.nomeCompleto;
  document.getElementById("aluno_coeficiente").textContent = aluno.coeficiente;
  document.getElementById("aluno_presenca_media").textContent = aluno.presencaMedia;

  const tbody = document.getElementById("aluno_notas_presencas");
  tbody.innerHTML = "";

  aluno.disciplinas.forEach(item => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${item.disciplina}</td>
        <td>${item.media_final}</td>
        <td>${item.frequencia_total}</td>
        <td>${item.faltas}</td>
      </tr>
    `);
  });

  // mostra a seção de aluno
  document.getElementById("alunos_content").style.display = "block";
}


async function searchClass(value) {
  const classes = await fetchClassesByID(value);

  if (!classes) {
    alert("Turma não encontrada!");
    return;
  }

  console.log("Response: ",classes);

  document.getElementById("turma_titulo").textContent = `${classes.nome} (${classes.turma})`;
  document.getElementById("turma_titulo_alunos").textContent = classes.alunos.length;
  
  const tbody = document.getElementById("lista_alunos_turma");
  tbody.innerHTML = "";

  classes.alunos.forEach(aluno => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${aluno.matricula || aluno}</td>
        <td>${aluno.nome || aluno}</td>
        <td>${aluno.coeficiente || "-"}</td>
        <td><button class="btn">Detalhes</button></td>
      </tr>
    `);
  });

  // Mostra a seção de turmas
  document.getElementById("turmas_content").style.display = "block";
}