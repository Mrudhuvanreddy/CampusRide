import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PageTransition({ children }) {
    const location = useLocation();
    const navigate = useNavigate();

    const showSplash =
        location.pathname === "/" &&
        new URLSearchParams(location.search).get("splash") === "1";

    useEffect(() => {
        if (!showSplash) {
            return;
        }

        const timer = setTimeout(() => {
            navigate("/", { replace: true });
        }, 2500);

        return () => clearTimeout(timer);
    }, [showSplash, navigate]);

    if (showSplash) {
        return (
            <div className="campusride-splash">
                <div className="campusride-splash-logo">
                    <span className="splash-car">🚗</span>
                    <span>CampusRide</span>
                </div>
            </div>
        );
    }

    return children;
}

export default PageTransition;