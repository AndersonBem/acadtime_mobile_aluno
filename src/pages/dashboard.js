import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, radius } from '../styles/global';

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Olá, Aluno!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },

  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
});