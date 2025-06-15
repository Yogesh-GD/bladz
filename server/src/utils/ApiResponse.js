class ApiResponse{
    constructor( 
        statuscode = 200,
        data = {},
        message = "success"){
       this.statuscode = statuscode,
       this.data = data,
       this.message = message || "success",
       this.success = statuscode < 400
    }
}


export default ApiResponse