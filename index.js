(async function main(){
	const articles = await getArticles();
	for(article of articles){
		displayArticle(article)
	}
})()

function getArticles(){
	return fetch('http://localhost:3000/api/furniture')
	.then(function(reponse){
		return reponse.json()
	})
	.then(function(donnees){
		return(donnees)
	})
	.catch(function(error){
		alert(error)
	})
}

function displayArticle(article){
	const templateElt = document.getElementById("modeleProduit");
	const cloneElt= document.importNode(templateElt.content,true);
	
	cloneElt.getElementById("produit__nom").textContent = article.name;
	cloneElt.getElementById("produit__nom").removeAttribute('id')
	cloneElt.getElementById("produit__description").textContent = 'Description : ' + article.description;
	cloneElt.getElementById("produit__description").removeAttribute('id');
	const prix  = article.price/100;
	cloneElt.getElementById("produit__prix").textContent = 'Prix : ' + prix.toFixed(2)+' €';
	cloneElt.getElementById("produit__prix").removeAttribute('id');
	cloneElt.getElementById("produit__identification").textContent = 'Identifiant : ' + article._id;
	cloneElt.getElementById("produit__identification").setAttribute('id',article._id);
	cloneElt.getElementById("produit__photo").setAttribute('src',article.imageUrl);
	cloneElt.getElementById("produit__photo").removeAttribute('id');
	cloneElt.getElementById("produit__lien").setAttribute('href',`produit.html?id=${article._id}`);
	cloneElt.getElementById("produit__lien").removeAttribute('id');

	document.getElementById("main").appendChild(cloneElt);
}