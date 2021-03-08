<template>
	<div>
		<TopNavi
    :title="party.title"
    :links="links"
    >
    </TopNavi>
		<v-row no-gutters>
			<SideNavi></SideNavi>
      <div class="d-md-block d-none">
        <Sidebar head="パーティメンバー" :items="members" :userID="userID">
        </Sidebar>
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
					postType="party"
					collection="partyMessages"
					:userID="userID"
					:postedID="partyID"
					:membersID="membersID"
					:title="partyTitle"
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
				partyID: "",
				partyTitle: "",
				membersID: [],
				messages: [],
				members: [],
				party: {},
				links:{
					link1:{
						title:"所属しているパーティ",
						path:'/',
					},
					link2:{
						title:"募集されているパーティ",
						path:'/partys',
					}
				},
			}
		},
		created(){
			auth.onAuthStateChanged((user) => {
				if(user){
					let members = []
					let party = {}
					this.userID = user.uid
					this.partyID = this.$route.params.id

					db.collection("partys")
					.doc(this.partyID)
					.get()
					.then((doc) => {
							party = Object.assign({id:doc.id},doc.data())
							this.party = party
							this.partyTitle = this.party.title
							this.membersID = this.party.membersID
							this.party.membersID.forEach((id) => {
							db.collection("users")
							.doc(id)
							.get()
							.then((member) => {
								members.push(
									Object.assign({id:member.id},member.data())
								)
							})
							this.members = members
						})
					})

					let messages = []
					let messageObj = {}
					db.collection("partyMessages")
					.where("partyID", "==", this.partyID)
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
					.catch(err => {
						console.log(err)
					})
				}else{
					this.$router.push({name: path, params:{id:id}})
					.catch(err => {
						console.log(err)
					})
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