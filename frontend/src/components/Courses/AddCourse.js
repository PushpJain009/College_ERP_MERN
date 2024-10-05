import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";

const AddCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");

  const handleAddCourse = async () => {
    try {
      await axios.post("/api/courses", { name: courseName, description });
      alert("Course added successfully");
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
        Add Course
      </Typography>
      <TextField
        label="Course Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
      />
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleAddCourse}
        sx={{ marginTop: "20px" }}
      >
        Add Course
      </Button>
    </Box>
  );
};

export default AddCourse;
