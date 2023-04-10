import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/login/LoginPage";
import { RegisterPage } from "./pages/login/RegisterPage";
import { LeaderboardPage } from "./pages/leaderboard/LeaderboardPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { ShowcasePage } from "./pages/showcase/ShowcasePage";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute } from "./utils/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <div className="App">
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
          <Route
            path="*"
            element={
              <div>
                404 Not Found - Sorry we couldn't find what you are looking for.
              </div>
            }
          ></Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
