import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

import { colors, radius, spacing } from '../styles/global';

export default function FilePickerCard({
  arquivo,
  erro,
  onCamera,
  onGallery,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.iconArea}>
        <Ionicons
          name="document-text-outline"
          size={34}
          color={colors.primary}
        />
      </View>

      <Text style={styles.title}>
        Selecione seu certificado
      </Text>

      <Text style={styles.subtitle}>
        PDF, JPG ou PNG até 5MB
      </Text>

      <View style={styles.buttonsArea}>
        <PrimaryButton
          title="Tirar foto"
          onPress={onCamera}
        />

        <View style={{ height: spacing.sm }} />

        <SecondaryButton
          title="Escolher da galeria"
          onPress={onGallery}
        />
      </View>

      {arquivo && (
        <View style={styles.fileInfo}>
          <Ionicons
            name="checkmark-circle"
            size={18}
            color={colors.success}
          />

          <Text
            style={styles.fileName}
            numberOfLines={1}
          >
            {arquivo.name}
          </Text>
        </View>
      )}

      {erro && (
        <Text style={styles.errorText}>
          {erro}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  iconArea: {
    width: 68,
    height: 68,
    borderRadius: 999,

    backgroundColor: '#eef4ff',

    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'center',

    marginBottom: spacing.md,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',

    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',

    marginBottom: spacing.lg,
  },

  buttonsArea: {
    marginBottom: spacing.md,
  },

  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: spacing.sm,
  },

  fileName: {
    marginLeft: spacing.xs,
    fontSize: 13,
    color: colors.text,
    maxWidth: '85%',
  },

  errorText: {
    marginTop: spacing.sm,
    textAlign: 'center',

    color: colors.danger,
    fontSize: 12,
    fontWeight: '600',
  },
});