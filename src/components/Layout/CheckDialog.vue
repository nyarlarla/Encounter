<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          dark
          class="mx-2"
          color="indigo"
          v-bind="attrs"
          v-on="on"
        >
          参加
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">
          #{{title}}
        </v-card-title>
        <v-card-text>
          {{text}}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="action"
          >
            参加する
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            キャンセル
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
      }
    },
    props:{
      title: String,
      text: String,
      action: Function,
    }
  };
</script>