import { useNavigate, useLocation } from "react-router-dom";

import { ListItemIcon, ListItemText, Paper } from "@mui/material";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";

import SendIcon from "@mui/icons-material/Send";

const MENUS = [
  { key: "tests", label: "Test", icon: <AssignmentIcon fontSize="small" /> },
  { key: "users", label: "User", icon: <PersonIcon fontSize="small" /> },
  { key: "shares", label: "Share", icon: <SendIcon fontSize="small" /> },
];

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Paper sx={{ minWidth: 250, height: "calc(100vh - 64px)", mt: 8 }}>
      <MenuList>
        {MENUS.map((item) => (
          <MenuItem
            key={item.key}
            onClick={() => navigate(`/${item.key}`)}
            sx={{ height: 50 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </MenuList>
    </Paper>
  );
};

export default Sidebar;
