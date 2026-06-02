import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCurso } from '../contexts/CursoContext';
import AppHeader from '../components/AppHeader';
import BottomTabBar from '../components/BottomTabBar';
import InfoCard from '../components/InfoCard';
import DashboardMetricCard from '../components/DashboardMetricCard';
import PrimaryButton from '../components/PrimaryButton';
import ProgressRow from '../components/ProgressRow';

import { getDashboardAluno } from '../api/dashboard';
import { colors, spacing } from '../styles/global';

export default function Dashboard({ navigation }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const { cursoSelecionado, setCursoSelecionado } = useCurso();
  const [mostrarCursos, setMostrarCursos] = useState(false);
  

  useEffect(() => {
    carregarDados(cursoSelecionado?.id);
  }, [cursoSelecionado?.id]);

  async function carregarDados(cursoId) {
    try {
      if (!dashboard) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError(null);
      const dashboardData = await getDashboardAluno(cursoId);
      setDashboard(dashboardData);
      
      if (!cursoSelecionado && dashboardData.curso_atual) {
        setCursoSelecionado(dashboardData.curso_atual);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centerScreen}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerScreen}>
        <Text style={styles.errorTitle}>Não foi possível carregar o dashboard.</Text>
        <Text style={styles.errorText}>Verifique sua conexão e tente novamente.</Text>
      </View>
    );
  }

  if (!dashboard) {
    return (
      <View style={styles.centerScreen}>
        <Text style={styles.errorTitle}>Nenhum dado encontrado.</Text>
      </View>
    );
  }
  const cursoAtual = cursoSelecionado || dashboard.curso_atual;
  const cursos = dashboard.cursos || [];
  const resumo = dashboard.resumo || {};
  const horasAprovadas = resumo.horas_aprovadas || 0;
  const metaHoras = resumo.meta_horas || 0;
  const percentualGeral = Math.min(resumo.percentual_geral || 0, 100);
  const progressoPorTipo = dashboard.progresso_por_tipo || [];

  return (
    <View style={styles.screen}>
      <AppHeader
        photoUrl={dashboard.aluno?.foto_perfil_url}
        onPressNotifications={() => navigation.navigate('Notifications')}
        onPressProfile={() => navigation.navigate('Profile')}
      />

      {refreshing && (
        <View style={styles.refreshOverlay}>
          <View style={styles.refreshBox}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.refreshText}>Atualizando curso...</Text>
          </View>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>
          Olá, {dashboard.aluno?.nome || 'Aluno'}!
        </Text>

        <Text style={styles.subtitle}>
          Acompanhe suas atividades complementares
        </Text>
        <InfoCard>
          <TouchableOpacity
            style={styles.courseCard}
            onPress={() => setMostrarCursos(!mostrarCursos)}
            activeOpacity={0.8}
          >
            <View style={styles.courseIcon}>
              <Ionicons name="school-outline" size={26} color={colors.primary} />
            </View>

            <View style={styles.courseInfo}>
              <Text style={styles.courseLabel}>Curso atual</Text>

              <Text style={styles.courseName} numberOfLines={2}>
                {cursoAtual?.nome || 'Curso não informado'}
              </Text>

              <View style={styles.changeCourseButton}>
                <Ionicons name="swap-horizontal" size={14} color={colors.primary} />
                <Text style={styles.changeCourseText}>Trocar de curso</Text>
              </View>
            </View>

            <Ionicons
              name={mostrarCursos ? 'chevron-up' : 'chevron-down'}
              size={22}
              color={colors.text}
            />
          </TouchableOpacity>

          {mostrarCursos && (
            <View style={styles.courseList}>
              {cursos.map((curso) => {
                const selecionado = cursoAtual?.id === curso.id;

                return (
                  <TouchableOpacity
                    key={curso.id}
                    style={[
                      styles.courseOption,
                      selecionado && styles.courseOptionSelected,
                    ]}
                    onPress={() => {
                      setCursoSelecionado(curso);
                      setMostrarCursos(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.courseOptionText,
                        selecionado && styles.courseOptionTextSelected,
                      ]}
                    >
                      {curso.nome}
                    </Text>

                    {selecionado && (
                      <Ionicons name="checkmark" size={18} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </InfoCard>
        <InfoCard>
          <Text style={styles.cardTitle}>Resumo geral</Text>

          <View style={styles.metricsRow}>
            <DashboardMetricCard
              icon="checkmark-circle-outline"
              value={resumo.submissoes_aprovadas || 0}
              label="Submissões aprovadas"
              color={colors.success}
              backgroundColor="#e8f7ec"
            />

            <DashboardMetricCard
              icon="hourglass-outline"
              value={resumo.submissoes_pendentes || 0}
              label="Submissões pendentes"
              color={colors.accent}
              backgroundColor="#fff3e3"
            />

            <DashboardMetricCard
              icon="close-circle-outline"
              value={resumo.submissoes_rejeitadas || 0}
              label="Submissões rejeitadas"
              color={colors.danger}
              backgroundColor="#fdeaea"
            />

            <DashboardMetricCard
              icon="document-text-outline"
              value={resumo.total_submissoes || 0}
              label="Total de submissões"
              color={colors.success}
              backgroundColor="#e8f7ec"
            />
          </View>
        </InfoCard>
        <InfoCard>
          <View style={styles.progressHeader}>
            <Text style={styles.cardTitle}>Progresso de horas</Text>
            <Text style={styles.goalText}>Meta: {metaHoras} horas</Text>
          </View>

          <View style={styles.totalBarBackground}>
            <View
              style={[
                styles.totalBarFill,
                { width: `${percentualGeral}%` },
              ]}
            />
          </View>

          <View style={styles.totalProgressInfo}>
            <Text style={styles.totalProgressText}>
              {horasAprovadas} / {metaHoras} horas
            </Text>

            <Text style={styles.totalProgressText}>
              {percentualGeral}%
            </Text>
          </View>

          <PrimaryButton
            title="Nova submissão"
            onPress={() => navigation.navigate('NewSubmission')}
          />
        </InfoCard>
        <InfoCard>
          <Text style={styles.cardTitle}>Progresso por tipo de atividade</Text>

          <Text style={styles.smallText}>
            Horas aprovadas em relação ao limite de cada tipo de atividade
          </Text>

          {progressoPorTipo.length > 0 ? (
            progressoPorTipo.map((item, index) => {
              const visual = getProgressVisual(index);

              return (
                <ProgressRow
                  key={item.tipo_atividade}
                  icon={visual.icon}
                  title={item.tipo_atividade_nome}
                  current={item.horas_aprovadas || 0}
                  total={item.limite_horas || 0}
                  percent={Math.min(item.percentual || 0, 100)}
                  color={visual.color}
                  backgroundColor={visual.backgroundColor}
                />
              );
            })
          ) : (
            <Text style={styles.emptyText}>
              Nenhuma regra de atividade encontrada para este curso.
            </Text>
          )}
        </InfoCard>
      </ScrollView>
      

      <BottomTabBar
        activeRoute="Dashboard"
        onNavigate={(screen) => navigation.navigate(screen)}
      />
    </View>
  );
}

function getProgressVisual(index) {
  const visuals = [
    {
      icon: 'document-text-outline',
      color: colors.success,
      backgroundColor: '#e8f7ec',
    },
    {
      icon: 'easel-outline',
      color: colors.accent,
      backgroundColor: '#fff3e3',
    },
    {
      icon: 'people-outline',
      color: colors.primary,
      backgroundColor: '#e8f1fb',
    },
    {
      icon: 'calendar-outline',
      color: '#6f42c1',
      backgroundColor: '#efe7fb',
    },
    {
      icon: 'time-outline',
      color: colors.warning,
      backgroundColor: '#fff3d6',
    },
  ];

  return visuals[index % visuals.length];
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

  centerScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },

  loadingText: {
    marginTop: spacing.md,
    color: colors.textMuted,
  },

  errorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },

  errorText: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    textAlign: 'center',
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
  courseList: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: spacing.sm,
  },

  courseOption: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
  },

  courseOptionSelected: {
    backgroundColor: '#e8f1fb',
  },

  courseOptionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginRight: spacing.sm,
  },

  courseOptionTextSelected: {
    color: colors.primary,
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

  emptyText: {
    marginTop: spacing.md,
    fontSize: 13,
    color: colors.textMuted,
  },

  refreshOverlay: {
    position: 'absolute',
    top: 84,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },

  refreshBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 4,
  },

  refreshText: {
    marginLeft: spacing.sm,
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
});