import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRouteAdmin = ({ children }) => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    if (!token || role === "USER") {
        return <Navigate to="/authentication/sign-in" replace />;
    }

    return children;
};

ProtectedRouteAdmin.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRouteAdmin;