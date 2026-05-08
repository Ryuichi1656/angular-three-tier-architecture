export interface Profile {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
}

const profiles = new Map<number, Profile>([
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

export function findProfileById(id: number): Profile | null {
  return profiles.get(id) ?? null;
}

export function updateProfile(profile: Profile): Profile | null {
  if (!profiles.has(profile.id)) return null;
  profiles.set(profile.id, profile);
  return profile;
}
