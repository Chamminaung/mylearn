import React, { createContext, useContext, useState } from "react";
import { Alert, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [modalData, setModalData] = useState(null);

  const showAlert = (title, message) => {
    if (Platform.OS === "web") {
      setModalData({
        type: "alert",
        title,
        message,
        onConfirm: () => setModalData(null),
      });
    } else {
      Alert.alert(title, message);
    }
  };

  const showConfirm = ({ title, description, destructive, onConfirm }) => {
    if (Platform.OS === "web") {
      setModalData({
        type: "confirm",
        title,
        message: description,
        destructive,
        onConfirm: () => {
          setModalData(null);
          onConfirm && onConfirm();
        },
        onCancel: () => setModalData(null),
      });
    } else {
      Alert.alert(
        title,
        description,
        [
          { text: "Cancel", style: "cancel" },
          { text: "OK", onPress: onConfirm, style: destructive ? "destructive" : "default" },
        ],
        { cancelable: true }
      );
    }
  };

  const closeModal = () => setModalData(null);

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {modalData && Platform.OS === "web" && (
        <Modal transparent visible>
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <Text style={styles.title}>{modalData.title}</Text>
              <Text style={styles.message}>{modalData.message}</Text>
              <View style={styles.buttons}>
                {modalData.type === "confirm" && (
                  <Pressable style={styles.button} onPress={modalData.onCancel}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </Pressable>
                )}
                <Pressable style={[styles.button, modalData.destructive && { backgroundColor: "#f87171" }]} onPress={modalData.onConfirm}>
                  <Text style={styles.buttonText}>OK</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    maxWidth: 400,
    width: "90%",
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  message: { fontSize: 16, marginBottom: 20 },
  buttons: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});


// import { createContext, useContext, useState } from "react";
// import AlertDialog from "@/components/AlertDialog";
// import ConfirmDialog from "@/components/ConfirmDialog";

// const AlertContext = createContext(null);

// export function AlertProvider({ children }) {
//   const [alert, setAlert] = useState(null);
//   const [confirm, setConfirm] = useState(null);

//   const showAlert = (title, description = "") =>
//     setAlert({ title, description });

//   const showConfirm = ({
//     title,
//     description,
//     onConfirm,
//     destructive = false,
//   }) =>
//     setConfirm({ title, description, onConfirm, destructive });

//   return (
//     <AlertContext.Provider value={{ showAlert, showConfirm }}>
//       {children}

//       {/* Alert */}
//       {alert && (
//         <AlertDialog
//           visible
//           title={alert.title}
//           description={alert.description}
//           onConfirm={() => setAlert(null)}
//         />
//       )}

//       {/* Confirm */}
//       {confirm && (
//         <ConfirmDialog
//           visible
//           title={confirm.title}
//           description={confirm.description}
//           destructive={confirm.destructive}
//           onCancel={() => setConfirm(null)}
//           onConfirm={() => {
//             confirm.onConfirm?.();
//             setConfirm(null);
//           }}
//         />
//       )}
//     </AlertContext.Provider>
//   );
// }

// export const useAlert = () => useContext(AlertContext);
