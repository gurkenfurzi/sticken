# Auftragshelfer v14 – Google-Sync statt Cloudflare

Diese Version verwendet **kein Cloudflare** und verlangt **keine Zahlungsmethode**.

Gemeinsame Daten liegen in deinem normalen Google-Konto:

- **Google Drive**: App-Daten als JSON + alle Bilder
- **Google Sheets**: Benutzerkonten, Sitzungen und technische Verweise
- **Google Apps Script**: verbindet die PWA sicher mit Drive/Sheets

Die App selbst bleibt eine PWA und funktioniert auf **iPhone, Android und Laptop**.
In der App selbst braucht Stella **keine E-Mail-Adresse**. Ihr könnt weiterhin nur einen
Benutzernamen und ein Passwort verwenden, z. B. `Stella`.

> Wichtig: Für die einmalige Einrichtung brauchst **du** ein normales Google-Konto.
> Dafür ist keine Kreditkarte/Zahlungsmethode nötig. Der Speicher zählt gegen den freien
> Speicherplatz deines Google-Kontos.

---

## Was im Ordner liegt

```text
index.html
app.js
styles.css
manifest.json
service-worker.js
google-sync-config.js
google-apps-script/
  Code.gs
  appsscript.json
```

---

# Einmalige Einrichtung

## 1. Google Apps Script öffnen

1. Auf dem Laptop `https://script.google.com` öffnen.
2. Mit dem Google-Konto anmelden, das die Daten der App besitzen soll.
3. **Neues Projekt** erstellen.
4. Projekt z. B. `Auftragshelfer` nennen.

## 2. Code einfügen

1. Im neuen Projekt die vorhandene Datei `Code.gs` öffnen.
2. Alles darin löschen.
3. Den kompletten Inhalt aus
   `google-apps-script/Code.gs` aus diesem ZIP hineinkopieren.
4. Speichern.

Die Datei `appsscript.json` ist nur als Referenz mitgeliefert. Für die normale Einrichtung
musst du sie nicht zwingend manuell anlegen.

## 3. `setup()` einmal ausführen

Oben im Apps-Script-Editor bei der Funktionsauswahl `setup` auswählen und auf **Ausführen** klicken.

Beim ersten Mal fragt Google nach Berechtigungen für:

- Google Drive
- Google Sheets

Diese werden gebraucht, damit das Script den gemeinsamen App-Speicher erstellen kann.

Nach erfolgreichem `setup()` erstellt Google automatisch in deinem Drive:

- eine Tabelle **„Auftragshelfer Daten“**
- einen Ordner **„Auftragshelfer Dateien“**

In dem Ordner liegen später die Bilder und die eigentlichen App-Daten.

## 4. Als Web-App bereitstellen

Im Apps-Script-Editor oben rechts:

1. **Bereitstellen**
2. **Neue Bereitstellung**
3. Bei „Typ auswählen“ → **Web-App**
4. Beschreibung z. B. `Auftragshelfer API`
5. **Ausführen als:** Ich
6. **Wer hat Zugriff:** Jeder / Anyone
7. **Bereitstellen**

Google kann dabei noch einmal nach Berechtigungen fragen.

Danach bekommst du eine Web-App-Adresse ähnlich:

```text
https://script.google.com/macros/s/AKfycb................................../exec
```

**Diese komplette URL kopieren.**

> Falls bei deinem Google-Konto die Option „Jeder“ nicht angeboten wird, liegt das meist
> an einem verwalteten Firmen-/Schulkonto. Dann am einfachsten ein normales privates
> Google-Konto für die App verwenden.

## 5. URL in die App eintragen

Im App-Ordner die Datei öffnen:

```text
google-sync-config.js
```

Dort steht:

```js
window.GOOGLE_SYNC_CONFIG = {
  scriptUrl: "DEINE_GOOGLE_APPS_SCRIPT_WEBAPP_URL"
};
```

Ersetze nur `DEINE_GOOGLE_APPS_SCRIPT_WEBAPP_URL` durch die URL aus Schritt 4.

Beispiel:

```js
window.GOOGLE_SYNC_CONFIG = {
  scriptUrl: "https://script.google.com/macros/s/AKfycb123456789/exec"
};
```

Speichern.

## 6. Backend testen

Öffne im Browser deine Web-App-URL und hänge Folgendes an:

```text
?action=health
```

Also z. B.:

```text
https://script.google.com/macros/s/AKfycb123456789/exec?action=health
```

Wenn alles stimmt, erscheint ungefähr:

```json
{"ok":true,"service":"auftragshelfer-google-sync"}
```

## 7. App auf GitHub Pages aktualisieren

Lade die App-Dateien wie bisher in dein GitHub-Pages-Repository hoch.

Wichtig sind insbesondere:

```text
index.html
app.js
styles.css
manifest.json
service-worker.js
google-sync-config.js
```

Den Ordner `google-apps-script` musst du **nicht** auf die Website hochladen.
Er ist nur für die Einrichtung bzw. spätere Backend-Änderungen gedacht.

---

# Erstes Konto in der App

Wenn die Website aktualisiert ist:

1. App öffnen.
2. **Mehr → Google-Sync & Konto**.
3. Benutzername eingeben, z. B. `Stella`.
4. Passwort mit mindestens 8 Zeichen eingeben.
5. **Konto erstellen**.

Danach zeigt die App einen Wiederherstellungscode wie

```text
AH-ABCD-EFGH-JKLM-NPQR-STUV
```

an.

**Den Code unbedingt speichern.**

Weil das App-Konto keine E-Mail-Adresse braucht, ist dieser Code die Möglichkeit,
ein vergessenes Passwort zurückzusetzen.

---

# Zweites Gerät verbinden

Auf dem anderen Handy oder Laptop:

1. dieselbe Auftragshelfer-PWA öffnen,
2. **Mehr → Google-Sync & Konto**,
3. mit demselben Benutzernamen + Passwort anmelden.

Dann werden dieselben Daten geladen.

Beispiel:

```text
Stella ändert einen Auftrag auf Android
            ↓
       Google Drive
            ↓
Praktikant öffnet die App auf dem iPhone
            ↓
      derselbe Auftrag
```

Die App prüft regelmäßig, ob ein anderes Gerät einen neueren Stand gespeichert hat.

---

# Bilder

Bilder werden vor dem Hochladen bereits von der App verkleinert und komprimiert.
Danach werden sie in **„Auftragshelfer Dateien“** in Google Drive gespeichert.

Sie werden **nicht öffentlich freigegeben**. Die App lädt sie über das Apps Script,
wenn ein angemeldetes Gerät sie braucht.

Dazu gehören z. B.:

- Auftragsbilder
- Ablagefotos („Wo liegt es?“)
- Bestellbilder
- Bilder bei Preisen
- Bilder bei Angeboten

---

# Wenn du später den Apps-Script-Code änderst

Nach einer Änderung in `Code.gs` reicht Speichern allein nicht immer.

Gehe dann auf:

1. **Bereitstellen → Bereitstellungen verwalten**
2. deine Web-App auswählen
3. **Bearbeiten**
4. neue Version auswählen
5. **Bereitstellen**

Die URL kann dabei normalerweise gleich bleiben.

---

# Datenschutz / Konten

- Stella braucht **kein Google-Konto in der App**.
- Praktikanten brauchen **kein Google-Konto in der App**.
- Nur das Google-Konto, das das Apps Script eingerichtet hat, besitzt die Drive-/Sheet-Dateien.
- Die App verwendet weiterhin Benutzername + Passwort.
- Passwörter werden nicht als Klartext in der Tabelle gespeichert.
- Bilder werden nicht auf „öffentlich“ gestellt.

Für euren kleinen internen Einsatz ist das deutlich einfacher als Cloudflare und benötigt
keine hinterlegte Zahlungsmethode.
