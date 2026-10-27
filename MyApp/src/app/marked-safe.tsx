import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function MarkedSafeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.check}>✓</Text>
      </View>

      <Text style={styles.title}>Marked as Safe</Text>

      <Text style={styles.description}>
        This message has been marked as safe.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06143A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  check: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
  },

  description: {
    color: '#AAB4D6',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 36,
  },

  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});