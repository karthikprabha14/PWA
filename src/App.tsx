

import React, { useEffect } from 'react';
import './App.css';
// import { } from './notificationHelpers';
import { useVisibilityChange } from './useVisibilityChange';
import { messaging, onMessage } from './firebase';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useNavigate,
} from "react-router-dom";
import Courses from './Courses';
import { Calendar, Grades, Organisations } from './Calendar';
import { AppBar, ListItemIcon, Typography } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useMediaQuery } from '@mui/material';


const Layout: React.FC = () => {
  const isDesktop = useMediaQuery('(min-width:600px)');

  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [title, setTitle] = React.useState('Courses');

  const navigate = useNavigate();

  const list = () => (
    <List>
      {['Courses', 'Calendars', 'Organisations', 'Grades'].map((text) => (
        <ListItem key={text} onClick={() => handleListItemClick(text)}>
          <ListItemButton>
            <ListItemIcon sx={{ minWidth: 30 }}>
              <CalendarMonthIcon />
            </ListItemIcon>
            <ListItemText primary={text} sx={{ paddingRight: 0 }} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setOpenDrawer(open);
  };

  const handleListItemClick = (text: string) => {
    setTitle(text);
    if (text === "Courses") {
      navigate('/');
    } else if (text === "Calendars") {
      navigate('/calendar/');
    } else if (text === "Organisations") {
      navigate('/organisations/');
    } else if (text === "Grades") {
      navigate('/grades/');
    }
    setOpenDrawer(false); // Close drawer after navigation
  };

  return (
    <div style={{ height: '100%'}}>
      <AppBar position="fixed" sx={{backgroundColor: '#191919'}}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1, minWidth: 30 }}>
            {title}
          </Typography>
          <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false)}>
            {list()}
          </Drawer>
        </Toolbar>
      </AppBar>
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', marginTop: isDesktop ? '64px' : '56px'}}>
        <Outlet />
      </div>
    </div>
  );
};

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Courses />,
        },
        {
          path: "calendar/",
          element: <Calendar />,
        },
        {
          path: "organisations/",
          element: <Organisations />,
        },
        {
          path: "grades/",
          element: <Grades />,
        },
      ],
    },
  ],
);

const App: React.FC = () => {
  return (
     <RouterProvider router={router} />
  );
};

// Handle incoming messages
onMessage(messaging, (payload) => {
  console.log('Received a message:', payload);
  // Display a notification or update UI based on the message
  if (payload.notification) {
    const notification = new Notification(payload.notification.title || '', {
      body: payload.notification.body || '',
    });
  }
});

const onFcmTokenReceived = (event: MessageEvent) => {
  console.log('Received Token from Android :', event.data);
  console.log('Parsed Token from Android :', JSON.stringify(event.data));
}

window.addEventListener('message', onFcmTokenReceived); 

export default App;
