import { useState, useEffect, forwardRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { cloneDeep } from "lodash";
import {
  FormControl,
  Box,
  Stack,
  Typography,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  IconButton,
  Slider,
  Button,
  Divider,
  Switch,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { IMbtiQuestion } from "./interface";
import { getTestDetail, postTest, putTest } from "../../api/test";

const style = {
  // position: "absolute" as "absolute",
  // top: "50%",
  // left: "50%",
  // transform: "translate(-50%, -50%)",
  // bgcolor: "background.paper",
  // border: "2px solid #000",
  // boxShadow: 24,
  // p: 4,
  // width: 1000,
  // height: 700,
  // overflowY: "scroll",
};

const TestDetail = () => {
  // const { mode, testId } = props;
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.pathname.includes("create") ? "create" : "edit";
  const testId = Number(params.id) ?? null;

  const [formValue, setFormValue] = useState({
    title: "",
    subtitle: "",
    description: "",
  });
  const [active, setActive] = useState(false);
  const [questions, setQuestions] = useState<IMbtiQuestion[]>([
    {
      question: "",
      type: "radio",
      EI: 0,
      SN: 0,
      TF: 0,
      JP: 0,
      answer: ["", ""],
    },
  ]);

  const { data } = useQuery({
    queryKey: ["get/test/detail", testId],
    queryFn: () => getTestDetail(testId),
    enabled: !!params.id,
  });

  const { mutate: createTest } = useMutation({
    mutationFn: postTest,
    onSuccess: () => navigate("/tests"),
    onError: () => {},
  });

  const { mutate: updateTest } = useMutation({
    mutationFn: putTest,
    onSuccess: () => navigate("/tests"),
    onError: () => {},
  });

  const onChange = (value: object, index: number) => {
    const result = cloneDeep(questions);
    result[index] = { ...result[index], ...value };

    setQuestions(result);
  };

  const onClickDelete = (index: number) => {
    const arr = cloneDeep(questions);
    const result = arr.filter((_, i) => i !== index);

    setQuestions(result);
  };

  const onClickAdd = () => {
    const result = cloneDeep(questions);
    result.push({
      question: "",
      type: "radio",
      EI: 0,
      SN: 0,
      TF: 0,
      JP: 0,
      answer: ["", ""],
    });

    setQuestions(result);
  };

  const saveTest = () => {
    const result = cloneDeep(questions);

    result.forEach((item: any, index) => {
      if (item.type === "radio") {
        item.answer = JSON.stringify(item.answer);
      } else {
        item.answer = null;
      }
      item.EI_point = item.EI;
      item.SN_point = item.SN;
      item.TF_point = item.TF;
      item.JP_point = item.JP;
      item.order_no = index;

      delete item.EI;
      delete item.SN;
      delete item.TF;
      delete item.JP;
    });

    mode === "edit"
      ? updateTest({ id: testId, ...formValue, active, questions: result })
      : createTest({ ...formValue, questions: result });
  };

  useEffect(() => {
    return () => {
      setFormValue({
        title: "",
        subtitle: "",
        description: "",
      });

      setQuestions([
        {
          question: "",
          type: "radio",
          EI: 0,
          SN: 0,
          TF: 0,
          JP: 0,
          answer: ["", ""],
        },
      ]);
    };
  }, []);

  useEffect(() => {
    if (!!data) {
      const testQuestions = data.questions.map((item) => {
        const result = {
          question: item.question,
          type: item.type,
          EI: item.EI_point,
          SN: item.SN_point,
          TF: item.TF_point,
          JP: item.JP_point,
          answer: JSON.parse(item.answer),
        };

        return result;
      });
      setFormValue({
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
      });

      setActive(data.active);
      setQuestions(testQuestions);
    }
  }, [data]);

  return (
    <Box sx={style}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">
          {mode === "edit" ? "Edit Test" : "Create Test"}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ height: 40 }}
        >
          Back
        </Button>
      </Stack>

      <Divider />

      <Stack direction="column" sx={{ p: 1, mt: 2 }}>
        <Stack direction="row" spacing={50}>
          <TextField
            variant="outlined"
            label="title"
            required
            value={formValue.title}
            onChange={(e) =>
              setFormValue({ ...formValue, title: e.target.value })
            }
            sx={{ width: 300, m: 1 }}
          />

          <Button variant="contained" onClick={saveTest} sx={{ height: 50 }}>
            Save
          </Button>
        </Stack>

        <TextField
          variant="standard"
          label="sub title"
          value={formValue.subtitle}
          onChange={(e) =>
            setFormValue({ ...formValue, subtitle: e.target.value })
          }
          sx={{ width: 300, m: 1 }}
        />
        <TextField
          variant="standard"
          label="description"
          multiline
          value={formValue.description}
          onChange={(e) =>
            setFormValue({ ...formValue, description: e.target.value })
          }
          sx={{ width: 300, m: 1 }}
          rows={4}
        />

        {mode === "edit" && (
          <Stack
            direction="row"
            spacing={5}
            alignItems={"center"}
            sx={{ mt: 2 }}
          >
            <Typography variant="subtitle2">Active</Typography>

            <Switch
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
          </Stack>
        )}

        <Box sx={{ mt: 5 }}>
          <Typography variant="subtitle1">Question</Typography>
          {questions.map((item, i) => {
            return (
              <Stack
                key={i}
                direction="row"
                spacing={2}
                sx={{ border: "1px solid white", p: 2, m: 1, borderRadius: 5 }}
              >
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  Q{i}
                </Typography>
                <Box key={i}>
                  <Stack direction="row">
                    <TextField
                      variant="standard"
                      label="question"
                      value={item.question}
                      onChange={(e) =>
                        onChange({ question: e.target.value }, i)
                      }
                      sx={{ width: 300, mr: 1 }}
                    />
                    <FormControl>
                      <InputLabel id={`type_${i}`}>Age</InputLabel>
                      <Select
                        labelId={`type_${i}`}
                        id={`type_${i}`}
                        value={item.type}
                        label="type"
                        onChange={(e) => onChange({ type: e.target.value }, i)}
                        sx={{ height: 50, mr: 1 }}
                      >
                        <MenuItem value={"radio"}>radio</MenuItem>
                        <MenuItem value={"level"}>level</MenuItem>
                      </Select>
                    </FormControl>
                    {[
                      ["I", "E"],
                      ["N", "S"],
                      ["F", "T"],
                      ["P", "J"],
                    ].map((mbti_type) => {
                      const mbtiKey = `${mbti_type[1]}${mbti_type[0]}`;

                      return (
                        <Stack
                          key={`${mbtiKey}_${i}`}
                          spacing={1}
                          direction="row"
                          sx={{ width: 80, mb: 1, mr: 1 }}
                          alignItems="center"
                        >
                          <Typography variant="body2">
                            {mbti_type[0]}
                          </Typography>
                          <Slider
                            aria-label="Volume"
                            value={(item as any)[mbtiKey]}
                            min={-10}
                            max={10}
                            step={1}
                            onChange={(e: any) =>
                              onChange(
                                { [mbtiKey]: e.target?.value as number },
                                i
                              )
                            }
                            valueLabelFormat={(value) => {
                              return value > 0 ? `${value}` : `${-1 * value}`;
                            }}
                            valueLabelDisplay="auto"
                          />
                          <Typography variant="body2">
                            {mbti_type[1]}
                          </Typography>
                        </Stack>
                      );
                    })}
                    <IconButton
                      aria-label="delete"
                      onClick={() => onClickDelete(i)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                  {item.type === "radio" && (
                    <Stack direction="column">
                      <TextField
                        variant="standard"
                        label="yes"
                        value={item.answer[0]}
                        onChange={(e) => {
                          const result = cloneDeep(questions[i].answer);
                          result[0] = e.target.value;

                          onChange({ answer: result }, i);
                        }}
                        sx={{ width: 300 }}
                      />
                      <TextField
                        variant="standard"
                        label="no"
                        value={item.answer[1]}
                        onChange={(e) => {
                          const result = cloneDeep(questions[i].answer);
                          result[1] = e.target.value;

                          onChange({ answer: result }, i);
                        }}
                        sx={{ width: 300 }}
                      />
                    </Stack>
                  )}
                </Box>
              </Stack>
            );
          })}
        </Box>
      </Stack>
      <IconButton aria-label="delete" onClick={() => onClickAdd()}>
        <AddCircleIcon />
      </IconButton>
    </Box>
  );
};

export default TestDetail;
