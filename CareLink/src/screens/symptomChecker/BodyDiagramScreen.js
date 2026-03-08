import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button } from '../../components/common';
import { useLanguage } from '../../i18n';

const { width } = Dimensions.get('window');

const bodyParts = [
  { id: 'head', label: 'Head', x: 0.5, y: 0.08 },
  { id: 'eyes', label: 'Eyes', x: 0.5, y: 0.12 },
  { id: 'throat', label: 'Throat', x: 0.5, y: 0.18 },
  { id: 'chest', label: 'Chest', x: 0.5, y: 0.28 },
  { id: 'stomach', label: 'Stomach', x: 0.5, y: 0.38 },
  { id: 'leftArm', label: 'Left Arm', x: 0.25, y: 0.32 },
  { id: 'rightArm', label: 'Right Arm', x: 0.75, y: 0.32 },
  { id: 'back', label: 'Back', x: 0.5, y: 0.45 },
  { id: 'hips', label: 'Hips', x: 0.5, y: 0.52 },
  { id: 'leftLeg', label: 'Left Leg', x: 0.38, y: 0.7 },
  { id: 'rightLeg', label: 'Right Leg', x: 0.62, y: 0.7 },
  { id: 'leftFoot', label: 'Left Foot', x: 0.38, y: 0.88 },
  { id: 'rightFoot', label: 'Right Foot', x: 0.62, y: 0.88 },
];

export default function BodyDiagramScreen({ navigation }) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState([]);
  const diagramH = 420;
  const diagramW = width - Spacing.base * 2;

  const togglePart = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  return (
    <View style={styles.container}>
      <Header title={t('symptomChecker.bodyDiagram')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.instr}>Tap on the areas where you feel discomfort</Text>

        <View style={[styles.diagram, { height: diagramH, width: diagramW }]}>
          {/* Body silhouette placeholder */}
          <View style={styles.silhouette}>
            <Ionicons name="body" size={280} color={Colors.border} />
          </View>
          {bodyParts.map(part => (
            <TouchableOpacity key={part.id}
              style={[
                styles.hotspot,
                { left: part.x * diagramW - 20, top: part.y * diagramH - 12 },
                selected.includes(part.id) && styles.hotspotSelected,
              ]}
              onPress={() => togglePart(part.id)}>
              <Text style={[styles.hotspotLabel, selected.includes(part.id) && styles.hotspotLabelSelected]}>
                {part.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selected.length > 0 && (
          <View style={styles.selectedBox}>
            <Text style={styles.selectedTitle}>Selected Areas ({selected.length})</Text>
            <View style={styles.chipRow}>
              {selected.map(id => {
                const part = bodyParts.find(p => p.id === id);
                return (
                  <TouchableOpacity key={id} style={styles.chip} onPress={() => togglePart(id)}>
                    <Text style={styles.chipText}>{part?.label}</Text>
                    <Ionicons name="close-circle" size={16} color={Colors.accent} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <Button label={`Continue${selected.length > 0 ? ` (${selected.length} selected)` : ''}`}
          onPress={() => navigation.navigate('SymptomInput', { bodyParts: selected })}
          disabled={selected.length === 0} style={{ marginTop: Spacing.lg }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  instr: { fontSize: FontSizes.md, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.md },
  diagram: { position: 'relative', backgroundColor: Colors.surface, borderRadius: Radius.lg, overflow: 'hidden', alignSelf: 'center' },
  silhouette: { position: 'absolute', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  hotspot: {
    position: 'absolute', paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm,
    backgroundColor: Colors.bgSecondary, borderWidth: 1, borderColor: Colors.border,
  },
  hotspotSelected: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  hotspotLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, fontWeight: FontWeights.medium },
  hotspotLabelSelected: { color: Colors.white },
  selectedBox: { marginTop: Spacing.lg },
  selectedTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.accent + '15',
    borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
  },
  chipText: { fontSize: FontSizes.sm, color: Colors.accent, fontWeight: FontWeights.medium },
});
