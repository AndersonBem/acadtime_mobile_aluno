import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Importação do hook de navegação
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

/ IMPORTANDO A FUNÇÃO DE RECUPERAÇÃO DA SUA API/
import { RecuperarSenha } from '../api/auth';


export default function RecuperarSenhaScreen() {
  const navigation = useNavigation(); 
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function lidarComRecuperacao() {
    if (!email.trim()) {
      Alert.alert('Aviso', 'Por favor, digite o seu e-mail.');
      return;
    }

    setLoading(true);

    try {
      await RecuperarSenha(email.trim());
      Alert.alert(
        'Sucesso', 
        'Se o e-mail estiver cadastrado, um link de recuperação será enviado para a sua caixa de entrada.',
        [{ text: 'OK', onPress: () => navigation.goBack() }] 
      );
    } catch (error) {
      console.log('Erro ao solicitar recuperação:', error);
      const mensagemErro = error?.detail || error?.detal || 'Não foi possível solicitar a recuperação.';
      Alert.alert('Erro', mensagemErro);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <View style={styles.containerPai}>
          
          /* BOTÃO VOLTAR NO TOPO */
          <TouchableOpacity 
            style={styles.btnVoltarTopo} 
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Ionicons name="chevron-back" size={24} color="#0f4c8f" />
            <Text style={styles.textoVoltarTopo}>Voltar</Text>
          </TouchableOpacity>

          /* LOGO E TÍTULOS SUPERIORES */
          <Image
            source={require('../../assets/logo01.png')}
            style={styles.logoTopo}
          />
          
          <Text style={styles.tituloPrincipal}>Recuperar senha</Text>
          <Text style={styles.subtituloPrincipal}>
            Digite seu e-mail e enviaremos o link{"\n"}para redefinir sua senha
          </Text>

          /* CONTAINER AZUL ESCURO COM CURVA EXCLUSIVA */
          <View style={styles.containerAzul}>
            
            <View style={styles.circuloIcone}>
              <Ionicons name="mail" size={32} color="#fff" />
            </View>

            <Text style={styles.tituloForm}>Informe seu e-mail</Text>
            <Text style={styles.subtituloForm}>Enviaremos as instruções para redefinir sua senha</Text>

            <View style={styles.areaFormulario}>
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="rgba(255, 255, 255, 0.6)" style={styles.iconeInput} />
                <TextInput
                  style={styles.inputSemBorda}
                  placeholder="Digite seu email"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
                />
              </View>
            </View>

            /* BOTÃO LARANJA DE ENVIAR */
            <TouchableOpacity style={styles.botaoEnviar} onPress={lidarComRecuperacao} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="send" size={18} color="#fff" />
                  <Text style={styles.textoBotao}>Enviar Recuperação</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* CAIXA DE INFORMAÇÃO DE TEMPO (15 MINUTOS) */}
            <View style={styles.caixaAlertaTempo}>
              <Ionicons name="time-outline" size={24} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.textoAlertaTempo}>
                O link de Recuperação de senha é válido por <Text style={styles.textoDestaqueLaranja}>15 minutos</Text>. 
                Após esse período, será necessário solicitar um novo link.
              </Text>
            </View>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  containerPai: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    justifyContent: 'flex-end',
    paddingTop: 100, 
  },
  btnVoltarTopo: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  textoVoltarTopo: {
    color: '#0f4c8f',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  logoTopo: {
    width: 250,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 15,
  },
  tituloPrincipal: {
    fontSize: 26,
    color: '#0f4c8f',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtituloPrincipal: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 35,
    fontWeight: '500',
  },
  containerAzul: {
    backgroundColor: '#0f4c8f',
    alignItems: 'center',
    padding: 25,
    paddingBottom: 40,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50, 
    borderWidth: 4,
    borderColor: '#fff',
    borderBottomWidth: 0, 
  },
  circuloIcone: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 15,
  },
  tituloForm: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  subtituloForm: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginBottom: 25,
  },
  areaFormulario: {
    width: '100%',
  },
  label: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  iconeInput: {
    marginRight: 10,
  },
  inputSemBorda: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#fff',
  },
  botaoEnviar: {
    width: '100%',
    height: 52,
    backgroundColor: '#ff8a00', 
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 30,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  caixaAlertaTempo: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  textoAlertaTempo: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  textoDestaqueLaranja: {
    color: '#ff8a00',
    fontWeight: 'bold',
  },
});