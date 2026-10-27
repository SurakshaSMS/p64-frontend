import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

type FilterType = 'All' | 'Unread' | 'High Risk' | 'Dismissed';

const alerts = [
  {
    id: '1',
    title: 'Unknown #8842',
    subtitle: 'iMessage · Today 11:30 AM',
    risk: 94,
    riskType: 'high',
    icon: '▯',
    unread: true,
  },
  {
    id: '2',
    title: 'noreply@paypal-alerts.com',
    subtitle: 'Email · Today 09:58 AM',
    risk: 89,
    riskType: 'high',
    icon: '✉',
    unread: true,
  },
  {
    id: '3',
    title: 'SSA-Benefits 7741',
    subtitle: 'SMS · Today 07:20 AM',
    risk: 72,
    riskType: 'medium',
    icon: '◔',
    unread: false,
  },
  {
    id: '4',
    title: 'alerts@amaz0n-deals.net',
    subtitle: 'Email · Yesterday 11:14 PM',
    risk: 61,
    riskType: 'medium',
    icon: '@',
    unread: false,
  },
  {
    id: '5',
    title: 'Promo 5589',
    subtitle: 'SMS · Yesterday 06:45 PM',
    risk: 44,
    riskType: 'low',
    icon: '◯',
    unread: false,
  },
];

export default function AlertHistory() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('All');

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'Unread') return alert.unread;
    if (filter === 'High Risk') return alert.risk >= 80;
    if (filter === 'Dismissed') return false;
    return true;
  });

  const newAlerts = filteredAlerts.filter((alert) => alert.unread);
  const earlierAlerts = filteredAlerts.filter((alert) => !alert.unread);

  const getRiskStyle = (risk: number) => {
    if (risk >= 80) return styles.highRisk;
    if (risk >= 60) return styles.mediumRisk;
    return styles.lowRisk;
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Alert History</Text>
        <Text style={styles.subtitle}>6 new since your last visit</Text>

        <Text style={styles.sectionLabel}>⌁ OVERVIEW</Text>

        <View style={styles.overviewCard}>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, styles.redText]}>6</Text>
            <Text style={styles.statLabel}>New Alerts</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statBox}>
            <Text style={[styles.statNumber, styles.orangeText]}>3</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>21</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statBox}>
            <Text style={[styles.statNumber, styles.cyanText]}>9</Text>
            <Text style={styles.statLabel}>Blocked</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>▽ FILTER ALERTS</Text>

        <View style={styles.filters}>
          {(['All', 'Unread', 'High Risk', 'Dismissed'] as FilterType[]).map(
            (item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.filterButton,
                  filter === item && styles.filterButtonActive,
                  item === 'High Risk' && styles.highRiskFilter,
                ]}
                onPress={() => setFilter(item)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === item && styles.filterTextActive,
                    item === 'High Risk' && styles.highRiskFilterText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>

        {newAlerts.length > 0 && (
          <>
            <Text style={[styles.groupLabel, styles.newUnread]}>
              ♧ NEW · UNREAD
            </Text>

            <View style={styles.alertGroup}>
              {newAlerts.map((alert, index) => (
                <AlertRow
                  key={alert.id}
                  alert={alert}
                  last={index === newAlerts.length - 1}
                  getRiskStyle={getRiskStyle}
                  onPress={() =>
                    router.push({
                      pathname: '/report-scam',
                      params: {
                        title: alert.title,
                        risk: alert.risk.toString(),
                      },
                    })
                  }
                />
              ))}
            </View>
          </>
        )}

        {earlierAlerts.length > 0 && (
          <>
            <Text style={styles.groupLabel}>◷ EARLIER TODAY</Text>

            <View style={styles.alertGroup}>
              {earlierAlerts.map((alert, index) => (
                <AlertRow
                  key={alert.id}
                  alert={alert}
                  last={index === earlierAlerts.length - 1}
                  getRiskStyle={getRiskStyle}
                  onPress={() =>
                    router.push({
                      pathname: '/report-scam',
                      params: {
                        title: alert.title,
                        risk: alert.risk.toString(),
                      },
                    })
                  }
                />
              ))}
            </View>
          </>
        )}

        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearButtonText}>▣ Clear All Dismissed</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Suraksha SMS · Protected by AI
        </Text>
      </ScrollView>

      <View style={styles.bottomNav}>
        <NavItem label="Home" icon="⌂" />
        <NavItem label="Messages" icon="◯" />

        <View style={styles.aiButton}>
          <Text style={styles.aiIcon}>▣</Text>
          <Text style={styles.aiLabel}>AI Protect</Text>
        </View>

        <NavItem label="Alerts" icon="▣" active />
        <NavItem label="Settings" icon="⌘" />
      </View>
    </View>
  );
}

function AlertRow({
  alert,
  last,
  getRiskStyle,
  onPress,
}: {
  alert: (typeof alerts)[number];
  last: boolean;
  getRiskStyle: (risk: number) => object;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.alertRow, !last && styles.alertRowBorder]}
      onPress={onPress}
    >
      <View style={styles.iconBox}>
        <Text style={styles.iconText}>{alert.icon}</Text>
      </View>

      <View style={styles.alertInfo}>
        <View style={styles.alertTitleRow}>
          <Text style={styles.alertTitle}>{alert.title}</Text>

          {alert.unread && <View style={styles.unreadDot} />}
        </View>

        <Text style={styles.alertSubtitle}>{alert.subtitle}</Text>
      </View>

      <View style={[styles.riskBadge, getRiskStyle(alert.risk)]}>
        <Text style={styles.riskText}>{alert.risk} RISK</Text>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

function NavItem({
  label,
  icon,
  active = false,
}: {
  label: string;
  icon: string;
  active?: boolean;
}) {
  return (
    <View style={styles.navItem}>
      <Text style={[styles.navIcon, active && styles.navActive]}>
        {icon}
      </Text>
      <Text style={[styles.navLabel, active && styles.navActive]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#060E27',
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  backButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#10265B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  backText: {
    color: '#6E92FF',
    fontSize: 28,
    marginTop: -4,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '700',
  },

  subtitle: {
    color: '#7383A8',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 22,
  },

  sectionLabel: {
    color: '#9AACD5',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 10,
  },

  overviewCard: {
    height: 82,
    backgroundColor: '#0F2155',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E3B83',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 22,
  },

  statBox: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    color: '#C5D2FF',
    fontSize: 20,
    fontWeight: '700',
  },

  redText: {
    color: '#FF3A5D',
  },

  orangeText: {
    color: '#FFB21A',
  },

  cyanText: {
    color: '#32D5ED',
  },

  statLabel: {
    color: '#7083B4',
    fontSize: 9,
    marginTop: 5,
  },

  divider: {
    height: 36,
    width: 1,
    backgroundColor: '#243A72',
  },

  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 22,
  },

  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#273B74',
    backgroundColor: '#0D1B49',
  },

  filterButtonActive: {
    backgroundColor: '#6B4CF6',
    borderColor: '#765AFF',
  },

  filterText: {
    color: '#8190B7',
    fontSize: 11,
    fontWeight: '600',
  },

  filterTextActive: {
    color: '#FFFFFF',
  },

  highRiskFilter: {
    backgroundColor: '#31112A',
    borderColor: '#68152C',
  },

  highRiskFilterText: {
    color: '#FF5B72',
  },

  groupLabel: {
    color: '#8595BD',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 10,
  },

  newUnread: {
    color: '#FF3C63',
  },

  alertGroup: {
    backgroundColor: '#0E2154',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#203A79',
    overflow: 'hidden',
    marginBottom: 20,
  },

  alertRow: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  alertRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#21366D',
  },

  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#261035',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  iconText: {
    color: '#FF3A5D',
    fontSize: 17,
  },

  alertInfo: {
    flex: 1,
  },

  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  alertTitle: {
    color: '#F4F6FF',
    fontSize: 13,
    fontWeight: '700',
    maxWidth: '92%',
  },

  unreadDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FF3A5D',
    marginLeft: 5,
  },

  alertSubtitle: {
    color: '#687AA8',
    fontSize: 9,
    marginTop: 4,
  },

  riskBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    marginLeft: 8,
  },

  highRisk: {
    backgroundColor: '#381029',
    borderColor: '#FF3157',
  },

  mediumRisk: {
    backgroundColor: '#32280F',
    borderColor: '#FFB21A',
  },

  lowRisk: {
    backgroundColor: '#182153',
    borderColor: '#7358FF',
  },

  riskText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },

  chevron: {
    color: '#4E6395',
    fontSize: 20,
    marginLeft: 8,
  },

  clearButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#0E2154',
    borderWidth: 1,
    borderColor: '#203A79',
    alignItems: 'center',
    justifyContent: 'center',
  },

  clearButtonText: {
    color: '#60739F',
    fontSize: 13,
  },

  footerText: {
    color: '#43557E',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 20,
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 78,
    backgroundColor: '#111827',
    borderTopWidth: 1,
    borderTopColor: '#24314E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 8,
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 58,
  },

  navIcon: {
    color: '#536584',
    fontSize: 20,
  },

  navLabel: {
    color: '#536584',
    fontSize: 9,
    marginTop: 4,
  },

  navActive: {
    color: '#7B61FF',
  },

  aiButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },

  aiIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#7B4DFF',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 48,
    fontSize: 20,
    overflow: 'hidden',
  },

  aiLabel: {
    color: '#7B61FF',
    fontSize: 9,
    marginTop: 4,
  },
});