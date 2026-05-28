import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../styles/global';

export default function Login() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.text}>Tela de login em desenvolvimento.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },

  text: {
    marginTop: 8,
    color: colors.textMuted,
  },
});