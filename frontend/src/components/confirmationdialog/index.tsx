import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";

interface ConfirmationDialogProps {
  open: boolean;
  heading: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, heading, message, onConfirm, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "8px", // Round the corners of the dialog box
        }
      }}
    >
      <DialogTitle sx={{ borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}>
        {heading}
      </DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions
        sx={{
          borderBottomLeftRadius: "12px", 
          borderBottomRightRadius: "12px",
          paddingBottom: "12px", // To give some breathing space
        }}
      >
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose(); 
          }}
          color="primary"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
