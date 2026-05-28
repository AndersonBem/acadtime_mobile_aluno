import { apiRequest } from './client';


export function listarNotificacoes() {
  return apiRequest('/mobile/notificacoes/');
}

export function marcarNotificacaoComoLida(id) {
  return apiRequest(`/mobile/notificacoes/${id}/marcar-lida/`, {
    method: 'PATCH',
  });
}

export function marcarTodasNotificacoesComoLidas() {
  return apiRequest('/mobile/notificacoes/marcar-todas-lidas/', {
    method: 'POST',
  });
}

export async function listarNotificacoesNaoLidas() {
  const data = await listarNotificacoes();

  return {
    ...data,
    results: data.results.filter((notificacao) => !notificacao.lida),
  };
}

export async function listarNotificacoesLidas() {
  const data = await listarNotificacoes();

  return {
    ...data,
    results: data.results.filter((notificacao) => notificacao.lida),
  };
}