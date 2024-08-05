import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { Stack, TextField, Button, Modal, Box } from "@mui/material";

import RegisterModal from "./RegisterModal";
import { postLogin } from "../../api/user";

const Login = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["d_bti_token"]);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [open, setOpen] = useState(false);

  const { mutate: login } = useMutation({
    mutationFn: postLogin,
    onSuccess: (data: { token: string }) => {
      setCookie("d_bti_token", data.token);
      navigate("/tests");
    },
    onError: () => {},
  });

  return (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      sx={{ height: "100vh" }}
    >
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
        sx={{ width: 300, mt: 5 }}
      />

      <Button
        variant="contained"
        onClick={() => login(formData)}
        sx={{ width: 300, height: 40, mt: 5 }}
      >
        Login
      </Button>

      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ width: 300, height: 40, mt: 2 }}
      >
        계정생성
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <>
            <RegisterModal close={() => setOpen(false)} />
          </>
        </Box>
      </Modal>
    </Stack>
  );
};

export default Login;
