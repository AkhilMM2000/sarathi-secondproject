import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const usePreventBackNavigation = (): void => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleBackButton = (event: PopStateEvent): void => {
            event.preventDefault();
            navigate(1); // Prevent going back
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handleBackButton);

        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };
    }, [navigate]);
};

export default usePreventBackNavigation;
