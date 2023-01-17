<template>
  <v-app id="inspire" style="background: #e0e0e0">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <br />

      <div>
        <br />
        <v-row justify="center">
          <v-divider class="mx-4 mt-3"></v-divider><v-chip>Menu</v-chip>
          <v-divider class="mx-4 mt-3"></v-divider
        ></v-row>
        <br />
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-navigation-drawer>
    <v-app-bar app id="grad" :clipped-left="clipped" fixed>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Bug Tracking </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-if="admin_status === false"
        @click="show_dialog_sign_in()"
        class="ml-4"
        dense
        >SIGN IN</v-btn
      >

      <v-dialog
        v-model="dialog_sign_in"
        max-width="450"
        content-class="elevation-2"
      >
        <v-card>
          <v-card-title class="grey darken-3 white--text">SIGN IN</v-card-title>
          <v-container>
            <v-row justify="center">
              <v-col cols="6">
                <v-otp-input
                  @finish="sign_in()"
                  v-model="PASSWORD"
                  class="mt-3"
                  dense
                  length="5"
                  type="password"
                ></v-otp-input
              ></v-col>
              <v-alert dense v-if="error == true" type="error"
                >The password is incorrect. Try again</v-alert
              >
            </v-row>
          </v-container>
          <v-card-actions class="justify-center">
            <v-btn small text @click="cancel_dialog()"> CANCEL</v-btn>
          </v-card-actions></v-card
        ></v-dialog
      >
      <div v-if="admin_status === true">
        <v-btn v-if="admin_status === true" dense
          >ADMIN
          <v-icon class="ml-2" @click="logout()">mdi-close</v-icon></v-btn
        >
      </div>
    </v-app-bar>

    <v-main class="mt-8 mb-8 mr-4 ml-4">
      <router-view :admin_status="admin_status" :key="key_components" />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      error: false,
      drawer: true,
      clipped: true,
      fixed: false,
      miniVariant: false,
      PASSWORD: "",
      admin_status: false,
      dialog_sign_in: false,
      key_components: 0,

      items: [
        {
          icon: "mdi-database-plus-outline",
          title: "Tracking",
          to: "/",
        },
        {
          icon: "mdi-book-open-blank-variant",
          title: "Guide",
          to: "/guide",
        },
      ],
    };
  },
  methods: {
    show_dialog_sign_in() {
      this.PASSWORD = "";
      this.dialog_sign_in = true;
    },
    cancel_dialog() {
      this.error = false;
      this.PASSWORD = "";
      this.dialog_sign_in = false;
    },
    valid() {
      if (this.PASSWORD == "23688") {
        return true;
      } else return false;
    },
    sign_in() {
      if (this.valid()) {
        this.error = false;
        if (this.PASSWORD == "23688") {
          this.admin_status = true;
          this.dialog_sign_in = false;
          this.key_components++;
        } else {
          this.admin_status = false;
          this.dialog_sign_in = false;
          this.key_components++;
        }
      } else {
        this.error = true;
      }
    },
    logout() {
      this.admin_status = false;
      this.key_components++;
    },
  },
};
</script>
<style>
::-webkit-scrollbar {
  width: 9px;
  height: 9px;
}
::-webkit-scrollbar-track {
  border-radius: 15px;
  background: rgba(0, 0, 0, 0.1);
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgb(179, 179, 179);
}
::-webkit-scrollbar-thumb:hover {
  background: rgb(105, 105, 105);
}
::-webkit-scrollbar-thumb:active {
  background: rgb(105, 105, 105);
}
#grad {
  background-image: linear-gradient(
    to left,
    rgb(90, 177, 143),
    rgb(237, 238, 172)
  );
}
.arrow1 {
  animation: slide1 1s ease-in-out infinite;
  margin-left: 9px;
}

.arrow2 {
  animation: slide2 1s ease-in-out infinite;
}

.arrow3 {
  transform-origin: 0% 50%;
  animation: slide3 1s ease-in-out infinite;
}

.arrow4 {
  transform-origin: 0% 50%;
  animation: slide4 4s linear infinite;
}

@keyframes slide1 {
  0%,
  100% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(10px, 0);
  }
}

@keyframes slide2 {
  0%,
  100% {
    transform: translate(0, 0) rotate(45deg);
  }

  50% {
    transform: translate(10px, 10px) rotate(45deg);
  }
}

@keyframes slide3 {
  0%,
  100% {
    transform: rotate(-45deg);
  }

  50% {
    transform: rotate(45deg);
  }
}

@keyframes slide4 {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
