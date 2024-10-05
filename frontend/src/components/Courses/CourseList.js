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

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/courses");
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Course List
      </Typography>
      <List>
        {courses.map((course) => (
          <ListItem key={course._id}>
            <ListItemText
              primary={course.name}
              secondary={course.description}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CourseList;
