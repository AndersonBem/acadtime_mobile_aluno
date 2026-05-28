import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/global';

const tabs = [
  {
    key: 'Dashboard',
    icon: 'home',
  },
  {
    key: 'Submissions',
    icon: 'document-text-outline',
  },
  {
    key: 'NewSubmission',
    icon: 'add',
    center: true,
  },
  {
    key: 'Notifications',
    icon: 'notifications-outline',
  },
  {
    key: 'Profile',
    icon: 'person-outline',
  },
];

export default function BottomTabBar({ activeRoute = 'Dashboard', onNavigate }) {
  function handlePress(tab) {
    if (!onNavigate) {
      return;
    }

    onNavigate(tab.key);
  }

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeRoute === tab.key;

        const iconColor = tab.center
          ? colors.surface
          : isActive
            ? colors.primary
            : colors.text;

        return (
          <TouchableOpacity
            key={tab.key}
            style={tab.center ? styles.centerButton : styles.button}
            onPress={() => handlePress(tab)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={tab.icon}
              size={tab.center ? 28 : 24}
              color={iconColor}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: -60,
  },
});