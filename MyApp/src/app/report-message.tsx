import React, { useState } from 'react';

import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';

type ReportReason = 'scam' | 'safe';

export default function ReportMessageScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    sender?: string;
    body?: string;
  }>();

  const [reason, setReason] = useState<ReportReason>('scam');
  const [notes, setNotes] = useState('');
  const [safeModalVisible, setSafeModalVisible] = useState(false);

  const sender = params.sender ?? 'Unknown Number';
  const messageBody =
    params.body ?? 'Message information unavailable.';

  // MOCK FUNCTION
  // Later this can be connected to the AI/backend.
  const mockMarkAsScam = () => {
    console.log('Mock AI feedback:', {
      messageId: params.id,
      classification: 'unsafe',
      notes,
    });

    Alert.alert(
      'Report Submitted',
      'This message has been marked as a scam.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  // MOCK FUNCTION
  // Later this can be connected to the AI/backend.
  const mockMarkAsSafe = () => {
    console.log('Mock AI feedback:', {
      messageId: params.id,
      classification: 'safe',
      notes,
    });

    setSafeModalVisible(false);

    Alert.alert(
      'Marked as Safe',
      'Thank you. Your feedback has been recorded.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleSubmit = () => {
    if (reason === 'safe') {
      setSafeModalVisible(true);
      return;
    }

    mockMarkAsScam();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* BACK BUTTON */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.flag}>⚑</Text>

            <Text style={styles.title}>
              Report Message
            </Text>

            <Text style={styles.subtitle}>
              Help us improve detection by reporting this message.
            </Text>
          </View>

          {/* REASON CARD */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              SELECT A REASON
            </Text>

            {/* SCAM */}
            <TouchableOpacity
              style={[
                styles.option,
                reason === 'scam' && styles.scamSelected,
              ]}
              onPress={() => setReason('scam')}
              activeOpacity={0.85}
            >
              <View style={styles.optionLeft}>
                <View
                  style={[
                    styles.optionIcon,
                    reason === 'scam' && styles.scamIcon,
                  ]}
                >
                  <Text style={styles.scamSymbol}>!</Text>
                </View>

                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>
                    Mark as Scam
                  </Text>

                  <Text style={styles.optionDescription}>
                    This message looks fraudulent or malicious
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.radio,
                  reason === 'scam' && styles.radioScam,
                ]}
              >
                {reason === 'scam' && (
                  <View style={styles.radioDotScam} />
                )}
              </View>
            </TouchableOpacity>

            {/* SAFE */}
            <TouchableOpacity
              style={[
                styles.option,
                reason === 'safe' && styles.safeSelected,
              ]}
              onPress={() => setReason('safe')}
              activeOpacity={0.85}
            >
              <View style={styles.optionLeft}>
                <View
                  style={[
                    styles.optionIcon,
                    reason === 'safe' && styles.safeIcon,
                  ]}
                >
                  <Text style={styles.safeSymbol}>✓</Text>
                </View>

                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>
                    Mark as Safe
                  </Text>

                  <Text style={styles.optionDescription}>
                    This message is legitimate and safe
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.radio,
                  reason === 'safe' && styles.radioSafe,
                ]}
              >
                {reason === 'safe' && (
                  <View style={styles.radioDotSafe} />
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* NOTES */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Additional Notes (Optional)
            </Text>

            <TextInput
              style={styles.notesInput}
              placeholder="Add more context about this message..."
              placeholderTextColor="#63739C"
              multiline
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          {/* MESSAGE */}
          <View style={styles.card}>
            <View style={styles.messageHeader}>
              <Text style={styles.cardTitle}>
                Message Being Reported
              </Text>

              <View style={styles.senderBadge}>
                <Text style={styles.senderBadgeText}>
                  {sender}
                </Text>
              </View>
            </View>

            <Text
              style={styles.reportedMessage}
              numberOfLines={3}
            >
              "{messageBody}"
            </Text>
          </View>

          {/* SUBMIT */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              reason === 'safe' && styles.submitSafeButton,
            ]}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.submitIcon}>
              {reason === 'scam' ? '⚑' : '✓'}
            </Text>

            <Text style={styles.submitText}>
              {reason === 'scam'
                ? 'Submit Report'
                : 'Mark as Safe'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
          >
            <Text style={styles.cancelText}>
              Cancel
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* MARK SAFE MODAL */}
        <Modal
          visible={safeModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setSafeModalVisible(false)
          }
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.safeCircleOuter}>
                <View style={styles.safeCircle}>
                  <Text style={styles.safeCircleIcon}>
                    ⛨
                  </Text>
                </View>
              </View>

              <Text style={styles.modalTitle}>
                Mark as Safe?
              </Text>

              <Text style={styles.modalDescription}>
                Are you sure this message is safe? This will
                help improve future detection.
              </Text>

              <View style={styles.feedbackBox}>
                <Text style={styles.feedbackIcon}>
                  ✓
                </Text>

                <Text style={styles.feedbackText}>
                  Your feedback trains our AI to detect scams
                  better.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={mockMarkAsSafe}
              >
                <Text style={styles.confirmIcon}>
                  ⛨
                </Text>

                <Text style={styles.confirmText}>
                  Confirm
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() =>
                  setSafeModalVisible(false)
                }
              >
                <Text style={styles.modalCancelText}>
                  ×  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#06133D',
  },

  screen: {
    flex: 1,
    backgroundColor: '#06133D',
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 35,
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#10265D',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backText: {
    color: '#AAB7DA',
    fontSize: 25,
  },

  header: {
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 25,
  },

  flag: {
    color: '#FF345D',
    fontSize: 30,
    marginBottom: 10,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },

  subtitle: {
    color: '#8290B4',
    fontSize: 11,
    marginTop: 7,
    textAlign: 'center',
  },

  section: {
    width: '100%',
    marginBottom: 18,
  },

  sectionLabel: {
    color: '#7E8CAD',
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 8,
  },

  option: {
    minHeight: 66,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#263D78',
    backgroundColor: '#10245B',
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 9,
  },

  scamSelected: {
    borderColor: '#FF174E',
    backgroundColor: '#310E2A',
  },

  safeSelected: {
    borderColor: '#12D96D',
    backgroundColor: '#092E28',
  },

  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  optionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#172D66',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  scamIcon: {
    backgroundColor: '#4B1025',
  },

  safeIcon: {
    backgroundColor: '#0B452F',
  },

  scamSymbol: {
    color: '#FF345D',
    fontSize: 16,
    fontWeight: '900',
  },

  safeSymbol: {
    color: '#13D67A',
    fontSize: 16,
    fontWeight: '900',
  },

  optionText: {
    flex: 1,
  },

  optionTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  optionDescription: {
    color: '#7F8CAC',
    fontSize: 9,
    marginTop: 3,
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#53638B',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  radioScam: {
    borderColor: '#FF345D',
  },

  radioSafe: {
    borderColor: '#13D67A',
  },

  radioDotScam: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF345D',
  },

  radioDotSafe: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#13D67A',
  },

  card: {
    backgroundColor: '#10245B',
    borderWidth: 1,
    borderColor: '#263D78',
    borderRadius: 15,
    padding: 14,
    marginBottom: 18,
  },

  cardTitle: {
    color: '#C8D1EB',
    fontSize: 10,
    fontWeight: '700',
  },

  notesInput: {
    minHeight: 90,
    backgroundColor: '#0C1D4C',
    borderWidth: 1,
    borderColor: '#263D78',
    borderRadius: 10,
    marginTop: 10,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 11,
  },

  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  senderBadge: {
    backgroundColor: '#5A4600',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: 130,
  },

  senderBadgeText: {
    color: '#FFD22E',
    fontSize: 8,
    fontWeight: '700',
  },

  reportedMessage: {
    color: '#8492B5',
    fontSize: 10,
    lineHeight: 16,
    marginTop: 12,
  },

  submitButton: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    backgroundColor: '#EC174C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  submitSafeButton: {
    backgroundColor: '#0AB85A',
  },

  submitIcon: {
    color: '#FFFFFF',
    fontSize: 14,
  },

  submitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  cancelText: {
    color: '#8290B4',
    textAlign: 'center',
    fontSize: 11,
    marginTop: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#10245B',
    borderWidth: 1,
    borderColor: '#00B65C',
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
  },

  safeCircleOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#073923',
    borderWidth: 1,
    borderColor: '#0CB85C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  safeCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#0A683B',
    borderWidth: 2,
    borderColor: '#13D67A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  safeCircleIcon: {
    color: '#FFFFFF',
    fontSize: 24,
  },

  modalTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
  },

  modalDescription: {
    color: '#98A6C8',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 9,
    maxWidth: 270,
  },

  feedbackBox: {
    width: '100%',
    backgroundColor: '#062D25',
    borderWidth: 1,
    borderColor: '#13B966',
    borderRadius: 11,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 20,
  },

  feedbackIcon: {
    color: '#13D67A',
    fontSize: 13,
    marginRight: 8,
  },

  feedbackText: {
    flex: 1,
    color: '#55D995',
    fontSize: 9,
    lineHeight: 14,
  },

  confirmButton: {
    width: '100%',
    height: 49,
    borderRadius: 11,
    backgroundColor: '#0AB85A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginBottom: 10,
  },

  confirmIcon: {
    color: '#FFFFFF',
    fontSize: 13,
  },

  confirmText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  modalCancelButton: {
    width: '100%',
    height: 45,
    borderRadius: 11,
    backgroundColor: '#0C1D4C',
    borderWidth: 1,
    borderColor: '#263D78',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalCancelText: {
    color: '#8996B7',
    fontSize: 11,
  },
});