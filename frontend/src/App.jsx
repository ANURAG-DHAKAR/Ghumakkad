import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetails from './pages/DestinationDetails';
import TripPlanner from './pages/TripPlanner';
import MyTrips from './pages/MyTrips';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import EditTrip from './pages/EditTrip';
import Profile from './pages/Profile';
import Gallery from './pages/Gallery';
import Auth from './pages/Auth';
import Upload from './pages/Upload';
import About from './pages/About';
import Contact from './pages/Contact';

// Components
import BottomNav from './components/BottomNav';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        
        {/* AnimatePresence allows components to animate out when unmounted */}
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/planner" element={<TripPlanner />} />
            <Route path="/trips" element={<MyTrips />} />
            <Route path="/trips/new" element={<CreateTrip />} />
            <Route path="/trips/:id" element={<TripDetails />} />
            <Route path="/trips/:id/edit" element={<EditTrip />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AnimatePresence>
        
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
