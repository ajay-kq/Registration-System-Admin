import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
    return (
        <Router>
            <div className="admin-app">
                <header>
                    <h1>RC Aquatics Admin Platform</h1>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<div><h2>Dashboard</h2><p>Welcome to the admin system.</p></div>} />
                        <Route path="/login" element={<div><h2>Login</h2><p>System Login Page.</p></div>} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App
