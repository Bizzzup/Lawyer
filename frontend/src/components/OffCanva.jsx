import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home as HomeIcon,
  Article as ArticleIcon,
  History as HistoryIcon,
  ChatTwoTone as ChatTwoToneIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

const OffCanva = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const sections = [
    { name: 'Home', path: '/', icon: <HomeIcon /> },
    { name: 'All Case', path: '/allcase', icon: <ArticleIcon /> },
    { name: 'History', path: '/history', icon: <HistoryIcon /> },
    { name: 'Chat Bot', path: '/chat', icon: <ChatTwoToneIcon /> }
  ];

  return (
    <div>
      {/* Toggle Button - visible only on small screens */}
      <Button variant="dark" onClick={handleShow} className="d-lg-none mb-2">
        <MenuIcon className="text-light" />
      </Button>

      {/* Offcanvas Sidebar */}
      <Offcanvas show={show} onHide={handleClose} placement="start" className="bg-dark text-white">
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <nav className="nav flex-column">
            {sections.map((section) => (
              <Link
                key={section.name}
                to={section.path}
                onClick={handleClose}
                className="nav-link d-flex align-items-center text-white mb-2"
              >
                <span className="me-2">{section.icon}</span>
                {section.name}
              </Link>
            ))}
          </nav>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default OffCanva;
