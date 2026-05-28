import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { restoreSession } from '../api/auth';
import { CursoProvider } from '../contexts/CursoContext';
import Dashboard from '../pages/dashboard';
import Submissions from '../pages/Submissions';
import NewSubmission from '../pages/NewSubmission';
import Notifications from '../pages/Notifications';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import { colors } from '../styles/global';

const Stack = createNativeStackNavigator();

export default function Routes() {
  const [loading, setLoading] = useState(true);
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    async function verificarSessao() {
      const sessao = await restoreSession();

      setLogado(!!sessao);
      setLoading(false);
    }

    verificarSessao();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
        <CursoProvider>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {logado ? (
                    <>
                    <Stack.Screen name="Dashboard" component={Dashboard} />
                    <Stack.Screen name="Submissions" component={Submissions} />
                    <Stack.Screen name="NewSubmission" component={NewSubmission} />
                    <Stack.Screen name="Notifications" component={Notifications} />
                    <Stack.Screen name="Profile" component={Profile} />
                    </>
                ) : (
                <Stack.Screen name="Login">
                    {(props) => (
                    <Login
                        {...props}
                        onLogin={() => setLogado(true)}
                    />
                    )}
                </Stack.Screen>
                )}
            </Stack.Navigator>
        </CursoProvider>
    </NavigationContainer>
  );
}