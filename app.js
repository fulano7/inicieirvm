import axios from 'axios';
import { strict as assert } from 'assert';

async function requisitos(){

	// callback para request malsucedidas
	function errorCallback(error){
		console.log('Error in request!');
		// request realizada e obteve resposta que nao se enquadra nos codigos 2xx
		if (error.response) {
			console.log('Request data:');
			console.log(error.response.data);
			console.log('Request status:');
			console.log(error.response.status);
			console.log('Request headers:');
			console.log(error.response.headers);
		// request realizada mas nao obteve resposta
		} else if (error.request) {
			console.log('Unsuccessful request:');
			console.log(error.request);
		// erro nas opcoes da request
		} else {
			console.log('Error', error.message);
		}
		process.exit(1);
	}

	// cabecalho para requests que exigem autorizacao
	const headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Authorization': 'Bearer 189df2521f53906938f7ce44208143f8efa274366fe851819285fd9562a0ca7f'
	};

	// requisito numero 1: criar um novo usuario
	var nomeUsuarioNovo = "José da Silva";
	var emailUsuarioNovo = "josesilva@teste.com.br";

	var usuarioNovo = await axios({
		method: 'post',
		url: 'https://gorest.co.in/public/v2/users',
		headers: headers,
		data: {
			name: nomeUsuarioNovo,
			gender: "male",
			email: emailUsuarioNovo,
			status: "active"
		}
	}).then(res => res.data)
	.catch(errorCallback);

	assert.equal(usuarioNovo["name"], nomeUsuarioNovo);
	assert.equal(usuarioNovo["email"], emailUsuarioNovo);
	assert.equal(usuarioNovo["gender"], "male");
	assert.equal(usuarioNovo["status"], "active");

	var idUsuarioNovo = usuarioNovo["id"];

	// requisito numero 2: listar todos os usuarios e encontrar o usuario criado pelo id do mesmo
	var todosUsuarios = await axios({
		method: 'get',
		url: 'https://gorest.co.in/public/v2/users',
		headers: headers
	}).then(res => res.data)
	.catch(errorCallback);

	var usuarioEncontrado;

	assert.ok(todosUsuarios.length);

	for(var i=0; i < todosUsuarios.length; i++){
		console.log(todosUsuarios[i]["id"]);
		console.log(idUsuarioNovo);
		if (todosUsuarios[i]["id"] == idUsuarioNovo) {
			console.log('Usuário criado encontrado!');
			usuarioEncontrado = todosUsuarios[i];
			break;
		}
	}

	console.log(usuarioEncontrado);
	assert.ok(usuarioEncontrado);

	assert.equal(usuarioEncontrado["id"], idUsuarioNovo);
	assert.equal(usuarioEncontrado["name"], nomeUsuarioNovo);
	assert.equal(usuarioEncontrado["email"], emailUsuarioNovo);
	assert.equal(usuarioEncontrado["gender"], "male");
	assert.equal(usuarioEncontrado["status"], "active");

	// requisito numero 3: criar um novo post para o usuario criado
	var novoPostTitle = 'Fusce rutrum';
	var novoPostBody = 'vestibulum leo, sed mollis magna lacinia et. Nullam vehicula leo quis nulla commodo, id mattis eros posuere. Cras luctus congue velit, eget scelerisque enim egestas ac. Donec convallis, tellus in feugiat faucibus, nunc felis malesuada elit, eu ultrices nunc erat eu lacus.';

	var novoPost = await axios({
		method: 'post',
		url: 'https://gorest.co.in/public/v2/users/' + usuarioEncontrado["id"].toString() + '/posts',
		headers: headers,
		data: {
			title: novoPostTitle,
			body: novoPostBody
		}
	}).then(res => res.data)
	.catch(errorCallback);

	assert.equal(novoPost["title"], novoPostTitle);
	assert.equal(novoPost["body"], novoPostBody);
	assert.equal(novoPost["user_id"], usuarioEncontrado["id"]);

	console.log(novoPost);
	var idNovoPost = novoPost["id"];

	// requisito numero 4: criar um novo comentario dentro do post criado
	var novoComentarioBody = 'Aliquam malesuada nunc metus, a dictum diam volutpat nec. Ut massa urna, congue mollis est a, rhoncus fermentum dolor. Sed tincidunt nibh aliquet suscipit auctor. Mauris rutrum sapien dui, posuere gravida eros suscipit sit amet. Etiam at sollicitudin eros. Phasellus et cursus libero. Nam consequat velit sapien, a ultricies sem rutrum eget. Curabitur semper turpis at libero maximus elementum. Sed porta leo sit amet maximus malesuada. Aliquam erat volutpat.';
	var novoComentario = await axios({
		method: 'post',
		url: 'https://gorest.co.in/public/v2/posts/' + idNovoPost.toString() + '/comments',
		headers: headers,
		data: {
			name: usuarioEncontrado["name"],
			email: usuarioEncontrado["email"],
			body: novoComentarioBody
		}
	}).then(res => res.data)
	.catch(errorCallback);

	assert.equal(novoComentario["name"], usuarioEncontrado["name"]);
	assert.equal(novoComentario["email"], usuarioEncontrado["email"]);
	assert.equal(novoComentario["body"], novoComentarioBody);
	assert.equal(novoComentario["post_id"], idNovoPost);

	console.log(novoComentario);

	// requisito numero 5: criar um novo comentario dentro do primeiro post da lista publica de posts
	var listaPosts = await axios({
		method: 'get',
		url: 'https://gorest.co.in/public/v2/posts',
	}).then(res => res.data)
	.catch(errorCallback);

	assert.ok(listaPosts[0]);

	var idPrimeiroPost = listaPosts[0]["id"];

	var novoComentarioPrimeiroPostBody = 'Donec commodo condimentum mauris, in tincidunt ligula iaculis et. Praesent auctor nunc augue, eu commodo tortor faucibus varius. Phasellus faucibus purus sit amet elit hendrerit euismod. Fusce bibendum purus et dui blandit aliquet.';
	var novoComentarioPrimeiroPost = await axios({
		method: 'post',
		url: 'https://gorest.co.in/public/v2/posts/' + idPrimeiroPost.toString() + '/comments',
		headers: headers,
		data: {
			name: usuarioEncontrado["name"],
			email: usuarioEncontrado["email"],
			body: novoComentarioPrimeiroPostBody
		}
	}).then(res => res.data)
	.catch(errorCallback);

	console.log(novoComentarioPrimeiroPost);

	assert.equal(novoComentarioPrimeiroPost["name"], usuarioEncontrado["name"]);
	assert.equal(novoComentarioPrimeiroPost["email"], usuarioEncontrado["email"]);
	assert.equal(novoComentarioPrimeiroPost["body"], novoComentarioPrimeiroPostBody);
	assert.equal(novoComentarioPrimeiroPost["post_id"], idPrimeiroPost);

	var idNovoComentarioPrimeiroPost = novoComentarioPrimeiroPost["id"];

	// requisito numero 6: apagar o comentario criado anteriormente
	var apagarNovoComentarioPrimeiroPost = await axios({
		method: 'delete',
		url: 'https://gorest.co.in/public/v2/comments/' + idNovoComentarioPrimeiroPost.toString(),
		headers: headers
	})
	.catch(errorCallback);

	console.log(apagarNovoComentarioPrimeiroPost["status"]);

	assert(apagarNovoComentarioPrimeiroPost["status"], 204);

}

requisitos();