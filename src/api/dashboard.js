import { apiRequest } from './client';

export function getDashboardAluno(cursoId) {
  const query = cursoId ? `?curso=${cursoId}` : '';

  return apiRequest(`/mobile/dashboard/${query}`);
}