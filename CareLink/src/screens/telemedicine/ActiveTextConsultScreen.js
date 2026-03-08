import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSizes, FontWeights, Spacing, Radius } from '../../theme';
import { Header } from '../../components/common';
import { useLanguage } from '../../i18n';

const INITIAL_MESSAGES = [
  { id: '1', text: 'Hello! How can I help you today?', sender: 'doctor', time: '10:00 AM' },
  { id: '2', text: 'Hi doctor, I have been having persistent headaches for the past 3 days.', sender: 'patient', time: '10:01 AM' },
  { id: '3', text: 'I see. Can you describe the type of headache? Is it throbbing, dull, or sharp?', sender: 'doctor', time: '10:02 AM' },
];

export default function ActiveTextConsultScreen({ navigation, route }) {
  const { t } = useLanguage();
  const doctor = route?.params?.doctor || {};
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: String(messages.length + 1),
      text: input.trim(),
      sender: 'patient',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMsg]);
    setInput('');
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  const renderMessage = ({ item }) => {
    const isDoctor = item.sender === 'doctor';
    return (
      <View style={[styles.msgRow, isDoctor ? styles.msgLeft : styles.msgRight]}>
        <View style={[styles.bubble, isDoctor ? styles.bubbleDoctor : styles.bubblePatient]}>
          <Text style={[styles.msgText, isDoctor ? styles.msgTextDoctor : styles.msgTextPatient]}>{item.text}</Text>
          <Text style={[styles.msgTime, isDoctor && { color: Colors.textMuted }]}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('telemedicine.textConsult')}
        subtitle={doctor.name || 'Dr. Priya Sharma'}
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('PostConsultSummary', { doctor })}>
            <Ionicons name="close-circle-outline" size={24} color={Colors.error} />
          </TouchableOpacity>
        }
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />
        <View style={[styles.inputBar, { paddingBottom: insets.bottom || Spacing.md }]}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="attach" size={22} color={Colors.textMuted} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="mic-outline" size={22} color={Colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
            <Ionicons name="send" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  chatList: { padding: Spacing.base, paddingBottom: Spacing.md },
  msgRow: { marginBottom: Spacing.md },
  msgLeft: { alignItems: 'flex-start' },
  msgRight: { alignItems: 'flex-end' },
  bubble: { maxWidth: '80%', padding: Spacing.md, borderRadius: Radius.lg },
  bubbleDoctor: { backgroundColor: Colors.surface, borderBottomLeftRadius: 4 },
  bubblePatient: { backgroundColor: Colors.accent, borderBottomRightRadius: 4 },
  msgText: { fontSize: FontSizes.md, lineHeight: 20 },
  msgTextDoctor: { color: Colors.textPrimary },
  msgTextPatient: { color: Colors.white },
  msgTime: { fontSize: FontSizes.xs, color: 'rgba(255,255,255,0.7)', marginTop: 4, alignSelf: 'flex-end' },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  attachBtn: { padding: Spacing.sm },
  input: {
    flex: 1, fontSize: FontSizes.md, color: Colors.textPrimary,
    maxHeight: 100, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.sm,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center', marginLeft: Spacing.xs,
  },
});
