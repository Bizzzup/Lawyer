import * as React from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, Chat as ChatIcon, History as HistoryIcon, Cases as CasesIcon } from '@mui/icons-material';

export default function AsideBar() {
  const style = {
    transition: 'all 0.3s ease-in-out',
  }
  const iconStyle = {
    marginRight: '10px',
  }
  return ( 
    <>
      <div className="d-none d-lg-flex flex-column p-3 text-white bg-dark h-100 w-100" style={style}>
          <span className="fs-5 text-center">Sidebar</span>
        <hr/>
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item"><Link className='nav-link text-white' to='/'> <HomeIcon style={iconStyle} /> Home</Link></li>
          <li className="nav-item"><Link className='nav-link text-white' to='/allcase'> <CasesIcon style={iconStyle} /> All Case</Link></li>
          <li className="nav-item"><Link className='nav-link text-white' to='/chat'> <ChatIcon style={iconStyle} /> Chat Bot</Link></li>
          <li className="nav-item"><Link className='nav-link text-white' to='/history'> <HistoryIcon style={iconStyle} /> History</Link></li>
        </ul>
      </div>
    </>
  );
}
