import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DashboardHomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.logoBox}>
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color="#FFFFFF"
              />
            </View>

            <View>
              <Text style={styles.appName}>Suraksha SMS</Text>
              <Text style={styles.appSubtitle}>
                AI-Powered SMS Protection
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color="#AEB8D6"
            />

            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* PROTECTION STATUS */}
        <View style={styles.protectionCard}>
          <View style={styles.protectionTop}>
            <View style={styles.shieldGlow}>
              <View style={styles.shieldCircle}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={30}
                  color="#FFFFFF"
                />
              </View>
            </View>

            <View style={styles.protectionInfo}>
              <View style={styles.protectionTitleRow}>
                <Text style={styles.protectionTitle}>
                  You're Protected
                </Text>

                <View style={styles.activeBadge}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeText}>Active</Text>
                </View>
              </View>

              <Text style={styles.protectionDescription}>
                We're scanning your messages 24/7 to keep you safe
                from scams.
              </Text>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <View style={styles.statValueRow}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={13}
                      color="#8D98BD"
                    />
                    <Text style={styles.statValue}>218</Text>
                  </View>

                  <Text style={styles.statLabel}>
                    Messages Scanned
                  </Text>
                </View>

                <View style={styles.stat}>
                  <View style={styles.statValueRow}>
                    <Ionicons
                      name="ban-outline"
                      size={13}
                      color="#8D98BD"
                    />
                    <Text style={styles.statValue}>12</Text>
                  </View>

                  <Text style={styles.statLabel}>
                    Threats Blocked
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.quickActions}>
          <QuickAction
            icon="chatbubble-ellipses-outline"
            title="All Messages"
            background="#164EAA"
            onPress={() => router.push('/all-messages')}
          />

          <QuickAction
            icon="shield-outline"
            title="Alert History"
            background="#55209A"
            onPress={() => router.push('/alert-history')}
          />

          <QuickAction
            icon="settings-outline"
            title="Settings"
            background="#086A42"
            onPress={() => router.push('/settings/settings')}
          />
        </View>

        {/* RISK OVERVIEW */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Risk Overview</Text>
          <Text style={styles.cardSubtitle}>
            Your recent SMS risk activity
          </Text>

          <View style={styles.riskContent}>
            <View style={styles.riskCircleOuter}>
              <View style={styles.riskCircleMiddle}>
                <View style={styles.riskCircleInner}>
                  <Text style={styles.riskScore}>85</Text>
                  <Text style={styles.riskOutOf}>/100</Text>
                  <Text style={styles.riskLabel}>Risk Score</Text>
                </View>
              </View>
            </View>

            <View style={styles.legend}>
              <RiskLegend
                color="#FF3B5C"
                label="High Risk"
                value="5"
              />
              <RiskLegend
                color="#FFB800"
                label="Medium Risk"
                value="8"
              />
              <RiskLegend
                color="#22C55E"
                label="Safe"
                value="32"
              />
              <RiskLegend
                color="#3B82F6"
                label="Scanned"
                value="173"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.reportButton}>
            <Ionicons
              name="stats-chart-outline"
              size={14}
              color="#8794B8"
            />

            <Text style={styles.reportButtonText}>
              View Full Report
            </Text>

            <Ionicons
              name="chevron-forward"
              size={14}
              color="#8794B8"
            />
          </TouchableOpacity>
        </View>

        {/* RECENT ALERTS */}
        <View style={styles.card}>
          <View style={styles.alertHeader}>
            <Text style={styles.cardTitle}>Recent Alerts</Text>

            <TouchableOpacity
              onPress={() => router.push('/alert-history')}
            >
              <Text style={styles.viewAll}>View All ›</Text>
            </TouchableOpacity>
          </View>

          <AlertItem
            icon="warning-outline"
            iconColor="#FF3B5C"
            iconBackground="#4B1825"
            title="High Risk: Mark as Scam"
            sender="From: +91 98765 43210"
            time="10:42 AM"
            badge="High"
            badgeColor="#FF3B5C"
            badgeBackground="#63202B"
          />

          <AlertItem
            icon="shield-outline"
            iconColor="#FFB800"
            iconBackground="#4A3900"
            title="Medium Risk: Unknown Sender"
            sender="From: +91 91234 56789"
            time="Yesterday"
            badge="Medium"
            badgeColor="#FFB800"
            badgeBackground="#594500"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({
  icon,
  title,
  background,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  background: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.quickAction}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View
        style={[
          styles.quickIconBox,
          { backgroundColor: background },
        ]}
      >
        <Ionicons
          name={icon}
          size={21}
          color="#FFFFFF"
        />
      </View>

      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );
}

function RiskLegend({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.legendRow}>
      <View
        style={[
          styles.legendDot,
          { backgroundColor: color },
        ]}
      />

      <Text style={styles.legendText}>{label}</Text>

      <Text style={styles.legendValue}>{value}</Text>
    </View>
  );
}

function AlertItem({
  icon,
  iconColor,
  iconBackground,
  title,
  sender,
  time,
  badge,
  badgeColor,
  badgeBackground,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  iconBackground: string;
  title: string;
  sender: string;
  time: string;
  badge: string;
  badgeColor: string;
  badgeBackground: string;
}) {
  return (
    <TouchableOpacity
      style={styles.alertItem}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.alertIcon,
          { backgroundColor: iconBackground },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={iconColor}
        />
      </View>

      <View style={styles.alertInfo}>
        <Text
          style={styles.alertTitle}
          numberOfLines={1}
        >
          {title}
        </Text>

        <Text style={styles.alertSender}>
          {sender}
        </Text>
      </View>

      <View style={styles.alertRight}>
        <Text style={styles.alertTime}>{time}</Text>

        <View
          style={[
            styles.riskBadge,
            { backgroundColor: badgeBackground },
          ]}
        >
          <Text
            style={[
              styles.riskBadgeText,
              { color: badgeColor },
            ]}
          >
            {badge}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#06143A',
  },

  screen: {
    flex: 1,
    backgroundColor: '#06143A',
  },

  content: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoBox: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  appName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

  appSubtitle: {
    color: '#7F8CAD',
    fontSize: 9,
    marginTop: 3,
  },

  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: '#102451',
    borderWidth: 1,
    borderColor: '#1F376B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  notificationDot: {
    position: 'absolute',
    right: 8,
    top: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
  },

  protectionCard: {
    backgroundColor: '#122555',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#1E3974',
    padding: 16,
    marginBottom: 20,
  },

  protectionTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  shieldGlow: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(124,58,237,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  shieldCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7C3AED',
    borderWidth: 2,
    borderColor: '#9D75FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  protectionInfo: {
    flex: 1,
  },

  protectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 7,
  },

  protectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#154E36',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 4,
  },

  activeText: {
    color: '#22C55E',
    fontSize: 8,
    fontWeight: '700',
  },

  protectionDescription: {
    color: '#8E9ABC',
    fontSize: 9,
    lineHeight: 14,
    marginTop: 5,
    marginBottom: 10,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },

  stat: {
    flex: 1,
  },

  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  statValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  statLabel: {
    color: '#6F7DA0',
    fontSize: 7,
    marginTop: 3,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
  },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },

  quickAction: {
    flex: 1,
    minHeight: 78,
    borderRadius: 14,
    backgroundColor: '#102451',
    borderWidth: 1,
    borderColor: '#1E3974',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },

  quickIconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },

  quickActionText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '600',
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#102451',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#1E3974',
    padding: 16,
    marginBottom: 16,
  },

  cardTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  cardSubtitle: {
    color: '#7481A4',
    fontSize: 9,
    marginTop: 4,
  },

  riskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },

  riskCircleOuter: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 10,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 24,
  },

  riskCircleMiddle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 7,
    borderTopColor: '#22C55E',
    borderRightColor: '#22C55E',
    borderBottomColor: '#FFB800',
    borderLeftColor: '#FF3B5C',
    alignItems: 'center',
    justifyContent: 'center',
  },

  riskCircleInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#102451',
    alignItems: 'center',
    justifyContent: 'center',
  },

  riskScore: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
  },

  riskOutOf: {
    color: '#7785A8',
    fontSize: 8,
  },

  riskLabel: {
    color: '#7785A8',
    fontSize: 7,
    marginTop: 2,
  },

  legend: {
    flex: 1,
    gap: 10,
  },

  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 8,
  },

  legendText: {
    flex: 1,
    color: '#AAB5D1',
    fontSize: 10,
  },

  legendValue: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

  reportButton: {
    minHeight: 42,
    borderRadius: 10,
    backgroundColor: '#081633',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  reportButtonText: {
    color: '#8D99BA',
    fontSize: 10,
  },

  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  viewAll: {
    color: '#8B5CF6',
    fontSize: 9,
    fontWeight: '700',
  },

  alertItem: {
    minHeight: 62,
    borderRadius: 12,
    backgroundColor: '#0B1A3D',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 9,
  },

  alertIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  alertInfo: {
    flex: 1,
    paddingRight: 5,
  },

  alertTitle: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

  alertSender: {
    color: '#6E7B9D',
    fontSize: 8,
    marginTop: 4,
  },

  alertRight: {
    alignItems: 'flex-end',
  },

  alertTime: {
    color: '#6E7B9D',
    fontSize: 7,
    marginBottom: 5,
  },

  riskBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },

  riskBadgeText: {
    fontSize: 7,
    fontWeight: '700',
  },
});