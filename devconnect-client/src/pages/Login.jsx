import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../services/api'
const Login = () => {
    
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            email,
            password
        }
        
        try {
            const response = await api.post('/auth/signin', formData);
            setMessage(response.data.message);

            navigate('/');
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Signin failed"
            )
        }
    }

  return (
    <div>
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>

            <p>{message}</p>

            <input 
                type='email'
                placeholder='Email'
                onChange={(e) => setEmail(e.target.value)}
            />

            <input 
                type='password'
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type='submit'>Login</button>
        </form>
    </div>
  )
}

export default Login