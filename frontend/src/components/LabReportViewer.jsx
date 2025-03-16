import React, { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const LabReportViewer = ({ reportId }) => {
  const BACKEND_API_URL = "http://127.0.0.1:8000";
  const [pdfUrl, setPdfUrl] = useState("");

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    fetch(BACKEND_API_URL + `/lab_reports/${reportId}/pdf`)
      .then((response) => response.blob())
      .then((data) => {
        const pdfBlob = URL.createObjectURL(data);
        setPdfUrl(pdfBlob);
      })
      .catch((error) => console.error("Error fetching PDF:", error));
  }, [reportId]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%", // Adjust height dynamically
        overflow: "auto", // Enable scrolling inside
        border: "1px solid #ccc", // Optional: Border for clarity
        borderRadius: "8px", // Optional: Rounded corners
        padding: "8px",
      }}
    >
      {pdfUrl ? (
        <Worker
          workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
        >
          <Viewer plugins={[defaultLayoutPluginInstance]} fileUrl={pdfUrl} />
        </Worker>
      ) : (
        <p style={{ textAlign: "center", padding: "20px" }}>Loading...</p>
      )}
    </div>
  );
};

export default LabReportViewer;
