import { ListooInfosPage } from './../listoo-infos/listoo-infos';
import { HomePage } from '../../pages/home/home';
import { NativeStorage } from '@ionic-native/native-storage';
import { ApiProvider } from './../../providers/api/api';
import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';


@Component({
  selector: 'page-profil',
  templateUrl: 'profil.html',
})
export class ProfilPage {

  email : string = "";
  fName : string = "";
  sName : string = "";
  tel : string = "";
  address : string = "";
  city : string = "";
  zip : string = "";
  restoName : string = "";
  restoType : string = "";
  isDisabled : boolean = true;
  btnText : string = "Modificar"

  constructor(public app : App, public navCtrl: NavController, public navParams: NavParams, public apiProvider : ApiProvider, public nativeStorage : NativeStorage) {
    this.loadInfos();
  }

  loadInfos(){
    this.apiProvider.apiLoadProfile().then(data =>{
      this.email = data["email"];
      this.fName = data["fName"];
      this.sName = data["sName"];
      this.tel = data["tel"];
      this.address = data["address"];
      this.city = data["city"];
      this.zip = data["zip"];
      this.restoName = data["restoName"];
      this.restoType = data["restoType"];
    }, err =>{

    });
  }

  disconnect(){
    this.nativeStorage.remove('listooRestoCredentials').then(data=>{
      this.apiProvider.token = "";
      this.navCtrl.setRoot(HomePage);
    }, err =>{
      this.app.getRootNav().setRoot(HomePage);
    });
  }

  editInfos(){
    if(this.isDisabled == true){
      this.isDisabled = false;
      this.btnText = "Guardar los cambios";
    }else{
      this.apiProvider.apiUpdateMe(this.email, this.sName, this.fName, this.address, this.city, this.zip, this.tel, this.restoName, this.restoType).then(data=>{
        this.isDisabled = true;
        this.btnText = "Modificar";
        this.navCtrl.setRoot(ProfilPage);
      }, err =>{
        this.isDisabled = true;
        this.btnText = "Modificar";
        this.apiProvider.presentAlertOK("Impossible de mettre à jour les informations.");
      });
    }
  }

  goDetailApp(){
    this.navCtrl.push(ListooInfosPage);
  }

}
