import { useState } from "react";
import {
  Container,
  Typography,
  Modal,
  IconButton,
  Button,
  Box,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)`
  padding: 32px 0;
`;

const FlexBox = styled("div")`
  display: flex;
  gap: 24px;
  align-items: flex-start;

  @media (max-width: 995px) {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
`;

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  summary?: React.ReactNode;
}

export function Layout({ children, title, summary }: LayoutProps) {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:995px)");

  return (
    <StyledContainer maxWidth="xl">
      <Typography variant="h3" component="h1" gutterBottom align="center">
        {title}
      </Typography>

      {isMobile && summary && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Button variant="contained" onClick={() => setSummaryOpen(true)}>
            Show summary
          </Button>
        </Box>
      )}

      <FlexBox>
        {children}
        {!isMobile && summary}
      </FlexBox>

      <Modal open={summaryOpen} onClose={() => setSummaryOpen(false)}>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 560,
            maxHeight: "90vh",
            bgcolor: "background.paper",
            borderRadius: 1,
            overflow: "auto",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setSummaryOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>

          {summary}
        </Box>
      </Modal>
    </StyledContainer>
  );
}
