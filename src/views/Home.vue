<template>
  <v-app>
    <auth></auth>
  </v-app>
</template>

<script>
import Auth from "../components/Auth.vue";
export default {
  name: "Home",
  components: {
    Auth,
  },
};
</script>
