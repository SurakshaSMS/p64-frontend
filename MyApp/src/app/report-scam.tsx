import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

export default function ReportScamScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Report Scam</Text>

        <Text style={styles.subtitle}>
          Help us understand why you think this message is a scam.
        </Text>

        <Text style={styles.label}>Reason for reporting</Text>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Suspicious link</Text>
          <Text style={styles.circle}>○</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Asking for personal information</Text>
          <Text style={styles.circle}>○</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Pretending to be someone else</Text>
          <Text style={styles.circle}>○</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Other</Text>
          <Text style={styles.circle}>○</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Additional details</Text>

        <TextInput
          style={styles.input}
          placeholder="Tell us more about this message..."
          placeholderTextColor="#64729A"
          multiline
        />

        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => router.push('/report-modal')}
        >
          <Text style={styles.reportText}>Report Scam</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06143A',
    alignItems: 'center',
  },

  content: {
    width: '100%',
    maxWidth: 390,
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
  },

  back: {
    color: '#FFFFFF',
    fontSize: 28,
    marginBottom: 25,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
  },

  subtitle: {
    color: '#9CA8C9',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 30,
  },

  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 10,
  },

  option: {
    width: '100%',
    minHeight: 54,
    backgroundColor: '#111F44',
    borderWidth: 1,
    borderColor: '#20335F',
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optionText: {
    color: '#DCE4FF',
    fontSize: 13,
  },

  circle: {
    color: '#8A63FF',
    fontSize: 22,
  },

  input: {
    width: '100%',
    height: 110,
    backgroundColor: '#111F44',
    borderWidth: 1,
    borderColor: '#20335F',
    borderRadius: 12,
    color: '#FFFFFF',
    padding: 15,
    textAlignVertical: 'top',
    marginBottom: 24,
  },

  reportButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  reportText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});