// src/ui/construction/ConstructionWizard.jsx
import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import StepOverview from "./steps/StepOverview";
import StepStructure from "./steps/StepStructure";
import StepMaterials from "./steps/StepMaterial"; // NOTE: corrected filename
import StepFinal from "./steps/StepFinal";
import ReviewSubmit from "./steps/ReviewSubmit";

const steps = [
  { id: "overview", title: "Project Overview" },
  { id: "structure", title: "Structure & Civil" },
  { id: "materials", title: "Materials & Finishes" },
  { id: "final", title: "Final & Uploads" },
  { id: "review", title: "Review & Submit" },
];

export default function ConstructionWizard() {
  const [stepIndex, setStepIndex] = useState(0);

  // combined form state
  const [data, setData] = useState({
    // Step 1
    projectType: "",
    constructionType: "",
    builtUpArea: "",
    floors: 1,
    location: "",
    plotType: "",
    siteAccess: "",
    startDate: "",
    endDate: "",
    // Step 2
    scope: "",
    foundationType: "",
    structureType: "",
    roofType: "",
    wallType: "",
    plasteringRequired: "",
    compoundWallLength: "",
    waterproofingAreas: [],
    // Step 3
    cementGrade: "",
    steelType: "",
    brickType: "",
    sandType: "",
    aggregateType: "",
    rccMix: "",
    plasterMaterial: "",
    flooringLevel: "",
    flooringTypeMain: "",
    flooringTypeToilet: "",
    wallTilesKitchen: false,
    paintingInterior: "",
    paintingExterior: "",
    falseCeilingArea: "",
    doorsWindowsMaterial: "",
    mainDoorType: "",
    hardwareQuality: "",
    // Step 4
    electricalScope: "",
    plumbingType: "",
    sanitaryPreference: "",
    waterStorage: "",
    drainage: "",
    specialWorks: [],
    // Uploads
    files: [],
    notes: "",
  });

  function update(patch) {
    setData((d) => ({ ...d, ...patch }));
  }

  function next() {
    setStepIndex((i) => Math.min(steps.length - 1, i + 1));
  }
  function prev() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  const renderStepComponent = () => {
    const commonProps = { data, update, next, prev };
    switch (stepIndex) {
      case 0:
        return <StepOverview {...commonProps} />;
      case 1:
        return <StepStructure {...commonProps} />;
      case 2:
        return <StepMaterials {...commonProps} />;
      case 3:
        return <StepFinal {...commonProps} />;
      case 4:
        return <ReviewSubmit {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      {/* Stepper */}
      <View style={styles.stepperWrap}>
        {steps.map((s, i) => {
          const active = i === stepIndex;
          const done = i < stepIndex;
          return (
            <View key={s.id} style={styles.stepItem}>
              <View style={[styles.circle, done ? styles.circleDone : active ? styles.circleActive : styles.circleInactive]}>
                <Text style={[styles.circleText, done ? styles.circleTextDone : styles.circleTextInactive]}>
                  {i + 1}
                </Text>
              </View>
              <Text style={[styles.stepTitle, active && styles.stepTitleActive]}>
                {s.title}
              </Text>
              {i < steps.length - 1 && <View style={styles.stepDivider} />}
            </View>
          );
        })}
      </View>

      {/* Current step */}
      <View style={styles.container}>{renderStepComponent()}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: 16, backgroundColor: "#FAFBFF", flexGrow: 1 },
  stepperWrap: {
    marginBottom: 12,
    // horizontal real-estate: use wrap to allow multi-row on small screens
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  stepItem: { flexDirection: "row", alignItems: "center", marginRight: 8 },
  circle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  circleActive: { backgroundColor: "#4f46e5" },
  circleDone: { backgroundColor: "#10b981" },
  circleInactive: { backgroundColor: "#E6E9EE" },
  circleText: { fontWeight: "700" },
  circleTextDone: { color: "#fff" },
  circleTextInactive: { color: "#374151" },
  stepTitle: { fontSize: 12, color: "#6b7280", marginRight: 6 },
  stepTitleActive: { color: "#111827", fontWeight: "700" },
  stepDivider: { width: 12, height: 1, backgroundColor: "#E6E9EE", marginLeft: 6 },
  container: { backgroundColor: "#fff", borderRadius: 8, padding: 12, elevation: 2, marginTop: 8 },
});
