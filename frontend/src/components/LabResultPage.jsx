import React from "react";
import { useParams } from "react-router-dom";

const LabResultPage = ({ labResults }) => {
    const { id } = useParams();
    const result = labResults.find((res) => res.id === parseInt(id));

    if (!result) return <p>Lab Result not found.</p>;

    return (
        <div className="lab-result-page">
            <h2>Lab Result {result.id}: {result.date}</h2>
            <div className="lab-box">Lab Result: {result.details}</div>
            <div className="recommendation-box">Recommendations: {result.recommendations}</div>
        </div>
    );
};

export default LabResultPage;