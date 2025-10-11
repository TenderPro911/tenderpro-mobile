// src/ui/construction/steps/ReviewSubmit.jsx
import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

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
        data.files.forEach((f) => {
          // Ensure file objects in RN are like: { uri, name, type }
          formData.append("files", f);
        });
      }

      // NOTE: Replace "/api/construction" with your full backend URL if needed.
      const res = await fetch("/api/construction", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed");
      }
      const json = await res.json();
      setMsg("Request submitted successfully. Reference: " + (json._id || json.id));
    } catch (err) {
      console.error("submit error:", err);
      setMsg("Failed to submit: " + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  }

  const summaryItems = [
    ["Project Type", data.projectType],
    ["Construction Type", data.constructionType],
    ["Built-up Area", data.builtUpArea ? `${data.builtUpArea} sq.ft` : ""],
    ["Floors", data.floors],
    ["Location", data.location],
    ["Cement Grade", data.cementGrade],
    ["Steel Type", data.steelType],
    ["Electrical Scope", data.electricalScope],
    ["Plumbing Type", data.plumbingType],
  ];

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Text style={styles.heading}>Review & Submit</Text>

      <View style={styles.card}>
        {summaryItems.map(([label, value]) => (
          <View key={label} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value || "-"}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => typeof prev === "function" && prev()}>
          <Text style={styles.btnText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={submit}
          disabled={loading}
          style={[styles.btn, styles.btnPrimary]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.btnText, { color: "#fff" }]}>Submit Request</Text>
          )}
        </TouchableOpacity>
      </View>

      {msg ? <Text style={styles.msg}>{msg}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: 16, backgroundColor: "#FAFBFF", flexGrow: 1 },
  heading: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderColor: "#E5E7EB",
    paddingVertical: 8,
  },
  label: { fontSize: 14, color: "#374151", width: "50%" },
  value: { fontSize: 14, color: "#111827", textAlign: "right", flexShrink: 1 },
  buttonsRow: { flexDirection: "row", justifyContent: "space-between" },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 6, alignItems: "center" },
  btnPrimary: { backgroundColor: "#4f46e5", marginLeft: 8 },
  btnOutline: { borderWidth: 1, borderColor: "#CBD5E1", backgroundColor: "#fff" },
  btnText: { color: "#111827", fontWeight: "600" },
  msg: { marginTop: 16, fontSize: 14, color: "#1E293B" },
});
