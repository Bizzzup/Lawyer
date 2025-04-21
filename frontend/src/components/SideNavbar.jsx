import * as React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import useFetch from '../Hooks/useFetch';

import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import ListGroup from 'react-bootstrap/ListGroup';

import {
    Menu as MenuIcon,
    DocumentScanner as DocumentScannerIcon,
    Plagiarism as PlagiarismIcon,
    EventNote as EventNoteIcon,
    MonetizationOn as MonetizationOnIcon,
    Article as ArticleIcon,
} from '@mui/icons-material';

const SideNavbar = () => {
    const [type, loading, error] = useFetch("api/document_type");
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const sections = [
        { name: 'Dates', path: '/dates', icon: <EventNoteIcon /> },
        { name: 'Monetary', path: '/monetary', icon: <MonetizationOnIcon /> },
        { name: 'Sections', path: '/section', icon: <ArticleIcon /> },
    ];

    return (
        <>
            <Button variant="dark" onClick={handleShow}>
                <MenuIcon className="text-light" />
            </Button>

            <Offcanvas show={show} onHide={handleClose} placement="end" className="bg-dark text-white">
                <Offcanvas.Header closeButton closeVariant="white">
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="mb-4">
                        <h5>
                            <DocumentScannerIcon className="me-2" />
                            {type?.document_type || 'Document'}
                        </h5>
                    </div>

                    <ListGroup variant="flush" className="mb-4">
                        <ListGroup.Item className="bg-dark text-white border-0">
                            <Link to="/summary" className="text-white text-decoration-none d-flex align-items-center" onClick={handleClose}>
                                <ArticleIcon className="me-2" />
                                About
                            </Link>
                        </ListGroup.Item>
                        <ListGroup.Item className="bg-dark text-white border-0">
                            <Link to="/reference" className="text-white text-decoration-none d-flex align-items-center" onClick={handleClose}>
                                <PlagiarismIcon className="me-2" />
                                Documents Reference
                            </Link>
                        </ListGroup.Item>
                    </ListGroup>

                    <h6 className="mb-3">Categories</h6>
                    <ListGroup variant="flush">
                        {sections.map((section) => (
                            <ListGroup.Item key={section.name} className="bg-dark text-white border-0">
                                <Link to={section.path} className="text-white text-decoration-none d-flex align-items-center" onClick={handleClose}>
                                    <span className="me-2">{section.icon}</span>
                                    {section.name}
                                </Link>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default SideNavbar;
