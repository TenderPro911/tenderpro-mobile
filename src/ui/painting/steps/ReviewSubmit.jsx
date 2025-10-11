// src/ui/painting/steps/ReviewSubmit.jsx
import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";

export default function ReviewSubmit({ data = {}, prev }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit() {
    setLoading(true);
    setMsg("");
    try {
      const formData = new FormData();
      formData.append("payload", JSON.stringify(data || {}));
      if (data.files && Array.isArray(data.files) && data.files.length) {
        data.files.forEach(f => formData.append("files", f));
      }

      // Replace with working backend URL if needed
      const res = await fetch("/api/painting", { method: "POST", body: formData });
      if (!res.ok) { const text = await res.text(); throw new Error(text || "Failed"); }
      const json = await res.json();
      setMsg("Submitted — reference: " + (json._id || json.id));
    } catch (err) {
      console.error(err);
      setMsg("Failed: " + (err.message || String(err)));
    } finally { setLoading(false); }
  }

  const summary = [
    ["Project", data.projectType],
    ["Property", data.propertyType],
    ["Area", data.areaRange],
    ["Finish", data.finishLevel],
    ["Surfaces", (data.surfaces || []).join(", ") || "-"],
    ["Coats", data.coats],
    ["Materials by", data.materialsBy],
    ["Start", data.startDate],
    ["Contact", data.contactName + " " + (data.contactPhone || "")],
  ];

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Text style={styles.heading}>Review & Submit</Text>

      <View style={styles.card}>
        {summary.map(([k,v]) => (
          <View key={k} style={styles.row}>
            <Text style={styles.label}>{k}</Text>
            <Text style={styles.value}>{v || "-"}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => prev && prev()}>
          <Text style={styles.btnText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={submit} disabled={loading} style={[styles.btn, styles.btnPrimary]}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={[styles.btnText, { color: "#fff" }]}>Submit</Text>}
        </TouchableOpacity>
      </View>

      {msg ? <Text style={{ marginTop: 12 }}>{msg}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: 12, backgroundColor: "#FAFBFF", flexGrow: 1 },
  heading: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  card: { backgroundColor: "#fff", borderRadius: 8, padding: 12, elevation: 2, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 0.5, borderColor: "#E5E7EB" },
  label: { color: "#374151", width: "50%" },
  value: { color: "#111827", textAlign: "right", flexShrink: 1 },
  buttonsRow: { flexDirection: "row", justifyContent: "space-between" },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 6, alignItems: "center" },
  btnPrimary: { backgroundColor: "#4f46e5", marginLeft: 8 },
  btnOutline: { borderWidth: 1, borderColor: "#CBD5E1", backgroundColor: "#fff" },
  btnText: { color: "#111827", fontWeight: "600" },
});
