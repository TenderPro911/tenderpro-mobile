// src/ui/architect/steps/StepBasic.jsx
import React from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";

const chip = (selected) => ({
  paddingHorizontal: 10,
  paddingVertical: 8,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: selected ? "#4f46e5" : "#E5E7EB",
  backgroundColor: selected ? "#4f46e5" : "#fff",
  marginRight: 8,
  marginTop: 8,
});

export default function StepBasic({ data = {}, update = () => {}, next }) {
  const requiredOk = () => {
    return (
      data.projectType &&
      data.scopeOfWork &&
      data.builtUpArea &&
      data.floorsPlanned &&
      data.projectCategory
    );
  };

  return (
    <View>
      <Text style={styles.label}>Type of project *</Text>
      <View style={styles.row}>
        {["Individual House", "Apartment", "Villa", "Commercial", "Industrial", "Institutional"].map((o) => (
          <TouchableOpacity key={o} onPress={() => update({ projectType: o })} style={chip(data.projectType === o)}>
            <Text style={{ color: data.projectType === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Scope of work *</Text>
      <View style={styles.row}>
        {[
          "Full Architecture Design",
          "Floor Plan Only",
          "Elevation Design",
          "Interior Layout Planning",
          "Renovation / Remodelling",
          "Others",
        ].map((o) => (
          <TouchableOpacity key={o} onPress={() => update({ scopeOfWork: o })} style={chip(data.scopeOfWork === o)}>
            <Text style={{ color: data.scopeOfWork === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Built-up area (approx.) *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 2000 (sq.ft)"
        value={data.builtUpArea || ""}
        onChangeText={(t) => update({ builtUpArea: t })}
      />

      <Text style={styles.label}>Number of floors planned *</Text>
      <View style={styles.row}>
        {["G+0", "G+1", "G+2", "G+3 or more"].map((o) => (
          <TouchableOpacity key={o} onPress={() => update({ floorsPlanned: o })} style={chip(data.floorsPlanned === o)}>
            <Text style={{ color: data.floorsPlanned === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Project type *</Text>
      <View style={styles.row}>
        {["New Building", "Renovation", "Extension"].map((o) => (
          <TouchableOpacity key={o} onPress={() => update({ projectCategory: o })} style={chip(data.projectCategory === o)}>
            <Text style={{ color: data.projectCategory === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Total project budget (optional)</Text>
      <View style={styles.row}>
        {["<₹10 lakh", "₹10–25 lakh", "₹25–50 lakh", "₹50–100 lakh", "₹1 Cr+"].map((o) => (
          <TouchableOpacity key={o} onPress={() => update({ budgetRange: o })} style={chip(data.budgetRange === o)}>
            <Text style={{ color: data.budgetRange === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.rowEnd}>
        <TouchableOpacity
          disabled={!requiredOk()}
          onPress={() => requiredOk() && next && next()}
          style={[styles.btn, { backgroundColor: requiredOk() ? "#4f46e5" : "#E5E7EB" }]}
        >
          <Text style={{ color: requiredOk() ? "#fff" : "#666", fontWeight: "600" }}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginTop: 12, color: "#374151", fontWeight: "600" },
  row: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  input: { borderWidth: 1, borderColor: "#E5E7EB", padding: 10, borderRadius: 6, marginTop: 8, backgroundColor: "#fff" },
  rowEnd: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
  btn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 6 },
});
