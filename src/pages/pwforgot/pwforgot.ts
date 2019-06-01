import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-pwforgot',
  templateUrl: 'pwforgot.html',
})
export class PwforgotPage {

  email : string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider : ApiProvider) {
  }

  valid(){
    if(this.email != ""){
      this.sendMail();
    }
    else{
      this.apiProvider.presentAlertConnexion("Veuillez remplir votre email.");
    }
  }

  sendMail(){
    this.apiProvider.apiSendMail(this.email).then(data =>{
      this.apiProvider.presentAlertConnexion("Un email de réinitialisation vous a été envoyé.");
      this.navCtrl.pop();
    });
  }

}
