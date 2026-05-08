import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserListUsecase } from './user-list.usecase';

@Component({
  selector: 'app-user-list',
  imports: [RouterLink],
  providers: [UserListUsecase],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  private readonly usecase = inject(UserListUsecase);

  readonly state = this.usecase.state;

  ngOnInit(): void {
    this.usecase.fetchUsers();
  }
}
