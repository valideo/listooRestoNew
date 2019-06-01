import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';

@Component({
  selector: 'page-commandes',
  templateUrl: 'commandes.html',
})
export class CommandesPage {

  orders : any = [];
  ordersDetail : any = [];
  noOrders : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider : ApiProvider, private alertCtrl : AlertController, private events : Events) {

  }

  init(){
    this.apiProvider.apiGetCommandes().then(data =>{
      if(data["length"] == 0){
        this.noOrders = true;
      }
      this.ordersDetail = [];
      this.orders = data;
      this.orders.forEach(element => {
        this.apiProvider.apiLoadUser(parseInt(element["idUser"])).then(dataUser =>{
          var order = {id : element["id"], isRecup : element["isRecup"], qtite : element["qtite"], fName : dataUser["fName"], sName : dataUser["sName"], date : element["orderDateTime"]};
          this.ordersDetail.push(order);
        }, err =>{

        });
      });
      this.events.publish('ordersChanged');
      console.log(this.ordersDetail);
    }, err =>{

    });
  }

  ionViewWillEnter(){
   this.init();
  }

  presentAlertOrder(orderId : number, isRecup : boolean){
    const alert = this.alertCtrl.create({
      message: "¿El pedido ha sido recogido y pagado?",
      inputs : [
        {
          type: 'radio',
          label: 'Si',
          value: 'true',
          checked: isRecup
        },
        {
          type: 'radio',
          label: 'No',
          value: 'false',
          checked: !isRecup
        }
      ],
      buttons: [
        {
        text : 'Ok',
        handler: data => {
          this.updateAlertState(orderId, data);
          this.navCtrl.setRoot(CommandesPage);
        }
      }
    ]
    });
  
    alert.present();
  }

  updateAlertState(orderId : number, state : boolean){
    this.apiProvider.apiUpdateOrderState(orderId, state).then(data =>{
      console.log(data);
    }, err => console.log(err));
  }

}
