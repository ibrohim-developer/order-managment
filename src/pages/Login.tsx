import { Container, Box } from "@mui/material";
import LoginForm from "../common/components/LoginForm";
import React from "react";

const Login: React.FC = () => {
  return (
    <Box
      component="main"
      sx={{
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <LoginForm />
      </Container>
    </Box>
  );
}

export default Login;