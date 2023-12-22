import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select } from "antd";
import mapService from "../services/mapService";
import incidentsService from "../services/incidentsService";

const IncidentForm = ({ incidentLocation, showMarker }) => {
  const [parentTypes, setParentTypes] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [selectedParentType, setSelectedParentType] = useState(null);
  const [selectedIncidentType, setSelectedIncidentType] = useState(null);
  const [form] = Form.useForm();
  const { Option } = Select;

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = () => {
    incidentsService
      .getParentTypes()
      .then((result) => setParentTypes(result.data));
    incidentsService.getSubTypes().then((result) => setSubTypes(result.data));
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onReset = () => {
    form.resetFields();
    setSelectedParentType(null);
    setSelectedIncidentType(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const description = form.getFieldValue("description");
    let imageUrl = "";
    console.log(`INCIDENTFORM:${showMarker} - ${incidentLocation}`);
    // console.log(selectedImage);
    try {
      // if (selectedImage !== undefined) {
      //   imageUrl = await incidentsService.uploadImageToImgBB(selectedImage);
      //   console.log("Image URL:", imageUrl);
      // }

      const locationRequest = {
        coordinates: `SRID=4326;POINT (${incidentLocation[1]} ${incidentLocation[0]})`,
      };
      const addedLocation = await mapService.postLocation(locationRequest);
      console.log(`ADDEDLOCATION: ${addedLocation}`);
      console.log(`ADDEDLOCATIONID: ${addedLocation.data.id}`);

      const incidentRequest = {
        description: description,
        location_id: addedLocation.data.id,
        image_url: imageUrl,
        type: selectedIncidentType,
      };

      console.log(
        "Location and Incident Requests:",
        locationRequest,
        incidentRequest
      );

      try {
        const response = await incidentsService.postIncident(incidentRequest);
        onReset();
        console.log(response);
      } catch (error) {
        console.error("Error adding location", error);
      }
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
      }}
    >
      <h1>Add Incident</h1>
      <Form
        title="Title"
        form={form}
        name="incidentForm"
        style={{
          width: "40%",
          paddingRight: "120px",
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} style={{ resize: "none" }} />
        </Form.Item>
        <Form.Item label="Type" name="type">
          <Select
            onChange={(selectedType) => {
              setSelectedParentType(selectedType);
              setSelectedIncidentType(selectedType);
              form.resetFields(["subtype"]);
            }}
            value={selectedParentType}
          >
            {parentTypes.map((parentType, index) => (
              <Option key={index} value={parentType.id}>
                {parentType.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {selectedParentType && (
          <Form.Item label="Subtype" name="subtype">
            <Select
              onChange={(selectedType) => {
                if (selectedType === undefined) {
                  setSelectedIncidentType(selectedParentType);
                } else {
                  setSelectedIncidentType(selectedType);
                }
              }}
              allowClear={true}
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
        )}
        {/* <Form.Item label="Image" name="image">
            <input
              type="file"
              name="image"
              id="image"
              onChange={handleImageChange}
              value={selectedImage || ""}
            />
          </Form.Item> */}
        {!showMarker && (
          <label style={{ paddingLeft: "25%", fontSize: "20px" }}>
            <b>Select a location on the map</b>
          </label>
        )}
        <Form.Item
          wrapperCol={{
            offset: 6,
            span: 16,
          }}
        >
          {showMarker && (
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: "20px" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          )}

          <Button
            htmlType="button"
            onClick={onReset}
            style={{ marginLeft: !showMarker ? "20px" : "" }}
          >
            Reset
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default IncidentForm;
