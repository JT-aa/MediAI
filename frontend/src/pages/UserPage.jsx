import React, { useState } from "react";
import UserProfile from "../components/UserProfile";
import LabResultsList from "../components/LabResultsList";

const UserPage = () => {
    const [labResults, setLabResults] = useState([
        { id: 1, date: "2025/03/01", details: "Normal", recommendations: "Keep healthy diet" },
        { id: 2, date: "2025/03/07", details: "Low Vitamin D", recommendations: "Take supplements" },
        { id: 3, date: "2025/03/14", details: "High Cholesterol", recommendations: "Exercise more" },
    ]);

    const handleDelete = (id) => {
        setLabResults(labResults.filter((result) => result.id !== id));
    };

    return (
        <div className="user-page">
            <UserProfile />
            <LabResultsList labResults={labResults} onDelete={handleDelete} />
        </div>
    );
};

export default UserPage;