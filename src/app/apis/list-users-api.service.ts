import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User } from './user';

interface ListUsersResponseItem {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
}

@Injectable({
  providedIn: 'root',
})
export class ListUsersAPIService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:63000/api/list_users/';

  /**
   * ユーザー一覧取得 API
   * @returns Observable<User[]>
   */
  listUsers(): Observable<User[]> {
    return this.http.get<ListUsersResponseItem[]>(this.apiUrl).pipe(
      catchError(this.handleError),
      map((apiResponse) => apiResponse.map((item) => this.mapToFrontendFormat(item))),
    );
  }

  private mapToFrontendFormat(apiResponse: ListUsersResponseItem): User {
    return {
      id: apiResponse.id,
      name: apiResponse.name,
      email: apiResponse.email,
      phoneNumber: apiResponse.phone_number,
      address: apiResponse.address,
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
