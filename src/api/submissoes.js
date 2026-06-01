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

export async function criarSubmissao({
  curso,
  atividadeComplementar,
  arquivo,
  submissionData,
}) {
  const formData = new FormData();

  formData.append('curso', String(curso));
  formData.append('atividade_complementar', String(atividadeComplementar));

  formData.append('certificado_arquivo', {
    uri: arquivo.uri,
    name: arquivo.name || 'certificado.pdf',
    type: arquivo.mimeType || arquivo.type || 'application/pdf',
  });

  formData.append('curso_ocr', submissionData?.activity || '');
  formData.append('instituicao_ocr', submissionData?.institution || '');
  formData.append('carga_horaria_ocr', String(submissionData?.hours || ''));
  formData.append('data_certificado_ocr', submissionData?.date || '');

  return apiRequest('/submissao/', {
    method: 'POST',
    body: formData,
  });
}

export function getUrlDownloadCertificado(id) {
  return `https://acad-time.onrender.com/submissao/${id}/baixar-certificado/`;
}