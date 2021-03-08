<template>
  <div>
    <TopNavi
    :title="title"
    :links="links"
    >
    </TopNavi>
    <v-row no-gutters>
      <SideNavi></SideNavi>
      <div class="d-md-block d-none">
        <Sidebar head="フレンド" :items="friends" :userID="userID">
        </Sidebar>
      </div>
      <v-col class="overflow-y-auto maxHeight content">
        <v-container>
          <v-row>
            <v-col
            cols="12"
            v-for="(community) in communities"
            :key="community.id"
            class="my-3"
            >
              <v-sheet
              dark
              hover
              color="transparent"
              >
                <v-row>
                  <v-col
                  cols="12"
                  sm="5"
                  >
                    <v-card>
                      <v-img
                      :src="community.thumbnailUrl"
                      >
                      </v-img>
                    </v-card>
                  </v-col>
                  <v-col
                  cols="12"
                  sm="6"
                  >
                    <v-row no-gutters>
                      <v-col cols="10">
                        <v-card-title
                        class="headline card-title text-truncate"
                        >
                          {{community.title}}
                        </v-card-title>
                        <v-card-subtitle>
                        サブタイトル
                        </v-card-subtitle>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col cols="2">
                        <v-card-actions>
                          <v-btn
                          color="orange"
                          text
                          @click="linkTo('community',community.id)"
                          >
                          確認する
                          </v-btn>
                        </v-card-actions>
                      </v-col>
                      <v-col cols="12">
                        <v-card-text class="text-truncate">
                          {{community.text}}
                        </v-card-text>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-sheet>
              <v-divider></v-divider>
            </v-col>
          </v-row>
        </v-container>
        <BottomNavi></BottomNavi>
      </v-col>
      <div class="d-lg-block d-none">
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

  export default{
    name: "",
    components:{
      TopNavi,
      SideNavi,
      Sidebar,
      RightAside,
      BottomNavi,
    },
    data: () => {
      return{
        userID: "",
        title:"所属しているコミュニティ",
        links:{
          link1:{
            title:"所属しているコミュニティ",
            path:'/myCommunities',
          },
          link2:{
            title:"募集されているコミュニティ",
            path:'/communities',
          }
        },
        communities:[],
        friends: [],
      }
    },
    created(){
      auth.onAuthStateChanged((user) => {
        if(user){
          this.userID = user.uid
          let communities = []
          db.collection("communities")
          .where("membersID","array-contains",user.uid)
          .get()
          .then((snap) =>{
            snap.forEach((doc) =>{
              let community = Object.assign({id:doc.id},doc.data())
              if(community.thumbnail === ""){
                storage
                .ref()
                .child("thumbnail/default.png")
                .getDownloadURL()
                .then((url) => {
                  community.thumbnailUrl = url
                  communities.push(community)
                })
              }else{
                storage
                .ref()
                .child(community.thumbnail)
                .getDownloadURL()
                .then((url) => {
                  community.thumbnailUrl = url
                  communities.push(community)
                })
              }
            })
            this.communities = communities
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
                friends.push(
                  Object.assign({id:doc.id},doc.data())
                )
              })
            })
            this.friends = friends
          })
        }else{
          console.log("ログインしていません")
        }
      })
    },
    methods:{
      openCommunity:function(roomID){
        this.$router.push({name:'community', params:{id:roomID}})
      }
    }
  };
</script>

<style>
.content{
  background-color:#616161;
}
</style>