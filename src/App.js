import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/login/LoginPage";
import { RegisterPage } from "./pages/login/RegisterPage";
import { LeaderboardPage } from "./pages/leaderboard/LeaderboardPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { ShowcasePage } from "./pages/showcase/ShowcasePage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/leaderboard" element={<LeaderboardPage />}></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
        <Route path="/showcase" element={<ShowcasePage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
