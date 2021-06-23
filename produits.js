const recupDataUrl = location.search;
const recupParametres = new URLSearchParams(recupDataUrl);
const produitID = recupParametres.get('id');
let prix = 0;
let quantite = 0;
let montant = 0;

(async function (){
	const article = await getArticle();
	displayArticle(article);
})()

function getArticle(){
	return fetch(`http://localhost:3000/api/furniture/${produitID}`)
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
	const templateElt = document.getElementById("ficheProduit");
	const cloneElt= document.importNode(templateElt.content,true);
    
    cloneElt.getElementById('photoProduit').setAttribute('src',article.imageUrl);
    cloneElt.getElementById('nomProduit').textContent = article.name;
    cloneElt.getElementById('descriptionProduit').textContent = article.description;
    prix  = (article.price/100).toFixed(2);
    cloneElt.getElementById('prixProduit').textContent = `Prix unitaire : ${prix} €`;
    const listeOptionsProduit = cloneElt.getElementById('listeOptionsProduit');
    for(let i=0;i<article.varnish.length;i++){
        const nvlOpt = new Option(article.varnish[i],article.varnish[i]);
        listeOptionsProduit[i] = nvlOpt;
    }
	quantite = cloneElt.getElementById('quantiteProduit').value;
	montant = prix*quantite;
	cloneElt.getElementById('montantTotal').textContent = `Montant total : ${montant} €`;
	cloneElt.getElementById("idProduit").textContent = 'Identifiant : ' + article._id;
	cloneElt.getElementById("idProduit").setAttribute('id',article._id);
	document.querySelector('body').appendChild(cloneElt);
}

function affichageMontant(){
	quantite = document.getElementById('quantiteProduit').value;
	montant = prix*quantite;
	document.getElementById('montantTotal').textContent = `Montant total ${montant} €`
}
document.querySelector('#body').addEventListener('change',affichageMontant);