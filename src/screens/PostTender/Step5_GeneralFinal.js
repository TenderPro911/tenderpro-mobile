import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function Step5_GeneralFinal({ navigation }) {
  const [formData, setFormData] = useState({
    location: '',
    pincode: '',
    specialReq: '',
    currentPhotos: [],
    referencePhotos: [],
    floorPlan: [],
    consent: false,
  });

  const handlePickImages = async (field) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        setFormData((prev) => ({
          ...prev,
          [field]: [...prev[field], ...result.assets],
        }));
      }
    } catch (err) {
      Alert.alert('Error', 'Image picker failed');
    }
  };

  const handleSubmit = () => {
    Alert.alert(
      'Tender Submitted ✅',
      'Your tender details have been successfully submitted!',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('ClientHome'),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Step 5 – General & Final Details</Text>

      {/* Address Section */}
      <Text style={styles.label}>Location / Address</Text>
      <TextInput
        placeholder="Enter your full site address"
        style={styles.input}
        multiline
        value={formData.location}
        onChangeText={(text) => setFormData({ ...formData, location: text })}
      />
      <TextInput
        placeholder="Pincode"
        style={styles.input}
        keyboardType="numeric"
        value={formData.pincode}
        onChangeText={(text) => setFormData({ ...formData, pincode: text })}
      />

      {/* Special Requirements */}
      <Text style={styles.label}>Special Requirements</Text>
      <TextInput
        placeholder="Eg: false ceiling, partitions, pooja unit, etc."
        style={styles.input}
        multiline
        value={formData.specialReq}
        onChangeText={(text) => setFormData({ ...formData, specialReq: text })}
      />

      {/* Upload Images */}
      <Text style={styles.label}>Upload Current Site Photos</Text>
      <TouchableOpacity
        style={styles.uploadBtn}
        onPress={() => handlePickImages('currentPhotos')}
      >
        <Text style={styles.uploadText}>Select Photos</Text>
      </TouchableOpacity>

      <View style={styles.imageRow}>
        {formData.currentPhotos.map((img, i) => (
          <Image
            key={i}
            source={{ uri: img.uri }}
            style={styles.previewImg}
          />
        ))}
      </View>

      <Text style={styles.label}>Upload Reference / Inspiration Photos</Text>
      <TouchableOpacity
        style={styles.uploadBtn}
        onPress={() => handlePickImages('referencePhotos')}
      >
        <Text style={styles.uploadText}>Select Photos</Text>
      </TouchableOpacity>

      <View style={styles.imageRow}>
        {formData.referencePhotos.map((img, i) => (
          <Image
            key={i}
            source={{ uri: img.uri }}
            style={styles.previewImg}
          />
        ))}
      </View>

      <Text style={styles.label}>Upload Floor Plan / Drawings</Text>
      <TouchableOpacity
        style={styles.uploadBtn}
        onPress={() => handlePickImages('floorPlan')}
      >
        <Text style={styles.uploadText}>Select Files</Text>
      </TouchableOpacity>

      <View style={styles.imageRow}>
        {formData.floorPlan.map((img, i) => (
          <Image
            key={i}
            source={{ uri: img.uri }}
            style={styles.previewImg}
          />
        ))}
      </View>

      {/* Consent Checkbox (mock style) */}
      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() =>
          setFormData((prev) => ({ ...prev, consent: !prev.consent }))
        }
      >
        <View
          style={[
            styles.checkbox,
            formData.consent && styles.checkboxChecked,
          ]}
        />
        <Text style={styles.checkboxText}>I consent for a site visit</Text>
      </TouchableOpacity>

      {/* Submit */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Tender</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
  },
  label: { fontWeight: '600', marginTop: 16, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  uploadBtn: {
    marginTop: 10,
    backgroundColor: '#1E88E5',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  uploadText: { color: '#fff', fontWeight: 'bold' },
  imageRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  previewImg: {
    width: 70,
    height: 70,
    borderRadius: 6,
    marginRight: 8,
    marginTop: 6,
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  checkboxText: { color: '#333' },
  submitBtn: {
    backgroundColor: '#43A047',
    marginVertical: 30,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});