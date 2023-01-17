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
            <template v-slot:[`item.Status`]="{ item }">
              <v-chip
                class="white--text"
                small
                :color="get_status_color(item.Status)"
                >{{ item.Status }}</v-chip
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
            <template v-slot:[`item.Severity`]="{ item }">
              <v-icon :color="get_severity_color(item.Severity)"
                >mdi-circle-medium</v-icon
              >{{ item.Severity }}
            </template>
            <template v-slot:[`item.Type`]="{ item }">
              <v-icon :color="get_type_color(item.Type)"
                >mdi-circle-medium</v-icon
              >{{ item.Type }}
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
              :options="options_types"
              :series="series_type"
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
            v-model="item.Type"
            :items="['Web', 'Mobile']"
            label="Type"
            clearable
          >
          </v-select>
          <v-select
            small-chips
            outlined
            dense
            v-model="item.Status"
            :items="statusItems"
            label="Status"
            clearable
          >
          </v-select>
          <v-select
            small-chips
            outlined
            dense
            v-model="item.Employee"
            :items="employeeItems"
            label="Employee"
            clearable
          >
          </v-select>
          <v-select
            small-chips
            outlined
            dense
            v-model="item.Severity"
            :items="severityItems"
            label="Severity"
            clearable
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index == 0">
                <span>{{ item }}</span></v-chip
              >
              <span v-if="index == 1" class="grey--text text-caption"
                >(+{{ item.Severity.length - 1 }} others)</span
              >
            </template>
          </v-select>
          <v-textarea
            rows="3"
            dense
            outlined
            v-model="item.Description"
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
            v-model="item.Type"
            :items="['Web', 'Mobile']"
            label="Type"
            clearable
          >
          </v-select>
          <v-select
            small-chips
            outlined
            dense
            v-model="item.Status"
            :items="statusItems"
            label="Status"
            clearable
          >
          </v-select>
          <v-select
            small-chips
            outlined
            dense
            v-model="item.Employee"
            :items="employeeItems"
            label="Employee"
            clearable
          >
          </v-select>
          <v-select
            small-chips
            outlined
            dense
            v-model="item.Severity"
            :items="severityItems"
            label="Severity"
            clearable
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index == 0">
                <span>{{ item }}</span></v-chip
              >
              <span v-if="index == 1" class="grey--text text-caption"
                >(+{{ item.Severity.length - 1 }} others)</span
              >
            </template>
          </v-select>
          <v-textarea
            rows="3"
            dense
            outlined
            v-model="item.Description"
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
                v-model="description_field"
                label="Description"
              ></v-text-field>

              <div
                height="250"
                v-for="(item, index) in results_description"
                :key="index"
              >
                <br />
                {{ index + 1 }}.
                <div><b>Type: </b> {{ item.Type }}</div>
                <div><b>Status: </b>{{ item.Status }}</div>
                <div><b>Severity: </b>{{ item.Severity }}</div>
                <div><b>Employee: </b>{{ item.Employee }}</div>
                <div><b>Description: </b>{{ item.Description }}</div>
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
      curr_item: null,
      Note: "",
      show_notes: false,
      results_description: [],
      description_field: "",
      array_types: ["Web", "Mobile"],
      full_data: [],
      search: "",
      expand_search_dialog: false,
      add_dialog: false,
      edit_dialog: false,
      developerItems: ["Biran", "Dima", "Guy", "Shir", "Or"],
      statusItems: ["New", "In Process", "Fixed"],
      employeeItems: ["Amir", "Gal", "Matan", "Yogev", "Daniel"],
      severityItems: ["Low", "Normal", "High"],

      item: {
        Type: "",
        Status: "",
        Severity: "",
        Description: "",
        Employee: "",
        Time: "",
        TimeUnix: "",
      },
      data: [],
      headers: {
        General: [
          { text: "Type", value: "Type" },
          { text: "Update Time", value: "Time" },
          { text: "Status", value: "Status" },
          { text: "Severity", value: "Severity" },
          { text: "Description", value: "Description" },
          { text: "Employee", value: "Employee" },
          { text: "", value: "actions" },
        ],
      },

      series_status: [],
      series_type: [],
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
      options_types: {
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
                  label: "Type",
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
        !this.item.Type ||
        !this.item.Status ||
        !this.item.Severity ||
        !this.item.Description ||
        !this.item.Employee
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
      this.results_description = [];
      this.description_field = "";
      this.expand_search_dialog = true;
    },
    async save_new_item() {
      this.item.Time =
        moment().format("DD/MM/YYYY") + " " + moment().format("HH:mm:ss");
      this.item.TimeUnix = moment().format("X");
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
      this.item.Time =
        moment().format("DD/MM/YYYY") + " " + moment().format("HH:mm:ss");
      this.item.TimeUnix = moment().format("X");
      const path = "api/posts/" + this.item._id;
      await axios.put(path, this.item).then(() => {
        this.Note = "";
        this.show_notes = false;
        this.edit_dialog = false;
        this.chart_data();
      });
    },
    async search_by_description(val) {
      if (val != "") {
        this.results_description = this.full_data.filter((x) =>
          x.Description.includes(val)
        );
      } else if (val == "") {
        this.results_description = [];
      }
    },
    chart_data() {
      this.series_status = [];
      let counts_status = {};
      this.series_type = [];
      let counts_type = {};
      this.series_severity = [];
      let counts_severity = {};

      let new1 = 0;
      let process = 0;
      let fixed = 0;

      let low = 0;
      let normal = 0;
      let high = 0;

      this.full_data.forEach((el) => {
        if (el.Status === "New") {
          new1++;
        } else if (el.Status === "In Process") {
          process++;
        } else if (el.Status === "Fixed") {
          fixed++;
        }

        if (el.Severity === "Low") {
          low++;
        } else if (el.Severity === "Normal") {
          normal++;
        } else if (el.Severity === "High") {
          high++;
        }

        counts_status[el.Status] = counts_status[el.Status]
          ? (counts_status[el.Status] += 1)
          : 1;
        counts_type[el.Type] = counts_type[el.Type]
          ? (counts_type[el.Type] += 1)
          : 1;
        counts_severity[el.Severity] = counts_severity[el.Severity]
          ? (counts_severity[el.Severity] += 1)
          : 1;
      });

      this.series_status = [new1, process, fixed];
      this.options_status = {
        labels: ["New", "In Process", "Fixed"],
      };

      this.series_type = Object.values(counts_type);
      this.options_types = {
        labels: Object.keys(counts_type),
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
    get_type_color(type) {
      if (type == "Web") return "#A1887F";
      else if (type == "Mobile") return "#90A4AE";
      else return null;
    },
  },

  watch: {
    description_field: function(val) {
      this.search_by_description(val);
    },
  },
};
</script>
<style>
.style-1 {
  background-color: rgb(230, 230, 230);
}
</style>
