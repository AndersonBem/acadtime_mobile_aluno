import { apiRequest, setAccessToken } from './client';
import {
  clearSession,
  getSavedToken,
  getSavedUser,
  saveSession,
} from './tokenStorage';

export async function login(email, senha) {
  const data = await apiRequest('/login/', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });

  if (data.usuario?.tipo !== 'aluno') {
    throw {
      detail: 'Este aplicativo é exclusivo para alunos.',
    };
  }

  setAccessToken(data.access);
  await saveSession(data);

  return data;
}

export async function restoreSession() {
  const token = await getSavedToken();
  const usuario = await getSavedUser();

  if (!token || !usuario) {
    return null;
  }

  if (usuario.tipo !== 'aluno') {
    await clearSession();
    setAccessToken(null);
    return null;
  }

  setAccessToken(token);

  try {
    await apiRequest('/aluno/');

    return {
      access: token,
      usuario,
    };
  } catch (error) {
    await clearSession();
    setAccessToken(null);
    return null;
  }
}

export async function logout() {
  setAccessToken(null);
  await clearSession();
}

export function recuperarSenha(email) {
  return apiRequest('/recuperar-senha/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}