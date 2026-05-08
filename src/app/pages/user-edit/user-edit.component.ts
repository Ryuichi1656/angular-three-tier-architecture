import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../apis/user';
import { UserEditUsecase } from './user-edit.usecase';

export interface UserFormGroup {
  name: FormControl<string>;
  email: FormControl<string>;
  phoneNumber: FormControl<string>;
  address: FormControl<string>;
}

@Component({
  selector: 'app-user-edit',
  imports: [ReactiveFormsModule, RouterLink],
  providers: [UserEditUsecase],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
})
export class UserEditComponent implements OnInit {
  private readonly usecase = inject(UserEditUsecase);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly state = this.usecase.state;

  readonly userForm = new FormGroup<UserFormGroup>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    address: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  private userId = 0;

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.usecase.fetchUser(this.userId).subscribe({
      next: (user) => this.applyUserToForm(user),
    });
  }

  submit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.getRawValue();
    this.usecase
      .updateUser({
        id: this.userId,
        name: formValue.name,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        address: formValue.address,
      })
      .subscribe({
        next: ({ id }) => {
          void this.router.navigate(['/users', id]);
        },
      });
  }

  private applyUserToForm(user: User): void {
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
    });
  }
}
