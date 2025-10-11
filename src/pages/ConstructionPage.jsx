// src/pages/ConstructionPage.jsx
import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import ConstructionWizard from "../ui/construction/ConstructionWizard";

export default function ConstructionPage() {
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.heading}>Construction Project Request</Text>
        <Text style={styles.subtext}>
          Fill this to get contractor quotations for construction work.
        </Text>

        <View style={styles.card}>
          <ConstructionWizard />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingVertical: 16, backgroundColor: "#FAFBFF", flexGrow: 1 },
  container: { paddingHorizontal: 16 },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 8, color: "#111827" },
  subtext: { fontSize: 14, color: "#6B7280", marginBottom: 16 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    elevation: 2, // adds shadow on Android
    shadowColor: "#000", // adds shadow on iOS
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});

