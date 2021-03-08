<template>
  <div>
    <v-app-bar
    short
		dark
		class="topNavi"
    >
      <v-toolbar-title><span>#</span>{{title}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>

      <template v-slot:extension>
        <v-tabs
          v-model="tabs"
        >
          <v-tab
            v-for="(item,index) in tabItems"
            :key="index"
            @click='send(index)'
          >
            {{item}}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
  </div>
</template>

<script>

export default{
  data () {
      return {
        tabs: null,
      }
    },
	props:{
		tabItems:Array,
		title:String,
		links:Object,
	},
	methods:{
	linkTo:function(path,id){
    if(!id){
      this.$router.push(path)
      .catch(err => {
        console.log(err)
      })
    }else{
      this.$router.push({name: path, params:{id:id}})
      .catch(err => {
        console.log(err)
      })
    }
  },
  send:function(index){
      this.$emit("tabs", index);
    }
	}
};

</script>

<style>
.topNavi{
	background-color:#212121!important;
}
</style>