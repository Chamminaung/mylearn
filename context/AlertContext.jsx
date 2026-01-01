import { createContext, useContext, useState } from "react";
import AlertDialog from "@/components/AlertDialog";
import ConfirmDialog from "@/components/ConfirmDialog";

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const showAlert = (title, description = "") =>
    setAlert({ title, description });

  const showConfirm = ({
    title,
    description,
    onConfirm,
    destructive = false,
  }) =>
    setConfirm({ title, description, onConfirm, destructive });

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      {/* Alert */}
      {alert && (
        <AlertDialog
          visible
          title={alert.title}
          description={alert.description}
          onConfirm={() => setAlert(null)}
        />
      )}

      {/* Confirm */}
      {confirm && (
        <ConfirmDialog
          visible
          title={confirm.title}
          description={confirm.description}
          destructive={confirm.destructive}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            confirm.onConfirm?.();
            setConfirm(null);
          }}
        />
      )}
    </AlertContext.Provider>
  );
}

export const useAlert = () => useContext(AlertContext);
