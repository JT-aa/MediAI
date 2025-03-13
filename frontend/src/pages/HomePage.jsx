// import { Button, message, Select } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Row, Col, Modal, ListGroup } from "react-bootstrap";

const UserProfile = () => {
  const BACKEND_API_URL = "http://127.0.0.1:8000";
  const [dbuser, setDbuser] = useState({});
  const [editedUser, setEditedUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [show, setShow] = useState(false);
  const [labResults, setLabResults] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSaveLabResult = async () => {
    if (!editedUser.user_id) {
      console.error("User ID is missing");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", editedUser.user_id);
    formData.append("date", document.getElementById("formDate").value);
    formData.append("file", document.getElementById("formFile").files[0]);

    try {
      const response = await axios.post(
        `${BACKEND_API_URL}/lab_reports/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Lab result saved successfully");
        handleClose();
        fetchLabResults();
      } else {
        console.error("Error uploading lab result");
      }
    } catch (error) {
      console.error(error);
      console.error("Error uploading lab result");
    }
  };
  // const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchLabResults();
  }, []);

  function fetchUser() {
    axios
      .get(`${BACKEND_API_URL}/users/1`)
      .then((response) => {
        setDbuser(response.data);
        setEditedUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function fetchLabResults() {
    axios
      .get(`${BACKEND_API_URL}/lab_reports/user/1`)
      .then((response) => {
        setLabResults(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleDeleteLab(reportId) {
    axios
      .delete(`${BACKEND_API_URL}/lab_reports/${reportId}`)
      .then((response) => {
        console.log(`Lab result ${reportId} deleted successfully`);
        // Fetch updated lab results
        fetchLabResults();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // useEffect(() => {
  //   if (dbuser.id) {
  //     fetchGroups();
  //   }
  // }, [dbuser]);

  // function fetchGroups() {
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/api/users/${dbuser.id}/groups`)
  //     .then((response) => {
  //       setGroups(response.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setEditedUser({ ...editedUser, [name]: value });
  }

  function handleUpdate() {
    axios
      .put(`${BACKEND_API_URL}/users/1`, editedUser)
      .then((response) => {
        setDbuser(response.data);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <Row>
        <Col md={3}>
          <h2>My Profile</h2>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Name:</Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="name"
                    value={editedUser.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <Form.Control plaintext readOnly defaultValue={dbuser.name} />
                )}
              </Form.Group>
            </Row>
            {/* Add similar Form.Group components for other properties like gender, college, cohort, and phone */}
            {/* <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Age:</Form.Label>
                <Form.Control plaintext readOnly defaultValue={user.age} />
              </Form.Group>
            </Row> */}
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Age:</Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="age"
                    value={editedUser.age}
                    onChange={handleInputChange}
                  />
                ) : (
                  <Form.Control plaintext readOnly defaultValue={dbuser.age} />
                )}
              </Form.Group>
            </Row>
            {/* <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Email verified:</Form.Label>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={user.email_verified?.toString()}
                />
              </Form.Group>
            </Row> */}
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Gender:</Form.Label>
                <div key={`inline-radio`} className="mb-3">
                  {isEditing ? (
                    <div>
                      <Form.Check
                        inline
                        label="male"
                        name="gender"
                        type="radio"
                        id="inline-radio-male"
                        value="male"
                        checked={editedUser.gender === "male"}
                        onChange={handleInputChange}
                      />
                      <Form.Check
                        inline
                        label="female"
                        name="gender"
                        type="radio"
                        id="inline-radio-female"
                        value="female"
                        checked={editedUser.gender === "female"}
                        onChange={handleInputChange}
                      />

                      <Form.Check
                        inline
                        label="others"
                        name="gender"
                        type="radio"
                        id="inline-radio-female"
                        value="others"
                        checked={editedUser.gender === "others"}
                        onChange={handleInputChange}
                      />
                    </div>
                  ) : (
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue={dbuser.gender}
                    />
                  )}
                </div>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Weight:</Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="Weight"
                    value={editedUser.weight}
                    onChange={handleInputChange}
                  />
                ) : (
                  <Form.Control
                    plaintext
                    readOnly
                    defaultValue={dbuser.weight}
                  />
                )}
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Body Fat:</Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="body_fat"
                    value={editedUser.body_fat}
                    onChange={handleInputChange}
                  />
                ) : (
                  <Form.Control
                    plaintext
                    readOnly
                    defaultValue={dbuser.body_fat}
                  />
                )}
              </Form.Group>
            </Row>
            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
            </Button>
            {isEditing && <Button onClick={handleUpdate}>Save</Button>}
          </Form>
        </Col>

        {/* <Col md={9}>
          <h2>My Groups</h2>
          <Row>
            {groups.map((group) => (
              <Col key={group.id} sm={12} md={6} lg={4} xl={3}>
                <GroupCard group={group} />
              </Col>
            ))}
          </Row>
        </Col> */}
      </Row>

      <Button variant="primary" onClick={handleShow}>
        Add New Lab Result
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Lab Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formDate" className="mb-3">
            <Form.Label>Select Date:</Form.Label>
            <Form.Control type="date" />
          </Form.Group>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Choose Lab Result File:</Form.Label>
            <Form.Control type="file" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveLabResult}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <h2>My Lab Results</h2>
      <ListGroup>
        {labResults.map((labResult) => (
          <ListGroup.Item key={labResult.report_id}>
            <a href={`/lab-result/${labResult.report_id}`}>
              Lab Result {labResult.report_id} {labResult.date}
            </a>
            <Button
              variant="danger"
              onClick={() => handleDeleteLab(labResult.report_id)}
            >
              Delete
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default UserProfile;
