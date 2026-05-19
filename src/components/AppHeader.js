import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../styles/global';

export default function AppHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.logoArea}>
        <Image
          source={require('../../assets/logo01.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: 15, 
  },

  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 150,
    height: 250,
    resizeMode: 'contain',
    marginRight: 4,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileButton: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: colors.text,
    borderRadius: 18,

    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: spacing.sm,
  },
});