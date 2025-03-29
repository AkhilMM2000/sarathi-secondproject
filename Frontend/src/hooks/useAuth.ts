import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const adminToken = localStorage.getItem("admin_accessToken");
        const driverToken = localStorage.getItem("driver_accessToken");
        const userToken = localStorage.getItem("user_accessToken");

    
        if (adminToken) return; // Admin is authenticated

        if (!driverToken && !userToken) {
            navigate("/login?type=user"); // Default to user login if no tokens
            return;
        }
       
        if (!driverToken) {
            navigate("/login?type=driver"); // Redirect to driver login if missing
            return;
        }

        if (!userToken) {
            navigate("/login?type=user"); // Redirect to user login if missing
            return;
        }
    }, [navigate]);
};

export default useAuth;
