"use client";

import {useTranslations} from 'next-intl';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Utils from "@utils";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../contexts";

const SimpleDialog = () => {
  const t = useTranslations('common');
  const router = useRouter();
  const [openState, setOpenState] = useState(false);
  const { simpleDialog, setSimpleDialog } = useContext(AppContext);
  const [dialogState, setDialogState] = useState({});

  useEffect(() => {
    setDialogState(simpleDialog);
    setOpenState(simpleDialog?.show);
  }, [
    simpleDialog?.show,
    simpleDialog?.title,
    simpleDialog?.content,
    simpleDialog?.closeButtonText,
    simpleDialog,
  ]);

  const handleClose = () => {
    console.debug("SimpleDialog handleClose", {
      dialogState,
      typeof: typeof dialogState.onClose,
      validateUrl: Utils.isValidUrlForDomain(dialogState.onClose),
    });
    if (typeof dialogState.onClose === "function") {
      dialogState.onClose();
    } else if (Utils.isValidUrlForDomain(dialogState.onClose)) {
      router.push(dialogState.onClose);
    }
    setOpenState(false);
  };

  return (
    <Dialog
      open={openState}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{dialogState?.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{dialogState?.content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained" autoFocus>
          {dialogState?.closeButtonText || t('buttons.dismiss')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SimpleDialog;
