// ./hooks/chat/useSimpleDialog.js

import { useCallback, useContext } from "react";
import { AppContext } from "../contexts";

export const useSimpleDialog = () => {
  const { simpleDialog, setSimpleDialog } = useContext(AppContext);

  const showSimpleDialog = useCallback(
    ({ title, content, closeButtonText, onClose, show = true }) => {
      setSimpleDialog({
        title,
        content,
        closeButtonText,
        onClose,
        show,
      });
    },
    [simpleDialog, setSimpleDialog]
  );

  const clearSimpleDialog = useCallback(() => {
    showSimpleDialog({
      ...simpleDialog,
      show: false,
    });
  }, [showSimpleDialog]);
  return {
    clearSimpleDialog,
    showSimpleDialog,
    simpleDialog,
    setSimpleDialog,
  };
};
