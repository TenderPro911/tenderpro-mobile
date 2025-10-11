/// src/ui/construction/steps/StepStructure.jsx
import React from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const renderChips = (label, options, value, onSelect) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.chipsRow}>
      {options.map((opt) => {
        const selected = Array.isArray(value) ? value.includes(opt) : value === opt;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onSelect(opt)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

export default function StepStructure({ data = {}, update = () => {}, next, prev }) {
  const setField = (name, val) => update({ [name]: val });

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Text style={styles.heading}>Structure & Civil</Text>

      {renderChips(
        "Scope required",
        ["Full Structure", "Plinth to Roof", "Only Finishing", "Interior Work Only"],
        data.scope,
        (v) => setField("scope", v)
      )}

      {renderChips(
        "Foundation type (if known)",
        ["Raft", "Isolated Footing", "Pile", "Not sure"],
        data.foundationType,
        (v) => setField("foundationType", v)
      )}

      {renderChips(
        "Structure type",
        ["RCC Frame", "Steel Structure", "Load Bearing Wall"],
        data.structureType,
        (v) => setField("structureType", v)
      )}

      {renderChips(
        "Roof type",
        ["Flat RCC", "Sloped RCC / Tiles", "Metal Sheet"],
        data.roofType,
        (v) => setField("roofType", v)
      )}

      {renderChips(
        "Wall type",
        ["Brick", "AAC Block", "Concrete Block"],
        data.wallType,
        (v) => setField("wallType", v)
      )}

      {renderChips(
        "Plastering required?",
        ["Yes - Entire", "Yes - Specific Areas", "No"],
        data.plasteringRequired,
        (v) => setField("plasteringRequired", v)
      )}

      <View style={styles.field}>
        <Text style={styles.label}>Compound wall length (if required)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 80 ft"
          value={data.compoundWallLength || ""}
          onChangeText={(t) => setField("compoundWallLength", t)}
        />
      </View>

      {renderChips(
        "Waterproofing areas",
        ["Basement", "Terrace", "Bathrooms", "All", "None"],
        data.waterproofingAreas,
        (v) => setField("waterproofingAreas", v)
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
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#fff",
  },
  buttonsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 6, alignItems: "center" },
  btnPrimary: { backgroundColor: "#4f46e5", marginLeft: 8 },
  btnOutline: { borderWidth: 1, borderColor: "#CBD5E1", backgroundColor: "#fff" },
  btnText: { color: "#111827", fontWeight: "600" },
});
