import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, NgControlStatus } from '@angular/forms';
import { RegisterService } from './services/register.service';
import { Register } from './models/register.model';
import { ModalService } from 'src/app/services/modal.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],

})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  formInvalid: boolean = false;
  register: Register;
  emailPattern = "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}";

  closeListOpenSingle(closeList: Array<string>, open: string) {
    this.modalService.closeListOpenSingle(closeList, open);
  }

  constructor(private _formBuilder: FormBuilder,
    private _registrerService: RegisterService,
    private modalService: ModalService) { }
    
  ngOnInit() {

    this.registerForm = this._formBuilder.group({
      business_name: ['', [Validators.required, Validators.maxLength(50)]],
      rut: ['', [Validators.required, rutNotValid]],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      phone: ['', [Validators.required, Validators.maxLength(10)]],
      position: ['', [Validators.required, Validators.maxLength(50)]],

    });

  }



  get f() { return this.registerForm.controls; }


  btnSendData() {

    if (this.registerForm.invalid) {

      this.formInvalid = true;

      console.log('invalid', this.registerForm)
    }

    else {
      this.formInvalid = false;

      console.log('valid', this.registerForm)


      const data = this.registerForm.getRawValue();

      this.register = data;
    

      this._registrerService.addRegister(data)
        .then((res) => {
          console.log(res);

          this.closeListOpenSingle([''], 'enterprises__register__modal')
        })
        .catch((err) => {
          console.log(err);
        })

    }

  }

  getMesaggeErrorBussinesName() {

    return this.f.business_name.getError('required') ? 'Este campo es requerido' : '';
  }

  getMesaggeErrorRut() {

    return this.f.rut.getError('required') ? 'Este campo es requerido' : this.f.rut.getError('rutInvalid') ? 'Rut empresa invalido' : '';
  }


  getMesaggeErrorName() {
    return this.f.name.getError('required') ? 'Este campo es requerido' : '';
  }

  getMesaggeErrorLastName() {

    return this.f.last_name.getError('required') ? 'Este campo es requerido' : '';
  }

  getMesaggeErrorEmail() {
    return this.f.email.getError('required') ? 'Este campo es requerido' : this.f.email.getError('pattern') ? 'Correo electrónico invalido' : '';

  }

  getMesaggeErrorPhone() {
    return this.f.phone.getError(
      'required') ? 'Este campo es requerido' : '';
  }

  getMesaggeErrorPosition() {
    return this.f.position.getError('required') ? 'Este campo es requerido' : '';
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  statusValidRut(){

    return (this.f.rut.hasError('required') || this.f.rut.hasError('rutInvalid'))  && this.formInvalid ? 'invalid' : ( !this.f.rut.hasError('required') || !this.f.rut.hasError('rutInvalid') ) && this.formInvalid? 'valid': '' 
   }

}

export const rutNotValid: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const rut = control.parent.get("rut");
  let valor = rut.value.replace(/\./g, "");
  let valorDespejado = valor.replace("-", "");
  let cuerpo = valorDespejado.slice(0, -1);
  let dv = valorDespejado.slice(-1).toUpperCase();
  let rutEmpresa = valorDespejado.slice(0, 2);
  console.log(`Rut empresa: ${rutEmpresa}`);

  if (cuerpo.length < 7) {
    return { rutInvalid: true }
  } else if (rutEmpresa < 50) {
    return { rutInvalid: true }
  }
  let suma = 0;
  let multiplo = 2;
  for (let i = 1; i <= cuerpo.length; i++) {
    let index = multiplo * valor.charAt(cuerpo.length - i);
    suma = suma + index;
    if (multiplo < 7) {
      multiplo = multiplo + 1;
    } else {
      multiplo = 2;
    }
  }

  let dvEsperado = 11 - (suma % 11);
  dv = dv == "K" ? 10 : dv;
  dv = dv == 0 ? 11 : dv;
  if (dvEsperado != dv) {
    return { rutInvalid: true }
  }
  
  return null;
};
