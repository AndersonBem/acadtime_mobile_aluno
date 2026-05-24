import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "../styles/global";

export default function OCRLoadingCard() {
  return (
    <View style={styles.card}>
      <View style={styles.iconArea}>
        <Ionicons name="scan-outline" size={34} color={colors.primary} />
      </View>

      <Text style={styles.title}>Extraindo dados do certificado</Text>

      <Text style={styles.subtitle}>
        Estamos lendo o arquivo enviado. Isso pode levar alguns segundos.
      </Text>

      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.loading}
      />

      <Text style={styles.status}>Processando OCR...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
    elevation: 3,
  },

  iconArea: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },

  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.lg,
  },

  loading: {
    marginBottom: spacing.md,
  },

  status: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});