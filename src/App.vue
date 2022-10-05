<template>
  <div id="app">
    <div class="main-window">
      <div class="control-panel">
          <p>This is the control panel</p>
      </div>
      <div class="stopwatch-section">
        <div class="add-stopwatch-container">
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
    saveStopwatch(index, stopwatchData) {
      this.saveToStorage(stopwatchData);
      this.stopwatches.splice(index, 1);
    },
    saveToStorage(stopwatchData) {
      console.log(stopwatchData);
    },
    deleteStopwatch(index) {
      this.stopwatches.splice(index, 1);
    }
  },
};
</script>