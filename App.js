import { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';

import Routes from './src/navigation/Routes';

export default function App() {
  useEffect(() => {
    async function esconderBarraAndroid() {
      if (Platform.OS !== 'android') return;

      try {
        await NavigationBar.setBehaviorAsync('overlay-swipe');
        await NavigationBar.setVisibilityAsync('hidden');
      } catch (error) {
        console.log('NavigationBar não disponível neste ambiente:', error);
      }
    }

    esconderBarraAndroid();
  }, []);

  return (
    <>
      <Routes />
      <StatusBar hidden />
    </>
  );
}