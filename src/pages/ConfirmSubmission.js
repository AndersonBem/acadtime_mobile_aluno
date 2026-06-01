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
import { listarInscricoesAtivasDoAluno, listarCursos } from '../api/cursos';
import { criarAtividadeComplementar } from '../api/atividades';

export default function ConfirmSubmission({ route, navigation }) {
  const {
    arquivo,
    submissionData,
    tipoAtividadeSelecionadoId,
    tipoAtividadeNome,
  } = route.params;

  const [enviando, setEnviando] = useState(false);

  function extrairHoras(valor) {
    const somenteNumeros = String(valor || '').replace(/\D/g, '');
    const horas = Number(somenteNumeros);

    return Number.isNaN(horas) ? 0 : horas;
  }

  async function handleSubmit() {
    if (enviando) return;

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

      const inscricoesAtivas = await listarInscricoesAtivasDoAluno();
      const cursos = await listarCursos();

      const inscricaoAtiva = inscricoesAtivas[0];

      if (!inscricaoAtiva) {
        console.log('Nenhuma inscrição ativa encontrada.');
        return;
      }

      const cursoEncontrado = cursos.find(
        (curso) =>
          curso.nome?.toLowerCase().trim() ===
          inscricaoAtiva.nome_curso?.toLowerCase().trim()
      );

      if (!cursoEncontrado) {
        console.log('Curso não encontrado:', inscricaoAtiva.nome_curso);
        return;
      }

      const atividadeCriada = await criarAtividadeComplementar({
        descricao: submissionData.activity || 'Atividade complementar',
        cargaHorariaSolicitada: horasSolicitadas,
        tipoAtividade: Number(tipoAtividadeSelecionadoId),
      });

      const submissionDataTratada = {
        ...submissionData,
        hours: String(horasSolicitadas),
      };

      await criarSubmissao({
        curso: cursoEncontrado.id_curso,
        atividadeComplementar: atividadeCriada.id_atividade_complementar,
        arquivo,
        submissionData: submissionDataTratada,
      });

      navigation.replace('SuccessSubmission');
    } catch (error) {
      console.log('Erro ao criar submissão:', error);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.screen}>
      <Header />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SubmissionSummaryCard
          fileName={submissionData.fileName}
          activity={tipoAtividadeNome}
          institution={submissionData.institution}
          hours={submissionData.hours}
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

      <FooterNavigation navigation={navigation} />
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