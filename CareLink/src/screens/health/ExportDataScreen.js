import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, Button } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n';
import { getTestReports, getUserPrescriptions, getPatientConsultations } from '../../services/careService';

export default function ExportDataScreen({ navigation }) {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [format, setFormat] = useState('pdf');
  const [sections, setSections] = useState(['profile', 'medications', 'reports']);
  const [dateRange, setDateRange] = useState('All time');
  const [exporting, setExporting] = useState(false);

  const formats = [
    { key: 'pdf', label: 'PDF', icon: 'document-text', desc: 'Best for sharing with doctors' },
    { key: 'csv', label: 'CSV', icon: 'grid', desc: 'Spreadsheet format' },
    { key: 'json', label: 'JSON', icon: 'code-slash', desc: 'For digital systems' },
  ];

  const dataOptions = [
    { key: 'profile', label: 'Personal Profile', icon: 'person' },
    { key: 'vitals', label: 'Vitals & Trends (Mocked)', icon: 'pulse' },
    { key: 'medications', label: 'Medications (Prescriptions)', icon: 'medkit' },
    { key: 'reports', label: 'Test Reports', icon: 'document-text' },
    { key: 'consultations', label: 'Consultations', icon: 'videocam' },
  ];

  const dateRanges = ['Last 3 months', 'Last 6 months', 'Last year', 'All time'];

  const toggleSection = (key) => {
    setSections(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      
      let fetchedReports = [];
      let fetchedPrescriptions = [];
      let fetchedConsultations = [];

      // Fetch Real Data
      if (profile?.id) {
        if (sections.includes('reports')) {
          fetchedReports = await getTestReports(profile.id);
        }
        if (sections.includes('medications')) {
          fetchedPrescriptions = await getUserPrescriptions(profile.id);
        }
        if (sections.includes('consultations')) {
          fetchedConsultations = await getPatientConsultations(profile.id);
        }
      }

      const exportData = {
        generatedAt: new Date().toISOString(),
        patient: profile,
        includedSections: sections,
        dateRange,
        vitals: sections.includes('vitals') ? [{ type: 'Blood Pressure', value: '120/80', date: new Date().toISOString() }] : [],
        reports: fetchedReports,
        medications: fetchedPrescriptions,
        consultations: fetchedConsultations
      };

      if (format === 'json') {
        const fileUri = FileSystem.documentDirectory + 'CareLink_Export.json';
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(exportData, null, 2));
        await Sharing.shareAsync(fileUri);
      } else if (format === 'csv') {
        const csvContent = `Section,Details\nProfile,${profile?.full_name || 'N/A'}\nSections,${sections.join('; ')}\n`;
        const fileUri = FileSystem.documentDirectory + 'CareLink_Export.csv';
        await FileSystem.writeAsStringAsync(fileUri, csvContent);
        await Sharing.shareAsync(fileUri);
      } else {
        // Build detailed HTML for PDF
        let reportsHtml = '';
        if (sections.includes('reports')) {
          reportsHtml = `
            <div class="section">
              <div class="section-title">Test Reports</div>
              ${fetchedReports.length > 0 ? Object.values(fetchedReports).map(r => `
                <div class="item">
                  <div class="item-header">${r.name || 'Unnamed Report'} - ${r.report_type || 'Unknown Type'}</div>
                  <div class="item-detail">Lab/Hospital: ${r.lab_name || 'N/A'}</div>
                  <div class="item-detail">Date: ${r.test_date ? new Date(r.test_date).toLocaleDateString() : 'N/A'}</div>
                  <div class="item-detail">Status: ${r.status || 'Normal'}</div>
                </div>
              `).join('') : '<div class="item">No test reports found.</div>'}
            </div>
          `;
        }

        let medsHtml = '';
        if (sections.includes('medications')) {
          medsHtml = `
            <div class="section">
              <div class="section-title">Medications & Prescriptions</div>
              ${fetchedPrescriptions.length > 0 ? Object.values(fetchedPrescriptions).map(m => `
                <div class="item">
                  <div class="item-header">${m.title || 'Prescription Upload'}</div>
                  <div class="item-detail">Doctor: ${m.doctor_name || 'N/A'} | Hospital: ${m.hospital_name || 'N/A'}</div>
                  <div class="item-detail">Date: ${m.prescription_date ? new Date(m.prescription_date).toLocaleDateString() : 'N/A'}</div>
                  <div class="item-detail">Tags: ${(m.tags || []).join(', ') || 'None'}</div>
                  ${m.notes ? `<div class="item-detail">Notes: ${m.notes}</div>` : ''}
                </div>
              `).join('') : '<div class="item">No prescriptions found.</div>'}
            </div>
          `;
        }

        let consultsHtml = '';
        if (sections.includes('consultations')) {
          consultsHtml = `
            <div class="section">
              <div class="section-title">Consultation History</div>
              ${fetchedConsultations.length > 0 ? Object.values(fetchedConsultations).map(c => `
                <div class="item">
                  <div class="item-header">Consultation with ${c.doctor?.full_name || 'Unknown Doctor'}</div>
                  <div class="item-detail">Mode: ${c.appointment?.mode || 'N/A'} | Fee: ₹${c.doctor?.consultation_fee || '0'}</div>
                  <div class="item-detail">Status: ${c.status || 'N/A'}</div>
                  <div class="item-detail">Booked on: ${new Date(c.created_at).toLocaleDateString()}</div>
                </div>
              `).join('') : '<div class="item">No consultation history found.</div>'}
            </div>
          `;
        }

        let vitalsHtml = '';
        if (sections.includes('vitals')) {
          vitalsHtml = `
            <div class="section">
              <div class="section-title">Vitals & Trends (Recent)</div>
              <div class="item">
                <div class="item-header">Blood Pressure</div>
                <div class="item-detail">Reading: 120/80 mmHg (Normal)</div>
                <div class="item-detail">Recorded: ${new Date().toLocaleDateString()}</div>
              </div>
            </div>
          `;
        }

        const html = `
          <html>
            <head>
              <style>
                body { font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
                .header-container { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #5B5A9E; padding-bottom: 15px; margin-bottom: 30px; }
                h1 { color: #5B5A9E; margin: 0; font-size: 28px; }
                .meta-box { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 40px; }
                .meta-row { display: flex; margin-bottom: 8px; }
                .meta-label { font-weight: 600; width: 140px; color: #475569; }
                .meta-value { color: #0f172a; font-weight: 500; }
                .section { margin-top: 30px; page-break-inside: avoid; }
                .section-title { font-size: 18px; font-weight: bold; background: #EEEDF8; color: #4338ca; padding: 12px 15px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid #5B5A9E; }
                .item { margin-bottom: 15px; padding: 15px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
                .item-header { font-weight: bold; font-size: 16px; color: #0f172a; margin-bottom: 6px; }
                .item-detail { font-size: 14px; color: #64748b; margin-top: 4px; }
                .footer { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 15px; page-break-inside: avoid; }
              </style>
            </head>
            <body>
              <div class="header-container">
                <div>
                  <h1>CareLink Health Report</h1>
                  <div style="color: #64748b; margin-top: 5px;">Comprehensive Patient Medical Record</div>
                </div>
                <div style="text-align: right; color: #64748b; font-size: 14px;">
                  Generated: <br/><b>${new Date().toLocaleString()}</b>
                </div>
              </div>
              
              <div class="meta-box">
                <div class="meta-row">
                  <div class="meta-label">Patient Name:</div>
                  <div class="meta-value">${profile?.full_name || 'Not specified'}</div>
                </div>
                <div class="meta-row">
                  <div class="meta-label">Patient ID:</div>
                  <div class="meta-value">${profile?.id ? profile.id.split('-')[0].toUpperCase() : 'N/A'}</div>
                </div>
                <div class="meta-row">
                  <div class="meta-label">Requested Range:</div>
                  <div class="meta-value">${dateRange}</div>
                </div>
              </div>

              ${vitalsHtml}
              ${medsHtml}
              ${reportsHtml}
              ${consultsHtml}
              
              <div class="footer">
                This report was dynamically generated securely on your device using CareLink App.<br/>
                For official medical purposes, please consult with your registered practitioner.<br/>
                &copy; ${new Date().getFullYear()} CareLink platform networks.
              </div>
            </body>
          </html>
        `;

        const { uri } = await Print.printToFileAsync({ html, width: 612, height: 792 });
        await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Export Failed', 'An error occurred while exporting data: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={t('health.exportData')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Format Selection */}
        <Text style={styles.sectionTitle}>Export Format</Text>
        <View style={styles.formatRow}>
          {formats.map(f => (
            <TouchableOpacity key={f.key}
              style={[styles.formatCard, format === f.key && styles.formatActive, Shadows.soft]}
              onPress={() => setFormat(f.key)}>
              <Ionicons name={f.icon} size={28}
                color={format === f.key ? Colors.white : Colors.accent} />
              <Text style={[styles.formatLabel, format === f.key && { color: Colors.white }]}>{f.label}</Text>
              <Text style={[styles.formatDesc, format === f.key && { color: Colors.white + 'CC' }]}>{f.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Data Selection */}
        <Text style={styles.sectionTitle}>Select Data</Text>
        {dataOptions.map(d => {
          const selected = sections.includes(d.key);
          return (
            <TouchableOpacity key={d.key} style={[styles.dataRow, Shadows.soft]}
              onPress={() => toggleSection(d.key)}>
              <View style={[styles.checkbox, selected && styles.checkboxChecked]}>
                {selected && <Ionicons name="checkmark" size={16} color={Colors.white} />}
              </View>
              <Ionicons name={d.icon} size={20} color={Colors.accent} style={{ marginRight: Spacing.md }} />
              <Text style={styles.dataLabel}>{d.label}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Date Range */}
        <Text style={styles.sectionTitle}>Date Range</Text>
        <View style={styles.dateRow}>
          {dateRanges.map((label, i) => (
            <TouchableOpacity key={i} onPress={() => setDateRange(label)} style={[styles.dateChip, dateRange === label && styles.dateActive]}>
              <Text style={[styles.dateText, dateRange === label && { color: Colors.white }]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {exporting ? (
           <View style={{ marginTop: Spacing.xl, alignItems: 'center' }}>
             <ActivityIndicator size="large" color={Colors.accent} />
             <Text style={{ marginTop: Spacing.md, color: Colors.accent }}>Generating Report...</Text>
           </View>
        ) : (
          <Button title="Generate & Export" variant="primary" size="lg"
            disabled={sections.length === 0}
            icon={<Ionicons name="download" size={18} color={Colors.white} />}
            onPress={handleExport} style={{ marginTop: Spacing.lg }} />
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginBottom: Spacing.md, marginTop: Spacing.sm },
  formatRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  formatCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  formatActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  formatLabel: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginTop: Spacing.sm },
  formatDesc: { fontSize: FontSizes.xs, color: Colors.textMuted, textAlign: 'center', marginTop: 4 },
  dataRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm,
  },
  checkbox: {
    width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  checkboxChecked: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  dataLabel: { flex: 1, fontSize: FontSizes.md, color: Colors.textPrimary },
  dateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  dateChip: {
    paddingVertical: 8, paddingHorizontal: Spacing.md, borderRadius: Radius.pill,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  dateActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  dateText: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.textSecondary },
});
