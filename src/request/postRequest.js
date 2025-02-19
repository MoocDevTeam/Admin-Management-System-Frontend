import request from "./index";

const postRequest = async (url, param, setLoading) => {
  if (setLoading) {
    setLoading(true);
  }
  try {
    let result = await request.post(url, param);
    return result; // = result.data in instance 
  } catch (error) {
    return { isSuccess: false,status: 400,message: error.message, data: {} };
  } finally {
    if (setLoading) setLoading(false); // Request finished
  }
};

export default postRequest;
