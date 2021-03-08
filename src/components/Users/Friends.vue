<template>
  <div>
    <TopNavi
    :title=changeTitle
    :tabItems="tabItems"
    @tabs="getTabsValue"
    ></TopNavi>
    <v-row no-gutters>
      <SideNavi></SideNavi>
      <div class="d-md-block d-none">
        <Sidebar
        head="フレンド"
        :items="friends"
        :user="currentUser"
        :linkTo="linkTo"
        >
        </Sidebar>
      </div>
      <v-col class="overflow-y-auto maxHeight content">
        <v-container>
          <v-tabs-items
          v-model="tabs"
          class="transparent"
          >
            <v-tab-item>
              <v-list
              three-line
              color="transparent"
              v-for="(friend) in friends"
              :key="friend.id"
              >
                <v-list-item>
                  <v-list-item-avatar>
                    <img :src="friend.iconUrl">
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-subtitle>
                      {{friend.name}}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      game
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                    icon
                    @click="linkTo('chat',friend.id)"
                    >
                      <v-icon>mdi-message-outline</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  <v-list-item-action>
                    <v-menu
                      rounded="rounded"
                      offset-y
                    >
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        >
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>

                      <v-list>
                        <v-list-item
                        >
                          <v-list-item-title>
                            削除
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item-action>
                </v-list-item>
                <v-divider></v-divider>
              </v-list>
            </v-tab-item>
            <v-tab-item>
              <v-list
              three-line
              color="transparent"
              v-for="(user) in users"
              :key="user.id"
              >
                <v-list-item>
                  <v-list-item-avatar>
                    <img :src="user.iconUrl">
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-subtitle>
                      {{user.name}}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <v-breadcrumbs :items="user.games">
                        <template v-slot:item="{ item }">
                          <v-breadcrumbs-item>
                            {{ item }}
                          </v-breadcrumbs-item>
                        </template>
                      </v-breadcrumbs>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                    icon
                    @click="linkTo('chat',user.id)"
                    >
                      <v-icon>mdi-message-outline</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-divider></v-divider>
              </v-list>
            </v-tab-item>
            <v-tab-item>
              <EditProfile></EditProfile>
            </v-tab-item>
          </v-tabs-items>
        </v-container>
        <BottomNavi></BottomNavi>
      </v-col>
      <div
      class="d-lg-block d-none"
      v-if="RightAsideIsShow"
      >
        <RightAside></RightAside>
      </div>
    </v-row>
  </div>
</template>

<script>
  import {auth} from "@/plugins/firebase.js";
  import {db} from "@/plugins/firebase.js";
  import {storage} from "@/plugins/firebase.js";
  import Sidebar from "@/components/Layout/Sidebar";
  import TopNavi from "@/components/Layout/TopNavi";
  import SideNavi from "@/components/Layout/SideNavi";
  import RightAside from "@/components/Layout/RightAside";
  import BottomNavi from "@/components/Layout/BottomNavi";
  import EditProfile from "@/components/Users/EditProfile"

  export default{
    name: "",
    components:{
      TopNavi,
      SideNavi,
      Sidebar,
      RightAside,
      BottomNavi,
      EditProfile
    },
    data: () => {
      return{
        currentUserID:"",
        currentUser:{},
        users:[],
        friends:[],
        title:"",
        tabItems:[
        "フレンド一覧",
        "ユーザーを探す",
        "プロフィールの設定"
        ],
        tabs:0
      }
    },
    created(){
      auth.onAuthStateChanged((user) => {
        if(user){
          this.currentUserID = user.uid

          db.collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            let currentUser = Object.assign({id:doc.id},doc.data())
            if(currentUser.icon === ""){
              storage
              .ref()
              .child("users/default.png")
              .getDownloadURL()
              .then((url) => {
                currentUser.iconUrl = url
              })
            }else{
              storage
              .ref()
              .child(currentUser.icon)
              .getDownloadURL()
              .then((url) => {
                currentUser.iconUrl = url
              })
            }
            this.currentUser = currentUser
          })

          let friendsID = []
          let friends = []
          db.collection("friends")
          .where("userID", "==", user.uid)
          .get()
          .then((snap) => {
            snap.forEach((doc) => {
              friendsID.push(doc.data().friendID)
            })
            friendsID.forEach((id) => {
              db.collection("users")
              .doc(id)
              .get()
              .then((doc) => {
                let friend = Object.assign({id:doc.id},doc.data())
                if(friend.icon === ""){
                  storage
                  .ref()
                  .child("users/default.png")
                  .getDownloadURL()
                  .then((url) => {
                    friend.iconUrl = url
                    friends.push(friend)
                  })
                }else{
                  storage
                  .ref()
                  .child(friend.icon)
                  .getDownloadURL()
                  .then((url) => {
                    friend.iconUrl = url
                    friends.push(friend)
                  })
                }
              })
              this.friends = friends
            })
          })

          let users = []
          db.collection("users")
          .where("request", "==" ,true)
          .get()
          .then((snap) => {
            snap.forEach((doc) => {
              if(doc.id !== this.currentUserID){
                let user = Object.assign({id:doc.id},doc.data())
                if(user.icon === ""){
                  storage
                  .ref()
                  .child("users/default.png")
                  .getDownloadURL()
                  .then((url) => {
                    user.iconUrl = url
                    users.push(user)
                  })
                }else{
                  storage
                  .ref()
                  .child(user.icon)
                  .getDownloadURL()
                  .then((url) => {
                    user.iconUrl = url
                    users.push(user)
                  })
                }
              }
            })
            this.users = users
          })

        }else{
          console.log("ログインしていません")
        }
      })
    },
    methods:{
      linkTo:function(path,id){
        if(!id){
          this.$router.push(path)
        }else{
          this.$router.push({name: path, params:{id:id}})
        }
      },
      getTabsValue:function(value){
      this.tabs = value
      },
    },
    computed:{
      changeTitle:function(){
        let title = ""
        if(this.tabs === 0){
          title = "フレンド"
        }else if(this.tabs === 1){
          title = "ユーザーを探す"
        }else if(this.tabs ===2){
          title = "プロフィールを編集"
        }
        return title
      },
      RightAsideIsShow:function(){
        if(this.tabs === 1){
          return true
        }else{
          return false
        }
      }
    }
  };
</script>

<style>
.content{
  background-color:#616161;
}
</style>