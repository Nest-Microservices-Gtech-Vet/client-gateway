import { Catch, ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class rcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rcpError = exception.getError();

    if (typeof rcpError === 'object' && 'status' in rcpError && 'message' in rcpError) {
      const status = typeof rcpError.status === 'number' ? rcpError.status : HttpStatus.INTERNAL_SERVER_ERROR;

      return response.status(status).json({
        status,
        message: rcpError.message
      });
    }

    response.status(HttpStatus.BAD_REQUEST).json({
      status: HttpStatus.BAD_REQUEST,
      message: typeof rcpError === 'string' ? rcpError : 'Unexpected error'
    });
  }
}
