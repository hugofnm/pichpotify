# Pichpotify

Un savoureux mélange de Raspberry Pi, Pichot et Spotify.

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