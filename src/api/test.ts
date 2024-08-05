import { ITest, ITestDetail } from "../pages/Test/interface";
import axiosApi from "./callApi";

export const getTestList = (): Promise<ITest[]> => {
  return axiosApi({
    method: "GET",
    url: "/test",
  });
};

export const getTestDetail = (testId: number): Promise<ITestDetail> => {
  return axiosApi({
    method: "GET",
    url: `/test/${testId}`,
  });
};

export const postTest = (data: any): Promise<ITest> => {
  return axiosApi({
    method: "POST",
    url: "/test",
    data,
  });
};

export const putTest = (data: any): Promise<ITest> => {
  const url = `/test/${data.id}`;

  delete data.id;

  return axiosApi({
    method: "PUT",
    url,
    data,
  });
};

export const updateActive = ({
  id,
  checked,
}: {
  id: number;
  checked: boolean;
}): Promise<undefined> => {
  return axiosApi({
    method: "PATCH",
    url: `/test/${id}`,
    data: { active: checked },
  });
};

export const updateOrder = (
  data: { id: number; order_no: number }[]
): Promise<undefined> => {
  return axiosApi({
    method: "POST",
    url: "/test/order",
    data,
  });
};
