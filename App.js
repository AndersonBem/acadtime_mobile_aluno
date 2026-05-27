import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { login, restoreSession } from './src/api/auth';
import { apiRequest } from './src/api/client';
import { getMeuPerfilAluno, getCursoAtualAluno } from './src/api/aluno';
import { listarSubmissoes, getResumoSubmissoes } from './src/api/submissoes';

export default function App() {
  useEffect(() => {
    async function testarApi() {
      try {
        console.log('Tentando restaurar sessao...');
        const sessao = await restoreSession();
        console.log('Sessao salva:', sessao);

        console.log('Fazendo login...');
        const loginData = await login('testealuno@acadtime.com', 'teste123');
        console.log('Login OK:', loginData);
        const submissoes = await listarSubmissoes();
        console.log('Submissoes:', submissoes);

        const resumo = await getResumoSubmissoes();
        console.log('Resumo submissões:', resumo);
      } catch (error) {
        console.log('Erro no teste da API:', error);
      }
    }

    testarApi();
  }, []);

  return (
    <View>
      <Text>Testando API. Veja o console do Expo.</Text>
    </View>
  );
}