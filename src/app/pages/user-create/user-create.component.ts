import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserCreateUsecase } from './user-create.usecase';

export interface UserFormGroup {
  name: FormControl<string>;
  email: FormControl<string>;
  phoneNumber: FormControl<string>;
  address: FormControl<string>;
}

@Component({
  selector: 'app-user-create',
  imports: [ReactiveFormsModule, RouterLink],
  providers: [UserCreateUsecase],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css',
})
export class UserCreateComponent {
  private readonly usecase = inject(UserCreateUsecase);
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

  submit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.getRawValue();
    this.usecase
      .createUser({
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
}
