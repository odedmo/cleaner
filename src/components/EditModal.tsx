import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  Box,
} from "@mui/material";

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  month: number;
  currentVisits: number;
  onSave: (visits: number) => void;
}

export function EditModal({
  open,
  onClose,
  month,
  currentVisits,
  onSave,
}: EditModalProps) {
  const [visits, setVisits] = useState(currentVisits);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Edit {new Date(0, month).toLocaleString("default", { month: "long" })}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Select
            value={visits}
            onChange={(e) => setVisits(Number(e.target.value))}
            fullWidth
            size="small"
          >
            <MenuItem value={0}>None</MenuItem>
            <MenuItem value={1}>Once</MenuItem>
            <MenuItem value={2}>Twice</MenuItem>
          </Select>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            onSave(visits);
            onClose();
          }}
          variant="contained"
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
