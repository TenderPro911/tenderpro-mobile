// src/ui/falseceiling/steps/StepBasic.jsx
import React from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";

const chipStyle = (selected) => ({
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
  const toggleMulti = (field, value) => {
    const s = new Set(data[field] || []);
    if (s.has(value)) s.delete(value);
    else s.add(value);
    update({ [field]: Array.from(s) });
  };

  const requiredOk = () => {
    return (
      data.projectType &&
      data.areaRange &&
      (data.locations || []).length > 0 &&
      data.existingCondition &&
      data.materialsBy
    );
  };

  return (
    <View>
      <Text style={styles.label}>Project type *</Text>
      <View style={styles.row}>
        {["Residential", "Commercial", "Retail", "Industrial"].map((o) => (
          <TouchableOpacity key={o} onPress={() => update({ projectType: o })} style={chipStyle(data.projectType === o)}>
            <Text style={{ color: data.projectType === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Approx. area to be ceilinged *</Text>
      <View style={styles.row}>
        {["<100 sqft", "100-300 sqft", "300-600 sqft", "600-1200 sqft", "1200+ sqft"].map((o) => (
          <TouchableOpacity key={o} onPress={() => update({ areaRange: o })} style={chipStyle(data.areaRange === o)}>
            <Text style={{ color: data.areaRange === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Rooms / locations included * (multi-select)</Text>
      <View style={styles.row}>
        {["Living room", "Bedroom", "Kitchen", "Bathroom", "Office", "Lobby", "Shop floor", "Other"].map((o) => {
          const sel = (data.locations || []).includes(o);
          return (
            <TouchableOpacity key={o} onPress={() => toggleMulti("locations", o)} style={chipStyle(sel)}>
              <Text style={{ color: sel ? "#fff" : "#111827" }}>{o}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Existing ceiling condition *</Text>
      <View style={styles.row}>
        {["Good (no removal)", "Minor patching needed", "Old ceiling removal required", "Exposed services", "Unknown — site visit"].map((o) => (
          <TouchableOpacity key={o} onPress={() => update({ existingCondition: o })} style={chipStyle(data.existingCondition === o)}>
            <Text style={{ color: data.existingCondition === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Who provides materials? *</Text>
      <View style={styles.row}>
        {["Contractor supplies", "Client supplies", "Mix (both)"].map((o) => (
          <TouchableOpacity key={o} onPress={() => update({ materialsBy: o })} style={chipStyle(data.materialsBy === o)}>
            <Text style={{ color: data.materialsBy === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Preferred start date (optional)</Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        value={data.startDate || ""}
        onChangeText={(t) => update({ startDate: t })}
        style={styles.input}
      />

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
