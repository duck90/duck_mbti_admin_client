import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Avatar,
  Tooltip,
  MenuItem,
} from "@mui/material";
import { useCookies } from "react-cookie";
import AdbIcon from "@mui/icons-material/Adb";

const Header = () => {
  const navigate = useNavigate();
  const removeCookie = useCookies()[2];
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const settings = [
    {
      key: "logout",
      text: "Logout",
      onClick: () => {
        setOpenUserMenu(false);
        removeCookie("d_bti_token");
        navigate("/login");
      },
    },
  ];

  return (
    <AppBar position="fixed">
      <Toolbar disableGutters sx={{ mx: 2 }}>
        <AdbIcon sx={{ display: "flex", mr: 1 }} />
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="#app-bar-with-responsive-menu"
          sx={{
            mr: 1,
            display: "flex",
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          Admin
        </Typography>
        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton
              onClick={() => setOpenUserMenu(!openUserMenu)}
              sx={{ p: 0 }}
            >
              <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            // anchorEl={openUserMenu}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={openUserMenu}
            onClose={() => setOpenUserMenu(false)}
          >
            {settings.map((setting) => (
              <MenuItem key={setting.key} onClick={setting.onClick}>
                <Typography textAlign="center">{setting.text}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
