import React from "react";
import { useNavigate } from "react-router-dom";

const LabResultsList = ({ labResults, onDelete }) => {
    const navigate = useNavigate();

    return (
        <div className="lab-results-container">
            <button className="add-btn">Add New Lab Result</button>
            {labResults.map((result) => (
                <div key={result.id} className="lab-result-item">
                    <span onClick={() => navigate(`/lab-result/${result.id}`)}>
                        Lab Result {result.id}: {result.date}
                    </span>
                    <button className="delete-btn" onClick={() => onDelete(result.id)}>X</button>
                </div>
            ))}
            <div className="recommendations-box">Overall Recommendations</div>
        </div>
    );
};

export default LabResultsList;