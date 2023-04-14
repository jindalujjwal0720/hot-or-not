import { Route, Routes } from "react-router-dom";
import AuthProvider, { useAuth } from "./context/AuthContext";
import "./app.css";
import { Suspense, lazy, useEffect } from "react";
import { Loading } from "./components/error-loading/Loading";
import { Error404 } from "./components/error-loading/Error404";
import axios from "axios";
const LoginPage = lazy(() => import("./pages/login/LoginPage"));
const RegisterPage = lazy(() => import("./pages/login/RegisterPage"));
const LeaderboardPage = lazy(() =>
  import("./pages/leaderboard/LeaderboardPage")
);
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const ShowcasePage = lazy(() => import("./pages/showcase/ShowcasePage"));
const PrivateRoute = lazy(() => import("./utils/PrivateRoute"));

function App() {
  const { logout } = useAuth();

  const requestNewToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    await axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/token`, {
        token: refreshToken,
      })
      .then((res) => {
        const tokens = res.data;
        // save tokens in local storage or cookies
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
      })
      .catch((err) => {
        alert("Invalid Token. Please login again");
        logout();
      });
  };

  useEffect(() => {
    requestNewToken();
  }, []);

  return (
    <div className="App">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path="/leaderboard" element={<LeaderboardPage />}></Route>
          <Route path="/profile" element={<PrivateRoute />}>
            <Route exact path="" element={<ProfilePage />} />
          </Route>
          <Route path="/showcase" element={<PrivateRoute />}>
            <Route exact path="" element={<ShowcasePage />} />
          </Route>
          <Route exact path="/" element={<LeaderboardPage />}></Route>
          <Route path="*" element={<Error404 />}></Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
