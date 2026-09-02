# Auftragshelfer – mobile PWA

Eine beige, minimalistische Auftrags-App für Stickerei, Textildruck und Ladenalltag.

## Enthalten
- Übersicht mit fälligen / laufenden / fertigen Aufträgen
- Schneller Auftrag: Name/Firma, Telefonnummer, angenommen, fertig bis, Preis, „Wo liegt es?“, Freitext
- Automatisch mitwachsendes Auftragsfeld
- Mehrere Fotos pro Auftrag
- Auftragsliste mit Suche und Filtern
- Auftragsdetails mit Status, Kunde informiert, abholbereit und Erinnerung
- Kalender mit eigenen Terminen
- Kalender-Export (.ics) für Handy-Kalender
- „Bestellen“-Liste mit eigenem Foto oder ohne Foto
- Preise & Angebote
- Mehrere neutrale Farbthemen
- Offline-Unterstützung als PWA
- Speicherung lokal auf dem Gerät

## Start
Am einfachsten den Ordner über einen kleinen lokalen Webserver öffnen:

Python:
    python -m http.server 8000

Dann im Browser:
    http://localhost:8000/stickerei_app/

Auf dem iPhone kann die Website anschließend über „Teilen → Zum Home-Bildschirm“ als App installiert werden.

Hinweis: Direkte dauerhafte Zwei-Wege-Synchronisation mit Apple/Google Kalender benötigt eine native Kalender-Integration und Berechtigungen. Diese Version exportiert Termine als .ics-Dateien, die in Kalender-Apps geöffnet werden können.
