import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import CategoryCard from '../components/CategoryCard';
import PrimaryButton from '../components/PrimaryButton';
import { SPACING } from '../styles/theme';

const categories = ['Interior','Construction','Painting','Flooring','False Ceiling','Architects'];

export default function ClientHome({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Find services near you</Text>

      <View style={styles.grid}>
        {categories.map((cat) => (
          <View key={cat} style={styles.gridItem}>
            <CategoryCard
              title={cat}
              onPress={() => navigation.navigate('PostTender', { category: cat })}
            />
          </View>
        ))}
      </View>

      <View style={{ marginTop: SPACING?.l ?? 24 }} />
      <PrimaryButton onPress={() => navigation.navigate('RoleSelect')}>
        Post a Tender
      </PrimaryButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFF' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
});
