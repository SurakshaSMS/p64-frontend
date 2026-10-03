import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import { getMessageById } from '@/data/dummyMessages';

import {
  formatMessageTime,
  getRiskBackground,
  getRiskColor,
  getRiskLevel,
} from '@/utils/messageRisk';

export default function MessageDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const message = id
    ? getMessageById(id)
    : undefined;

  if (!message) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>
            Message not found
          </Text>

          <TouchableOpacity
            style={styles.backToMessages}
            onPress={() => router.back()}
          >
            <Text style={styles.backToMessagesText}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const risk = getRiskLevel(message);
  const riskColor = getRiskColor(risk);
  const riskBackground = getRiskBackground(risk);

  const isHighRisk = risk === 'High Risk';
  const isMediumRisk = risk === 'Medium Risk';
  const isSafe = risk === 'Safe';

  const title = isHighRisk
    ? 'High Risk Message'
    : isMediumRisk
      ? 'Medium Risk'
      : 'Message Looks Safe';

  const description = isHighRisk
    ? 'This message contains strong indicators of a possible SMS scam. Avoid interacting with suspicious links or requests.'
    : isMediumRisk
      ? 'This message contains some suspicious characteristics. Review it carefully before taking action.'
      : 'No significant scam indicators were detected in this message.';

  const statusIcon = isSafe ? '✓' : '!';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Message Details
          </Text>

          <View style={styles.headerSpace} />
        </View>

        <View style={styles.statusArea}>
          <View
            style={[
              styles.statusCircle,
              {
                borderColor: riskColor,
                backgroundColor: riskBackground,
              },
            ]}
          >
            <Text
              style={[
                styles.statusIcon,
                { color: riskColor },
              ]}
            >
              {statusIcon}
            </Text>
          </View>

          <Text
            style={[
              styles.statusTitle,
              { color: riskColor },
            ]}
          >
            {title}
          </Text>

          <Text style={styles.statusDescription}>
            {description}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.senderRow}>
            <View style={styles.senderDetails}>
              <Text style={styles.sender}>
                {message.sender}
              </Text>

              <Text style={styles.time}>
                {formatMessageTime(message.date)}
              </Text>
            </View>

            <View
              style={[
                styles.badge,
                {
                  borderColor: riskColor,
                  backgroundColor: riskBackground,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: riskColor },
                ]}
              >
                {risk}
              </Text>
            </View>
          </View>

          <Text style={styles.messageText}>
            {message.body}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.scoreRow}>
            <Text style={styles.sectionTitle}>
              Risk Score
            </Text>

            <Text
              style={[
                styles.score,
                { color: riskColor },
              ]}
            >
              {message.mlResult.dangerScore}/100
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(
                    Math.max(
                      message.mlResult.dangerScore,
                      0
                    ),
                    100
                  )}%`,
                  backgroundColor: riskColor,
                },
              ]}
            />
          </View>

          <View style={styles.confidenceRow}>
            <Text style={styles.confidenceLabel}>
              AI Confidence
            </Text>

            <Text style={styles.confidenceValue}>
              {Math.round(
                message.mlResult.confidence * 100
              )}%
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            AI Classification
          </Text>

          <View style={styles.classificationRow}>
            <Text style={styles.classificationLabel}>
              Classification
            </Text>

            <Text
              style={[
                styles.classificationValue,
                { color: riskColor },
              ]}
            >
              {message.mlResult.label.toUpperCase()}
            </Text>
          </View>

          <ProbabilityRow
            title="Normal"
            value={message.mlResult.probabilities.normal}
          />

          <ProbabilityRow
            title="Promo"
            value={message.mlResult.probabilities.promo}
          />

          <ProbabilityRow
            title="Smish"
            value={message.mlResult.probabilities.smish}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Analysis
          </Text>

          {isHighRisk && (
            <>
              <Text style={styles.point}>
                • The AI model classified this message as smishing.
              </Text>

              <Text style={styles.point}>
                • The message has a high danger score.
              </Text>

              <Text style={styles.point}>
                • Avoid opening suspicious links or sharing personal information.
              </Text>
            </>
          )}

          {isMediumRisk && (
            <>
              <Text style={styles.point}>
                • The AI model classified this message as promotional.
              </Text>

              <Text style={styles.point}>
                • Review the sender and message carefully.
              </Text>

              <Text style={styles.point}>
                • Avoid interacting with links if you do not recognise the sender.
              </Text>
            </>
          )}

          {isSafe && (
            <>
              <Text style={styles.safePoint}>
                ✓ The AI model classified this message as normal.
              </Text>

              <Text style={styles.safePoint}>
                ✓ The message has a low danger score.
              </Text>

              <Text style={styles.safePoint}>
                ✓ No significant scam classification was detected.
              </Text>
            </>
          )}
        </View>

        {!isSafe && (
          <TouchableOpacity style={styles.reportButton}>
            <Text style={styles.reportText}>
              Report Scam
            </Text>
          </TouchableOpacity>
        )}

        {!isSafe && (
          <TouchableOpacity
            style={[
              styles.safeButton,
              { borderColor: riskColor },
            ]}
          >
            <Text
              style={[
                styles.safeButtonText,
                { color: riskColor },
              ]}
            >
              Mark as Safe
            </Text>
          </TouchableOpacity>
        )}

        {isSafe && (
          <View style={styles.safeNotice}>
            <Text style={styles.safeNoticeTitle}>
              You're protected
            </Text>

            <Text style={styles.safeNoticeText}>
              Suraksha SMS will continue analysing messages for suspicious activity.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProbabilityRow({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  const percentage = Math.round(value * 100);

  return (
    <View style={styles.probabilityRow}>
      <Text style={styles.probabilityTitle}>
        {title}
      </Text>

      <View style={styles.probabilityTrack}>
        <View
          style={[
            styles.probabilityFill,
            { width: `${percentage}%` },
          ]}
        />
      </View>

      <Text style={styles.probabilityValue}>
        {percentage}%
      </Text>
    </View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 35,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#10265D',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backText: {
    color: '#FFFFFF',
    fontSize: 25,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  headerSpace: {
    width: 36,
  },

  statusArea: {
    alignItems: 'center',
    marginVertical: 28,
  },

  statusCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusIcon: {
    fontSize: 31,
    fontWeight: '800',
  },

  statusTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 13,
  },

  statusDescription: {
    color: '#8D9ABC',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 7,
    paddingHorizontal: 15,
  },

  card: {
    backgroundColor: '#0D215A',
    borderWidth: 1,
    borderColor: '#2B437A',
    borderRadius: 18,
    padding: 15,
    marginBottom: 14,
  },

  senderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  senderDetails: {
    flex: 1,
    marginRight: 12,
  },

  sender: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  time: {
    color: '#7F8CAC',
    fontSize: 10,
    marginTop: 3,
  },

  badge: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  badgeText: {
    fontSize: 9,
    fontWeight: '700',
  },

  messageText: {
    color: '#B6C0DA',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 15,
  },

  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  score: {
    fontSize: 13,
    fontWeight: '800',
  },

  progressTrack: {
    height: 7,
    borderRadius: 10,
    backgroundColor: '#182748',
    overflow: 'hidden',
    marginTop: 14,
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
  },

  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 13,
  },

  confidenceLabel: {
    color: '#8D9ABC',
    fontSize: 10,
  },

  confidenceValue: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

  classificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 14,
  },

  classificationLabel: {
    color: '#8D9ABC',
    fontSize: 11,
  },

  classificationValue: {
    fontSize: 11,
    fontWeight: '800',
  },

  probabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  probabilityTitle: {
    color: '#9BA8C7',
    fontSize: 10,
    width: 55,
  },

  probabilityTrack: {
    flex: 1,
    height: 5,
    backgroundColor: '#182748',
    borderRadius: 10,
    overflow: 'hidden',
  },

  probabilityFill: {
    height: '100%',
    backgroundColor: '#7950F2',
    borderRadius: 10,
  },

  probabilityValue: {
    color: '#B6C0DA',
    width: 40,
    textAlign: 'right',
    fontSize: 10,
  },

  point: {
    color: '#9BA8C7',
    fontSize: 11,
    lineHeight: 18,
    marginTop: 9,
  },

  safePoint: {
    color: '#9BCDB8',
    fontSize: 11,
    lineHeight: 18,
    marginTop: 9,
  },

  reportButton: {
    minHeight: 50,
    backgroundColor: '#A4232F',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 11,
  },

  reportText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  safeButton: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  safeButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },

  safeNotice: {
    backgroundColor: '#0B3027',
    borderWidth: 1,
    borderColor: '#146B4A',
    borderRadius: 16,
    padding: 15,
  },

  safeNoticeTitle: {
    color: '#13D67A',
    fontSize: 13,
    fontWeight: '700',
  },

  safeNoticeText: {
    color: '#8EB7A8',
    fontSize: 10,
    lineHeight: 16,
    marginTop: 6,
  },

  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  notFoundTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },

  backToMessages: {
    backgroundColor: '#7047EB',
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 12,
  },

  backToMessagesText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});