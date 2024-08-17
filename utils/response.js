var response = {
    message:'',
    success:true,
    status:200,
    data:{}
}

const getSuccessResponse = (message,data) =>{
    response.data = data;
    response.message = message;
    response.success = true;
    response.status  = 200;
    return response;
}

const getFailResponse = (message,data,status) =>{
    response.data = data;
    response.message = message;
    response.success = false;
    response.status  = status || 400;
    return response;
}

module.exports = {getSuccessResponse,getFailResponse};