import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route
              exact
              path="*"
              element={<PrivateRoute exact path="/" element={<HomePage />} />}
            />
            {/* <Route exact path="/" Component={HomePage} /> */}
            <Route exact path="/login" Component={LoginPage} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
