import { useState } from "react"
import api from '../services/api'
function Signup () {

    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

       const formData = {
            name,
            email,
            password
       }

       try {
        const response = await api.post('/auth/signup', formData);
        setMessage(response.data.message);

       } catch (error) {
        setMessage(
            error.response?.data?.message || "Signup failed"
        );
       }
    }

  return (
    <div>
        <h1>Create Account</h1>

        <form onSubmit={handleSubmit}>
            <p>{message}</p>
        <input 
            placeholder="Name"
         onChange={(e) => setName(e.target.value)}
         />

         <input 
            type="email"
            placeholder="Email"
         onChange={(e) => setEmail(e.target.value)}
         />

         <input 
            type="password"
            placeholder="Password"
         onChange={(e) => setPassword(e.target.value)}
         />

         <button type="submit">Sign Up</button>
         </form>
    </div>
  )
}

export default Signup