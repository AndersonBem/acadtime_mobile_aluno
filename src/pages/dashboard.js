import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import AppHeader from '../components/AppHeader';
import { colors, spacing, radius } from '../styles/global';

export default function Dashboard() {
  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader />
      <View style={styles.container}>
        <View style={styles.card}>
        </View>
      </View>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
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