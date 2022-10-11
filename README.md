# Time Tracker

![](https://github.com/FredericoCoelhoNunes/time-tracker/blob/main/media/time_tracker.gif)

## Introduction

This program is a simple time tracking app: it allows you to start one (or more) stopwatches, label them, and store them locally. It also allows you to back them up to the cloud (on an S3 bucket).
Additionally, it has a very basic calendar view so you can visualize what tasks you have been working on.

I uploaded the Windows build to a [public folder on Google Drive](https://drive.google.com/drive/folders/1f2wcjaUyDnQgC1Ney5x3MIJ2tN_e3NUt?usp=sharing) - feel free to use it! Simply download the folder and double-click `Time Tracker.exe` to run the program.

## Motivation

This was a personal learning project. My goal was to learn some new tools and technologies (Electron, vue, and to some extent asynchronous programming in Javascript), but building something that I could actually use on my day-to-day. In particular, I wanted to gain some knowledge on how to build graphical interfaces/desktop apps since this was missing from my skill set.

It was a pretty challenging experience, but I definitely feel like I learned a lot and had a lot of fun.

## Documentation

Apart from the basic function/module documentation (I know, I slacked off a bit), you can find my stream-of-consciousness notes on my [Notion journal](https://mountainous-racer-570.notion.site/Time-Tracker-App-dbcdf257709347e7a706d8add3c08ec9).

If you're someone new to programming (using Electron/Vue or otherwise), hopefully these notes will inspire you to not give up! At least, they show that even someone with a few years of experience hits several walls and bugs when trying to learn something new. It's part of the process :-)

## Instructions

### Project setup
```
yarn install
```

### Running Locally
```
yarn run electron:serve
```

### Building

Example for Windows:
```
yarn electron:build --win
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
