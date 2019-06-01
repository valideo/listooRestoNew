import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiProvider } from './../../providers/api/api';
import { TabsPage } from './../tabs/tabs';
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { LoginPage } from './../login/login';
import { NativeStorage } from '@ionic-native/native-storage';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  isLoggedIn : boolean = true;

  constructor(public navCtrl: NavController, public nativeStorage : NativeStorage, public platform : Platform, public apiProvider : ApiProvider, public splash : SplashScreen) {
    this.platform.ready().then(() => {
        
      this.nativeStorage.getItem('listooRestoCredentials')
      .then(
        data => {
          console.log(data);
          this.apiProvider.apiLogin(data['email'], data['pass']).then(data => {
            if(data['token'] != ""){
              this.apiProvider.token = data['token'];
              this.splash.hide();
              this.navCtrl.setRoot(TabsPage);
              this.isLoggedIn = true;
              console.log('native + token OK');
            }else{
              this.isLoggedIn = false;
              console.log('native OK token No OK');
              this.splash.hide();
            }
          }, err =>{
            this.isLoggedIn = false;
            this.splash.hide();
            console.log('failed login');
          });
        },
        error => {
            console.log('native error');
            console.log(error);
            if(this.apiProvider.token != ""){
                
            }
            this.isLoggedIn = false;
            this.splash.hide();
        }
      );
    });
  }

  ionViewDidLoad(){
    this.apiProvider.hideTabs();
   }
   
  quitHome(){
    this.navCtrl.setRoot(TabsPage);
  }

  goToLogin(){
    this.navCtrl.push(LoginPage);
  }

  goToRegister(){
    this.navCtrl.push(RegisterPage);
  }

  ionViewDidEnter() {
    let elem = <HTMLElement>document.querySelector(".tabbar");
    if (elem != null) {
      elem.style.display = 'none';
    }
  }

}
