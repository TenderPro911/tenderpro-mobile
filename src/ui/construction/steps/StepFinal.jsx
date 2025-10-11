// src/ui/construction/steps/StepFinal.jsx
import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";

/*
  Note about file pickers:
  - Web has <input type="file">; in RN you must use a picker library.
  - Example options:
    * expo-image-picker (images) -> https://docs.expo.dev/versions/latest/sdk/imagepicker/
    * react-native-document-picker (any file) -> https://github.com/rnmods/react-native-document-picker
  - I left a placeholder `pickFiles()` where you can call those libraries and then
    `update({ files: pickedFiles })` with objects like { uri, name, type }.
*/

const SPECIAL_WORKS = [
  "Landscaping",
  "Solar panels",
  "Compound wall",
  "Septic/STP",
  "Lift",
  "Rainwater harvesting",
];

export default function StepFinal({ data = {}, update = () => {}, next, prev }) {
  const [localFiles, setLocalFiles] = useState(data.files || []);

  function setField(name, value) {
    update({ [name]: value });
  }

  function toggleSpecialWork(value) {
    const arr = new Set(data.specialWorks || []);
    if (arr.has(value)) arr.delete(value);
    else arr.add(value);
    const updated = Array.from(arr);
    update({ specialWorks: updated });
  }

  // Placeholder file picker - replace with actual picker implementation
  async function pickFiles() {
    // TODO: integrate a file picker. Example (expo-image-picker):
    // const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, allowsMultipleSelection: true });
    // if (!res.cancelled) { const files = res.selected ? res.selected : [res]; transform and update }
    // For now, we'll simulate an empty selection
    const fake = []; // replace with real file objects: { uri, name, type }
    setLocalFiles(fake);
    update({ files: fake });
  }

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Text style={styles.heading}>Final details & uploads</Text>

      <View style={styles.grid}>
        <View style={styles.col}>
          <Text style={styles.label}>Electrical scope</Text>
          <TouchableOpacity
            style={styles.select}
            onPress={() => setField("electricalScope", "Full wiring")}
          >
            <Text style={styles.selectText}>
              {data.electricalScope || "Select (tap to set sample value)"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.col}>
          <Text style={styles.label}>Plumbing type</Text>
          <TouchableOpacity
            style={styles.select}
            onPress={() => setField("plumbingType", "CPVC")}
          >
            <Text style={styles.selectText}>{data.plumbingType || "Select"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.col}>
          <Text style={styles.label}>Sanitary fittings preference</Text>
          <TouchableOpacity
            style={styles.select}
            onPress={() => setField("sanitaryPreference", "Mid-range")}
          >
            <Text style={styles.selectText}>{data.sanitaryPreference || "Select"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.col}>
          <Text style={styles.label}>Water storage</Text>
          <TouchableOpacity
            style={styles.select}
            onPress={() => setField("waterStorage", "Overhead tank")}
          >
            <Text style={styles.selectText}>{data.waterStorage || "Select"}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.colFull]}>
          <Text style={styles.label}>Special works (select all that apply)</Text>
          <View style={styles.chipsRow}>
            {SPECIAL_WORKS.map((s) => {
              const selected = (data.specialWorks || []).includes(s);
              return (
                <TouchableOpacity
                  key={s}
                  onPress={() => toggleSpecialWork(s)}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.colFull]}>
          <Text style={styles.label}>Upload additional images / floor plan (optional)</Text>

          <TouchableOpacity style={styles.fileBtn} onPress={pickFiles}>
            <Text style={styles.fileBtnText}>
              {localFiles.length ? `${localFiles.length} file(s) selected` : "Pick files (open picker)"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.hint}>
            (Implement file picking with expo-image-picker or react-native-document-picker; files must be objects like {"{uri,name,type}"} for FormData)
          </Text>
        </View>

        <View style={[styles.colFull]}>
          <Text style={styles.label}>Any other instructions</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            multiline
            value={data.notes || ""}
            onChangeText={(t) => setField("notes", t)}
            placeholder="e.g., site constraints, timings, security"
          />
        </View>
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => prev && prev()}>
          <Text style={styles.btnText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => next && next()}>
          <Text style={[styles.btnText, { color: "#fff" }]}>Review & Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: 16, backgroundColor: "#FAFBFF", flexGrow: 1 },
  heading: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -8 },
  col: { width: "50%", paddingHorizontal: 8, marginBottom: 12 },
  colFull: { width: "100%", paddingHorizontal: 8, marginBottom: 12 },
  label: { fontSize: 13, color: "#374151", marginBottom: 6 },
  select: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 6, padding: 10, backgroundColor: "#fff" },
  selectText: { color: "#111827" },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#fff", marginRight: 8, marginTop: 8 },
  chipSelected: { backgroundColor: "#4f46e5", borderColor: "#4f46e5" },
  chipText: { color: "#111827" },
  chipTextSelected: { color: "#fff" },
  fileBtn: { marginTop: 8, paddingVertical: 10, borderRadius: 6, borderWidth: 1, borderColor: "#CBD5E1", alignItems: "center", backgroundColor: "#fff" },
  fileBtnText: { color: "#111827" },
  hint: { marginTop: 6, color: "#6b7280", fontSize: 12 },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 6, padding: 10, backgroundColor: "#fff" },
  buttonsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 6, alignItems: "center" },
  btnPrimary: { backgroundColor: "#4f46e5", marginLeft: 8 },
  btnOutline: { borderWidth: 1, borderColor: "#CBD5E1", backgroundColor: "#fff" },
  btnText: { color: "#111827", fontWeight: "600" },
});
