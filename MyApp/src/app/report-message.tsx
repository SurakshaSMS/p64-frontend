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

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

type ReportReason = 'scam' | 'safe';

export default function ReportMessageScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    sender?: string;
    body?: string;
    action?: string;
  }>();

  const [reason, setReason] = useState<ReportReason>(
    params.action === 'safe' ? 'safe' : 'scam'
  );

  const [notes, setNotes] = useState('');
  const [showSafeModal, setShowSafeModal] =
    useState(params.action === 'safe');

  const mockMarkAsScam = () => {
    console.log('Mock AI feedback:', {
      messageId: params.id,
      classification: 'unsafe',
      notes,
    });

    Alert.alert(
      'Report Submitted',
      'Thank you. Your feedback has been recorded for future AI detection.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const mockMarkAsSafe = () => {
    console.log('Mock AI feedback:', {
      messageId: params.id,
      classification: 'safe',
      notes,
    });

    setShowSafeModal(false);

    Alert.alert(
      'Marked as Safe',
      'Thank you. Your feedback has been recorded for future AI detection.',
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
      setShowSafeModal(true);
      return;
    }

    mockMarkAsScam();
  };

  const selectScam = () => {
    setReason('scam');
  };

  const selectSafe = () => {
    setReason('safe');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* BACK */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.flagCircle}>
            <Text style={styles.flag}>⚑</Text>
          </View>

          <Text style={styles.title}>
            Report Message
          </Text>

          <Text style={styles.subtitle}>
            Help us improve detection by reporting this message.
          </Text>
        </View>

        {/* REASON */}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            SELECT A REASON
          </Text>

          <TouchableOpacity
            style={[
              styles.option,
              reason === 'scam' && styles.scamSelected,
            ]}
            onPress={selectScam}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.optionIcon,
                styles.scamIcon,
              ]}
            >
              <Text style={styles.scamIconText}>!</Text>
            </View>

            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>
                Mark as Scam
              </Text>

              <Text style={styles.optionDescription}>
                This message looks fraudulent or malicious
              </Text>
            </View>

            <View
              style={[
                styles.radio,
                reason === 'scam' &&
                  styles.scamRadioSelected,
              ]}
            >
              {reason === 'scam' && (
                <View style={styles.radioInnerScam} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              reason === 'safe' && styles.safeSelected,
            ]}
            onPress={selectSafe}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.optionIcon,
                styles.safeIcon,
              ]}
            >
              <Text style={styles.safeIconText}>✓</Text>
            </View>

            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>
                Mark as Safe
              </Text>

              <Text style={styles.optionDescription}>
                This message is legitimate and safe
              </Text>
            </View>

            <View
              style={[
                styles.radio,
                reason === 'safe' &&
                  styles.safeRadioSelected,
              ]}
            >
              {reason === 'safe' && (
                <View style={styles.radioInnerSafe} />
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
            placeholderTextColor="#65729A"
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* MESSAGE INFORMATION */}

        <View style={styles.card}>
          <View style={styles.messageHeader}>
            <Text style={styles.cardTitle}>
              Message Being Reported
            </Text>

            <View style={styles.senderBadge}>
              <Text style={styles.senderBadgeText}>
                {params.sender || 'Unknown Sender'}
              </Text>
            </View>
          </View>

          <Text
            style={styles.reportedMessage}
            numberOfLines={4}
          >
            {params.body || 'Message content unavailable.'}
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
          <Text style={styles.submitText}>
            {reason === 'safe'
              ? 'Mark as Safe'
              : '⚑  Submit Report'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelText}>
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MARK AS SAFE MODAL */}

      <Modal
        visible={showSafeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSafeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.safeCircleOuter}>
              <View style={styles.safeCircle}>
                <Text style={styles.safeShield}>✓</Text>
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
              <Text style={styles.feedbackText}>
                ✓ Your feedback trains our AI to detect scams better.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={mockMarkAsSafe}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmText}>
                ✓  Confirm
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowSafeModal(false)}
            >
              <Text style={styles.modalCancelText}>
                ×  Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#07143D',
  },

  screen: {
    flex: 1,
    backgroundColor: '#07143D',
  },

  content: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
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
    color: '#FFFFFF',
    fontSize: 25,
  },

  header: {
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 25,
  },

  flagCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#32172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  flag: {
    color: '#FF405B',
    fontSize: 24,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },

  subtitle: {
    color: '#8491B3',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 7,
  },

  section: {
    marginBottom: 15,
  },

  sectionLabel: {
    color: '#7280A4',
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 8,
  },

  option: {
    minHeight: 65,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#263D76',
    backgroundColor: '#0D215A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
  },

  scamSelected: {
    borderColor: '#FF294D',
    backgroundColor: '#35142A',
  },

  safeSelected: {
    borderColor: '#13D67A',
    backgroundColor: '#0B3027',
  },

  optionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  scamIcon: {
    backgroundColor: '#451A2A',
  },

  safeIcon: {
    backgroundColor: '#0B3C2B',
  },

  scamIconText: {
    color: '#FF405B',
    fontWeight: '900',
  },

  safeIconText: {
    color: '#13D67A',
    fontWeight: '900',
  },

  optionTextContainer: {
    flex: 1,
  },

  optionTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  optionDescription: {
    color: '#7481A3',
    fontSize: 9,
    marginTop: 3,
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#60709A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scamRadioSelected: {
    borderColor: '#FF294D',
  },

  safeRadioSelected: {
    borderColor: '#13D67A',
  },

  radioInnerScam: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF294D',
  },

  radioInnerSafe: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#13D67A',
  },

  card: {
    backgroundColor: '#0D215A',
    borderWidth: 1,
    borderColor: '#263D76',
    borderRadius: 15,
    padding: 14,
    marginBottom: 14,
  },

  cardTitle: {
    color: '#AAB5D1',
    fontSize: 10,
    fontWeight: '700',
  },

  notesInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#263D76',
    borderRadius: 11,
    backgroundColor: '#091A49',
    color: '#FFFFFF',
    padding: 12,
    fontSize: 11,
    marginTop: 10,
  },

  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  senderBadge: {
    backgroundColor: '#5A4300',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: 140,
  },

  senderBadgeText: {
    color: '#FFCC33',
    fontSize: 8,
  },

  reportedMessage: {
    color: '#8D9ABC',
    fontSize: 10,
    lineHeight: 16,
    marginTop: 12,
  },

  submitButton: {
    minHeight: 52,
    borderRadius: 13,
    backgroundColor: '#E92F4F',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  submitSafeButton: {
    backgroundColor: '#13A95F',
  },

  submitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  cancelButton: {
    paddingVertical: 18,
  },

  cancelText: {
    color: '#7F8CAC',
    fontSize: 11,
    textAlign: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  modalCard: {
    width: '100%',
    maxWidth: 390,
    backgroundColor: '#0D215A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#13D67A',
    padding: 20,
    alignItems: 'center',
  },

  safeCircleOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#092C23',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#13D67A',
    marginBottom: 15,
  },

  safeCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0B5036',
    borderWidth: 2,
    borderColor: '#13D67A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  safeShield: {
    color: '#13D67A',
    fontSize: 23,
    fontWeight: '900',
  },

  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },

  modalDescription: {
    color: '#9AA7C7',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 9,
    marginBottom: 15,
    maxWidth: 290,
  },

  feedbackBox: {
    width: '100%',
    backgroundColor: '#082D21',
    borderWidth: 1,
    borderColor: '#13D67A',
    borderRadius: 11,
    padding: 12,
    marginBottom: 16,
  },

  feedbackText: {
    color: '#13D67A',
    fontSize: 10,
    textAlign: 'center',
  },

  confirmButton: {
    width: '100%',
    minHeight: 50,
    borderRadius: 11,
    backgroundColor: '#13A95F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  confirmText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  modalCancelButton: {
    width: '100%',
    minHeight: 45,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#263D76',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalCancelText: {
    color: '#8190B4',
    fontSize: 11,
  },
});