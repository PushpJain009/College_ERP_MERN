import React from "react";
import { Button, Grid, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h3" sx={{ marginBottom: "20px" }}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/manage-courses")}
            sx={{ padding: "20px" }}
          >
            Manage Courses
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/manage-students")}
            sx={{ padding: "20px" }}
          >
            Manage Students
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/manage-teachers")}
            sx={{ padding: "20px" }}
          >
            Manage Teachers
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
