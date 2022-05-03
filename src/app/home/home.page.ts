import { Component } from '@angular/core';
import { ToastController, Platform } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';

/**
 * Seite mit Buttons um einen Küchen-Timer zu starten, Demo für Verwendung von lokalen Notifikationen.<br>
 * <br>
 * 
 * Doku zu Capacitor-Plugin "local-notifications": https://capacitorjs.com/docs/apis/local-notifications
 */
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
  constructor(private toastController: ToastController,
              private platform: Platform) {}


  /**
   * Event-Handler-Methode für Buttons zur Einplanung eines Timers.
   *
   * @param minutes Laufzeit des Timers in Minuten
   */
  public async onButtonGeklickt(minuten: number) {

    if (this.istPlatformOkay() == false) {

      return;
    }

    const hatBerechtigung = await this.pruefeBerechtigung();
    if (hatBerechtigung === false) {

      return;
    }

    this.timerEinplanen(minuten);

    this.zeigeToast(`Timer mit ${minuten} Minuten Laufzeit gestartet.`);
  }

  /**
   * Prüft ob App gerade auf einem System / in einer Umgebungs ausgeführt
   * wird, in der lokale Notifikationen zur Verfügung stehen.
   * 
   * @returns `true` gdw. die App auf einem System ausgeführt wird,
   *          auf dem lokale Notifikationen möglich sind (vorerst
   *          nur auf einem Android-Gerät)
   */
  private istPlatformOkay(): boolean {

    const platformsArray = this.platform.platforms();     
    // Array enthält nur "desktop", wenn die App mit "ionic serve" ausgeführt wird.
    // Wenn die App im Emulator läuft, dann enthält der Array die folgenden Werte:
    // "android", "cordova", "capacitor", "desktop", "hybrid"

    //this.zeigeToast(`platformsArray: ${platformsArray}`);

    if (platformsArray.includes("android")) {

      return true;

    } else {

      console.log(`Betriebssysteme: ${platformsArray}`);
      this.zeigeToast("Auf dem aktuellen Betriebssystem werden keine lokalen Notifikationen unterstützt.");
      return false;
    }
  }

  /**
   * Methode zur eigentlichen Einplanung des Timers.
   * Es sind auch noch Konfigurationen in der Datei `capacitor.config.json` möglich.
   *
   * @param minuten Laufzeit des Timers in Minuten
   */
  private async timerEinplanen(minuten: number) {

    const id = Math.floor((Math.random() * 100) + 1);

    const nowMillis = Date.now();
    const atMillis  = nowMillis + minuten*this.MILLISECONDS_PRO_MINUTE;
    const atDate    = new Date(atMillis);

    await LocalNotifications.schedule({ notifications:
      [{
          id: id,
          title: "Küchen-Timer",
          body: `Die ${minuten} Minuten sind um.`,
          schedule: { at: atDate,
                      allowWhileIdle: true }
       }]
     });

     console.log(`Timer für ${atDate} wurde eingeplant.`);
  }

  /**
   * Unmittelbar vor Abschicken einer lokalen Notifikation sollte; erst ab
   * Android 13 (API-Level 33, "Tiramisu") relevant:
   * https://developer.android.com/about/versions/13/changes/notification-permission
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
