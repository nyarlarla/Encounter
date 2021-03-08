<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          sign up
        </h1>
      </v-col>
    </v-row>
  <v-form>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="name"
            label="ユーザー名"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="mail"
            label="メールアドレス"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="password"
            label="パスワード"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-btn @click="signUp">アカウント新規作成</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import {auth} from "@/plugins/firebase";
import {db} from "@/plugins/firebase";

export default {
name: 'Signup',
data: () => ({
  name: "",
  mail: "",
  password: "",
}),
methods: {
    signUp: function () {
      auth.createUserWithEmailAndPassword(this.mail, this.password)
      .then((success) => {
        let user = success.user
        user.updateProfile({
          displayName: this.name
        })
        db.collection("users")
        .doc(user.uid)
        .set({
          name: this.name
        })
        this.$router.push({name: 'partys'})
      })
      .catch((error) =>{
        alert(error.message);
      })
    }
  }
};
</script>