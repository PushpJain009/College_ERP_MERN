import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("/api/students");
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Student List
      </Typography>
      <List>
        {students.map((student) => (
          <ListItem key={student._id}>
            <ListItemText primary={student.name} secondary={student.email} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default StudentList;
