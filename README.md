# Auftragshelfer v7 – Cloudflare + Kunden

Mobile PWA für Aufträge, Kalender, Bestellungen, Preise/Angebote und Kundendaten.

## Neu in v7
- Cloud-Sync ohne Supabase: Cloudflare Worker + D1 + R2.
- Gleiches Konto auf Handy und Laptop.
- App-Daten liegen in D1, Bilder in R2.
- Automatischer Sync nach Änderungen und regelmäßige Prüfung auf Änderungen von anderen Geräten.
- Kundendaten: Name/Firma, Telefonnummer, E-Mail, Adresse und Notiz.
- Bei Kunden muss nicht alles ausgefüllt werden; Name, Telefonnummer oder E-Mail reicht.
- Beim Erstellen eines Auftrags erscheinen passende gespeicherte Kunden als kleine Vorschläge.
  Je genauer die Eingabe wird, desto weniger Vorschläge bleiben. Gibt es keinen Treffer, verschwindet die Liste.
- Kalendertermine und Bestell-Einträge können weiterhin bearbeitet und gelöscht werden.

## Cloudflare einmal einrichten
Die App funktioniert auch lokal ohne Cloud. Für Geräte-Sync wird einmal der Ordner `cloudflare/` eingerichtet.

### 1. Cloudflare CLI anmelden
Im Terminal:

```bash
cd cloudflare
npm install
npx wrangler login
```

### 2. D1-Datenbank erstellen

```bash
npx wrangler d1 create auftragshelfer
```

Cloudflare zeigt danach eine `database_id`. Kopiere `wrangler.toml.example` zu `wrangler.toml` und trage diese ID dort ein.

### 3. R2-Bucket für Bilder erstellen

```bash
npx wrangler r2 bucket create auftragshelfer-files
```

Der Bucket-Name ist im Beispiel bereits `auftragshelfer-files`.

### 4. GitHub-Pages-Adresse eintragen
In `cloudflare/wrangler.toml` bei `ALLOWED_ORIGIN` deine Website eintragen, z. B.:

```toml
ALLOWED_ORIGIN = "https://DEIN-NAME.github.io"
```

Für lokales Testen kann man mehrere Origins mit Komma angeben.

### 5. Datenbanktabellen anlegen

```bash
npx wrangler d1 execute auftragshelfer --remote --file=./schema.sql
```

### 6. Worker deployen

```bash
npx wrangler deploy
```

Danach zeigt Cloudflare eine URL wie:

```text
https://auftragshelfer-api.DEIN-NAME.workers.dev
```

### 7. Worker-URL in der App eintragen
In `cloud-config.js`:

```js
window.CLOUD_CONFIG = {
  apiBase: "https://auftragshelfer-api.DEIN-NAME.workers.dev"
};
```

Danach die App-Dateien erneut zu GitHub Pages hochladen.

## Nutzung
Unter **Mehr → Cloud & Konto** kann ein Konto erstellt werden. Danach auf Handy und Laptop mit derselben E-Mail und demselben Passwort anmelden.

Unter **Mehr → Kunden** lassen sich Kundendaten speichern und bearbeiten.

## Datenschutz / Technik
- Passwörter werden nicht im Klartext gespeichert, sondern mit PBKDF2 + zufälligem Salt gehasht.
- Login-Sitzungen laufen nach 30 Tagen ab.
- Bilder werden getrennt vom App-Datenstand in R2 gespeichert und nur für das angemeldete Konto ausgeliefert.
- Ohne Cloud bleiben die Daten wie bisher lokal im Browser gespeichert.

## Hinweis zu Erinnerungen
Browser-Benachrichtigungen funktionieren, wenn die App Benachrichtigungen erlaubt bekommt. Für garantiertes Push im Hintergrund bei komplett geschlossener Web-App wäre später ein eigener Push-Dienst bzw. eine native App nötig.
