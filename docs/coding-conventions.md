# コーディング規約

本リポジトリで採用するコーディング規約を定めます。

## Signal / Observable の命名規則

Angular で扱う reactive な値の命名は、以下のルールに統一します。

1. **Observable は `$` サフィックスを付ける**（例: `users$`, `state$`）
2. **Signal はサフィックスを付けない**（例: `count`, `user`）。テンプレート・コードともに呼び出し構文 `value()` が型の手がかりとなるため。
3. **private な `Subject` を public な `Observable` として公開する場合は、内部 Subject の先頭にアンダースコア `_` を付けて区別する**（例: `private _users$` / `readonly users$`）
4. **signal と observable が混在するクラスでは、片方の命名規則を破らないように一貫性を最優先する**

### コード例

```ts
import { Component, computed, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({ /* ... */ })
export class UserListComponent {
  private readonly http = inject(HttpClient);

  // Signal: サフィックスなし
  readonly selectedId = signal<string | null>(null);
  readonly isSelected = computed(() => this.selectedId() !== null);

  // Observable: `$` サフィックス
  readonly users$: Observable<User[]> = this.http.get<User[]>('/api/users');

  // private Subject + public Observable のペア
  private readonly _filter$ = new BehaviorSubject<string>('');
  readonly filter$ = this._filter$.asObservable();
}
```

### 背景

選定の根拠や他の慣習との比較は [tmp/angular-naming-conventions.md](../tmp/angular-naming-conventions.md) を参照してください。
