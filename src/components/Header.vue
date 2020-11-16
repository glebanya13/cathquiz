<template>
  <div>
    <v-app-bar app color="#8A2BE2" dark>
      <router-link to="/admin" tag="span" style="cursor: pointer">
        <v-toolbar-title>Cathquiz</v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn
          @click="signout()"
          text
          v-if="isUserAuthenticated && credential == 'password'"
          >Выход</v-btn
        >
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  computed: {
    isUserAuthenticated() {
      return this.$store.getters.isUserAuthenticated;
    },
    credential() {
      let id;
      let user = firebase.auth().currentUser;
      if (user) {
        id = user.providerData.map((d) => d.providerId).toString();
      }
      return id;
    },
  },
  methods: {
    signout() {
      this.$store.dispatch("SIGNOUT");
      this.$router.push("/");
    },
  },
};
</script>