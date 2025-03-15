import React from "react";
import { Progress } from "antd"; // Make sure to install Ant Design (`npm install antd`)
// import "antd/dist/antd.css"; // Import Ant Design styles

const HealthAlert = ({ healthScore }) => {
  const getAlertMessage = (score) => {
    if (score >= 90) {
      return {
        level: "Excellent",
        message:
          "Your health score is excellent! Keep up the great habits for long-term well-being. ✅",
        color: "#4CAF50",
      };
    } else if (score >= 70) {
      return {
        level: "Good",
        message:
          "Your health is in good shape, but there’s room for improvement. Consider regular checkups and a healthy lifestyle. 🏃‍♂️🍎",
        color: "#FFC107",
      };
    } else if (score >= 50) {
      return {
        level: "Moderate Risk",
        message:
          "Your health score indicates some moderate risks. It’s a good time to review your habits and consult a healthcare provider. ⚠️",
        color: "#FF9800",
      };
    } else if (score >= 30) {
      return {
        level: "High Risk",
        message:
          "Your health score is concerning. You may have underlying health risks that need immediate attention. Please consult a doctor. 🚨",
        color: "#F44336",
      };
    } else {
      return {
        level: "Critical",
        message:
          "Your health score is critically low! Immediate medical intervention is highly recommended. Seek professional help now! 🏥❗",
        color: "#D32F2F",
      };
    }
  };

  const { level, message, color } = getAlertMessage(healthScore);

  //   // Define the conicColors based on the health score
  //   const conicColors = {
  //     from: color,
  //     to: "#D3D3D3", // A light gray color for the non-filled portion
  //   };

  const conicColors = {
    "0%": "#FF0000",
    "50%": "#FFFF00",
    "100%": "#008000",
  };

  return (
    <div style={styles.container}>
      {/* Progress Component */}
      <Progress
        type="dashboard"
        percent={Math.ceil(healthScore)}
        format={(percent) => `${percent}`}
        strokeColor={conicColors}
        width={120}
        style={styles.progress}
      />
      <div style={{ ...styles.alertBox, backgroundColor: color }}>
        <h2 style={styles.title}>{level} Health Score</h2>
        <p style={styles.message}>{message}</p>
        {/* <div style={styles.score}>
          <strong>Health Score:</strong> {healthScore}
        </div> */}
      </div>
    </div>
  );
};

// Basic styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    width: "90%",
    maxWidth: "600px",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    color: "#fff",
    marginBottom: "20px",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "15px",
    fontWeight: "bold",
  },
  message: {
    fontSize: "1.1rem",
    marginBottom: "20px",
  },
  score: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    marginTop: "10px",
  },
  progress: {
    marginBottom: "20px",
  },
};

export default HealthAlert;
