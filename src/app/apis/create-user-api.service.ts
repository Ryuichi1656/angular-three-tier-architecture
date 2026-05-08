import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

export interface CreateUserParams {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
  phone_number: string;
  address: string;
}

export interface CreateUserResponse {
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class CreateUserAPIService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:63000/api/create_user/';

  /**
   * ユーザー作成 API
   * @param params 作成するユーザー情報
   * @returns Observable<CreateUserResponse>
   */
  createUser(params: CreateUserParams): Observable<CreateUserResponse> {
    const requestData = this.mapToApiRequestFormat(params);
    return this.http
      .post<CreateUserResponse>(this.apiUrl, requestData)
      .pipe(catchError(this.handleError));
  }

  private mapToApiRequestFormat(params: CreateUserParams): CreateUserRequest {
    return {
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
