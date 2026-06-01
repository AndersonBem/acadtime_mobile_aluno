import { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { getPerfilAluno } from '../api/perfil';
import { colors, spacing } from '../styles/global';

import { useNavigation } from '@react-navigation/native';

export default function AppHeader({
  photoUrl,
  onPressNotifications,
  onPressProfile,
}) {

  const navigation = useNavigation();

  function handlePressNotifications() {
    if (onPressNotifications) {
      onPressNotifications();
      return;
    }

    navigation.navigate('Notifications');
  }

  function handlePressProfile() {
    if (onPressProfile) {
      onPressProfile();
      return;
    }

    navigation.navigate('Profile');
  }

  const [fotoPerfil, setFotoPerfil] = useState(photoUrl || null);

  useEffect(() => {
    if (photoUrl) {
      setFotoPerfil(photoUrl);
      return;
    }

    async function carregarFotoPerfil() {
      try {
        const perfil = await getPerfilAluno();
        setFotoPerfil(perfil?.foto_perfil_url || null);
      } catch (error) {
        console.log('Erro ao carregar foto do perfil:', error);
      }
    }

    carregarFotoPerfil();
  }, [photoUrl]);

  return (
    <View style={styles.container}>
      <View style={styles.logoArea}>
        <Image
          source={require('../../assets/logo01.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onPressNotifications}
          activeOpacity={0.8}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={handlePressProfile}
          activeOpacity={0.8}
        >
          {fotoPerfil ? (
            <Image
              source={{ uri: fotoPerfil }}
              style={styles.profileImage}
            />
          ) : (
            <Ionicons name="person-outline" size={24} color={colors.text} />
          )}
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
    overflow: 'hidden',
  },

  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});