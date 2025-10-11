// src/ui/flooring/steps/StepDetails.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const chipStyle = (sel) => ({
  paddingHorizontal: 10,
  paddingVertical: 8,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: sel ? "#4f46e5" : "#E5E7EB",
  backgroundColor: sel ? "#4f46e5" : "#fff",
  marginRight: 8,
  marginTop: 8,
});

export default function StepDetails({ data = {}, update = () => {}, next, prev }) {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  function toggleMulti(field, value) {
    const s = new Set(data[field] || []);
    if (s.has(value)) s.delete(value);
    else s.add(value);
    update({ [field]: Array.from(s) });
  }

  function setDateField(field, date) {
    const iso = date.toISOString().slice(0, 10);
    update({ [field]: iso });
  }

  const requiredOk = () => {
    return data.flooringType && data.finishLevel;
  };

  return (
    <View>
      <Text style={styles.label}>Flooring type *</Text>
      <View style={styles.row}>
        {[
          "Vitrified",
          "Ceramic",
          "Natural stone",
          "Engineered wood",
          "Solid hardwood",
          "Vinyl/LVT",
          "Epoxy/PU",
          "Polished concrete",
          "Other",
        ].map((o) => (
          <TouchableOpacity
            key={o}
            onPress={() => update({ flooringType: o })}
            style={chipStyle(data.flooringType === o)}
          >
            <Text style={{ color: data.flooringType === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Tile / plank size (optional)</Text>
      <TextInput
        placeholder="e.g., 600x600 or 1200x200 (or leave blank)"
        value={data.tileSize || ""}
        onChangeText={(t) => update({ tileSize: t })}
        style={styles.input}
      />

      <Text style={styles.label}>Finish level / sheen *</Text>
      <View style={styles.row}>
        {["Matte", "Semi-polished", "Polished", "Glossy", "Textured"].map((o) => (
          <TouchableOpacity
            key={o}
            onPress={() => update({ finishLevel: o })}
            style={chipStyle(data.finishLevel === o)}
          >
            <Text style={{ color: data.finishLevel === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Grout / joint</Text>
      <View style={styles.row}>
        {["Narrow", "Standard", "Epoxy", "Minimal joints"].map((o) => (
          <TouchableOpacity
            key={o}
            onPress={() => update({ grout: o })}
            style={chipStyle(data.grout === o)}
          >
            <Text style={{ color: data.grout === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
        <Text style={{ marginRight: 8 }}>Skirting required?</Text>
        <Switch
          value={!!data.skirtingRequired}
          onValueChange={(v) => update({ skirtingRequired: v, skirting: v ? (data.skirting || { height: "4", material: "tile" }) : { height: "", material: "" } })}
        />
      </View>

      {data.skirtingRequired ? (
        <>
          <Text style={styles.label}>Skirting height (e.g., 4, 6 inches)</Text>
          <TextInput style={styles.input} value={data.skirting?.height || ""} onChangeText={(t)=>update({ skirting: { ...data.skirting, height: t } })} />
          <Text style={styles.label}>Skirting material</Text>
          <TextInput style={styles.input} value={data.skirting?.material || ""} onChangeText={(t)=>update({ skirting: { ...data.skirting, material: t } })} />
        </>
      ) : null}

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
        <Text style={{ marginRight: 8 }}>Underfloor heating / insulation?</Text>
        <Switch value={!!data.underfloorHeating} onValueChange={(v)=>update({ underfloorHeating: v })} />
      </View>

      <Text style={styles.label}>Subfloor prep (multi-select)</Text>
      <View style={styles.row}>
        {["Remove old flooring", "Rescreed", "Leveling compound", "Moisture barrier", "Damp-proofing"].map((o) => {
          const sel = (data.subfloorPrep || []).includes(o);
          return (
            <TouchableOpacity key={o} onPress={() => toggleMulti("subfloorPrep", o)} style={chipStyle(sel)}>
              <Text style={{ color: sel ? "#fff" : "#111827" }}>{o}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Staircase finishing?</Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => update({ staircase: false })} style={chipStyle(data.staircase === false)}>
          <Text style={{ color: data.staircase === false ? "#fff" : "#111827" }}>No</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => update({ staircase: true })} style={chipStyle(data.staircase === true)}>
          <Text style={{ color: data.staircase === true ? "#fff" : "#111827" }}>Yes</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Waterproofing areas (multi-select)</Text>
      <View style={styles.row}>
        {["Bathroom", "Balcony", "Kitchen", "All external"].map((o) => {
          const sel = (data.waterproofingAreas || []).includes(o);
          return (
            <TouchableOpacity key={o} onPress={() => toggleMulti("waterproofingAreas", o)} style={chipStyle(sel)}>
              <Text style={{ color: sel ? "#fff" : "#111827" }}>{o}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Expected finish timeline</Text>
      <View style={styles.row}>
        {["Urgent (1 week)", "Normal (2-4 weeks)", "Flexible"].map((o) => (
          <TouchableOpacity key={o} onPress={() => update({ timeline: o })} style={chipStyle(data.timeline === o)}>
            <Text style={{ color: data.timeline === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Preferred start date</Text>
      <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateBtn}>
        <Text>{data.startDate || "Select start date"}</Text>
      </TouchableOpacity>

      {showStartPicker && (
        <DateTimePicker
          value={data.startDate ? new Date(data.startDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(e, d) => {
            setShowStartPicker(false);
            if (d) setDateField("startDate", d);
          }}
        />
      )}

      <Text style={styles.label}>Tender closing / preferred completion date</Text>
      <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateBtn}>
        <Text>{data.tenderDate || "Select date"}</Text>
      </TouchableOpacity>

      {showEndPicker && (
        <DateTimePicker
          value={data.tenderDate ? new Date(data.tenderDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(e, d) => {
            setShowEndPicker(false);
            if (d) setDateField("tenderDate", d);
          }}
        />
      )}

      <Text style={styles.label}>Contact for site visit</Text>
      <TextInput style={styles.input} placeholder="Name" value={data.contactName || ""} onChangeText={(t)=>update({ contactName: t })} />
      <TextInput style={styles.input} placeholder="Phone" value={data.contactPhone || ""} onChangeText={(t)=>update({ contactPhone: t })} />
      <TextInput style={styles.input} placeholder="Preferred time" value={data.contactTime || ""} onChangeText={(t)=>update({ contactTime: t })} />

      <View style={styles.rowButtons}>
        <TouchableOpacity onPress={() => prev && prev()} style={[styles.actionBtn, { backgroundColor: "#fff", borderWidth: 1, borderColor: "#CBD5E1" }]}>
          <Text style={{ color: "#111827" }}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => next && requiredOk() && next()}
          disabled={!requiredOk()}
          style={[styles.actionBtn, { backgroundColor: requiredOk() ? "#4f46e5" : "#E5E7EB" }]}
        >
          <Text style={{ color: requiredOk() ? "#fff" : "#666" }}>Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  function setDateField(field, date) {
    const iso = date.toISOString().slice(0, 10);
    update({ [field]: iso });
  }
}

const styles = StyleSheet.create({
  label: { marginTop: 12, color: "#374151", fontWeight: "600" },
  row: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  input: { borderWidth: 1, borderColor: "#E5E7EB", padding: 10, borderRadius: 6, marginTop: 8, backgroundColor: "#fff" },
  dateBtn: { marginTop: 8, padding: 12, borderRadius: 6, borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#fff" },
  chip: chipStyle,
  rowButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  actionBtn: { flex: 1, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 6, alignItems: "center", marginLeft: 8 },
});
