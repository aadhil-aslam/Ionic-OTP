import { Component } from '@angular/core';
declare var SMSReceive: any

import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  
})


export class HomePage {
  OTP: string = '';
  showOTPInput: boolean = false;
  OTPmessage: string = 'An OTP is sent to your number. You should receive it in 15 s'
  constructor(private toastCtrl: ToastController) {  }

  async presentToast(message: any, show_button: any, position: any, duration: any) {
    const toast = await this.toastCtrl.create({
      message: message,
      // showCloseButton: show_button,
      position: position,
      duration: duration
    });
    toast.present();
  }

  next() {
    this.showOTPInput = true;
    this.start();
  }

  start() {
    SMSReceive.startWatch(
      () => {
        document.addEventListener('onSMSArrive', (e: any) => {
          var IncomingSMS = e.data;
          this.processSMS(IncomingSMS);
        });
      },
      () => { console.log('watch start failed') }
    )
  }

  stop() {
    SMSReceive.stopWatch(
      () => { console.log('watch stopped') },
      () => { console.log('watch stop failed') }
    )
  }

  processSMS(data: { body: string; }) {
    // Check SMS for a specific string sequence to identify it is you SMS
    // Design your SMS in a way so you can identify the OTP quickly i.e. first 6 letters
    // In this case, I am keeping the first 6 letters as OTP
    const message = data.body;
    if (message && message.indexOf('enappd_starters') != -1) {
      this.OTP = data.body.slice(0, 6);
      this.OTPmessage = 'OTP received. Proceed to register'
      this.stop();
    }
  }

  register() {
    if (this.OTP != '') {
      this.presentToast('You are successfully registered', false, 'top', 1500);
    } else {
      this.presentToast('Your OTP is not valid', false, 'bottom', 1500);
    }
  }
}
