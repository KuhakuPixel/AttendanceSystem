import { useState, useEffect } from 'react'
import './App.css'

const BASE_URL = "http://localhost:3005";


function UserForm({ link }) {
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

function LoginForm({ onLogin }) {
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
        let token = await response.text();
        //alert("User Login successful!, token: " + );
        onLogin(token);
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
function RegisterNewEmployee({ onBack }) {
  return <div>
    <button onClick={
      () => { onBack() }
    }>back</button>
    <UserForm link={BASE_URL + "/register-employee"}></UserForm>

  </div >
}

function ViewAttendances({ onBack }) {
  return <div>
    <button onClick={
      () => { onBack() }
    }>back</button>

  </div >
}

function ViewEmployees({ onBack }) {
  return <div>
    <button onClick={
      () => { onBack() }
    }>back</button>

  </div >
}


function AdminHomePage({ onLogout, token }) {
  const [page, setPage] = useState("home");

  if (page === "home") {
    return <div>
      <button onClick={
        () => { setPage("register_new_employee"); }
      }> register new employee </button>
      <br /><br />
      <button
        onClick={
          () => { setPage("view_attendances"); }
        }
      > view attendances </button>

      <br /><br />
      <button
        onClick={
          () => { setPage("view_employees"); }
        }
      > view employees </button>
      <br /><br />

      <button
        onClick={
          () => { onLogout(); }
        }
      > Logout </button>
    </div>
  }
  else if (page === "register_new_employee") {
    return <RegisterNewEmployee onBack={() => {
      setPage("home");
    }}></RegisterNewEmployee>
  }

  else if (page === "view_attendances") {
    return <ViewAttendances onBack={() => {
      setPage("home");
    }}></ViewAttendances>
  }

  else if (page === "view_employees") {
    return <ViewEmployees onBack={() => {
      setPage("home");
    }}></ViewEmployees>
  }


}

function UserHomePage({ onLogout, token }) {
  return <>
    <p>normal user</p>
  </>
}
function HomePage({ onLogout, token }) {

  const [profile, setProfile] = useState({})

  useEffect(() => {
    async function getProfile() {
      const response = await fetch(BASE_URL + "/profile", {
        headers: {
          'Authorization': token,
        },
      })
      const profileJson = await response.json()
      setProfile(profileJson)
    };
    getProfile();
  });

  if (Object.keys(profile).length > 0) {
    if (profile["is_admin"] == 1) {
      return <AdminHomePage onLogout={onLogout} token={token}></AdminHomePage>
    }
    else {
      return <UserHomePage onLogout={onLogout} token={token}></UserHomePage>
    }
  }
  else {
    return <></>
  }

}
function App() {

  const [formType, setFormType] = useState("login");
  const [token, setToken] = useState("");
  return (
    <>
      {
        !token ? (formType === "register" ? (
          <>
            <UserForm link={BASE_URL + "/register-admin"} />
            <a href="#" onClick={(e) => { e.preventDefault(); setFormType("login"); }}>
              I already have an account
            </a>
          </>
        ) : (
          <>
            <LoginForm onLogin={(token) => {
              setToken(token);
            }} />
            <a href="#" onClick={(e) => { e.preventDefault(); setFormType("register"); }}>
              I don't have an account
            </a>
          </>
        )) : (
          <HomePage onLogout={() => {
            setToken("");
          }}
            token={token}
          ></HomePage>
        )
      }
    </>
  )
}

export default App
