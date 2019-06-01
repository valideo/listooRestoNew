import { ApiProvider } from './../providers/api/api';
import { HomePage } from '../pages/home/home';
import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { FCM } from '@ionic-native/fcm';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  userId : number = 0;

  constructor(platform: Platform, statusBar: StatusBar, private fcm: FCM, private apiProvider : ApiProvider, private evenemt : Events, private keyboard : Keyboard) {
    platform.ready().then(() => {


      if (!platform.is('mobileweb') && platform.is('ios') || !platform.is('mobileweb') && platform.is('android') ){
        this.fcm.getToken().then(token => {
          console.log(token);
        });
        evenemt.subscribe('tokenOk', () => {
          this.apiProvider.apiLoadProfile().then(data =>{
            console.log(data["id"]);
            console.log("unsubscribe ok");
            this.fcm.unsubscribeFromTopic('resto'+data["id"]);
            this.fcm.subscribeToTopic('resto'+data["id"]);
          }, err =>{
            console.log(err);
          });
        });
        this.fcm.unsubscribeFromTopic('resto');
        this.fcm.subscribeToTopic('resto');
        this.fcm.onTokenRefresh().subscribe(token => {
          console.log(token);
        });
  
        this.fcm.onNotification().subscribe(data => {
          console.log(data);
          if(data.wasTapped){
            console.log("Received in background");
            this.evenemt.publish('goOrders');
          } else {
            console.log("Received in foreground");
            this.apiProvider.presentAlertNotif('¡Nuevo pedido!', "Se ha hecho un nuevo pedido, véalo aquí y prepare el paquete.");
          };
        });
      }
      statusBar.styleDefault();
      statusBar.backgroundColorByHexString("#D6D6D6");
      console.log(statusBar);
    });
  }
}
