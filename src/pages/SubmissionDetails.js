import { Text, View, StyleSheet } from 'react-native';

import AppHeader from '../components/AppHeader';
import BottomTabBar from '../components/BottomTabBar';
import { colors, spacing } from '../styles/global';

export default function SubmissionDetails({ route, navigation }) {
  const { submissionId, submission } = route.params || {};

  return (
    <View style={styles.screen}>
      <AppHeader
        onPressNotifications={() => navigation.navigate('Notifications')}
        onPressProfile={() => navigation.navigate('Profile')}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Detalhes da submissão</Text>

        <Text>ID: {submissionId || '-'}</Text>
        <Text>Atividade: {submission?.atividade_categoria || '-'}</Text>
        <Text>Status: {submission?.status_submissao_nome || '-'}</Text>
        <Text>Curso: {submission?.curso_nome || '-'}</Text>
        <Text>Data de envio: {submission?.data_envio || '-'}</Text>
      </View>

      <BottomTabBar
        activeRoute="Submissions"
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
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
});