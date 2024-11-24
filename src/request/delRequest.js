import request from "./index";

const deleteRequest = async (url, param, setLoading) => {
  if (setLoading) {
    setLoading(true);
  }
  try {
    if(param){
        let result = await request.delete(url, param);
        return result;
    }else{
        let result = await request.delete(url);
        return result; 
    }
   
  } catch (error) {
    return { status: 400, message: error.message, data: {} };
  } finally {
    if (setLoading) setLoading(false); // Request finished
  }
};

export default deleteRequest;
