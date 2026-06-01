import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  listarNotificacoes,
  listarNotificacoesNaoLidas,
  listarNotificacoesLidas,
  marcarTodasNotificacoesComoLidas,
  marcarNotificacaoComoLida,
} from '../api/notificacoes';

import AppHeader from '../components/AppHeader';
import BottomTabBar from '../components/BottomTabBar';
import { colors, radius, spacing } from '../styles/global';

export default function Notifications({ navigation }) {
  const [filter, setFilter] = useState('todas');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  async function carregarNotificacoes(tipo = filter) {
    try {
      setLoading(true);

      let data;

      if (tipo === 'naoLidas') {
        data = await listarNotificacoesNaoLidas();
      } else if (tipo === 'lidas') {
        data = await listarNotificacoesLidas();
      } else {
        data = await listarNotificacoes();
      }

      setNotifications(data.results || data || []);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }

  async function alterarFiltro(tipo) {
    setFilter(tipo);
    await carregarNotificacoes(tipo);
  }

  async function marcarTodasComoLidas() {
    try {
      await marcarTodasNotificacoesComoLidas();
      await carregarNotificacoes(filter);
    } catch (error) {
      console.error('Erro ao marcar notificações como lidas:', error);
    }
  }
  async function marcarComoLida(notificacao) {
    try {
      if (!notificacao?.id || notificacao.lida) {
        return;
      }

      await marcarNotificacaoComoLida(notificacao.id);
      await carregarNotificacoes(filter);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  }

  useEffect(() => {
    carregarNotificacoes('todas');
  }, []);

  const hojeItems = notifications.filter((item) => item.grupo === 'Hoje');
  const semanaItems = notifications.filter((item) => {
    const match = String(item.tempo_relativo || '').match(/Há (\d+)d/);
    const dias = match ? Number(match[1]) : null;

    return dias !== null && dias <= 7;
  });

  const outrasItems = notifications.filter((item) => {
    const isHoje = item.tempo_relativo === 'Hoje';
    const match = String(item.tempo_relativo || '').match(/Há (\d+)d/);
    const dias = match ? Number(match[1]) : null;

    return !isHoje && (dias === null || dias > 7);
  });

  return (
    <View style={styles.screen}>
      <AppHeader />

      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Notificações</Text>

        <TouchableOpacity style={styles.markButton} onPress={marcarTodasComoLidas}>
          <Text style={styles.markButtonText}>Marcar todas como Lida</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'todas' && styles.activeFilter]}
          onPress={() => alterarFiltro('todas')}
        >
          <Text style={[styles.filterText, filter === 'todas' && styles.activeFilterText]}>
            Todas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'naoLidas' && styles.activeFilter]}
          onPress={() => alterarFiltro('naoLidas')}
        >
          <Text style={[styles.filterText, filter === 'naoLidas' && styles.activeFilterText]}>
            Não Lidas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filter === 'lidas' && styles.activeFilter]}
          onPress={() => alterarFiltro('lidas')}
        >
          <Text style={[styles.filterText, filter === 'lidas' && styles.activeFilterText]}>
            Lidas
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando notificações...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {notifications.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Nenhuma notificação encontrada</Text>
              <Text style={styles.emptyText}>Você ainda não possui notificações para exibir.</Text>
            </View>
          ) : (
            <>
              <NotificationSection
                title="Hoje"
                items={hojeItems}
                onPressNotification={marcarComoLida}
              />

              <NotificationSection
                title="Esta Semana"
                items={semanaItems}
                onPressNotification={marcarComoLida}
              />

              <NotificationSection
                title="Anteriores"
                items={outrasItems}
                onPressNotification={marcarComoLida}
              />
            </>
          )}
        </ScrollView>
      )}

      <BottomTabBar
        activeRoute="Notifications"
        onNavigate={(screen) => navigation.navigate(screen)}
      />
    </View>
  );
}

function NotificationSection({ title, items, onPressNotification }) {
  if (!items.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {items.map((item) => (
        <TouchableOpacity
          key={item.id || item.id_notificacao}
          style={[
            styles.card,
            item.lida && styles.cardRead,
          ]}
          onPress={() => onPressNotification?.(item)}
          activeOpacity={0.85}
        >
          <View style={[styles.iconBox, getIconStyle(item.status)]}>
            <Text style={styles.iconText}>{getIcon(item.status)}</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.titulo || item.title || 'Notificação'}
            </Text>

            <Text style={styles.cardSubtitle} numberOfLines={2}>
              {item.subtitulo || 'Data não informada'}
              {item.curso ? ` · ${item.curso}` : ''}
            </Text>
          </View>

          <View style={styles.cardRight}>
            <View style={[styles.statusBadge, getStatusBadgeStyle(item.status)]}>
              <Text style={[styles.statusText, getStatusTextStyle(item.status)]}>
                {item.status || 'Pendente'}
              </Text>
            </View>

            <Text style={styles.timeText}>
              {item.tempo_relativo || ''}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function normalizeStatus(status) {
  return String(status || '').toUpperCase();
}

function getIcon(status) {
  const value = normalizeStatus(status);

  if (value.includes('APROV')) return '✓';
  if (value.includes('PEND')) return '◷';
  if (value.includes('REJE') || value.includes('REPROV')) return '✕';

  return '!';
}

function getIconStyle(status) {
  const value = normalizeStatus(status);

  if (value.includes('APROV')) return styles.approvedIcon;
  if (value.includes('PEND')) return styles.pendingIcon;
  if (value.includes('REJE') || value.includes('REPROV')) return styles.rejectedIcon;

  return styles.pendingIcon;
}

function getStatusBadgeStyle(status) {
  const value = normalizeStatus(status);

  if (value.includes('APROV')) return styles.approvedBadge;
  if (value.includes('PEND')) return styles.pendingBadge;
  if (value.includes('REJE') || value.includes('REPROV')) return styles.rejectedBadge;

  return styles.pendingBadge;
}

function getStatusTextStyle(status) {
  const value = normalizeStatus(status);

  if (value.includes('APROV')) return styles.approvedText;
  if (value.includes('PEND')) return styles.pendingText;
  if (value.includes('REJE') || value.includes('REPROV')) return styles.rejectedText;

  return styles.pendingText;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  backIcon: {
    fontSize: 28,
    color: colors.text,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  markButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    elevation: 3,
  },
  markButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  filterButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    elevation: 3,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.text,
    fontWeight: '600',
  },
  activeFilterText: {
    color: colors.surface,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    color: colors.textMuted,
  },
  content: {
    flex: 1,
    marginTop: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  emptyBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  emptyTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 16,
  },
  emptyText: {
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 4,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  approvedIcon: {
    backgroundColor: '#e8f8e8',
  },
  pendingIcon: {
    backgroundColor: '#fff1d9',
  },
  rejectedIcon: {
    backgroundColor: '#ffe4e7',
  },
  iconText: {
    fontSize: 22,
    fontWeight: '800',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  cardSubtitle: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: 999,
  },
  approvedBadge: {
    backgroundColor: '#e8f8e8',
  },
  pendingBadge: {
    backgroundColor: '#fff1d9',
  },
  rejectedBadge: {
    backgroundColor: '#ffe4e7',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  approvedText: {
    color: colors.success,
  },
  pendingText: {
    color: colors.warning,
  },
  rejectedText: {
    color: colors.danger,
  },
  timeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  cardRead: {
    opacity: 0.65,
  },
});