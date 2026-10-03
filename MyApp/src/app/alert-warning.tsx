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

type MessageParams = {
  id?: string;
  sender?: string;
  time?: string;
  text?: string;
  score?: string;
  risk?: string;
};

export default function AlertWarningScreen() {
  const params = useLocalSearchParams<MessageParams>();

  const sender = params.sender ?? 'Unknown Sender';
  const time = params.time ?? '';
  const messageText =
    params.text ?? 'No message content available.';

  const parsedScore = Number(params.score ?? 0);

  const score = Number.isFinite(parsedScore)
    ? Math.min(Math.max(parsedScore, 0), 100)
    : 0;

  const openFullDetails = () => {
    router.push({
      pathname: '/high-risk-detail',
      params: {
        id: params.id ?? '',
        sender,
        time,
        text: messageText,
        score: score.toString(),
        risk: 'High Risk',
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.warningArea}>
          <View style={styles.outerCircle}>
            <View style={styles.middleCircle}>
              <View style={styles.innerCircle}>
                <Text style={styles.warningIcon}>
                  ⚠
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.title}>
            High Risk Detected
          </Text>

          <View style={styles.criticalBadge}>
            <View style={styles.dot} />

            <Text style={styles.criticalText}>
              CRITICAL ALERT
            </Text>
          </View>
        </View>

        <View style={styles.warningCard}>
          <Text style={styles.warningHeading}>
            ⚠ Scam Warning
          </Text>

          <View style={styles.divider} />

          <Text style={styles.warningMessage}>
            This message may be a scam. Please proceed
            with caution and do not click any links or
            share personal information.
          </Text>
        </View>

        <View style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <View>
              <Text style={styles.senderName}>
                {sender}
              </Text>

              <Text style={styles.timeText}>
                {time}
              </Text>
            </View>

            <View style={styles.highBadge}>
              <Text style={styles.highBadgeText}>
                High Risk
              </Text>
            </View>
          </View>

          <Text style={styles.messageText}>
            {messageText}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>
              Risk Score
            </Text>

            <View style={styles.scoreBadge}>
              <Text style={styles.scoreBadgeText}>
                {score} / 100
              </Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${score}%`,
                },
              ]}
            />
          </View>

          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>
              0
            </Text>

            <Text style={styles.progressLabel}>
              Safe Zone · 50
            </Text>

            <Text style={styles.progressLabel}>
              100
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>
              ⚡ Detected Signals
            </Text>

            <View style={styles.flagsBadge}>
              <Text style={styles.flagsText}>
                3 Flags
              </Text>
            </View>
          </View>

          <Signal
            icon="🔗"
            title="Suspicious Link"
            description="Contains an unverified external URL"
          />

          <Signal
            icon="⚡"
            title="Urgent Language"
            description="Uses pressure tactics to force action"
          />

          <Signal
            icon="🏦"
            title="Suspicious Sender"
            description="Matches common scam message patterns"
          />
        </View>

        <TouchableOpacity
          style={styles.reportButton}
          activeOpacity={0.85}
        >
          <Text style={styles.reportText}>
            ⚑ Report Scam
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.detailsButton}
          activeOpacity={0.85}
          onPress={openFullDetails}
        >
          <Text style={styles.detailsText}>
            View Full Details
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Text style={styles.ignoreText}>
            × Ignore Warning
          </Text>
        </TouchableOpacity>

        <View style={styles.footerTip}>
          <Text style={styles.footerTipText}>
            💡 Never share OTPs, passwords, or bank details via SMS.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Signal({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.signalCard}>
      <View style={styles.signalIcon}>
        <Text>{icon}</Text>
      </View>

      <View style={styles.signalContent}>
        <Text style={styles.signalTitle}>
          {title}
        </Text>

        <Text style={styles.signalDescription}>
          {description}
        </Text>
      </View>

      <Text style={styles.infoIcon}>ⓘ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#05091F',
  },

  screen: {
    flex: 1,
    backgroundColor: '#05091F',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 35,
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#10235A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backText: {
    color: '#FFFFFF',
    fontSize: 25,
  },

  warningArea: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },

  outerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: '#D51D45',
    justifyContent: 'center',
    alignItems: 'center',
  },

  middleCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#3B0B1C',
    justifyContent: 'center',
    alignItems: 'center',
  },

  innerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E1264D',
    justifyContent: 'center',
    alignItems: 'center',
  },

  warningIcon: {
    color: '#FFFFFF',
    fontSize: 25,
  },

  title: {
    color: '#FF4A5D',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 17,
  },

  criticalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E52B56',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginTop: 7,
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FF2F68',
    marginRight: 5,
  },

  criticalText: {
    color: '#FF4B6F',
    fontSize: 8,
    fontWeight: '700',
  },

  warningCard: {
    backgroundColor: '#10245D',
    borderWidth: 1,
    borderColor: '#B21E42',
    borderRadius: 18,
    padding: 15,
    marginBottom: 14,
  },

  warningHeading: {
    color: '#FF4A5D',
    fontSize: 13,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#23376C',
    marginVertical: 13,
  },

  warningMessage: {
    color: '#B8C3DD',
    fontSize: 12,
    lineHeight: 18,
  },

  messageCard: {
    backgroundColor: '#10245D',
    borderWidth: 1,
    borderColor: '#1F397D',
    borderRadius: 18,
    padding: 15,
    marginBottom: 14,
  },

  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  senderName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  timeText: {
    color: '#7D8BAD',
    fontSize: 10,
    marginTop: 3,
  },

  highBadge: {
    backgroundColor: '#9E1834',
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  highBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },

  messageText: {
    color: '#B8C3DD',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 13,
  },

  card: {
    backgroundColor: '#10245D',
    borderWidth: 1,
    borderColor: '#1F397D',
    borderRadius: 18,
    padding: 15,
    marginBottom: 14,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    color: '#C2CBE2',
    fontSize: 12,
    fontWeight: '600',
  },

  scoreBadge: {
    backgroundColor: '#9E1834',
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  scoreBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

  progressTrack: {
    height: 6,
    borderRadius: 10,
    backgroundColor: '#182748',
    overflow: 'hidden',
    marginTop: 13,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#FF315C',
    borderRadius: 10,
  },

  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
  },

  progressLabel: {
    color: '#667499',
    fontSize: 8,
  },

  flagsBadge: {
    borderWidth: 1,
    borderColor: '#E1A800',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  flagsText: {
    color: '#FFC300',
    fontSize: 9,
  },

  signalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C1C4C',
    borderWidth: 1,
    borderColor: '#1F397D',
    borderRadius: 12,
    padding: 10,
    marginTop: 9,
  },

  signalIcon: {
    width: 31,
    height: 31,
    borderRadius: 9,
    backgroundColor: '#331125',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },

  signalContent: {
    flex: 1,
  },

  signalTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },

  signalDescription: {
    color: '#7080A6',
    fontSize: 8,
    marginTop: 2,
  },

  infoIcon: {
    color: '#7A89B0',
  },

  reportButton: {
    minHeight: 52,
    borderRadius: 13,
    backgroundColor: '#E32648',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  reportText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  detailsButton: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#315CD2',
    backgroundColor: '#10235B',
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  detailsText: {
    color: '#73B4FF',
    fontSize: 13,
    fontWeight: '600',
  },

  ignoreText: {
    textAlign: 'center',
    color: '#6F7B9C',
    fontSize: 11,
    marginVertical: 6,
  },

  footerTip: {
    backgroundColor: '#0F204E',
    borderWidth: 1,
    borderColor: '#253B76',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },

  footerTipText: {
    color: '#8C9BBC',
    fontSize: 10,
    textAlign: 'center',
  },
});