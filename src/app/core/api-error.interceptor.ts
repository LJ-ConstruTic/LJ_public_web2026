import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { ApiErrorDetail } from "./model/error-dto";

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((errorResponse: HttpErrorResponse) => {
      const apiError = parseApiError(errorResponse);
      return throwError(() => apiError);
    })
  );
};

function parseApiError(errorResponse: HttpErrorResponse): ApiErrorDetail {
  const requestId =
    errorResponse.error?.error?.requestId ??
    errorResponse.headers?.get('X-Request-Id') ??
    null;

  // El proxy o 413 pueden devolver HTML en vez de JSON
  if (typeof errorResponse.error === 'string' || !errorResponse.error?.error) {
    return {
      status: errorResponse.status,
      code: 'UNKNOWN',
      message: getDefaultMessage(errorResponse.status),
      requestId,
      details: [],
    };
  }

  const err = errorResponse.error.error;
  return {
    status: errorResponse.status,
    code: err.code ?? 'UNKNOWN',
    message: err.message ?? getDefaultMessage(errorResponse.status),
    requestId: requestId,
    details: err.details ?? [],
  };
}

function getDefaultMessage(status: number): string {
  switch (status) {
    case 400: return 'Revisa los campos del formulario.';
    case 404: return 'No se encontró el recurso solicitado.';
    case 413: return 'El contenido es demasiado grande.';
    case 422: return 'El contenido no está disponible en este idioma.';
    case 429: return 'Has alcanzado el límite temporal. Espera antes de volver a intentarlo.';
    default:  return 'No se pudo completar la solicitud.';
  }
}