import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, tap } from 'rxjs';
import {
  CreateUserAPIService,
  CreateUserParams,
  CreateUserResponse,
} from '../../apis/create-user-api.service';

export interface UserCreateState {
  loading: boolean;
  createErrorMessage: string | null;
}

@Injectable()
export class UserCreateUsecase {
  private readonly createUserAPIService = inject(CreateUserAPIService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly loading = signal<boolean>(false);
  private readonly createErrorMessage = signal<string | null>(null);

  readonly state = computed<UserCreateState>(() => ({
    loading: this.loading(),
    createErrorMessage: this.createErrorMessage(),
  }));

  /**
   * ユーザーを作成する
   * - 内部状態の更新は tap で行う
   * - Component 側で作成完了時のナビゲーションを行えるよう Observable を返す
   */
  createUser(params: CreateUserParams): Observable<CreateUserResponse> {
    this.loading.set(true);
    this.createErrorMessage.set(null);

    return this.createUserAPIService.createUser(params).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap({
        next: () => {
          this.loading.set(false);
        },
        error: (error: Error) => {
          this.createErrorMessage.set(error.message);
          this.loading.set(false);
        },
      }),
    );
  }
}
