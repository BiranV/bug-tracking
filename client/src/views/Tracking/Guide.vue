<template>
  <div>
    <h1 class="mb-2">Hello,</h1>
    Bug Tracking is a bug management app that serves as a bridge between
    software testers and developers. <br />
    Each tester can open a record and enter the bug he was able to find, and
    then this record is saved in the database. <br />For each record you can
    determine the type of device, the severity of the bug, description, status
    and the name of the employee.<br />
    You can also edit these records, and of course also delete them completely.
    <br /><br />The text icon (three bars) is for use by the developer.<br />
    By clicking on the icon, a box opens where you enter the comment + The name
    of the developer that handles the bug.<br /><br />
    At the bottom of the application there are graphs of statistics which show
    the distribution of the device type, the severity of the bugs and the status
    of the records.
    <div class="mt-2">Enjoy,</div>
    <h2>Biran.</h2>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      items: [],
      url: "https://dummyjson.com/users",
    };
  },
  async created() {
    this.items = await axios.get(this.url);
  },

  methods: {},
};
</script>
<style scoped></style>
