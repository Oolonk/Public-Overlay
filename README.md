# Public SSBM Stream Overlay for this [custom piio Build](https://github.com/Oolonk/piio-ssbm)

This is a 16:9 Super Smash Bros. Melee stream overlay for tournaments using Slippi to show a custom UI on the Stream.

## Requirements

- Slippi
- custom piio build (minimum: v4)
- deactivate the intern HUD of Slippi with Gecko Codes

## Installation

Paste the whole folders into the piio Folder

- Windows: `%UserProfile%\Production Interface IO`
- Linux: `~/Production Interface IO`
    
This will the Assets, Database and the Public Overlay which was gathered by BerlinMelee

## Customization

You can change the 4 Colors of the Stream in `themes/Public Overlay/styles/theme.css`. You can change the numbers of the Variables at the end of the document. The numbers are formated as: Red, Green, Blue (0-255)

## Overlays

every Overlay uses a OBS Browser with a resolution of 1920x1080px

### Bottombar

This is the Bottombar that displays information all the time for example: The Tournament Hashtag, Commentator Name, Location, Locale Time and the Free Text. The content thats being displayed can be changed using the Bottombar Action dropdown. The checkbox right next to right shows and hides the Bottombar.

### Commentator

This overlay shows the Commentator Names, Twitter Account and Team Name to the Overlay

### Links

This overlay show StartGG, Twitter, Youtube and Twitch Link. The Links can be changed(except StartGG) at `themes/Public Overlay/styles/links.html`

### Top8

This will show the Top 8 Tree of your tournament when you use the Slippi Autofill Tool. You need to activate the "Show Start.gg Token inside the Overlay" setting
### UI

This is the UI for Slippi. Disable the intern HUD of Slippi with Gecko Codes and place the Overlay over it.
