import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n';
import { chat as aiChat } from '../../services/aiService';
import {
  createChatSession,
  saveChatMessage,
  updateSessionTitle,
  getChatMessages,
} from '../../services/historyService';

const SUGGESTED = [
  'What are symptoms of diabetes?',
  'How do I lower blood pressure naturally?',
  'Is my medication safe during pregnancy?',
  'What does a high creatinine level mean?',
];

const FALLBACK_REPLY =
  "I'm sorry, I couldn't reach the AI service right now. Please check your connection and try again.";

let _msgId = 1;
const makeMsg = (role, text) => ({ id: String(_msgId++), role, text, ts: new Date() });

export default function AIChatScreen({ navigation, route }) {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const greetingText = `Hello${profile?.full_name ? ', ' + profile.full_name.split(' ')[0] : ''}! 👋 I'm your CareLink AI Health Assistant. How can I help you today?`;
  const [messages, setMessages] = useState([makeMsg('assistant', greetingText)]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const titleSetRef = useRef(false);
  const listRef = useRef(null);

  // Create a chat session on mount & persist the greeting
  useEffect(() => {
    if (!profile?.id) return;
    (async () => {
      try {
        const session = await createChatSession(profile.id, 'New conversation');
        if (session) {
          setSessionId(session.id);
          await saveChatMessage(session.id, profile.id, 'assistant', greetingText);
        }
      } catch (e) {
        console.warn('[AIChat] session create failed:', e.message);
      }
    })();
  }, [profile?.id]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || thinking) return;
    setInput('');

    const userMsg = makeMsg('user', trimmed);
    setMessages(prev => [...prev, userMsg]);
    setThinking(true);

    // Persist user message
    if (sessionId && profile?.id) {
      saveChatMessage(sessionId, profile.id, 'user', trimmed).catch(() => {});
      // Set session title from first user message
      if (!titleSetRef.current) {
        titleSetRef.current = true;
        updateSessionTitle(sessionId, trimmed.slice(0, 80)).catch(() => {});
      }
    }

    try {
      const history = messages.slice(1).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const data = await aiChat({
        message: trimmed,
        history,
        triageContext: route?.params?.triageContext || null,
        language: 'en',
      });

      const replyText = data.reply || FALLBACK_REPLY;
      const reply = makeMsg('assistant', replyText);
      setMessages(prev => [...prev, reply]);

      // Persist assistant reply
      if (sessionId && profile?.id) {
        saveChatMessage(sessionId, profile.id, 'assistant', replyText, {
          model: data.model_name,
          context_used: data.context_used,
        }).catch(() => {});
      }
    } catch (err) {
      console.warn('[AIChat] API error:', err.message);
      const reply = makeMsg('assistant', FALLBACK_REPLY);
      setMessages(prev => [...prev, reply]);
    } finally {
      setThinking(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [input, thinking, messages, sessionId, profile?.id]);

  const formatTime = (d) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const renderItem = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={14} color="#fff" />
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
          <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>{item.text}</Text>
          <Text style={[styles.bubbleTime, isUser && { color: 'rgba(255,255,255,0.6)' }]}>
            {formatTime(item.ts)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Ionicons name="sparkles" size={16} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>{t('ai.aiChat')}</Text>
            <Text style={styles.headerStatus}>● Online</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={m => m.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        ListFooterComponent={
          thinking ? (
            <View style={[styles.msgRow]}>
              <View style={styles.aiAvatar}>
                <Ionicons name="sparkles" size={14} color="#fff" />
              </View>
              <View style={[styles.bubble, styles.bubbleAI, styles.thinkingBubble]}>
                <ActivityIndicator size="small" color={Colors.accent} />
              </View>
            </View>
          ) : null
        }
      />

      {/* Suggestions (only when empty after first message) */}
      {messages.length === 1 && (
        <View style={styles.suggestions}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={SUGGESTED}
            keyExtractor={(_, i) => String(i)}
            contentContainerStyle={{ paddingHorizontal: Spacing.base, gap: Spacing.sm }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.suggChip} onPress={() => sendMessage(item)}>
                <Text style={styles.suggText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Input Bar */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + Spacing.sm }]}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about your health…"
          placeholderTextColor={Colors.textMuted}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={() => sendMessage()}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || thinking) && styles.sendBtnDisabled]}
          onPress={() => sendMessage()}
          disabled={!input.trim() || thinking}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  backBtn: { marginRight: Spacing.md, padding: 4 },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  headerAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: FontSizes.md, fontWeight: FontWeights.semiBold, color: Colors.textPrimary },
  headerStatus: { fontSize: FontSizes.xs, color: Colors.success, marginTop: 1 },
  list: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, flexGrow: 1 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: Spacing.md, gap: Spacing.sm },
  msgRowUser: { flexDirection: 'row-reverse' },
  aiAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  bubble: {
    maxWidth: '78%', borderRadius: Radius.lg, padding: Spacing.md,
  },
  bubbleAI: { backgroundColor: Colors.surface, borderBottomLeftRadius: 4 },
  bubbleUser: { backgroundColor: '#6C63FF', borderBottomRightRadius: 4 },
  bubbleText: { fontSize: FontSizes.md, color: Colors.textPrimary, lineHeight: 20 },
  bubbleTextUser: { color: '#fff' },
  bubbleTime: { fontSize: 10, color: Colors.textMuted, marginTop: 4, alignSelf: 'flex-end' },
  thinkingBubble: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  suggestions: { paddingVertical: Spacing.sm },
  suggChip: {
    backgroundColor: Colors.surface, borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  suggText: { fontSize: FontSizes.sm, color: Colors.accent },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm,
    paddingHorizontal: Spacing.base, paddingTop: Spacing.sm,
    borderTopWidth: 1, borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  input: {
    flex: 1, backgroundColor: Colors.bgPrimary, borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    fontSize: FontSizes.md, color: Colors.textPrimary,
    maxHeight: 100, borderWidth: 1, borderColor: Colors.border,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.textMuted },
});
