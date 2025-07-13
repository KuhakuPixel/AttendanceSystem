import { useState, useEffect } from 'react'
import './App.css'
import { getBase64 } from './Util';

const BASE_URL = "http://localhost:3005";

function UserForm({ link, http_method, emailVal = "", usernameVal = "", ageVal = 0, passwordVal = "", token = "", successMsg }) {
  const [email, setEmail] = useState(emailVal);
  const [username, setUsername] = useState(usernameVal);
  const [age, setAge] = useState(ageVal);
  const [password, setPassword] = useState(passwordVal);

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    try {
      const response = await fetch(link, {
        method: http_method,

        headers: {
          'Content-Type': 'application/json',
          "Authorization": token
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
        alert(successMsg);
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
      <br />
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
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}
function RegisterNewEmployee({ onBack }) {
  return <div>
    <button onClick={
      () => { onBack() }
    }>back</button>
    <UserForm link={BASE_URL + "/register-employee"} http_method={"POST"} successMsg={"Employee registered"}></UserForm>

  </div >
}

function ViewAttendances({ onBack, token }) {

  const [attendances, setAttendances] = useState([])
  useEffect(() => {
    async function getAttendances() {
      const response = await fetch(BASE_URL + "/attendances", {
        headers: {
          'Authorization': token,
        },
      })
      const profileJson = await response.json()
      setAttendances(profileJson)
    };
    if (attendances.length == 0) {
      getAttendances()
    }
  });

  const attendancesItem = attendances.map(attendance =>
    <tr>
      <td>{attendance["user_id"]}</td>
      <td>{attendance["check_in_out_type"]}</td>
      <td>{attendance["time"]}</td>
      <td><img src={attendance["photo_proof"]}></img></td>
    </tr>
  );
  return <div>
    <button onClick={
      () => { onBack() }
    }>back</button>

    <table>
      <thead>
        <tr>
          <th> employee id </th>
          <th> checkin/checkout </th>
          <th> time </th>
          <th> photo </th>
        </tr>
      </thead>
      <tbody>
        {attendancesItem}

      </tbody>
    </table>

  </div >
}

function EditEmployeePage({ onBack, token, employeeToEdit }) {
  return <div>
    <button onClick={
      () => { onBack() }
    }>back</button>
    <p>editing employee id {employeeToEdit["id"]} </p>
    <UserForm http_method={"PUT"} link={BASE_URL + "/users" + "/" + employeeToEdit["id"]}
      ageVal={employeeToEdit["age"]}
      emailVal={employeeToEdit["email"]}
      passwordVal={employeeToEdit["password"]}
      usernameVal={employeeToEdit["username"]}
      successMsg={"Employee edited"}
      token={token}
    ></UserForm>
  </div>
}

function DeleteEmployeePage({ onBack, token, employeeToDelete }) {

  return <div>
    <p> Delete Employee?</p>
    <button onClick={
      () => { onBack() }
    }>No</button>
    <button onClick={async () => {
      const response = await fetch(BASE_URL + "/users" + "/" + employeeToDelete["id"], {
        method: "DELETE",
        headers: {
          "Authorization": token
        },
      })
      if (response.ok) {
        //const data = await response.json();
        alert("employee deleted");
        onBack();
      }
    }}>
      Yes
    </button>
  </div>
}

function ViewEmployeesPage({ onBack, token }) {
  const [page, setPage] = useState("view_employee_page")
  const [employees, setEmployees] = useState([])
  const [employeeToEdit, setEmployeeToEdit] = useState(-1)
  const [employeeToDelete, setEmployeeToDelete] = useState(-1)

  async function getEmployees() {
    const response = await fetch(BASE_URL + "/users", {
      headers: {
        'Authorization': token,
      },
    })
    const profileJson = await response.json()
    setEmployees(profileJson)
  };
  useEffect(() => {
    if (employees.length == 0) {
      getEmployees()
    }
  });

  const employeeItem = employees.map(employee =>
    <tr>
      <td>{employee["id"]}</td>
      <td>{employee["email"]}</td>
      <td>{employee["username"]}</td>
      <td>{employee["age"]}</td>
      <td>{employee["password"]}</td>
      <td><button onClick={() => {
        setEmployeeToEdit(employee)
        setPage("edit_employee")
      }}> Edit </button></td>

      <td><button onClick={() => {
        setEmployeeToDelete(employee)
        setPage("delete_employee")
      }}> Delete </button></td>
    </tr>
  );
  if (page === "view_employee_page") {
    return <div>
      <button onClick={
        () => { onBack() }
      }>back</button>

      <table>
        <thead>
          <tr>
            <th> employee id </th>
            <th> email </th>
            <th> username </th>
            <th> age </th>
            <th> password </th>
            <th>  </th>
            <th>  </th>
          </tr>
        </thead>
        <tbody>
          {employeeItem}

        </tbody>
      </table>

    </div >
  }
  else if (page === "edit_employee") {
    return <EditEmployeePage onBack={
      () => {
        setPage("view_employee_page")
        getEmployees() // refresh

      }
    } employeeToEdit={employeeToEdit} token={token}></EditEmployeePage>
  }
  else if (page === "delete_employee") {
    return <DeleteEmployeePage onBack={
      () => {
        setPage("view_employee_page")
        getEmployees() // refresh

      }
    } employeeToDelete={employeeToDelete} token={token}></DeleteEmployeePage>

  }
}


function AdminHomePage({ onLogout, token }) {
  const [page, setPage] = useState("home");

  if (page === "home") {
    return <div>
      <p> you are an admin</p>

      <button
        onClick={
          () => { onLogout(); }
        }
      > Logout </button>

      <br /><br />
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
    }}
      token={token}
    ></ViewAttendances>
  }

  else if (page === "view_employees") {
    return <ViewEmployeesPage onBack={() => {
      setPage("home");
    }}
      token={token}
    ></ViewEmployeesPage>
  }


}

function CheckInForm({ token }) {
  const [photoFileName, setPhotoFileName] = useState("");
  const [photo, setPhoto] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    try {
      const response = await fetch(BASE_URL + "/checkin", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          "photo": photo,
        }),
      })

      if (response.ok) {
        alert("checkin okay");
      } else {
        const err = await response.text();
        alert("Checkin failed: " + err);
      }
    } catch (error) {
      alert("An error occurred while submitting the form: " + error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email"> photo </label><br />
      <input type="file" name="myImage" accept="image/*"
        value={photoFileName}
        onChange={(e) => {
          console.log(e.target.value)
          setPhotoFileName(e.target.value);
          getBase64(e.target.files[0], (result) => {
            setPhoto(result);
          })
        }}
      />

      <br />

      <br />
      <button type="submit">Checkin</button>
    </form>)

}
function UserHomePage({ onLogout, token }) {
  const [attendances, setAttendances] = useState([])
  async function getMyAttendances() {
    const response = await fetch(BASE_URL + "/my-attendances", {
      headers: {
        'Authorization': token,
      },
    })
    if (!response.ok) {
      alert(await response.text());

    }
    const json = await response.json()


    setAttendances(json.map(attendance =>
      <tr>
        <td>{attendance["check_in_out_type"]}</td>
        <td>{attendance["time"]}</td>
      </tr>
    ));
  };
  useEffect(() => {
    if (attendances.length == 0) {
      getMyAttendances();
    }
  });
  return <>
    <p> you are a normal user</p>
    <button
      onClick={
        () => { onLogout(); }
      }
    > Logout </button>

    <br /><br />
    <CheckInForm token={token}></CheckInForm>
    <br /><br />

    <button
      onClick={
        async () => {
          const response = await fetch(BASE_URL + "/checkout", {
            method: "POST",
            headers: {
              'Authorization': token,
            },
          })
          if (response.ok) {
            alert("You have checked out")
            getMyAttendances(); // refresh
          }
          else {
            const err = await response.text();
            alert("Checkout failed: " + err);

          }
        }
      }
    > Checkout </button>
    <table>
      <thead>
        <tr>
          <th> checkin/checkout </th>
          <th> time </th>
        </tr>
      </thead>
      <tbody>
        {attendances}

      </tbody>
    </table>
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
    if (Object.keys(profile).length == 0) {
      getProfile()
    }
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
  if (!token) {
    return (formType === "register" ? (
      <>
        <p> Register Admin </p>
        <UserForm link={BASE_URL + "/register-admin"} http_method={"POST"} successMsg={"Admin registered"} />
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
    ))
  }
  else {
    return <HomePage onLogout={() => {
      setToken("");
    }}
      token={token}
    ></HomePage>
  }
}

export default App
