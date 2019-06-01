import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-start-config',
  templateUrl: 'start-config.html',
})
export class StartConfigPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController) {
    
  }

  dismiss(data : string){
    this.viewCtrl.dismiss({data : data});
  }
}
