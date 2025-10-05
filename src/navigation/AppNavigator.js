// src/navigation/AppNavigator.js (diagnostic version)
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import screens
import SplashScreen from '../screens/SplashScreen';
import RoleSelectScreen from '../screens/RoleSelectScreen';
import LoginScreen from '../screens/LoginScreen';
import ClientHome from '../screens/ClientHome';
import InteriorForm from '../screens/PostTender/InteriorForm';
import Step1_ProjectBasics from '../screens/PostTender/Step1_ProjectBasics';
import Step2_Kitchen from '../screens/PostTender/Step2_Kitchen';


// Diagnostic logging to terminal
console.log('>> NAV DIAG: types:');
console.log('SplashScreen type:', typeof SplashScreen, 'value:', SplashScreen);
console.log('RoleSelectScreen type:', typeof RoleSelectScreen, 'value:', RoleSelectScreen);
console.log('LoginScreen type:', typeof LoginScreen, 'value:', LoginScreen);
console.log('ClientHome type:', typeof ClientHome, 'value:', ClientHome);

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (

    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ClientHome" component={ClientHome} />
      <Stack.Screen name="PostTender" component={InteriorForm} />
      <Stack.Screen name="Step1_ProjectBasics" component={Step1_ProjectBasics} />
      <Stack.Screen name="Step2_Kitchen" component={Step2_Kitchen} />
    </Stack.Navigator>

  );
}
