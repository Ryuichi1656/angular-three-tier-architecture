import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserDetailUsecase } from './user-detail.usecase';

@Component({
  selector: 'app-user-detail',
  imports: [RouterLink],
  providers: [UserDetailUsecase],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css',
})
export class UserDetailComponent implements OnInit {
  private readonly usecase = inject(UserDetailUsecase);
  private readonly route = inject(ActivatedRoute);

  readonly state = this.usecase.state;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.usecase.fetchUser(id);
  }
}
