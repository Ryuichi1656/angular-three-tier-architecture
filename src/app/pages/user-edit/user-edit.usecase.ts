import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, tap } from 'rxjs';
import { FetchUserAPIService } from '../../apis/fetch-user-api.service';
import {
  UpdateUserAPIService,
  UpdateUserParams,
  UpdateUserResponse,
} from '../../apis/update-user-api.service';
import { User } from '../../apis/user';

export interface UserEditState {
  user: User | null;
  loading: boolean;
  fetchErrorMessage: string | null;
  updateErrorMessage: string | null;
  canSubmit: boolean;
  errorMessage: string | null;
}

@Injectable()
export class UserEditUsecase {
  private readonly fetchUserAPIService = inject(FetchUserAPIService);
  private readonly updateUserAPIService = inject(UpdateUserAPIService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly user = signal<User | null>(null);
  private readonly loading = signal<boolean>(false);
  private readonly fetchErrorMessage = signal<string | null>(null);
  private readonly updateErrorMessage = signal<string | null>(null);

  // 派生状態は signal を増やすのではなく computed で導出する
  private readonly canSubmit = computed<boolean>(
    () => !this.loading() && this.user() !== null,
  );
  private readonly errorMessage = computed<string | null>(
    () => this.fetchErrorMessage() ?? this.updateErrorMessage(),
  );

  readonly state = computed<UserEditState>(() => ({
    user: this.user(),
    loading: this.loading(),
    fetchErrorMessage: this.fetchErrorMessage(),
    updateErrorMessage: this.updateErrorMessage(),
    canSubmit: this.canSubmit(),
    errorMessage: this.errorMessage(),
  }));

  /**
   * 指定 ID のユーザーを取得する
   * - 内部状態の更新は tap で行う
   * - Component 側でフォーム初期化を行えるよう Observable を返す
   */
  fetchUser(id: number): Observable<User> {
    this.loading.set(true);
    this.fetchErrorMessage.set(null);
    this.user.set(null);

    return this.fetchUserAPIService.fetchUser({ id }).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap({
        next: (user) => {
          this.user.set(user);
          this.loading.set(false);
        },
        error: (error: Error) => {
          this.fetchErrorMessage.set(error.message);
          this.loading.set(false);
        },
      }),
    );
  }

  /**
   * ユーザーを更新する
   * - 内部状態の更新は tap で行う
   * - Component 側で更新完了時のナビゲーションを行えるよう Observable を返す
   */
  updateUser(params: UpdateUserParams): Observable<UpdateUserResponse> {
    this.loading.set(true);
    this.updateErrorMessage.set(null);

    return this.updateUserAPIService.updateUser(params).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap({
        next: () => {
          this.user.update((current) => (current ? { ...current, ...params } : current));
          this.loading.set(false);
        },
        error: (error: Error) => {
          this.updateErrorMessage.set(error.message);
          this.loading.set(false);
        },
      }),
    );
  }
}
