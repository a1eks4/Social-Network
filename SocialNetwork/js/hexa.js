let session = new Session();
session_id = session.getSession();

if(session !== "") {
	

	async function populateUser() {
		let user = new User();
		user = await user.get(session_id);
		document.querySelector('#username').innerText = user['username'];
		document.querySelector('#email').innerText = user['email'];

		document.querySelector('#korisnicko_ime').value = user['username'];
		document.querySelector('#edit-email').value = user['email'];
		document.querySelector('#lozinka').value = user['password'];
	}
	populateUser();
	
}
else {
	window.location.href = "/";
}
document
.querySelector('#logout').addEventListener("click", e => {
	e.preventDefault();

	session.destroySession();
	window.location.href = 'index.html';
})
document.querySelector('#edit-acc').addEventListener("click", () => {
	document.querySelector('.reg-modal').style.display = 'block';
});
document.querySelector('#closeModal').addEventListener("click", () => {
	document.querySelector('.reg-modal').style.display = 'none';
});
document.querySelector('#edit-form').addEventListener("submit", e => {
	e.preventDefault();

	let user = new User();
	user.username = document.querySelector('#korisnicko_ime').value;
	user.email = document.querySelector('#edit-email').value;
	user.password = document.querySelector('#lozinka').value;
	user.edit();
});
document.querySelector('#delete-profile').addEventListener("click", e => {
	e.preventDefault();
	let text = 'Da li  ste sigurni  da zelite da obrisete profil?';
	if(confirm(text) === true) {
		let user = new User();
		user.delete();
	}
});	

document.querySelector('#postForm').addEventListener("submit", e => {
	e.preventDefault();

	async function createPost() {
		let content  = document.querySelector('#postContent').value;
		document.querySelector('#postContent').value = '';
		let post = new Post();
		post.post_content = content;
		post = await post.create();
		let currentUser = new User();
		currentUser = await currentUser.get(session_id);
		let html = document.querySelector('.allPosts').innerHTML;
			let delete_post = '';

			if(session_id === post.user_id) {
				delete_post = '<button class="remove-btn" onclick="removePost(this)">Remove</button>';
			}
			document.querySelector('.allPosts').innerHTML = `<div class="single-post" data-post_id="${post.id}">
															<div class="post-content">${post.content}</div>

															<div class="post-actions">
																<p><b>Autor:</b> ${currentUser.username}</p>
																<div>
																	<button onclick="likePost(this)" class="likePost like-btn"><span>${post.likes}</span>Likes</button>
																	<button class="comment-btn" onclick="commentPost(this)">Comment</button>
																	${delete_post}
																</div>
															</div>

															<div class="post-comments">
																<form>
																	<input placeholder="dodaj komentar.." type="text">
																	<button onclick="commentPosts(event)">Objavi</button>
																</form>
															</div>
														</div> `+ html;
		
	}

	createPost();
});

async function getAllPosts() {
	let all_posts = new Post();
	all_posts = await all_posts.getAllPosts();
	
	all_posts.forEach(post => {
		async function getPostUser() {

			let user = new User();
			user = await user.get(post.user_id);
			let comment = new Comment();
			comment = await comment.get(post.id);
			let comment_html = '';
			if(comment.length > 0) {
				comment.forEach(comment => {
					comment_html += `<div class="single-comment">${comment.content}</div>`;										
				})
			}
			let html = document.querySelector('.allPosts').innerHTML;
			let delete_post = '';

			if(session_id === post.user_id) {
				delete_post = '<button class="remove-btn" onclick="removePost(this)">Remove</button>';
			}
			document.querySelector('.allPosts').innerHTML = `<div class="single-post" data-post_id="${post.id}">
															<div class="post-content">${post.content}</div>

															<div class="post-actions">
																<p><b>Autor:</b> ${user.username}</p>
																<div>
																	<button onclick="likePost(this)" class="likePost like-btn"><span>${post.likes}</span>Likes</button>
																	<button class="comment-btn" onclick="commentPost(this)">Comment</button>
																	${delete_post}
																</div>
															</div>

															<div class="post-comments">
																<form>
																	<input placeholder="dodaj komentar.." type="text">
																	<button onclick="commentPosts(event)">Objavi</button>
																</form>
																${comment_html}
															</div>
														</div> `+ html;
		}
		getPostUser();
	});
}

getAllPosts();

const commentPosts = (event) => {
	event.preventDefault();
	let btn = event.target;
	btn.setAttribute('disabled', 'true');
	let main_post_el = btn.closest('.single-post');
	let post_id = main_post_el.getAttribute('data-post_id');
	let content_value = main_post_el.querySelector('input').value;
	main_post_el.querySelector('input').value = '';
	main_post_el.querySelector('.post-comments'). innerHTML += `<div class="single-comment">${content_value}</div>`;
	let comment = new Comment();
	comment.content = content_value;
	comment.user_id = session_id;
	comment.post_id = post_id;
	comment.create();
}
/*async function getAllComments() {
	let all_comments = new Comment();
	all_comments = await all_comments.getAllComments();

	all_comments.forEach(comment => {
		async function getCommentUser(){
			let user = new User();
			user = await user.get(comment.user_id);
			let comment_html = '';
			if(comment.length > 0) {
				comment.forEach(comment => {
					comment_html += `<div class="single-comment"><b>Autor:${user.username}</b>:${comment.content}</div>`;										
				})
			}
		}
		getCommentUser();
	})
}
getAllComments();*/
const removePost = el => {
	let post_id = el.closest('.single-post').getAttribute('data-post_id');
	el.closest('.single-post').remove();
	let post = new Post();
	post.delete(post_id);
}
const likePost  = el => {
	let main_post_el = el.closest('single-post');
 	let post_id = el.closest('.single-post').getAttribute('data-post_id');
 	let number_likes = parseInt(el.querySelector('span').innerText);
 	el.querySelector('span').innerText = number_likes + 1;
 	el.querySelector('span').style.color = 'blue';
 	el.setAttribute('disabled', 'true');
 	let post = new Post();
 	post = post.like(post_id, number_likes +1);
}
const commentPost = el => {
	let main_post_el = el.closest('.single-post');
	let post_id = main_post_el.getAttribute('data-post_id');

	main_post_el.querySelector('.post-comments').style.display = 'block';
}