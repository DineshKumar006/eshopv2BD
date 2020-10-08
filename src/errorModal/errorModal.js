

class HttpError extends Error {
    constructor(message,errorcode){
        super(message)
        this.message=message,
        this.errorcode=errorcode
    }
} 

module.exports=HttpError