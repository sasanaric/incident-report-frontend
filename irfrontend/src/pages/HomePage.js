import React, { useState, useEffect } from "react";
import incidentsService from "../services/incidentsService";
import { Button, Select, Form, Popconfirm, message } from "antd";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import "leaflet/dist/leaflet.css";
import mapService from "../services/mapService";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Circle,
} from "react-leaflet";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useMap } from "react-leaflet";
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";

import { RED_MARKER_URL } from "../constants/URL";

const Search = () => {
  const map = useMap();

  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      style: "bar",
      showMarker: true,
      showPopup: false,
      marker: {
        icon: new L.Icon.Default(),
        draggable: false,
      },
      autoClose: true,
      searchLabel: "Enter location...",
      retainZoomLevel: false,
      animateZoom: true,
    }).addTo(map);

    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
};

const HomePage = () => {
  const [approvedIncidents, setApprovedIncidents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [clusterLocations, setClusterLocations] = useState([]);
  const [types, setTypes] = useState([]);
  const [parentTypes, setParentTypes] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [selectedParentType, setSelectedParentType] = useState(null);
  const [incidentLocation, setIncidentLocation] = useState([0, 0]);
  const [showMarker, setShowMarker] = useState(false);
  const [showAlarmingPlaces, setShowAlarmingPlaces] = useState(false);
  const [diagonalDistance, setDiagonalDistance] = useState(null);
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState(() => [
    44.77228923708804, 17.19100921271533,
  ]);
  const [form] = Form.useForm();

  const { Option } = Select;
  const selectWidth = "200px";
  const [days, setDays] = useState(null);
  // const [locationIds, setLocationIds] = useState([]);
  const [approved, setApproved] = useState(null);
  const [type, setType] = useState(null);
  const daysArray = [1, 7, 31];
  const daysLabel = ["Today", "This week", "This month"];

  useEffect(() => {
    loadLocations();
    console.log(`DAYS:${days}`);
    const request = {
      days: days,
      // location_ids: locationIds,
      approved: approved,
      type: type,
    };
    console.log(request);
    const loadApprovedIncidents = () => {
      incidentsService
        .filterIncidents(request)
        .then((result) => setApprovedIncidents(result.data));
    };
    loadApprovedIncidents();
  }, [days, approved, /*  locationIds,*/ type]);
  useEffect(() => {
    loadTypes();
    loadClusterLocations();
  }, []);

  const handleMove = (event) => {
    console.log("\x1b[1m%s\x1b[0m", "MOVE");
    console.log(map.getCenter());
    console.log(map.getZoom());
    setPosition(map.getCenter());
    calculateRadius();

    console.log("\x1b[1m%s\x1b[0m", "END");
  };

  const handleClick = (event) => {
    console.log("\x1b[1m%s\x1b[0m", "CLICK");
    setShowMarker(true);
    console.log(event);
    setIncidentLocation([event.latlng.lat, event.latlng.lng]);
    console.log(event.latlng.lat);
    console.log(event.latlng.lng);
    console.log(parentTypes);
    console.log(subTypes);
  };
  const calculateRadius = () => {
    const currentBounds = map.getBounds();
    const northEast = currentBounds.getNorthEast();
    const southWest = currentBounds.getSouthWest();
    const diagonalDistance = northEast.distanceTo(southWest);
    setDiagonalDistance(diagonalDistance);
    console.log("DIAGONAL:", diagonalDistance);
  };
  const clickApprove = async (incidentId) => {
    console.log("Clicked Approve for Incident ID:", incidentId);

    const approveRequest = {
      id: incidentId,
    };
    try {
      await incidentsService.approveIncident(approveRequest);
      setApprovedIncidents((prevIncidents) =>
        prevIncidents.map((incident) =>
          incident.id === incidentId
            ? { ...incident, approved: true }
            : incident
        )
      );
    } catch (error) {
      console.log("APPROVE ERROR");
    }
  };
  const clickDelete = async (incident) => {
    console.log("Delete incident id:", incident.id);
    console.log("Delete location_id:", incident.location_id);
    try {
      await mapService.deleteLocation(incident.location_id);
      await incidentsService.deleteIncident(incident.id);
      setApprovedIncidents((prevIncidents) =>
        prevIncidents.filter(
          (incidentFilter) => incidentFilter.id !== incident.id
        )
      );
      setLocations((prevLocations) =>
        prevLocations.filter((location) => location.id !== incident.location_id)
      );
      message.success("Incident has been deleted");
    } catch (error) {
      console.log("APPROVE ERROR");
    }
  };
  const clickTranslate = async (incidentId, incidentDescription) => {
    const translateRequest = {
      text: incidentDescription,
    };
    try {
      const result = await incidentsService.translateText(translateRequest);
      console.log("DATA:" + result.data);
      setApprovedIncidents((prevIncidents) =>
        prevIncidents.map((incident) =>
          incident.id === incidentId
            ? { ...incident, description: result.data }
            : incident
        )
      );
    } catch (error) {
      console.log("TRANSLATE ERROR");
    }
  };
  const loadLocations = () => {
    mapService.getAllLocations().then((result) => setLocations(result.data));
  };
  const loadClusterLocations = () => {
    mapService
      .getClusterLocations()
      .then((result) => setClusterLocations(result.data));
  };
  const loadTypes = () => {
    incidentsService.getAllTypes().then((result) => {
      const allTypes = result.data;
      setTypes(allTypes);
      const parentTypes = allTypes.filter((type) => !type.parent);
      const subTypes = allTypes.filter((type) => type.parent);

      setParentTypes(parentTypes);
      setSubTypes(subTypes);
    });
  };
  const onClickShowAlarmingPlaces = () => {
    loadClusterLocations();
    setShowAlarmingPlaces(!showAlarmingPlaces);
  };
  const mergedIncidents = approvedIncidents.map((incident) => {
    const locationInfo = locations.find(
      (location) => location.id === incident.location_id
    );
    const coordinatesMatch = locationInfo?.coordinates?.match(/\(([^)]+)\)/);
    const [lon, lat] = coordinatesMatch
      ? coordinatesMatch[1].split(" ").map(Number)
      : [0, 0];

    return {
      ...incident,
      locationInfo: {
        ...locationInfo,
        lon,
        lat,
      },
    };
  });
  const MapHandler = ({ onMove, onClick }) => {
    useMapEvents({
      moveend: (event) => {
        onMove(event);
      },
    });

    return null;
  };
  const RedMarker = new L.Icon({
    iconUrl: RED_MARKER_URL,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  const DefaultMarker = new L.Icon.Default();
  return (
    <div>
      <h1>Incident Report</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p>Latitude: {position.lat}</p>
        <p>Longitude: {position.lng}</p>
        <p>Diagonal: {diagonalDistance}</p>
        <Button
          onClick={onClickShowAlarmingPlaces}
          type="primary"
          style={{ margin: "10px" }}
        >
          {showAlarmingPlaces ? "Hide alarms" : "Show alarms"}
        </Button>
        <Form form={form}>
          <span style={{ display: "flex", alignItems: "center" }}>
            <label style={{ marginRight: "5px" }}>Status:</label>
            <Select
              onChange={setApproved}
              style={{ width: selectWidth, marginRight: "30px" }}
              allowClear={true}
            >
              <Option key={0} value={true}>
                Approved
              </Option>
              <Option key={1} value={false}>
                Not approved
              </Option>
            </Select>
            <label style={{ marginRight: "5px" }}>Filter by time:</label>
            <Select
              onChange={setDays}
              style={{ width: selectWidth, marginRight: "30px" }}
              allowClear={true}
            >
              {daysArray.map((day, index) => (
                <Option key={index} value={day}>
                  {daysLabel[index]}
                </Option>
              ))}
            </Select>

            <label style={{ marginRight: "5px" }}>Type:</label>
            <Select
              onChange={(selectedType) => {
                if (selectedType === undefined) {
                  setType(null);
                  setSelectedParentType(null);
                } else {
                  setSelectedParentType(selectedType);
                  setType(selectedType);
                }
                form.resetFields(["subtype"]);
              }}
              style={{ width: selectWidth, marginRight: "30px" }}
              allowClear={true}
            >
              {parentTypes.map((parentType, index) => (
                <Option key={index} value={parentType.id}>
                  {parentType.name}
                </Option>
              ))}
            </Select>

            <Form.Item name="subtype" style={{ margin: 0 }}>
              <label style={{ marginRight: "5px" }}>Subtype:</label>
              <Select
                onChange={(selectedType) => {
                  if (selectedType === undefined) {
                    setType(selectedParentType);
                  } else {
                    setType(selectedType);
                  }
                }}
                allowClear={true}
                style={{ width: selectWidth }}
              >
                {subTypes
                  .filter((subType) => subType.parent === selectedParentType)
                  .map((subType, index) => (
                    <Option key={index} value={subType.id}>
                      {subType.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </span>
        </Form>

        <MapContainer
          center={position}
          zoom={13}
          style={{
            height: "80vh",
            width: "70vw",
            border: "10px solid #327fa8",
            borderRadius: "10px",
            marginTop: "20px",
          }}
          ref={setMap}
          whenCreated={(map) => {
            setMap(map);
          }}
        >
          <MapHandler onMove={handleMove} onClick={handleClick} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <Search />
          {showAlarmingPlaces &&
            clusterLocations.map((location) => (
              <Circle
                center={[location.lat, location.lon]}
                radius={6000}
                color="red"
              />
            ))}
          {mergedIncidents.map((incident) => (
            <Marker
              key={incident.id}
              position={[incident.locationInfo.lat, incident.locationInfo.lon]}
              icon={incident.approved ? DefaultMarker : RedMarker}
            >
              <Popup style={{ whiteSpace: "normal", textAlign: "left" }}>
                <div style={{ marginBottom: "8px" }}>
                  <b>{types[incident.type - 1]?.name}</b>
                </div>
                <div style={{ marginBottom: "8px", wordWrap: "break-word" }}>
                  {incident.description}
                </div>
                <div>
                  {!incident.approved && (
                    <Button
                      type="primary"
                      onClick={() => clickApprove(incident.id)}
                    >
                      Approve
                    </Button>
                  )}

                  <Button
                    style={{ marginLeft: "10px" }}
                    onClick={() =>
                      clickTranslate(incident.id, incident.description)
                    }
                  >
                    Translate
                  </Button>
                  <Popconfirm
                    title="Delete incident"
                    description="Are you sure to delete this incident?"
                    onConfirm={() => clickDelete(incident)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="primary"
                      danger
                      style={{ marginLeft: "10px" }}
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
              </Popup>
            </Marker>
          ))}
          {showMarker && (
            <Marker position={incidentLocation} icon={RedMarker}></Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default HomePage;
