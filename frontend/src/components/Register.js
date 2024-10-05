import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("/api/auth/register", { name, email, password });
      alert("Registration Successful");
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
        Register
      </Typography>
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
        onClick={handleRegister}
        sx={{ marginTop: "20px" }}
      >
        Register
      </Button>
    </Box>
  );
};

export default Register;
