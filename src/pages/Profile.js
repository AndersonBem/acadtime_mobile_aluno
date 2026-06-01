import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// IMPORTANDO O CONTEXTO GLOBAL
import { useCurso } from '../contexts/CursoContext';

// 🌟 ALTERADO: IMPORTANDO TODO O ARQUIVO DE API COMO UM OBJETO PARA EVITAR ERRO DE EXPORT UNDEFINED
import * as AlunoAPI from '../api/aluno';

export default function Perfil({ navigation }) {
  // PEGANDO O CURSO SELECIONADO GLOBAL DO CONTEXTO
  const { cursoSelecionado } = useCurso();

  // ESTADOS DA TELA
  const [alunoLogado, setAlunoLogado] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null); 

  // CARREGA OS DADOS DO ALUNO AO ENTRAR NA TELA
  useEffect(() => {
    async function carregarDadosAluno() {
      try {
        // Tenta buscar usando o novo formato de import seguro
        const funcaoPerfil = AlunoAPI.getMeuPerfilAluno || AlunoAPI.default?.getMeuPerfilAluno;
        const dadosAluno = await funcaoPerfil();
        
        if (dadosAluno) {
          setAlunoLogado(dadosAluno);

          // Renderiza a foto se ela já existir no banco
          if (dadosAluno.foto_url || dadosAluno.foto) {
            setFotoPerfil(dadosAluno.foto_url || dadosAluno.foto);
          }
        }
      } catch (error) {
        console.log("Erro ao buscar dados do perfil:", error);
      }
    }

    carregarDadosAluno();
  }, []); 

  // FUNÇÃO QUE FAZ O PATCH REAL NA API
  async function enviarFotoParaServidor(asset) {
    try {
      const formData = new FormData();
      
      const uriFormatada = Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri;

      formData.append('foto', {
        uri: uriFormatada,
        name: asset.fileName || `perfil_${Date.now()}.jpg`,
        type: asset.mimeType || asset.type || 'image/jpeg',
      });

      // 🌟 BUSCA A FUNÇÃO DE FORMA SEGURA SEJA ELA EXPORTAÇÃO DIRETA OU DEFAULT
      const funcaoAtualizarFoto = AlunoAPI.atualizarFotoPerfil || AlunoAPI.default?.atualizarFotoPerfil;

      if (!funcaoAtualizarFoto) {
        throw new Error("A função atualizarFotoPerfil não foi encontrada no arquivo api/aluno.js");
      }

      const resposta = await funcaoAtualizarFoto(formData);
      
      const novaFoto = resposta?.foto_url || resposta?.foto || asset.uri;
      setFotoPerfil(novaFoto);
      
      Alert.alert("Sucesso", "Foto de perfil atualizada com sucesso!");
    } catch (error) {
      console.log("Erro detalhado ao enviar foto para o servidor:", error);
      Alert.alert("Erro", "Não foi possível salvar a foto no servidor.");
    }
  }

  // FUNÇÕES DO IMAGE PICKER
  async function escolherDaGaleria() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert("Permissão necessária", "Precisamos de acesso à sua galeria.");
      return;
    }

    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled && resultado.assets?.[0]) {
      await enviarFotoParaServidor(resultado.assets[0]);
    }
  }

  async function tirarFotoComCamera() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert("Permissão necessária", "Precisamos de acesso à câmera.");
      return;
    }

    let resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled && resultado.assets?.[0]) {
      await enviarFotoParaServidor(resultado.assets[0]);
    }
  }

  function lidarComTrocaFoto() {
    Alert.alert(
      "Trocar Imagem de Perfil",
      "Escolha uma das opções abaixo:",
      [
        { text: "Escolher da Galeria", onPress: escolherDaGaleria },
        { text: "Tirar Foto com Câmera", onPress: tirarFotoComCamera },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  }

  return (
    <View style={styles.containerPai}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.headerAzul}>
          <View style={styles.acoesTopo}>
            <TouchableOpacity onPress={() => { if (navigation) navigation.goBack(); }}>
              <Ionicons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => { if (navigation) navigation.navigate('Notifications'); }}>
              <Ionicons name="notifications" size={26} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* AVATAR */}
          <View style={styles.containerAvatar}>
            {fotoPerfil ? (
              <Image source={{ uri: fotoPerfil }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarVazio]}>
                <Ionicons name="person" size={50} color="#ccc" />
              </View>
            )}
            
            <TouchableOpacity style={styles.botaoCamera} activeOpacity={0.8} onPress={lidarComTrocaFoto}>
              <Ionicons name="camera" size={14} color="#000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.nomeExibicao}>
            {alunoLogado?.nome || "Carregando..."}
          </Text>
          
          <Text style={styles.subtituloHeader}>
            {cursoSelecionado?.nome || "Sem curso selecionado"}
          </Text>

          <View style={styles.badgeStatus}>
            <View style={styles.pontoVerde} />
            <Text style={styles.textoStatus}>Ativo</Text>
          </View>
        </View>

        {/* ÁREA DOS CARDS DE INFORMAÇÃO */}
        <View style={styles.areaConteudo}>
          
          <View style={styles.cardInfo}>
            <View style={styles.circuloIcone}>
              <Ionicons name="person-outline" size={24} color="#000" />
            </View>
            <View style={styles.textoCardContainer}>
              <Text style={styles.labelCard}>Nome Completo</Text>
              <Text style={styles.valorCard}>{alunoLogado?.nome || "..."}</Text>
            </View>
          </View>

          <View style={styles.cardInfo}>
            <View style={styles.circuloIcone}>
              <Ionicons name="mail-outline" size={24} color="#000" />
            </View>
            <View style={styles.textoCardContainer}>
              <Text style={styles.labelCard}>E-mail</Text>
              <Text style={styles.valorCard}>{alunoLogado?.usuario?.email || alunoLogado?.email || "..."}</Text>
            </View>
          </View>

          <View style={styles.cardInfo}>
            <View style={styles.circuloIcone}>
              <Ionicons name="school-outline" size={24} color="#000" />
            </View>
            <View style={styles.textoCardContainer}>
              <Text style={styles.labelCard}>Curso</Text>
              <Text style={styles.valorCard}>{cursoSelecionado?.nome || "Não informado"}</Text>
            </View>
          </View>

          <View style={styles.cardInfo}>
            <View style={styles.circuloIcone}>
              <Ionicons name="create-outline" size={24} color="#000" />
            </View>
            <View style={styles.textoCardContainer}>
              <Text style={styles.labelCard}>Matrícula</Text>
              <Text style={styles.valorCard}>{alunoLogado?.matricula || "..."}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.botaoAcaoOutline}>
            <Ionicons name="lock-closed-outline" size={20} color="#000" style={styles.iconeBotao} />
            <Text style={styles.textoBotaoAcao}>Alterar Senha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoAcaoOutline} onPress={() => { if (navigation) navigation.navigate('Login'); }}>
            <Ionicons name="log-out-outline" size={20} color="#2b2b2b" style={styles.iconeBotao} />
            <Text style={styles.textoBotaoAcao}>Sair da conta</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* NAVBAR INFERIOR FIXA */}
      <View style={styles.navBarInferior}>
        <TouchableOpacity onPress={() => { if (navigation) navigation.navigate('Dashboard'); }}><Ionicons name="home-outline" size={24} color="#666" /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="document-text-outline" size={24} color="#666" /></TouchableOpacity>
        
        <TouchableOpacity style={styles.botaoFlutuante}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => { if (navigation) navigation.navigate('Notifications'); }}>
          <Ionicons name="notifications-outline" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity><Ionicons name="person" size={24} color="#0f4c8f" /></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerPai: { 
    flex: 1, 
    backgroundColor: '#fff',
  },
  scrollContainer: { 
    paddingBottom: 110,
  },
  headerAzul: { 
    backgroundColor: '#0f4c8f', 
    borderBottomLeftRadius: 50, 
    borderBottomRightRadius: 50, 
    paddingTop: 50, 
    paddingHorizontal: 25, 
    paddingBottom: 35, 
    alignItems: 'center',
  },
  acoesTopo: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginBottom: 10,
  },
  containerAvatar: { 
    position: 'relative', 
    marginBottom: 12,
  },
  avatar: { 
    width: 95, 
    height: 95, 
    borderRadius: 47.5, 
    borderWidth: 2, 
    borderColor: '#fff',
  },
  avatarVazio: { 
    backgroundColor: '#f0f0f0', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  botaoCamera: { 
    position: 'absolute', 
    bottom: 2, 
    right: 2, 
    backgroundColor: '#fff', 
    width: 26, 
    height: 26, 
    borderRadius: 13, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 3,
  },
  nomeExibicao: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 4, 
    textAlign: 'center',
  },
  subtituloHeader: { 
    fontSize: 12, 
    color: 'rgba(255, 255, 255, 0.8)', 
    textAlign: 'center', 
    marginBottom: 15,
  },
  badgeStatus: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
    paddingVertical: 5, 
    paddingHorizontal: 20, 
    borderRadius: 15,
  },
  pontoVerde: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: '#34c759', 
    marginRight: 6,
  },
  textoStatus: { 
    color: '#fff', 
    fontSize: 12, 
    fontWeight: '600',
  },
  areaConteudo: { 
    paddingHorizontal: 20, 
    paddingTop: 30,
  },
  cardInfo: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 14, 
    padding: 14, 
    alignItems: 'center', 
    elevation: 2, 
    marginBottom: 14,
  },
  circuloIcone: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: '#f5f5f5', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 14,
  },
  textoCardContainer: { 
    flex: 1,
  },
  labelCard: { 
    fontSize: 12, 
    color: '#666', 
    fontWeight: '500', 
    marginBottom: 2,
  },
  valorCard: { 
    fontSize: 14, 
    color: '#000', 
    fontWeight: 'bold',
  },
  botaoAcaoOutline: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1.5, 
    borderColor: '#2b2b2b', 
    borderRadius: 14, 
    height: 48, 
    marginTop: 4, 
    marginBottom: 10,
  },
  iconeBotao: { 
    marginRight: 8,
  },
  textoBotaoAcao: { 
    fontSize: 14, 
    color: '#2b2b2b', 
    fontWeight: 'bold',
  },
  navBarInferior: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: 70, 
    backgroundColor: '#fff', 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: '#eee', 
    paddingBottom: 10,
  },
  botaoFlutuante: { 
    backgroundColor: '#0f4c8f', 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: -25, 
    elevation: 4,
  },
});