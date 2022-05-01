import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  /**
   * Konstruktor für *Dependency Injection*.
   */  
  constructor(private toastController: ToastController) {}

  /**
   * Event-Handler-Methode für Buttons um Timer einzuplanen.
   * 
   * @param minutes Laufzeit des Timers
   */
  public async onBegruessenButton(minutes: number) {

    this.zeigeToast(`Timer mit ${minutes} Minuten Laufzeit gestartet.`);
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
