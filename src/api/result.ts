import { ITest, ITestDetail } from "../pages/Test/interface";
import axiosApi from "./callApi";

export const getResultList = (subject_id: string): Promise<any> => {
  return axiosApi({
    method: "GET",
    url: `/test-result/${subject_id}`,
  });
};

export const postOneResult = (data: any): Promise<any> => {
  return axiosApi({
    method: "POST",
    url: "/test-result",
    data,
  });
};

export const postManyResult = (data: any): Promise<any> => {
  return axiosApi({
    method: "POST",
    url: "/test-result/multi",
    data,
  });
};
