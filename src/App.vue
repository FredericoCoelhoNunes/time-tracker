<template>
  <div id="app">
    <div class="main-window">
      <div class="stopwatch-section">
        <div class="add-stopwatch-container">
          <span>Time Tracker</span>
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
import MyStopwatch from "./components/MyStopwatch.vue";
  
let uuid = 1;  // an ID for the stopwatches

export default {
  name: "App",
  components: {
    MyStopwatch,
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
      this.stopwatches.push({"uuid": uuid});
      uuid += 1;
    },
    saveStopwatch(index, stopwatchData) {
      // signalling to main process to save the stopwatch data
      window.electronAPI.saveStopwatch(JSON.stringify(stopwatchData));
      this.stopwatches.splice(index, 1);
    },
    deleteStopwatch(index) {
      this.stopwatches.splice(index, 1);
    }
  },
};
</script>