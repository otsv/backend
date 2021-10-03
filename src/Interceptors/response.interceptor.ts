import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ResponseSerializer } from 'src/module/shared/entities/base.serializer';

export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseSerializer> {
    return next.handle().pipe(
      map((data) => {
        return new ResponseSerializer(data);
      }),
    );
  }
}
