import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import Header from '../components/AppHeader';
import FooterNavigation from '../components/BottomTabBar';
import FilePickerCard from '../components/FilePickerCard';

import { colors, spacing } from '../styles/global';

export default function NewSubmission({ navigation }) {
  const [arquivo, setArquivo] = useState(null);
  const [erro, setErro] = useState('');

  async function handleTakePhoto() {
    try {
      setErro('');

      const permissao =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissao.granted) {
        setErro('Permissão para acessar a câmera negada.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (result.canceled) return;

      const foto = result.assets[0];

      setArquivo({
        uri: foto.uri,
        name: foto.fileName || 'certificado.jpg',
        type: foto.mimeType || 'image/jpeg',
      });
    } catch (error) {
      console.log('Erro ao abrir câmera:', error);
      setErro('Erro ao abrir a câmera.');
    }
  }

  async function handlePickFile() {
    try {
      setErro('');

      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'image/png',
          'image/jpeg',
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setArquivo(result.assets[0]);
      }
    } catch (error) {
      console.log(error);
      setErro('Erro ao selecionar arquivo.');
    }
  }

  function handleContinue() {
    if (!arquivo) {
      setErro('Selecione um certificado.');
      return;
    }

    navigation.navigate('ReviewSubmission', {
      arquivo,
      modoManual: false,
    });
  }

  function handleManualContinue() {
    if (!arquivo) {
      setErro('Selecione um certificado antes de continuar.');
      return;
    }

    navigation.navigate('ReviewSubmission', {
      arquivo,
      modoManual: true,
    });
  }

  return (
    <View style={styles.screen}>
      <Header
        onPressNotifications={() =>
          navigation.navigate('Notifications')
        }
        onPressProfile={() =>
          navigation.navigate('Profile')
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Nova submissão
        </Text>

        {!!erro && (
          <Text style={styles.error}>
            {erro}
          </Text>
        )}

        <FilePickerCard
          arquivo={arquivo}
          erro={erro}
          onCamera={handleTakePhoto}
          onGallery={handlePickFile}
          onExtract={handleContinue}
        />

        <TouchableOpacity
          style={[
            styles.manualButton,
            !arquivo && styles.manualButtonDisabled,
          ]}
          onPress={handleManualContinue}
          disabled={!arquivo}
        >
          <Text style={styles.manualButtonText}>
            Continuar sem extração de dados
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <FooterNavigation
        activeRoute="NewSubmission"
        onNavigate={(screen) =>
          navigation.navigate(screen)
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scroll: {
    flex: 1,
  },

  container: {
    padding: spacing.lg,
    paddingBottom: 130,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    color: colors.text,
  },

  error: {
    color: 'red',
    marginBottom: 10,
  },

  manualButton: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },

  manualButtonDisabled: {
    opacity: 0.5,
  },

  manualButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
});