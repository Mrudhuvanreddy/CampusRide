import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./page/Index";
import Login from "./page/Login";
import Register from "./page/Register";
import Dashboard from "./page/Dashboard";
import OfferRide from "./page/OfferRide";
import FindRide from "./page/FindRide";
import MyRides from "./page/MyRides";
import RideRequests from "./page/RideRequests";
import Profile from "./page/Profile";

import PageTransition from "./components/PageTransition";

function App() {
    return (
        <BrowserRouter>
            <PageTransition>
                <Routes>

                    <Route path="/" element={<Index />} />

                    <Route path="/login" element={<Login />} />

                    <Route path="/register" element={<Register />} />

                    <Route path="/dashboard" element={<Dashboard />} />

                    <Route path="/offer-ride" element={<OfferRide />} />

                    <Route path="/find-ride" element={<FindRide />} />

                    <Route path="/my-rides" element={<MyRides />} />

                    <Route
                        path="/ride-requests/:rideId"
                        element={<RideRequests />}
                    />

                    <Route path="/profile" element={<Profile />} />

                </Routes>
            </PageTransition>
        </BrowserRouter>
    );
}

export default App;