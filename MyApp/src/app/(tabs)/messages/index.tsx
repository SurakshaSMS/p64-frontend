import React, { useMemo, useState, useEffect } from "react";
import { RiskType } from "@/types/message.type";
import { useSmsStore } from "@/stores/useSmsStore";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { typography } from "@/constants/typography";
import { router } from "expo-router";
import { routes } from "@/constants/routes";
import { formatMessageTime, getRiskBackground, getRiskColor } from "@/utils/messageRisk";

export default function AllMessagesScreen() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const messages = useSmsStore((state) => state.flaggedMessages);

  /* =======================================================
     SEARCH + FILTER
  ======================================================= */
  const filteredMessages = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesSearch =
        message.sender.toLowerCase().includes(searchText) ||
        message.mlResult.cleanedText.toLowerCase().includes(searchText);

      let matchesFilter = true;

      if (activeFilter === "smish") {
        matchesFilter = message.mlResult.label === "smish";
      }

      if (activeFilter === "normal") {
        matchesFilter = message.mlResult.label === "normal";
      }

      if (activeFilter === "promo") {
        matchesFilter = message.mlResult.label === "promo";
      }

      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter, messages]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ================= HEADER ================= */}

      <View style={styles.header}>
        <Text style={styles.title}>All Messages</Text>

        <Text style={styles.subtitle}>View and manage all scanned SMS</Text>
      </View>

      {/* ================= SEARCH ================= */}

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>⌕</Text>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search messages..."
          placeholderTextColor="#7885A9"
          style={styles.searchInput}
        />
      </View>

      {/* ================= FILTERS ================= */}

      <View style={styles.filterRow}>
        {["All", "normal", "promo", "smish"].map((filter) => {
          const isActive = activeFilter === filter;

          return (
            <TouchableOpacity
              key={filter}
              activeOpacity={0.8}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterButton,

                filter === "normal" && styles.safeFilter,

                filter === "promo" && styles.mediumFilter,

                filter === "smish" && styles.highFilter,

                isActive && filter === "All" && styles.allFilterActive,

                isActive && filter === "normal" && styles.safeFilterActive,

                isActive && filter === "promo" && styles.mediumFilterActive,

                isActive && filter === "smish" && styles.highFilterActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,

                  filter === "normal" && styles.safeText,

                  filter === "promo" && styles.mediumText,

                  filter === "smish" && styles.highText,

                  isActive && filter === "All" && styles.activeFilterText,
                ]}
              >
                {filter === "smish" ? "smish" : filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ================= MESSAGES ================= */}

      <View style={styles.messageList}>
        {filteredMessages.map((message) => {
          const riskColor = getRiskColor(message.finalRisk.riskLevel);

          const riskBackground = getRiskBackground(message.finalRisk.riskLevel);

          return (
            <TouchableOpacity
              key={message.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => {
                router.push({
                  pathname: routes.messages.detail,
                  params: { id: message.id },
                })
              }}
            >
              {/* CARD HEADER */}

              <View style={styles.cardHeader}>
                <View style={styles.senderSection}>
                  {/* MESSAGE ICON */}

                  <View
                    style={[
                      styles.messageIconContainer,
                      {
                        backgroundColor: riskBackground,

                        borderColor: riskColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageIcon,
                        {
                          color: riskColor,
                        },
                      ]}
                    >
                      ✉
                    </Text>
                  </View>

                  {/* SENDER INFORMATION */}

                  <View style={styles.senderTextContainer}>
                    <Text style={styles.sender}>{message.sender}</Text>

                    <Text style={styles.time}>{formatMessageTime(message.date)}</Text>
                  </View>
                </View>

                {/* RISK BADGE */}

                <View
                  style={[
                    styles.riskBadge,
                    {
                      backgroundColor: riskBackground,

                      borderColor: riskColor,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.riskDot,
                      {
                        backgroundColor: riskColor,
                      },
                    ]}
                  />

                  <Text
                    style={[
                      styles.riskBadgeText,
                      {
                        color: riskColor,
                      },
                    ]}
                  >
                    {message.mlResult.label}
                  </Text>
                </View>
              </View>

              {/* MESSAGE PREVIEW */}

              <Text style={styles.messageText}>{message.body}</Text>

              {/* SCORE */}

              <View style={styles.cardBottom}>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${message.mlResult.dangerScore}%`,
                        backgroundColor: riskColor,
                      },
                    ]}
                  />
                </View>

                <Text
                  style={[
                    styles.score,
                    {
                      color: riskColor,
                    },
                  ]}
                >
                  Score: {message.mlResult.dangerScore}/100
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ================= EMPTY RESULT ================= */}

      {filteredMessages.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>◌</Text>

          <Text style={styles.emptyTitle}>No messages found</Text>

          <Text style={styles.emptyText}>Try another search or filter.</Text>
        </View>
      )}

      {/* ================= HINT ================= */}

      {filteredMessages.length > 0 && (
        <Text style={styles.tapHint}>Tap a message to view full details</Text>
      )}
    </ScrollView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  /* ================= SCREEN ================= */

  screen: {
    flex: 1,
    paddingVertical: 20,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 35,
  },

  /* ================= HEADER ================= */

  header: {
    marginBottom: 18,
  },

  title: {
    color: "#FFFFFF",
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    letterSpacing: -0.3,
  },

  subtitle: {
    color: "#8C98B9",
    fontSize: 13,
    marginTop: 4,
  },

  /* ================= SEARCH ================= */

  searchContainer: {
    width: "100%",
    minHeight: 48,

    backgroundColor: "#0D1C4B",

    borderWidth: 1,
    borderColor: "#29417D",
    borderRadius: 15,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,
  },

  searchIcon: {
    color: "#7E8BB0",
    fontSize: 22,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,

    color: "#FFFFFF",

    fontSize: 14,

    paddingVertical: 12,
  },

  /* ================= FILTERS ================= */

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",

    gap: 9,

    marginTop: 15,
    marginBottom: 17,
  },

  filterButton: {
    borderRadius: 18,

    borderWidth: 1,
    borderColor: "#394C83",

    paddingHorizontal: 15,
    paddingVertical: 8,

    backgroundColor: "transparent",
  },

  allFilterActive: {
    backgroundColor: "#5C47DA",
    borderColor: "#5C47DA",
  },

  safeFilter: {
    borderColor: "#13D67A",
  },

  mediumFilter: {
    borderColor: "#FFB800",
  },

  highFilter: {
    borderColor: "#FF2F68",
  },

  safeFilterActive: {
    backgroundColor: "#0C3125",
  },

  mediumFilterActive: {
    backgroundColor: "#352804",
  },

  highFilterActive: {
    backgroundColor: "#341327",
  },

  filterText: {
    color: "#A1AAC3",

    fontSize: 12,
    fontWeight: "500",
  },

  activeFilterText: {
    color: "#FFFFFF",
  },

  safeText: {
    color: "#13D67A",
  },

  mediumText: {
    color: "#FFB800",
  },

  highText: {
    color: "#FF2F68",
  },

  /* ================= MESSAGE LIST ================= */

  messageList: {
    width: "100%",
  },

  card: {
    width: "100%",

    backgroundColor: "#0D1B4D",

    borderWidth: 1,
    borderColor: "#1B3475",
    borderRadius: 18,

    padding: 15,

    marginBottom: 13,
  },

  /* ================= CARD HEADER ================= */

  cardHeader: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  senderSection: {
    flex: 1,

    flexDirection: "row",

    paddingRight: 10,
  },

  /* ================= ICON ================= */

  messageIconContainer: {
    width: 38,
    height: 38,

    borderRadius: 19,
    borderWidth: 1,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 11,
  },

  messageIcon: {
    fontSize: 17,
  },

  /* ================= SENDER ================= */

  senderTextContainer: {
    flexShrink: 1,
  },

  sender: {
    color: "#FFFFFF",

    fontSize: 15,
    fontWeight: "700",
  },

  time: {
    color: "#7C89AD",

    fontSize: 11,

    marginTop: 3,
  },

  /* ================= RISK BADGE ================= */

  riskBadge: {
    flexDirection: "row",

    alignItems: "center",

    borderWidth: 1,
    borderRadius: 20,

    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  riskDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    marginRight: 5,
  },

  riskBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },

  /* ================= MESSAGE ================= */

  messageText: {
    color: "#AAB4D2",

    fontSize: 13,
    lineHeight: 19,

    marginTop: 14,
  },

  /* ================= SCORE ================= */

  cardBottom: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 13,
  },

  progressTrack: {
    flex: 1,

    height: 6,

    borderRadius: 10,

    backgroundColor: "#13213D",

    overflow: "hidden",

    marginRight: 18,
  },

  progressFill: {
    height: "100%",

    borderRadius: 10,
  },

  score: {
    fontSize: 11,
    fontWeight: "700",
  },

  /* ================= EMPTY STATE ================= */

  emptyContainer: {
    paddingVertical: 50,

    alignItems: "center",
  },

  emptyIcon: {
    color: "#566589",

    fontSize: 36,

    marginBottom: 10,
  },

  emptyTitle: {
    color: "#FFFFFF",

    fontSize: 16,
    fontWeight: "600",
  },

  emptyText: {
    color: "#7C89AD",

    fontSize: 13,

    marginTop: 5,
  },

  /* ================= HINT ================= */

  tapHint: {
    color: "#6F7A99",

    textAlign: "center",

    fontSize: 11,

    marginTop: 4,
    marginBottom: 10,
  },
});
