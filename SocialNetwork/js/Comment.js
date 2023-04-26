class Comment {
	post_id = '';
	user_id = '';
	username = '';
	content = '';
	api_url = 'https://62d1d5c0d4eb6c69e7e431d6.mockapi.io/';
	create() {
		let data = {
			post_id: this.post_id,
			user_id: this.user_id,
			content: this.content,
			username: this.username
		};
		data = JSON.stringify(data);

		fetch(this.api_url + '/coments', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: data
		})
		.then(response => response.json())
		.then(data => {
			console.log('postavljen kom')
		});
	}	
	async getAllComments() {
		let response = await fetch(this.api_url + '/coments');
		let data = await response.json();
		return data;
	}
	async get(post_id) {
		let api_url = this.api_url + '/coments';

		const response = await fetch(api_url);
		const data = await response.json();
		let post_comments = [];

		let i = 0;
		data.forEach(item => {
			if(item.post_id === post_id) {
				post_comments[i] = item;
				i++;
			}
		})
		return post_comments;
	}
}