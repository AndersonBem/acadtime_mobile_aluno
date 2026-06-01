import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Header from '../components/AppHeader';
import FooterNavigation from '../components/BottomTabBar';
import OCRLoadingCard from '../components/OCRLoadingCard';
import PrimaryButton from '../components/PrimaryButton';

import { extrairDadosCertificado } from '../api/ocr';
import { listarTiposAtividade } from '../api/atividades';

import { spacing } from '../styles/global';

export default function ReviewSubmission({ route, navigation }) {
  const { arquivo } = route.params;

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [submissionData, setSubmissionData] = useState({
    fileName: '',
    activity: '',
    institution: '',
    hours: '',
    date: '',
  });

  const [tiposAtividade, setTiposAtividade] = useState([]);
  const [tipoAtividadeSelecionadoId, setTipoAtividadeSelecionadoId] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);

  const tipoAtividadeSelecionado = useMemo(() => {
    return tiposAtividade.find(
      (item) => String(item.id_tipo_atividade) === String(tipoAtividadeSelecionadoId)
    );
  }, [tiposAtividade, tipoAtividadeSelecionadoId]);

  useEffect(() => {
    carregarTudo();
  }, []);

  async function carregarTudo() {
    try {
      setLoading(true);
      setErro('');

      const tiposData = await listarTiposAtividade();
      setTiposAtividade(tiposData);

          const response = await extrairDadosCertificado(arquivo);

          console.log('ARQUIVO OCR:', arquivo);
          console.log('RESPOSTA OCR:', JSON.stringify(response, null, 2));

          if (!response.sucesso) {
            setErro(
              'Não foi possível extrair os dados automaticamente. Preencha manualmente.'
            );
          }

          const dados = response?.dados_extraidos || {};

          setSubmissionData({
            fileName: arquivo.name || 'certificado.pdf',
            activity: dados.curso || dados.atividade_complementar || '',
            institution: dados.instituicao || '',
            hours: dados.carga_horaria
              ? String(dados.carga_horaria)
              : dados.carga_horaria_solicitada
                ? String(dados.carga_horaria_solicitada)
                : '',
            date: dados.data_certificado || '',
          });
    } catch (error) {
      console.log(error);
      setErro('Erro ao extrair dados.');
    } finally {
      setLoading(false);
    }
  }

  function handleContinue() {
    if (!tipoAtividadeSelecionadoId) {
      setErro('Selecione o tipo da atividade.');
      return;
    }

    navigation.navigate('ConfirmSubmission', {
      arquivo,
      submissionData,
      tipoAtividadeSelecionadoId: Number(tipoAtividadeSelecionadoId),
      tipoAtividadeNome: tipoAtividadeSelecionado?.nome || '',
    });
  }

  if (loading) {
    return (
      <View style={styles.screen}>
        <Header />
        <OCRLoadingCard />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header />

      <ScrollView contentContainerStyle={styles.container}
        style={styles.scroll}>
        <Text style={styles.title}>Revisar dados</Text>

        {!!erro && <Text style={styles.error}>{erro}</Text>}

        <Text style={styles.label}>Tipo de atividade</Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalVisivel(true)}
        >
          <Text numberOfLines={1}>
            {tipoAtividadeSelecionado?.nome || 'Selecione o tipo da atividade'}
          </Text>
        </TouchableOpacity>

        <Field
          label="Descrição da atividade"
          value={submissionData.activity}
          onChangeText={(v) =>
            setSubmissionData({ ...submissionData, activity: v })
          }
        />

        <Field
          label="Instituição"
          value={submissionData.institution}
          onChangeText={(v) =>
            setSubmissionData({ ...submissionData, institution: v })
          }
        />

        <Field
          label="Horas solicitadas"
          value={submissionData.hours}
          keyboardType="numeric"
          onChangeText={(v) =>
            setSubmissionData({ ...submissionData, hours: v })
          }
        />

        <Field
          label="Data"
          value={submissionData.date}
          onChangeText={(v) =>
            setSubmissionData({ ...submissionData, date: v })
          }
        />

        <PrimaryButton title="Continuar" onPress={handleContinue} />
      </ScrollView>

      <Modal
        visible={modalVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Selecione o tipo de atividade
            </Text>

            <FlatList
              data={tiposAtividade}
              keyExtractor={(item) => String(item.id_tipo_atividade)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setTipoAtividadeSelecionadoId(String(item.id_tipo_atividade));
                    setErro('');
                    setModalVisivel(false);
                  }}
                >
                  <Text>{item.nome}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisivel(false)}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FooterNavigation navigation={navigation} />
    </View>
  );
}

function Field({ label, value, onChangeText, keyboardType = 'default' }) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  container: {
    padding: spacing.lg,
    paddingBottom: 130,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: '70%',
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cancelButton: {
    marginTop: 12,
    alignItems: 'center',
    padding: 12,
  },
  scroll: {
  flex: 1,
},
});