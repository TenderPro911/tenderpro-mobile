// src/screens/PostTender/Step3_Bedrooms.js
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Switch,
} from 'react-native';
import { TendersContext } from '../../context/TendersContext'; // adapt path if needed
import PrimaryButton from '../../components/PrimaryButton'; // your button component (optional)
import Step4_TVUnits from './Step4_TVUnits';

const BEDROOM_KEYS = [
  { key: 'master', label: 'Master' },
  { key: 'bedroom2', label: 'Bedroom 2' },
  { key: 'guest', label: 'Guest' },
  { key: 'kids', label: 'Kids' },
];

const SIZE_OPTIONS = ['4ft', '5ft', '6ft', '7ft', '8ft', 'Custom'];
const WARDROBE_TYPES = ['Sliding', 'Hinged', 'Walk-in', 'Open shelving'];
const FINISHES = ['Laminate', 'Acrylic', 'PU', 'Veneer', 'Glass', 'Mix'];
const STORAGE_OPTIONS = ['Shelves', 'Drawers', 'Long hanging', 'Short hanging', 'Shoe rack', 'Accessories', 'Safe'];

function ToggleOption({ value, onChange, label }) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

function RadioRow({ options, value, onSelect }) {
  return (
    <View style={styles.radioRow}>
      {options.map((opt) => {
        const selected = opt === value;
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.radioPill, selected && styles.radioPillActive]}
            onPress={() => onSelect(opt)}
          >
            <Text style={[styles.radioText, selected && styles.radioTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MultiToggleRow({ options, valueArray, onToggle }) {
  return (
    <View style={styles.multiRow}>
      {options.map((opt) => {
        const selected = valueArray.includes(opt);
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.multiPill, selected && styles.multiPillActive]}
            onPress={() => onToggle(opt)}
          >
            <Text style={[styles.multiText, selected && styles.multiTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function Step3_Bedrooms({ navigation, route, onNext, onBack }) {
  // try to use context if available
  const ctx = useContext(TendersContext || React.createContext({}));
  // read existing answers if any
  const initialAnswers = (ctx && ctx.answers && ctx.answers.bedrooms) || {};

  // top-level structure: { master: {...}, bedroom2: {...} }
  const [answers, setAnswers] = useState(initialAnswers);

  // helper: toggle bedroom on/off
  const toggleBedroomEnabled = (key) => {
    setAnswers((prev) => {
      const enabled = !!prev?.[key];
      if (enabled) {
        // disable (remove)
        const next = { ...prev };
        delete next[key];
        return next;
      } else {
        return {
          ...prev,
          [key]: {
            enabled: true,
            wardrobeSize: '',
            wardrobeType: '',
            finish: '',
            storage: [],
            mirror: 'None',
            internalLighting: false,
            notes: '',
          },
        };
      }
    });
  };

  const setBedroomField = (key, field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [field]: value,
      },
    }));
  };

  const toggleStorageOption = (key, option) => {
    setAnswers((prev) => {
      const arr = (prev[key] && prev[key].storage) || [];
      const newArr = arr.includes(option) ? arr.filter((a) => a !== option) : [...arr, option];
      return {
        ...prev,
        [key]: { ...(prev[key] || {}), storage: newArr },
      };
    });
  };

  useEffect(() => {
    // autosave into context if context exposes setter
    if (ctx && typeof ctx.setAnswers === 'function') {
      // shallow merge into context
      ctx.setAnswers((existing = {}) => ({
        ...existing,
        bedrooms: answers,
      }));
    }
  }, [answers]);

  // when user presses continue
  const handleContinue = () => {
    // final validation can be added here
    // either call onNext (for container) or navigate to next step route
    if (typeof onNext === 'function') {
      onNext(answers);
    } else if (navigation && typeof navigation.navigate === 'function') {
      // replace 'Step4_General' with your actual next route name
      navigation.navigate('Step4_TVUnits', { bedrooms: answers });
    } else {
      console.log('Step3: no onNext and navigation not available', answers);
    }
  };

  const renderBedroomBlock = (key, label) => {
    const item = answers[key] || {};
    if (!item.enabled) return null;

    return (
      <View key={key} style={styles.bedroomBlock}>
        <Text style={styles.sectionTitle}>{label} — Wardrobe</Text>

        <Text style={styles.fieldLabel}>Size</Text>
        <RadioRow
          options={SIZE_OPTIONS}
          value={item.wardrobeSize}
          onSelect={(v) => setBedroomField(key, 'wardrobeSize', v)}
        />
        {item.wardrobeSize === 'Custom' && (
          <TextInput
            placeholder="Enter exact width (e.g. 5.5ft)"
            style={styles.textInput}
            value={item.customSize || ''}
            onChangeText={(t) => setBedroomField(key, 'customSize', t)}
          />
        )}

        <Text style={styles.fieldLabel}>Type</Text>
        <RadioRow
          options={WARDROBE_TYPES}
          value={item.wardrobeType}
          onSelect={(v) => setBedroomField(key, 'wardrobeType', v)}
        />

        <Text style={styles.fieldLabel}>Finish</Text>
        <RadioRow
          options={FINISHES}
          value={item.finish}
          onSelect={(v) => setBedroomField(key, 'finish', v)}
        />

        <Text style={styles.fieldLabel}>Storage needs</Text>
        <MultiToggleRow
          options={STORAGE_OPTIONS}
          valueArray={item.storage || []}
          onToggle={(opt) => toggleStorageOption(key, opt)}
        />

        <Text style={styles.fieldLabel}>Mirror</Text>
        <RadioRow
          options={['On shutter', 'Inside', 'Full-length', 'None']}
          value={item.mirror}
          onSelect={(v) => setBedroomField(key, 'mirror', v)}
        />

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Internal lighting</Text>
          <Switch
            value={!!item.internalLighting}
            onValueChange={(v) => setBedroomField(key, 'internalLighting', v)}
          />
        </View>

        <Text style={styles.fieldLabel}>Other requirements</Text>
        <TextInput
          style={[styles.textInput, { minHeight: 60 }]}
          placeholder="Short notes (e.g. shoe rack, dividers, safe)"
          multiline
          value={item.notes || ''}
          onChangeText={(t) => setBedroomField(key, 'notes', t)}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Step 3 — Bedrooms & Wardrobes</Text>

      <Text style={styles.helpText}>Turn on rooms where you require wardrobes.</Text>

      <View style={styles.toggleList}>
        {BEDROOM_KEYS.map((b) => {
          const enabled = !!answers[b.key]?.enabled;
          return (
            <View key={b.key} style={styles.toggleWrap}>
              <ToggleOption
                label={b.label}
                value={enabled}
                onChange={() => toggleBedroomEnabled(b.key)}
              />
            </View>
          );
        })}
      </View>

      {/* Render bedroom blocks for enabled bedrooms */}
      <View style={{ width: '100%' }}>
        {BEDROOM_KEYS.map((b) => renderBedroomBlock(b.key, b.label))}
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.btn, styles.btnSecondary]}
          onPress={() => {
            if (typeof onBack === 'function') return onBack();
            if (navigation && navigation.goBack) return navigation.goBack();
          }}
        >
          <Text style={styles.btnTextSecondary}>Back</Text>
        </TouchableOpacity>

        {/* Use PrimaryButton if you have it, else the fallback */}
        {typeof PrimaryButton === 'function' ? (
          <PrimaryButton title="Save & Continue" onPress={handleContinue} />
        ) : (
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleContinue}>
            <Text style={styles.btnText}>Save & Continue</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  container: { alignItems: 'center', padding: 16, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 6, color: '#0e2b3b' },
  helpText: { fontSize: 14, color: '#444', marginBottom: 12 },
  toggleList: { width: '100%', marginBottom: 12 },
  toggleWrap: { marginBottom: 8, borderBottomColor: '#eee', borderBottomWidth: 1, paddingBottom: 8 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleLabel: { fontSize: 16, color: '#111' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 12, marginBottom: 8 },
  bedroomBlock: {
    width: '100%',
    backgroundColor: '#f9fbfc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderColor: '#eef3f6',
    borderWidth: 1,
  },
  fieldLabel: { marginTop: 8, fontWeight: '600', marginBottom: 6 },
  textInput: { borderWidth: 1, borderColor: '#e1e7ea', borderRadius: 6, padding: 8, backgroundColor: '#fff' },
  radioRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  radioPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d0d7da',
    marginRight: 8,
    marginBottom: 6,
  },
  radioPillActive: { backgroundColor: '#184e77', borderColor: '#184e77' },
  radioText: { color: '#1f2d33' },
  radioTextActive: { color: '#fff' },
  multiRow: { flexDirection: 'row', flexWrap: 'wrap' },
  multiPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d0d7da',
    marginRight: 8,
    marginBottom: 6,
  },
  multiPillActive: { backgroundColor: '#0b7a55', borderColor: '#0b7a55' },
  multiText: {},
  multiTextActive: { color: '#fff' },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 12 },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  btnPrimary: { backgroundColor: '#0e74ff' },
  btnText: { color: '#fff', fontWeight: '700' },
  btnSecondary: { borderWidth: 1, borderColor: '#d0d7da', backgroundColor: '#fff' },
  btnTextSecondary: { color: '#111', fontWeight: '600' },
});
