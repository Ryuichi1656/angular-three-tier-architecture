import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

export interface UpdateUserParams {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}

interface UpdateUserRequest {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
}

export interface UpdateUserResponse {
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateUserAPIService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:63000/api/update_user/';

  /**
   * ユーザー更新 API
   * @param params 更新するユーザー情報
   * @returns Observable<UpdateUserResponse>
   */
  updateUser(params: UpdateUserParams): Observable<UpdateUserResponse> {
    const requestData = this.mapToApiRequestFormat(params);
    return this.http
      .put<UpdateUserResponse>(this.apiUrl, requestData)
      .pipe(catchError(this.handleError));
  }

  private mapToApiRequestFormat(params: UpdateUserParams): UpdateUserRequest {
    return {
      id: params.id,
      name: params.name,
      email: params.email,
      phone_number: params.phoneNumber,
      address: params.address,
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage =
      error.status === 0
        ? `Client Error: ${error.error.message}`
        : `Server Error: ${error.status} - ${error.statusText}${
            error.error?.message ? ` - ${error.error.message}` : ''
          }`;
    return throwError(() => new Error(errorMessage));
  }
}
