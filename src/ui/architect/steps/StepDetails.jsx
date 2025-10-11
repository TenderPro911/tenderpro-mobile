// src/ui/architect/steps/StepDetails.jsx
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
  const [showStart, setShowStart] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showTender, setShowTender] = useState(false);

  function toggleMulti(field, value) {
    const s = new Set(data[field] || []);
    if (s.has(value)) s.delete(value);
    else s.add(value);
    update({ [field]: Array.from(s) });
  }

  function setDateField(field, date) {
    if (!date) return;
    const iso = date.toISOString().slice(0, 10);
    update({ [field]: iso });
  }

  const requiredOk = () => {
    return (data.services || []).length > 0 && data.consultationMode;
  };

  return (
    <View>
      <Text style={styles.label}>Services required *</Text>
      <View style={styles.row}>
        {[
          "Concept Design",
          "2D Floor Plans",
          "3D Elevation",
          "Structural Drawings",
          "Electrical & Plumbing",
          "Vastu Consultation",
          "Approval Drawings",
          "Site Supervision",
        ].map((o) => {
          const sel = (data.services || []).includes(o);
          return (
            <TouchableOpacity key={o} onPress={() => toggleMulti("services", o)} style={chipStyle(sel)}>
              <Text style={{ color: sel ? "#fff" : "#111827" }}>{o}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Preferred consultation mode *</Text>
      <View style={styles.row}>
        {["Site Visit", "Online", "Both"].map((o) => (
          <TouchableOpacity key={o} onPress={() => update({ consultationMode: o })} style={chipStyle(data.consultationMode === o)}>
            <Text style={{ color: data.consultationMode === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Expected work start date</Text>
      <TouchableOpacity onPress={() => setShowStart(true)} style={styles.dateBtn}>
        <Text>{data.startDate || "Select date"}</Text>
      </TouchableOpacity>
      {showStart && (
        <DateTimePicker
          value={data.startDate ? new Date(data.startDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(e, d) => {
            setShowStart(false);
            if (d) setDateField("startDate", d);
          }}
        />
      )}

      <Text style={styles.label}>Expected completion date</Text>
      <TouchableOpacity onPress={() => setShowComplete(true)} style={styles.dateBtn}>
        <Text>{data.completionDate || "Select date"}</Text>
      </TouchableOpacity>
      {showComplete && (
        <DateTimePicker
          value={data.completionDate ? new Date(data.completionDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(e, d) => {
            setShowComplete(false);
            if (d) setDateField("completionDate", d);
          }}
        />
      )}

      <Text style={styles.label}>Tender close date</Text>
      <TouchableOpacity onPress={() => setShowTender(true)} style={styles.dateBtn}>
        <Text>{data.tenderCloseDate || "Select date"}</Text>
      </TouchableOpacity>
      {showTender && (
        <DateTimePicker
          value={data.tenderCloseDate ? new Date(data.tenderCloseDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(e, d) => {
            setShowTender(false);
            if (d) setDateField("tenderCloseDate", d);
          }}
        />
      )}

      <Text style={styles.label}>Contact details</Text>
      <TextInput style={styles.input} placeholder="Name" value={data.contactName || ""} onChangeText={(t) => update({ contactName: t })} />
      <TextInput style={styles.input} placeholder="Phone" value={data.contactPhone || ""} onChangeText={(t) => update({ contactPhone: t })} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Email (optional)" value={data.contactEmail || ""} onChangeText={(t) => update({ contactEmail: t })} keyboardType="email-address" />

      <Text style={styles.label}>Additional notes</Text>
      <TextInput style={[styles.input, { height: 80 }]} placeholder="Any other requirements" value={data.notes || ""} onChangeText={(t) => update({ notes: t })} />

      <View style={styles.rowButtons}>
        <TouchableOpacity onPress={() => prev && prev()} style={[styles.actionBtn, { backgroundColor: "#fff", borderWidth: 1, borderColor: "#CBD5E1" }]}>
          <Text style={{ color: "#111827" }}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => requiredOk() && next && next()} disabled={!requiredOk()} style={[styles.actionBtn, { backgroundColor: requiredOk() ? "#4f46e5" : "#E5E7EB" }]}>
          <Text style={{ color: requiredOk() ? "#fff" : "#666" }}>Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginTop: 12, color: "#374151", fontWeight: "600" },
  row: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  input: { borderWidth: 1, borderColor: "#E5E7EB", padding: 10, borderRadius: 6, marginTop: 8, backgroundColor: "#fff" },
  dateBtn: { marginTop: 8, padding: 12, borderRadius: 6, borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#fff" },
  rowButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  actionBtn: { flex: 1, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 6, alignItems: "center", marginLeft: 8 },
});
