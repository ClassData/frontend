export async function fetchStudentByRegistration(registration) {
  try {
    const apiUrl = window.API_URL || "http://localhost:8000";
    const response = await fetch(`${apiUrl}/students?registration=${registration}`);
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
