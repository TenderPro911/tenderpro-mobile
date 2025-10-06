// src/screens/PostTender/Step2_Kitchen.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Step3_Bedrooms from './Step3_Bedrooms';



/*
  Step 2: Kitchen (scroll page)
  - Toggle to show/hide kitchen block
  - Autosave + load draft
  - Validation on Next
  - Connects to shared draft key if Step1 saved to same key
*/

const SHARED_DRAFT_KEY = 'tenderpro_post_draft_v1'; // recommended shared key
// (If you didn't change Step1: you can keep Step1 key as-is; Step2 will still save & load its own key below)

export default function Step2_Kitchen({ navigation }) {

  const [kitchenRequired, setKitchenRequired] = useState(false);

  const [form, setForm] = useState({
    size: null, // e.g. '8x8'
    layout: null, // 'Straight', 'L-shape', ...
    slabStatus: null,
    drawers: null,
    finish: null,
    wallUnits: null,
    tallUnit: null,
    countertop: null,
    hardwareGrade: null,
    otherRequirements: '',
  });

  const autosaveTimer = useRef(null);

  // load draft
  useEffect(() => {
    (async () => {
      try {
        // Try to read shared draft (Step1 may have saved here)
        const raw = await AsyncStorage.getItem(SHARED_DRAFT_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          // if parsed contains kitchen data, merge it
          if (parsed.kitchen) {
            setForm(prev => ({ ...prev, ...parsed.kitchen }));
            if (parsed.kitchen.kitchenRequired) setKitchenRequired(true);
          }
        }
        // Also try an explicit step2-only key (in case Step1 not changed)
        const raw2 = await AsyncStorage.getItem('tenderpro_step2_kitchen_draft_v1');
        if (raw2) {
          const parsed2 = JSON.parse(raw2);
          setForm(prev => ({ ...prev, ...parsed2 }));
          if (parsed2.kitchenRequired) setKitchenRequired(true);
        }
      } catch (e) {
        console.warn('Failed to load kitchen draft', e);
      }
    })();
  }, []);

  useEffect(() => {
    autosaveTimer.current = setInterval(() => {
      saveDraft();
    }, 10000);
    return () => clearInterval(autosaveTimer.current);
  }, [form, kitchenRequired]);

  const saveDraft = async () => {
    try {
      // Save in a step2-specific key
      await AsyncStorage.setItem('tenderpro_step2_kitchen_draft_v1', JSON.stringify({ ...form, kitchenRequired }));
      // Also merge into shared draft key (so Step1 and Step2 share when using SHARED_DRAFT_KEY)
      const existing = await AsyncStorage.getItem(SHARED_DRAFT_KEY);
      let merged = {};
      if (existing) merged = JSON.parse(existing);
      merged.kitchen = { ...merged.kitchen, ...form, kitchenRequired };
      await AsyncStorage.setItem(SHARED_DRAFT_KEY, JSON.stringify(merged));
      // console.log('Saved kitchen draft');
    } catch (e) {
      console.warn('Kitchen save failed', e);
    }
  };

  const setField = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  // Simple validation before proceeding
  const validateAndNext = () => {
    if (!kitchenRequired) {
      // If kitchen not required just move next
      navigation.navigate('Step3_Bedrooms'); // update to your next route (or Step3)
      return;
    }
    // Some basic completions
    if (!form.size) return Alert.alert('Please choose approximate kitchen size');
    if (!form.layout) return Alert.alert('Please select layout');
    // Save then navigate
    saveDraft().then(() => navigation.navigate('Step3_Bedrooms'));
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Step 2 — Kitchen</Text>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.row}>
          <Text style={styles.label}>Kitchen Required?</Text>
          <Switch value={kitchenRequired} onValueChange={val => setKitchenRequired(val)} />
        </View>

        {kitchenRequired && (
          <View style={styles.block}>
            <Text style={styles.label}>Approximate Kitchen Size</Text>
            <View style={styles.optionsRow}>
              {['8x8', '8x10', '10x12', '12x15', '16x16', 'Custom'].map(opt => (
                <Option
                  key={opt}
                  label={opt}
                  selected={form.size === opt}
                  onPress={() => setField('size', opt)}
                />
              ))}
            </View>

            {form.size === 'Custom' && (
              <TextInput
                style={styles.input}
                placeholder="Enter size (e.g. 9x11)"
                value={form.sizeCustom}
                onChangeText={t => setField('sizeCustom', t)}
              />
            )}

            <Text style={styles.label}>Layout</Text>
            <View style={styles.optionsRow}>
              {['Straight', 'L-Shape', 'U-Shape', 'Parallel', 'Island', 'Need advice'].map(opt => (
                <Option key={opt} label={opt} selected={form.layout === opt} onPress={() => setField('layout', opt)} />
              ))}
            </View>

            <Text style={styles.label}>Slab Status</Text>
            <View style={styles.optionsRow}>
              {['Slab done', 'Not available', 'Need contractor suggestion'].map(opt => (
                <Option key={opt} label={opt} selected={form.slabStatus === opt} onPress={() => setField('slabStatus', opt)} />
              ))}
            </View>

            <Text style={styles.label}>Approx. No. of Drawers</Text>
            <View style={styles.optionsRow}>
              {['0–5', '6–10', '11–15', '15+', 'Not sure'].map(opt => (
                <Option key={opt} label={opt} selected={form.drawers === opt} onPress={() => setField('drawers', opt)} />
              ))}
            </View>

            <Text style={styles.label}>Finish Preference</Text>
            <View style={styles.optionsRow}>
              {['Laminate', 'Acrylic', 'PU', 'Veneer', 'Glass', 'Other'].map(opt => (
                <Option key={opt} label={opt} selected={form.finish === opt} onPress={() => setField('finish', opt)} />
              ))}
            </View>

            <Text style={styles.label}>Wall Units</Text>
            <View style={styles.optionsRow}>
              {['No', 'Yes (1 wall)', 'Yes (2 walls)', 'Yes (3 walls)'].map(opt => (
                <Option key={opt} label={opt} selected={form.wallUnits === opt} onPress={() => setField('wallUnits', opt)} />
              ))}
            </View>

            <Text style={styles.label}>Tall Unit</Text>
            <View style={styles.optionsRow}>
              {['Yes', 'No', 'Not sure'].map(opt => (
                <Option key={opt} label={opt} selected={form.tallUnit === opt} onPress={() => setField('tallUnit', opt)} />
              ))}
            </View>

            <Text style={styles.label}>Countertop Material</Text>
            <View style={styles.optionsRow}>
              {['No countertop', 'Granite', 'Quartz', 'Marble', 'Solid surface', 'Other'].map(opt => (
                <Option key={opt} label={opt} selected={form.countertop === opt} onPress={() => setField('countertop', opt)} />
              ))}
            </View>

            <Text style={styles.label}>Hardware Grade</Text>
            <View style={styles.optionsRow}>
              {[
                'Normal close',
                'Soft close standard',
                'Soft close non-branded premium',
                'Soft close branded premium (Hettich/Blum)'
              ].map(opt => (
                <Option key={opt} label={opt} selected={form.hardwareGrade === opt} onPress={() => setField('hardwareGrade', opt)} />
              ))}
            </View>

            <Text style={styles.label}>Other Requirements (optional)</Text>
            <TextInput
              style={[styles.input, { minHeight: 80 }]}
              value={form.otherRequirements}
              onChangeText={t => setField('otherRequirements', t)}
              placeholder="Any special requirements for kitchen..."
              multiline
            />
          </View>
        )}

        {/* Save hint */}
        <Text style={{ color: '#666', marginTop: 8 }}>Draft autosaves every 10s.</Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnGhost}>
          <Text style={styles.btnGhostText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={validateAndNext} style={styles.btnPrimary}>
          <Text style={styles.btnPrimaryText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* Small option button used above */
function Option({ label, selected, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.opt, selected ? styles.optSelected : null]}>
      <Text style={[styles.optText, selected ? styles.optTextSelected : null]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* Styles */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 20, fontWeight: '700' },
  content: { padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  label: { fontWeight: '700', marginVertical: 8 },
  block: { marginTop: 8, paddingBottom: 24 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  opt: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  optSelected: { backgroundColor: '#f0f7ff', borderColor: '#2f7bfd' },
  optText: { color: '#333' },
  optTextSelected: { color: '#1b4bd6', fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  footer: { padding: 16, flexDirection: 'row', justifyContent: 'space-between' },
  btnPrimary: {
    backgroundColor: '#2f7bfd',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },
  btnGhost: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 100,
  },
  btnGhostText: { color: '#333', fontWeight: '600' },
});
