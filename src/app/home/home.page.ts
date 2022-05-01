import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  readonly MILLISECONDS_PRO_MINUTE = 60 * 1000;

  /**
   * Konstruktor für *Dependency Injection*.
   */  
  constructor(private toastController: ToastController) {}

  /**
   * Event-Handler-Methode für Buttons um Timer einzuplanen.
   * 
   * @param minutes Laufzeit des Timers
   */
  public async onBegruessenButton(minuten: number) {

    this.timerEinplanen(minuten);

    this.zeigeToast(`Timer mit ${minuten} Minuten Laufzeit gestartet.`);
  }

  /**
   * Methode zur eigentlichen Einplanung des Timers.
   * Siehe auch Konfiguration in Datei `capacitor.config.json`.
   * 
   * @param minuten Laufzeit des Timers
   */
  private async timerEinplanen(minuten: number) {

    const id = Math.floor((Math.random() * 100) + 1);

    const nowMillis = Date.now();
    const atMillis = nowMillis + minuten*this.MILLISECONDS_PRO_MINUTE;
    const atDate = new Date(atMillis);

    await LocalNotifications.schedule({ notifications:
      [{
              id: id,
              title: "Küchen-Timer",
              body: `Die ${minuten} Minuten sind um.`,
              schedule: { at: atDate },                                
              sound: 'notification.wav' // On Android, the file should be in res/raw folder. Recommended format is .wav because is supported by both iOS and Android
        }]
     });
     
  }

  /**
   * Hilfsmethode für Anzeige eines Toasts.
   * 
   * @param nachricht In Toast anzuzeigender Text
   */
  private async zeigeToast(nachricht: string) {

    const toast = await this.toastController.create({    
      message : nachricht,
      duration: 2000  // 2000 ms = 2 seconds
    });

    await toast.present();
  }

}
