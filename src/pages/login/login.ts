import { Keyboard } from '@ionic-native/keyboard';
import { PwforgotPage } from './../pwforgot/pwforgot';
import { NativeStorage } from '@ionic-native/native-storage';
import { TabsPage } from './../tabs/tabs';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email : string = "";
  password : string = "";
  shouldHeight = "100%" ;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider : ApiProvider, public nativeStorage : NativeStorage, private keyboard : Keyboard) {
    keyboard.onKeyboardShow()
    .subscribe(data => {
       this.shouldHeight = "-600%";
    });
    keyboard.onKeyboardHide()
    .subscribe(data => {
       this.shouldHeight = "100%";
    });
  }



  clickLogin(){
    if(this.email != "" && this.password != ""){
      this.login();
    }
    else{
      this.apiProvider.presentAlertConnexion("Algunos campos son incorrectos.");
    }
  }

  login(){
    this.apiProvider.apiLogin(this.email, this.password).then(data =>{
      if(data['token'] != ""){
        this.apiProvider.token = data["token"];
        this.navCtrl.setRoot(TabsPage);
        this.nativeStorage.setItem('listooRestoCredentials', {email: this.email, pass: this.password})
        .then(
          () => console.log('Stored item!'),
          error => console.error('Error storing item', error)
        );
      }
    });
  }

  forgotPassClick(){
    this.navCtrl.push(PwforgotPage);
  }

}
