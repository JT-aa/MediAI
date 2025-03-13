import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const LabResultDetails = () => {
  const BACKEND_API_URL = "http://127.0.0.1:8000";
  const { id } = useParams();
  const [labResult, setLabResult] = useState(null);

  useEffect(() => {
    axios
      .get(`${BACKEND_API_URL}/lab_reports/${id}`)
      .then((response) => {
        setLabResult(response.data);
        console.log(labResult.file_blob);
      })
      .catch((error) => {
        console.error("Error fetching lab result:", error);
      });
  }, [id]);

  return (
    <div className="lab-result-details">
      <h1>ID</h1>
      <p>{labResult?.report_id}</p>
      <h1>Date</h1>
      <p>{labResult?.date}</p>
      <h1>File size</h1>
      <p>{labResult?.file_blob}</p>
    </div>
  );
};

export default LabResultDetails;
