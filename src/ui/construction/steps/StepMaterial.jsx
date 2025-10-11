// src/ui/construction/steps/StepMaterials.jsx
import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const optionRow = (label, options = [], value, onSelect) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.chipsRow}>
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onSelect(opt)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

export default function StepMaterials({ data = {}, update = () => {}, next, prev }) {
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Text style={styles.heading}>Materials & Finishes</Text>

      {optionRow(
        "Cement grade",
        ["43 Grade", "53 Grade", "Premium"],
        data.cementGrade,
        (v) => update({ cementGrade: v })
      )}

      {optionRow(
        "Steel type",
        ["Fe500", "Fe550", "Branded"],
        data.steelType,
        (v) => update({ steelType: v })
      )}

      {optionRow(
        "Brick / Block",
        ["Red Brick", "AAC Block", "Flyash Block"],
        data.brickType,
        (v) => update({ brickType: v })
      )}

      {optionRow(
        "Sand type",
        ["River Sand", "M-Sand", "Mix"],
        data.sandType,
        (v) => update({ sandType: v })
      )}

      {optionRow(
        "Floor finish level",
        ["Normal", "Mid Premium", "High Finish", "Luxury"],
        data.flooringLevel,
        (v) => update({ flooringLevel: v })
      )}

      {optionRow(
        "Main flooring type",
        ["Vitrified Tile", "Granite", "Marble", "Engineered Wood"],
        data.flooringTypeMain,
        (v) => update({ flooringTypeMain: v })
      )}

      {optionRow(
        "Painting (interior)",
        ["Basic distemper", "Emulsion", "Royal finish", "Textured"],
        data.paintingInterior,
        (v) => update({ paintingInterior: v })
      )}

      {optionRow(
        "Doors & windows material",
        ["Wooden", "UPVC", "Aluminium", "Mixed"],
        data.doorsWindowsMaterial,
        (v) => update({ doorsWindowsMaterial: v })
      )}

      {optionRow(
        "Hardware quality",
        ["Standard", "Soft-close", "Branded premium"],
        data.hardwareQuality,
        (v) => update({ hardwareQuality: v })
      )}

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => prev && prev()}>
          <Text style={styles.btnText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => next && next()}>
          <Text style={[styles.btnText, { color: "#fff" }]}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: 16, backgroundColor: "#FAFBFF", flexGrow: 1 },
  heading: { fontSize: 18, fontWeight: "700", marginBottom: 12 },

  field: { marginBottom: 12 },
  label: { marginBottom: 8, color: "#374151", fontWeight: "600" },

  chipsRow: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: { backgroundColor: "#4f46e5", borderColor: "#4f46e5" },
  chipText: { color: "#111827" },
  chipTextSelected: { color: "#fff" },

  buttonsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 6, alignItems: "center" },
  btnPrimary: { backgroundColor: "#4f46e5", marginLeft: 8 },
  btnOutline: { borderWidth: 1, borderColor: "#CBD5E1", backgroundColor: "#fff" },
  btnText: { color: "#111827", fontWeight: "600" },
});
