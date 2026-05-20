import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '../components/AppHeader';
import BottomTabBar from '../components/BottomTabBar';
import InfoCard from '../components/InfoCard';
import PrimaryButton from '../components/PrimaryButton';
import DashboardMetricCard from '../components/DashboardMetricCard';
import ProgressRow from '../components/ProgressRow';

import { colors, radius, spacing } from '../styles/global';

export default function Dashboard() {
  return (
    <View style={styles.screen}>
      <AppHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>Olá, Aluno! 👋</Text>
        <Text style={styles.subtitle}>Acompanhe suas atividades complementares</Text>

        <InfoCard>
          <View style={styles.courseCard}>
            <View style={styles.courseIcon}>
              <Ionicons name="school-outline" size={26} color={colors.primary} />
            </View>

            <View style={styles.courseInfo}>
              <Text style={styles.courseLabel}>Curso atual</Text>
              <Text style={styles.courseName}>
                Análise e Desenvolvimento de Sistemas
              </Text>

              <TouchableOpacity style={styles.changeCourseButton}>
                <Ionicons name="swap-horizontal" size={14} color={colors.primary} />
                <Text style={styles.changeCourseText}>Trocar de curso</Text>
              </TouchableOpacity>
            </View>

            <Ionicons name="chevron-down" size={22} color={colors.text} />
          </View>
        </InfoCard>

        <InfoCard>
          <Text style={styles.cardTitle}>Resumo geral</Text>

          <View style={styles.metricsRow}>
            <DashboardMetricCard
              icon="time-outline"
              value="60"
              label="Horas aprovadas"
              color={colors.primary}
              backgroundColor="#e8f1fb"
            />

            <DashboardMetricCard
              icon="hourglass-outline"
              value="40"
              label="Horas pendentes"
              color={colors.accent}
              backgroundColor="#fff3e3"
            />

            <DashboardMetricCard
              icon="close-circle-outline"
              value="10"
              label="Horas rejeitadas"
              color={colors.danger}
              backgroundColor="#fdeaea"
            />

            <DashboardMetricCard
              icon="document-text-outline"
              value="8"
              label="Total de submissões"
              color={colors.success}
              backgroundColor="#e8f7ec"
            />
          </View>
        </InfoCard>

        <InfoCard>
          <View style={styles.progressHeader}>
            <Text style={styles.cardTitle}>Progresso de horas</Text>
            <Text style={styles.goalText}>Meta: 100 horas</Text>
          </View>

          <View style={styles.totalBarBackground}>
            <View style={styles.totalBarFill} />
          </View>

          <View style={styles.totalProgressInfo}>
            <Text style={styles.totalProgressText}>70 / 100 horas</Text>
            <Text style={styles.totalProgressText}>70%</Text>
          </View>

          <PrimaryButton
            title="Nova submissão"
            onPress={() => console.log('Nova submissão')}
          />
        </InfoCard>

        <InfoCard>
          <Text style={styles.cardTitle}>Progresso por tipo de atividade</Text>
          <Text style={styles.smallText}>
            Horas aprovadas em relação ao limite de cada tipo de atividade
          </Text>

          <ProgressRow
            icon="document-text-outline"
            title="Curso de Extensão"
            current={10}
            total={20}
            percent={50}
            color={colors.success}
            backgroundColor="#e8f7ec"
          />

          <ProgressRow
            icon="easel-outline"
            title="Palestra"
            current={15}
            total={20}
            percent={25}
            color={colors.accent}
            backgroundColor="#fff3e3"
          />

          <ProgressRow
            icon="people-outline"
            title="Workshop"
            current={15}
            total={20}
            percent={75}
            color={colors.primary}
            backgroundColor="#e8f1fb"
          />

          <ProgressRow
            icon="calendar-outline"
            title="Curso de Extensão"
            current={12}
            total={20}
            percent={60}
            color="#6f42c1"
            backgroundColor="#efe7fb"
          />

          <ProgressRow
            icon="time-outline"
            title="Curso de Extensão"
            current={18}
            total={20}
            percent={40}
            color={colors.accent}
            backgroundColor="#fff3e3"
          />
        </InfoCard>
      </ScrollView>

      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },

  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.sm,
  },

  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: -spacing.md,
  },

  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  courseIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#e8f1fb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  courseInfo: {
    flex: 1,
  },

  courseLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },

  courseName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },

  changeCourseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  changeCourseText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 4,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },

  metricsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  goalText: {
    fontSize: 11,
    color: colors.textMuted,
  },

  totalBarBackground: {
    height: 8,
    backgroundColor: '#d9d9d9',
    borderRadius: 10,
    marginTop: spacing.md,
    overflow: 'hidden',
  },

  totalBarFill: {
    width: '70%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },

  totalProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: spacing.md,
  },

  totalProgressText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },

  smallText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
});