import { apiRequest } from './client';


export function listarNotificacoes() {
  return apiRequest('/mobile/notificacoes/');
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