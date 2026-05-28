import { StyleSheet, Text, View } from 'react-native';

import AppHeader from '../components/AppHeader';
import BottomTabBar from '../components/BottomTabBar';
import { colors } from '../styles/global';

export default function Profile({ navigation }) {
  return (
    <View style={styles.screen}>
      <AppHeader />
      <View style={styles.content}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.text}>Tela em construção.</Text>
      </View>
      <BottomTabBar
        activeRoute="Profile"
        onNavigate={(screen) => navigation.navigate(screen)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  text: {
    marginTop: 8,
    color: colors.textMuted,
  },
});