// File: react/components/Dashboard/manage/EditorFormFields/ConfirmDialog.js
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const ConfirmDialog = ({ open, handleClose, handleConfirm, confirmMessage }) => {
  const onConfirm = () => {
    handleConfirm();
    onClose();
  };

  const onClose = () => {
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Confirm Action"}</DialogTitle>
      <DialogContent>
        <Typography id="alert-dialog-description">
          <span dangerouslySetInnerHTML={{ __html: confirmMessage }}></span>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
