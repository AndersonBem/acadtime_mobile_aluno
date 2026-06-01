import { apiRequest } from "./client";

export async function getMeuPerfilAluno() {
    const data = await apiRequest('/aluno/');

    return data.results?.[0] || null;
}

export async function getCursosDoAluno(){
    const aluno = await getMeuPerfilAluno();
    
    return aluno?.cursos || [];
}

export async function getCursoAtualAluno() {
    const cursos = await getCursosDoAluno();

    return cursos[0] || null;
}

