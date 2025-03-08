import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserPage from "./pages/UserPage";
import LabResultDetails from "./pages/LabResultDetails";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserPage />} />
                <Route path="/lab-result/:id" element={<LabResultDetails />} />
            </Routes>
        </Router>
    );
}

export default App;