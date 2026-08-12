export const errorHandler = (error, req, res, next) => {
    // console.log(error);

    console.log("Error name:", error.name);
    console.log("Error message:", error.message);

    let statusCode = error.statusCode || 500;

    let message = error.message || "Internal server error";

    if(error.name === "CastError"){
        statusCode = 400;
        message = "Invalid ID format"
    }

    if(error.code === 11000){
        statusCode = 409;
        message = "Resource already exists"
    }

    res.status(statusCode).json({
        message
    });
}