class Likes {
	username = '';
	user_id = '';
	like_id = '';
	api_url = 'https://62d1d5c0d4eb6c69e7e431d6.mockapi.io/';

	async like(like_id) {
		let session = new Session();
		session_id = session.getSession();

		let data = {
			username: session_id.username,
			user_id: session_id.id
		}
		data = JSON.stringify(data);

		let response = await fetch(this.api_url + '/likes', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: data
		});
		data = await response.json();
		return data;
	}
	async get(user_id) {
		let api_url = this.api_url + '/likes/' + user_id;

		let response = await fetch(api_url);
		let data = await response.json();			
		return data;
	}
	async getAllLikes() {
		let response = await fetch(this.api_url + '/likes');
		let data = await response.json();
		return data;
		console.log(data)
	}
}