import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Card,
  Grid2,
  Alert,
  Snackbar,
  CardContent,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface LoginFormInputs {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const onSubmit = (data: LoginFormInputs) => {
    // Fake authentication
    if (data.username === "admin" && data.password === "admin") {
      navigate("/orders");
    } else {
      setSnackbarOpen(true);
    }
  };

  return (
    <Card elevation={16}>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container spacing={3} sx={{ my: 3 }}>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Username"
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid2>
          </Grid2>
          <Box>
            <Button size="large" type="submit" variant="contained" fullWidth>
              Login
            </Button>
          </Box>
        </form>
      </CardContent>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%", display: 'flex', alignItems: 'center'}}
        >
          <Typography
            component="span"
            sx={{ fontSize: "1.1rem", mt: 2 }}
          >
            Invalid credentials
          </Typography>
        </Alert>
      </Snackbar>
    </Card>
  );
};

const schema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(4, "Password must be at least 4 characters long"),
});

export default LoginForm;
