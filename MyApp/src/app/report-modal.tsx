import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ReportModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>!</Text>
          </View>

          <Text style={styles.title}>Mark as Safe?</Text>

          <Text style={styles.description}>
            Are you sure you want to mark this message as safe?
          </Text>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => router.push('/marked-safe')}
          >
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#06143A',
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  modal: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#101F45',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#20335F',
    padding: 24,
    alignItems: 'center',
  },

  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  icon: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
  },

  description: {
    color: '#AAB4D6',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },

  confirmButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#22C55E',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  confirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  cancelButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#172750',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A3D70',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    color: '#DCE4FF',
    fontSize: 14,
    fontWeight: '700',
  },
});