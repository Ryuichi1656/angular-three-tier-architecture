import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { ListUsersAPIService } from '../../apis/list-users-api.service';
import { User } from '../../apis/user';
import { UserListUsecase } from './user-list.usecase';

describe('UserListUsecase', () => {
  const dummyUsers: User[] = [
    {
      id: 1,
      name: '山田 太郎',
      email: 'taro@example.com',
      phoneNumber: '090-0000-0001',
      address: '東京都',
    },
    {
      id: 2,
      name: '鈴木 花子',
      email: 'hanako@example.com',
      phoneNumber: '090-0000-0002',
      address: '大阪府',
    },
  ];

  function setup(listUsers$: Observable<User[]>) {
    const apiServiceStub = {
      listUsers: vi.fn(() => listUsers$),
    };

    TestBed.configureTestingModule({
      providers: [
        UserListUsecase,
        { provide: ListUsersAPIService, useValue: apiServiceStub },
      ],
    });

    return {
      usecase: TestBed.inject(UserListUsecase),
      apiServiceStub,
    };
  }

  it('初期状態は users 空配列・loading=false・fetchErrorMessage=null', () => {
    const { usecase } = setup(of([]));

    expect(usecase.state()).toEqual({
      users: [],
      loading: false,
      fetchErrorMessage: null,
    });
  });

  it('fetchUsers 成功時は users と loading が更新される', () => {
    const { usecase, apiServiceStub } = setup(of(dummyUsers));

    usecase.fetchUsers();

    expect(apiServiceStub.listUsers).toHaveBeenCalledTimes(1);
    expect(usecase.state()).toEqual({
      users: dummyUsers,
      loading: false,
      fetchErrorMessage: null,
    });
  });

  it('fetchUsers 失敗時は fetchErrorMessage が設定され loading=false になる', () => {
    const { usecase } = setup(throwError(() => new Error('Server Error: 500')));

    usecase.fetchUsers();

    expect(usecase.state()).toEqual({
      users: [],
      loading: false,
      fetchErrorMessage: 'Server Error: 500',
    });
  });
});
