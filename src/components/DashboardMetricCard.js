import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../styles/global';

export default function DashboardMetricCard({
  icon,
  value,
  label,
  color,
  backgroundColor,
}) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>

      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    marginHorizontal: 3,
  },

  iconBox: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  value: {
    fontSize: 24,
    fontWeight: '800',
  },

  label: {
    fontSize: 10,
    color: colors.text,
    textAlign: 'center',
  },
});