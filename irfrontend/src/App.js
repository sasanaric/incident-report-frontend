import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import GroupedIncidents from "./pages/GroupedIncidents";
import Analysis from "./pages/Analysis";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            {/* <Route
            exact
            path="*"
            element={<PrivateRoute exact path="/" element={<HomePage />} />}
          /> */}
            <Route element={<PrivateRoutes />}>
              <Route element={<HomePage />} path="/" exact />
              <Route
                element={<GroupedIncidents />}
                path="/grouped-incidents"
                exact
              />
              <Route element={<Analysis />} path="/analysis" exact />
            </Route>
            <Route exact path="/login" element={<LoginPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
