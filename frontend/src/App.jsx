import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LabResultDetails from "./pages/LabResultDetails";
import UserProfile from "./pages/HomePage";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<UserPage />} /> */}
        <Route path="/" element={<UserProfile />} />
        <Route path="/lab-result/:id" element={<LabResultDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
