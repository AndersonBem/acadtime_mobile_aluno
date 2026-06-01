import { apiRequest } from './client';

export function listarInscricoesDoAluno() {
  return apiRequest('/inscricao/');
}

export async function listarInscricoesAtivasDoAluno() {
  const data = await listarInscricoesDoAluno();

  return data.filter((inscricao) => {
    const status = inscricao.status_matricula?.toLowerCase().trim();
    return status === 'ativo' || status === 'ativa';
  });
}

export async function listarCursosMatriculados() {
  const inscricoes = await listarInscricoesDoAluno();

  return inscricoes.map((inscricao) => ({
    idInscricao: inscricao.id_inscricao,
    nome: inscricao.nome_curso,
    matricula: inscricao.numero_matricula,
    status: inscricao.status_matricula,
    dataInscricao: inscricao.data_inscricao,
  }));
}

export function listarCursos() {
  return apiRequest('/curso/');
}