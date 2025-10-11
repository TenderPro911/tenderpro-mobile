// src/pages/FlooringPage.jsx
import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import FlooringWizard from "../ui/flooring/FlooringWizard";

export default function FlooringPage() {
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>Flooring Request</Text>
        <Text style={styles.subtitle}>Quick form to get flooring quotations.</Text>

        <View style={styles.card}>
          <FlooringWizard />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingVertical: 16, backgroundColor: "#FAFBFF", flexGrow: 1 },
  container: { paddingHorizontal: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 6 },
  subtitle: { color: "#6b7280", marginBottom: 12 },
  card: { backgroundColor: "#fff", borderRadius: 8, padding: 12, elevation: 2 },
});
