import { apiRequest } from './client';

export function listarTiposAtividade() {
  return apiRequest('/tipoAtividade/');
}

export function criarAtividadeComplementar({
  descricao,
  cargaHorariaSolicitada,
  tipoAtividade,
}) {
  return apiRequest('/atividadeComplementar/', {
    method: 'POST',
    body: JSON.stringify({
      descricao,
      carga_horaria_solicitada: Number(cargaHorariaSolicitada),
      tipo_atividade: Number(tipoAtividade),
    }),
  });
}