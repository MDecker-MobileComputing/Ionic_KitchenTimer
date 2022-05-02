import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  /** Eine Minute hat 60.000 Millisekunden. */
  //readonly MILLISECONDS_PRO_MINUTE = 60 * 1000;

  /** Für Testzwecke soll eine Minute nur eine Sekunden lang sein. */
  readonly MILLISECONDS_PRO_MINUTE = 1000;

  /**
   * Konstruktor für *Dependency Injection*.
   */
  constructor(private toastController: ToastController) {}

  /**
   * Event-Handler-Methode für Buttons um Timer einzuplanen.
   *
   * @param minutes Laufzeit des Timers in Minuten
   */
  public async onBegruessenButton(minuten: number) {

    this.timerEinplanen(minuten);

    this.zeigeToast(`Timer mit ${minuten} Minuten Laufzeit gestartet.`);
  }

  /**
   * Methode zur eigentlichen Einplanung des Timers.
   * Siehe auch Konfiguration in Datei `capacitor.config.json`.
   *
   * @param minuten Laufzeit des Timers in Minuten
   */
  private async timerEinplanen(minuten: number) {

    const hatBerechtigung = await this.pruefeBerechtigung();
    console.log(`Hat Berechtigung für lokale Notifikationen: ${hatBerechtigung}`);

    const id = Math.floor((Math.random() * 100) + 1);

    const nowMillis = Date.now();
    const atMillis  = nowMillis + minuten*this.MILLISECONDS_PRO_MINUTE;
    const atDate    = new Date(atMillis);

    await LocalNotifications.schedule({ notifications:
      [{
          id: id,
          title: "Küchen-Timer",
          body: `Die ${minuten} Minuten sind um.`,
          schedule: { at: atDate }
       }]
     });

     console.log(`Timer für ${atDate} wurde eingeplant.`);
  }

  /**
   * Unmittelbar vor Abschicken einer lokalen Notifikation sollte
   *
   * @return `true` gdw. die App die Berechtigung für lokale Notifikationen hat
   */
  private pruefeBerechtigung(): Promise<boolean> {

    return LocalNotifications.checkPermissions().then((res) => {

      if (res && res.display && res.display === "denied") {

        LocalNotifications.requestPermissions().then((res) => {

          if (res && res.display && res.display === "denied") {

            this.zeigeToast("Es können keine Timer erzeugt werden, weil die Berechtigung verweigert wurde.");
            return false;

          } else {

            return true;
          }
        });

      } else {

        return true;
      }
    });
  }

  /**
   * Hilfsmethode für Anzeige einer Nachricht mit einem Toast.
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
