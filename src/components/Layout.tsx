import { Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)`
  padding: 32px 0;
`;

const FlexBox = styled("div")`
  display: flex;
  gap: 24px;
  align-items: flex-start;
`;

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <StyledContainer maxWidth="xl">
      <Typography variant="h3" component="h1" gutterBottom align="center">
        {title}
      </Typography>
      <FlexBox>{children}</FlexBox>
    </StyledContainer>
  );
}
