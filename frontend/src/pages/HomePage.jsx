import React, {useState, useEffect} from "react";
import axios from "axios";
import {
  Container, Row, Col, Card, Form, Modal, ListGroup,
} from "react-bootstrap";
import {Flex, Progress} from "antd";
import HealthAlert from "../components/HealthAlert";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import {Table, Tag, Button} from "antd";

const HomePage = () => {
  const BACKEND_API_URL = "http://127.0.0.1:8000";
  const [dbuser, setDbuser] = useState({});
  const [editedUser, setEditedUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [show, setShow] = useState(false);
  const [labResults, setLabResults] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [sortCriteria, setSortCriteria] = useState("id"); // Default sorting by ID
  const [healthScore, setHealthScore] = useState(50);
  const [overallRecommendations, setOverallRecommendations] = useState([]);
  const [riskTrendData, setRiskTrendData] = useState([]);
  const [healthTrend, setHealthTrend] = useState(null);
  const [trend, setTrend] = useState(null);


  const conicColors = {
    "0%": "#FF0000", "50%": "#FFFF00", "100%": "#008000",
  };
  const columns = [{
    title: "Lab Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
  }, {
    title: "Date",
    dataIndex: "date",
    key: "date",
    sorter: (a, b) => new Date(a.date) - new Date(b.date),
  }, {
    title: "Risk Level",
    dataIndex: "risk_level",
    key: "risk_level",
    sorter: (a, b) => a.risk_level - b.risk_level,
    render: (risk_level) => {
      let color = "default";
      let text = "Unknown";
      if (risk_level === 3) {
        color = "red";
        text = "High";
      } else if (risk_level === 2) {
        color = "orange";
        text = "Medium";
      } else if (risk_level === 1) {
        color = "green";
        text = "Low";
      }
      return <Tag color={color}>{text}</Tag>;
    },
  }, {
    title: "Actions", key: "actions", render: (_, record) => (    
      <div>
      {/* View button linked to the backend API */}
      <Button
        type="link"
        href={`/lab-result/${record.report_id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View
      </Button>

      {/* Delete button */}
      <Button
        type="primary"
        danger
        onClick={() => {
          setSelectedReportId(record.report_id);
          setShowDeleteModal(true);
        }}
      >
        Delete
      </Button>
    </div>),
  },];

  useEffect(() => {
    fetchUser();
    fetchLabResults();
    fetchHealthScore();
    fetchTrend();
  }, []);

  function fetchTrend() {
    axios
    .get(`${BACKEND_API_URL}/trend`)
    .then((response) => {
      setTrend(response.data.trend);
    })
    .catch((error) => console.error(error));
  }

  // Function to call the API when Regenerate button is clicked
const handleRegenerate = () => {
  axios
    .put(`${BACKEND_API_URL}/trend`)
    .then(() => {
      message.success("Trend updated successfully!");
    })
    .catch((error) => {
      console.error("Error updating trend:", error);
      message.error("Failed to update trend. Please try again.");
    });
};


  function fetchUser() {
    axios
    .get(`${BACKEND_API_URL}/users/1`)
    .then((response) => {
      setDbuser(response.data);
      setEditedUser(response.data);
    })
    .catch((error) => console.error(error));
  }

  function fetchLabResults() {
    axios
    .get(`${BACKEND_API_URL}/lab_reports/user/1`)
    .then((response) => {
      setLabResults(response.data);
      formatRiskTrendData(response.data);

    })
    .catch((error) => console.error(error));
  }

  function fetchHealthScore() {
    axios
    .get(`${BACKEND_API_URL}/health_score/1`)
    .then((response) => {
      setHealthScore(response.data.health_score);
    })
    .catch((error) => console.error(error));
  }

  // Format Data for Recharts with Proper Date Formatting
  function formatRiskTrendData(labResults) {
    const formattedData = labResults
    .filter((result) => result.health_score !== null) // Ensure risk score exists
    .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date
    .map((result) => ({
      date: new Date(result.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }), // Format: "Feb 10, 2024"
      Score: result.health_score, // Y-axis (risk score)
    }));
    setRiskTrendData(formattedData);
  }

  // Format Date for X-Axis (Show Year and Month)
  function formatXAxisDate(dateStr) {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
    }).format(date);
  }



  const sortedLabResults = Array.isArray(labResults) ? [...labResults].sort(
      (a, b) => {
        if (sortCriteria === "id") {
          return a.report_id - b.report_id;
        } else if (sortCriteria === "date") {
          return new Date(a.date) - new Date(b.date);
        } else if (sortCriteria === "risk_level") {
          return b.risk_level - a.risk_level;
        } else if (sortCriteria === "name") {
          return a.name.localeCompare(b.name);
        }
        return 0;
      }) : [];

  function handleDeleteConfirm() {
    if (selectedReportId) {
      axios
      .delete(`${BACKEND_API_URL}/lab_reports/${selectedReportId}`)
      .then(() => {
        fetchLabResults();
        setShowDeleteModal(false);
      })
      .catch((error) => console.error(error));
    }
  }

  function handleUpdate() {
    axios
    .put(`${BACKEND_API_URL}/users/1`, editedUser)
    .then((response) => {
      setDbuser(response.data);
      setIsEditing(false);
    })
    .catch((error) => console.error(error));
  }

  function handleRecalculate() {
    axios
    .get(`${BACKEND_API_URL}/health_score/1`)
    .then((response) => {
      setHealthScore(response.data.health_score);
    })
    .catch((error) => console.error(error));
  }

  // Function to determine button style based on risk level
  const getRiskLevelButton = (riskLevel) => {
    switch (riskLevel) {
      case 3:
        return {variant: "danger", text: "High"};
      case 2:
        return {variant: "warning", text: "Medium"};
      case 1:
        return {variant: "success", text: "Low"};
      default:
        return {variant: "secondary", text: "Unknown"};
    }
  };

  return (<Container className="py-4">
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
            style={{maxWidth: "50px", maxHeight: "50px"}}
        />{" "}
        MediAI
      </h1>
      <h4>On Device Medical Assistant</h4>
    </div>
    <Row className="mt-4"></Row>

    <Row className="mb-4">
      <Col md={4}>
        <Card>
          <Card.Body>
            <Card.Title className="mb-3">My Profile</Card.Title>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name:</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={editedUser.name || ""}
                    readOnly={!isEditing}
                    onChange={(e) => setEditedUser(
                        {...editedUser, name: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Age:</Form.Label>
                <Form.Control
                    type="text"
                    name="age"
                    value={editedUser.age || ""}
                    readOnly={!isEditing}
                    onChange={(e) => setEditedUser(
                        {...editedUser, age: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Gender:</Form.Label>
                <Form.Control
                    as="select"
                    name="gender"
                    value={editedUser.gender || ""}
                    disabled={!isEditing}
                    onChange={(e) => setEditedUser(
                        {...editedUser, gender: e.target.value})}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Height:</Form.Label>
                <Row>
                  <Col xs={3}>
                    <Form.Control
                        type="text"
                        name="height_ft"
                        value={editedUser.height_ft || ""}
                        readOnly={!isEditing}
                        onChange={(e) => setEditedUser({
                          ...editedUser, height_ft: e.target.value,
                        })}
                        placeholder="Feet"
                    />
                  </Col>
                  <Col xs={1}>
                    <p>'</p>
                  </Col>
                  <Col xs={3}>
                    <Form.Control
                        type="text"
                        name="height_in"
                        value={editedUser.height_in || ""}
                        readOnly={!isEditing}
                        onChange={(e) => setEditedUser({
                          ...editedUser, height_in: e.target.value,
                        })}
                        placeholder="Inches"
                    />
                  </Col>
                  <Col xs={1}>
                    <p>"</p>
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Weight:</Form.Label>
                <Row>
                  <Col xs={3}>
                    <Form.Control
                        type="text"
                        name="weight"
                        value={editedUser.weight || ""}
                        readOnly={!isEditing}
                        onChange={(e) => setEditedUser({
                          ...editedUser, weight: e.target.value,
                        })}
                    />
                  </Col>
                  <Col xs={3}>
                    <p>lbs</p>
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Body Fat:</Form.Label>
                <Row>
                  <Col xs={3}>
                    <Form.Control
                        type="text"
                        name="body_fat"
                        value={editedUser.body_fat || ""}
                        readOnly={!isEditing}
                        onChange={(e) => setEditedUser({
                          ...editedUser, body_fat: e.target.value,
                        })}
                    />
                  </Col>
                  <Col xs={3}>
                    <p>%</p>
                  </Col>
                </Row>
              </Form.Group>
              {isEditing && (<Button
                  type="primary"
                  className="ms-2"
                  onClick={handleUpdate}
              >
                Save
              </Button>)}
              <span> </span>
              <Button
                  type={isEditing ? "secondary" : "primary"}
                  onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>

      <Col md={8}>
        <Card>
          <Card.Body>
            <Card.Title className="mb-3">My Lab Results <Button type="primary" className="mt-3" style={{marginLeft: "400px"}} onClick={() => setShow(true)}>
              Add New Lab Result
            </Button></Card.Title>
            {/* <Form.Group className="mb-3">
              <Form.Label>Sort By:</Form.Label>
              <Form.Control
                  as="select"
                  value={sortCriteria}
                  onChange={(e) => setSortCriteria(e.target.value)}
              >
                <option value="id">ID</option>
                <option value="name">Name</option>
                <option value="date">Date</option>
                <option value="risk_level">Risk Level</option>
              </Form.Control>
            </Form.Group> */}
            <Table
                columns={columns}
                dataSource={sortedLabResults}
                rowKey="report_id"
                pagination={{pageSize: 5}}
            />

            {/*<ListGroup>*/}
            {/*  {sortedLabResults.length === 0 ? (*/}
            {/*      <ListGroup.Item className="text-center text-muted">*/}
            {/*        No Existing Lab Results Yet*/}
            {/*      </ListGroup.Item>*/}
            {/*  ) : (*/}
            {/*      sortedLabResults.map((labResult) => {*/}
            {/*        const {variant, text} = getRiskLevelButton(*/}
            {/*            labResult.risk_level*/}
            {/*        );*/}
            {/*        return (*/}
            {/*            <ListGroup.Item*/}
            {/*                key={labResult.report_id}*/}
            {/*                className="d-flex justify-content-between align-items-center"*/}
            {/*            >*/}
            {/*              <a*/}
            {/*                  href={`/lab-result/${labResult.report_id}`}*/}
            {/*                  className="text-decoration-none"*/}
            {/*              >*/}
            {/*                Lab*/}
            {/*                Result {labResult.report_id} - {labResult.name} -{" "}*/}
            {/*                {labResult.date}*/}
            {/*              </a>*/}
            {/*              <div className="d-flex align-items-center">*/}
            {/*                <Button*/}
            {/*                    variant={variant}*/}
            {/*                    size="sm"*/}
            {/*                    style={{width: "80px", marginRight: "10px"}}*/}
            {/*                >*/}
            {/*                  {text}*/}
            {/*                </Button>*/}
            {/*                <Button*/}
            {/*                    variant="danger"*/}
            {/*                    size="sm"*/}
            {/*                    onClick={() => {*/}
            {/*                      setSelectedReportId(labResult.report_id);*/}
            {/*                      setShowDeleteModal(true);*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                  x*/}
            {/*                </Button>*/}
            {/*              </div>*/}
            {/*            </ListGroup.Item>*/}
            {/*        );*/}
            {/*      })*/}
            {/*  )}*/}
            {/*</ListGroup>*/}
            
          </Card.Body>
        </Card>
        <Row className="mt-4"></Row>

        <Card>
          <Card.Body>
            <Card.Title className="mb-3">
              My Health Score
              {/* <Button
                  style={{marginLeft: "16px"}}
                  onClick={handleRecalculate}
              >
                Recalculate
              </Button> */}
            </Card.Title>
            {/* <Progress
                type="dashboard"
                percent={Math.ceil(healthScore)}
                format={(percent) => `${percent}`}
                strokeColor={conicColors}
              /> */}

            <HealthAlert healthScore={healthScore}/>
          </Card.Body>
        </Card>

        <Row className="mt-4"></Row>

        {/* Risk Score Trend Line Chart */}
        <Card>
          <Card.Body>
            <Card.Title>My Health Trend <Button type="primary" style={{ marginLeft: "420px" }} onClick={handleRegenerate}>Regenerate</Button></Card.Title>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={riskTrendData} margin={{ top: 20, right: 20, bottom: 50, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis
                    dataKey="date"
                    tick={{fontSize: 12, dy: 10 }}
                    angle={-45} // Rotates the labels
                    textAnchor="end"
                    interval={0} // Ensures all dates are shown
                    height={40} // Adds more space for labels
                />
                <YAxis/>
                <Tooltip/>
                <Line
                    type="monotone"
                    dataKey="Score"
                    stroke="#ff7300"
                    strokeWidth={3}
                    dot={{fill: "#ff7300", r: 5}}
                    activeDot={{r: 8}}
                />
              </LineChart>
            </ResponsiveContainer>
            <div style={{textAlign: "center"}}>
              <p>{trend}</p>
            </div>
          </Card.Body>
        </Card>

        <Row className="mt-4"></Row>

        {/* <Card>
          <Card.Body>
            <Card.Title className="mb-3">
              Overall Recommendations
              <Button style={{marginLeft: "16px"}}>Regenerate</Button>
            </Card.Title>
          </Card.Body>
        </Card> */}
      </Col>

    </Row>

    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Lab Result</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Lab Name</Form.Label>
            <Form.Control type="name" id="formName"/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" id="formDate"/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>File</Form.Label>
            <Form.Control type="file" id="formFile"/>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Close
        </Button>
        <Button
            type="primary"
            onClick={async () => {
              const formData = new FormData();
              formData.append("user_id", editedUser.user_id);
              formData.append("date",
                  document.getElementById("formDate").value);
              formData.append("name",
                  document.getElementById("formName").value);
              formData.append("file",
                  document.getElementById("formFile").files[0]);
              const report_data = await axios.post(`${BACKEND_API_URL}/lab_reports/`, formData,
                  {
                    headers: {"Content-Type": "multipart/form-data"},
                  });
              console.log(report_data.data);
              axios.put(`${BACKEND_API_URL}/lab_reports/${report_data.data.report_id}/analysis`)
              setShow(false);
              fetchLabResults();
            }}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>

    {/* Delete Confirmation Modal */}
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this lab result? This action cannot
        be
        undone.
      </Modal.Body>
      <Modal.Footer>
        <Button type="primary"
        danger onClick={handleDeleteConfirm}>
          Delete
        </Button>
        <Button variant="secondary"
                onClick={() => setShowDeleteModal(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  </Container>);
};

export default HomePage;
