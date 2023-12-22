import React from "react";
import { HomeOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";
export default function Navbar() {
  const itemsLeft = [
    {
      label: <Link to="/">Incident Report</Link>,
      key: "home",
      // icon: <HomeOutlined />,
    },
  ];
  return (
    <div>
      <Menu
        mode="horizontal"
        items={itemsLeft}
        style={{ justifyContent: "center" }}
      />
    </div>
  );
}
