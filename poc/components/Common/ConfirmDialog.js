import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../contexts";

const ConfirmDialog = () => {
  const { confirmDialog, resetConfirmDialog } = useContext(AppContext);
  const {
    title,
    content,
    open,
    onConfirm,
    onCancel,
    onClose,
    children,
    confirmButtonClass,
    cancelButtonClass,
    confirmButtonText,
    cancelButtonText,
  } = confirmDialog;

  const [internalOpen, setInternalOpen] = useState(open);
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    setInternalOpen(open);
    if (open) {
      setTimeout(() => {
        if (confirmButtonRef.current) {
          confirmButtonRef.current.focus();
        }
      }, 100);
    }
  }, [open]);

  const handleCancel = (e) => {
    e.preventDefault();
    resetConfirmDialog();
    if (onClose) onClose();
    if (onCancel) onCancel();
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (onClose) onClose();
    if (onConfirm) onConfirm();
    resetConfirmDialog();
  };

  if (!open) return null;

  return (
    <Dialog
      open={internalOpen}
      onClose={handleCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      // sx={{ "& .MuiModal-root": { minWidth: "400px" } }}
      style={{ zIndex: 999999 }}
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
        {children}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCancel}
          color="primary"
          className={`btn ${cancelButtonClass}`}
          sx={{ fontSize: "initial", textTransform: "initial" }}
        >
          {cancelButtonText}
        </Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          ref={confirmButtonRef}
          className={`btn ${confirmButtonClass}`}
          sx={{ fontSize: "initial", textTransform: "initial" }}
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
