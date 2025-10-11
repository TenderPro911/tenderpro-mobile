// src/pages/PaintingPage.jsx
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import PaintingWizard from "../ui/painting/PaintingWizard";

export default function PaintingPage() {
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>Painting Request</Text>
        <Text style={styles.subtitle}>Quick form to get painter quotations.</Text>

        <View style={styles.card}>
          <PaintingWizard />
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
