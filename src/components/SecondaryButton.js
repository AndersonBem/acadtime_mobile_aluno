import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, radius, spacing } from '../styles/global';

export default function SecondaryButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.surface,
    height: 46,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.text,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: spacing.lg,
  },

  text: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});