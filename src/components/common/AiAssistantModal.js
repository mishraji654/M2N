import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Animated,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PRESET_PROMPTS = [
  { id: '1', text: 'Best luxury palace in Jaipur', icon: 'sparkles' },
  { id: '2', text: 'Reserve dinner at Zaarang Lucknow', icon: 'restaurant' },
  { id: '3', text: 'Beach villa in Goa for weekend', icon: 'sunny' },
  { id: '4', text: 'Royal destination wedding cost', icon: 'heart' },
  { id: '5', text: 'Airport pickup & cab rates', icon: 'car' }
];

const KNOWLEDGE_BASE = {
  jaipur: {
    title: 'M2N Heritage Palace, Jaipur',
    reply: 'Our flagship M2N Heritage Palace in Jaipur features authentic Rajputana architecture, royal courtyards, private jharokhas, and heated marble plunge pools. Rates start from ₹18,500/night with complimentary royal high tea.',
    actionText: 'View Jaipur Palace',
    actionRoute: 'HotelsTab'
  },
  zaarang: {
    title: 'Hotel Zaarang & Dining, Lucknow',
    reply: 'Hotel Zaarang Lucknow hosts our award-winning Awadhi fine dining restaurant. Specialties include Galouti Kebabs, Dum Biryani, and Shahi Tukda. Table reservations are open for dinner from 7:00 PM.',
    actionText: 'Reserve Table',
    actionRoute: 'DiningTab'
  },
  goa: {
    title: 'M2N Coastal Haven Villa, Goa',
    reply: 'Located along South Goa white sands, M2N Coastal Haven Villa offers private infinity pool, sunset deck, personal chef, and oceanfront suites starting at ₹24,000/night.',
    actionText: 'Explore Goa Villa',
    actionRoute: 'HotelsTab'
  },
  wedding: {
    title: 'M2N Royal Wedding Venues',
    reply: 'M2N offers end-to-end bespoke destination weddings across Jaipur & Udaipur palaces. Includes 250+ royal suites, grand banquets, curated culinary spreads, and 24/7 hospitality coordinators.',
    actionText: 'Wedding Inquiry',
    actionRoute: 'WeddingsTab'
  },
  cab: {
    title: 'M2N Chauffeur & Airport Cabs',
    reply: 'Complimentary luxury sedan pickup is included with all Presidential Suites. Dedicated outstation and airport transfer fleet available 24/7 with sanitized AC vehicles and vetted chauffeurs.',
    actionText: 'Contact Concierge',
    actionRoute: 'MoreTab'
  },
  default: {
    title: 'M2N Luxury Hospitality',
    reply: 'Namaste! M2N Hotels combines timeless Indian heritage with five-star bespoke hospitality across Lucknow, Jaipur, Udaipur, Shimla, and Goa. How can I assist your stay or itinerary today?',
    actionText: 'Browse All Stays',
    actionRoute: 'HotelsTab'
  }
};

export default function AiAssistantModal({ visible, onClose, navigation }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Namaste! I am Myra, your personal M2N AI Concierge. Ask me anything about our royal palaces, dining at Zaarang, suite bookings, or recommendations.',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();

  const handleSend = (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const qLower = query.toLowerCase();
      let matched = KNOWLEDGE_BASE.default;

      if (qLower.includes('jaipur') || qLower.includes('palace') || qLower.includes('heritage')) {
        matched = KNOWLEDGE_BASE.jaipur;
      } else if (qLower.includes('zaarang') || qLower.includes('dining') || qLower.includes('restaurant') || qLower.includes('food') || qLower.includes('dinner')) {
        matched = KNOWLEDGE_BASE.zaarang;
      } else if (qLower.includes('goa') || qLower.includes('beach') || qLower.includes('villa')) {
        matched = KNOWLEDGE_BASE.goa;
      } else if (qLower.includes('wedding') || qLower.includes('marriage') || qLower.includes('banquet') || qLower.includes('event')) {
        matched = KNOWLEDGE_BASE.wedding;
      } else if (qLower.includes('cab') || qLower.includes('car') || qLower.includes('airport') || qLower.includes('pickup') || qLower.includes('driver')) {
        matched = KNOWLEDGE_BASE.cab;
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: matched.reply,
        actionText: matched.actionText,
        actionRoute: matched.actionRoute,
        time: 'Just now'
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleAction = (route) => {
    onClose();
    if (navigation && route) {
      navigation.navigate(route);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.aiBadgeIcon}>
                <Ionicons name="sparkles" size={18} color="#FFFFFF" />
              </View>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.headerTitle}>Ask Myra</Text>
                  <View style={styles.onlinePill}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.onlineText}>AI Active</Text>
                  </View>
                </View>
                <Text style={styles.headerSubtitle}>M2N Intelligent Travel Concierge</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}
              onPress={onClose}
              hitSlop={12}
            >
              <Ionicons name="close" size={20} color="#0F172A" />
            </Pressable>
          </View>

          {/* Quick Prompts Bar */}
          <View style={styles.promptBar}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.promptScroll}
            >
              {PRESET_PROMPTS.map((item) => (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.promptChip,
                    pressed && { backgroundColor: '#FFEDD5' }
                  ]}
                  onPress={() => handleSend(item.text)}
                >
                  <Ionicons name={item.icon} size={13} color="#EA580C" style={{ marginRight: 5 }} />
                  <Text style={styles.promptChipText}>{item.text}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Messages Scroll View */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatScroll}
            contentContainerStyle={styles.chatContent}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              return (
                <View
                  key={m.id}
                  style={[
                    styles.messageRow,
                    isAi ? styles.messageRowAi : styles.messageRowUser
                  ]}
                >
                  {isAi && (
                    <View style={styles.aiAvatar}>
                      <Ionicons name="sparkles" size={13} color="#EA580C" />
                    </View>
                  )}
                  <View
                    style={[
                      styles.bubble,
                      isAi ? styles.bubbleAi : styles.bubbleUser
                    ]}
                  >
                    <Text style={[styles.bubbleText, isAi ? styles.bubbleTextAi : styles.bubbleTextUser]}>
                      {m.text}
                    </Text>

                    {m.actionText && (
                      <Pressable
                        style={styles.actionBtn}
                        onPress={() => handleAction(m.actionRoute)}
                      >
                        <Text style={styles.actionBtnText}>{m.actionText}</Text>
                        <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
                      </Pressable>
                    )}

                    <Text style={[styles.bubbleTime, isAi ? styles.bubbleTimeAi : styles.bubbleTimeUser]}>
                      {m.time}
                    </Text>
                  </View>
                </View>
              );
            })}

            {isTyping && (
              <View style={[styles.messageRow, styles.messageRowAi]}>
                <View style={styles.aiAvatar}>
                  <Ionicons name="sparkles" size={13} color="#EA580C" />
                </View>
                <View style={[styles.bubble, styles.bubbleAi, { paddingVertical: 10 }]}>
                  <Text style={styles.typingText}>Myra is writing...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Bar */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask about Jaipur, Dining, Wedding..."
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSend()}
              returnKeyType="send"
            />
            <Pressable
              style={({ pressed }) => [
                styles.sendBtn,
                (!inputText.trim()) && styles.sendBtnDisabled,
                pressed && { opacity: 0.8 }
              ]}
              onPress={() => handleSend()}
              disabled={!inputText.trim()}
            >
              <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '82%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  aiBadgeIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3
  },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EA580C'
  },
  onlineText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EA580C'
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500'
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  promptBar: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  promptScroll: {
    paddingHorizontal: 16,
    gap: 8
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FED7AA'
  },
  promptChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A'
  },
  chatScroll: {
    flex: 1
  },
  chatContent: {
    padding: 16,
    gap: 14
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8
  },
  messageRowAi: {
    justifyContent: 'flex-start'
  },
  messageRowUser: {
    justifyContent: 'flex-end'
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FED7AA'
  },
  bubble: {
    maxWidth: '82%',
    padding: 14,
    borderRadius: 18
  },
  bubbleAi: {
    backgroundColor: '#F8FAFC',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  bubbleUser: {
    backgroundColor: '#EA580C',
    borderBottomRightRadius: 4
  },
  bubbleText: {
    fontSize: 13.5,
    lineHeight: 19
  },
  bubbleTextAi: {
    color: '#0F172A',
    fontWeight: '500'
  },
  bubbleTextUser: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  bubbleTime: {
    fontSize: 9.5,
    marginTop: 6
  },
  bubbleTimeAi: {
    color: '#94A3B8'
  },
  bubbleTimeUser: {
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'right'
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    marginTop: 10,
    alignSelf: 'flex-start',
    gap: 6
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  typingText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#64748B'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    gap: 10
  },
  textInput: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    fontSize: 13.5,
    color: '#0F172A'
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EA580C',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1'
  }
});
