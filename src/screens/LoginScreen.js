import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS } from '../styles/theme';

export default function LoginScreen({ route, navigation }) {
  const role = route.params?.role || 'client';
  const [phone, setPhone] = useState('');

  const sendOtp = ()=> {
    // For now navigation stub: go to ClientHome
    // In real app you'll call API to send OTP then navigate to OTP screen
    if (!phone || phone.length < 6) return alert('Enter phone');
    if (role === 'client') navigation.replace('ClientHome');
    else alert('Business login flow to be implemented');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Login</Text>
      <Text style={styles.h2}>Continue as {role === 'client' ? 'Client' : 'Business'}</Text>

      <TextInput
        placeholder="+91 98xxxxxxx"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />

      <PrimaryButton onPress={sendOtp}>Send OTP</PrimaryButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:20,justifyContent:'center'},
  h1:{fontSize:28,fontWeight:'700',color:COLORS.text},
  h2:{color:'#64748B', marginBottom:16},
  input:{padding:12,borderRadius:10,borderWidth:1,borderColor:'#E6EEF8',marginBottom:16}
});
