export async function fetchClassesByID(id) {
  try {
    const apiUrl = window.API_URL || "http://localhost:8000";
    const response = await fetch(`${apiUrl}/classes?id=${id}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar dados do estudante");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro em getStudentByMatricula:", error.message);
    return null;
  }
}
