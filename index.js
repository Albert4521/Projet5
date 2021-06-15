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
	cloneElt.getElementById("produit__description").textContent = article.description;

	document.getElementById("main").appendChild(cloneElt);
}