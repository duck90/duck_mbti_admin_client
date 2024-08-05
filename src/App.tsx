import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useCookies } from "react-cookie";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import "./App.css";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import User from "./pages/User";
import Test from "./pages/Test";
import TestDetail from "./pages/Test/TestDetail";
import TestResult from "./pages/Test/TestResult";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [cookies] = useCookies(["d_bti_token"]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route element={<PrivateRoute />}>
              <Route path="/users" element={<User />} />
              <Route path="/tests" element={<Test />} />
              <Route path="/create-test" element={<TestDetail />} />
              <Route path="/test-detail/:id" element={<TestDetail />} />
              <Route path="/test-result/:id" element={<TestResult />} />
            </Route>
          </Route>

          <Route
            path="/login"
            element={
              !!cookies["d_bti_token"] ? (
                <Navigate to="/tests" replace />
              ) : (
                <Login />
              )
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

const PrivateRoute = () => {
  const [cookies] = useCookies(["d_bti_token"]);

  const isLogined = !!cookies["d_bti_token"];

  return isLogined ? <Outlet /> : <Navigate to="/" />;
};
