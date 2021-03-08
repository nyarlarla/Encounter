<template>
	<v-app-bar
	dark
	short
	>
		<v-row
		no-gutters
		align="center"
		v-if="isParticipation()"
		>
			<v-btn
			icon
			>
				<v-icon>mdi-emoticon-outline</v-icon>
			</v-btn>
			<v-btn
			icon
			>
				<v-icon>mdi-image-outline</v-icon>
			</v-btn>
			<v-text-field
			dark
			v-model="message"
			label="Regular"
			class="pt-6"
			>
			</v-text-field>
			<v-btn
      fab
      dark
      small
      class="mx-2"
      color="indigo"
      @click="postMessage"
			>
				<v-icon dark>
					mdi-send
				</v-icon>
			</v-btn>
		</v-row>

		<v-row
		no-gutters
		align="center"
		v-else
		>
			<v-text-field
			class="pt-6"
			value="このパーティに参加してメッセージを送りましょう！"
			disabled
			>
			</v-text-field>
			<v-btn>
				<CheckDialog
				:title="title"
				text="このパーティに参加しますか？"
				:action="addMembers"
				>
				</CheckDialog>
			</v-btn>
		</v-row>

	</v-app-bar>
</template>

<script>
import {db} from "@/plugins/firebase";
import CheckDialog from "@/components/Layout/CheckDialog";
export default{
	data(){
		return{
			message:"",
		}
	},
	components:{
		CheckDialog,
	},
	props:{
		postType:String,
		postedID:String,
		collection:String,
		userID:String,
		title:String,
		membersID:Array,
	},
	methods:{
		isParticipation:function(){
			return this.membersID.includes(this.userID)
		},
		postMessage:function(){
			if(this.postType == "party"){
				db.collection(this.collection)
				.add({
					userID: this.userID,
					partyID: this.postedID,
					message: this.message,
					createAt: new Date(),
				})
				.then(this.message = "")
			}
			if(this.postType == "community"){
				db.collection(this.collection)
				.add({
					userID: this.userID,
					roomID: this.postedID,
					message: this.message,
					createAt: new Date(),
				})
				.then(this.message = "")
			}
			if(this.postType == "DM"){
				db.collection(this.collection)
				.add({
					userID: this.userID,
					roomID: this.postedID,
					message: this.message,
					createAt: new Date(),
				})
				.then(this.message = "")
			}
		},
    addMembers:function(){
			this.membersID.push(this.userID)
			db.collection(this.collection)
			.doc(this.postedID)
			.update({
				membersID: this.membersID
			})
		}
	}
};
</script>

<style>

</style>