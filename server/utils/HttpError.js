// Error ที่รู้ HTTP status code — Model/Controller โยนออกมา แล้ว errorHandler จะแปลงเป็น response
export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}
