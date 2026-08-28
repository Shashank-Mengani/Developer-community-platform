import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signout from "./pages/Signout";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Explore from "./pages/Explore";


function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/signup" element={<Signup />} />

                <Route path="/signin" element={<Login />} />

                <Route path="/home" element={<Home />} />

                <Route path="/profile" element={<Profile />} />

                <Route path="/signout" element={<Signout />} />

                <Route path="/explore" element={<Explore />} />

                <Route path="/notifications" element={<Notifications />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;