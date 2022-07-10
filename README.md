# OpenRCT2_ExampleMod
An example mod created for OpenRCT2

## Installation
This SDK requires BackSeatGamer Reverse Proxy to be running in `TCP/IP Broadcast` Mode using `JSON` format. By default, port `29175` will be used.

OpenRCT2 will only run a plugin (what they call mods) if a park is open, so to reload your plugin, simply quit to the main menu, and open a park. As a result, BackSeatGamer Reverse Proxy will fail to establish a connection unless the map is open. If you try to start BackSeatGamer Reverse Proxy and the map is not open, you will be presented with a dialog box informing you a connection could not be established. Simply click OK to try again. If everything is successful, you will be presented with the rewards interface.

To install, simply place `OpenRCT2_ExampleMod.js` the `plugin` directory of your OpenRCT2 install directory.

*Source: [Official OpenRCT2 Docs](https://github.com/OpenRCT2/OpenRCT2/blob/develop/distribution/scripting.md):*

Each script is a single physical javascript file within the `plugin` directory in your OpenRCT2 user directory. The user directory for each platform is usually:

- Windows: `C:\Users\YourName\Documents\OpenRCT2`
- Mac: `/Users/YourName/Library/Application Support/OpenRCT2`
- Linux: `$XDG_CONFIG_HOME/OpenRCT2` or in its absence `$HOME/.config/OpenRCT2`

## Verifying Installation

With the mod file in place, simply launch the game, open the park, start the reverse proxy, and you are good to go.

If the mod is installed correctly, when you open any park, you will be greeted with the following message at the bottom of the screen where alerts are usually shown:
```
BackSeatGamer Initialized...
```

If you can get to the rewards screen of the reverse proxy, then everything is connected properly. Click a reward button to test. If the connection fails, be sure the mod is installed properly, and that you have a park open. Again, reverse proxy will only work if a park is open! It will not work on the title screen.

Thank you for using my mod, and enjoy. Feel free to make changes and upload as your own mod.
