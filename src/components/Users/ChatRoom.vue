<template>
	<div>
		<TopNavi :title="roomTitle"></TopNavi>
		<v-row no-gutters>
			<SideNavi :linkTo="linkTo"></SideNavi>
      <div class="d-md-block d-none">
        <Sidebar head="パーティメンバー"></Sidebar>
      </div>
			<v-col class="overflow-y-auto maxHeight content">
				<v-container class="stickyWrapper">
					<v-list
					three-line
					color="transparent"
					v-for="(message,i) in messages"
					:key="i"
					>
						<v-list-item>
							<v-list-item-avatar>
								<img src="https://cdn.pixabay.com/photo/2020/07/12/07/47/bee-5396362_1280.jpg">
							</v-list-item-avatar>
							<v-list-item-content>
								<v-list-item-subtitle>
									{{message.userName}}
								</v-list-item-subtitle>
								<v-list-item-subtitle>
									{{message.message}}
								</v-list-item-subtitle>
							</v-list-item-content>
							<v-list-item-action>
								<v-list-item-action-text>
									タイムスタンプを表示
								</v-list-item-action-text>
							</v-list-item-action>
						</v-list-item>
					</v-list>
				</v-container>
				<div class="contentFooter">
					<ChatNavi
					postType="DM"
					collection="messages"
					:userID="userID"
					:postedID="roomID"
					:membersID="membersID"
					:title="roomTitle"
					></ChatNavi>
				</div>
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
	import Sidebar from "@/components/Layout/Sidebar";
	import TopNavi from "@/components/Layout/TopNavi";
	import SideNavi from "@/components/Layout/SideNavi";
	import RightAside from "@/components/Layout/RightAside";
	import ChatNavi from "@/components/Layout/ChatNavi";

	export default{
		name: "",
		components:{
			TopNavi,
			SideNavi,
			Sidebar,
			RightAside,
			ChatNavi,
		},
		data: () => {
			return{
				userID: "",
				roomID: "",
				room: {},
				membersID: [],
				roomTitle: "",
				toUserID: "",
				toUser: {},
				messages: [],
			}
		},
		created(){
			auth.onAuthStateChanged((user) => {
				if(user){
					this.userID = user.uid
					this.toUserID = this.$route.params.id

					let rooms = []
					let messages = []
					let messageObj = {}

					db.collection("users")
					.doc(this.toUserID)
					.get()
					.then((doc) => {
						this.toUser = Object.assign({id:doc.id},doc.data())
						this.roomTitle = this.toUser.name + "さんとのチャット"
					})

					db.collection("rooms")
					.where("membersID", "array-contains", user.uid)
					.get()
					.then((snap) => {
						snap.forEach((doc) => {
							rooms.push(
								Object.assign({id:doc.id},doc.data())
							)
						})
						rooms.forEach((room) => {
							if(room.membersID.indexOf(this.toUserID) !== -1){
								this.room = room
								this.membersID = this.room.membersID
							}
						})
						if(this.room === ''){
							console.log("パーティを作る処理を書く")
						}
					})

					db.collection("messages")
					.where("roomID", "==", this.roomID)
					.orderBy("createAt","desc")
					.onSnapshot((snap) => {
						snap.forEach((doc) => {
							messageObj = Object.assign({id:doc.id},doc.data())
							messageObj.userName = ""
							messages.push(messageObj)
						})
						messages.forEach((message) => {
							db.collection("users")
							.doc(message.userID)
							.get()
							.then((userDoc) => {
								message.userName = userDoc.data().name
							})
						})
						this.messages = messages
						messages = [];
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
      }
    }
	};
</script>

<style>
.content{
	background-color:#616161;
}
.stickyWrapper{
	min-height:calc(100vh - 158px);
}
.contentFooter{
	position:sticky;
	bottom:0;
	width:100%;
}
</style>