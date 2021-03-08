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
          sign in
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
            v-model="mailaddress"
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
      <v-btn @click="signIn">ログイン</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import {auth} from "@/plugins/firebase";

export default {
  name: 'Signin',
  data: () => ({
    mailaddress: "",
    password: "",
  }),
  methods: {
    signIn: function(){
      auth.signInWithEmailAndPassword(this.mailaddress,this.password)
      .then(() =>{
        this.$router.push({name: 'partys'})
      }).catch((error) =>{
        alert(error.message)
      })
    }
  }
};
</script>