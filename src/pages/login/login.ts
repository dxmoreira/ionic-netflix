import { Component } from '@angular/core';
import { Alert, AlertController, IonicPage, Loading, LoadingController, NavController, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  showButton:boolean = false;
  public loginForm: FormGroup;
  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    formBuilder: FormBuilder,
    private faio: FingerprintAIO
  ) {
    this.loginForm = formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });
  }

  ionViewDidLoad(){
    this.fingerprintAvailable();
  }
  fingerprintAvailable(){
    this.faio.show({
      clientId: 'Você pode usar sua digital para acessar a conta. Para isso, toque no sensor.',
      clientSecret: 'password',
      disableBackup:true,
      localizedFallbackTitle: 'Use Pin',
      localizedReason: 'Please authenticate'
  })
  .then((result: any) => 
    this.navCtrl.push('MoviesPage',{
      result: result
    })
  )
  .catch((error: any) =>  
    this.navCtrl.push('MoviesPage',{
      result: error
    }));
  }

  goToSignup(): void {
    this.navCtrl.push('SignupPage');
  }

  goToResetPassword(): void {
    this.navCtrl.push('ResetPasswordPage');
  }

  async loginUser(): Promise<void> {
    if (!this.loginForm.valid) {
      //console.log(`Valor: ${this.loginForm.value}`);
    } else {
      const loading: Loading = this.loadingCtrl.create();
      loading.present();

      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      try {
        const loginUser: firebase.User = await this.authProvider.loginUser(
          email,
          password
        );
        this.navCtrl.setRoot('MoviesPage');
        await loading.dismiss();
      } catch (error) {
        await loading.dismiss();
        const alert: Alert = this.alertCtrl.create({
          message: 'Verifique seu usuário de acesso e tente novamente.<br><br>Caso esqueceu sua senha, clique no botão RECUPERAR SENHA.',
          buttons: [{ text: 'Ok', role: 'cancel' }]
        });
        alert.present();
      }
    }
  }
}
