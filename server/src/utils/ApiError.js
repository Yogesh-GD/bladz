class ApiError extends Error{
    constructor(
        statuscode,
        message = "something went wrong",
        errors = [],
        stack = ""
    ){
        super()
        this.statusCode = statuscode,
        this.message = message,
        this.errors = errors,
        this.data = null,
        this.success = false
    }
}


export default ApiError