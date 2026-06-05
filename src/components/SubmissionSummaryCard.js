import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing } from '../styles/global';

export default function SubmissionSummaryCard({
  fileName,
  activity,
  institution,
  hours,
  date,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name="document-text-outline"
          size={24}
          color={colors.primary}
        />

        <Text style={styles.headerTitle}>
          Resumo da submissão
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <InfoItem label="Arquivo" value={fileName} />
        <InfoItem label="Atividade" value={activity} />
        <InfoItem label="Instituição" value={institution} />
        <InfoItem label="Carga Horária" value={String(hours || '-')} />
        <InfoItem label="Data" value={date} />
      </View>

      <View style={styles.successArea}>
        <Ionicons
          name="checkmark-circle"
          size={18}
          color={colors.success}
        />

        <Text style={styles.successText}>
          Dados extraídos com sucesso
        </Text>
      </View>
    </View>
  );
}

function InfoItem({ label, value }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value || '-'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    elevation: 3,
    gap: spacing.md,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },

  infoContainer: {
    gap: spacing.md,
  },

  infoItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    paddingBottom: spacing.sm,
  },

  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },

  successArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#EAF8F0',
    padding: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },

  successText: {
    color: colors.success,
    fontWeight: '600',
    fontSize: 13,
  },
});