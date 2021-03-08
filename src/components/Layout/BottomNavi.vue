<template>
	<v-bottom-navigation
	fixed
	:value="value"
	class="d-block d-md-none btmNavi centerButton"
	>
		<v-row>
			<v-col>
				<v-btn
				@click="linkTo('/friends')"
				>
					<span>フレンド</span>
					<v-icon>mdi-account-heart</v-icon>
				</v-btn>
			</v-col>
			<v-col>
				<v-btn
				@click="linkTo('/')"
				>
					<span>パーティ</span>
					<v-icon>mdi-account-multiple</v-icon>
				</v-btn>
			</v-col>
			<v-col>
				<v-btn
				@click="linkTo('/communities')"
				>
					<span>コミュニティ</span>
					<v-icon>mdi-earth</v-icon>
				</v-btn>
			</v-col>
		</v-row>
	</v-bottom-navigation>
</template>

<script>

export default {
data: () => ({ value: 1 }),
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
.btmNavi{
	background-color:#212121!important;
}

.centerButton {
  text-align: center;
}
</style>