# Pichpotify

Un savoureux mélange de Raspberry Pi et Spotify.

<img src="https://github.com/user-attachments/assets/3eab194f-658e-47b7-9015-54f5427717e2" alt="Pichpotify" width="200"/>

## Hardware

Afin de réaliser le projet, vous aurez besoin de :
- Une Raspberry Pi Zero 2W (avec Headers GPIO)
- Une carte micro SD 32GB (SanDisk Ultra)
- Un écran carré ([Waveshare 19742 4 inch DPI LCD](https://www.waveshare.com/4inch-dpi-lcd-c.htm))
- Un cadre ([Ikea Sannahed](https://www.ikea.com/fr/fr/p/sannahed-cadre-blanc-00459116/))

## Configuration de la Raspberry Pi

Nous allons utiliser le software [Comitup](https://davesteele.github.io/comitup/) pour faciliter la connexion au Wi-Fi.

1. Flasher la carte SD avec la dernière image Comitup Lite en utilisant [Raspberry Pi Imager](https://www.raspberrypi.com/software/)
2. Ne pas oublier de paramétrer le Wi-Fi et la clé SSH pour pouvoir ensuite accéder à la Raspberry Pi
3. Configurer le fichier config.txt de la Raspberry Pi pour [activer l'écran Waveshare](#écran-waveshare)
4. Se connecter en SSH à la Raspberry Pi
5. Configurer Comitup (fichier */etc/comitup.conf*) selon [vos préférences](https://davesteele.github.io/comitup/man/comitup-conf.pdf)
6. Update/Upgrade les paquets APT
7. [Installer Node.js](#nodejs) sur la Raspberry Pi
8. Cloner le projet
9. Installer Next.js (*npm i next@latest*)
10. Build le projet Next.js (*npm run build*)
11. Run le projet (*npm run start*)

### Écran Waveshare

Afin que l'écran puisse fonctionner correctement, il faut installer le driver Waveshare DPI.
1. Télécharger le fichier `4DPIC-DTBO.zip` depuis le dépôt Waveshare - 
[Télécharger](https://files.waveshare.com/upload/8/8a/4DPIC-DTBO.zip)
2. Décompresser le fichier dans le répertoire `/boot/overlays/`
3. Ajouter les lignes suivantes dans le fichier `config.txt` de la Raspberry Pi

```bash
# Waveshare 4 inch DPI LCD
dtoverlay=vc4-kms-v3d
dtoverlay=vc4-kms-DPI-4inch
dtoverlay=waveshare-4dpic-3b-4b
dtoverlay=waveshare-4dpic-3b
dtoverlay=waveshare-4dpic-4b
dtoverlay=waveshare-4dpi
dtoverlay=waveshare-touch-4dpi
```

### Node.js

Pour installer Node.js sur la Raspberry Pi, nous allons utiliser NVM (Node Version Manager) pour gérer les versions de Node.js.
Pour installer NVM et Node.js, suivez les étapes suivantes :

```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash

# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 22

# Verify the Node.js version:
node -v # Should print "v22.16.0".
nvm current # Should print "v22.16.0".

# Verify npm version:
npm -v # Should print "10.9.2".

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

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

## Licence

Ce projet est sous licence MIT. 