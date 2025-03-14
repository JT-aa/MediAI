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
    <div>
      {pdfUrl ? (
        <Worker
          workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}
        >
          <Viewer plugins={[defaultLayoutPluginInstance]} fileUrl={pdfUrl} />
        </Worker>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LabReportViewer;
