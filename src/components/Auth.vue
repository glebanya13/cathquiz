<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="8">
        <v-card class="elevation-12">
          <v-toolbar color="#8A2BE2" dark flat>
            <v-toolbar-title>Авторизация</v-toolbar-title>
          </v-toolbar>
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step
                editable
                step="1"
                color="#8A2BE2"
              ></v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="2" color="#8A2BE2"></v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-card class="mb-12" color="grey lighten-2" height="200px">
                  <v-card-text>
                    <h2>Введите Ваш номер телефона:</h2>
                    <v-form v-model="valid">
                      <v-text-field
                        prepend-icon="mdi-phone"
                        type="text"
                        required
                        v-model="phNo"
                        placeholder="+375*********"
                        :rules="phoneRules"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                </v-card>
                <v-btn
                  color="#8A2BE2"
                  dark
                  @click="sendOtp()"
                  id="sign-in-button"
                  :disabled="!valid"
                  class="float-right"
                >
                  Продолжить
                </v-btn>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card class="mb-12" color="grey lighten-2" height="200px">
                  <v-card-text>
                    <div id="recaptcha-container"></div>
                    <v-form v-model="valid2">
                      <v-text-field
                        type="number"
                        v-model="otp"
                        placeholder="Код подтверждения"
                        :rules="optRules"
                      />
                    </v-form>
                    <br />
                    <p>Не пришел код?</p>
                    <a @click="sendOtp()">Повторить отправку?</a>
                  </v-card-text>
                </v-card>
                <v-btn
                  color="#8A2BE2"
                  dark
                  @click="verifyOtp()"
                  :disabled="!valid2"
                  class="float-right"
                >
                  Продолжить
                </v-btn>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      e1: 1,
      phNo: "",
      appVerifier: "",
      valid: null,
      valid2: null,
      valid3: null,
      otp: "",
      phoneRules: [
        (v) => !!v || "Пожалуйста введите ваш номер телефона",
        (v) => (v && v.length >= 12) || "Неправильный номер телефона",
      ],
      optRules: [(v) => !!v || "Пожалуйста введите ваш код"],
    };
  },
  methods: {
    sendOtp() {
      this.e1 = 2;
      var phoneNumber = this.phNo;
      var appVerifier = window.recaptchaVerifier;

      firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(function (confirmationResult) {
          window.confirmationResult = confirmationResult;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    verifyOtp() {
      if (this.phNo.length != 13 || this.otp.length != 6) {
        alert("Неверный формат номера телефона / кода!");
      } else {
        var code = this.otp;

        var credential = firebase.auth.PhoneAuthProvider.credential(
          window.confirmationResult.verificationId,
          code
        );
        firebase.auth().signInWithCredential(credential);
      }
    },
    initReCaptcha() {
      setTimeout(() => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: function () {},
          }
        );
        this.appVerifier = window.recaptchaVerifier;
      }, 1000);
    },
  },
  created() {
    this.initReCaptcha();
  },
};
</script>