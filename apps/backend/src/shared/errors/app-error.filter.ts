import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

import {
  AppError,
  ExternalProviderError,
  NotFoundError,
  ProviderNotConfiguredError,
} from './app-error';

const STATUS_BY_ERROR = new Map<Function, number>([
  [NotFoundError, HttpStatus.NOT_FOUND],
  [ProviderNotConfiguredError, HttpStatus.SERVICE_UNAVAILABLE],
  [ExternalProviderError, HttpStatus.BAD_GATEWAY],
]);

interface JsonResponse {
  status(code: number): { json(body: unknown): void };
}

/** Translates domain errors into HTTP responses at the edge of the app. */
@Catch(AppError)
export class AppErrorFilter implements ExceptionFilter {
  catch(exception: AppError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<JsonResponse>();
    const status =
      STATUS_BY_ERROR.get(exception.constructor) ?? HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      code: exception.code,
      message: exception.message,
    });
  }
}
