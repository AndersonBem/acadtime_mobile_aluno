import { StatusBar } from 'expo-status-bar';
import Dashboard from './src/pages/dashboard';

export default function App() {
  return (
    <>
      <Dashboard />
      <StatusBar hidden/>
    </>
  );
}