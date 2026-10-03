import React, { useMemo, useState } from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

type FilterType = 'All' | 'Unread' | 'High Risk' | 'Dismissed';

type AlertItem = {
  id: string;
  sender: string;
  source: string;
  time: string;
  score: number;
  category: 'High' | 'Medium' | 'Low';
  unread?: boolean;
  dismissed?: boolean;
  type: 'sms' | 'email';
};

const alerts: AlertItem[] = [
  {
    id: '1',
    sender: 'Unknown #8842',
    source: 'iMessage',
    time: 'Today 11:30 AM',
    score: 94,
    category: 'High',
    unread: true,
    type: 'sms',
  },
  {
    id: '2',
    sender: 'noreply@paypal-alerts.com',
    source: 'Email',
    time: 'Today 09:38 AM',
    score: 89,
    category: 'High',
    unread: true,
    type: 'email',
  },
  {
    id: '3',
    sender: 'SSA-Benefits 7741',
    source: 'SMS',
    time: 'Today 07:20 AM',
    score: 72,
    category: 'Medium',
    type: 'sms',
  },
  {
    id: '4',
    sender: 'alerts@amaz0n-deals.net',
    source: 'Email',
    time: 'Yesterday 11:14 PM',
    score: 61,
    category: 'Medium',
    type: 'email',
  },
  {
    id: '5',
    sender: 'Promo 5589',
    source: 'SMS',
    time: 'Yesterday 06:45 PM',
    score: 44,
    category: 'Low',
    dismissed: true,
    type: 'sms',
  },
];

export default function AlertHistoryScreen() {
  const [selectedFilter, setSelectedFilter] =
    useState<FilterType>('All');

  const filteredAlerts = useMemo(() => {
    if (selectedFilter === 'Unread') {
      return alerts.filter((alert) => alert.unread);
    }

    if (selectedFilter === 'High Risk') {
      return alerts.filter((alert) => alert.category === 'High');
    }

    if (selectedFilter === 'Dismissed') {
      return alerts.filter((alert) => alert.dismissed);
    }

    return alerts;
  }, [selectedFilter]);

  const newAlerts = filteredAlerts.filter(
    (alert) => alert.unread
  );

  const earlierAlerts = filteredAlerts.filter(
    (alert) => !alert.unread
  );

  const getRiskColor = (score: number) => {
    if (score >= 80) {
      return '#FF315E';
    }

    if (score >= 60) {
      return '#FFB800';
    }

    if (score >= 50) {
      return '#8D45FF';
    }

    return '#7B7CFF';
  };

  const getIconDetails = (alert: AlertItem) => {
    if (alert.type === 'email') {
      return {
        icon: 'mail-outline' as const,
        color: '#A847FF',
        background: '#28135A',
      };
    }

    if (alert.score >= 80) {
      return {
        icon: 'phone-portrait-outline' as const,
        color: '#FF315E',
        background: '#501129',
      };
    }

    if (alert.score >= 60) {
      return {
        icon: 'call-outline' as const,
        color: '#00DB78',
        background: '#063E28',
      };
    }

    return {
      icon: 'chatbubble-outline' as const,
      color: '#8D8DFF',
      background: '#101A51',
    };
  };

  const renderAlert = (alert: AlertItem) => {
    const riskColor = getRiskColor(alert.score);
    const iconDetails = getIconDetails(alert);

    return (
      <TouchableOpacity
        key={alert.id}
        style={styles.alertRow}
        activeOpacity={0.8}
        onPress={() => {
          console.log('Alert selected:', alert.sender);
        }}
      >
        <View
          style={[
            styles.alertIconContainer,
            {
              backgroundColor: iconDetails.background,
            },
          ]}
        >
          <Ionicons
            name={iconDetails.icon}
            size={18}
            color={iconDetails.color}
          />
        </View>

        <View style={styles.alertInformation}>
          <View style={styles.senderLine}>
            <Text
              style={styles.senderName}
              numberOfLines={1}
            >
              {alert.sender}
            </Text>

            {alert.unread && (
              <View style={styles.unreadDot} />
            )}
          </View>

          <Text style={styles.alertMeta}>
            {alert.source} · {alert.time}
          </Text>
        </View>

        <View
          style={[
            styles.riskBadge,
            {
              borderColor: riskColor,
              backgroundColor: `${riskColor}18`,
            },
          ]}
        >
          <Text
            style={[
              styles.riskBadgeText,
              { color: riskColor },
            ]}
          >
            {alert.score} RISK
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={14}
          color="#576895"
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color="#AAB8E7"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.pageTitle}>
          Alert History
        </Text>

        <Text style={styles.lastVisit}>
          6 new since your last visit
        </Text>

        {/* Overview heading */}

        <View style={styles.smallHeadingRow}>
          <Ionicons
            name="stats-chart-outline"
            size={12}
            color="#8795C7"
          />

          <Text style={styles.smallHeading}>
            OVERVIEW
          </Text>
        </View>

        {/* Overview card */}

        <View style={styles.overviewCard}>
          <View style={styles.statItem}>
            <Text
              style={[
                styles.statNumber,
                { color: '#FF315E' },
              ]}
            >
              6
            </Text>

            <Text style={styles.statLabel}>
              New Alerts
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text
              style={[
                styles.statNumber,
                { color: '#FFB800' },
              ]}
            >
              3
            </Text>

            <Text style={styles.statLabel}>
              Pending
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text
              style={[
                styles.statNumber,
                { color: '#A8B3E8' },
              ]}
            >
              21
            </Text>

            <Text style={styles.statLabel}>
              This Week
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text
              style={[
                styles.statNumber,
                { color: '#23DFD4' },
              ]}
            >
              9
            </Text>

            <Text style={styles.statLabel}>
              Blocked
            </Text>
          </View>
        </View>

        {/* Filters */}

        <View style={styles.smallHeadingRow}>
          <Ionicons
            name="filter-outline"
            size={12}
            color="#8795C7"
          />

          <Text style={styles.smallHeading}>
            FILTER ALERTS
          </Text>
        </View>

        <View style={styles.filters}>
          {(
            [
              'All',
              'Unread',
              'High Risk',
              'Dismissed',
            ] as FilterType[]
          ).map((filter) => {
            const selected =
              selectedFilter === filter;

            const highRisk =
              filter === 'High Risk';

            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,

                  selected &&
                    !highRisk &&
                    styles.selectedFilter,

                  highRisk &&
                    styles.highRiskFilter,

                  selected &&
                    highRisk &&
                    styles.selectedHighRiskFilter,
                ]}
                activeOpacity={0.8}
                onPress={() =>
                  setSelectedFilter(filter)
                }
              >
                <Text
                  style={[
                    styles.filterText,

                    selected &&
                      styles.selectedFilterText,

                    highRisk &&
                      styles.highRiskFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* New / Unread */}

        {newAlerts.length > 0 && (
          <>
            <View style={styles.sectionHeading}>
              <Ionicons
                name="notifications-outline"
                size={12}
                color="#FF315E"
              />

              <Text style={styles.newSectionText}>
                NEW · UNREAD
              </Text>
            </View>

            <View style={styles.alertCard}>
              {newAlerts.map((alert, index) => (
                <React.Fragment key={alert.id}>
                  {renderAlert(alert)}

                  {index !==
                    newAlerts.length - 1 && (
                    <View
                      style={
                        styles.alertSeparator
                      }
                    />
                  )}
                </React.Fragment>
              ))}
            </View>
          </>
        )}

        {/* Earlier */}

        {earlierAlerts.length > 0 && (
          <>
            <View style={styles.sectionHeading}>
              <Ionicons
                name="time-outline"
                size={12}
                color="#8291BF"
              />

              <Text style={styles.earlierText}>
                EARLIER TODAY
              </Text>
            </View>

            <View style={styles.alertCard}>
              {earlierAlerts.map(
                (alert, index) => (
                  <React.Fragment
                    key={alert.id}
                  >
                    {renderAlert(alert)}

                    {index !==
                      earlierAlerts.length -
                        1 && (
                      <View
                        style={
                          styles.alertSeparator
                        }
                      />
                    )}
                  </React.Fragment>
                )
              )}
            </View>
          </>
        )}

        {/* Nothing found */}

        {filteredAlerts.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="notifications-off-outline"
              size={34}
              color="#6576AA"
            />

            <Text style={styles.emptyTitle}>
              No alerts found
            </Text>

            <Text style={styles.emptyDescription}>
              There are no alerts in this category.
            </Text>
          </View>
        )}

        {/* Clear button */}

        <TouchableOpacity
          style={styles.clearButton}
          activeOpacity={0.8}
          onPress={() => {
            console.log('Clear dismissed');
          }}
        >
          <Ionicons
            name="trash-outline"
            size={17}
            color="#7182B4"
          />

          <Text style={styles.clearButtonText}>
            Clear All Dismissed
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Suraksha SMS · Protected by AI
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#06143F',
  },

  screen: {
    flex: 1,
    backgroundColor: '#06143F',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#10235A',
    borderWidth: 1,
    borderColor: '#1E397B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  pageTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 24,
  },

  lastVisit: {
    color: '#7785B0',
    fontSize: 11,
    marginTop: 3,
    marginBottom: 22,
  },

  smallHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },

  smallHeading: {
    color: '#8795C7',
    fontSize: 9,
    fontWeight: '700',
  },

  overviewCard: {
    minHeight: 90,
    backgroundColor: '#10235C',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#203C83',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 22,
    fontWeight: '800',
  },

  statLabel: {
    color: '#7585B7',
    fontSize: 8,
    marginTop: 4,
  },

  divider: {
    height: 37,
    width: 1,
    backgroundColor: '#253D78',
  },

  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 17,
  },

  filterButton: {
    minHeight: 31,
    paddingHorizontal: 15,
    borderRadius: 18,
    backgroundColor: '#10235A',
    borderWidth: 1,
    borderColor: '#1D3570',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedFilter: {
    backgroundColor: '#6445ED',
    borderColor: '#6445ED',
  },

  filterText: {
    color: '#7080AE',
    fontSize: 10,
    fontWeight: '600',
  },

  selectedFilterText: {
    color: '#FFFFFF',
  },

  highRiskFilter: {
    borderColor: '#6D1837',
    backgroundColor: '#2B1029',
  },

  highRiskFilterText: {
    color: '#FF315E',
  },

  selectedHighRiskFilter: {
    borderColor: '#FF315E',
    backgroundColor: '#501127',
  },

  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
    marginBottom: 8,
  },

  newSectionText: {
    color: '#FF315E',
    fontSize: 9,
    fontWeight: '800',
  },

  earlierText: {
    color: '#8291BF',
    fontSize: 9,
    fontWeight: '700',
  },

  alertCard: {
    backgroundColor: '#10235A',
    borderWidth: 1,
    borderColor: '#223D81',
    borderRadius: 18,
    marginBottom: 20,
    overflow: 'hidden',
  },

  alertRow: {
    minHeight: 73,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 12,
  },

  alertIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  alertInformation: {
    flex: 1,
    marginRight: 6,
  },

  senderLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  senderName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    maxWidth: '92%',
  },

  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF315E',
    marginLeft: 5,
  },

  alertMeta: {
    color: '#6F80AC',
    fontSize: 8,
    marginTop: 4,
  },

  riskBadge: {
    minWidth: 57,
    height: 22,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginRight: 6,
  },

  riskBadgeText: {
    fontSize: 7,
    fontWeight: '800',
  },

  alertSeparator: {
    height: 1,
    backgroundColor: '#203974',
    marginLeft: 62,
  },

  clearButton: {
    minHeight: 51,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#233D82',
    backgroundColor: '#10235A',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },

  clearButtonText: {
    color: '#7182B4',
    fontSize: 12,
    fontWeight: '600',
  },

  footer: {
    color: '#485A8D',
    fontSize: 8,
    textAlign: 'center',
    marginTop: 25,
  },

  emptyContainer: {
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  emptyTitle: {
    color: '#B6C2E5',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
  },

  emptyDescription: {
    color: '#6576A7',
    fontSize: 10,
    marginTop: 5,
  },
});