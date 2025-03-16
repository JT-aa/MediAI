import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LabReportViewer from "../components/LabReportViewer";
import { Container, Row, Col, Card } from "react-bootstrap";
import { List } from "antd";
import HealthAlert from "../components/HealthAlert.jsx";

const LabResultDetails = () => {
  const BACKEND_API_URL = "http://127.0.0.1:8000";
  const { id } = useParams();
  const [labResult, setLabResult] = useState(null);
  const [healthScore, setHealthScore] = useState(null);

  useEffect(() => {
    // Fetch Lab Report
    axios
      .get(`${BACKEND_API_URL}/lab_reports/${id}`)
      .then((response) => {
        setLabResult(response.data);
      })
      .catch((error) => {
        console.error("Error fetching lab result:", error);
      });

    // Fetch Health Score for this specific lab report
    fetchHealthScore();
  }, [id]);

  const fetchHealthScore = () => {
    axios
      .get(`${BACKEND_API_URL}/lab_reports/health_score/${id}`)
      .then((response) => {
        setHealthScore(response.data.health_score);
      })
      .catch((error) => {
        console.error("Error fetching health score:", error);
      });
  };

  // Extract and parse analysis data
  const analysis = labResult?.analysis ? JSON.parse(labResult.analysis) : {};

  return (
    <Container className="py-4">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "15vh",
          textAlign: "center",
        }}
      >
        <h1>
          <img src="/logo.png" style={{ maxWidth: "50px", maxHeight: "50px" }} /> MediAI
        </h1>
        <h4>On Device Medical Assistant</h4>
      </div>

      <Row className="mt-4"></Row>

      {/* Lab Result Details */}
      <Row className="mb-4">
        <Col md={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Basic Information</Card.Title>
              <List>
                <List.Item><strong>ID:</strong> {labResult?.report_id}</List.Item>
                <List.Item><strong>Name:</strong> {labResult?.name}</List.Item>
                <List.Item><strong>Date:</strong> {labResult?.date}</List.Item>
              </List>
            </Card.Body>
          </Card>

          {/* Health Score Section */}
          <Card className="mt-4">
            <Card.Body>
              <Card.Title className="mb-3">My Health Score</Card.Title>
              {healthScore !== null && <HealthAlert healthScore={healthScore} />}
            </Card.Body>
          </Card>

          {/* Health Rationale Section */}
          <Card className="mt-4">
            <Card.Body>
              <Card.Title className="mb-3">Rationale</Card.Title>
              <p>{analysis.health_score?.rationale || "No rationale available"}</p>
            </Card.Body>
          </Card>


          {/* Potential Problems Section */}
          <Card className="mt-4">
            <Card.Body>
              <Card.Title className="mb-3">Potential Problems</Card.Title>
              <List
                bordered
                dataSource={analysis.potential_health_problems || []}
                renderItem={(item) => (
                  <List.Item>
                    <strong>{item.issue}:</strong> {item.explanation}
                  </List.Item>
                )}
              />
            </Card.Body>
          </Card>

          {/* Medical Suggestions Section */}
          <Card className="mt-4">
            <Card.Body>
              <Card.Title className="mb-3">Medical Suggestions</Card.Title>
              <List
                bordered
                dataSource={analysis.recommendations || []}
                renderItem={(item) => (
                  <List.Item>{item.recommendation}</List.Item>
                )}
              />
            </Card.Body>
          </Card>

          {/* Lifestyle Adjustment Suggestions */}
          <Card className="mt-4">
            <Card.Body>
              <Card.Title className="mb-3">Lifestyle Adjustment Suggestions</Card.Title>
              <List
                bordered
                dataSource={analysis.lifestyle_changes || []}
                renderItem={(item) => (
                  <List.Item>
                    <strong>{item.change}:</strong> {item.benefits}
                  </List.Item>
                )}
              />
            </Card.Body>
          </Card>
        </Col>

        {/* Lab Report Viewer */}
        <Col md={5}>
          <div
            style={{
              width: "50vw",
              maxWidth: "50vw",
              height: "50vw",
              maxHeight: "50vw",
              margin: "0 auto",
            }}
          >
            <LabReportViewer reportId={id} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LabResultDetails;
