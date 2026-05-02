class ApiResponse <T = unknown>{
    public status: number
    public data: T
    public msg: string
    public success: boolean

    constructor (status: number, data: T, msg = "success", success: number= 200) {
        this.status = status
        this.data = data
        this.msg = msg
        this.success = success < 400
    }
}

export default ApiResponse