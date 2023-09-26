# Public SSBM Stream Overlay for this [custom piio Build](https://github.com/Oolonk/piio-ssbm)

This is a 16:9 Super Smash Bros. Melee Stream Overlay for Tournaments using Slippi to show a custom UI on the Stream.

## Requirements

- Slippi
- custom piio Build (minimum: v3)

## Installation

Paste the whole folders into the piio Folder

- Windows: `%UserProfile%\Production Interface IO`
- Linux: `~/Production Interface IO`
    
This will the Assets, Database and the Public Overlay which was gathered by BerlinMelee

## Customization

You can change the 4 Colors of the Stream in `themes/Public Overlay/styles/theme.css`. You can change the numbers of the Variables at the end of the document. The numbers are formated as: Red, Green, Blue (0-255)

## Auto Switcher

This Overlay can also Auto Switch the obs scene when the game starts/ends.

### Enabling the Auto Switcher

Edit the `themes/Public Overlay/styles/manifest.json` file. At `"name": "switchtostart"`, edit below the the array behind "options" with the names of every OBS Scene you want to be able to switch to, when the game starts. Do the same for `"name": "switchtoend"`.
You also need to add the Bottombar Scene to OBS via the OBS-Browser Source. Uncheck the checkbox at `Shutdown source when not visible` and change `Page permissions` to `Advanced access to OBS`

## Overlays

every Overlay uses a OBS Browser with a resolution of 1920x1080px

### Bottombar

This is the Bottombar that displays information all the time for example: The Tournament Hashtag, Commentator Name, Location, Locale Time and the Free Text. The content thats being displayed can be changed using the Bottombar Action dropdown. The checkbox right next to right shows and hides the Bottombar. This overlay also auto changes the obs scene when the game starts/ends.

### Commentator

This Overlay shows the Commentator Names, Twitter Account and Team Name to the Overlay

### Links

This Overlay show StartGG, Twitter, Youtube and Twitch Link. The Links can be changed(except StartGG) at `themes/Public Overlay/styles/links.html`

### Top8

This will show the Top 8 Tree of your tournament when you use the Slippi Autofill Tool.

### UI

This is the UI for Slippi. Disable the intern HUD of Slippi with Gecko Codes and place the Overlay over it.
