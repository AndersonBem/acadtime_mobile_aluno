import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '../components/AppHeader';
import BottomTabBar from '../components/BottomTabBar';
import InfoCard from '../components/InfoCard';
import { getDashboardAluno } from '../api/dashboard';
import { listarSubmissoes } from '../api/submissoes';
import { useCurso } from '../contexts/CursoContext';
import { colors, radius, spacing } from '../styles/global';

export default function Submissions({ navigation }) {
  const { cursoSelecionado, setCursoSelecionado } = useCurso();
  const [mostrarCursos, setMostrarCursos] = useState(false);

  const cursoId = cursoSelecionado?.id || cursoSelecionado?.id_curso;

  const [dashboardInfo, setDashboardInfo] = useState(null);
  const [submissoes, setSubmissoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todas');

  useEffect(() => {
    carregarDashboardInfo();
  }, [cursoId]);

  useEffect(() => {
    carregarSubmissoes();
  }, []);

  async function carregarDashboardInfo() {
    try {
      const data = await getDashboardAluno(cursoId);
      setDashboardInfo(data);
    } catch (error) {
      console.log('Erro ao carregar dados do dashboard:', error);
    }
  }

  async function carregarSubmissoes() {
    try {
      setLoading(true);
      setErro(null);

      const data = await listarSubmissoes({ page_size: 100 });
      const lista = Array.isArray(data) ? data : data.results || [];

      setSubmissoes(lista);
    } catch (error) {
      console.log('Erro ao carregar submissões:', error);
      setErro(error);
    } finally {
      setLoading(false);
    }
  }

  const submissoesFiltradas = useMemo(() => {
    return submissoes.filter((item) => {
      const titulo = getTitulo(item).toLowerCase();
      const status = getStatus(item);
      const itemCursoId = getCursoId(item);

      const bateCurso =
        !cursoId ||
        !itemCursoId ||
        String(itemCursoId) === String(cursoId);

      const bateBusca = titulo.includes(busca.toLowerCase());

      const bateFiltro =
        filtro === 'todas' ||
        (filtro === 'pendente' && isPendente(status)) ||
        (filtro === 'aprovado' && isAprovado(status)) ||
        (filtro === 'rejeitado' && isRejeitado(status));

      return bateCurso && bateBusca && bateFiltro;
    });
  }, [submissoes, busca, filtro, cursoId]);

  const cursoAtual = cursoSelecionado || dashboardInfo?.curso_atual;
  const cursos = dashboardInfo?.cursos || [];

  return (
    <View style={styles.screen}>
      <AppHeader
        photoUrl={dashboardInfo?.aluno?.foto_perfil_url}
        onPressNotifications={() => navigation.navigate('Notifications')}
        onPressProfile={() => navigation.navigate('Profile')}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Minhas submissões</Text>

        <Text style={styles.subtitle}>
          Acompanhe o status de todas as suas atividades complementares enviadas.
        </Text>

          <View style={styles.searchRow}>
            <View style={styles.searchInputWrapper}>
              <Ionicons
                name="search-outline"
                size={20}
                color={colors.textMuted}
                style={styles.searchIcon}
              />

              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por título"
                placeholderTextColor="#c9c9c9"
                value={busca}
                onChangeText={setBusca}
              />
            </View>

            <View style={styles.courseSelector}>
              <TouchableOpacity style={styles.courseCard}
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
                    const cursoAtualId = cursoAtual?.id || cursoAtual?.id_curso;
                    const cursoOpcaoId = curso.id || curso.id_curso;
                    const selecionado = String(cursoAtualId) === String(cursoOpcaoId);

                    return (
                      <TouchableOpacity
                        key={curso.id || curso.id_curso}
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
            </View>
          </View>

          <View style={styles.tabs}>
            <TabButton
              label="Todas"
              active={filtro === 'todas'}
              onPress={() => setFiltro('todas')}
            />

            <TabButton
              label="Pendentes"
              dotColor={colors.accent}
              active={filtro === 'pendente'}
              onPress={() => setFiltro('pendente')}
            />

            <TabButton
              label="Aprovadas"
              dotColor={colors.success}
              active={filtro === 'aprovado'}
              onPress={() => setFiltro('aprovado')}
            />

            <TabButton
              label="Rejeitadas"
              dotColor={colors.danger}
              active={filtro === 'rejeitado'}
              onPress={() => setFiltro('rejeitado')}
            />
          </View>

        {loading && (
          <View style={styles.centerArea}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando submissões...</Text>
          </View>
        )}

        {!loading && erro && (
          <View style={styles.centerArea}>
            <Text style={styles.errorTitle}>
              Não foi possível carregar as submissões.
            </Text>
            <Text style={styles.errorText}>
              Verifique sua conexão e tente novamente.
            </Text>
          </View>
        )}

        {!loading && !erro && submissoesFiltradas.length === 0 && (
          <View style={styles.centerArea}>
            <Text style={styles.emptyText}>Nenhuma submissão encontrada.</Text>
          </View>
        )}

        {!loading && !erro && submissoesFiltradas.length > 0 && (
          <View style={styles.list}>
            {submissoesFiltradas.map((submission, index) => (
              <SubmissionItem
                key={submission.id_submissao || submission.id || index}
                submission={submission}
                onPress={() =>
                  navigation.navigate('SubmissionDetails', {
                     submissionId: submission.id_submissao || submission.id,
                     submission,
                 })
              }
          />
            ))}
          </View>
        )}
      </ScrollView>

      <BottomTabBar
        activeRoute="Submissions"
        onNavigate={(screen) => navigation.navigate(screen)}
      />
    </View>
  );
}

function TabButton({ label, dotColor, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.tabButton, active && styles.tabButtonActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>

      {!!dotColor && (
        <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
      )}
    </TouchableOpacity>
  );
}

function SubmissionItem({ submission, onPress }) {
  const statusInfo = getStatusInfo(submission);
  const titulo = getTitulo(submission);
  const data = getDataEnvio(submission);
  const horas = getHoras(submission);

  return (
    <InfoCard>
      <TouchableOpacity style={styles.submissionContent} activeOpacity={0.85} onPress={onPress}>
        <View style={[styles.iconBox, { backgroundColor: statusInfo.backgroundColor }]}>
          <Ionicons name={statusInfo.icon} size={30} color={statusInfo.color} />
        </View>

        <View style={styles.submissionInfo}>
          <Text style={styles.submissionTitle} numberOfLines={2}>
            {titulo}
          </Text>

          <Text style={styles.submissionDate}>
            Enviado em {data}
          </Text>
        </View>

        <View style={styles.statusArea}>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.backgroundColor }]}>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>

          {!!horas && (
            <Text style={styles.hoursText}>
              {horas}h aprovadas
            </Text>
          )}
        </View>

        <Ionicons name="chevron-forward" size={24} color={colors.text} />
      </TouchableOpacity>
    </InfoCard>
  );
}

function getTitulo(item) {
  return (
    item.atividade_complementar_nome ||
    item.atividade_complementar?.descricao ||
    item.atividadeComplementar?.descricao ||
    item.titulo ||
    item.descricao ||
    item.atividade_categoria ||
    'Atividade complementar'
  );
}

function getStatus(item) {
  if (item.status_submissao_nome) {
    return String(item.status_submissao_nome).toLowerCase();
  }

  if (item.status_submissao === 1) {
    return 'pendente';
  }

  if (item.status_submissao === 2) {
    return 'aprovada';
  }

  if (item.status_submissao === 3) {
    return 'reprovada';
  }

  return String(
    item.status ||
    item.status_avaliacao ||
    item.status_certificado ||
    item.avaliacao_status ||
    item.situacao ||
    item.estado ||
    item.resultado ||
    item.resultado_analise ||
    ''
  ).toLowerCase();
}

function getCursoId(item) {
  return (
    item.curso?.id ||
    item.curso?.id_curso ||
    item.curso ||
    item.id_curso ||
    item.curso_id ||
    item.inscricao?.curso?.id ||
    item.inscricao?.curso
  );
}

function isAprovado(status) {
  return (
    status.includes('aprov') ||
    status.includes('defer') ||
    status.includes('aceit') ||
    status.includes('valid')
  );
}

function isRejeitado(status) {
  return (
    status.includes('reje') ||
    status.includes('reprov') ||
    status.includes('indefer') ||
    status.includes('negad') ||
    status.includes('recus')
  );
}

function isPendente(status) {
  return (
    status.includes('pend') ||
    status.includes('analise') ||
    status.includes('análise') ||
    status.includes('aguard') ||
    status.includes('enviado') ||
    status.includes('novo')
  );
}

function getStatusInfo(item) {
  const status = getStatus(item);

  if (isAprovado(status)) {
    return {
      label: 'Aprovado',
      icon: 'document-text-outline',
      color: colors.success,
      backgroundColor: '#e8f7ec',
    };
  }

  if (isRejeitado(status)) {
    return {
      label: 'Rejeitado',
      icon: 'close-circle-outline',
      color: colors.danger,
      backgroundColor: '#fdeaea',
    };
  }

  return {
    label: 'Pendente',
    icon: 'time-outline',
    color: colors.accent,
    backgroundColor: '#fff3e3',
  };
}

function getDataEnvio(item) {
  const data =
    item.data_envio ||
    item.criado_em ||
    item.created_at ||
    item.data_submissao;

  if (!data) {
    return '-';
  }

  return new Date(data).toLocaleDateString('pt-BR');
}

function getHoras(item) {
  return (
    item.carga_horaria_aprovada ||
    item.horas_aprovadas ||
    item.horas_aprovada ||
    null
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

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.sm,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: -spacing.sm,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },

  searchInputWrapper: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },

  searchIcon: {
    marginRight: spacing.sm,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },

  courseSelector: {
    width: 170,
  },

  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    minHeight: 48,
    width: 170,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },

  courseIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8f1fb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },

  courseInfo: {
    flex: 1,
  },

  courseLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },

  courseName: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
  },

  changeCourseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  changeCourseText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 4,
  },
  courseList: {
    width: '100%',
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

  tabs: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#d6d6d6',
    marginTop: 0,
  },

  tabButton: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 18,
    paddingHorizontal: 2,
  },

  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },

  tabText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textMuted,
  },

  tabTextActive: {
    color: colors.primary,
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginLeft: 4,
  },

  list: {
    gap: spacing.md,
  },

  submissionContent: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  submissionInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  submissionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 3,
  },

  submissionDate: {
    fontSize: 13,
    color: colors.text,
  },

  statusArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },

  statusBadge: {
    minWidth: 88,
    minHeight: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },

  statusText: {
    fontSize: 13,
    fontWeight: '800',
  },

  hoursText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 6,
  },

  centerArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },

  loadingText: {
    marginTop: spacing.md,
    color: colors.textMuted,
  },

  errorTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },

  errorText: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },

  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
});
