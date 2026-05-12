import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { FetchUserAPIService } from '../../apis/fetch-user-api.service';
import {
  UpdateUserAPIService,
  UpdateUserParams,
  UpdateUserResponse,
} from '../../apis/update-user-api.service';
import { User } from '../../apis/user';
import { UserEditUsecase } from './user-edit.usecase';

describe('UserEditUsecase', () => {
  const dummyUser: User = {
    id: 1,
    name: '山田 太郎',
    email: 'taro@example.com',
    phoneNumber: '090-0000-0001',
    address: '東京都',
  };

  const updateParams: UpdateUserParams = {
    id: 1,
    name: '山田 太郎（更新）',
    email: 'taro2@example.com',
    phoneNumber: '090-1111-2222',
    address: '神奈川県',
  };

  function setup({
    fetchUser$,
    updateUser$,
  }: {
    fetchUser$?: Observable<User>;
    updateUser$?: Observable<UpdateUserResponse>;
  }) {
    const fetchUserAPIServiceStub = {
      fetchUser: vi.fn(() => fetchUser$ ?? of(dummyUser)),
    };
    const updateUserAPIServiceStub = {
      updateUser: vi.fn(() => updateUser$ ?? of({ id: 1 })),
    };

    TestBed.configureTestingModule({
      providers: [
        UserEditUsecase,
        { provide: FetchUserAPIService, useValue: fetchUserAPIServiceStub },
        { provide: UpdateUserAPIService, useValue: updateUserAPIServiceStub },
      ],
    });

    return {
      usecase: TestBed.inject(UserEditUsecase),
      fetchUserAPIServiceStub,
      updateUserAPIServiceStub,
    };
  }

  it('初期状態は user=null・loading=false・各エラー=null・canSubmit=false', () => {
    const { usecase } = setup({});

    expect(usecase.state()).toEqual({
      user: null,
      loading: false,
      fetchErrorMessage: null,
      updateErrorMessage: null,
      canSubmit: false,
      errorMessage: null,
    });
  });

  it('fetchUser 成功時は user が更新され、戻り値の Observable で User を受け取れる', () => {
    const { usecase, fetchUserAPIServiceStub } = setup({ fetchUser$: of(dummyUser) });

    let receivedUser: User | undefined;
    usecase.fetchUser(1).subscribe({
      next: (user) => {
        receivedUser = user;
      },
    });

    expect(fetchUserAPIServiceStub.fetchUser).toHaveBeenCalledWith({ id: 1 });
    expect(receivedUser).toEqual(dummyUser);
    expect(usecase.state().user).toEqual(dummyUser);
    expect(usecase.state().loading).toBe(false);
    expect(usecase.state().fetchErrorMessage).toBeNull();
    // 派生状態：user が取得できかつ loading=false なので canSubmit=true
    expect(usecase.state().canSubmit).toBe(true);
    expect(usecase.state().errorMessage).toBeNull();
  });

  it('fetchUser 失敗時は fetchErrorMessage が設定され、Observable は error を流す', () => {
    const { usecase } = setup({
      fetchUser$: throwError(() => new Error('Server Error: 404')),
    });

    let receivedError: Error | undefined;
    usecase.fetchUser(999).subscribe({
      error: (err: Error) => {
        receivedError = err;
      },
    });

    expect(receivedError?.message).toBe('Server Error: 404');
    expect(usecase.state().user).toBeNull();
    expect(usecase.state().fetchErrorMessage).toBe('Server Error: 404');
    // 派生状態：fetchErrorMessage が errorMessage にフォールスルー
    expect(usecase.state().errorMessage).toBe('Server Error: 404');
    expect(usecase.state().canSubmit).toBe(false);
  });

  it('updateUser 成功時は loading=false に戻り、戻り値の Observable で id を受け取れる', () => {
    const { usecase, updateUserAPIServiceStub } = setup({
      updateUser$: of({ id: 1 }),
    });

    let receivedId: number | undefined;
    usecase.updateUser(updateParams).subscribe({
      next: (res) => {
        receivedId = res.id;
      },
    });

    expect(updateUserAPIServiceStub.updateUser).toHaveBeenCalledWith(updateParams);
    expect(receivedId).toBe(1);
    expect(usecase.state().loading).toBe(false);
    expect(usecase.state().updateErrorMessage).toBeNull();
  });

  it('updateUser 失敗時は updateErrorMessage が設定される', () => {
    const { usecase } = setup({
      updateUser$: throwError(() => new Error('Server Error: 500')),
    });

    let receivedError: Error | undefined;
    usecase.updateUser(updateParams).subscribe({
      error: (err: Error) => {
        receivedError = err;
      },
    });

    expect(receivedError?.message).toBe('Server Error: 500');
    expect(usecase.state().loading).toBe(false);
    expect(usecase.state().updateErrorMessage).toBe('Server Error: 500');
    // 派生状態：fetchErrorMessage が null なら updateErrorMessage が errorMessage になる
    expect(usecase.state().errorMessage).toBe('Server Error: 500');
  });
});
