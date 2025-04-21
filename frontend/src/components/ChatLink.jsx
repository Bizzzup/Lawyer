import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import ChatTwoToneIcon from '@mui/icons-material/ChatTwoTone'

const ChatLink = () => {
    const location = useLocation();
    const isChatPage = location.pathname === '/chat';
    
  return (
  <Link to="/chat" className='m-5 border border-secondary p-3 rounded-circle bg-secondary icon-chat1' hidden={isChatPage}>
    <ChatTwoToneIcon className='text-dark'/>
  </Link>
  )
}

export default ChatLink