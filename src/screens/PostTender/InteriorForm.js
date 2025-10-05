// src/screens/PostTender/InteriorForm.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Step1_ProjectBasics from './Step1_ProjectBasics';

export default function InteriorForm({ navigation }) {
  const [step, setStep] = useState(1);

  function goNext() {
    setStep(s => s + 1);
  }
  function goBack() {
    setStep(s => Math.max(1, s - 1));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Post Interior Tender</Text>

      {/* Progress / step indicator (simple) */}
      <Text style={styles.progress}>Step {step} of 5</Text>

      <View style={styles.content}>
        {step === 1 && <Step1_ProjectBasics onNext={goNext} />}
        {/* later: render Step2, Step3 ... */}
      </View>

      {/* optional: back button could be added here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: '700', marginTop: 8 },
  progress: { color: '#666', marginTop: 6, marginBottom: 12 },
  content: { flex: 1 },
});
