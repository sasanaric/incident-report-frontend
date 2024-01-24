import React, { useEffect, useState } from "react";
import incidentsService from "../services/incidentsService";
import mapService from "../services/mapService";
import IncidentCard from "../components/IncidentCard";
import { message, Collapse } from "antd";

const GroupedIncidents = () => {
  const [groupIncidents, setGroupIncidents] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    loadGroups();
    loadTypes();
  }, []);

  const loadTypes = () => {
    incidentsService.getAllTypes().then((result) => {
      const typesResult = result.data;
      setTypes(typesResult);
    });
  };
  const loadGroups = () => {
    incidentsService.nlpIncidents().then((result) => {
      const groups = result.data;
      setGroupIncidents(groups);
    });
  };
  const getTypeNameById = (typeId) => {
    const foundType = types.find((type) => type.id === typeId);
    return foundType ? foundType.name : "Unknown Type";
  };

  const clickDelete = async (clusterLabel, incidentId, locationId) => {
    console.log("Delete cluster:", clusterLabel);
    console.log("Delete incident id:", incidentId);
    console.log("Delete location_id:", locationId);
    try {
      await mapService.deleteLocation(locationId);
      await incidentsService.deleteIncident(incidentId);
      setGroupIncidents((prevGroups) =>
        prevGroups.map((group) =>
          group.cluster_label === clusterLabel
            ? {
                ...group,
                incidents: group.incidents.filter(
                  (filterIncident) => filterIncident.id !== incidentId
                ),
              }
            : group
        )
      );
      message.success("Incident has been deleted");
    } catch (error) {
      console.log("DELETE ERROR");
    }
  };

  const items = groupIncidents.map((group) => ({
    key: `${group.cluster_label}`,
    label: `Cluster ${group.cluster_label}`,
    children: (
      <Collapse defaultActiveKey="1">
        {group.incidents.map((incident) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            type={getTypeNameById(incident.type)}
            onDelete={clickDelete}
          />
        ))}
      </Collapse>
    ),
  }));

  const onChange = (key) => {
    console.log(key);
  };
  return (
    <div>
      {/* {groupIncidents.map((group) => (
        <details key={group.cluster_label}>
          <summary>{`Cluster ${group.cluster_label}`}</summary>
          <div>
            {group.incidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                type={getTypeNameById(incident.type)}
                cluster={group.cluster_label}
                onDelete={clickDelete}
              />
            ))}
          </div>
        </details>
      ))} */}
      <Collapse onChange={onChange} items={items} />
    </div>
  );
};
export default GroupedIncidents;
