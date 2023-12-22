import React, { useState, useEffect } from "react";
import incidentsService from "../services/incidentsService";
import { Button, Select, Form } from "antd";
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
} from "react-leaflet";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useMap } from "react-leaflet";
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";

import { RED_MARKER_URL } from "../constants/URL";
import IncidentForm from "../components/IncidentForm";

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
  const [types, setTypes] = useState([]);
  const [parentTypes, setParentTypes] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [selectedParentType, setSelectedParentType] = useState(null);
  const [incidentLocation, setIncidentLocation] = useState([0, 0]);
  const [showMarker, setShowMarker] = useState(false);
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
  // const [approved, setApproved] = useState(null);
  const [type, setType] = useState(null);
  const daysArray = [1, 7, 31];
  const daysLabel = ["Danas", "Ove sedmice", "Ovaj mjesec"];

  useEffect(() => {
    loadLocations();
    console.log(`DAYS:${days}`);
    const request = {
      days: days,
      // location_ids: locationIds,
      approved: true,
      type: type,
    };
    console.log(request);
    const loadApprovedIncidents = () => {
      incidentsService
        .filterIncidents(request)
        .then((result) => setApprovedIncidents(result.data));
    };
    loadApprovedIncidents();
  }, [days, /*approved,  locationIds,*/ type]);
  useEffect(() => {
    loadTypes();
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

  const loadLocations = () => {
    mapService.getAllLocations().then((result) => setLocations(result.data));
  };

  const loadTypes = () => {
    incidentsService.getAllTypes().then((result) => {
      console.log(result.data);
      console.log(result.data[13].name);
      const allTypes = result.data;
      setTypes(allTypes);
      const parentTypes = allTypes.filter((type) => !type.parent);
      const subTypes = allTypes.filter((type) => type.parent);

      setParentTypes(parentTypes);
      setSubTypes(subTypes);
    });
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
      click: (event) => {
        onClick(event);
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
          type="primary"
          style={{
            marginBottom: "20px",
            visibility: showMarker ? "visible" : "hidden",
          }}
          onClick={() => {
            setShowMarker(false);
            console.log("MARKER:" + showMarker);
            console.log(days);
          }}
        >
          Delete marker
        </Button>
        <Form form={form}>
          <span style={{ display: "flex", alignItems: "center" }}>
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
          {mergedIncidents.map((incident) => (
            <Marker
              key={incident.id}
              position={[incident.locationInfo.lat, incident.locationInfo.lon]}
            >
              <Popup style={{ whiteSpace: "normal", textAlign: "left" }}>
                <div style={{ marginBottom: "8px" }}>
                  <b>{types[incident.type - 1].name}</b>
                </div>
                <div style={{ marginBottom: "8px", wordWrap: "break-word" }}>
                  {incident.description}
                </div>

                <div>
                  <Button
                    onClick={() =>
                      clickTranslate(incident.id, incident.description)
                    }
                  >
                    Translate
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}
          {showMarker && (
            <Marker position={incidentLocation} icon={RedMarker}></Marker>
          )}
        </MapContainer>
      </div>
      <IncidentForm
        incidentLocation={incidentLocation}
        showMarker={showMarker}
      />
    </div>
  );
};

export default HomePage;
