// import { Route, Navigate, Routes } from "react-router-dom";
// import { useContext } from "react";
// import AuthContext from "../context/AuthContext";
// const PrivateRoute = ({ path, element }) => {
//   const { user } = useContext(AuthContext);

//   return user ? (
//     <Routes>
//       <Route path={path} element={element} />
//     </Routes>
//   ) : (
//     <Navigate to="/login" />
//   );
// };

// export default PrivateRoute;
import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
const PrivateRoutes = () => {
  const { user } = useContext(AuthContext);

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
