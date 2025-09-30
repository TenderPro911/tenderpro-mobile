import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, SPACING } from '../styles/theme';

export default function RoleSelectScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who are you?</Text>
      <Text style={styles.subtitle}>Choose how you want to use TenderPro</Text>

      <View style={{marginTop: SPACING.l}} />
      <PrimaryButton style={{marginBottom: 12}} onPress={() => navigation.navigate('Login', { role: 'client'})}>
        I am a House Owner (Client)
      </PrimaryButton>

      <PrimaryButton style={{backgroundColor: COLORS.secondary}} onPress={() => navigation.navigate('Login', { role: 'business'})}>
        I am a Business / Professional
      </PrimaryButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, padding:20, justifyContent:'center'},
  title:{fontSize:28,fontWeight:'700', color:COLORS.text},
  subtitle:{marginTop:6,color:'#475569'}
});
