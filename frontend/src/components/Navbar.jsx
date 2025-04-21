import * as React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import AddDocument from './AddDocument';
import { useEffect } from 'react';
import SideNavbar from './SideNavbar';
import '../assets/style/Navbar.css';
import AsideBar from './AsideBar';
import OffCanva from './OffCanva';
import AddIcon from '@mui/icons-material/Add';
import GavelIcon from '@mui/icons-material/Gavel';
import ChatLink from './ChatLink';

const Navbar = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [title, setTitle] = React.useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setOpen(false);
    }, [navigate]);

    return (
        <>
            <div className="row" style={{minHeight: '100vh', overflow: 'auto'}}>
                <div className="col-0 col-lg-2 p-0 m-0">
                    <AsideBar />
                </div>
                <div className="col-12 col-lg-10 p-0 m-0">
                    <nav className="navbar bg-dark">
                        <div className="container">
                            <div className="navbar-brand">
                                <OffCanva />
                                <h1 className="navbar-title text-light d-flex align-items-center"><GavelIcon className='me-3 d-none d-md-flex'/>Lawyer's Assistant</h1>
                            </div>
                            <div className="navbar-actions">
                                <button className="btn btn-primary d-none d-sm-flex" onClick={handleOpen}>
                                    <span className="navbar-icon d-flex d-md-none"><AddIcon /></span>
                                    <span className="navbar-text d-none d-md-block text-light">Add Document</span>
                                </button>
                                <SideNavbar />
                            </div>
                        </div>
                    </nav>
                    <button className='btn btn-primary d-flex d-sm-none plus-chat1' onClick={handleOpen}><AddIcon /></button>
                    <ChatLink />
                    <Outlet />
                </div>
            </div>

            {open && (
                <div className="modal-overlay" onClick={handleClose}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title" hidden={title}>Add Document</h2>
                            <button className="modal-close" onClick={handleClose}>×</button>
                        </div>
                        <div className="modal-body">
                            <AddDocument setTitle={setTitle} setOpen={setOpen}/>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
