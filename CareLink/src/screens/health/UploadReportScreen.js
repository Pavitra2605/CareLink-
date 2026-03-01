import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button, Input } from '../../components/common';

export default function UploadReportScreen({ navigation }) {
  const [reportType, setReportType] = useState(null);
  const [labName, setLabName] = useState('');
  const [testDate, setTestDate] = useState('');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState([]);

  const reportTypes = ['Blood Test', 'Imaging / Scan', 'Urine Test', 'Pathology', 'Other'];

  const handlePickFile = () => {
    // Mock file pick
    setFiles(prev => [...prev, { name: `Report_${prev.length + 1}.pdf`, size: '2.4 MB', type: 'pdf' }]);
  };

  return (
    <View style={styles.container}>
      <Header title="Upload Report" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Upload Area */}
        <TouchableOpacity style={[styles.uploadZone, Shadows.soft]} onPress={handlePickFile}>
          <Ionicons name="cloud-upload" size={48} color={Colors.accent} />
          <Text style={styles.uploadTitle}>Upload Files</Text>
          <Text style={styles.uploadSub}>Tap to select PDF, JPEG, or PNG files{'\n'}Max 10 MB per file</Text>
        </TouchableOpacity>

        {/* Selected Files */}
        {files.length > 0 && (
          <View style={styles.fileList}>
            {files.map((f, i) => (
              <View key={i} style={[styles.fileItem, Shadows.soft]}>
                <Ionicons name="document" size={24} color={Colors.accent} />
                <View style={{ flex: 1, marginLeft: Spacing.md }}>
                  <Text style={styles.fileName}>{f.name}</Text>
                  <Text style={styles.fileSize}>{f.size}</Text>
                </View>
                <TouchableOpacity onPress={() => setFiles(prev => prev.filter((_, j) => j !== i))}>
                  <Ionicons name="close-circle" size={22} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Report Type */}
        <Text style={styles.label}>Report Type</Text>
        <View style={styles.chipRow}>
          {reportTypes.map(t => (
            <TouchableOpacity key={t}
              style={[styles.chip, reportType === t && styles.chipActive]}
              onPress={() => setReportType(t)}>
              <Text style={[styles.chipText, reportType === t && { color: Colors.white }]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input label="Lab / Hospital Name" value={labName} onChangeText={setLabName}
          placeholder="e.g. Apollo Diagnostics"
          leftIcon={<Ionicons name="business-outline" size={18} color={Colors.textMuted} />} />
        <Input label="Test Date" value={testDate} onChangeText={setTestDate}
          placeholder="DD/MM/YYYY"
          leftIcon={<Ionicons name="calendar-outline" size={18} color={Colors.textMuted} />} />
        <Input label="Notes (Optional)" value={notes} onChangeText={setNotes}
          placeholder="Any additional notes..."
          multiline numberOfLines={3}
          leftIcon={<Ionicons name="create-outline" size={18} color={Colors.textMuted} />} />

        {/* Camera Option */}
        <TouchableOpacity style={[styles.cameraRow, Shadows.soft]} onPress={() => {}}>
          <Ionicons name="camera" size={24} color={Colors.amberMid} />
          <View style={{ flex: 1, marginLeft: Spacing.md }}>
            <Text style={styles.cameraTitle}>Scan with Camera</Text>
            <Text style={styles.cameraSub}>Take a photo of your report</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        <Button title="Upload Report" variant="primary" size="lg"
          disabled={files.length === 0 || !reportType}
          onPress={() => navigation.goBack()}
          style={{ marginTop: Spacing.lg }}
          icon={<Ionicons name="checkmark-circle" size={20} color={Colors.white} />} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  uploadZone: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.xxl,
    alignItems: 'center', borderWidth: 2, borderColor: Colors.accent, borderStyle: 'dashed',
    marginBottom: Spacing.lg,
  },
  uploadTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginTop: Spacing.md },
  uploadSub: { fontSize: FontSizes.sm, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.xs },
  fileList: { marginBottom: Spacing.lg },
  fileItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm,
  },
  fileName: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  fileSize: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
  label: {
    fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  chip: {
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, borderRadius: Radius.pill,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  cameraRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.lg, marginTop: Spacing.md,
  },
  cameraTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.medium, color: Colors.textPrimary },
  cameraSub: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 2 },
});
