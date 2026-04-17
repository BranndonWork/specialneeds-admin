import { AppContext } from "@root/contexts";
import React, { useContext, useEffect } from "react";
import ConfirmDialog from "./ConfirmDialog";

const ConfirmDialogWrapper = (props) => {
  const { confirmDialog, setConfirmDialog, resetConfirmDialog } = useContext(AppContext);

  useEffect(() => {
    if (confirmDialog.open && !confirmDialog.setByWrapper) return;

    if (props.open) {
      setConfirmDialog({ ...props, setByWrapper: true });
    } else {
      resetConfirmDialog();
    }
  }, [props?.open, confirmDialog.open, confirmDialog.setByWrapper, props, resetConfirmDialog, setConfirmDialog]);

  return <ConfirmDialog />;
};

export default ConfirmDialogWrapper;
