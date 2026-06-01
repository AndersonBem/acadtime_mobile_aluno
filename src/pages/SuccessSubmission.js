import { View, StyleSheet } from 'react-native';

import Header from '../components/AppHeader';
import FooterNavigation from '../components/BottomTabBar';
import SuccessFeedbackCard from '../components/SuccessFeedbackCard';

export default function SuccessSubmission({ navigation }) {
  return (
    <View style={styles.screen}>
      <Header
        onPressNotifications={() => navigation.navigate('Notifications')}
        onPressProfile={() => navigation.navigate('Profile')}
      />

      <View style={styles.content}>
        <SuccessFeedbackCard
          title="Submissão enviada!"
          message="Seu certificado foi enviado com sucesso para análise."
          buttonText="Voltar ao início"
          onPress={() => navigation.navigate('Dashboard')}
        />
      </View>

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

  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
});