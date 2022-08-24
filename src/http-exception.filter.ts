import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Dependencies,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { TokenExpiredError } from 'jsonwebtoken';
import { ExceptionResponse } from './v1/interface/exception-response.interface';

@Catch()
@Dependencies(HttpAdapterHost)
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    let responseBody: ExceptionResponse;
    if (exception instanceof TokenExpiredError) {
      responseBody = {
        statusCode: HttpStatus.UNAUTHORIZED,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
        message: exception.message,
      };
      Logger.error(
        `${request.method} ${responseBody.path} ${responseBody.statusCode} | ${responseBody.message}`,
      );
    } else if (exception instanceof HttpException) {
      responseBody = {
        statusCode: exception.getStatus(),
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
        message: exception.message,
      };
      Logger.error(
        `${request.method} ${responseBody.path} ${responseBody.statusCode} | ${responseBody.message}`,
      );
    } else {
      responseBody = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      };
      Logger.error(
        `${request.method} ${responseBody.path} ${responseBody.statusCode} `,
      );
    }
    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }
}
