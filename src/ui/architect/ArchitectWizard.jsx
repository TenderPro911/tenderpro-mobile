// src/ui/architect/ArchitectWizard.jsx
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import StepBasic from "./steps/StepBasic";
import StepDetails from "./steps/StepDetails";
import ReviewSubmit from "./steps/ReviewSubmit";

const steps = [
  { id: "basic", title: "Project Overview" },
  { id: "details", title: "Services & Schedule" },
  { id: "review", title: "Review & Submit" },
];

export default function ArchitectWizard() {
  const [index, setIndex] = useState(0);
  const [form, setForm] = useState({
    // Step 1
    projectType: "", // residence type
    scopeOfWork: "",
    builtUpArea: "",
    floorsPlanned: "",
    projectCategory: "", // new/renovation/extension
    budgetRange: "",
    // Step 2
    services: [], // array
    consultationMode: "",
    startDate: "",
    completionDate: "",
    tenderCloseDate: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    notes: "",
    files: [],
  });

  function update(patch) {
    setForm((f) => ({ ...f, ...patch }));
  }
  function next() {
    setIndex((i) => Math.min(steps.length - 1, i + 1));
  }
  function prev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  const common = { data: form, update, next, prev };

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {steps[index].title} • Step {index + 1}/{steps.length}
        </Text>
      </View>

      <View style={styles.container}>
        {index === 0 && <StepBasic {...common} />}
        {index === 1 && <StepDetails {...common} />}
        {index === 2 && <ReviewSubmit {...common} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 8 },
  headerTitle: { fontSize: 14, color: "#374151", fontWeight: "600" },
  container: { backgroundColor: "#fff", borderRadius: 8, padding: 12 },
});
