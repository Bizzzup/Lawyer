import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Loading from './components/Loading'
import Navbar from './components/Navbar'
const Home = React.lazy(() => import('./pages/Home'))
const Sections = React.lazy(() => import('./pages/documents/Sections'))
const KeyDates = React.lazy(() => import('./pages/documents/KeyDates'))
const Monetary = React.lazy(() => import('./pages/documents/Monetary'))
const Reference = React.lazy(() => import('./pages/documents/Reference'))
const AllCase = React.lazy(() => import('./pages/AllCase'))
const Chat = React.lazy(() => import('./pages/ChatBot'))
const History = React.lazy(() => import('./pages/Histroy'))
const Summary = React.lazy(() => import('./pages/documents/Summary'))

function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<Home />} />
            <Route path="section" element={<Sections />} />
            <Route path="dates" element={<KeyDates />} />
            <Route path="allcase" element={<AllCase />} />
            <Route path="monetary" element={<Monetary />} />
            <Route path="reference" element={<Reference />} />
            <Route path="chat" element={<Chat />} />
            <Route path="history" element={<History />} />
            <Route path="summary" element={<Summary />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
