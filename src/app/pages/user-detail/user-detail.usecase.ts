import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FetchUserAPIService } from '../../apis/fetch-user-api.service';
import { User } from '../../apis/user';

export interface UserDetailState {
  user: User | null;
  loading: boolean;
  fetchErrorMessage: string | null;
}

@Injectable()
export class UserDetailUsecase {
  private readonly fetchUserAPIService = inject(FetchUserAPIService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly user = signal<User | null>(null);
  private readonly loading = signal<boolean>(false);
  private readonly fetchErrorMessage = signal<string | null>(null);

  readonly state = computed<UserDetailState>(() => ({
    user: this.user(),
    loading: this.loading(),
    fetchErrorMessage: this.fetchErrorMessage(),
  }));

  /**
   * 指定 ID のユーザーを取得する
   * @param id 取得するユーザーの ID
   */
  fetchUser(id: number): void {
    this.loading.set(true);
    this.fetchErrorMessage.set(null);
    this.user.set(null);

    this.fetchUserAPIService
      .fetchUser({ id })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.user.set(user);
          this.loading.set(false);
        },
        error: (error: Error) => {
          this.fetchErrorMessage.set(error.message);
          this.loading.set(false);
        },
      });
  }
}
