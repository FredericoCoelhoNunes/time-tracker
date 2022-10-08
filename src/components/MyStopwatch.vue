<template>
  <div class="my-stopwatch-body rounded">
    <div class="my-stopwatch-task">
      <div class="my-stopwatch-text-div">
        <span contenteditable @input="onInput" class="my-stopwatch-text heading">{{ task }}</span>
      </div>
      <div class="my-stopwatch-trash-div">
        <font-awesome-icon icon="fa-solid fa-trash" @click="deleteStopwatch"/>
      </div>
    </div>
    <div class="my-stopwatch-clock bordered-section">
      <span class="my-stopwatch-clock-text heading">{{ timeString }}</span>
    </div>
    <div class="my-stopwatch-buttons">
      <div class="my-stopwatch-start-button-div">
        <button class="my-stopwatch-start-button button" @click="startStopwatch">Start</button>
      </div>
      <div class="my-stopwatch-stop-button-div">
        <button class="my-stopwatch-stop-button button" @click="stopStopwatch">Stop</button>
      </div>
      <div class="my-stopwatch-save-button-div">
        <button class="my-stopwatch-save-button button" @click="saveStopwatch">Save</button>
      </div>
    </div>
  </div>
</template>

<style scoped src='../assets/styles/my-stopwatch-styles.css'/>

<script>
// Adding a fontawesome icon to this component! (the trash can)
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faTrash } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faTrash)

// Stopwatch module
const Stopwatch = require('statman-stopwatch');

function msToTime(duration) {
  // Converts milliseconds to a HH:MM:SS string
  var milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

export default {
  name: 'MyStopwatch',
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      task: 'New Task',
      timeString: '00:00:00',
      stopwatchState: "Paused"
    }
  },
  emits: ['saveStopwatch', 'deleteStopwatch'],
  methods: {
    onInput(e) {
      this.task = e.target.innerText;
    },
    startStopwatch() {
      if (!this.stopwatch) {
        this.stopwatch = new Stopwatch();
        this.stopwatch.start();
        this.updateIntervalID = setInterval(this.updateDisplay, 100);
      } else if (this.stopwatchState == "Paused") {
        this.stopwatch.reset();
        this.stopwatch.setStartTimeDelta(this.curr_time);
        this.stopwatch.start();
      }
      this.stopwatchState = "Running";

    },
    stopStopwatch() {
      if (this.stopwatchState == "Running") {
        this.curr_time = this.stopwatch.stop();
        this.stopwatchState = "Paused";
      }
    },
    saveStopwatch() {
      this.stopStopwatch();
      if (this.updateIntervalID) {
        clearInterval(this.updateIntervalID);  
      }
      this.stopwatchState = 'Locked';
      this.$emit('saveStopwatch', this.$data);
    },
    deleteStopwatch() {
      // TODO: dry! (repeated block of code)
      this.stopStopwatch();
      if (this.updateIntervalID) {
        clearInterval(this.updateIntervalID);  
      }
      this.stopwatchState = 'Locked';
      this.$emit('deleteStopwatch');
    },
    updateDisplay() {
      this.timeString = msToTime(this.stopwatch.read());
    }

  },
}
</script>