import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";

const StudentDashboard = () => {
  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h3" sx={{ marginBottom: "20px" }}>
        Student Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            fullWidth
            sx={{ padding: "20px", backgroundColor: "#1976d2", color: "white" }}
          >
            View Courses
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            fullWidth
            sx={{ padding: "20px", backgroundColor: "#1976d2", color: "white" }}
          >
            View Grades
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
