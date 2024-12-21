import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TaskList from './TaskList';
import ProjectList from './ProjectList';
import CalendarView from './CalendarView';
import NoteEditor from './NoteEditor';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>
      <Grid container spacing={2} sx={{ height: 'calc(100vh - 140px)' }}>
        {/* Tasks Section */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 2,
              height: '100%',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 3,
              },
            }}
            onClick={() => navigate('/tasks')}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Tasks
            </Typography>
            <TaskList />
          </Paper>
        </Grid>

        {/* Projects Section */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 2,
              height: '100%',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Projects
            </Typography>
            <ProjectList />
          </Paper>
        </Grid>

        {/* Calendar Section */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 2,
              height: '100%',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Calendar
            </Typography>
            <CalendarView />
          </Paper>
        </Grid>

        {/* Notes Section */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              height: '100%',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Notes
            </Typography>
            <NoteEditor />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
