export async function fetchAllStudents() {
  try {
    const response = await fetch(`${API_URL}/students`); 
    if (!response.ok) {
      throw new Error("Erro ao buscar estudantes");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro em getStudents:", error.message);
    return [];
  }
}
