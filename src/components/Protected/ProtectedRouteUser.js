import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRouteUser = ({ children }) => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    if (!token || role === "ADMIN" || role === "SUPERADMIN") {
        return <Navigate to="/authentication/sign-in" replace />;
    }

    return children;
};

ProtectedRouteUser.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRouteUser;