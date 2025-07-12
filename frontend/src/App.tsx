import { useState } from 'react'

import './App.css'

const BASE_URL = "http://localhost:3005";
function RegisterUser({ link }) {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    age: "",
    password: "",
  });
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(0);
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    try {
      const response = await fetch(link, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": email,
          "username": username,
          "age": age,
          "password": password,
        }),
      })

      if (response.ok) {
        //const data = await response.json();
        alert("User registered successfully!");
      } else {
        const err = await response.text();
        alert("Registration failed: " + err);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email:</label><br />
      <input
        type="text"
        id="email"
        name="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      /><br />

      <label htmlFor="username">Username:</label><br />
      <input
        type="text"
        id="username"
        name="username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      /><br />

      <label htmlFor="age">Age:</label><br />
      <input
        type="number"
        id="age"
        name="age"
        value={age}
        onChange={(e) => {
          setAge(parseInt(e.target.value));
        }}
      /><br />

      <label htmlFor="password">Password:</label><br />
      <input
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      /><br />
      <button type="submit">Submit</button>
    </form>
  );
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <RegisterUser link={BASE_URL + "/register-admin"}></RegisterUser>

      </div>
    </>
  )
}

export default App
