import React, { useState } from "react";
import { registerUser } from "../../services/authService";

const Register = ({showLoginHandler}) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser({
                name,
                email,
                password,
            });
            setName("");
            setEmail("");
            setPassword("");
            alert("Registration successful");
            showLoginHandler();

        } catch (error) {
            console.log("registarion fialed ",error);
            alert("Registration Failed");
        }
    };

    return (
        <div className="contentArea">

            <form className="authForm" onSubmit={handleSubmit}>
                <h3>Register</h3>
                <label>Name</label><br />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name"></input>
                <br />

                <label>Email</label> <br />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" />
                <br />

                <label>Password</label><br />

                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" />
                <br />

                <button type="submit"> Register  </button>
            </form>
        </div>
    );
};

export default Register;