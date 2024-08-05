import axiosApi from "./callApi";

export const getAllUsers = (): Promise<any[]> => {
  return axiosApi({
    method: "GET",
    url: "/admin",
  });
};

export const createAdmin = (data: {
  username: string;
  password: string;
}): Promise<null> => {
  return axiosApi({
    method: "POST",
    url: "/admin/signup",
    data,
  });
};

export const postLogin = (data: {
  username: string;
  password: string;
}): Promise<{ token: string }> => {
  return axiosApi({
    method: "POST",
    url: "/admin/signin",
    data,
  });
};
