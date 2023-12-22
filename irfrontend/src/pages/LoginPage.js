import React, { useContext } from "react";
import { Button, Form, Input } from "antd";
import AuthContext from "../context/AuthContext";

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);

  const onFinish = async (values) => {
    const { username, password } = values;

    try {
      console.log("LoginPage - Form submitted");
      await loginUser(username, password);
    } catch (error) {
      console.error("LoginPage - Error during login:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          width: 500,
          justifyContent: "center",
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          style={{
            marginRight: "20%",
          }}
          label="Username"
          name="username"
        >
          <Input />
        </Form.Item>
        <Form.Item
          style={{
            marginRight: "20%",
          }}
          label="Password"
          name="password"
        >
          <Input.Password />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default LoginPage;
