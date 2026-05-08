import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import {
  CreateUserAPIService,
  CreateUserParams,
  CreateUserResponse,
} from '../../apis/create-user-api.service';
import { UserCreateUsecase } from './user-create.usecase';

describe('UserCreateUsecase', () => {
  const params: CreateUserParams = {
    name: '山田 太郎',
    email: 'taro@example.com',
    phoneNumber: '090-0000-0001',
    address: '東京都',
  };

  function setup(createUser$: Observable<CreateUserResponse>) {
    const apiServiceStub = {
      createUser: vi.fn(() => createUser$),
    };

    TestBed.configureTestingModule({
      providers: [
        UserCreateUsecase,
        { provide: CreateUserAPIService, useValue: apiServiceStub },
      ],
    });

    return {
      usecase: TestBed.inject(UserCreateUsecase),
      apiServiceStub,
    };
  }

  it('初期状態は loading=false・createErrorMessage=null', () => {
    const { usecase } = setup(of({ id: 1 }));

    expect(usecase.state()).toEqual({
      loading: false,
      createErrorMessage: null,
    });
  });

  it('createUser 成功時は loading=false に戻り、戻り値の Observable で id を受け取れる', () => {
    const { usecase, apiServiceStub } = setup(of({ id: 42 }));

    let receivedId: number | undefined;
    usecase.createUser(params).subscribe({
      next: (res) => {
        receivedId = res.id;
      },
    });

    expect(apiServiceStub.createUser).toHaveBeenCalledWith(params);
    expect(receivedId).toBe(42);
    expect(usecase.state()).toEqual({
      loading: false,
      createErrorMessage: null,
    });
  });

  it('createUser 失敗時は createErrorMessage が設定され、Observable は error を流す', () => {
    const { usecase } = setup(throwError(() => new Error('Server Error: 500')));

    let receivedError: Error | undefined;
    usecase.createUser(params).subscribe({
      error: (err: Error) => {
        receivedError = err;
      },
    });

    expect(receivedError?.message).toBe('Server Error: 500');
    expect(usecase.state()).toEqual({
      loading: false,
      createErrorMessage: 'Server Error: 500',
    });
  });
});
