import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, Modal, ScrollView, Alert, Linking, RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { Header, SearchBar, Badge, Button } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { getUserPrescriptions, archiveUserPrescription } from '../../services/careService';

const TAG_COLORS = {
  diabetes:    { bg: '#FFF0E6', text: '#C4682A' },
  hypertension:{ bg: '#FDE8E8', text: '#D94F4F' },
  chronic:     { bg: '#EDE8F8', text: '#5B5A9E' },
  antibiotic:  { bg: '#E8F5EE', text: '#2E9E6B' },
  cardiac:     { bg: '#FDE8E8', text: '#D94F4F' },
  general:     { bg: '#F0EDE6', text: '#666666' },
};

const getTagStyle = (tag) =>
  TAG_COLORS[tag.toLowerCase()] || { bg: '#EDE8F8', text: '#5B5A9E' };

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function PrescriptionVaultScreen({ navigation }) {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchPrescriptions = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await getUserPrescriptions(user.id);
      setPrescriptions(data);
    } catch (err) {
      console.warn('[PrescriptionVault] fetch error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  // Re-fetch when navigating back to this screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchPrescriptions);
    return unsubscribe;
  }, [navigation, fetchPrescriptions]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPrescriptions();
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Archive Prescription',
      `Are you sure you want to archive "${item.title}"? You can restore it later.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await archiveUserPrescription(item.id);
              setPrescriptions(prev => prev.filter(p => p.id !== item.id));
              if (selectedPrescription?.id === item.id) setSelectedPrescription(null);
            } catch (err) {
              Alert.alert('Error', 'Failed to archive. Please try again.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleOpenImage = (item) => {
    if (item.image_url) {
      setSelectedPrescription(item);
      setImageModalVisible(true);
    }
  };

  const filtered = prescriptions.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.doctor_name?.toLowerCase().includes(q) ||
      p.hospital_name?.toLowerCase().includes(q) ||
      p.notes?.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q))
    );
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, Shadows.soft]}
      onPress={() => handleOpenImage(item)}
      activeOpacity={0.8}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailWrap}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.thumbnail} resizeMode="cover" />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Ionicons name="document-text" size={28} color={Colors.accent} />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>

        {item.doctor_name ? (
          <View style={styles.metaRow}>
            <Ionicons name="person-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.metaText}>{item.doctor_name}</Text>
          </View>
        ) : null}

        {item.hospital_name ? (
          <View style={styles.metaRow}>
            <Ionicons name="business-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.metaText}>{item.hospital_name}</Text>
          </View>
        ) : null}

        {item.prescription_date ? (
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.metaText}>{formatDate(item.prescription_date)}</Text>
          </View>
        ) : null}

        {/* Tags */}
        {item.tags?.length > 0 && (
          <View style={styles.tagRow}>
            {item.tags.slice(0, 3).map((tag, i) => {
              const ts = getTagStyle(tag);
              return (
                <View key={i} style={[styles.tag, { backgroundColor: ts.bg }]}>
                  <Text style={[styles.tagText, { color: ts.text }]}>{tag}</Text>
                </View>
              );
            })}
            {item.tags.length > 3 && (
              <Text style={styles.tagMore}>+{item.tags.length - 3}</Text>
            )}
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <Text style={styles.dateAdded}>{formatDate(item.created_at)}</Text>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={(e) => { e.stopPropagation(); handleDelete(item); }}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <Ionicons name="archive-outline" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Prescription Vault"
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('AddPrescription')}>
            <Ionicons name="add-circle" size={26} color={Colors.accent} />
          </TouchableOpacity>
        }
      />

      <View style={styles.searchWrap}>
        <SearchBar
          placeholder="Search by name, doctor, tag..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Stats Bar */}
      <View style={[styles.statsBar, Shadows.soft]}>
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{prescriptions.length}</Text>
          <Text style={styles.statLabel}>Stored</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNum}>
            {prescriptions.filter(p => p.image_url).length}
          </Text>
          <Text style={styles.statLabel}>With Image</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNum}>
            {prescriptions.filter(p => {
              const d = new Date(p.created_at);
              const now = new Date();
              return (now - d) < 30 * 24 * 60 * 60 * 1000;
            }).length}
          </Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading prescriptions...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.accent]}
              tintColor={Colors.accent}
            />
          }
          ListHeaderComponent={
            <Button
              title="Add New Prescription"
              variant="primary"
              size="md"
              icon={<Ionicons name="camera" size={18} color={Colors.white} />}
              onPress={() => navigation.navigate('AddPrescription')}
              style={{ marginBottom: Spacing.md }}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons name="document-text-outline" size={52} color={Colors.accent} />
              </View>
              <Text style={styles.emptyTitle}>No prescriptions stored</Text>
              <Text style={styles.emptySubtitle}>
                {search
                  ? 'No results match your search.'
                  : 'Tap "Add New Prescription" to photo-capture or upload your prescription.'}
              </Text>
            </View>
          }
        />
      )}

      {/* Image Preview Modal */}
      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, Shadows.medium]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {selectedPrescription?.title}
              </Text>
              <TouchableOpacity onPress={() => setImageModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Prescription Image */}
            {selectedPrescription?.image_url ? (
              <Image
                source={{ uri: selectedPrescription.image_url }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.noImageWrap}>
                <Ionicons name="document-text" size={64} color={Colors.accent} />
                <Text style={styles.noImageText}>No image available</Text>
              </View>
            )}

            {/* Details */}
            <ScrollView style={styles.modalDetails} showsVerticalScrollIndicator={false}>
              {selectedPrescription?.doctor_name ? (
                <View style={styles.detailRow}>
                  <Ionicons name="person-circle-outline" size={18} color={Colors.accent} />
                  <Text style={styles.detailText}>{selectedPrescription.doctor_name}</Text>
                </View>
              ) : null}
              {selectedPrescription?.hospital_name ? (
                <View style={styles.detailRow}>
                  <Ionicons name="business-outline" size={18} color={Colors.accent} />
                  <Text style={styles.detailText}>{selectedPrescription.hospital_name}</Text>
                </View>
              ) : null}
              {selectedPrescription?.prescription_date ? (
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={18} color={Colors.accent} />
                  <Text style={styles.detailText}>
                    {formatDate(selectedPrescription.prescription_date)}
                  </Text>
                </View>
              ) : null}
              {selectedPrescription?.notes ? (
                <View style={styles.notesBox}>
                  <Text style={styles.notesLabel}>Notes</Text>
                  <Text style={styles.notesText}>{selectedPrescription.notes}</Text>
                </View>
              ) : null}
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              {selectedPrescription?.image_url ? (
                <TouchableOpacity
                  style={styles.modalActionBtn}
                  onPress={() => Linking.openURL(selectedPrescription.image_url)}
                >
                  <Ionicons name="open-outline" size={18} color={Colors.accent} />
                  <Text style={styles.modalActionText}>Open Full</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={[styles.modalActionBtn, styles.deleteAction]}
                onPress={() => { setImageModalVisible(false); handleDelete(selectedPrescription); }}
              >
                <Ionicons name="archive-outline" size={18} color={Colors.error} />
                <Text style={[styles.modalActionText, { color: Colors.error }]}>Archive</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  searchWrap: { paddingHorizontal: Spacing.base, paddingTop: Spacing.md, paddingBottom: Spacing.sm },

  statsBar: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base, borderRadius: Radius.lg,
    paddingVertical: Spacing.md, marginBottom: Spacing.md,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.accent },
  statLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.border, marginVertical: Spacing.xs },

  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: Spacing.md },

  list: { paddingHorizontal: Spacing.base, paddingBottom: 40 },

  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    flexDirection: 'row', alignItems: 'center',
    marginBottom: Spacing.sm, overflow: 'hidden',
  },
  thumbnailWrap: { width: 76, height: 90 },
  thumbnail: { width: '100%', height: '100%' },
  thumbnailPlaceholder: {
    width: '100%', height: '100%',
    backgroundColor: Colors.accentMuted,
    justifyContent: 'center', alignItems: 'center',
  },

  cardContent: { flex: 1, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  cardTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginBottom: 3 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  metaText: { fontSize: FontSizes.xs, color: Colors.textMuted, flex: 1 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: Spacing.xs },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.pill },
  tagText: { fontSize: 10, fontWeight: FontWeights.semiBold },
  tagMore: { fontSize: 10, color: Colors.textMuted, alignSelf: 'center' },

  cardActions: { paddingRight: Spacing.md, alignItems: 'flex-end', gap: Spacing.sm },
  dateAdded: { fontSize: FontSizes.xs, color: Colors.textMuted, textAlign: 'right' },
  deleteBtn: { padding: 4 },

  // Empty state
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.accentMuted,
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg,
  },
  emptyTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  emptySubtitle: { fontSize: FontSizes.sm, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm, paddingHorizontal: Spacing.xl },

  // Image Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center', alignItems: 'center', padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.surface, borderRadius: Radius.xl,
    width: '100%', maxHeight: '85%', overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  modalTitle: { flex: 1, fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginRight: Spacing.sm },
  fullImage: { width: '100%', height: 280, backgroundColor: Colors.bgSecondary },
  noImageWrap: { height: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bgSecondary },
  noImageText: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: Spacing.sm },

  modalDetails: { maxHeight: 140, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  detailText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  notesBox: { backgroundColor: Colors.bgSecondary, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.md },
  notesLabel: { fontSize: FontSizes.xs, fontWeight: FontWeights.semiBold, color: Colors.textMuted, marginBottom: 4 },
  notesText: { fontSize: FontSizes.sm, color: Colors.textPrimary },

  modalActions: {
    flexDirection: 'row', justifyContent: 'flex-end',
    borderTopWidth: 1, borderTopColor: Colors.border,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.md,
  },
  modalActionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 6, paddingHorizontal: Spacing.md,
    borderRadius: Radius.md, backgroundColor: Colors.accentMuted,
  },
  deleteAction: { backgroundColor: '#FDE8E8' },
  modalActionText: { fontSize: FontSizes.sm, fontWeight: FontWeights.medium, color: Colors.accent },
});
