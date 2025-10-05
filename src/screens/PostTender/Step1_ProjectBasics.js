// src/screens/PostTender/Step1_ProjectBasics.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Step2_Kitchen from './Step2_Kitchen';

/*
  Step 1: Project Basics Wizard
  - single-question-per-view wizard
  - autosave to AsyncStorage
  - date picker, MCQs, numeric input
*/

const STORAGE_KEY = 'tenderpro_post_draft_v1';

const PROPERTY_TYPES = [
  '1 BHK', '2 BHK', '3 BHK', '4+ BHK', 'Studio', 'Villa', 'Apartment', 'Penthouse', 'Commercial', 'Other'
];

const AREA_RANGES = [
  '< 600 sq.ft', '600–1000', '1001–1500', '1501–2500', '>2500', 'Enter exact'
];

const PROJECT_TYPES = ['New construction', 'Renovation', 'Partial remodel', 'Finishing only'];

const CONSTRUCTION_HANDLED_BY = ['Builder', 'Architect', 'Engineer', 'Mistry/Local contractor', 'Owner', 'Other'];

const text = ''; 

export default function Step1_ProjectBasics({ navigate }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({
    propertyType: null,
    builtUpArea: null,
    builtUpAreaCustom: '',
    projectType: null,
    constructionHandledBy: null,
    currentStage: null,
    designRequirement: null,
    materialPreference: [], // multi-select if needed later
    budgetRange: null,
    customBudget: '',
    expectedStart: null,
    expectedCompletion: null,
    tenderLastDate: null,
  });

  const autosaveTimer = useRef(null);

  // Date picker state
  const [showDatePickerFor, setShowDatePickerFor] = useState(null); // 'start'|'end'|'tender' or null
  const [tempDate, setTempDate] = useState(new Date());

  // Load draft on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setAnswers(JSON.parse(raw));
      } catch (e) {
        console.warn('Could not load draft', e);
      }
    })();
  }, []);

  // Autosave every 10s
  useEffect(() => {
    autosaveTimer.current = setInterval(() => {
      saveDraft();
    }, 10000);
    return () => clearInterval(autosaveTimer.current);
  }, [answers]);

  // Save draft helper
  const saveDraft = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
      // console.log('Draft saved');
    } catch (e) {
      console.warn('Failed to save draft', e);
    }
  };

  // Helpers to update answers
  const setAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  // Navigation
  const totalSteps = 6; // number of questions in step1 wizard
  const next = () => {
    // simple validation before moving forward
    if (!validateCurrentStep()) return;
    if (stepIndex < totalSteps - 1) setStepIndex(i => i + 1);
    else {
      // finished step1
      saveDraft();
      // navigate to next screen (PostTender Step 2)
    //   navigation.navigate('Step2_Kitchen'); // change to your real route
    }
  };

  const back = () => {
    if (stepIndex > 0) setStepIndex(i => i - 1);
    else navigation.goBack();
  };

  const validateCurrentStep = () => {
    // Basic per-step validations
    if (stepIndex === 0 && !answers.propertyType) {
      Alert.alert('Please select property type');
      return false;
    }
    if (stepIndex === 1 && !answers.builtUpArea) {
      Alert.alert('Please select built-up area');
      return false;
    }
    if (stepIndex === 2 && !answers.projectType) {
      Alert.alert('Please select project type');
      return false;
    }
    if (stepIndex === 3 && !answers.constructionHandledBy) {
      Alert.alert('Please select who is handling construction');
      return false;
    }
    if (stepIndex === 4 && !answers.budgetRange && !answers.customBudget) {
      Alert.alert('Please choose a budget range or enter a custom budget');
      return false;
    }
    if (stepIndex === 5 && !answers.tenderLastDate) {
      Alert.alert('Please select tender last date');
      return false;
    }
    return true;
  };

  // Date picker handler
  const onDateConfirmed = (event, selected) => {
    if (Platform.OS === 'android') setShowDatePickerFor(null); // android closes automatically
    const picked = selected || tempDate;
    if (showDatePickerFor === 'start') setAnswer('expectedStart', picked.toISOString().split('T')[0]);
    if (showDatePickerFor === 'end') setAnswer('expectedCompletion', picked.toISOString().split('T')[0]);
    if (showDatePickerFor === 'tender') setAnswer('tenderLastDate', picked.toISOString().split('T')[0]);
    setShowDatePickerFor(null);
  };

  // UI pieces for each question
  const renderStepContent = () => {
    switch (stepIndex) {
      case 0: // property type
        return (
          <View>
            <Text style={styles.question}>What type of property is this?</Text>
            <View style={styles.optionsWrap}>
              {PROPERTY_TYPES.map(opt => (
                <OptionButton
                  key={opt}
                  label={opt}
                  selected={answers.propertyType === opt}
                  onPress={() => setAnswer('propertyType', opt)}
                />
              ))}
            </View>
          </View>
        );

      case 1: // built up
        return (
          <View>
            <Text style={styles.question}>Built-up area (choose range or enter exact)</Text>
            <View style={styles.optionsWrap}>
              {AREA_RANGES.map(opt => (
                <OptionButton
                  key={opt}
                  label={opt}
                  selected={answers.builtUpArea === opt}
                  onPress={() => setAnswer('builtUpArea', opt)}
                />
              ))}
            </View>

            {answers.builtUpArea === 'Enter exact' && (
              <TextInput
                placeholder="Enter exact sq.ft"
                style={styles.input}
                keyboardType="numeric"
                value={answers.builtUpAreaCustom}
                onChangeText={t => setAnswer('builtUpAreaCustom', t)}
              />
            )}
          </View>
        );

      case 2: // project type
        return (
          <View>
            <Text style={styles.question}>Project Type</Text>
            <View style={styles.optionsWrap}>
              {PROJECT_TYPES.map(opt => (
                <OptionButton
                  key={opt}
                  label={opt}
                  selected={answers.projectType === opt}
                  onPress={() => setAnswer('projectType', opt)}
                />
              ))}
            </View>
          </View>
        );

      case 3: // construction handled by
        return (
          <View>
            <Text style={styles.question}>Who is handling the construction?</Text>
            <View style={styles.optionsWrap}>
              {CONSTRUCTION_HANDLED_BY.map(opt => (
                <OptionButton
                  key={opt}
                  label={opt}
                  selected={answers.constructionHandledBy === opt}
                  onPress={() => setAnswer('constructionHandledBy', opt)}
                />
              ))}
            </View>
          </View>
        );

      case 4: // budget
        return (
          <View>
            <Text style={styles.question}>Budget</Text>
            <View style={styles.optionsWrap}>
              {['< ₹2L', '₹2–5L', '₹5–10L', '₹10–20L', '20L+'].map(opt => (
                <OptionButton
                  key={opt}
                  label={opt}
                  selected={answers.budgetRange === opt}
                  onPress={() => {
                    setAnswer('budgetRange', opt);
                    setAnswer('customBudget', '');
                  }}
                />
              ))}
            </View>

            <Text style={{ marginTop: 12 }}>Or enter custom budget (numbers only):</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter budget in ₹"
              keyboardType="numeric"
              value={answers.customBudget}
              onChangeText={t => {
                setAnswer('customBudget', t);
                if (t) setAnswer('budgetRange', null);
              }}
            />
          </View>
        );

      case 5: // dates: expected start / completion / tender last date
        return (
          <View>
            <Text style={styles.question}>Dates</Text>

            <Text style={styles.label}>Expected Start</Text>
            <TouchableOpacity
              style={styles.dateBox}
              onPress={() => {
                setTempDate(new Date());
                setShowDatePickerFor('start');
              }}
            >
              <Text>{answers.expectedStart || 'Choose start date'}</Text>
            </TouchableOpacity>

            <Text style={[styles.label, { marginTop: 8 }]}>Expected Completion</Text>
            <TouchableOpacity
              style={styles.dateBox}
              onPress={() => {
                setTempDate(new Date());
                setShowDatePickerFor('end');
              }}
            >
              <Text>{answers.expectedCompletion || 'Choose completion date'}</Text>
            </TouchableOpacity>

            <Text style={[styles.label, { marginTop: 8 }]}>Tender Last Date</Text>
            <TouchableOpacity
              style={styles.dateBox}
              onPress={() => {
                setTempDate(new Date());
                setShowDatePickerFor('tender');
              }}
            >
              <Text>{answers.tenderLastDate || 'Choose tender last date'}</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return <Text>Unknown step</Text>;
    }
  };

  const finish_continueNavigation = useNavigation();

  const handleNavigation = () => {
    console.log('inside handle nagivation')
    if(stepIndex === totalSteps - 1 ){
        console.log('Control entered if');
        finish_continueNavigation.navigate(Step2_Kitchen);
    }
}

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Step 1 — Project Basics</Text>
        <Text style={styles.progressText}>{`${stepIndex + 1} / ${totalSteps}`}</Text>
      </View>

      <View style={styles.progressBarWrap}>
        <View style={[styles.progressBar, { width: `${((stepIndex + 1) / totalSteps) * 100}%` }]} />
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        {renderStepContent()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnGhost} onPress={back}>
          <Text style={styles.btnGhostText}>{stepIndex === 0 ? 'Cancel' : 'Back'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnPrimary} onPress={next}>
          <Pressable onPress={handleNavigation} style={styles.btnPrimaryText} >
            <Text>{stepIndex === totalSteps - 1 ? 'Finish & Continue' : 'Next'}</Text>
          </Pressable>
        </TouchableOpacity>
      </View>

      {showDatePickerFor && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
          onChange={onDateConfirmed}
        />
      )}
    </View>
  );
}

/* Helper OptionButton component */
function OptionButton({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.optionButton, selected ? styles.optionSelected : null]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.optText, selected ? styles.optTextSelected : null]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* Styles */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 20, fontWeight: '700' },
  progressText: { fontSize: 14, color: '#666' },
  progressBarWrap: { height: 6, backgroundColor: '#eee', marginHorizontal: 18, borderRadius: 6, overflow: 'hidden' },
  progressBar: { height: 6, backgroundColor: '#2f7bfd' },
  content: { padding: 18, flex: 1 },
  question: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  optionsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 120,
  },
  optionSelected: { backgroundColor: '#e8f0ff', borderColor: '#2f7bfd' },
  optText: { color: '#333' },
  optTextSelected: { color: '#1b4bd6', fontWeight: '700' },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  label: { fontWeight: '600', marginTop: 4, marginBottom: 6 },
  dateBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 6,
  },
  footer: {
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnPrimary: {
    backgroundColor: '#2f7bfd',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 140,
    alignItems: 'center',
  },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },
  btnGhost: {
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 100,
  },
  btnGhostText: { color: '#333', fontWeight: '600' },
});
