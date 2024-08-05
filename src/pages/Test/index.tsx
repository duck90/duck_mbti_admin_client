import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import moment from "moment";
import { Box, Typography, Button, Switch } from "@mui/material";
import {
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  MRT_TableContainer,
} from "material-react-table";
// import { data as initData, type Person } from "./makeData";

import { getTestList, updateActive, updateOrder } from "../../api/test";
import { ITest } from "./interface";

const Test = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<ITest[]>([]);

  const { refetch, data } = useQuery({
    queryKey: ["get/test"],
    queryFn: () => getTestList(),
    enabled: !list.length,
  });

  const { mutate: updateTestActive } = useMutation({
    mutationFn: updateActive,
    onSuccess: refetch,
    onError: () => {},
  });

  const { mutate: updateTestOrder } = useMutation({
    mutationFn: updateOrder,
    onSuccess: refetch,
    onError: () => {},
  });

  const columns = useMemo<MRT_ColumnDef<ITest>[]>(
    //column definitions...
    () => [
      {
        accessorKey: "id",
        header: "title",
        Cell: ({ row, cell }) => {
          return (
            <span
              onClick={() =>
                navigate(`/test-detail/${cell.getValue<number>()}`)
              }
              style={{ cursor: "pointer" }}
            >
              {row.original.title}
            </span>
          );
        },
      },
      {
        accessorKey: "subtitle",
        header: "Subtitle",
      },
      {
        accessorKey: "question_count",
        header: "Ques Count",
      },
      {
        accessorFn: (row) =>
          !!row?.results?.length ? row?.results?.length : 0,
        header: "Result_count",
      },
      {
        accessorKey: "active",
        header: "active",
        Cell: ({ row, cell }) => {
          const testId = Number(row.getValue("id"));
          const rowData = row.original as ITest;

          return (
            <Switch
              checked={Boolean(cell.getValue())}
              onChange={(e) =>
                updateTestActive({ id: testId, checked: e.target.checked })
              }
              disabled={rowData?.results?.length !== 16}
            />
          );
        },
      },
      {
        accessorFn: (row) => moment(row.createdAt).format("YYYY-MM-DD hh:mm"),
        header: "CreatedAt",
      },
      {
        accessorKey: "result_id",
        header: "Result",
        Cell: (info) => {
          return (
            <Button
              variant="contained"
              onClick={() => navigate(`/test-result/${info?.row.original.id}`)}
            >
              result
            </Button>
          );
        },
      },
    ],
    []
    //end
  );

  useEffect(() => {
    if (!!data) setList(data);
  }, [data]);

  // useEffect(() => {
  //   if (!!prevList.length) {
  //     updateTestOrder(list.map((item, i) => ({ id: item.id, order_no: i })));
  //   }
  // }, [list]);

  return (
    <>
      <Box>
        <Typography variant="h5">Test</Typography>

        <Box sx={{ mb: 2, maxWtestIdth: 1500, overflow: "auto" }}>
          <MRT_TableContainer
            table={useMaterialReactTable({
              autoResetPageIndex: false,
              columns,
              data: list,
              enableRowOrdering: true,
              enableColumnActions: false,
              enableSorting: false,
              enableColumnResizing: true,
              columnResizeMode: "onEnd",
              muiRowDragHandleProps: ({ table }) => ({
                onDragEnd: () => {
                  const { draggingRow, hoveredRow } = table.getState();
                  if (hoveredRow && draggingRow) {
                    const tempList = [...list];
                    tempList.splice(
                      (hoveredRow as MRT_Row<ITest>).index,
                      0,
                      tempList.splice(draggingRow.index, 1)[0]
                    );
                    updateTestOrder(
                      tempList.map((item, i) => ({ id: item.id, order_no: i }))
                    );
                  }
                },
              }),
            })}
          />
        </Box>

        <Button variant="contained" onClick={() => navigate("/create-test")}>
          New
        </Button>
      </Box>
    </>
  );
};

export default Test;
