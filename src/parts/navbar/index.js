import { useContext, useEffect, useState } from "react";
import icon from "../../assets/Icon.svg";
import close from "../../assets/close.svg";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "rsuite/Dropdown";
import profile from "../../assets/profile.png";
import profil from "../../assets/profil.jpg";
import bill from "../../assets/bill.png";
import logout from "../../assets/logout.png";
import trip from "../../assets/trip.png";
import adminPhoto from "../../assets/admin.jpg";
import palm from "../../assets/palm.png";
import hibiscus from "../../assets/hibiscus.png";
import list from "../../assets/list.png";
import "rsuite/dist/rsuite.min.css";
import { useMutation, useQuery } from "react-query";
import { API, setAuthToken } from "../../config/api";
import jwt_decode from "jwt-decode";

import { Button } from "react-bootstrap";
import { useCol } from "react-bootstrap/esm/Col";
import { UserContext } from "../../context";
import Swal from "sweetalert2";

export default function Navbar(props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [showAlert, setShowAlert] = useState(false);
  const [register, setRegister] = useState();
  const [img, setImg] = useState();
  const [imgShow, setImgShow] = useState(false);

  const [state, dispatch] = useContext(UserContext);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    gender: "",
  });

  const { data: user, refetch } = useQuery("userCache", async () => {
    const response = await API.get("/user/" + state.user.id);
    return response.data.data;
  });

  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });

  const handleLogout = () => {
    Swal.fire({
      title: "Logout Success",
      text: `See You Again `,
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
    dispatch({
      type: "LOGOUT",
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeLogin = (e) => {
    setFormLogin({
      ...formLogin,
      [e.target.name]: e.target.value,
    });
  };

  function handleOnClickLogin() {
    const visible = document.querySelector(".container-form-login");
    visible.style.visibility = "visible";
  }
  function handleOnClickRegister() {
    const visible = document.querySelector(".container-form-register");
    visible.style.visibility = "visible";
  }
  function hiddenLogin() {
    const hiddenForm = document.querySelector(".container-form-login");
    hiddenForm.style.visibility = "hidden";
    setShowAlert(false);
  }
  function hiddenRegister() {
    const hiddenForm = document.querySelector(".container-form-register");
    // console.log(hiddenForm);
    hiddenForm.style.visibility = "hidden";
  }

  const Navigate = useNavigate();

  const handleOnSubmitLogin = useMutation(async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/login", formLogin);
      const data = response.data.data;
      console.log("Login Success : ", data);

      if (data.role == "admin") {
        const Toast = Swal.mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title: `Welcome ${data.fullname}, 
          How Are You Today?`,
        });
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "success",
          title: `Welcome ${data.fullname}, Enjoy Your Travel`,
        });
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data.data,
      });

      setImgShow(true);

      setAuthToken(localStorage.token);
      hiddenLogin();
      Navigate("/");
    } catch (error) {
      console.log("Login Failed : ", error);
      Swal.fire({
        title: "Login Failed",
        text: `Try Again, please`,
        icon: "error",
      });
    }
  });

  useEffect(() => {
    const icon = document.querySelector(".rs-btn");
    // console.log(icon, "ini icon");
    if (icon) {
      if (user?.role == "user") {
        icon.style.backgroundImage = `url(${
          user?.image ? user?.image : profil
        })`;
        icon.style.zIndex = "2";
      } else {
        icon.style.backgroundImage = `url(${profil})`;
        icon.style.zIndex = "2";
      }
    }
  }, [imgShow, user?.image]);

  const handleOnSubmitRegister = useMutation(async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/register", form);
      console.log("Registration success : " + response);

      hiddenRegister();
      setForm({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        gender: "",
      });
      Swal.fire({
        title: "Register Success",
        text: `Please Login`,
        icon: "success",
        // confirmButtonText: "oke",
      });
      handleOnClickLogin();
    } catch (error) {
      console.log("registration Failed : " + error);
      Swal.fire({
        title: "Registration Failed, your Email Already exists",
        text: `Try Again, please`,
        icon: "error",
      });
    }
  });

  function handleClickHereLogin() {
    hiddenLogin();
    handleOnClickRegister();
  }
  function handleClickHereRegister() {
    hiddenRegister();
    handleOnClickLogin();
  }

  const styleLink = {
    color: "black",
  };

  return state?.user.role == "admin" ? (
    <>
      <nav className="nav">
        <Link to="/">
          <img src={icon} alt="Dewe Tour" className="icon" />
        </Link>
        <div className="profil">
          <Dropdown title="" trigger={"hover"}>
            <Dropdown.Item>
              <Link
                to="/trip-income"
                style={styleLink}
                className="fs-18 fw-700 text-pr-sans link-dropdown"
              >
                <img src={trip} alt="profile" className="icon-dropdown" />
                <button
                  style={styleLink}
                  className="btn-logout fs-18 fw-700 text-pr-sans"
                >
                  Trip
                </button>
              </Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link
                to="/"
                style={styleLink}
                className="fs-18 fw-700 text-pr-sans link-dropdown"
              >
                <img src={list} alt="profile" className="icon-dropdown" />
                <button
                  style={styleLink}
                  className="btn-logout fs-18 fw-700 text-pr-sans"
                >
                  List Transactions
                </button>
              </Link>
            </Dropdown.Item>
            <hr />
            <Dropdown.Item>
              <img src={logout} alt="logout" className="icon-dropdown" />
              <button
                style={styleLink}
                className="btn-logout fs-18 fw-700 text-pr-sans"
                onClick={handleLogout}
              >
                Logout
              </button>
            </Dropdown.Item>
          </Dropdown>
        </div>
      </nav>
    </>
  ) : state?.user.role == "user" ? (
    <>
      <nav className="nav">
        <Link to="/">
          <img src={icon} alt="Dewe Tour" className="icon" />
        </Link>
        <div className="profil">
          <Dropdown title="" trigger={"hover"}>
            <Dropdown.Item>
              <Link
                to="/profile"
                style={styleLink}
                className="fs-18 fw-700 text-pr-sans link-dropdown"
              >
                <img src={profile} alt="profile" className="icon-dropdown" />
                <button
                  style={styleLink}
                  className="btn-logout fs-18 fw-700 text-pr-sans"
                >
                  Profile
                </button>
              </Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <img src={logout} alt="logout" className="icon-dropdown" />
              <button
                style={styleLink}
                className="btn-logout fs-18 fw-700 text-pr-sans"
                onClick={handleLogout}
              >
                Logout
              </button>
            </Dropdown.Item>
          </Dropdown>
        </div>
      </nav>
    </>
  ) : (
    <>
      <nav className="nav">
        <Link to="/">
          <img src={icon} alt="Dewe Tour" className="icon" />
        </Link>
        <div className="btn-contain">
          <Button
            className="btn btn-1"
            variant="outline-light"
            onClick={handleOnClickLogin}
          >
            {/* <Link to='/login' className="">Login</Link> */}
            Login
          </Button>
          <Button
            className="btn btn-2 text-white"
            variant="warning"
            onClick={handleOnClickRegister}
          >
            Register
          </Button>
        </div>
      </nav>

      {/* Login */}
      <div className="container-form-login">
        <div className="form-box">
          {showAlert ? (
            <div>
              <p
                style={{
                  color: "pink",
                  backgroundColor: "red",
                  padding: ".5rem 1rem",
                  borderRadius: "5px",
                  zIndex: "10",
                }}
              >
                Email atau password Salah
              </p>
            </div>
          ) : (
            <></>
          )}
          <button className="close" onClick={hiddenLogin}>
            <img src={close} alt="close" />
          </button>
          <img src={palm} alt="" className="palm" />
          <img src={hibiscus} alt="hibiscus" className="hibiscus" />
          <h1>Login</h1>

          <form
            className="form"
            onSubmit={(e) => handleOnSubmitLogin.mutate(e)}
          >
            <label htmlFor="email-login">Email</label>
            <div className="input-box">
              <input
                type="email"
                id="email-login"
                name="email"
                onChange={handleChangeLogin}
                required
              />
            </div>

            <label className="password" htmlFor="password-login">
              Password
            </label>
            <div className="input-box">
              <input
                type="password"
                id="password-login"
                name="password"
                onChange={handleChangeLogin}
                required
              />
            </div>
            <div className="btn-submit">
              <button type="submit">Login</button>
            </div>
          </form>
          <p className="p-register">
            Don't have account?{" "}
            <button onClick={handleClickHereLogin}>Click Here</button>
          </p>
        </div>
      </div>

      {/* register */}
      <div className="container-form-register">
        <div className="form-box form-box-register">
          <button className="close" onClick={hiddenRegister}>
            <img src={close} alt="close" />
          </button>
          <img src={palm} alt="" className="palm" />
          <img src={hibiscus} alt="hibiscus" className="hibiscus" />
          <h1>Register</h1>
          <form
            className="form"
            onSubmit={(e) => handleOnSubmitRegister.mutate(e)}
          >
            <div>
              <label className="full-name" htmlFor="full-name">
                Full Name
              </label>
              <div className="input-box">
                <input
                  type="text"
                  id="full-name"
                  name="fullName"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email-register">Email</label>
              <div className="input-box">
                <input
                  type="email"
                  id="email-register"
                  name="email"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="password" for="password-register">
                Password
              </label>
              <div className="input-box">
                <input
                  type="password"
                  id="password-register"
                  name="password"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="phone" htmlFor="phone">
                Phone
              </label>
              <div className="input-box" for="phone">
                <input
                  type="number"
                  id="phone"
                  name="phone"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="address" htmlFor="address">
                Address
              </label>
              <div className="input-box">
                <textarea
                  type="number"
                  id="address"
                  name="address"
                  className="bg-grey"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="button-register">
              <div className="btn-submit">
                <button type="submit">Register</button>
              </div>
              <p className="p-register">
                Already have account?{" "}
                <button onClick={handleClickHereRegister}>Click Here</button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
