import React from "react";
import LabResultPage from "../components/LabResultPage";

const LabResultDetails = ({ labResults }) => {
    return (
        <div className="lab-result-details">
            <LabResultPage labResults={labResults} />
        </div>
    );
};

export default LabResultDetails;