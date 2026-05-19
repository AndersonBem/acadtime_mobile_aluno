import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/global';

export default function BottomTabBar() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Ionicons name="home" size={24} color={colors.primary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Ionicons name="document-text-outline" size={24} color={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.centerButton}>
        <Ionicons name="add" size={28} color={colors.surface} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Ionicons name="notifications-outline" size={24} color={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Ionicons name="person-outline" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: -60,
  },
});