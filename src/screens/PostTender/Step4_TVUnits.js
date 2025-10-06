// src/screens/PostTender/Step4_TVUnits.js
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { TendersContext } from '../../context/TendersContext'; // adjust path if necessary
import PrimaryButton from '../../components/PrimaryButton'; // optional; fallback included
import Step5_GeneralFinal from './Step5_GeneralFinal';

const ROOM_OPTIONS = [
  { key: 'living', label: 'Living Room' },
  { key: 'master', label: 'Master Bedroom' },
  { key: 'bedroom2', label: 'Bedroom 2' },
  { key: 'guest', label: 'Guest Bedroom' },
  { key: 'kids', label: 'Kids Bedroom' },
  { key: 'other', label: 'Other' },
];

const WALL_SIZES = ['5ft', '6ft', '8ft', '10ft', '12ft+', 'Custom'];
const TV_SIZES = ['<40"', '40–55"', '56–65"', '65"+', 'Not sure'];
const UNIT_TYPES = ['Floating', 'Console with cabinets', 'Full wall panel', 'Minimal', 'Custom'];
const FINISHES = ['Laminate', 'Acrylic', 'PU', 'Veneer', 'Glass', 'Mix', 'Not sure'];
const STORAGE_OPTS = ['Shelves', 'Cabinets', 'Drawers', 'Hidden cable', 'Display niche'];
const LIGHTING_OPTS = ['Backlight', 'Spotlights', 'LED strip', 'None'];
const SOUND_OPTS = ['None', 'Sound bar', 'Home theatre', 'Gaming console'];

function Pill({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.pill, active && styles.pillActive]}
      onPress={onPress}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function Step4_TVUnits({ navigation, onBack, onNext, route }) {
  const ctx = useContext(TendersContext || React.createContext({}));
  const initial = (ctx && ctx.answers && ctx.answers.tvUnits) || (route?.params?.tvUnits || {});

  // structure: { rooms: { living: {selected:true, details: {...}}, master: {...} } }
  const [rooms, setRooms] = useState(initial.rooms || {});

  // toggle room selection
  const toggleRoom = (key) => {
    setRooms((prev) => {
      const isSelected = !!prev[key]?.selected;
      if (isSelected) {
        const next = { ...prev };
        delete next[key];
        return next;
      } else {
        return {
          ...prev,
          [key]: {
            selected: true,
            details: {
              wallSize: '',
              customWallSize: '',
              tvSize: '',
              unitType: '',
              finish: '',
              storage: [],
              lighting: [],
              sound: '',
              notes: '',
            },
          },
        };
      }
    });
  };

  const setDetail = (key, field, value) => {
    setRooms((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || { selected: true, details: {} }),
        details: {
          ...(prev[key]?.details || {}),
          [field]: value,
        },
      },
    }));
  };

  const toggleArrayItem = (key, field, value) => {
    setRooms((prev) => {
      const arr = (prev[key]?.details?.[field]) || [];
      const nextArr = arr.includes(value) ? arr.filter((a) => a !== value) : [...arr, value];
      return {
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          details: {
            ...(prev[key]?.details || {}),
            [field]: nextArr,
          },
        },
      };
    });
  };

  // keep context updated as user edits (nice-to-have autosave)
  useEffect(() => {
    if (ctx && typeof ctx.setAnswers === 'function') {
      ctx.setAnswers((prev = {}) => ({ ...prev, tvUnits: { rooms } }));
    }
  }, [rooms]);

  // --- handle navigation to Step 5 (final) ---
  const handleContinue = () => {
    // Build merged answers: prefer context existing answers, then route params, then local
    const existing = (ctx && ctx.answers) || (route?.params?.answers || {});
    const merged = {
      ...existing,
      tvUnits: { rooms },
    };

    // Persist to context if setter available (recommended)
    if (ctx && typeof ctx.setAnswers === 'function') {
      ctx.setAnswers(merged);
    }

    // If parent flow provided callback use it (works if you render steps inline in a wizard)
    if (typeof onNext === 'function') {
      return onNext(merged);
    }

    // Normal navigation: ensure your navigator has the screen name below.
    // Replace 'Step5_GeneralFinal' with your exact registered screen name in AppNavigator if different.
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate('Step5_GeneralFinal', { answers: merged });
      return;
    }

    // Fallback: log (shouldn't normally reach here)
    console.log('Step4: could not navigate (no onNext and no navigation). Data:', merged);
  };

  const renderRoomDetails = (key, label) => {
    const entry = rooms[key];
    if (!entry || !entry.selected) return null;
    const d = entry.details || {};

    return (
      <View key={key} style={styles.roomCard}>
        <Text style={styles.cardTitle}>{label} — TV Unit</Text>

        <Text style={styles.label}>Wall size</Text>
        <View style={styles.rowWrap}>
          {WALL_SIZES.map((s) => (
            <Pill
              key={s}
              label={s}
              active={d.wallSize === s}
              onPress={() => setDetail(key, 'wallSize', s)}
            />
          ))}
        </View>
        {d.wallSize === 'Custom' && (
          <TextInput
            style={styles.input}
            placeholder="Enter custom wall width (e.g. 13ft)"
            value={d.customWallSize || ''}
            onChangeText={(t) => setDetail(key, 'customWallSize', t)}
          />
        )}

        <Text style={styles.label}>TV size</Text>
        <View style={styles.rowWrap}>
          {TV_SIZES.map((s) => (
            <Pill key={s} label={s} active={d.tvSize === s} onPress={() => setDetail(key, 'tvSize', s)} />
          ))}
        </View>

        <Text style={styles.label}>Unit type</Text>
        <View style={styles.rowWrap}>
          {UNIT_TYPES.map((t) => (
            <Pill key={t} label={t} active={d.unitType === t} onPress={() => setDetail(key, 'unitType', t)} />
          ))}
        </View>

        <Text style={styles.label}>Finish</Text>
        <View style={styles.rowWrap}>
          {FINISHES.map((f) => (
            <Pill key={f} label={f} active={d.finish === f} onPress={() => setDetail(key, 'finish', f)} />
          ))}
        </View>

        <Text style={styles.label}>Storage needs</Text>
        <View style={styles.rowWrap}>
          {STORAGE_OPTS.map((s) => (
            <Pill
              key={s}
              label={s}
              active={Array.isArray(d.storage) && d.storage.includes(s)}
              onPress={() => toggleArrayItem(key, 'storage', s)}
            />
          ))}
        </View>

        <Text style={styles.label}>Lighting</Text>
        <View style={styles.rowWrap}>
          {LIGHTING_OPTS.map((l) => (
            <Pill
              key={l}
              label={l}
              active={Array.isArray(d.lighting) && d.lighting.includes(l)}
              onPress={() => toggleArrayItem(key, 'lighting', l)}
            />
          ))}
        </View>

        <Text style={styles.label}>Sound / Gaming</Text>
        <View style={styles.rowWrap}>
          {SOUND_OPTS.map((s) => (
            <Pill key={s} label={s} active={d.sound === s} onPress={() => setDetail(key, 'sound', s)} />
          ))}
        </View>

        <Text style={styles.label}>Other notes</Text>
        <TextInput
          style={[styles.input, { minHeight: 60 }]}
          placeholder="Any extra info for this TV unit..."
          multiline
          value={d.notes || ''}
          onChangeText={(t) => setDetail(key, 'notes', t)}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Step 4 — TV Units</Text>
      <Text style={styles.help}>Select rooms where a TV unit is required and fill details.</Text>

      <View style={styles.roomsRow}>
        {ROOM_OPTIONS.map((r) => {
          const active = !!rooms[r.key]?.selected;
          return (
            <TouchableOpacity
              key={r.key}
              style={[styles.roomOption, active && styles.roomOptionActive]}
              onPress={() => toggleRoom(r.key)}
            >
              <Text style={[styles.roomText, active && styles.roomTextActive]}>{r.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ width: '100%', marginTop: 10 }}>
        {ROOM_OPTIONS.map((r) => renderRoomDetails(r.key, r.label))}
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.btn, styles.btnSecondary]}
          onPress={() => {
            if (typeof onBack === 'function') return onBack();
            if (navigation && navigation.goBack) return navigation.goBack();
          }}
        >
          <Text style={styles.btnSecondaryText}>Back</Text>
        </TouchableOpacity>

        {typeof PrimaryButton === 'function' ? (
          <PrimaryButton title="Save & Continue" onPress={handleContinue} />
        ) : (
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleContinue}>
            <Text style={styles.btnPrimaryText}>Save & Continue</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  container: { alignItems: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#0b3b5c', marginBottom: 6 },
  help: { color: '#555', marginBottom: 12 },
  roomsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  roomOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: '#f2f5f7',
    marginRight: 8,
    marginBottom: 8,
  },
  roomOptionActive: { backgroundColor: '#0e74ff' },
  roomText: { color: '#0b2b3a' },
  roomTextActive: { color: '#fff' },
  roomCard: {
    width: '100%',
    backgroundColor: '#fbfdff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eef5fb',
    padding: 12,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  label: { fontWeight: '600', marginTop: 8, marginBottom: 6 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dde5ea',
    marginRight: 8,
    marginBottom: 8,
  },
  pillActive: { backgroundColor: '#1f8cff', borderColor: '#1f8cff' },
  pillText: { color: '#223' },
  pillTextActive: { color: '#fff' },
  input: { borderWidth: 1, borderColor: '#e3e9ee', padding: 8, borderRadius: 8, backgroundColor: '#fff', marginTop: 6 },
  buttons: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  btn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 8, minWidth: 120, alignItems: 'center' },
  btnPrimary: { backgroundColor: '#0e74ff' },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },
  btnSecondary: { borderWidth: 1, borderColor: '#d0d7da', backgroundColor: '#fff' },
  btnSecondaryText: { color: '#111', fontWeight: '600' },
});
