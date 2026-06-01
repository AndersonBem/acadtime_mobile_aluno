import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Routes from './src/navigation/Routes';
import { login, restoreSession } from './src/api/auth';
import { colors } from './src/styles/global';

export default function App() {
  const [preparandoSessao, setPreparandoSessao] = useState(true);

  useEffect(() => {
    async function autoLoginTemporario() {
      try {
        const sessao = await restoreSession();

        if (!sessao) {
          await login('testealuno@acadtime.com ', 'teste123');
        }
      } catch (error) {
        console.log('Erro no auto login temporario:', error);
      } finally {
        setPreparandoSessao(false);
      }
    }

    autoLoginTemporario();
  }, []);

  if (preparandoSessao) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12 }}>Preparando sessão...</Text>
      </View>
    );
  }

  return (
    <>
      <Routes />
      <StatusBar hidden />
    </>
  );
}