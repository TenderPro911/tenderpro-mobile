// src/ui/falseceiling/steps/StepDetails.jsx
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
  const [showEndPicker, setShowEndPicker] = useState(false);

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

  function requiredOk() {
    return !!data.ceilingType;
  }

  return (
    <View>
      <Text style={styles.label}>Ceiling material / type *</Text>
      <View style={styles.row}>
        {[
          "Gypsum / Plasterboard (GWB)",
          "PVC Panels",
          "Metal / Aluminium",
          "Mineral fiber / Acoustic",
          "POP (Plaster of Paris)",
          "Wood / Veneer / Laminate",
          "Custom (describe)",
        ].map((o) => (
          <TouchableOpacity
            key={o}
            onPress={() => update({ ceilingType: o })}
            style={chipStyle(data.ceilingType === o)}
          >
            <Text style={{ color: data.ceilingType === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Profile / grid type (optional)</Text>
      <View style={styles.row}>
        {["Exposed grid", "Concealed grid", "Suspended channels", "Direct fix"].map((o) => (
          <TouchableOpacity key={o} onPress={() => update({ gridType: o })} style={chipStyle(data.gridType === o)}>
            <Text style={{ color: data.gridType === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Finish & paint (optional)</Text>
      <View style={styles.row}>
        {["Plain (no paint)", "Primed only", "Painted (emulsion)", "Textured / decorative", "Veneer / laminate"].map((o) => (
          <TouchableOpacity key={o} onPress={() => update({ finish: o })} style={chipStyle(data.finish === o)}>
            <Text style={{ color: data.finish === o ? "#fff" : "#111827" }}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Lighting & fixture integration (optional)</Text>
      <View style={styles.row}>
        {["Downlights", "LED cove lights", "Spotlights", "Pendant cutouts", "Backlit panel / stretch"].map((o) => {
          const sel = (data.lighting || []).includes(o);
          return (
            <TouchableOpacity key={o} onPress={() => toggleMulti("lighting", o)} style={chipStyle(sel)}>
              <Text style={{ color: sel ? "#fff" : "#111827" }}>{o}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Design preference</Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
        <Text style={{ marginRight: 8 }}>Have design preference?</Text>
        <Switch
          value={!!data.designPref?.hasDesign}
          onValueChange={(v) =>
            update({
              designPref: v
                ? { hasDesign: true, types: data.designPref?.types || [], description: data.designPref?.description || "" }
                : { hasDesign: false, types: [], description: "" },
            })
          }
        />
      </View>

      {data.designPref?.hasDesign ? (
        <>
          <Text style={styles.label}>Design types (select multiple)</Text>
          <View style={styles.row}>
            {["Cove lighting design", "2-level ceiling design", "Geometric / modern design", "Classical POP molding"].map((o) => {
              const sel = (data.designPref?.types || []).includes(o);
              const toggle = () => {
                const s = new Set(data.designPref?.types || []);
                if (s.has(o)) s.delete(o);
                else s.add(o);
                update({ designPref: { ...(data.designPref || {}), types: Array.from(s) } });
              };
              return (
                <TouchableOpacity key={o} onPress={toggle} style={chipStyle(sel)}>
                  <Text style={{ color: sel ? "#fff" : "#111827" }}>{o}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Describe design / upload reference</Text>
          <TextInput
            style={styles.input}
            placeholder="Short description"
            value={data.designPref?.description || ""}
            onChangeText={(t) => update({ designPref: { ...(data.designPref || {}), description: t } })}
          />
        </>
      ) : null}

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
        <Text style={{ marginRight: 8 }}>Remove old ceiling?</Text>
        <Switch value={!!data.removeOldCeiling} onValueChange={(v) => update({ removeOldCeiling: v })} />
      </View>

      {data.removeOldCeiling ? (
        <>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
            <Text style={{ marginRight: 8 }}>Include debris disposal?</Text>
            <Switch value={!!data.debrisIncluded} onValueChange={(v) => update({ debrisIncluded: v })} />
          </View>
        </>
      ) : null}

      <Text style={styles.label}>Preferred completion date (optional)</Text>
      <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateBtn}>
        <Text>{data.completionDate || "Select date"}</Text>
      </TouchableOpacity>

      {showEndPicker && (
        <DateTimePicker
          value={data.completionDate ? new Date(data.completionDate) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(e, d) => {
            setShowEndPicker(false);
            if (d) setDateField("completionDate", d);
          }}
        />
      )}

      <Text style={styles.label}>Contact for site visit</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={data.contact?.name || ""}
        onChangeText={(t) => update({ contact: { ...(data.contact || {}), name: t } })}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={data.contact?.phone || ""}
        onChangeText={(t) => update({ contact: { ...(data.contact || {}), phone: t } })}
      />
      <TextInput
        style={styles.input}
        placeholder="Preferred time"
        value={data.contact?.time || ""}
        onChangeText={(t) => update({ contact: { ...(data.contact || {}), time: t } })}
      />

      <Text style={styles.label}>Additional notes</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Any constraints, beams, heights..."
        value={data.notes || ""}
        onChangeText={(t) => update({ notes: t })}
      />

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
