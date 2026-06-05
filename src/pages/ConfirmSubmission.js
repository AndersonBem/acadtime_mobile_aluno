import { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';

import Header from '../components/AppHeader';
import FooterNavigation from '../components/BottomTabBar';
import SubmissionSummaryCard from '../components/SubmissionSummaryCard';
import PrimaryButton from '../components/PrimaryButton';

import { criarSubmissao } from '../api/submissoes';
import { criarAtividadeComplementar } from '../api/atividades';
import { useCurso } from '../contexts/CursoContext';

export default function ConfirmSubmission({ route, navigation }) {
  const {
    arquivo,
    submissionData,
    tipoAtividadeSelecionadoId,
    tipoAtividadeNome,
  } = route.params;

  const { cursoSelecionado } = useCurso();


  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  function extrairHoras(valor) {
  if (!valor) return 0;

  const texto = String(valor)
    .toLowerCase()
    .replace('horas', '')
    .replace('hora', '')
    .replace('hrs', '')
    .replace('hr', '')
    .replace('h', '')
    .replace(',', '.')
    .trim();

  // Caso venha no formato 02:00
  if (texto.includes(':')) {
    const [horas, minutos] = texto.split(':');

    const h = Number(horas);
    const m = Number(minutos || 0);

    if (Number.isNaN(h) || Number.isNaN(m)) return 0;

    return h + m / 60;
  }

  const horas = Number(texto);

  return Number.isNaN(horas) ? 0 : horas;
}

  async function handleSubmit() {
    if (enviando) return;

    console.log('Cliquei em confirmar submissão');

    try {
      setEnviando(true);

      const horasSolicitadas = extrairHoras(submissionData.hours);

      console.log('Dados para criar atividade:', {
        descricao: submissionData.activity,
        horasOriginal: submissionData.hours,
        horasSolicitadas,
        tipoAtividade: tipoAtividadeSelecionadoId,
      });

      if (!horasSolicitadas) {
        console.log('Carga horária inválida:', submissionData.hours);
        return;
      }

      if (!tipoAtividadeSelecionadoId) {
        console.log('Tipo de atividade não selecionado.');
        return;
      }

      const cursoId = cursoSelecionado?.id || cursoSelecionado?.id_curso;

      console.log('Curso selecionado no contexto:', cursoSelecionado);
      console.log('Curso ID usado na submissão:', cursoId);

      if (!cursoId) {
        console.log('Nenhum curso selecionado.');
        return;
      }


      console.log('Criando atividade complementar...');

      const atividadeCriada = await criarAtividadeComplementar({
        descricao: submissionData.activity || 'Atividade complementar',
        cargaHorariaSolicitada: horasSolicitadas,
        tipoAtividade: Number(tipoAtividadeSelecionadoId),
      });

      console.log('Atividade criada:', atividadeCriada);

      const submissionDataTratada = {
        ...submissionData,
        hours: String(horasSolicitadas),
      };

      const submissaoCriada = await criarSubmissao({
        curso: cursoId,
        atividadeComplementar: atividadeCriada.id_atividade_complementar,
        arquivo,
        submissionData: submissionDataTratada,
      });

      console.log('Submissão criada:', submissaoCriada);

      navigation.replace('SuccessSubmission');
    } catch (error) {
      console.log('Erro ao criar submissão:', JSON.stringify(error, null, 2));
      setErro(error?.detail || 'Erro ao criar submissão.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.screen}>
      <Header
        onPressNotifications={() => navigation.navigate('Notifications')}
        onPressProfile={() => navigation.navigate('Profile')}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SubmissionSummaryCard
          fileName={submissionData.fileName}
          activity={tipoAtividadeNome}
          institution={submissionData.institution}
          hours={extrairHoras(submissionData.hours)}
          date={submissionData.date}
        />

        <View style={styles.buttonArea}>
          <PrimaryButton
            title={enviando ? 'Enviando...' : 'Confirmar e enviar'}
            onPress={handleSubmit}
            disabled={enviando}
          />
        </View>
      </ScrollView>

      <FooterNavigation
        activeRoute="NewSubmission"
        onNavigate={(screen) => navigation.navigate(screen)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 24,
    paddingBottom: 130,
  },

  buttonArea: {
    marginTop: 24,
    marginBottom: 24,
  },
});