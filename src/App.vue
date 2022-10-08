<template>
  <div id="app">
    <div class="main-window">
      <div class="stopwatch-section">
        <div class="add-stopwatch-container">
            <div class="title-and-exit-button">
              <span>Time Tracker</span>
              <div class="window-close-div">
                <font-awesome-icon icon="fa fa-window-close" class="fa-window-close" @click="closeApp"/>
              </div>
            </div>
          <button type="preferences" @click="openPreferences">Preferences</button>
          <button type="button" @click="addStopwatch">Add Stopwatch</button>
        </div>
        <div class="stopwatch-list">
          <my-stopwatch
          v-for="(stopwatch, index) in stopwatches"
          :key="stopwatch.uuid"
          @saveStopwatch="(data) => saveStopwatch(index, data)"
          @deleteStopwatch="deleteStopwatch(index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src='./assets/styles/app-styles.css'/>

<script>
// Adding a fontawesome icon to this component! (the close button)
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faWindowClose)

// Importing the stopwatch component
import MyStopwatch from "./components/MyStopwatch.vue";
  
let uuid = 1;  // an ID for the stopwatches

export default {
  name: "App",
  components: {
    MyStopwatch,
    FontAwesomeIcon
  },
  data() {
    return {
      stopwatches: [],
    };
  },
  methods: {
    addStopwatch() {
      this.stopwatches.push({"uuid": uuid});
      uuid += 1;
    },
    openPreferences() {
      window.electronAPI.openPreferences();
    },
    saveStopwatch(index, stopwatchData) {
      // signalling to main process to save the stopwatch data
      window.electronAPI.saveStopwatch(JSON.stringify(stopwatchData));
      this.stopwatches.splice(index, 1);
    },
    deleteStopwatch(index) {
      this.stopwatches.splice(index, 1);
    },
    closeApp() {
      window.electronAPI.closeApp();
    }
  },
};
</script>