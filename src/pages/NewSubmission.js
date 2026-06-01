import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

import Header from '../components/AppHeader';
import FooterNavigation from '../components/BottomTabBar';
import FilePickerCard from '../components/FilePickerCard';

import { colors, spacing } from '../styles/global';

export default function NewSubmission({ navigation }) {
  const [arquivo, setArquivo] = useState(null);
  const [erro, setErro] = useState('');

  async function handlePickFile() {
    try {
      setErro('');

      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/png', 'image/jpeg'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setArquivo(result.assets[0]);
      }
    } catch {
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
    });
  }

return (
  <View style={styles.screen}>
    <Header />

    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Nova submissão</Text>

      {!!erro && <Text style={styles.error}>{erro}</Text>}

      <FilePickerCard
        arquivo={arquivo}
        erro={erro}
        onCamera={handlePickFile}
        onGallery={handlePickFile}
        onExtract={handleContinue}
      />
    </ScrollView>

    <FooterNavigation navigation={navigation} />
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
  },

  error: {
    color: 'red',
    marginBottom: 10,
  },
});