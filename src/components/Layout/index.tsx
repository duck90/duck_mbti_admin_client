import { Outlet } from "react-router-dom";
import { Box, Stack } from "@mui/material";

import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <Box>
      <Header />
      <Stack direction="row">
        <Sidebar />
        <Box sx={{ width: 1500, mt: 8, p: "40px 40px 0 40px" }}>
          <Outlet />
        </Box>
      </Stack>
    </Box>
  );
};

export default Layout;
