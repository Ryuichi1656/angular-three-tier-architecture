import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { FetchUserAPIService } from '../../apis/fetch-user-api.service';
import { User } from '../../apis/user';
import { UserDetailUsecase } from './user-detail.usecase';

describe('UserDetailUsecase', () => {
  const dummyUser: User = {
    id: 1,
    name: '山田 太郎',
    email: 'taro@example.com',
    phoneNumber: '090-0000-0001',
    address: '東京都',
  };

  function setup(fetchUser$: Observable<User>) {
    const apiServiceStub = {
      fetchUser: vi.fn(() => fetchUser$),
    };

    TestBed.configureTestingModule({
      providers: [
        UserDetailUsecase,
        { provide: FetchUserAPIService, useValue: apiServiceStub },
      ],
    });

    return {
      usecase: TestBed.inject(UserDetailUsecase),
      apiServiceStub,
    };
  }

  it('初期状態は user=null・loading=false・fetchErrorMessage=null', () => {
    const { usecase } = setup(of(dummyUser));

    expect(usecase.state()).toEqual({
      user: null,
      loading: false,
      fetchErrorMessage: null,
    });
  });

  it('fetchUser 成功時は user と loading が更新される', () => {
    const { usecase, apiServiceStub } = setup(of(dummyUser));

    usecase.fetchUser(1);

    expect(apiServiceStub.fetchUser).toHaveBeenCalledWith({ id: 1 });
    expect(usecase.state()).toEqual({
      user: dummyUser,
      loading: false,
      fetchErrorMessage: null,
    });
  });

  it('fetchUser 失敗時は fetchErrorMessage が設定され user=null のまま', () => {
    const { usecase } = setup(throwError(() => new Error('Server Error: 404')));

    usecase.fetchUser(999);

    expect(usecase.state()).toEqual({
      user: null,
      loading: false,
      fetchErrorMessage: 'Server Error: 404',
    });
  });
});
