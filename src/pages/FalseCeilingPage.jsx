// src/pages/FalseCeilingPage.jsx
import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import FalseCeilingWizard from "../ui/falseceiling/FalseCeilingWizard";

export default function FalseCeilingPage() {
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>False Ceiling Request</Text>
        <Text style={styles.subtitle}>Quick form to get false ceiling quotations.</Text>

        <View style={styles.card}>
          <FalseCeilingWizard />
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
