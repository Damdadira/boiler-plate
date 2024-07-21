import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
    return (
        <Router>
            <div>
                <ul>
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link to='/about'>About</Link>
                    </li>
                    <li>
                        <Link to='/dashboard'>Dashboard</Link>
                    </li>
                </ul>

                <hr />

                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

function Home() {
    return (
        <div>
            <h2>Home 안녕하세요~</h2>
        </div>
    );
}

function About() {
    return (
        <div>
            <h2>About 어바웃 페이지</h2>
        </div>
    );
}

function Dashboard() {
    return (
        <div>
            <h2>Dashboard</h2>
        </div>
    );
}

export default App;
