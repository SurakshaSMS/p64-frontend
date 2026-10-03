import React, { useMemo, useState } from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { router } from 'expo-router';

import { dummyMessages } from '@/data/dummyMessages';

import {
  formatMessageTime,
  getRiskBackground,
  getRiskColor,
  getRiskLevel,
  RiskLevel,
} from '@/utils/messageRisk';

type FilterType = 'All' | RiskLevel;

export default function AllMessagesScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('All');

  const filteredMessages = useMemo(() => {
    return dummyMessages.filter((message) => {
      const risk = getRiskLevel(message);

      const matchesFilter =
        filter === 'All' || risk === filter;

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        searchValue.length === 0 ||
        message.sender.toLowerCase().includes(searchValue) ||
        message.body.toLowerCase().includes(searchValue);

      return matchesFilter && matchesSearch;
    });
  }, [search, filter]);

  const openMessage = (id: string) => {
    router.push({
      pathname: '/message-detail',
      params: { id },
    });
  };

  const filters: FilterType[] = [
    'All',
    'Safe',
    'Medium Risk',
    'High Risk',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>All Messages</Text>

            <Text style={styles.subtitle}>
              AI-powered SMS protection
            </Text>
          </View>
        </View>

        {/* SEARCH */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          placeholderTextColor="#7481A3"
          value={search}
          onChangeText={setSearch}
        />

        {/* FILTERS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {filters.map((item) => {
            const active = filter === item;

            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.filterButton,
                  active && styles.filterButtonActive,
                ]}
                onPress={() => setFilter(item)}
              >
                <Text
                  style={[
                    styles.filterText,
                    active && styles.filterTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* MESSAGE LIST */}
        <ScrollView
          style={styles.messageList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messageContent}
        >
          {filteredMessages.map((message) => {
            const risk = getRiskLevel(message);
            const riskColor = getRiskColor(risk);
            const riskBackground = getRiskBackground(risk);

            const dangerScore = Math.min(
              Math.max(message.mlResult.dangerScore, 0),
              100
            );

            return (
              <TouchableOpacity
                key={message.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => openMessage(message.id)}
              >
                {/* CARD HEADER */}
                <View style={styles.cardTop}>
                  <View style={styles.senderContainer}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: riskColor },
                      ]}
                    />

                    <View style={styles.senderTextContainer}>
                      <Text style={styles.sender}>
                        {message.sender}
                      </Text>

                      <Text style={styles.time}>
                        {formatMessageTime(message.date)}
                      </Text>
                    </View>
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

                {/* MESSAGE */}
                <Text
                  style={styles.messageText}
                  numberOfLines={2}
                >
                  {message.body}
                </Text>

                {/* SCORE */}
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>
                    Risk Score
                  </Text>

                  <Text
                    style={[
                      styles.scoreText,
                      { color: riskColor },
                    ]}
                  >
                    {dangerScore}/100
                  </Text>
                </View>

                {/* PROGRESS BAR */}
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
              </TouchableOpacity>
            );
          })}

          {/* EMPTY STATE */}
          {filteredMessages.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>
                No messages found
              </Text>

              <Text style={styles.emptyText}>
                Try changing your search or filter.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
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
    paddingHorizontal: 20,
    paddingTop: 20,

    // Keeps the mobile UI from stretching massively on web.
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },

  header: {
    marginBottom: 20,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },

  subtitle: {
    color: '#8290B4',
    fontSize: 12,
    marginTop: 5,
  },

  searchInput: {
    width: '100%',
    height: 48,
    backgroundColor: '#0D215A',
    borderWidth: 1,
    borderColor: '#253D75',
    borderRadius: 14,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 13,
    marginBottom: 15,
  },

  filterContainer: {
    gap: 8,
    paddingBottom: 15,
  },

  filterButton: {
    height: 35,
    paddingHorizontal: 15,
    borderRadius: 18,
    backgroundColor: '#10265D',
    borderWidth: 1,
    borderColor: '#253D75',
    justifyContent: 'center',
  },

  filterButtonActive: {
    backgroundColor: '#7047EB',
    borderColor: '#8059F6',
  },

  filterText: {
    color: '#8D9ABC',
    fontSize: 11,
    fontWeight: '600',
  },

  filterTextActive: {
    color: '#FFFFFF',
  },

  messageList: {
    flex: 1,
  },

  messageContent: {
    paddingBottom: 35,
  },

  card: {
    backgroundColor: '#0D215A',
    borderWidth: 1,
    borderColor: '#253D75',
    borderRadius: 17,
    padding: 15,
    marginBottom: 12,
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  senderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },

  senderTextContainer: {
    flex: 1,
  },

  sender: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  time: {
    color: '#7481A3',
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
    color: '#AEB8D2',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 14,
  },

  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },

  scoreLabel: {
    color: '#7785A8',
    fontSize: 10,
  },

  scoreText: {
    fontSize: 10,
    fontWeight: '700',
  },

  progressTrack: {
    height: 5,
    backgroundColor: '#182748',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 7,
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  emptyText: {
    color: '#7F8CAC',
    fontSize: 12,
    marginTop: 7,
  },
});