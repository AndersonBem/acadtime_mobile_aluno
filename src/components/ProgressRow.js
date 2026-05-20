import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../styles/global';

export default function ProgressRow({
  icon,
  title,
  current,
  total,
  percent,
  color,
  backgroundColor,
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.iconBox, { backgroundColor }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>

      <View style={styles.content}>
        <View style={styles.topLine}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.hours}>{current}h de {total}h</Text>
        </View>

        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: color }]} />
        </View>
      </View>

      <View style={[styles.percentBox, { backgroundColor }]}>
        <Text style={[styles.percentText, { color }]}>{percent}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  content: {
    flex: 1,
  },

  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  title: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },

  hours: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },

  barBackground: {
    height: 7,
    backgroundColor: '#d9d9d9',
    borderRadius: 10,
    overflow: 'hidden',
  },

  barFill: {
    height: '100%',
    borderRadius: 10,
  },

  percentBox: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: spacing.sm,
  },

  percentText: {
    fontSize: 11,
    fontWeight: '700',
  },
});