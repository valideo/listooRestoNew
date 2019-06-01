import { LoginPage } from './../login/login';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  email : string = "";
  password : string = "";
  confPassword : string = "";
  fName : string = "";
  sName : string = "";
  tel : string = "";
  address : string = "";
  city : string = "";
  restoName : string = "";
  restoType : string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider: ApiProvider) {
  }

  clickRegister(){
    if(this.email != "" && this.password != "" && this.sName != "" && this.fName != "" && this.address != "" && this.city != "" && this.tel != "" && this.restoName != "" && this.restoType){
      if(this.confPassword == this.password)
        this.register();
      else
        this.apiProvider.presentAlertConnexion("Les mots de passes ne correspondent pas.");

    }else{
      this.apiProvider.presentAlertConnexion("Complete todos los campos para validar su inscripción.");
    }
  }

  register(){
    this.apiProvider.apiRegister(this.email, this.password, this.sName, this.fName, this.address, this.city, this.tel, this.restoName, this.restoType).then(data =>{
      this.navCtrl.push(LoginPage);
      
    }, err =>{

    });
  }

}
