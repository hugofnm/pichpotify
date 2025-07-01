# Pichpotify

Un savoureux mélange de Raspberry Pi, Pichot et Spotify.

<img src="https://github.com/user-attachments/assets/3eab194f-658e-47b7-9015-54f5427717e2" alt="Pichpotify" width="200"/>

## Hardware

Afin de réaliser le projet, vous aurez besoin de :
- Une Raspberry Pi Zero 2W (avec Headers GPIO)
- Une carte micro SD 32Gb (SanDisk Ultra)
- Un écran carré ([Waveshare 19742 4 inch DPI LCD](https://www.waveshare.com/4inch-dpi-lcd-c.htm))
- Un cadre ([Ikea Sannahed](https://www.ikea.com/fr/fr/p/sannahed-cadre-blanc-00459116/))

## Configuration de la Raspberry Pi

Nous allons utiliser le software [Comitup](https://davesteele.github.io/comitup/) pour faciliter la connexion au Wi-Fi.

1. Flasher la carte SD avec la dernière image Comitup Lite en utilisant [Raspberry Pi Imager](https://www.raspberrypi.com/software/)
2. Ne pas oublier de paramétrer le Wi-Fi et la clé SSH pour pouvoir ensuite accéder à la Raspberry Pi
3. Se connecter en SSH à la Raspberry Pi
4. Configurer Comitup (fichier */etc/comitup.conf*) selon [vos préférences](https://davesteele.github.io/comitup/man/comitup-conf.pdf)
5. Update/Upgrade les paquets APT
6. [Installer Node.js](https://nodejs.org/en/download)
7. Cloner le projet
8. Installer Next.js (*npm i next@latest*)
9. Build le projet Next.js (*npm run build*)
10. Run le projet (*npm run start*)

## Authentification

Pour vous connecter à votre compte Spotify, vous devez d'abord créer une application sur le [tableau de bord des développeurs Spotify](https://developer.spotify.com/dashboard/applications). Une fois l'application créée, vous obtiendrez un `Client ID` et un `Client Secret`.
Vous devez également configurer l'URL de redirection pour qu'elle pointe vers `http://127.0.0.1:3000/api/spotify/callback`.

Enfin, vous devez créer un fichier `auth.json` à la racine du projet avec les variables suivantes :

```json
{
  "spotify_client_id": "VOTRE_CLIENT_ID",
  "spotify_client_secret": "VOTRE_CLIENT_SECRET",
  "spotify_redirect_uri": "VOTRE_URL_DE_REDIRECTION",
}
```