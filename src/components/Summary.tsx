import { Box, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const SummaryPaper = styled(Paper)`
  padding: 24px;
`;

const SummarySection = styled(Box)`
  margin-top: 24px;
`;

interface SummaryProps {
  year: number;
  enabledMonths: Set<number>;
  contributions: {
    employer: number;
    employee: number;
  }[];
}

export function Summary({ year, enabledMonths, contributions }: SummaryProps) {
  const enabledContributions = Array.from(enabledMonths).map(
    (month) => contributions[month] || { employer: 0, employee: 0 }
  );

  const totalEmployer = enabledContributions.reduce(
    (sum, { employer }) => sum + employer,
    0
  );

  const totalEmployee = enabledContributions.reduce(
    (sum, { employee }) => sum + employee,
    0
  );

  return (
    <SummaryPaper elevation={3}>
      <Typography variant="h6" gutterBottom>
        Summary for {year}
      </Typography>
      <SummarySection>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Employer Total Contribution
        </Typography>
        <Typography variant="h5" gutterBottom>
          {totalEmployer.toFixed(2)} ₪
        </Typography>
      </SummarySection>
      <SummarySection>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Employee Total Contribution
        </Typography>
        <Typography variant="h5" gutterBottom>
          {totalEmployee.toFixed(2)} ₪
        </Typography>
      </SummarySection>
      <SummarySection>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Total Contributions
        </Typography>
        <Typography variant="h5" gutterBottom>
          {(totalEmployer + totalEmployee).toFixed(2)} ₪
        </Typography>
      </SummarySection>
      <SummarySection>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Months Included
        </Typography>
        <Typography variant="h5">{enabledMonths.size} / 12</Typography>
      </SummarySection>
    </SummaryPaper>
  );
}
