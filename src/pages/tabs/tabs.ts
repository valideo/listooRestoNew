import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiProvider } from './../../providers/api/api';
import { ProfilPage } from './../profil/profil';
import { CommandesPage } from './../commandes/commandes';
import { PanierPage } from './../panier/panier';
import { Component, ViewChild } from '@angular/core';
import { Events, Tabs } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;

  tab1Root = PanierPage;
  tab2Root = CommandesPage;
  tab3Root = ProfilPage;
  isBlured : string = "no";
  tabBadgePanier : number = null;
  tabBadgeOrders : number = null;
  orders : any = [];


  constructor(public apiProvider : ApiProvider, public events : Events, public splash : SplashScreen) {
    events.subscribe('blurChange', () => {
      this.isBlured = this.apiProvider.isBlured;
    });
    events.subscribe('goOrders', () => {
      this.tabRef.select(1);
    });

    events.subscribe('panierChanged', () => {
      this.loadPanier();
    });
    events.subscribe('ordersChanged', () => {
      this.loadOrders();
    });
  }

  loadPanier(){
    this.apiProvider.apiGetAnnonce().then(data =>{
      if(data["isActive"] == true)
        this.tabBadgePanier = null;
      else
        this.tabBadgePanier = 1;
        
    },err =>{
      if(err["status"] == 404){
        this.tabBadgePanier = 1;
      }
    });
  }
  loadOrders(){
    this.tabBadgeOrders = 0;
    this.apiProvider.apiGetCommandes().then(data =>{
      if(data["length"] == 0){
        this.tabBadgeOrders = null;
      }
      this.orders = data;
      this.orders.forEach(element => {
        this.tabBadgeOrders += 1;
      });
    }, err =>{

    });
  }

  ionViewWillEnter(){
    this.loadOrders();
    this.loadPanier();
  }

}
