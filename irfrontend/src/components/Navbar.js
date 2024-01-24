import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  const itemsLeft = [
    {
      label: "Home",
      key: "home",
      path: "/",
    },
    {
      label: "Grouped Incidents",
      key: "grouped-incidents",
      path: "/grouped-incidents",
    },
    {
      label: "Analysis",
      key: "analysis",
      path: "/analysis",
    },
  ];

  const loginButton = [
    {
      label: "Login",
      key: "login",
      path: "/login",
    },
  ];

  const logoutButton = [
    {
      label: "Logout",
      key: "logout",
      onClick: logoutUser,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "15px",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div>
        {itemsLeft.map(({ label, key, path }) => (
          <Link
            key={key}
            to={path}
            style={{
              marginLeft: "20px",
              textDecoration: "none",
              color: "#333",
            }}
          >
            {label}
          </Link>
        ))}
      </div>
      {/* {user && <div>{user && <div>Hello {user.username}</div>}</div>} */}
      <div>
        {user
          ? logoutButton.map(({ label, key, onClick }) => (
              <a
                key={key}
                href="/"
                onClick={onClick}
                style={{
                  marginLeft: "20px",
                  textDecoration: "none",
                  color: "#333",
                  cursor: "pointer",
                }}
              >
                {label}
              </a>
            ))
          : loginButton.map(({ label, key, path }) => (
              <Link
                key={key}
                to={path}
                style={{
                  marginLeft: "20px",
                  textDecoration: "none",
                  color: "#333",
                }}
              >
                {label}
              </Link>
            ))}
      </div>
    </div>
  );
};

export default Navbar;
