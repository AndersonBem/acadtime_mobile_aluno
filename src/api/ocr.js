import { apiRequest } from './client';

export function extrairDadosCertificado(arquivo) {
  const form = new FormData();

  form.append('certificado_arquivo', {
    uri: arquivo.uri,
    name: arquivo.name,
    type: arquivo.mimeType || arquivo.type || 'application/pdf',
  });

  return apiRequest('/ocr/', {
    method: 'POST',
    body: form,
  });
}