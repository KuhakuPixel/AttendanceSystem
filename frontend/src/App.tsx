import { useState } from 'react'

import './App.css'

const BASE_URL = "http://localhost:3005";
function UserForm({ link }) {
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
      alert("An error occurred while submitting the form: " + error);
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
function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    age: "",
    password: "",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    try {
      const response = await fetch(BASE_URL + "/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": email,
          "password": password,
        }),
      })

      if (response.ok) {
        //const data = await response.json();
        alert("User Login successful!, token: " + await response.text());
      } else {
        const err = await response.text();
        alert("Login failed: " + err);
      }
    } catch (error) {
      alert("An error occurred while submitting the form: " + error);
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

  const [formType, setFormType] = useState("login");
  return (
    <>
      {formType === "register" ? (
        <>
          <UserForm link={BASE_URL + "/register-admin"} />
          <a href="#" onClick={(e) => { e.preventDefault(); setFormType("login"); }}>
            I already have an account
          </a>
        </>
      ) : (
        <>
          <LoginForm />
          <a href="#" onClick={(e) => { e.preventDefault(); setFormType("register"); }}>
            I don't have an account
          </a>
        </>
      )}
    </>
  )
}

export default App
