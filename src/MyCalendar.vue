<template>
    <VueCal
        :events="events"
        :disable-views="['years', 'year', 'month']"
    ></VueCal>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

var processStopwatches = (stopwatches) => {
    // Processes the stopwatch data to be compatible with this calendar.

    var _convertDateStr = (dateStr) => {
        // Converts date strings from YYYY-MM-DDTHH:MM:SS.msZ to YYYY-MM-DD HH:MM:SS
        // e.g.: 2022-10-10T15:22:13.555Z -> 2022-10-10 15:22:13
        return dateStr.substring(0, 10) + " " + dateStr.substring(11, 19)
    }

    let events = []
    stopwatches.forEach(sw => {
        if (sw.startTime && sw.endTime) {
            events.push({
                start: _convertDateStr(sw.startTime),
                end: _convertDateStr(sw.endTime),
                title: sw.task,
            })
        }
    });

    return events
}

export default {
    name: "MyCalendar",
    components: { VueCal },
    data () {
        return {
            events: undefined,
        }
    },
    async created () {
        const stopwatches = await window.electronAPI.loadStopwatches();
        this.events = processStopwatches(stopwatches);
    }
}
</script>