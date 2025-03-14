import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LabResultDetails from "./pages/LabResultDetails";
import HomePage from "./pages/HomePage";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<UserPage />} /> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/lab-result/:id" element={<LabResultDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
