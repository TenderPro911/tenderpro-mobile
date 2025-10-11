// src/ui/painting/steps/StepDetails.jsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet } from "react-native";

const SURFACES = ["Walls (Interior)","Ceiling","Doors","Windows & Frames","External Walls","Metal Works","Wooden Surfaces"];
const DECOR = ["Wall Textures","Accent Wall","Stencil","Wallpaper","None"];

export default function StepDetails({ data = {}, update = () => {}, next, prev }) {
  const toggleMulti = (field, value) => {
    const arr = new Set(data[field] || []);
    if (arr.has(value)) arr.delete(value); else arr.add(value);
    update({ [field]: Array.from(arr) });
  };

  return (
    <View>
      <Text style={styles.label}>Surfaces to paint (multi-select)</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {SURFACES.map(s => {
          const sel = (data.surfaces || []).includes(s);
          return (
            <TouchableOpacity key={s} onPress={() => toggleMulti("surfaces", s)} style={[styles.chip, sel && styles.chipSelected]}>
              <Text style={[styles.chipText, sel && styles.chipTextSelected]}>{s}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Rooms / Doors / Windows (optional)</Text>
      <TextInput style={styles.input} placeholder="Rooms" keyboardType="numeric" value={data.rooms} onChangeText={(t)=>update({rooms:t})} />
      <TextInput style={styles.input} placeholder="Doors" keyboardType="numeric" value={data.doors} onChangeText={(t)=>update({doors:t})} />
      <TextInput style={styles.input} placeholder="Windows" keyboardType="numeric" value={data.windows} onChangeText={(t)=>update({windows:t})} />

      <Text style={styles.label}>Surface condition</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {["Good","Minor cracks","Moderate repairs","Major repair"].map(opt => (
          <TouchableOpacity key={opt} onPress={()=>update({surfaceCondition:opt})} style={[styles.chip, data.surfaceCondition===opt && styles.chipSelected]}>
            <Text style={[styles.chipText, data.surfaceCondition===opt && styles.chipTextSelected]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
        <Text style={{ marginRight: 8 }}>Remove old paint?</Text>
        <Switch value={!!data.removeOldPaint} onValueChange={v=>update({ removeOldPaint: v, removalMethod: v ? (data.removalMethod || "Scraping") : "" })} />
      </View>

      {data.removeOldPaint ? (
        <>
          <Text style={styles.label}>Removal method</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {["Scraping","Sanding","Chemical"].map(m => (
              <TouchableOpacity key={m} onPress={()=>update({ removalMethod: m })} style={[styles.chip, data.removalMethod===m && styles.chipSelected]}>
                <Text style={[styles.chipText, data.removalMethod===m && styles.chipTextSelected]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : null}

      <Text style={styles.label}>Number of coats</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {["1 Coat","2 Coats","Primer + 2 Finish Coats"].map(c=>(
          <TouchableOpacity key={c} onPress={()=>update({ coats: c })} style={[styles.chip, data.coats===c && styles.chipSelected]}>
            <Text style={[styles.chipText, data.coats===c && styles.chipTextSelected]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Color selection</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {["I will provide","Need help","Not decided"].map(o => (
          <TouchableOpacity key={o} onPress={()=>update({ colorSelected: o })} style={[styles.chip, data.colorSelected===o && styles.chipSelected]}>
            <Text style={[styles.chipText, data.colorSelected===o && styles.chipTextSelected]}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Decorative works (optional)</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {DECOR.map(d => {
          const sel = (data.decorative || []).includes(d);
          return (
            <TouchableOpacity key={d} onPress={()=>toggleMulti("decorative", d)} style={[styles.chip, sel && styles.chipSelected]}>
              <Text style={[styles.chipText, sel && styles.chipTextSelected]}>{d}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Materials provided by</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {["Contractor","Client","Mix"].map(m => (
          <TouchableOpacity key={m} onPress={()=>update({ materialsBy: m })} style={[styles.chip, data.materialsBy===m && styles.chipSelected]}>
            <Text style={[styles.chipText, data.materialsBy===m && styles.chipTextSelected]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Preferred start date (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} placeholder="2025-11-01" value={data.startDate} onChangeText={(t)=>update({ startDate: t })} />

      <Text style={styles.label}>Expected completion date (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} placeholder="2025-11-05" value={data.endDate} onChangeText={(t)=>update({ endDate: t })} />

      <Text style={styles.label}>Contact for site visit</Text>
      <TextInput style={styles.input} placeholder="Name" value={data.contactName} onChangeText={(t)=>update({ contactName: t })} />
      <TextInput style={styles.input} placeholder="Phone" value={data.contactPhone} onChangeText={(t)=>update({ contactPhone: t })} />
      <TextInput style={styles.input} placeholder="Preferred time" value={data.contactTime} onChangeText={(t)=>update({ contactTime: t })} />

      <Text style={styles.label}>Tender closing date (optional)</Text>
      <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={data.tenderDate} onChangeText={(t)=>update({ tenderDate: t })} />

      <View style={styles.rowBtns}>
        <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => prev && prev()}>
          <Text style={styles.btnText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => next && next()}>
          <Text style={[styles.btnText, { color: "#fff" }]}>Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginTop: 12, color: "#374151", fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#E5E7EB", padding: 10, borderRadius: 6, marginTop: 6, backgroundColor: "#fff" },
  chip: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#fff", marginRight: 8, marginTop: 8 },
  chipSelected: { backgroundColor: "#4f46e5", borderColor: "#4f46e5" },
  chipText: { color: "#111827" },
  chipTextSelected: { color: "#fff" },
  rowBtns: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 6, alignItems: "center" },
  btnPrimary: { backgroundColor: "#4f46e5", marginLeft: 8 },
  btnOutline: { borderWidth: 1, borderColor: "#CBD5E1", backgroundColor: "#fff" },
  btnText: { color: "#111827", fontWeight: "600" },
});
