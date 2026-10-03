import { routes } from '@/constants/routes';
import { router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Image } from 'react-native';

export default function SetupScreen() {
  return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <View style={styles.visualWrap}>
              <View style={styles.ringLarge} />
              <View style={styles.ringMedium} />
              <View style={styles.ringSmall} />

              <View style={styles.scanningBadge}>
                <Text style={styles.scanningText}>AI Calibrating</Text>
              </View>

              <View style={styles.logoGlow}>
                 <View style={styles.logoBox}>
                    <Image source={require('@/assets/images/onboarding/shield-check.png')} />
                  </View>
              </View>
            </View>

            <Text style={styles.pill}>SETTING UP PROTECTION</Text>

            <Text style={styles.title}>Preparing Suraksha SMS</Text>

            <Text style={styles.subtitle}>
              We’re setting up your on-device AI protection so suspicious SMS messages can be
              detected in real time.
            </Text>

            <View style={styles.statusCard}>
              <StatusRow status="complete" title="Privacy settings secured" />
              <View style={styles.divider} />

              <StatusRow status="complete" title="On-device scan mode enabled" />
              <View style={styles.divider} />

              <StatusRow status="loading" title="Calibrating threat detection model" />
              <View style={styles.divider} />

              <StatusRow status="pending" title="Preparing real-time alerts" />
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push(routes.dashboard.home)}
              >
                <Text style={styles.primaryText}>Continue to Dashboard</Text>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>

              <Text style={styles.helperText}>
                Your messages stay private and are processed only on this device.
              </Text>
            </View>
          </View>
        </ScrollView>
  );
}

function StatusRow({
  status,
  title,
}: {
  status: 'complete' | 'loading' | 'pending';
  title: string;
}) {
  return (
    <View style={styles.statusRow}>
      <View
        style={[
          styles.statusIcon,
          status === 'complete' && styles.statusComplete,
          status === 'loading' && styles.statusLoading,
          status === 'pending' && styles.statusPending,
        ]}
      >
        <Text
          style={[
            styles.statusSymbol,
            status === 'pending' && styles.statusPendingText,
          ]}
        >
          {status === 'complete' ? '✓' : status === 'loading' ? '•' : '○'}
        </Text>
      </View>

      <Text style={styles.statusTitle}>{title}</Text>

      <Text
        style={[
          styles.statusLabel,
          status === 'complete' && styles.labelComplete,
          status === 'loading' && styles.labelLoading,
          status === 'pending' && styles.labelPending,
        ]}
      >
        {status === 'complete'
          ? 'Done'
          : status === 'loading'
            ? 'In Progress'
            : 'Pending'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 390,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    minHeight: 844,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 96,
    paddingBottom: 42,
  },
  visualWrap: {
    width: 250,
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  ringLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.14)',
  },
  ringMedium: {
    position: 'absolute',
    width: 174,
    height: 174,
    borderRadius: 87,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.23)',
  },
  ringSmall: {
    position: 'absolute',
    width: 126,
    height: 126,
    borderRadius: 63,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.34)',
  },
  scanningBadge: {
    position: 'absolute',
    top: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#151B50',
    borderWidth: 1,
    borderColor: '#7C3AED',
  },
  scanningText: {
    color: '#D8CCFF',
    fontSize: 12,
    fontWeight: '800',
  },
  logoGlow: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(124,58,237,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: 76,
    height: 76,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7447F5',
    shadowOpacity: 0.55,
    shadowRadius: 24,
  },
  logo: {
    color: 'white',
    fontSize: 38,
    fontWeight: '900',
  },
  progressOuter: {
    position: 'absolute',
    bottom: 34,
    width: 122,
    height: 8,
    borderRadius: 12,
    backgroundColor: '#1B2A55',
    overflow: 'hidden',
  },
  progressInner: {
    width: '68%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
  },
  pill: {
    color: '#C7B8FF',
    borderColor: '#7C3AED',
    borderWidth: 1,
    backgroundColor: 'rgba(25,31,78,0.8)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 16,
  },
  title: {
    color: 'white',
    fontSize: 27,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 14,
  },
  subtitle: {
    color: '#AEB8D6',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 305,
    marginBottom: 28,
  },
  statusCard: {
    width: '100%',
    backgroundColor: '#111F44',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#20335F',
    overflow: 'hidden',
  },
  statusRow: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusComplete: {
    borderWidth: 1.5,
    borderColor: '#22C55E',
  },
  statusLoading: {
    backgroundColor: '#7C3AED',
  },
  statusPending: {
    borderWidth: 1.5,
    borderColor: '#52618A',
  },
  statusSymbol: {
    color: 'white',
    fontSize: 13,
    fontWeight: '900',
  },
  statusPendingText: {
    color: '#52618A',
  },
  statusTitle: {
    flex: 1,
    color: '#D9E0F7',
    fontSize: 12.5,
    fontWeight: '700',
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '800',
  },
  labelComplete: {
    color: '#22C55E',
  },
  labelLoading: {
    color: '#C7B8FF',
  },
  labelPending: {
    color: '#65729A',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(32,51,95,0.7)',
    marginLeft: 52,
  },
  footer: {
    width: '100%',
    marginTop: 'auto',
    paddingTop: 28,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 14,
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 14,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.45,
    shadowRadius: 18,
  },
  primaryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
  },
  arrow: {
    color: 'white',
    fontSize: 22,
  },
  helperText: {
    color: '#65729A',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
  
});