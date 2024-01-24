import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "antd";
import incidentsService from "../services/incidentsService";

const IncidentCard = ({ incident, type, onDelete }) => {
  const [translatedDescription, setTranslatedDescription] = useState("");
  const [approved, setApproved] = useState(true);
  useEffect(() => {
    setApproved(incident.approved);
  }, [incident.approved]);
  const clickTranslate = async (incidentDescription) => {
    const translateRequest = {
      text: incidentDescription,
    };

    try {
      const result = await incidentsService.translateText(translateRequest);
      const translatedText = result.data;
      setTranslatedDescription(translatedText);
    } catch (error) {
      console.log("TRANSLATE ERROR");
    }
  };
  const clickApprove = async (incidentId) => {
    console.log("Clicked Approve for Incident ID:", incidentId);

    const approveRequest = {
      id: incidentId,
    };
    try {
      await incidentsService.approveIncident(approveRequest);
      setApproved(true);
    } catch (error) {
      console.log("APPROVE ERROR");
    }
  };
  return (
    <Row justify="space-between" style={{ margin: "5px" }}>
      <Col style={{ width: "20%" }}>
        <p>
          <b>{type}</b>
        </p>
      </Col>
      <Col style={{ textAlign: "center", width: "60%" }}>
        <p>{translatedDescription || incident.description}</p>
      </Col>
      <Col style={{ width: "20%" }}>
        {!approved && (
          <Button
            style={{ margin: "5px" }}
            type="primary"
            onClick={() => clickApprove(incident.id)}
          >
            Approve
          </Button>
        )}
        <Button
          style={{ margin: "5px" }}
          type="primary"
          danger
          onClick={() =>
            onDelete(incident.cluster_label, incident.id, incident.location_id)
          }
        >
          Delete
        </Button>
        <Button
          style={{ margin: "5px" }}
          onClick={() => clickTranslate(incident.description)}
        >
          Translate
        </Button>
      </Col>
    </Row>
  );
};

export default IncidentCard;
