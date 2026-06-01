import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '../components/AppHeader';
import BottomTabBar from '../components/BottomTabBar';
import InfoCard from '../components/InfoCard';
import StatusBadge from '../components/StatusBadge';
import SecondaryButton from '../components/SecondaryButton';

import { getSubmissaoPorId, getUrlDownloadCertificado } from '../api/submissoes';
import { colors, spacing } from '../styles/global';

export default function SubmissionDetails({ route, navigation }) {
  const { submissionId, submission } = route.params || {};

  const [submissao, setSubmissao] = useState(submission || null);
  const [loading, setLoading] = useState(!submission);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarSubmissao() {
      if (!submissionId) return;

      try {
        setLoading(true);
        setErro('');

        const data = await getSubmissaoPorId(submissionId);
        setSubmissao(data);
      } catch (error) {
        console.log('Erro ao carregar detalhes da submissao:', error);
        setErro('Nao foi possivel carregar os detalhes da submissao.');
      } finally {
        setLoading(false);
      }
    }

    carregarSubmissao();
  }, [submissionId]);

  function abrirDocumento() {
    const url = submissao?.certificado_url;

    if (!url) {
      Alert.alert('Documento indisponivel', 'Esta submissao nao possui documento para visualizar.');
      return;
    }

    Linking.openURL(url);
  }

  function baixarDocumento() {
    const url = submissao?.certificado_url;

    if (!url) {
      Alert.alert('Documento indisponivel', 'Esta submissao nao possui documento para baixar.');
      return;
    }

    Linking.openURL(url);
  }

  async function compartilharDocumento() {
    const url = submissao?.certificado_url;

    if (!url) {
      Alert.alert('Documento indisponivel', 'Esta submissao nao possui documento para compartilhar.');
      return;
    }

    await Share.share({
      message: url,
    });
  }

  if (loading) {
    return (
      <View style={styles.screen}>
        <AppHeader />

        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.mutedText}>Carregando detalhes...</Text>
        </View>
      </View>
    );
  }

  if (erro || !submissao) {
    return (
      <View style={styles.screen}>
        <AppHeader />

        <View style={styles.center}>
          <Text style={styles.errorText}>{erro || 'Submissao nao encontrada.'}</Text>

          <SecondaryButton
            title="Voltar"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    );
  }

  const status = submissao.status_submissao_nome || 'Pendente';
  const titulo = submissao.atividade_categoria || 'Atividade complementar';
  const curso = submissao.curso_nome || '-';
  const dataEnvio = formatarData(submissao.data_envio);
  const horasSolicitadas = submissao.carga_horaria_solicitada || 0;
  const horasAprovadas = submissao.carga_horaria_aprovada || 0;
  const nomeArquivo = submissao.certificado_nome || 'certificado.pdf';

  return (
    <View style={styles.screen}>
      <AppHeader />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={styles.title}>Detalhes da submissao</Text>
        </View>

        <InfoCard>
          <View style={styles.summaryRow}>
            <View style={styles.documentIcon}>
              <Ionicons name="document-text-outline" size={28} color={colors.success} />
            </View>

            <View style={styles.summaryText}>
              <Text style={styles.summaryTitle} numberOfLines={2}>
                {titulo}
              </Text>

              <Text style={styles.summarySubtitle}>
                Enviado em {dataEnvio}
              </Text>
            </View>

            <StatusBadge status={status} />
          </View>
        </InfoCard>

        <Text style={styles.sectionTitle}>Informacoes da atividade</Text>

        <InfoCard>
          <InfoLine
            icon="school-outline"
            label="Curso"
            value={curso}
          />

          <InfoLine
            icon="pricetag"
            label="Tipo de atividade"
            value={titulo}
          />

          <InfoLine
            icon="calendar-outline"
            label="Data de envio"
            value={dataEnvio}
          />

          <InfoLine
            icon="time-outline"
            label="Carga horaria informada"
            value={`${horasSolicitadas} horas`}
          />

          <InfoLine
            icon="checkmark-circle-outline"
            label="Horas aprovadas"
            value={`${horasAprovadas} horas`}
            valueColor={colors.success}
            last
          />
        </InfoCard>

        <Text style={styles.sectionTitle}>Observacao do coordenador</Text>

        <InfoCard>
          <View style={styles.observationRow}>
            <View style={styles.quoteIcon}>
              <Ionicons name="chatquote" size={24} color={colors.surface} />
            </View>

            <View style={styles.observationText}>
              <Text style={styles.observation}>
                {submissao.observacao_coordenador || 'Nenhuma observacao informada.'}
              </Text>

              <Text style={styles.evaluator}>
                Avaliador: {submissao.coordenador_nome || '-'}
              </Text>
            </View>
          </View>
        </InfoCard>

        <Text style={styles.sectionTitle}>Documento enviado</Text>

        <InfoCard>
          <View style={styles.fileRow}>
            <View style={styles.pdfIcon}>
              <Ionicons name="document-outline" size={28} color={colors.danger} />
              <Text style={styles.pdfText}>PDF</Text>
            </View>

            <View style={styles.fileText}>
              <Text style={styles.fileName} numberOfLines={1}>
                {nomeArquivo}
              </Text>

              <Text style={styles.fileSize}>
                Documento enviado
              </Text>
            </View>

            <TouchableOpacity style={styles.viewButton} onPress={abrirDocumento}>
              <Ionicons name="eye" size={18} color={colors.primary} />
              <Text style={styles.viewButtonText}>Visualizar</Text>
            </TouchableOpacity>
          </View>
        </InfoCard>

        <Text style={styles.sectionTitle}>Ações</Text>

        <View style={styles.actionsRow}>
          <SecondaryButton title="Abrir PDF" onPress={abrirDocumento} />
          <SecondaryButton title="Compartilhar" onPress={compartilharDocumento} />
          <SecondaryButton title="Baixar" onPress={baixarDocumento} />
        </View>

        <InfoCard>
          <View style={styles.importantRow}>
            <Ionicons name="information-circle-outline" size={18} color={colors.primary} />

            <View style={styles.importantText}>
              <Text style={styles.importantTitle}>Importante</Text>
              <Text style={styles.importantDescription}>
                Voce pode baixar ou compartilhar este documento sempre que precisar.
              </Text>
            </View>
          </View>
        </InfoCard>
      </ScrollView>

      <BottomTabBar
        activeRoute="Submissions"
        onNavigate={(screen) => navigation.navigate(screen)}
      />
    </View>
  );
}

function InfoLine({ icon, label, value, valueColor, last }) {
  return (
    <View style={[styles.infoLine, last && styles.infoLineLast]}>
      <Ionicons name={icon} size={22} color={colors.primary} />

      <Text style={styles.infoLabel}>{label}</Text>

      <Text style={[styles.infoValue, valueColor && { color: valueColor }]}>
        {value}
      </Text>
    </View>
  );
}

function formatarData(data) {
  if (!data) return '-';

  const date = new Date(data);

  if (Number.isNaN(date.getTime())) {
    return data;
  }

  return date.toLocaleDateString('pt-BR');
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
    padding: spacing.lg,
    paddingBottom: 110,
    gap: spacing.md,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },

  mutedText: {
    color: colors.textMuted,
  },

  errorText: {
    color: colors.danger,
    textAlign: 'center',
    fontWeight: '600',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#e8f7ec',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  summaryText: {
    flex: 1,
    marginRight: spacing.sm,
  },

  summaryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },

  summarySubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.sm,
  },

  infoLine: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: spacing.md,
  },

  infoLineLast: {
    borderBottomWidth: 0,
  },

  infoLabel: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 13,
  },

  infoValue: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    textAlign: 'right',
    fontWeight: '600',
  },

  observationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  quoteIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  observationText: {
    flex: 1,
  },

  observation: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
  },

  evaluator: {
    color: colors.text,
    fontSize: 12,
    marginTop: spacing.sm,
    fontWeight: '600',
  },

  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  pdfIcon: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  pdfText: {
    color: colors.danger,
    fontSize: 9,
    fontWeight: '800',
  },

  fileText: {
    flex: 1,
  },

  fileName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },

  fileSize: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },

  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#c9c9c9',
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },

  viewButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },

  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  importantRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },

  importantText: {
    flex: 1,
  },

  importantTitle: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },

  importantDescription: {
    color: colors.primary,
    fontSize: 12,
    marginTop: 4,
  },
});