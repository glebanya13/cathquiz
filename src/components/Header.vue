<template>
  <div>
    <v-app-bar app color="#8A2BE2" dark>
      <v-toolbar-title>Cathquiz</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn @click="signout()">Выход</v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  methods: {
    signout() {
      this.$store.dispatch("SIGNOUT");
      this.$router.push("/");
    },
  },
};
</script>

<style>
</style>