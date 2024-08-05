import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import _ from "lodash";
import { Box, Stack, Typography, Button } from "@mui/material";

import { postOneResult, getResultList, postManyResult } from "../../api/result";
import { getTestDetail } from "../../api/test";
import { MBTI } from "../../const/mbti";
import { convertImageToBase64 } from "../../utils/convert";

import "./Test.scss";

const IMAGE_URL = import.meta.env.VITE_AWS_S3_BUCKET_URL;

const TestDetail = () => {
  const params = useParams();
  const testId = params?.id ? Number(params.id) : -1;
  const navigate = useNavigate();
  const [testInfo, setTestInfo] = useState({ title: "" });
  const [selectedAllFiles, setSelectedAllFiles] = useState<
    { name: string; base64: string; file: File }[]
  >([]);
  const [list, setList] = useState([
    ...MBTI.map((item) => ({
      type: item.toLowerCase(),
      filename: "",
      file: null,
    })),
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: testData } = useQuery({
    queryKey: ["get/test/detail", testId],
    queryFn: () => getTestDetail(testId),
    enabled: !!params.id,
  });

  const { isFetching, refetch, data } = useQuery({
    queryKey: ["get/test/result", params.id],
    queryFn: () => getResultList(params.id as string),
  });

  const { mutate: saveOneResult } = useMutation({
    mutationFn: postOneResult,
    onSuccess: refetch,
    onError: () => {},
  });

  const { mutate: saveManyResult } = useMutation({
    mutationFn: postManyResult,
    onSuccess: () => {
      refetch();
      setSelectedAllFiles([]);
    },
    onError: () => {},
  });

  const handleSetAllFile = async (e: any) => {
    const result: any[] = [];

    try {
      const files = e.target.files;

      for (const file of files) {
        const name = (file as File).name;
        const base64 = await convertImageToBase64(file);
        result.push({ name, file, base64 });
      }

      setSelectedAllFiles(result);
    } catch (e) {
      console.log(e);
    }
  };

  const handleEachFile = async (e: any, index: number) => {
    const result = _.cloneDeep(list);
    const file = e.target.files[0];
    result[index].filename = "";
    result[index].file = file;

    setList(result);

    try {
      setIsLoading(true);
      const base64 = await convertImageToBase64(file);

      saveOneResult({
        subject_id: params.id,
        type: result[index].type,
        base64,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAllFile = async () => {
    if (!selectedAllFiles.length) return;

    const result = [];
    for (const file of selectedAllFiles) {
      result.push({
        subject_id: params.id,
        type: file.name.split(".")[0].toLocaleLowerCase(),
        base64: file.base64,
      });
    }

    try {
      setIsLoading(true);
      saveManyResult(result);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMbtiContent = (info: any, index: number) => {
    if (!!info.filename) {
      return (
        <>
          <div className="each_input__wrapper">
            <input
              type="file"
              className="each_input"
              onChange={(e) => {
                console.log(123);
                handleEachFile(e, index);
              }}
            />
          </div>
          <img
            className="mbti_result__img"
            src={`${IMAGE_URL}${info.filename}`}
          />
        </>
      );
    }

    if (!!info.file) {
      return (
        <>
          <div className="each_input__wrapper">
            <input
              type="file"
              className="each_input"
              onChange={(e) => handleEachFile(e, index)}
            />
          </div>

          <span className="result_file_name">{info.file.name}</span>
        </>
      );
    } else {
      return (
        <>
          <div className="each_input__wrapper">
            <input
              type="file"
              className="each_input"
              onChange={(e) => handleEachFile(e, index)}
            />
          </div>
          <span className="add_icon material-symbols-outlined">add</span>
        </>
      );
    }
  };

  useEffect(() => {
    setTestInfo({ title: testData?.title as string });
  }, [testData]);

  useEffect(() => {
    function parseData() {
      const temp: any = {};
      const result = _.cloneDeep(list);

      list.forEach((item, i) => (temp[item.type] = i));

      for (const mbti of data) {
        const index = temp[mbti.mbti];
        result[index].filename = mbti.filename;
      }

      setList(result);
    }

    if (!isFetching) {
      parseData();
    }
  }, [isFetching]);

  return (
    <Box>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">{`${testInfo.title}'s Result`}</Typography>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ height: 40 }}
        >
          Back
        </Button>
      </Stack>
      <div className="all_result_input__container">
        <div className="result_input__wrapper">
          <span className="add_icon material-symbols-outlined">add</span>
          <input
            type="file"
            className="result_input"
            multiple
            onChange={handleSetAllFile}
          />
        </div>

        <div className="all_file_names_container">
          {Array.from(selectedAllFiles).map(
            (file: { name: string; base64: string; file: File }) => {
              return (
                <span key={file.name} className="file_name">
                  {file.name}
                </span>
              );
            }
          )}
        </div>
      </div>

      <Button variant="contained" onClick={saveAllFile} sx={{ mt: 1 }}>
        all save
      </Button>

      <div className="each_result_input__container">
        {list.map((item, i) => {
          return (
            <div key={item.type} className="mbti_result_item__wrapper">
              <div className="mbti_result_input__wrapper">
                {renderMbtiContent(item, i)}
              </div>
              <div>{item.type.toLocaleUpperCase()}</div>
            </div>
          );
        })}
      </div>
    </Box>
  );
};

export default TestDetail;
