import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleBoxClick = (route: string, event: React.MouseEvent) => {
    // If the click is on an interactive element, don't navigate
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' || 
      target.tagName === 'BUTTON' ||
      target.closest('.task-item') ||
      target.closest('.todo-item') ||
      target.closest('.note-item') ||
      target.closest('.event-item') ||
      target.closest('.add-note-btn')
    ) {
      return;
    }
    navigate(route);
  };

  const handleTaskClick = (taskId: string) => {
    // Navigate to specific task
    console.log('Navigate to task:', taskId);
  };

  const handleNoteClick = (noteId: string) => {
    // Navigate to specific note
    console.log('Navigate to note:', noteId);
  };

  const handleEventClick = (eventId: string) => {
    // Navigate to specific event
    console.log('Navigate to event:', eventId);
  };

  return (
    <div className="dashboard">
      <div className="bento-grid">
        <div 
          className="bento-box tasks-box"
          onClick={(e) => handleBoxClick('/tasks', e)}
        >
          <div className="bento-box-header">
            <h2>Tasks</h2>
          </div>
          <div className="bento-box-content">
            <div className="task-list">
              <div 
                className="task-item"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskClick('task1');
                }}
              >
                <div className="task-status in-progress"></div>
                <div className="task-info">
                  <span className="task-title">Project Proposal</span>
                  <span className="task-due">Due Tomorrow</span>
                </div>
              </div>
              <div 
                className="task-item"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTaskClick('task2');
                }}
              >
                <div className="task-status pending"></div>
                <div className="task-info">
                  <span className="task-title">Client Presentation</span>
                  <span className="task-due">Due in 3 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="bento-box calendar-view-box"
          onClick={(e) => handleBoxClick('/calendar', e)}
        >
          <div className="bento-box-header">
            <h2>Calendar</h2>
          </div>
          <div className="bento-box-content">
            <div className="mini-calendar">
              <div className="calendar-header">
                <span>December 2024</span>
              </div>
              <div className="calendar-grid">
                <div className="calendar-placeholder">
                  Calendar View Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="bento-box notes-box"
          onClick={(e) => handleBoxClick('/notes', e)}
        >
          <div className="bento-box-header">
            <h2>Quick Notes</h2>
          </div>
          <div className="bento-box-content">
            <div className="notes-list">
              <div 
                className="note-item"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNoteClick('note1');
                }}
              >
                <div className="note-content">
                  <h3>Project Ideas</h3>
                  <p>- Implement new dashboard features<br/>- Add dark mode support<br/>- Optimize mobile view</p>
                </div>
                <span className="note-time">2 hours ago</span>
              </div>
              <div 
                className="note-item"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNoteClick('note2');
                }}
              >
                <div className="note-content">
                  <h3>Meeting Notes</h3>
                  <p>Discussed upcoming features and timeline for Q1 2024</p>
                </div>
                <span className="note-time">Yesterday</span>
              </div>
            </div>
            <button 
              className="add-note-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/notes/new');
              }}
            >
              <i className="fas fa-plus"></i> Quick Note
            </button>
          </div>
        </div>

        <div 
          className="bento-box todos-box"
          onClick={(e) => handleBoxClick('/todos', e)}
        >
          <div className="bento-box-header">
            <h2>To-dos</h2>
          </div>
          <div className="bento-box-content">
            <div className="todo-list">
              <div className="todo-item">
                <input 
                  type="checkbox" 
                  onClick={(e) => e.stopPropagation()}
                />
                <span>Review documentation</span>
              </div>
              <div className="todo-item">
                <input 
                  type="checkbox" 
                  onClick={(e) => e.stopPropagation()}
                />
                <span>Send follow-up email</span>
              </div>
              <div className="todo-item">
                <input 
                  type="checkbox" 
                  onClick={(e) => e.stopPropagation()}
                />
                <span>Update weekly report</span>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="bento-box upcoming-box"
          onClick={(e) => handleBoxClick('/calendar', e)}
        >
          <div className="bento-box-header">
            <h2>Upcoming</h2>
          </div>
          <div className="bento-box-content">
            <div className="event-list">
              <div 
                className="event-item"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick('event1');
                }}
              >
                <div className="event-time">10:00 AM</div>
                <div className="event-details">
                  <h3>Team Standup</h3>
                  <p>Daily sync meeting</p>
                </div>
              </div>
              <div 
                className="event-item"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEventClick('event2');
                }}
              >
                <div className="event-time">2:00 PM</div>
                <div className="event-details">
                  <h3>Client Meeting</h3>
                  <p>Project review</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;