import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Card } from '../../components/common';

export default function PrescriptionUploadScreen({ navigation }) {
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    // Mock file pick
    setFile({ name: 'prescription_jan2025.jpg', size: '1.2 MB' });
  };

  const handleSubmit = () => {
    Alert.alert('Prescription Uploaded', 'Your prescription has been submitted. Pharmacies will check availability.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header title="Upload Prescription" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <Ionicons name="document-text" size={32} color={Colors.accent} />
          <Text style={styles.infoTitle}>Why upload a prescription?</Text>
          <Text style={styles.infoDesc}>
            Some medicines require a valid prescription. Upload yours to check availability and place an order.
          </Text>
        </View>

        {/* Upload zone */}
        <TouchableOpacity style={styles.uploadZone} onPress={handleUpload} activeOpacity={0.7}>
          <Ionicons name={file ? 'document-attach' : 'cloud-upload'} size={48}
            color={file ? Colors.success : Colors.accent} />
          <Text style={styles.uploadText}>
            {file ? file.name : 'Tap to upload prescription'}
          </Text>
          {file && <Text style={styles.fileSize}>{file.size}</Text>}
          {!file && <Text style={styles.uploadHint}>JPG, PNG or PDF • Max 5MB</Text>}
        </TouchableOpacity>

        {file && (
          <TouchableOpacity onPress={() => setFile(null)} style={styles.removeBtn}>
            <Ionicons name="trash" size={18} color={Colors.error} />
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        )}

        {/* Camera option */}
        <Card title="Or use camera" style={{ marginTop: Spacing.lg }}>
          <TouchableOpacity style={styles.cameraBtn} onPress={handleUpload}>
            <Ionicons name="camera" size={24} color={Colors.accent} />
            <Text style={styles.cameraText}>Take Photo of Prescription</Text>
          </TouchableOpacity>
        </Card>

        {/* Guidelines */}
        <Card title="Upload Guidelines" style={{ marginTop: Spacing.md }}>
          {[
            'Ensure the prescription is clearly visible',
            'Include doctor name and date',
            'Prescription should be less than 6 months old',
            'All medicine names must be legible',
          ].map((g, i) => (
            <View key={i} style={styles.guideRow}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={styles.guideText}>{g}</Text>
            </View>
          ))}
        </Card>

        <Button label="Submit Prescription" onPress={handleSubmit} disabled={!file}
          style={{ marginTop: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  content: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.lg, paddingBottom: 60 },
  infoBox: {
    backgroundColor: Colors.accent + '10', borderRadius: Radius.lg, padding: Spacing.xl,
    alignItems: 'center', marginBottom: Spacing.lg,
  },
  infoTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginTop: Spacing.sm },
  infoDesc: { fontSize: FontSizes.md, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xs, lineHeight: 22 },
  uploadZone: {
    borderWidth: 2, borderColor: Colors.accent, borderStyle: 'dashed', borderRadius: Radius.lg,
    padding: Spacing.xl, alignItems: 'center', backgroundColor: Colors.surface,
  },
  uploadText: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary, marginTop: Spacing.sm },
  uploadHint: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 4 },
  fileSize: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 4 },
  removeBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, justifyContent: 'center', marginTop: Spacing.md },
  removeText: { fontSize: FontSizes.md, color: Colors.error },
  cameraBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.sm },
  cameraText: { fontSize: FontSizes.md, color: Colors.accent, fontWeight: FontWeights.medium },
  guideRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 4 },
  guideText: { flex: 1, fontSize: FontSizes.md, color: Colors.textSecondary },
});
