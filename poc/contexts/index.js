// ./contexts/index.js
import { createContext, useContext, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [showRouterLoading, setShowRouterLoading] = useState(false);
  const [appContext, setAppContext] = useState({});
  const [searchState, setSearchState] = useState({});

  const [simpleDialog, setSimpleDialog] = useState({
    show: false,
    title: "",
    content: "",
    closeButtonText: "",
    onClose: false,
  });

  const defaultConfirmDialog = {
    title: "",
    content: "",
    open: false,
    onConfirm: false,
    onCancel: false,
    onClose: false,
    children: null,
    confirmButtonClass: "btn-primary",
    cancelButtonClass: "btn-secondary",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
  };

  const [confirmDialog, setConfirmDialogState] = useState(defaultConfirmDialog);

  const resetConfirmDialog = () => {
    setConfirmDialog(defaultConfirmDialog);
  };

  const setConfirmDialog = (options) => {
    if (typeof options === "function") {
      setConfirmDialogState(options(confirmDialog));
    } else {
      setConfirmDialogState({ ...defaultConfirmDialog, ...options });
    }
  };

  return (
    <AppContext.Provider
      value={{
        searchState,
        setSearchState,
        appContext,
        setAppContext,
        confirmDialog,
        setConfirmDialog,
        resetConfirmDialog,
        simpleDialog,
        setSimpleDialog,
        showRouterLoading,
        setShowRouterLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
