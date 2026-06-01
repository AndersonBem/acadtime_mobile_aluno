import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// IMPORTANDO DA  API
import { login } from '../api/auth';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);

  //  FUNÇÃO DE BIOMETRIA TRAVADA SE OS CAMPOS ESTIVEREM VAZIOS
  async function autenticarBiometria() {
    try {
    
      if (email.trim() === '' || senha.trim() === '') {
        Alert.alert(
          'Acesso Negado',
          'Para entrar com a biometria, você precisa digitar seu e-mail e sua senha primeiro.'
        );
        return; 
      }

   
      const compativel = await LocalAuthentication.hasHardwareAsync();
      const salvas = await LocalAuthentication.isEnrolledAsync();
      if (!compativel || !salvas) {
        Alert.alert('Erro', 'Autenticação biométrica indisponível ou não cadastrada no dispositivo.');
        return;
      }

   
      const resultado = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirme sua biometria para entrar',
        fallbackLabel: 'Usar senha',
      });

      if (resultado.success) {
        setLoading(true);
        console.log('Biometria aceita. Validando os dados digitados na API...');

    
        const response = await login(email.trim(), senha);
        console.log('Resposta da API na biometria:', response);

      
        await SecureStore.setItemAsync('saved_email', String(email).trim());
        await SecureStore.setItemAsync('saved_password', String(senha));

        Alert.alert('Sucesso', 'Bem-vindo de volta!');
        if (navigation) navigation.navigate('dashboard');
      }
    } catch (error) {
      console.log('Erro conhecido na autenticação biométrica:', error);
      Alert.alert('ERRO', 'E-mail ou senha incorretos!');
    } finally {
      setLoading(false);
    }
  }

  //  FUNÇÃO DE LOGIN 
  async function fazerLogin() {
    if (email.trim() === '' || senha.trim() === '') {
      Alert.alert('ERRO', 'Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      // Faz a autenticação da API 
      const data = await login(email, senha);
      console.log('Login manual bem-sucedido:', data);

      // Salva os dados para histórico seguro do aparelho
      await SecureStore.setItemAsync('saved_email', String(email).trim());
      await SecureStore.setItemAsync('saved_password', String(senha));

      setLoading(false);
      if (navigation) navigation.navigate('dashboard');

    } catch (error) {
      setLoading(false);
      console.log('Erro capturado no Login manual:', error);
      const mensagemErro = error?.detail || error?.detal || 'E-mail ou senha incorretos!';
      Alert.alert('ERRO', mensagemErro);
    }
  }

  return (
    <View style={styles.containerPai}>
      <Image
        source={require('../../assets/logo01.png')}
        style={styles.logoTopo}
      />
      <Text style={styles.SubTitulo}>
        Bem-vindo ao <Text style={styles.textoAzul}>Acad</Text><Text style={styles.textoLaranja}>Time</Text>{"\n"}
        <Text style={styles.SubTitulo01}>
          Faça login para continuar sua jornada
        </Text>
      </Text>

      <View style={styles.container}>
        <View style={styles.headerTextos}>
          <Text style={styles.login}>Login</Text>
          <Text style={styles.texto}>Acesse sua conta para continuar</Text>
        </View>

        <View style={styles.areaFormulario}>
          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="rgba(255, 255, 255, 0.6)" style={styles.iconeInput} />
            <TextInput
              style={styles.inputSemBorda}
              placeholder="Digite seu email"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="rgba(255, 255, 255, 0.6)" style={styles.iconeInput} />
            <TextInput
              style={styles.inputSemBorda}
              placeholder="Digite sua senha"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={secureText}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
              <Ionicons
                name={secureText ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="rgba(255, 255, 255, 0.6)"
              />
            </TouchableOpacity>
          </View>
        </View>

 
        <TouchableOpacity 
          style={styles.btnEsqueceuSenha} 
          onPress={() => { if (navigation) navigation.navigate('RecuperarSenha'); }} 
          disabled={loading}
        >
          <Text style={styles.textoEsqueceuSenha}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.botao, { flexDirection: 'row', gap: 10 }]} onPress={fazerLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="log-in-outline" size={22} color="#fff" />
              <Text style={styles.textoBotao}>Entrar</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.containerDivisoria}>
          <View style={styles.linha} />
          <Text style={styles.textoOu}>ou</Text>
          <View style={styles.linha} />
        </View>

        <TouchableOpacity
          style={styles.botaoBiometria}
          onPress={autenticarBiometria}
          disabled={loading}
        >
          <MaterialCommunityIcons name="fingerprint" size={36} color="#fff" />
          <Text style={styles.textoBiometria}>Entrar com biometria</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f4c8f',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 1,
    height: 660,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopRightRadius:30,
    borderWidth: 5,
    borderColor: '#fff'
  },
  headerTextos: {
    alignSelf: 'center',
    width: '100%',
    marginBottom: 170,
    marginTop: -20,
    paddingHorizontal: 5,
  },
  login: {
    fontSize: 35,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  texto: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  botao: {
    width: '100%',
    height: 55,
    backgroundColor: '#f5a623',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnEsqueceuSenha: {
    alignSelf: 'flex-end',
    marginBottom: 25,
    paddingVertical: 5,
  },
  textoEsqueceuSenha: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  areaFormulario: {
    width: '100%',
    marginTop: -80,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 5,
    paddingLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  iconeInput: {
    marginRight: 10,
  },
  inputSemBorda: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#fff',
  },
  containerDivisoria: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  linha: {
    flex: 1,
    height: 1,
    backgroundColor: '#fff',
  },
  textoOu: {
    color: '#fff',
    paddingHorizontal: 5,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'lowercase',
  },
  botaoBiometria: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 10,
  },
  textoBiometria: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  containerPai: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    justifyContent: 'flex-end',
  },
  logoTopo: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 30,
  },
  SubTitulo: {
    fontSize: 22,
    color: '#0f4c8f',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 60,
  },
  textoAzul: {
    color: '#0f4c8f',
  },
  textoLaranja: {
    color: '#ff8a00',
  },
  SubTitulo01: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#666',
    lineHeight: 15,
  },
});