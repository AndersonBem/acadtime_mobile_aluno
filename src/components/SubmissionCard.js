import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../styles/global';
import StatusBadge from './StatusBadge';

export default function SubmissionCard({
  title,
  subtitle,
  date,
  status,
  onPress,
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconArea}>
        <Ionicons name="document-text-outline" size={24} color={colors.success} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>

        <Text style={styles.date}>
          {date}
        </Text>
      </View>

      <View style={styles.rightArea}>
        <StatusBadge status={status} />
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,

    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: spacing.md,

    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  iconArea: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: '#e8f7ec',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: spacing.md,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },

  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 2,
  },

  date: {
    fontSize: 11,
    color: colors.textMuted,
  },

  rightArea: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: spacing.sm,
    gap: 6,
  },
});