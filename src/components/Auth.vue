<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="#8A2BE2" dark flat>
            <v-toolbar-title>Авторизация</v-toolbar-title>
            <v-spacer></v-spacer>
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
              <v-divider></v-divider>

              <v-stepper-step step="3" color="#8A2BE2"></v-stepper-step>
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

              <v-stepper-content step="3">
                <v-card class="mb-12" color="grey lighten-2" height="450px">
                  <v-card-text>
                    <h2>Ваши данные:</h2>
                    <v-form v-model="valid3">
                      <v-text-field
                        label="Имя"
                        name="name"
                        prepend-icon="mdi-account"
                        type="text"
                        required
                        v-model="name"
                        :rules="nameRules"
                      ></v-text-field>

                      <v-text-field
                        label="Фамилия"
                        name="surname"
                        prepend-icon="mdi-account"
                        type="text"
                        required
                        v-model="surname"
                        :rules="surnameRules"
                      ></v-text-field>

                      <v-overflow-btn
                        class="my-2"
                        label="Парафия"
                        prepend-icon="mdi-church"
                        required
                        :items="parishes"
                        item-text="name"
                        item-value="id"
                        v-model="parish"
                        :rules="parafiasRules"
                      ></v-overflow-btn>
                      <v-text-field
                        label="Дата рождения"
                        type="date"
                        prepend-icon="mdi-calendar-today"
                        required
                        v-model="birthday"
                        :rules="dateRules"
                      ></v-text-field>
                      <v-overflow-btn
                        class="my-2"
                        label="Класс"
                        prepend-icon="mdi-book-outline"
                        required
                        :items="classes"
                        v-model="clas"
                        :rules="classesRules"
                      ></v-overflow-btn>
                    </v-form>
                  </v-card-text>
                </v-card>
                <v-btn
                  color="#8A2BE2"
                  dark
                  @click="addData()"
                  id="sign-in-button"
                  :disabled="!valid3"
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
      classes: [
        "Школу не начинал",
        "Первый",
        "Второй",
        "Третий",
        "Четвертый",
        "Пятый",
        "Шестой",
        "Седьмой",
        "Восьмой",
        "Девятый",
        "Десятый",
        "Одиннадцатый",
        "Школу закончил",
      ],
      parishes: ["Святой Троицы, г. Глубокое"],
      birthday: null,
      parish: null,
      clas: null,
      name: null,
      surname: null,
      nameRules: [(v) => !!v || "Пожалуйста введите ваше имя"],
      surnameRules: [(v) => !!v || "Пожалуйста введите вашу фамилию"],
      classesRules: [(v) => !!v || "Пожалуйста выберите ваш класс"],
      dateRules: [(v) => !!v || "Пожалуйста введите дату рождения"],
      parafiasRules: [(v) => !!v || "Пожалуйста выберите вашу парафию"],
      phoneRules: [
        (v) => !!v || "Пожалуйста введите ваш номер телефона",
        (v) => (v && v.length >= 12) || "Неправильный номер телефона",
      ],
      optRules: [(v) => !!v || "Пожалуйста введите ваш код"],
    };
  },
  computed: {
    isUserAuthenticated() {
      return this.$store.getters.isUserAuthenticated;
    },
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
      if (this.phNo.length != 12 || this.otp.length != 6) {
        alert("Неверный формат номера телефона / кода!");
      } else {
        var code = this.otp;

        var credential = firebase.auth.PhoneAuthProvider.credential(
          window.confirmationResult.verificationId,
          code
        );
        firebase.auth().signInWithCredential(credential);
        if (this.isUserAuthenticated) {
          this.e1 = 3;
        }
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
    addData() {
      this.$store.dispatch("ADD_USER_DATA", {
        birthday: this.birthday,
        clas: this.clas,
        name: this.name,
        surname: this.surname,
        parishName: this.parish,
        phone: this.phNo,
      });
      if (this.isUserAuthenticated) {
        this.$router.push("/tasks");
      }
    },
  },
  created() {
    this.initReCaptcha();
  },
};
</script>