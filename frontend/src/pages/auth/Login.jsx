import React, { useState } from 'react'
import { loginUser } from "../../services/authService";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({
                email,
                password,
            });

            alert("Login successful");
            localStorage.setItem("loginToken", response.data.token);
            localStorage.setItem('userId', response.data.userid);
            setEmail("");
            setPassword("");
            window.location.reload();

        } catch (error) {
            console.log(error);
            alert("Login Failed");
        }
    };

    return (
        <div className="contentArea">

            <form className="authForm" onSubmit={loginHandler}>
                <h3>Login</h3>

                <label>Email</label> <br />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" />
                <br />

                <label>Password</label><br />

                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" />
                <br />

                <button type="submit"> Login </button>
            </form>
        </div>
    );
};


export default Login