import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchCurrentUser = async () => {

            try {
                const response = await api.get("/auth/me");

                console.log("AUTH USER:", response.data);

                setUser(response.data.data);

            } catch (error) {

                console.log(
                    error.response?.data?.message ||
                    "User is not authenticated"
                );

                setUser(null);

            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();

    }, []);

    const signOut = async () => {

        try {

            await api.post("/auth/signout");

            setUser(null);

        } catch (error) {

            console.log(
                error.response?.data?.message ||
                "Failed to sign out"
            );

        }

    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                signOut,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};