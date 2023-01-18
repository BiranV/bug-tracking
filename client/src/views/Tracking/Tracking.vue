<template>
  <div>
    <v-card tile class="pl-4 pr-4">
      <v-row justify="center">
        <v-col cols="12">
          <v-data-table
            calculate-widths
            dense
            :headers="headers.General"
            :items="full_data"
            :search="search"
            multi-sort
            class="rounded-3"
            :sort-by="'TimeUnix'"
            item-key="_id"
            :sort-desc="true"
          >
            <template v-slot:top>
              <v-toolbar flat dense>
                <v-btn
                  :disabled="add_dialog"
                  small
                  color="primary"
                  elevation="0"
                  @click="show_add_dialog(item)"
                  >ADD AN ISSUE</v-btn
                >
                <div class="wrapper" v-if="!add_dialog">
                  <div class="item">
                    <v-icon
                      class="fa fa-long-arrow-right arrow1"
                      aria-hidden="true"
                      >mdi-arrow-left</v-icon
                    >
                  </div>
                </div>
                <v-spacer></v-spacer>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-btn
                  small
                  :disabled="expand_search_dialog"
                  color="grey darken-3 white--text"
                  elevation="0"
                  @click="show_expand_search_dialog(item)"
                  >EXPAND SEARCH</v-btn
                >

                <v-responsive max-width="150">
                  <v-text-field
                    class="ma-2"
                    dense
                    flat
                    rounded
                    filled
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-responsive>
              </v-toolbar>
            </template>
            <template v-slot:[`item.status`]="{ item }">
              <v-chip
                class="white--text"
                small
                :color="get_status_color(item.status)"
                >{{ item.status }}</v-chip
              >
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small @click="view_note(item)" class="ml-4">
                mdi-text
              </v-icon>
              <v-icon small @click="show_edit_dialog(item)" class="ml-4">
                mdi-pencil
              </v-icon>
              <v-icon small @click="delete_item(item)" class="ml-4">
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:[`item.severity`]="{ item }">
              <v-icon :color="get_severity_color(item.severity)"
                >mdi-circle-medium</v-icon
              >{{ item.severity }}
            </template>
            <template v-slot:[`item.device`]="{ item }">
              <v-icon :color="get_device_color(item.device)"
                >mdi-circle-medium</v-icon
              >{{ item.device }}
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
    <v-card tile class="pl-4 pr-4 mt-8" v-if="show_notes">
      <v-toolbar flat dense>
        <b class="mt-5" style="font-size: 1.2em">Developer Notes</b
        ><v-spacer></v-spacer
        ><v-icon class="ml-2" @click="show_notes = false">mdi-close</v-icon>
      </v-toolbar>
      <v-row>
        <v-col class="ml-3 mt-2" cols="3">
          <v-textarea
            rows="3"
            dense
            outlined
            v-model="item.Note"
            label="Note"
          ></v-textarea>
          <v-select
            outlined
            dense
            v-model="item.Developer"
            :items="developerItems"
            label="Developer"
            clearable
          >
          </v-select>
          <v-btn small color="primary" elevation="0" @click="save_edited_item()"
            >Save</v-btn
          >
        </v-col>
      </v-row>
    </v-card>
    <v-card tile class="pl-4 pr-4 mt-8">
      <v-row justify="center">
        <v-col cols="12">
          <v-toolbar flat dense>
            <b style="font-size: 1.2em">Statistics</b></v-toolbar
          >
          <v-row justify="center" class="mb-8">
            <VueApexChart
              type="donut"
              height="220"
              :options="options_status"
              :series="series_status"
            ></VueApexChart>
            <VueApexChart
              type="donut"
              height="220"
              :options="options_device"
              :series="series_device"
            ></VueApexChart>
            <VueApexChart
              type="donut"
              height="220"
              :options="options_severity"
              :series="series_severity"
            ></VueApexChart> </v-row></v-col
      ></v-row>
    </v-card>
    <v-dialog
      persistent
      v-model="add_dialog"
      max-width="400"
      content-class="elevation-2"
    >
      <v-card>
        <v-card-title class="grey darken-3 white--text">
          ADD AN ISSUE</v-card-title
        >
        <v-card-text class="text-center mt-4">
          <v-select
            small-chips
            outlined
            dense
            v-model="item.device"
            :items="['Web', 'Mobile']"
            label="Device"
            clearable
          >
          </v-select>
          <v-select
            small-chips
            outlined
            dense
            v-model="item.status"
            :items="statusItems"
            label="Status"
            clearable
          >
          </v-select>
          <v-select
            small-chips
            outlined
            dense
            v-model="item.employee"
            :items="employeeItems"
            label="Employee"
            clearable
          >
          </v-select>
          <v-select
            small-chips
            outlined
            dense
            v-model="item.severity"
            :items="severityItems"
            label="Severity"
            clearable
          >
          </v-select>
          <v-textarea
            rows="3"
            dense
            outlined
            v-model="item.desc"
            label="Description"
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            :disabled="check()"
            small
            color="primary"
            elevation="0"
            @click="save_new_item()"
          >
            SAVE
          </v-btn>
          <v-btn small text @click="add_dialog = false"> Cancel </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      persistent
      v-model="edit_dialog"
      max-width="400"
      content-class="elevation-2"
    >
      <v-card>
        <v-card-title class="grey darken-3 white--text">
          EDIT AN ISSUE</v-card-title
        >
        <v-card-text class="text-center mt-4">
          <v-select
            small-chips
            outlined
            dense
            v-model="item.device"
            :items="['Web', 'Mobile']"
            label="Device"
            clearable
          >
          </v-select>
          <v-select
            small-chips
            outlined
            dense
            v-model="item.status"
            :items="statusItems"
            label="Status"
            clearable
          >
          </v-select>
          <v-select
            small-chips
            outlined
            dense
            v-model="item.employee"
            :items="employeeItems"
            label="Employee"
            clearable
          >
          </v-select>
          <v-select
            small-chips
            outlined
            dense
            v-model="item.severity"
            :items="severityItems"
            label="Severity"
            clearable
          >
          </v-select>
          <v-textarea
            rows="3"
            dense
            outlined
            v-model="item.desc"
            label="Description"
          ></v-textarea
        ></v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            :disabled="check()"
            small
            color="primary"
            elevation="0"
            @click="save_edited_item()"
          >
            Save
          </v-btn>
          <v-btn small text @click="edit_dialog = false">
            Cancel
          </v-btn></v-card-actions
        ></v-card
      >
    </v-dialog>
    <v-dialog
      persistent
      v-model="expand_search_dialog"
      width="800"
      content-class="elevation-2"
    >
      <v-card>
        <v-card-title class="grey darken-3 white--text">
          EXPAND SEARCH
        </v-card-title>
        <v-card-text>
          <v-row justify="center" class="mt-4">
            <v-col cols="10">
              <v-text-field
                outlined
                clearable
                dense
                type="text"
                v-model="desc_field"
                label="Description"
              ></v-text-field>

              <div
                height="250"
                v-for="(item, index) in results_desc"
                :key="index"
              >
                <br />
                {{ index + 1 }}.
                <div><b>Device: </b> {{ item.device }}</div>
                <div><b>Status: </b>{{ item.status }}</div>
                <div><b>Severity: </b>{{ item.severity }}</div>
                <div><b>Employee: </b>{{ item.employee }}</div>
                <div><b>Description: </b>{{ item.desc }}</div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn small text @click="expand_search_dialog = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import VueApexChart from "vue-apexcharts";
import moment from "moment";
import axios from "axios";
export default {
  props: ["admin_status"],
  components: { VueApexChart },

  data() {
    return {
      full_data: [],
      curr_item: null,
      note: "",
      show_notes: false,
      results_desc: [],
      desc_field: "",
      array_device: ["Web", "Mobile"],
      search: "",
      expand_search_dialog: false,
      add_dialog: false,
      edit_dialog: false,
      developerItems: ["Biran", "Dima", "Guy", "Shir", "Or"],
      statusItems: ["New", "In Process", "Fixed"],
      employeeItems: ["Amir", "Gal", "Matan", "Yogev", "Daniel"],
      severityItems: ["Low", "Normal", "High"],

      item: {
        device: "",
        status: "",
        severity: "",
        desc: "",
        employee: "",
        time: "",
        unix: "",
        developer: "",
        note: "",
      },
      data: [],
      headers: {
        General: [
          { text: "Device", value: "device" },
          { text: "Update Time", value: "time" },
          { text: "Status", value: "status" },
          { text: "Severity", value: "severity" },
          { text: "Description", value: "desc" },
          { text: "Employee", value: "employee" },
          { text: "", value: "actions" },
        ],
      },

      series_status: [],
      series_device: [],
      series_severity: [],

      options_status: {
        labels: [],
        colors: ["#42A5F5", "#B388FF", "#81C784"],
        legend: {
          show: false,
        },
        dataLabels: {
          textAnchor: "end",
          enabled: true,
        },

        plotOptions: {
          pie: {
            donut: {
              size: "55%",
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: "22px",
                  offsetY: -10,
                },
                value: {
                  show: true,
                  fontSize: "16px",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  color: "#000000",
                  offsetY: 6,
                  formatter: function(val) {
                    return val;
                  },
                },
                total: {
                  show: true,
                  label: "Status",
                  fontSize: "16px",
                  color: "#000000",
                  formatter: function(w) {
                    return w.globals.seriesTotals.reduce((a, b) => {
                      return a + b;
                    }, 0);
                  },
                },
              },
            },
          },
        },
      },
      options_device: {
        labels: [],
        colors: ["#A1887F", "#90A4AE"],
        legend: {
          show: false,
        },
        dataLabels: {
          textAnchor: "end",
          enabled: true,
        },

        plotOptions: {
          pie: {
            donut: {
              size: "55%",
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: "22px",
                  offsetY: -10,
                },
                value: {
                  show: true,
                  fontSize: "16px",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  color: "#000000",
                  offsetY: 6,
                  formatter: function(val) {
                    return val;
                  },
                },
                total: {
                  show: true,
                  label: "Device",
                  fontSize: "16px",
                  color: "#000000",
                  formatter: function(w) {
                    return w.globals.seriesTotals.reduce((a, b) => {
                      return a + b;
                    }, 0);
                  },
                },
              },
            },
          },
        },
      },
      options_severity: {
        labels: [],
        colors: ["#FFF176", "#FFB74D", "#EF5350"],

        legend: {
          show: false,
        },
        dataLabels: {
          textAnchor: "end",
          enabled: true,
        },

        plotOptions: {
          pie: {
            donut: {
              size: "55%",
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: "22px",
                  offsetY: -10,
                },
                value: {
                  show: true,
                  fontSize: "16px",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  color: "#000000",
                  offsetY: 6,
                  formatter: function(val) {
                    return val;
                  },
                },
                total: {
                  show: true,
                  label: "Severity",
                  fontSize: "16px",
                  color: "#000000",
                  formatter: function(w) {
                    return w.globals.seriesTotals.reduce((a, b) => {
                      return a + b;
                    }, 0);
                  },
                },
              },
            },
          },
        },
      },
    };
  },
  async created() {
    await axios.get(`api/posts/`).then((res) => {
      this.full_data = res.data;
    });
    this.chart_data();
  },
  methods: {
    view_note(item) {
      this.show_notes = true;
      this.item = item;
    },
    check() {
      if (
        !this.item.device ||
        !this.item.status ||
        !this.item.employee ||
        !this.item.severity ||
        !this.item.desc 
      ) {
        return true;
      }
    },
    async delete_item(item) {
      if (!confirm("Are you sure?")) {
        return;
      } else {
        const path = "api/posts/" + item._id;
        await axios.delete(path).then(() => {
          this.full_data = this.full_data.filter((x) => x !== item);
          this.chart_data();
        });
      }
    },
    show_add_dialog(item) {
      this.item = {};
      this.add_dialog = true;
    },
    show_edit_dialog(item) {
      this.item = item;
      this.edit_dialog = true;
    },
    show_expand_search_dialog() {
      this.results_desc = [];
      this.desc_field = "";
      this.expand_search_dialog = true;
    },
    async save_new_item() {
      this.item.time =
        moment().format("DD/MM/YYYY") + " " + moment().format("HH:mm:ss");
      this.item.unix = moment().format("X");
      await axios.post("api/posts/", this.item).then(() => {
        this.full_data = [...this.full_data, this.item];
        this.add_dialog = false;
        this.chart_data();
      });
      await axios.get(`api/posts/`).then((res) => {
        this.full_data = res.data;
      });
    },
    async save_edited_item() {
      this.item.time =
        moment().format("DD/MM/YYYY") + " " + moment().format("HH:mm:ss");
      this.item.unix = moment().format("X");
      const path = "api/posts/" + this.item._id;
      await axios.put(path, this.item).then(() => {
        this.note = "";
        this.show_notes = false;
        this.edit_dialog = false;
        this.chart_data();
      });
    },
    async search_by_desc(val) {
      if (val != "") {
        this.results_desc = this.full_data.filter((x) =>
          x.desc.includes(val)
        );
      } else if (val == "") {
        this.results_desc = [];
      }
    },
    chart_data() {
      this.series_status = [];
      let counts_status = {};
      this.series_device = [];
      let counts_device = {};
      this.series_severity = [];
      let counts_severity = {};

      let new1 = 0;
      let process = 0;
      let fixed = 0;

      let low = 0;
      let normal = 0;
      let high = 0;

      this.full_data.forEach((el) => {
        if (el.status === "New") {
          new1++;
        } else if (el.status === "In Process") {
          process++;
        } else if (el.status === "Fixed") {
          fixed++;
        }

        if (el.severity === "Low") {
          low++;
        } else if (el.severity === "Normal") {
          normal++;
        } else if (el.severity === "High") {
          high++;
        }

        counts_status[el.status] = counts_status[el.status]
          ? (counts_status[el.status] += 1)
          : 1;
        counts_device[el.device] = counts_device[el.device]
          ? (counts_device[el.device] += 1)
          : 1;
        counts_severity[el.severity] = counts_severity[el.severity]
          ? (counts_severity[el.severity] += 1)
          : 1;
      });

      this.series_status = [new1, process, fixed];
      this.options_status = {
        labels: ["New", "In Process", "Fixed"],
      };

      this.series_device = Object.values(counts_device);
      this.options_device = {
        labels: Object.keys(counts_device),
      };

      this.series_severity = [low, normal, high];
      this.options_severity = {
        labels: ["Low", "Normal", "High"],
      };
    },
    get_status_color(status) {
      if (status == "New") return "#42A5F5";
      else if (status == "In Process") return "#B388FF";
      else if (status == "Fixed") return "#81C784";
      else return null;
    },
    get_severity_color(severity) {
      if (severity == "Low") return "#FFF176";
      else if (severity == "Normal") return "#FFB74D";
      else if (severity == "High") return "#EF5350";
      else return null;
    },
    get_device_color(device) {
      if (device == "Web") return "#A1887F";
      else if (device == "Mobile") return "#90A4AE";
      else return null;
    },
  },

  watch: {
    desc_field: function(val) {
      this.search_by_desc(val);
    },
  },
};
</script>
<style>
.style-1 {
  background-color: rgb(230, 230, 230);
}
</style>
