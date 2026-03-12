import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Colors, FontSizes, FontWeights, Spacing } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n';
import { chat as aiChat, analyzeImage } from '../../services/aiService';
import {
  createChatSession,
  saveChatMessage,
  updateSessionTitle,
  saveVlmScan,
} from '../../services/historyService';

const FALLBACK_REPLY =
  "I'm sorry, I couldn't reach the AI service right now. Please check your connection and try again.";

let _msgId = 1;
const makeMsg = (role, text, image) => ({
  id: String(_msgId++), role, text, image: image || null, ts: new Date(),
});

export default function AIChatScreen({ navigation, route }) {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();
  const greetingText = `Hi${profile?.full_name ? ' ' + profile.full_name.split(' ')[0] : ''}! I'm your CareLink health assistant.\n\nYou can type a question, tap 🖼️ to upload a photo, or tap 📷 to take one.`;

  const [messages, setMessages] = useState([makeMsg('assistant', greetingText)]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const titleSetRef = useRef(false);
  const listRef = useRef(null);

  // Camera
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [capturing, setCapturing] = useState(false);

  // ── Session setup ──
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

  // ── Text message ──
  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || thinking) return;
    setInput('');

    const userMsg = makeMsg('user', trimmed);
    setMessages(prev => [...prev, userMsg]);
    setThinking(true);

    if (sessionId && profile?.id) {
      saveChatMessage(sessionId, profile.id, 'user', trimmed).catch(() => {});
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
      setMessages(prev => [...prev, makeMsg('assistant', replyText)]);

      if (sessionId && profile?.id) {
        saveChatMessage(sessionId, profile.id, 'assistant', replyText, {
          model: data.model_name,
          context_used: data.context_used,
        }).catch(() => {});
      }
    } catch (err) {
      console.warn('[AIChat] API error:', err.message);
      const isTimeout = err.message === 'Aborted' || err.message?.includes('timeout') || err.message?.includes('timed out');
      const errReply = isTimeout
        ? 'The AI is still warming up or taking longer than usual. Please wait a moment and try again.'
        : FALLBACK_REPLY;
      setMessages(prev => [...prev, makeMsg('assistant', errReply)]);
    } finally {
      setThinking(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [input, thinking, messages, sessionId, profile?.id]);

  // ── Camera capture & VLM analysis ──
  const handleCameraOpen = useCallback(async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) return;
    }
    setCameraReady(false);
    setCameraOpen(true);
  }, [permission]);

  const handleCapture = useCallback(async () => {
    if (capturing) return;
    if (!cameraRef.current) {
      console.warn('[VLM] cameraRef is null — camera not ready');
      return;
    }
    if (!cameraReady) {
      console.warn('[VLM] camera not ready yet');
      return;
    }
    setCapturing(true);
    try {
      console.log('[VLM] Taking picture...');
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      console.log('[VLM] Photo captured:', photo?.uri ? 'URI ok' : 'URI missing');
      if (!photo?.uri) {
        console.warn('[VLM] No photo URI returned');
        return;
      }

      // Close camera AFTER we have the URI
      setCameraOpen(false);

      // Show the photo as a user message immediately
      const userMsg = makeMsg('user', '📷 Photo sent for analysis', photo.uri);
      setMessages(prev => [...prev, userMsg]);
      setThinking(true);

      if (sessionId && profile?.id) {
        saveChatMessage(sessionId, profile.id, 'user', '[Photo for VLM analysis]').catch(() => {});
        if (!titleSetRef.current) {
          titleSetRef.current = true;
          updateSessionTitle(sessionId, 'Photo analysis').catch(() => {});
        }
      }

      const question = 'Analyze this medical image. Identify any visible conditions, abnormalities, or areas of concern. For each finding, indicate its severity.';
      console.log('[VLM] Calling analyzeImage API...');
      const data = await analyzeImage({ imageUri: photo.uri, question, language: 'en' });
      console.log('[VLM] API response received');
      const replyText = data.analysis || FALLBACK_REPLY;
      setMessages(prev => [...prev, makeMsg('assistant', replyText)]);

      if (sessionId && profile?.id) {
        saveChatMessage(sessionId, profile.id, 'assistant', replyText, {
          model: data.model_name, type: 'vlm',
        }).catch(() => {});
      }

      if (profile?.id) {
        saveVlmScan(profile.id, {
          localUri: photo.uri, question, analysis: data.analysis,
          modelName: data.model_name, modelReady: data.model_ready,
        }).catch(() => {});
      }
    } catch (err) {
      console.warn('[VLM] error:', err.message);
      const isTimeout = err.message === 'Aborted' || err.message?.includes('timeout') || err.message?.includes('timed out');
      const errMsg = isTimeout
        ? 'Image analysis is taking a long time — the AI model may be warming up. Please try again in a moment.'
        : err.message?.includes('Network')
          ? 'Network error — make sure the AI service is running and you are on the same Wi-Fi.'
          : 'Image analysis failed. Please try again.';
      setMessages(prev => [...prev, makeMsg('assistant', errMsg)]);
    } finally {
      setCapturing(false);
      setThinking(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [capturing, cameraReady, sessionId, profile?.id]);

  // ── Pick image from gallery ──
  const handlePickImage = useCallback(async () => {
    if (thinking) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (result.canceled || !result.assets?.length) return;

    const uri = result.assets[0].uri;
    const userMsg = makeMsg('user', '🖼️ Photo uploaded for analysis', uri);
    setMessages(prev => [...prev, userMsg]);
    setThinking(true);

    if (sessionId && profile?.id) {
      saveChatMessage(sessionId, profile.id, 'user', '[Uploaded photo for VLM analysis]').catch(() => {});
      if (!titleSetRef.current) {
        titleSetRef.current = true;
        updateSessionTitle(sessionId, 'Photo analysis').catch(() => {});
      }
    }

    try {
      const question = 'Analyze this medical image. Identify any visible conditions, abnormalities, or areas of concern. For each finding, indicate its severity.';
      const data = await analyzeImage({ imageUri: uri, question, language: 'en' });
      const replyText = data.analysis || FALLBACK_REPLY;
      setMessages(prev => [...prev, makeMsg('assistant', replyText)]);

      if (sessionId && profile?.id) {
        saveChatMessage(sessionId, profile.id, 'assistant', replyText, {
          model: data.model_name, type: 'vlm',
        }).catch(() => {});
      }
      if (profile?.id) {
        saveVlmScan(profile.id, {
          localUri: uri, question, analysis: data.analysis,
          modelName: data.model_name, modelReady: data.model_ready,
        }).catch(() => {});
      }
    } catch (err) {
      console.warn('[VLM-Gallery] error:', err.message);
      const isTimeout = err.message === 'Aborted' || err.message?.includes('timeout') || err.message?.includes('timed out');
      const errMsg = isTimeout
        ? 'Image analysis is taking a long time — the AI model may be warming up. Please try again in a moment.'
        : err.message?.includes('Network')
          ? 'Network error — make sure the AI service is running and you are on the same Wi-Fi.'
          : 'Image analysis failed. Please try again.';
      setMessages(prev => [...prev, makeMsg('assistant', errMsg)]);
    } finally {
      setThinking(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [thinking, sessionId, profile?.id, messages]);

  // ── Render helpers ──
  const formatTime = (d) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const renderItem = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.row, isUser && styles.rowUser]}>
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.msgImage} />
          )}
          <Text style={[styles.msgText, isUser && styles.msgTextUser]}>{item.text}</Text>
          <Text style={[styles.time, isUser && styles.timeUser]}>{formatTime(item.ts)}</Text>
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
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CareLink AI</Text>
        <View style={{ width: 26 }} />
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
            <View style={styles.row}>
              <View style={[styles.bubble, styles.bubbleAI, styles.typingBubble]}>
                <View style={styles.dots}>
                  <View style={[styles.dot, { opacity: 0.4 }]} />
                  <View style={[styles.dot, { opacity: 0.6 }]} />
                  <View style={[styles.dot, { opacity: 0.9 }]} />
                </View>
              </View>
            </View>
          ) : null
        }
      />

      {/* Input */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom || Spacing.sm }]}>
        <TouchableOpacity
          style={styles.camBtn}
          onPress={handlePickImage}
          disabled={thinking}
        >
          <Ionicons name="image" size={22} color={thinking ? '#ccc' : '#C4682A'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.camBtn}
          onPress={handleCameraOpen}
          disabled={thinking}
        >
          <Ionicons name="camera" size={22} color={thinking ? '#ccc' : '#C4682A'} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor={Colors.textMuted}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || thinking) && styles.sendBtnOff]}
          onPress={() => sendMessage()}
          disabled={!input.trim() || thinking}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Camera Overlay — absolute over the whole screen, avoids Modal ref issues on Android */}
      {cameraOpen && (
        <View style={[StyleSheet.absoluteFill, styles.cameraOverlay]}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing={facing}
            onCameraReady={() => setCameraReady(true)}
          />

          {/* Top bar */}
          <View style={[styles.cameraTopBar, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity
              onPress={() => { setCameraOpen(false); setCameraReady(false); }}
              style={styles.cameraCtrlBtn}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <View style={styles.cameraTopRight}>
              {!cameraReady && (
                <Text style={styles.cameraHint}>Initialising...</Text>
              )}
              <TouchableOpacity
                onPress={() => setFacing(f => (f === 'back' ? 'front' : 'back'))}
                style={styles.cameraCtrlBtn}
              >
                <Ionicons name="camera-reverse" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Shutter */}
          <View style={[styles.cameraBottom, { paddingBottom: insets.bottom + 24 }]}>
            <Text style={styles.cameraHintBottom}>Point at the affected area and tap to capture</Text>
            <TouchableOpacity
              style={[styles.shutter, !cameraReady && { opacity: 0.4 }]}
              onPress={handleCapture}
              disabled={!cameraReady || capturing}
            >
              {capturing
                ? <View style={[styles.shutterInner, { backgroundColor: '#E8843A' }]} />
                : <View style={styles.shutterInner} />
              }
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F4F0' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, height: 52,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.border,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: FontSizes.lg, fontWeight: FontWeights.semiBold, color: Colors.textPrimary,
  },

  // Messages
  list: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 6 },
  row: { flexDirection: 'row', marginBottom: 8 },
  rowUser: { justifyContent: 'flex-end' },

  bubble: {
    maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleAI: { backgroundColor: '#fff', borderTopLeftRadius: 4 },
  bubbleUser: { backgroundColor: '#C4682A', borderTopRightRadius: 4 },
  msgText: { fontSize: 15, lineHeight: 21, color: Colors.textPrimary },
  msgTextUser: { color: '#fff' },
  msgImage: { width: 200, height: 150, borderRadius: 12, marginBottom: 6 },
  time: { fontSize: 11, color: Colors.textMuted, marginTop: 4, alignSelf: 'flex-end' },
  timeUser: { color: 'rgba(255,255,255,0.6)' },

  // Typing indicator
  typingBubble: { paddingVertical: 14, paddingHorizontal: 20 },
  dots: { flexDirection: 'row', gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.textMuted },

  // Input bar
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    paddingHorizontal: 12, paddingTop: 8,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.border,
  },
  camBtn: {
    width: 42, height: 42, justifyContent: 'center', alignItems: 'center', marginBottom: 1,
  },
  input: {
    flex: 1, backgroundColor: '#F5F4F0', borderRadius: 22,
    paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 15, color: Colors.textPrimary, maxHeight: 100,
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: 21, marginBottom: 1,
    backgroundColor: '#C4682A', justifyContent: 'center', alignItems: 'center',
  },
  sendBtnOff: { backgroundColor: '#CCCCCC' },

  // Camera modal
  cameraOverlay: {
    backgroundColor: '#000',
    zIndex: 100,
  },
  cameraTopBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, zIndex: 10,
  },
  cameraTopRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cameraCtrlBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  cameraHint: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  cameraBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', gap: 16,
  },
  cameraHintBottom: {
    color: 'rgba(255,255,255,0.6)', fontSize: 13, textAlign: 'center', paddingHorizontal: 24,
  },
  shutter: {
    width: 72, height: 72, borderRadius: 36, borderWidth: 4, borderColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  shutterInner: {
    width: 58, height: 58, borderRadius: 29, backgroundColor: '#fff',
  },
});
