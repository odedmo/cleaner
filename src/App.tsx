import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

type EditModalProps = {
  open: boolean;
  onClose: () => void;
  month: number;
  currentVisits: number;
  onSave: (visits: number) => void;
};

type HistoryRecord = {
  id: string;
  year: number;
  month: number;
  visits: number;
  employerContribution: number;
  employeeContribution: number;
  dateAdded: string;
};

function EditModal({
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

function App() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMonth, setEditingMonth] = useState<number | null>(null);
  const [enabledMonths, setEnabledMonths] = useState<Set<number>>(new Set());
  const BASE_PAYMENT = 260;
  const PENSION_RATE = 0.125;
  const BENEFITS_RATE = 0.06;
  const CLEANER_RATE = BENEFITS_RATE; // 6% is the cleaner's share

  const calculateMonthlyPension = (visitsCount: number) => {
    const totalPerVisit = BASE_PAYMENT * (PENSION_RATE + BENEFITS_RATE);
    return (totalPerVisit * visitsCount).toFixed(2);
  };

  const calculateCleanerShare = (visitsCount: number) => {
    const sharePerVisit = BASE_PAYMENT * CLEANER_RATE;
    return sharePerVisit * visitsCount;
  };

  const handleSave = (month: number, visits: number) => {
    const employerContribution = parseFloat(calculateMonthlyPension(visits));
    const employeeContribution = calculateCleanerShare(visits);

    const record: HistoryRecord = {
      id: crypto.randomUUID(),
      year: selectedYear,
      month,
      visits,
      employerContribution,
      employeeContribution,
      dateAdded: new Date().toISOString(),
    };

    setHistory((prev) => [...prev, record]);
  };

  const handleEditMonth = (month: number) => {
    setEditingMonth(month);
    setEditModalOpen(true);
  };

  const getMonthVisits = (month: number): number => {
    const record = history
      .filter((r) => r.year === selectedYear && r.month === month)
      .sort(
        (a, b) =>
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      )[0];
    return record?.visits || 0;
  };

  const getMonthContributions = (month: number) => {
    const record = history
      .filter((r) => r.year === selectedYear && r.month === month)
      .sort(
        (a, b) =>
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      )[0];
    return {
      employer: record?.employerContribution || 0,
      employee: record?.employeeContribution || 0,
    };
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, mx: 'auto', width: '100%' }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Cleaner Pension Calculator
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            gap: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="h6">Monthly Overview</Typography>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value as number)}
              size="small"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={enabledMonths.size === 12}
                  indeterminate={
                    enabledMonths.size > 0 && enabledMonths.size < 12
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setEnabledMonths(
                        new Set(Array.from({ length: 12 }, (_, i) => i))
                      );
                    } else {
                      setEnabledMonths(new Set());
                    }
                  }}
                />
              }
              label="Select All Months"
            />
          </Box>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>Include</TableCell>
                <TableCell>Visits</TableCell>
                <TableCell align="right">Employer Share (₪)</TableCell>
                <TableCell align="right">Employee Share (₪)</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 12 }, (_, month) => {
                const contributions = getMonthContributions(month);
                return (
                  <TableRow key={month}>
                    <TableCell>
                      {new Date(0, month).toLocaleString("default", {
                        month: "long",
                      })}
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={enabledMonths.has(month)}
                        onChange={(e) => {
                          const newEnabledMonths = new Set(enabledMonths);
                          if (e.target.checked) {
                            newEnabledMonths.add(month);
                          } else {
                            newEnabledMonths.delete(month);
                          }
                          setEnabledMonths(newEnabledMonths);
                        }}
                      />
                    </TableCell>
                    <TableCell>{getMonthVisits(month)}</TableCell>
                    <TableCell align="right">
                      {contributions.employer.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      {contributions.employee.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditMonth(month)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

        <Paper elevation={3} sx={{ p: 3, minWidth: 300 }}>
          <Typography variant="h6" gutterBottom>
            Summary for {selectedYear}
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Employer Total Contribution
            </Typography>
            <Typography variant="h5" gutterBottom>
              {Array.from(enabledMonths)
                .reduce((sum, month) => {
                  const contributions = getMonthContributions(month);
                  return sum + contributions.employer;
                }, 0)
                .toFixed(2)}{" "}
              ₪
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Employee Total Contribution
            </Typography>
            <Typography variant="h5" gutterBottom>
              {Array.from(enabledMonths)
                .reduce((sum, month) => {
                  const contributions = getMonthContributions(month);
                  return sum + contributions.employee;
                }, 0)
                .toFixed(2)}{" "}
              ₪
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Total Contributions
            </Typography>
            <Typography variant="h5" gutterBottom>
              {Array.from(enabledMonths)
                .reduce((sum, month) => {
                  const contributions = getMonthContributions(month);
                  return sum + contributions.employer + contributions.employee;
                }, 0)
                .toFixed(2)}{" "}
              ₪
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Months Included
            </Typography>
            <Typography variant="h5">
              {enabledMonths.size} / 12
            </Typography>
          </Box>
        </Paper>
      </Box>

      <EditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        month={editingMonth || 0}
        currentVisits={editingMonth !== null ? getMonthVisits(editingMonth) : 0}
        onSave={(visits) => {
          if (editingMonth !== null) {
            handleSave(editingMonth, visits);
          }
        }}
      />
    </Container>
  );
}

export default App;
