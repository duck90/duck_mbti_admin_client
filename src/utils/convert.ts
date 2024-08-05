export const convertImageToBase64 = (file: File) => {
  return new Promise((resolve) => {
    let baseURL = null;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      baseURL = reader.result;
      resolve(baseURL);
    };
  });
};
