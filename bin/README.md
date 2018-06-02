## Download
[macOS](https://github.com/ReeganExE/native-player/raw/master/bin/native-player-darwin) | [Windows](https://github.com/ReeganExE/native-player/raw/master/bin/native-player-win32.exe) | [Linux](https://github.com/ReeganExE/native-player/raw/master/bin/native-player-linux)

## Install

### Windows
```sh
native-player-win32.exe install
```
### macOS
```sh
chmod +x ./native-player-darwin
native-player-darwin install
```
### Linux
```sh
chmod +x ./native-player-linux
native-player-linux install
```

### Install extension
Install _Fshare Player_ Chrome extension at https://chrome.google.com/webstore/detail/play-with-fshare/boickpmdjgkjfmjnekkbaalodkdeheoc

## Config
As start up, the program will create a _conf.json_ file in the current folder with content similar to bellow one:

### Windows
```json
{
  "programPath": "C:\\Program Files\\MPC-HC\\mpc-hc64.exe"
}
```
### macOS

```json
{
  "programPath": "/Applications/VLC.app/Contents/MacOS/VLC",
  "args": ["--video-on-top", "--no-embedded-video"]
}
```

Whereas:
- `programPath`: absolute path to your player
- `args`: additional parameters to run the player
