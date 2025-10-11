// src/ui/painting/steps/StepBasic.jsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const chipRow = (options, value, onSelect) => (
  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
    {options.map(o => {
      const selected = value === o;
      return (
        <TouchableOpacity
          key={o}
          onPress={() => onSelect(o)}
          style={[styles.chip, selected && styles.chipSelected]}
        >
          <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{o}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

export default function StepBasic({ data = {}, update = () => {}, next }) {
  return (
    <View>
      <Text style={styles.label}>Project type</Text>
      {chipRow(["Interior","Exterior","Both"], data.projectType, v => update({ projectType: v }))}

      <Text style={styles.label}>Property type</Text>
      {chipRow(["Apartment/Flat","Independent House","Commercial/Office","Retail/Shop","Industrial"], data.propertyType, v => update({ propertyType: v }))}

      <Text style={styles.label}>Approx area to paint</Text>
      {chipRow(["<500","500-1000","1000-2000","2000-5000",">5000"], data.areaRange, v => update({ areaRange: v }))}

      <Text style={styles.label}>Finish level</Text>
      {chipRow(["Economy","Standard","Premium","Decorative"], data.finishLevel, v => update({ finishLevel: v }))}

      <View style={styles.row}>
        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => next && next()}>
          <Text style={[styles.btnText, { color:"#fff" }]}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginTop: 12, color: "#374151", fontWeight: "600" },
  chip: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#fff", marginRight: 8, marginTop: 8 },
  chipSelected: { backgroundColor: "#4f46e5", borderColor: "#4f46e5" },
  chipText: { color: "#111827" },
  chipTextSelected: { color: "#fff" },
  row: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 6, alignItems: "center" },
  btnPrimary: { backgroundColor: "#4f46e5" },
  btnText: { color: "#111827", fontWeight: "600" },
});
