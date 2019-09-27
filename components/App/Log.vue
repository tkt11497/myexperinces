<template>
  <v-card v-if="interpretedLogs.length !== 0">
    <v-card-text>
      <div v-for="(log, index) in interpretedLogs" :key="index" style="margin-top: 8px">
        {{
        `${log.createdBy} ${log.logStatus.description} ${
        log.previous ? " from " : ""
        } ${log.previous || ""} ${
        log.next ? " to " : ""
        } ${log.next || ""}`
        }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    interpretedLogs: Array
  }
};
</script>
