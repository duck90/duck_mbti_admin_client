import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { Box, Typography, Button, Modal } from "@mui/material";
import {
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  MRT_TableContainer,
} from "material-react-table";

import { getAllUsers } from "../../api/user";
import RegisterModal from "../../pages/Login/RegisterModal";

const User = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<any>([]);
  const [open, setOpen] = useState(false);

  const { refetch, data } = useQuery({
    queryKey: ["get/test"],
    queryFn: getAllUsers,
    enabled: !list.length,
  });

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    //column definitions...
    () => [
      {
        accessorKey: "id",
        header: "id",
      },
      {
        accessorKey: "username",
        header: "username",
      },
      {
        accessorKey: "role",
        header: "role",
      },

      {
        accessorFn: (row) => moment(row.created_at).format("YYYY-MM-DD hh:mm"),
        header: "created_at",
      },
      {
        accessorFn: (row) => moment(row.updated_at).format("YYYY-MM-DD hh:mm"),
        header: "updated_at",
      },
    ],
    []
  );

  useEffect(() => {
    if (!!data) setList(data);
  }, [data]);

  return (
    <Box>
      <Typography variant="h5">User</Typography>

      <Box sx={{ mb: 2, maxWtestIdth: 1500, overflow: "auto" }}>
        <MRT_TableContainer
          table={useMaterialReactTable({
            autoResetPageIndex: false,
            columns,
            data: list,
            enableColumnActions: false,
            enableSorting: false,
            enableColumnResizing: true,
            columnResizeMode: "onEnd",
          })}
        />
      </Box>

      <Button variant="contained" onClick={() => setOpen(true)}>
        New
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
            border: "2px solid #545454",
            boxShadow: 24,
            p: 4,
          }}
        >
          <>
            <RegisterModal
              close={() => {
                setOpen(false);
                refetch();
              }}
            />
          </>
        </Box>
      </Modal>
    </Box>
  );
};

export default User;
