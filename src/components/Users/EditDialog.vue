<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
        dark
        x-large
        v-bind="attrs"
        v-on="on"
        >
          編集
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">{{title}}</span>
        </v-card-title>
        <v-card-subtitle>{{subtitle}}</v-card-subtitle>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-card-subtitle>{{label}}</v-card-subtitle>
                <v-card-text>
                  <v-text-field
                    v-model="newValue"
                    required
                  ></v-text-field>
                </v-card-text>
              </v-col>
            </v-row>
          </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            @click="updateValue"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import {db} from "@/plugins/firebase.js";
  export default {
    data () {
      return {
        dialog: false,
        notifications: false,
        sound: true,
        widgets: false,
        newValue: "",
      }
    },
    props:{
      title: String,
      subtitle: String,
      label: String,
      field: String,
      value: String,
      userID: String,
    },
    methods:{
      updateValue:function(){
        db.collection("users")
        .doc(this.userID)
        .set({
          [this.field]: this.newValue
        },{
          merge:true
        })
        .then(() => {
          this.dialog = false
        })
      }
    },
  };
</script>