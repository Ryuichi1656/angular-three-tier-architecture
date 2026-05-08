import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListUsersAPIService } from '../../apis/list-users-api.service';
import { User } from '../../apis/user';

export interface UserListState {
  users: User[];
  loading: boolean;
  fetchErrorMessage: string | null;
}

@Injectable()
export class UserListUsecase {
  private readonly listUsersAPIService = inject(ListUsersAPIService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly users = signal<User[]>([]);
  private readonly loading = signal<boolean>(false);
  private readonly fetchErrorMessage = signal<string | null>(null);

  readonly state = computed<UserListState>(() => ({
    users: this.users(),
    loading: this.loading(),
    fetchErrorMessage: this.fetchErrorMessage(),
  }));

  /**
   * ユーザー一覧を取得する
   */
  fetchUsers(): void {
    this.loading.set(true);
    this.fetchErrorMessage.set(null);

    this.listUsersAPIService
      .listUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => {
          this.users.set(users);
          this.loading.set(false);
        },
        error: (error: Error) => {
          this.fetchErrorMessage.set(error.message);
          this.loading.set(false);
        },
      });
  }
}
