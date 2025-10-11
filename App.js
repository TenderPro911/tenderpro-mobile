// App.js (root)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { TendersProvider } from './src/context/TendersContext';
import ConstructionPage from  './src/pages/ConstructionPage';


export default function App() {
  return (
    <TendersProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </TendersProvider>
  );
}
