// src/ui/flooring/steps/StepBasic.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

const chip = (label, selected) => ({
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
  const [locationsText, setLocationsText] = useState("");

  const toggleMulti = (field, value) => {
    const s = new Set(data[field] || []);
    if (s.has(value)) s.delete(value);
    else s.add(value);
    update({ [field]: Array.from(s) });
  };

  const requiredOk = () => {
    return data.projectType && data.areaRange && (data.locations || []).length && data.existingCondition && data.materialsBy;
  };

  return (
    <View>
      <Text style={styles.label}>Project type *</Text>
      <View style={styles.row}>
        {["Residential", "Commercial", "Industrial", "Retail"].map((o) => (
          <TouchableOpacity
            key={o}
            onPress={() => update({ projectType: o })}
            style={chip(o, data.projectType === o)}
          >
            <Text style={{ color: data.projectType === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Area to be floored *</Text>
      <View style={styles.row}>
        {["<200", "200-500", "500-1000", "1000-2000", "2000+"].map((o) => (
          <TouchableOpacity
            key={o}
            onPress={() => update({ areaRange: o })}
            style={chip(o, data.areaRange === o)}
          >
            <Text style={{ color: data.areaRange === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Location / Room types * (multi-select)</Text>
      <View style={styles.row}>
        {[
          "Living room",
          "Bedrooms",
          "Kitchen",
          "Bathrooms",
          "Lobby",
          "Balcony",
          "Staircase",
          "Outdoor",
        ].map((o) => {
          const sel = (data.locations || []).includes(o);
          return (
            <TouchableOpacity
              key={o}
              onPress={() => toggleMulti("locations", o)}
              style={chip(o, sel)}
            >
              <Text style={{ color: sel ? "#fff" : "#111827" }}>{o}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Existing floor condition *</Text>
      <View style={styles.row}>
        {["Good", "Minor leveling", "Moderate repairs", "Major repair", "Unknown"].map((o) => (
          <TouchableOpacity
            key={o}
            onPress={() => update({ existingCondition: o })}
            style={chip(o, data.existingCondition === o)}
          >
            <Text style={{ color: data.existingCondition === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Who provides materials? *</Text>
      <View style={styles.row}>
        {["Contractor supplies", "Client supplies", "Mix"].map((o) => (
          <TouchableOpacity
            key={o}
            onPress={() => update({ materialsBy: o })}
            style={chip(o, data.materialsBy === o)}
          >
            <Text style={{ color: data.materialsBy === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Preferred start date</Text>
      <TextInput
        placeholder="YYYY-MM-DD (use date picker in next step too)"
        value={data.startDate || ""}
        onChangeText={(t) => update({ startDate: t })}
        style={styles.input}
      />

      <View style={styles.rowEnd}>
        <TouchableOpacity
          disabled={!requiredOk()}
          onPress={() => next && requiredOk() && next()}
          style={[
            styles.btn,
            { backgroundColor: requiredOk() ? "#4f46e5" : "#E5E7EB" },
          ]}
        >
          <Text style={{ color: requiredOk() ? "#fff" : "#666", fontWeight: "600" }}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginTop: 12, color: "#374151", fontWeight: "600" },
  row: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  rowEnd: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 10,
    borderRadius: 6,
    marginTop: 8,
    backgroundColor: "#fff",
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
});
