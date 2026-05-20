import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../styles/global';

export default function StatusBadge({ status }) {
  const statusStyle = getStatusStyle(status);

  return (
    <View style={[styles.badge, { backgroundColor: statusStyle.background }]}>
      <Text style={[styles.text, { color: statusStyle.color }]}>
        {status}
      </Text>
    </View>
  );
}

function getStatusStyle(status) {
  const value = String(status || '').toLowerCase();

  if (value.includes('aprov')) {
    return {
      background: '#e8f7ec',
      color: colors.success,
    };
  }

  if (value.includes('pend')) {
    return {
      background: '#fff3d6',
      color: colors.warning,
    };
  }

  if (value.includes('reje') || value.includes('reprov')) {
    return {
      background: '#fdeaea',
      color: colors.danger,
    };
  }

  return {
    background: '#e5e7eb',
    color: colors.textMuted,
  };
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.lg,
  },

  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});