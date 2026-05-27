import { apiRequest } from "./client";

export function listarSubmissoes(params = {}) {
  const query = new URLSearchParams(params).toString();

  return apiRequest(`/submissao/${query ? `?${query}` : ''}`);
}

export function getSubmissaoPorId(id){
    return apiRequest(`/submissao/${id}/`);
}

export function getResumoSubmissoes(params = {}) {
    const query = new URLSearchParams(params).toString();

    return apiRequest(`/submissao/resumo-dashboard/${query ? `?${query}` : ''}`);
}

export function criarSubmissao({ curso, atividadeComplementar, arquivo}) {
    const form = new FormData();

    form.append('curso', String(curso));
    form.append('atividade_complementar', String(atividadeComplementar));

    form.append('certificado_arquivo', {
        uri: arquivo.uri,
        name: arquivo.name,
        type: arquivo.mimeType || arquivo.type || 'application/pdf',
    });

    return apiRequest('/submissao/', {
        method: 'POST',
        body: form,
    });
}

export function getUrlDownloadCertificado(id) {
  return `https://acad-time.onrender.com/submissao/${id}/baixar-certificado/`;
}