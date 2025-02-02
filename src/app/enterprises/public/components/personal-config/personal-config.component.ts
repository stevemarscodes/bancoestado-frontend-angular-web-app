import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/authentication/auth.service';
import { ModalService } from '../../../../services/modal.service';
import { PersonalConfigService } from './personal-config.service';
import { PersonalService } from './services/personal.service';
import { UsersService } from 'src/app/services/users/users.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal-config',
  templateUrl: './personal-config.component.html',
  styleUrls: ['./personal-config.component.scss']
})
export class PersonalConfigComponent implements OnInit {

  protected userTypes: Array<any> = [];
  protected newUserRegistered: boolean = false;
  protected updateUser: boolean = false;
  protected modalName: string = 'personal-config__modal';
  protected selectedMenuItem: string = 'mi-perfil';
  protected assignContact: boolean = false;
  protected tipoContacto: string = 'null'

  newUserForm: FormGroup;
  emailPattern = "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}";
  get f() { return this.newUserForm.controls; }
  formInvalid: boolean = false;
  public validaEmail: string;

  constructor(
    private _authService: AuthService, 
    public _personServices: PersonalService, 
    private modalService: ModalService, 
    private router: Router, 
    protected personalConfigService: PersonalConfigService,
    private usersService: UsersService,
    private _formBuilder: FormBuilder) {
    
    this.userTypes = [
      {
        name:'Administrador',
        value:'admin'
      },
      {
        name:'Operador',
        value:'operador'
      },
      {
        name:'Autorizador',
        value:'authorizdor'
      }
    ];
  }

  ngOnInit() {
    this.menuItemSel();
    this.router.events.subscribe((val) => {
      this.menuItemSel();
    });

    this.newUserForm = this._formBuilder.group({
      name: [ '', [Validators.required]], 
      email:  ['', [Validators.required, Validators.pattern(this.emailPattern)]], 
      perfil: [ '', [Validators.required]],
      tipoContacto: [''],
    });
  }

  menuItemSel() {
    if (this.router.url.includes('mi-perfil')) {
      this.selectedMenuItem = 'mi-perfil';
    } else if (this.router.url.includes('usuarios')) {
      this.selectedMenuItem = 'usuarios';
    } else {
      this.selectedMenuItem = '';
    }
  }

  async btnSendNewUser(){
    this.getMesaggeErrorEmail();
    if(this.newUserForm.invalid){
      this.formInvalid = true;
      console.log( this.formInvalid, this.newUserForm)
    }
    else {
      this.formInvalid = false;
      const dataForm = this.newUserForm.getRawValue();
      if(dataForm.tipoContacto != "") this.tipoContacto = dataForm.tipoContacto;
      const data = {
        "name": dataForm.name,
        "email":dataForm.email,
        "perfil":dataForm.perfil,
        "asignarContacto":this.assignContact,
        "tipoContacto": this.tipoContacto
      }
      console.log('dataForm', dataForm);
      console.log('data', data);
      await this.usersService.registerNewUser(data)
      .subscribe(res => {
        console.log(res.getDetalle().data);
        this.personalConfigService.handleNewUserConf()
      }), err => {
        return err;
      };
      console.log('btnSendNewUser', data);
    } 
  }

  getMesaggeErrorEmail(){
    return this.f.email.getError('required')? 'Este campo es requerido' : this.f.email.getError('pattern')? 'Email invalido' : '';    
  }
  getMesaggeErrorNombre() {
    return this.f.name.getError('required') ? 'Este campo es requerido' : '';
  }
  getMesaggeErrorPerfil() {
    return this.f.perfil.getError('required') ? 'Tienes un error' : '';
  }
  handleEditProfile() {
    this._personServices.isEditingProfile = true;
  }
  
  handleSaveChanges(){
    if( this._personServices.profileForm.invalid){
      this._personServices.formInvalid = true;
      return;
    }
    else 
      this._personServices.isEditingProfile =  false;
  }
 
  toggleModal() {
    this.modalService.toggle(this.modalName);
  }

  closeModal() {
    this.modalService.toggle(this.modalName);
  }

  handleCreateUser() {
    this.newUserRegistered = true;
  }

  handleUserRegCompleted() {
    this.newUserRegistered = false;
    this.closeModal();
  }

  handleAssignContact() {
    if(this._personServices.dataUserEdit.contact === 'No')
      this._personServices.dataUserEdit.contact = 'Si'
    else
      this._personServices.dataUserEdit.contact = 'No';
  
  }

  handleAssignContactNewUser() {
    this.assignContact = !this.assignContact;
  }

  async updateUsers(dataUser) {
    await this.usersService.updateUsers(dataUser)
      .subscribe(res => {
        if(res.getDetalle().code === "OK.000")
          this.personalConfigService.handleNewUserConf();
        console.log(dataUser);
      }), err => {
        return err;
      };
  }

}
