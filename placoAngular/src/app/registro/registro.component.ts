import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { matchPasswordValidator } from '../validators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})

export class RegistroComponent {
  fb = inject(FormBuilder);
  // http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);

  form = this.fb.nonNullable.group({
    usuario: ['', Validators.required],
    correo: ['', Validators.required],
    contra: ['', Validators.required],
    contra2: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.pattern('^\\+?[1-9]\\d{1,14}$')]],
  }, { validators: matchPasswordValidator() });

  onSubmit(): void {
  // Verificamos si el formulario es válido antes de hacer nada
  if (this.form.invalid) {
    this.form.markAllAsTouched(); // Marca todos los campos para mostrar errores si es necesario
    return;
  }

  const rawForm = this.form.getRawValue();
  
  // Usamos el servicio de autenticación
  this.authService.registrar(rawForm.correo, rawForm.usuario, rawForm.contra, rawForm.telefono).subscribe({
    next: () => {
      // Éxito: El usuario se registró correctamente
      Swal.fire({
        title: 'Usuario registrado',
        text: 'El registro fue exitoso.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigateByUrl('/login');
      });
    },
    error: (err) => {
      // Error: Inspeccionamos el código de error para dar una respuesta útil
      console.error('Error de Firebase:', err); // Mantenemos el error en consola para depuración
      
      let errorMessage = 'Ocurrió un error inesperado. Intenta de nuevo.'; // Mensaje por defecto

      // Usamos un switch para manejar los errores más comunes
      switch (err.code) {
        case 'auth/weak-password':
          errorMessage = 'La contraseña es muy débil. Debe tener al menos 6 caracteres.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Este correo electrónico ya está registrado. Por favor, utiliza otro.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El formato del correo electrónico no es válido.';
          break;
      }
      
      // Mostramos la alerta de SweetAlert con el mensaje correcto
      Swal.fire({
        title: 'Error en el registro',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  });
}
}