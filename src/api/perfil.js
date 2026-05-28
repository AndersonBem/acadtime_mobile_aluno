import { apiRequest } from './client';

export function getPerfilAluno() {
  return apiRequest('/mobile/perfil/');
}

export function atualizarFotoPerfil(arquivo) {
  const form = new FormData();

  form.append('foto', {
    uri: arquivo.uri,
    name: arquivo.name || 'foto-perfil.jpg',
    type: arquivo.mimeType || arquivo.type || 'image/jpeg',
  });

  return apiRequest('/mobile/perfil/foto/', {
    method: 'PATCH',
    body: form,
  });
}