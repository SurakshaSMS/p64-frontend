import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type MarkAsSafeModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function MarkAsSafeModal({
  visible,
  onClose,
  onConfirm,
}: MarkAsSafeModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.safeCircleOuter}>
            <View style={styles.safeCircle}>
              <Text style={styles.safeShield}>
                ✓
              </Text>
            </View>
          </View>

          <Text style={styles.modalTitle}>
            Mark as Safe?
          </Text>

          <Text style={styles.modalDescription}>
            Are you sure this message is safe? This will
            help improve future detection.
          </Text>

          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackText}>
              ✓ Your feedback trains our AI to detect scams better.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={onConfirm}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmText}>
              ✓ Confirm
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalCancelButton}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={styles.modalCancelText}>
              × Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  modalCard: {
    width: "100%",
    maxWidth: 390,

    backgroundColor: "#0D215A",

    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#13D67A",

    padding: 20,

    alignItems: "center",
  },

  safeCircleOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,

    backgroundColor: "#092C23",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#13D67A",

    marginBottom: 15,
  },

  safeCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,

    backgroundColor: "#0B5036",

    borderWidth: 2,
    borderColor: "#13D67A",

    alignItems: "center",
    justifyContent: "center",
  },

  safeShield: {
    color: "#13D67A",
    fontSize: 23,
    fontWeight: "900",
  },

  modalTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  modalDescription: {
    color: "#9AA7C7",
    fontSize: 11,
    lineHeight: 17,

    textAlign: "center",

    marginTop: 9,
    marginBottom: 15,

    maxWidth: 290,
  },

  feedbackBox: {
    width: "100%",

    backgroundColor: "#082D21",

    borderWidth: 1,
    borderColor: "#13D67A",
    borderRadius: 11,

    padding: 12,

    marginBottom: 16,
  },

  feedbackText: {
    color: "#13D67A",
    fontSize: 10,
    textAlign: "center",
  },

  confirmButton: {
    width: "100%",
    minHeight: 50,

    borderRadius: 11,
    backgroundColor: "#13A95F",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 9,
  },

  confirmText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  modalCancelButton: {
    width: "100%",
    minHeight: 45,

    borderRadius: 11,

    borderWidth: 1,
    borderColor: "#263D76",

    alignItems: "center",
    justifyContent: "center",
  },

  modalCancelText: {
    color: "#8190B4",
    fontSize: 11,
  },
});