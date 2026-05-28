import { StatusBar } from 'expo-status-bar';
import Routes from './src/navigation/Routes';

export default function App() {
  return (
    <>
      <Routes />
      <StatusBar hidden />
    </>
  );
}