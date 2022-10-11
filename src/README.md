# src

This folder contains the application's code (Javascript and Vue components).
The repository scaffolding was built using the [Vue CLI](https://cli.vuejs.org/guide/creating-a-project.html#using-the-gui) and the [Vue CLI Plugin Electron Builder](https://nklayman.github.io/vue-cli-plugin-electron-builder/).

# Folder/File Descriptions

Note: this repository could definitely be better organized - I'm still learning about the best repository structures for Javascript based projects!

## The Different Windows of the Application

* **calendar**: contains the code to create a separate window for the calendar, as well as it's entry script (which mounts the MyCalendar component).
* **components**: contains the custom component that I created for the stopwatch. This component is used in App.vue which is the main application Window.
* **index**: contains the entry script for the main window of the application.
* **menu**: contains the code to create a window for the settings. Also contains a deprecated script to build a menu for the app (I was using it before I decided to make the app borderless, but I left it there for future reference)
* **preferences**: contains the code to store preferences, and the entry script for the preferences window. Some notes here:
    * this Window is actually not a Vue component, but a pane built with the `tweakpane` package upon loading the page (see: `preferences/main.js`) 
* **public**: contains the HTML files for each page.
* `App.vue`: contains the Vue template + script for the main page of the app. Honestly not a fan of having both of these in the same file, looks cluttered, but I ended up not investigating how to separate them.
* `Calendar.vue`: same as above, but for the Calendar page.

## Handling the Data

* **storage**: contains classes and functions used to save the stopwatch data to a file (possibly also backing it up to S3) and loading it to be used in the calendar view.

## Styling

* **assets/styles**: contains the CSS styles used by the app. Some notes about this:
    * the `-webkit-app-region: no-drag;` specifies which regions of the app _can't_ be dragged. This is important because the Window is borderless and transparent, so we set the body of the window to be draggable - but we actually want to click the buttons, not use them to drag.
    * Flexbox is pretty cool but it can be really confusing sometimes!

## Other Important Files

Most of these files were created with the Vue CLI app, and I had to modify them to fit my project requirements.
They include advanced configurations for parts of the system that I don't have a strong technical grasp over, such a compiling/transpiling, and building the project (Babel, Webpack, etc.).
Most of these files I didn't have to touch, I just stuck with the default configurations; for other stuff that I had to change, I mostly searched online for similar or identical situations, but I would be lying if I said I understand every single line in these files!

* **.eslintrc.js**: created with the Vue CLI. It's the linting configuration, but I didn't end up linting the code.
* **jsconfig.json**: indicates that the directory is the root of a JavaScript project. Didn't have to touch this one!
* **vue.config.js**: includes a lot of important options for the project (Webpack, Electron) that are required to successfully build the project into a standalone application. Without some of these options, the project would run locally but not after being built! It also contains the configuration of the different pages of the project, and their entrypoints.
* **babel.config.js**: Babel configurations, didn't have to touch these.