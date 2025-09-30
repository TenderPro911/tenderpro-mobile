import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/theme';

export default function SplashScreen({ navigation }) {
  useEffect(()=>{
    const t = setTimeout(()=> navigation.replace('RoleSelect'), 1200);
    return ()=> clearTimeout(t);
  },[]);

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <Text style={styles.logo}>TenderPro</Text>
      <Text style={styles.tag}>Post your home project. Get quotes. Build smarter.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,alignItems:'center',justifyContent:'center'},
  logo:{fontSize:34,fontWeight:'800',color:COLORS.primary},
  tag:{marginTop:12,color:'#334155',textAlign:'center',paddingHorizontal:40}
});
