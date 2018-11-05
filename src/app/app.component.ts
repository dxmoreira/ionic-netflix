import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { firebaseConfig } from './credentials';

import { MoviesPage } from '../pages/movies/movies';
import { LoginPage } from '../pages/login/login';
import { Unsubscribe } from '@firebase/util';
import { FingerprintAIO, FingerprintOptions } from '@ionic-native/fingerprint-aio';
import { timeInterval } from 'rxjs/operators';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  fingerprintOptions: FingerprintOptions;
  rootPage:any = LoginPage;

  constructor(private platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private faio: FingerprintAIO) {
    this.fingerprintOptions = {
      clientId: 'Você pode usar sua digital para acessar a conta. Para isso, toque no sensor.',
      clientSecret: 'password',
      disableBackup: true
    }
    firebase.initializeApp(firebaseConfig);
    const unsubscribe: Unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.fingerprintAvailable();
        //this.rootPage = MoviesPage;
        unsubscribe();
      } else {
        this.rootPage = LoginPage;
        unsubscribe();
      }
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  async fingerprintAvailable() {
    try {
      await this.platform.ready();
      const available = await this.faio.isAvailable();
      //console.log(available);
      if(available === "OK") {
        this.faio.show(this.fingerprintOptions)
        .then(result => {
          this.rootPage = MoviesPage;
        })
        .catch(error => {
          console.log('Error: ', error);
        })
      }
    }
    catch (e) {
      console.log(e);
    }
  }
}