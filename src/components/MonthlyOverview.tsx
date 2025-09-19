import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";

const MainPaper = styled(Paper)`
  padding: 24px;
  flex: 1;
`;

const HeaderBox = styled(Box)`
  margin-bottom: 16px;
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
`;

const YearSelectBox = styled(Box)`
  display: flex;
  gap: 16px;
  align-items: center;
`;

interface MonthlyOverviewProps {
  year: number;
  onYearChange: (year: number) => void;
  enabledMonths: Set<number>;
  onEnabledMonthsChange: (months: Set<number>) => void;
  contributions: {
    employer: number;
    employee: number;
    visits: number;
  }[];
  onEditMonth: (month: number) => void;
}

export function MonthlyOverview({
  year,
  onYearChange,
  enabledMonths,
  onEnabledMonthsChange,
  contributions,
  onEditMonth,
}: MonthlyOverviewProps) {
  return (
    <MainPaper elevation={3}>
      <HeaderBox>
        <YearSelectBox>
          <Typography variant="h6">Monthly Overview</Typography>
          <Select
            value={year}
            onChange={(e) => onYearChange(e.target.value as number)}
            size="small"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const yearOption = new Date().getFullYear() - i;
              return (
                <MenuItem key={yearOption} value={yearOption}>
                  {yearOption}
                </MenuItem>
              );
            })}
          </Select>
        </YearSelectBox>
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
                    onEnabledMonthsChange(
                      new Set(Array.from({ length: 12 }, (_, i) => i))
                    );
                  } else {
                    onEnabledMonthsChange(new Set());
                  }
                }}
              />
            }
            label="Select All Months"
          />
        </Box>
      </HeaderBox>
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
              const contribution = contributions[month] || {
                visits: 0,
                employer: 0,
                employee: 0,
              };
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
                        onEnabledMonthsChange(newEnabledMonths);
                      }}
                    />
                  </TableCell>
                  <TableCell>{contribution.visits}</TableCell>
                  <TableCell align="right">
                    {contribution.employer.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {contribution.employee.toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => onEditMonth(month)}
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
    </MainPaper>
  );
}
