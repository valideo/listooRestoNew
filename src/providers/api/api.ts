import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, Events, AlertController } from 'ionic-angular';

@Injectable()
export class ApiProvider {

  apiBaseUrl = "http://api.listoo.co/api/";
  token : string = "";
  isBlured : string = "blured";

  constructor(public http: HttpClient,private toastCtrl: ToastController, private events : Events, private alertCtrl : AlertController) {

  }

  presentToast(message : string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'top',
      cssClass: "toast-error"
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  public hideTabs() {
    let tabs = document.querySelectorAll('.tabbar');
    let scrollContent = document.querySelectorAll('.scroll-content');
    if (tabs !== null) {
      Object.keys(tabs).map((key) => {
        tabs[key].style.transform = 'translateY(56px)';
      });

      // fix for removing the margin if you got scorllable content
      setTimeout(() =>{
        Object.keys(scrollContent).map((key) => {
          scrollContent[key].style.marginBottom = '0';
        });
      })
    }
  }

  presentAlertOK(message : string) {
    const alert = this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    });
  
    alert.present();
  }

  presentAlertConnexion(message : string) {
    const alert = this.alertCtrl.create({
      message: message,
      buttons: ['Reintentar']
    });
  
    alert.present();
  }

  presentAlertNotif(title : string, message : string) {
    const alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
        text : 'Ver el pedido',
        handler: () => {
          this.events.publish('goOrders');
        }
      }
    ]
    });
    alert.present();
  }

//Users 

  apiLogin(email : string, password: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {headers: headers}
    let postData = {"email": email,"password": password}
    return new Promise((resolve) => {
      this.http.post(this.apiBaseUrl+"users/loginResto/", postData, options).subscribe(data => {
        this.token = data['token'];
        this.events.publish('tokenOk');
        console.log(this.token);
        resolve(data);
      }, err => {
        if(err.status == 400){
          this.presentAlertConnexion('Algunos campos son incorrectos.');
      }else if(err.status == 403 || err.status == 404){
           this.presentAlertConnexion('Email o contrasena incorrecta');
      }else{
        this.presentAlertConnexion('Ha acontecido un error en el servidor');
      }
      });
    });
  }

  apiSendMail(email : string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {headers: headers}
    let postData = {"email": email}
    return new Promise((resolve) => {
      this.http.post(this.apiBaseUrl+"users/sendMail/", postData, options).subscribe(data => {
        resolve(data);
      }, err => {
        if(err.status == 500){
          this.presentAlertConnexion('Es imposible enviar el mail de reinicializacion.');
      }
      });
    });
  }

  apiRegister(email : string, password: string, sName : string, fName : string, address : string, city : string, tel : string, restoName : string, restoType : string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {headers: headers}
    let postData = {"email": email,"password": password, "sName": sName, "fName" : fName, "address" : address, "city": city, "zip" : "01000", "tel" : tel, "restoName" : restoName, "restoType" : restoType }
    return new Promise((resolve) => {
      this.http.post(this.apiBaseUrl+"users/registerResto/", postData, options).subscribe(data => {
        resolve(data);
        this.presentAlertOK("Su cuenta ha sido creada.");
      }, err => {
        if(err.status == 400){
          this.presentAlertConnexion('Algunos campos son incorrectos.');
      }else if(err.status == 403 || err.status == 404){
          this.presentAlertConnexion('Algunos campos son incorrectos.');
      }else if(err.status == 409){
        this.presentAlertConnexion('Una cuenta con este email ya ha sido creada.');
      }else{
          this.presentAlertConnexion('Ha acontecido un error en el servidor');
      }
      });
    });
  }

  apiLoadProfile() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl+"users/me/", options).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        this.presentAlertOK("imposible de cargar la informacion, verifique su conexion.");
      });
    });
  }

  apiLoadUser(userId : number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl+"users/"+userId, options).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        this.presentAlertOK("imposible de cargar la informacion, verifique su conexion.");
      });
    });
  }

  apiUpdateMe(email:string, sName:string, fName:string, address:string, city:string, zip:string, tel:string, restoName:string, restoType:string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let postData = {"email": email,"sName": sName, "fName":fName, "address":address, "city":city, "zip":zip, "tel":tel, "age":null, "restoName":restoName, "restoType":restoType}
    let options = {headers: headers}
    return new Promise((resolve, reject) => {
      this.http.put(this.apiBaseUrl+"users/me/",postData, options).subscribe(data => {
        resolve(data);
        console.log(data);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  //Annonces 

  apiGetAnnonce() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl+"getAnnonce/", options).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  apiCreateAnnonce(desc : string, piUrl: string, price : number, startHour : Date, endHour : Date, qtite : number, isActive : boolean) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    let postData = {"desc": desc, "piUrl": "'defaultPic.jpg'", "price" : price, "startHour" : startHour, "endHour": endHour, "qtite" : qtite, "isActive" : isActive}
    return new Promise((resolve, reject) => {
      this.http.post(this.apiBaseUrl+"annonce/create/", postData, options).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  apiUpdateAnnonce(desc : string, price : number, startHour : Date, endHour : Date, qtite : number) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    let postData = {"desc": desc, "price" : price, "startHour" : startHour, "endHour": endHour, "qtite" : qtite}
    return new Promise((resolve, reject) => {
      this.http.put(this.apiBaseUrl+"annonce/update/", postData, options).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  apiChangeAnnonceState(isActive : boolean) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    let postData = {"isActive" : isActive}
    return new Promise((resolve, reject) => {
      this.http.put(this.apiBaseUrl+"annonce/updateState/", postData, options).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  apiUpdateImg(url : string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    let postData = {"imgUrl" : url}
    return new Promise((resolve, reject) => {
      this.http.put(this.apiBaseUrl+"annonce/updateImg/", postData, options).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }


  //Commandes
  apiGetCommandes() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl+"commandes/resto", options).subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  apiUpdateOrderState(orderId : number, state : boolean){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.token,
    });
    let options = {headers: headers}
    let postData = {"isRecup" : state, "orderId" : orderId}
    return new Promise((resolve, reject) => {
      this.http.put(this.apiBaseUrl+"commande/state/", postData, options).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }
}
