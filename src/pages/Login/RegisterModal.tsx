import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Stack,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

import { createAdmin } from "../../api/user";

interface Props {
  close: Function;
}
const RegisterModal: React.FC<Props> = ({ close }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "manager",
  });
  const [cookies] = useCookies();
  const userInfo: { role: "admin" | "manager" } | null = cookies["d_bti_token"]
    ? jwtDecode(cookies["d_bti_token"])
    : null;

  const { mutate: registerAdmin } = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      close();
    },
    onError: () => {},
  });

  return (
    <Stack alignItems={"center"} justifyContent={"center"}>
      <TextField
        label="id"
        variant="outlined"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        sx={{ width: 300 }}
      />
      <TextField
        label="password"
        variant="outlined"
        type="password"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        sx={{ width: 300, my: 5 }}
      />

      {userInfo?.role !== "manager" && (
        <FormControl>
          <InputLabel id="role-select">Role</InputLabel>
          <Select
            labelId="role-select"
            id="role-select"
            value={formData.role}
            label="Role"
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            sx={{ width: 300 }}
          >
            <MenuItem value={"admin"}>Admin</MenuItem>
            <MenuItem value={"manager"}>Manager</MenuItem>
          </Select>
        </FormControl>
      )}

      <Button
        variant="contained"
        onClick={() => registerAdmin(formData)}
        sx={{ width: 300, height: 40, mt: 5 }}
      >
        등록
      </Button>
    </Stack>
  );
};

export default RegisterModal;
