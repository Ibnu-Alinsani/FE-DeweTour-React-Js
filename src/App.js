import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Swal from "sweetalert2";
import "./App.css";
import navbarCrop from "./assets/navbar-crop.png";
import { API, setAuthToken } from "./config/api";
import { UserContext } from "./context";
import AddTrip from "./pages/add-trip";
import Booking from "./pages/booking";
import Detail from "./pages/detail";
import Trip from "./pages/income-trip";
import LandingPages from "./pages/landing-pages/landing-page";
import AdminList from "./pages/list-transaction";
import Profile from "./pages/profil";
import UpdateTrip from "./components/modal/update-trip";
import Footer from "./parts/Footer/footer";
import Navbar from "./parts/navbar";

function App() {
  const [state, dispatch] = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (state.isLogin === false) {
        <Navigate to="/" replace />;
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      checkUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");
      console.log("check user success ", response);

      let payload = response.data.data;

      payload.token = localStorage.token;

      dispatch({
        type: "USER_SUCCESS",
        payload,
      });

      setIsLoading(false);
    } catch (error) {
      console.log("check user failed : ", error);
      dispatch({
        type: "AUTH_ERROR",
      });
      setIsLoading(false);
    }
  };

  function PrivateRouteAdmin(props) {
    if (props.login != "admin") {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  }

  function PrivateRouteUser(props) {
    if (props.login != "user") {
      Swal.fire({
        title: "Error",
        text: `You Must be Login First`,
        icon: "error",
      });
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  }

  document.addEventListener("wheel", function(event){
    if(document.activeElement.type === "number"){
        document.activeElement.blur();
    }
});

  return (
    <>
      {isLoading ? null : (
        <>
          <main>
            {/* // <Router> */}
            <Navbar />
            <img src={navbarCrop} className="navbar-crop" />
            <Routes>
              <Route
                path="/"
                element={
                  state.user.role == "admin" ? <AdminList /> : <LandingPages />
                }
              />
              <Route path="/detail-place/:id" element={<Detail />} />

              <Route
                exact
                path="/"
                element={<PrivateRouteAdmin login={state.role} />}
              >
                <Route path="/trip-income" element={<Trip />} />
                <Route path="/add-trip" element={<AddTrip />} />
                <Route path="/update-trip" element={<UpdateTrip />} />
              </Route>

              <Route
                exact
                path="/"
                element={<PrivateRouteUser login={state.role} />}
              >
                <Route exact path="/booking" element={<Booking />} />
                <Route exact path="/profile" element={<Profile />} />
              </Route>
              {/* private route */}
            </Routes>
          </main>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
