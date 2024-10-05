import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await axios.post("/api/auth/login", { email, password });
      alert("Login Successful");
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <Box
      className="container"
      sx={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" component="h1" sx={{ marginBottom: "20px" }}>
        Login
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
        sx={{ marginTop: "20px" }}
      >
        Login
      </Button>
    </Box>
  );
};

export default Login;
