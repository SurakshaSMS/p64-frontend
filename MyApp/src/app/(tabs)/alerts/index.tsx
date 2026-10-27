import React, { useMemo, useState } from "react";
import { transformSmsToAlertItem } from "@/transformers/alertItem.transformer";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { typography } from "@/constants/typography";
import { Ionicons } from "@expo/vector-icons";
import { AlertItem } from "@/types/alert.type";
import { useAlertStore } from "@/stores/useAlertStore";
import { groupAlertsByDate } from "@/utils/alertDate.utils";
import { getRiskColor, getIconDetails } from "@/utils/alertRisk.utils";
import { router } from "expo-router";
import { routes } from "@/constants/routes";
type FilterType = "All" | "Unread" | "High Risk" | "Medium Risk";

const clearAlerts = () => {
  useAlertStore.getState().clearAlertItems();
};

export default function AlertHistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("All");

  const alerts: AlertItem[] = useAlertStore((state) => state.alertItems);
  alerts.filter((alert) => alert.unread);

  const filteredAlerts = useMemo(() => {
    if (selectedFilter === "High Risk") {
      return alerts.filter((alert) => alert.score >= 80);
    }

    if (selectedFilter === "Medium Risk") {
      return alerts.filter((alert) => alert.score >= 60 && alert.score < 80);
    }

    return alerts;
  }, [alerts, selectedFilter]);

  const { todayAlerts, yesterdayAlerts, pastAlerts } = useMemo(() => {
    return groupAlertsByDate(filteredAlerts);
  }, [alerts]);


  const renderAlert = (alert: AlertItem) => {
    const riskColor = getRiskColor(alert.score);
    const iconDetails = getIconDetails(alert);
    console.log(alert);
    return (
      <TouchableOpacity
        key={alert.id}
        style={styles.alertRow}
        activeOpacity={0.8}
        onPress={() => {
          router.push({
            pathname: routes.messages.detail,
            params: {
              id: alert.id,
            },
            
          });
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
            <Text style={styles.senderName} numberOfLines={1}>
              {alert.sender}
            </Text>

            {alert.unread && <View style={styles.unreadDot} />}
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
          <Text style={[styles.riskBadgeText, { color: riskColor }]}>
            {alert.score} RISK
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={14} color="#576895" />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>Alert History</Text>

      <View style={styles.smallHeadingRow}>
        <Ionicons name="filter-outline" size={12} color="#8795C7" />

        <Text style={styles.smallHeading}>FILTER ALERTS</Text>
      </View>

      <View style={styles.filters}>
        {(["All", "High Risk", "Medium Risk"] as FilterType[]).map(
          (filter) => {
            const selected = selectedFilter === filter;

            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterButton]}
                activeOpacity={0.8}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,

                    selected && styles.selectedFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          },
        )}
      </View>

      {todayAlerts.length > 0 && (
        <>
          <View style={styles.sectionHeading}>
            <Ionicons name="notifications-outline" size={12} color="#FF315E" />

            <Text style={styles.newSectionText}>NEW · Today</Text>
          </View>

          <View style={styles.alertCard}>
            {alerts.map((alert, index) => (
              <React.Fragment key={alert.id}>
                {renderAlert(alert)}

                {index !== alerts.length - 1 && (
                  <View style={styles.alertSeparator} />
                )}
              </React.Fragment>
            ))}
          </View>
        </>
      )}

      {yesterdayAlerts.length > 0 && (
          <>
            <View style={styles.sectionHeading}>
              <Ionicons
                name="time-outline"
                size={12}
                color="#8291BF"
              />

              <Text style={styles.earlierText}>
                ALERTS YESTERDAY
              </Text>
            </View>

            <View style={styles.alertCard}>
              {yesterdayAlerts.map(
                (alert, index) => (
                  <React.Fragment
                    key={alert.id}
                  >
                    {renderAlert(alert)}

                    {index !==
                      yesterdayAlerts.length -
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
      {pastAlerts.length > 0 && (
          <>
            <View style={styles.sectionHeading}>
              <Ionicons
                name="time-outline"
                size={12}
                color="#8291BF"
              />

              <Text style={styles.earlierText}>
                PAST ALERTS
              </Text>
            </View>

            <View style={styles.alertCard}>
              {pastAlerts.map(
                (alert, index) => (
                  <React.Fragment
                    key={alert.id}
                  >
                    {renderAlert(alert)}

                    {index !==
                      pastAlerts.length -
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

          <Text style={styles.emptyTitle}>No alerts found</Text>

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
          clearAlerts();
        }}
      >
        <Ionicons name="trash-outline" size={17} color="#7182B4" />

        <Text style={styles.clearButtonText}>Clear All Alerts</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Suraksha SMS · Protected by AI</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#10235A",
    borderWidth: 1,
    borderColor: "#1E397B",
    justifyContent: "center",
    alignItems: "center",
  },

  pageTitle: {
    color: "#FFFFFF",
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    marginTop: 24,
  },

  lastVisit: {
    color: "#7785B0",
    fontSize: 11,
    marginTop: 3,
    marginBottom: 22,
  },

  smallHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },

  smallHeading: {
    color: "#8795C7",
    fontSize: 9,
    fontWeight: "700",
  },

  overviewCard: {
    minHeight: 90,
    backgroundColor: "#10235C",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#203C83",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    fontSize: 22,
    fontWeight: "800",
  },

  statLabel: {
    color: "#7585B7",
    fontSize: 8,
    marginTop: 4,
  },

  divider: {
    height: 37,
    width: 1,
    backgroundColor: "#253D78",
  },

  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 17,
  },

  filterButton: {
    minHeight: 31,
    paddingHorizontal: 15,
    borderRadius: 18,
    backgroundColor: "#10235A",
    borderWidth: 1,
    borderColor: "#1D3570",
    justifyContent: "center",
    alignItems: "center",
  },

  selectedFilter: {
    backgroundColor: "#6445ED",
    borderColor: "#6445ED",
  },

  filterText: {
    color: "#7080AE",
    fontSize: 10,
    fontWeight: "600",
  },

  selectedFilterText: {
    color: "#FFFFFF",
  },

  highRiskFilter: {
    borderColor: "#6D1837",
    backgroundColor: "#2B1029",
  },

  highRiskFilterText: {
    color: "#FF315E",
  },

  selectedHighRiskFilter: {
    borderColor: "#FF315E",
    backgroundColor: "#501127",
  },

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
    marginBottom: 8,
  },

  newSectionText: {
    color: "#FF315E",
    fontSize: 9,
    fontWeight: "800",
  },

  earlierText: {
    color: "#8291BF",
    fontSize: 9,
    fontWeight: "700",
  },

  alertCard: {
    backgroundColor: "#10235A",
    borderWidth: 1,
    borderColor: "#223D81",
    borderRadius: 18,
    marginBottom: 20,
    overflow: "hidden",
  },

  alertRow: {
    minHeight: 73,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    paddingVertical: 12,
  },

  alertIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  alertInformation: {
    flex: 1,
    marginRight: 6,
  },

  senderLine: {
    flexDirection: "row",
    alignItems: "center",
  },

  senderName: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    maxWidth: "92%",
  },

  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF315E",
    marginLeft: 5,
  },

  alertMeta: {
    color: "#6F80AC",
    fontSize: 8,
    marginTop: 4,
  },

  riskBadge: {
    minWidth: 57,
    height: 22,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginRight: 6,
  },

  riskBadgeText: {
    fontSize: 7,
    fontWeight: "800",
  },

  alertSeparator: {
    height: 1,
    backgroundColor: "#203974",
    marginLeft: 62,
  },

  clearButton: {
    minHeight: 51,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#233D82",
    backgroundColor: "#10235A",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },

  clearButtonText: {
    color: "#7182B4",
    fontSize: 12,
    fontWeight: "600",
  },

  footer: {
    color: "#485A8D",
    fontSize: 8,
    textAlign: "center",
    marginTop: 25,
  },

  emptyContainer: {
    minHeight: 180,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  emptyTitle: {
    color: "#B6C2E5",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 10,
  },

  emptyDescription: {
    color: "#6576A7",
    fontSize: 10,
    marginTop: 5,
  },
});
