import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";

const AddStudent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");

  const handleAddStudent = async () => {
    try {
      await axios.post("/api/students", { name, email, course });
      alert("Student added successfully");
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <Box
      className="container"
      sx={{ maxWidth: "600px", margin: "auto", padding: "20px" }}
    >
      <Typography variant="h4" component="h1" sx={{ marginBottom: "20px" }}>
        Add Student
      </Typography>
      <TextField
        label="Student Name"
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
        label="Course"
        variant="outlined"
        fullWidth
        margin="normal"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleAddStudent}
        sx={{ marginTop: "20px" }}
      >
        Add Student
      </Button>
    </Box>
  );
};

export default AddStudent;
