import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import LabReportViewer from "../components/LabReportViewer";
import {Container, Row, Col, Card, ListGroup, Button} from "react-bootstrap";
import {Progress} from "antd";
import HealthAlert from "../components/HealthAlert.jsx";

const LabResultDetails = () => {
  const BACKEND_API_URL = "http://127.0.0.1:8000";
  const {id} = useParams();
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
    .get(`${BACKEND_API_URL}/health_score/${id}`)
    .then((response) => {
      setHealthScore(response.data.health_score);
    })
    .catch((error) => {
      console.error("Error fetching health score:", error);
    });
  };

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
            <img src="/logo.png"
                 style={{maxWidth: "50px", maxHeight: "50px"}}/> MediAI
          </h1>
          <h4>On Device Medical Assistant</h4>
        </div>

        <Row className="mt-4"></Row>

        {/* Lab Result Details */}
        <Row className="mb-4">
          <Col md={5}>
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

            {/* My Health Score Section */}
            <Card className="mt-4">
              <Card.Body>
                <Card.Title className="mb-3">
                  My Health Score
                  <Button style={{marginLeft: "16px"}}
                          onClick={fetchHealthScore}>
                    Recalculate
                  </Button>
                </Card.Title>
                {healthScore !== null && <HealthAlert
                    healthScore={healthScore}/>}
              </Card.Body>
            </Card>

            {/* Problem Section */}
            <Card className="mt-4">
              <Card.Body>
                <Card.Title className="mb-3">
                  My Health Problem</Card.Title>
                <p>
                  you have are overweight
                </p>
              </Card.Body>
            </Card>

            {/* Lifestyle adjustment Suggestions */}
            <Card className="mt-4">
              <Card.Body>
                <Card.Title className="mb-3">
                  Lifestyle adjustment Suggestions</Card.Title>
                <p>
                  you probably need to workout more and eat less
                </p>
              </Card.Body>
            </Card>
          </Col>


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
              <LabReportViewer reportId={id}/>
            </div>
          </Col>
        </Row>

      </Container>
  );
};

export default LabResultDetails;
