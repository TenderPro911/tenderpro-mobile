// src/ui/construction/steps/StepOverview.jsx
import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

/*
  NOTES:
  - React Native doesn’t have <select> or <input type="file">.
  - The “dropdowns” are represented as tap-to-select chips.
  - For file uploads, use expo-image-picker or react-native-document-picker.
*/

export default function StepOverview({ data = {}, update = () => {}, next }) {
  const [localFiles, setLocalFiles] = useState(data.files || []);

  const setField = (name, val) => update({ [name]: val });

  const pickFiles = async () => {
    // Placeholder: integrate expo-image-picker or document-picker later
    const fake = []; // Replace with real file list
    setLocalFiles(fake);
    update({ files: fake });
  };

  const renderChips = (label, options, fieldName) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map((opt) => {
          const selected = data[fieldName] === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => setField(fieldName, opt)}
            >
              <Text
                style={[styles.chipText, selected && styles.chipTextSelected]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Text style={styles.heading}>Project Overview</Text>

      {renderChips("Project Type", ["Residential", "Commercial", "Industrial", "Institutional"], "projectType")}

      {renderChips("Construction Type", ["New construction", "Renovation", "Interior fit-out"], "constructionType")}

      <View style={styles.field}>
        <Text style={styles.label}>Built-up area (sq.ft)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 2000"
          keyboardType="numeric"
          value={data.builtUpArea || ""}
          onChangeText={(t) => setField("builtUpArea", t)}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Number of Floors</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 2"
          keyboardType="numeric"
          value={data.floors || ""}
          onChangeText={(t) => setField("floors", t)}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Site address / Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Street, locality, pincode"
          value={data.location || ""}
          onChangeText={(t) => setField("location", t)}
        />
      </View>

      {renderChips("Plot Type", ["Corner Plot", "Mid Plot", "Inside Compound", "Open Land"], "plotType")}

      {renderChips("Site Access", ["Heavy vehicle access", "Narrow street", "Lift required"], "siteAccess")}

      <View style={styles.field}>
        <Text style={styles.label}>Expected start date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={data.startDate || ""}
          onChangeText={(t) => setField("startDate", t)}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Expected completion date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={data.endDate || ""}
          onChangeText={(t) => setField("endDate", t)}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Upload floor plan / site photos</Text>
        <TouchableOpacity style={styles.fileBtn} onPress={pickFiles}>
          <Text style={styles.fileBtnText}>
            {localFiles.length
              ? `${localFiles.length} file(s) selected`
              : "Pick files (open picker)"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.hint}>
          jpg, png, pdf — max 8 files recommended
        </Text>
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={() => next && next()}
        >
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
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#fff",
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap" },
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
  fileBtn: {
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  fileBtnText: { color: "#111827" },
  hint: { marginTop: 6, color: "#6b7280", fontSize: 12 },
  buttonsRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 6, alignItems: "center" },
  btnPrimary: { backgroundColor: "#4f46e5", marginLeft: 8 },
  btnText: { color: "#111827", fontWeight: "600" },
});
