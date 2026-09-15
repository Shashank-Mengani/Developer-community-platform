import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signout from "./pages/Signout";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Questions from "./pages/Questions";
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./pages/Settings";
import Layout from "./layouts/Layout";
import QuestionDetail from "./pages/QuestionDetail";
import AskQuestion from "./pages/AskQuestion";
import Hackathon from "./pages/Hackathons";
import HackathonDetail from "./pages/HackathonDetail";
import CreateHackathon from "./pages/CreateHackathon";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/signup" element={<Signup />} />

                <Route path="/login" element={<Login />} />

                <Route path="/signout" element={<Signout />} />

                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >

                <Route 
                    path="/" 
                    element={
                            <Home />
                    } />

                <Route
                    path="/questions/:questionId"
                    element={<QuestionDetail />}
                />

                <Route
                    path="/questions/ask"
                    element={<AskQuestion />}
                />    

                <Route 
                    path="/hackathon"
                    element={<Hackathon />} 
                />

                <Route 
                    path="/hackathons/:hackathonId"
                    element={<HackathonDetail />}
                />

                <Route
                    path="/hackathons/create"
                    element={<CreateHackathon />}
                    />

                <Route
                    path="/profile"
                    element={
                            <Profile />
                    }
                />

                <Route
                    path="/profile/:id"
                    element={<Profile />}
                />    

                <Route
                    path="/explore"
                    element={
                            <Questions />
                    }
                />

                <Route
                    path="/notifications"
                    element={
                            <Notifications />
                    }
                />

                <Route
                    path="/settings"
                    element={
                            <Settings />
                    }
                />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;