import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LabReportViewer from "../components/LabReportViewer";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
  ListGroup,
} from "react-bootstrap";

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
          <img
            src="/logo.png"
            style={{ maxWidth: "50px", maxHeight: "50px" }}
          />{" "}
          MediAI
        </h1>
        <h4>On Device Medical Assistant</h4>
      </div>
      <Row className="mt-4"></Row>
      {/* Lab Result Details */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Lab Report Details</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>ID:</strong> {labResult?.report_id}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Date:</strong> {labResult?.date}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Recommendations:</strong> {labResult?.recommendations}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={5}>
          <div
            style={{
              width: "50vw", // Set the div width to 50% of the viewport width
              maxWidth: "50vw", // Ensure the div does not exceed 50% of the viewport width
              height: "50vw", // Set the div width to 50% of the viewport width
              maxHeight: "50vw",
              maxWidth: "50vw", // Ensure the div does not exceed 50% of the viewport width
              margin: "0 auto", // Center the div horizontally
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
