import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signout from "./pages/Signout";


function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/signup" element={<Signup />} />

                <Route path="/signin" element={<Login />} />

                <Route path="/home" element={<Home />} />

                <Route path="/signout" element={<Signout />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;