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

import { dummyMessages } from '@/data/dummyMessages';

import {
  formatMessageTime,
  getRiskBackground,
  getRiskColor,
  getRiskLevel,
} from '@/utils/messageRisk';

export default function MessageDetailScreen() {
  const params = useLocalSearchParams<{
    id?: string;
  }>();

  const message = dummyMessages.find(
    (item) => item.id === params.id
  );

  if (!message) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>
            Message not found
          </Text>

          <TouchableOpacity
            style={styles.backHomeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backHomeText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const risk = getRiskLevel(message);
  const riskColor = getRiskColor(risk);
  const riskBackground = getRiskBackground(risk);

  const dangerScore = Math.min(
    Math.max(message.mlResult.dangerScore, 0),
    100
  );

  const isHighRisk = risk === 'High Risk';
  const isMediumRisk = risk === 'Medium Risk';
  const isSafe = risk === 'Safe';

  const description = isHighRisk
    ? 'This message contains strong scam indicators. Avoid clicking links or sharing personal information.'
    : isMediumRisk
      ? 'This message contains some suspicious characteristics. Review it carefully before taking action.'
      : 'No significant scam indicators were detected in this message.';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

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

        {/* RISK STATUS */}

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
              {isSafe ? '✓' : '!'}
            </Text>
          </View>

          <Text
            style={[
              styles.statusTitle,
              { color: riskColor },
            ]}
          >
            {risk}
          </Text>

          <Text style={styles.statusDescription}>
            {description}
          </Text>
        </View>

        {/* MESSAGE */}

        <View style={styles.card}>
          <View style={styles.senderRow}>
            <View style={styles.senderInfo}>
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
                  backgroundColor: riskBackground,
                  borderColor: riskColor,
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

        {/* RISK SCORE */}

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
              {dangerScore}/100
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${dangerScore}%`,
                  backgroundColor: riskColor,
                },
              ]}
            />
          </View>

          <Text style={styles.confidence}>
            AI Confidence:{' '}
            {Math.round(message.mlResult.confidence * 100)}%
          </Text>
        </View>

        {/* AI ANALYSIS */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            AI Analysis
          </Text>

          <Text style={styles.analysisLabel}>
            Classification
          </Text>

          <Text
            style={[
              styles.analysisValue,
              { color: riskColor },
            ]}
          >
            {message.mlResult.label.toUpperCase()}
          </Text>

          {message.mlResult.cleanedText ? (
            <>
              <Text style={styles.analysisLabel}>
                Analysed Text
              </Text>

              <Text style={styles.analysisText}>
                {message.mlResult.cleanedText}
              </Text>
            </>
          ) : null}
        </View>

        {/* PROBABILITIES */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Detection Probability
          </Text>

          <ProbabilityRow
            label="Normal"
            value={message.mlResult.probabilities.normal}
          />

          <ProbabilityRow
            label="Promotional"
            value={message.mlResult.probabilities.promo}
          />

          <ProbabilityRow
            label="Smishing"
            value={message.mlResult.probabilities.smish}
          />
        </View>

        {/* FEEDBACK BUTTONS */}

        <TouchableOpacity
          style={styles.reportButton}
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: '/report-message',
              params: {
                id: message.id,
                sender: message.sender,
                body: message.body,
                action: 'scam',
              },
            })
          }
        >
          <Text style={styles.reportText}>
            Report Scam
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.safeButton}
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: '/report-message',
              params: {
                id: message.id,
                sender: message.sender,
                body: message.body,
                action: 'safe',
              },
            })
          }
        >
          <Text style={styles.safeText}>
            Mark as Safe
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProbabilityRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const percentage =
    value <= 1
      ? Math.round(value * 100)
      : Math.round(value);

  return (
    <View style={styles.probabilityRow}>
      <Text style={styles.probabilityLabel}>
        {label}
      </Text>

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
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
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
    fontWeight: '900',
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

  senderInfo: {
    flex: 1,
    marginRight: 10,
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

  confidence: {
    color: '#7F8CAC',
    fontSize: 10,
    marginTop: 9,
  },

  analysisLabel: {
    color: '#7F8CAC',
    fontSize: 10,
    marginTop: 14,
  },

  analysisValue: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },

  analysisText: {
    color: '#B6C0DA',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  probabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  probabilityLabel: {
    color: '#9BA8C7',
    fontSize: 11,
  },

  probabilityValue: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
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
    borderColor: '#13D67A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  safeText: {
    color: '#13D67A',
    fontSize: 13,
    fontWeight: '700',
  },

  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  notFoundTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
  },

  backHomeButton: {
    backgroundColor: '#7047EB',
    borderRadius: 12,
    paddingHorizontal: 25,
    paddingVertical: 13,
  },

  backHomeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});