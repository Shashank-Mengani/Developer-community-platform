
import { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ Children }) => {
    const [user, setUser] = useState(null);

    return(
        <AuthContext.Provider value={{ user, setUser }}>
            {Children}
        </AuthContext.Provider>
    )
}

export default AuthContext;