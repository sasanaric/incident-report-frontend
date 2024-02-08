import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Layout, Menu } from "antd";
import incidentsService from "../services/incidentsService";
const { Header, Content } = Layout;

const Analysis = () => {
  const [types, setTypes] = useState([]);
  const [analysisMonths, setAnalysisMonths] = useState([]);
  const [analysisTypes, setAnalysisTypes] = useState([]);
  const [analysisDays, setAnalysisDays] = useState([]);
  const tabs = ["Types", "Months", "Days"];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const items = new Array(3).fill(null).map((_, index) => ({
    key: index,
    label: tabs[index],
  }));
  useEffect(() => {
    loadTypes();
    loadAnalysisTypes();
    loadAnalysisMonths();
    loadAnalysisDays();
  }, []);
  const loadTypes = () => {
    incidentsService.getParentTypes().then((result) => {
      const resultTypes = result.data;
      setTypes(resultTypes);
    });
  };
  const loadAnalysisTypes = () => {
    incidentsService.analysisTypeIncidents().then((result) => {
      const resultTypes = result.data;
      setAnalysisTypes(resultTypes);
    });
  };
  const loadAnalysisMonths = () => {
    incidentsService.analysisMonthsIncidents().then((result) => {
      const resultMonths = result.data;
      setAnalysisMonths(resultMonths);
    });
  };
  const loadAnalysisDays = () => {
    incidentsService.analysisDaysIncidents().then((result) => {
      const resultDays = result.data;
      setAnalysisDays(resultDays);
    });
  };
  analysisTypes.forEach((analysisType) => {
    const correspondingType = types.find(
      (type) => type.id === analysisType.group_type_id
    );
    if (correspondingType) {
      analysisType.name = correspondingType.name;
    }
  });
  analysisMonths.forEach((analysisMonth) => {
    if (analysisMonth.month.split("-").length > 2) {
      let numberMonth = analysisMonth.month.split("-")[1];
      if (numberMonth.startsWith("0")) {
        numberMonth = numberMonth.slice("1");
      }
      analysisMonth.month = months[numberMonth];
    }
  });
  analysisDays.forEach((analysisDay) => {
    if (analysisDay.day.split("-").length > 2) {
      const date = new Date(analysisDay.day);
      const options = { weekday: "long" };
      const dayOfWeek = date.toLocaleDateString("en-US", options);
      analysisDay.day = dayOfWeek;
    }
  });
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };
  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          paddingLeft: "21px",
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["0"]}
          items={items}
          style={{
            paddingLeft: "0px",
          }}
          onSelect={(e) => {
            handleTabChange(tabs[e.key]);
          }}
        />
      </Header>
      <Content
        style={{
          padding: "50px",
        }}
      >
        {selectedTab === "Types" && (
          <div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analysisTypes}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {selectedTab === "Months" && (
          <div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analysisMonths}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {selectedTab === "Days" && (
          <div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analysisDays}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default Analysis;
