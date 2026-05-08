export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
}

const users = new Map<number, User>([
  [
    1,
    {
      id: 1,
      name: '山田 太郎',
      email: 'taro.yamada@example.com',
      phone_number: '090-0000-0001',
      address: '東京都新宿区西新宿 1-1-1',
    },
  ],
  [
    2,
    {
      id: 2,
      name: '鈴木 花子',
      email: 'hanako.suzuki@example.com',
      phone_number: '090-0000-0002',
      address: '大阪府大阪市北区梅田 2-2-2',
    },
  ],
  [
    3,
    {
      id: 3,
      name: '佐藤 一郎',
      email: 'ichiro.sato@example.com',
      phone_number: '090-0000-0003',
      address: '愛知県名古屋市中村区名駅 3-3-3',
    },
  ],
]);

export function findUserById(id: number): User | null {
  return users.get(id) ?? null;
}

export function updateUser(user: User): User | null {
  if (!users.has(user.id)) return null;
  users.set(user.id, user);
  return user;
}

export function listUsers(): User[] {
  return Array.from(users.values());
}

export function createUser(params: Omit<User, 'id'>): User {
  const nextId = Math.max(0, ...users.keys()) + 1;
  const user: User = { id: nextId, ...params };
  users.set(nextId, user);
  return user;
}
