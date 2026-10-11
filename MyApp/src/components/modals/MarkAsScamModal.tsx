import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type MarkAsScamModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function MarkAsScamModal({
  visible,
  onClose,
  onConfirm,
}: MarkAsScamModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.scamCircleOuter}>
            <View style={styles.scamCircle}>
              <Text style={styles.scamIcon}>!</Text>
            </View>
          </View>

          <Text style={styles.modalTitle}>
            Report as Scam?
          </Text>

          <Text style={styles.modalDescription}>
            Are you sure this message is a scam? Your feedback will help improve
            future scam detection.
          </Text>

          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackText}>
              ! Your feedback helps our AI identify suspicious messages more accurately.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={onConfirm}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmText}>
              ⚑ Confirm Report
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
    borderColor: "#FF405B",

    padding: 20,

    alignItems: "center",
  },

  scamCircleOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,

    backgroundColor: "#32172A",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#FF405B",

    marginBottom: 15,
  },

  scamCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,

    backgroundColor: "#451A2A",

    borderWidth: 2,
    borderColor: "#FF405B",

    alignItems: "center",
    justifyContent: "center",
  },

  scamIcon: {
    color: "#FF405B",
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

    backgroundColor: "#35142A",

    borderWidth: 1,
    borderColor: "#FF405B",
    borderRadius: 11,

    padding: 12,

    marginBottom: 16,
  },

  feedbackText: {
    color: "#FF6B80",
    fontSize: 10,
    textAlign: "center",
  },

  confirmButton: {
    width: "100%",
    minHeight: 50,

    borderRadius: 11,
    backgroundColor: "#E92F4F",

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