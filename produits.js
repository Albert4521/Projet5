const recupDataUrl = location.search;
const recupParametres = new URLSearchParams(recupDataUrl);
const produitID = recupParametres.get('id');
let prix = 0;
let quantite = 0;
let montant = 0;
let nomProduitChoisi ='';
let article ;

document.getElementById('Ajouter').addEventListener('click',ajoutProduit);
document.querySelector('#body').addEventListener('change',affichageMontant);

(async function (){
	article = await obtenirArticle();
	affichageArticle();
	nomProduitChoisi = article.name;
})()

function obtenirArticle(){
	return fetch(`http://localhost:3000/api/furniture/${produitID}`)
	.then(function(reponse){
		return reponse.json()
	})
	.then(function(donnees){
		return donnees
	})
	.catch(function(error){
		alert(error)
	})
}

function affichageArticle(){
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

function ajoutProduit(){
	let refProduit = produitID;
	let produit = nomProduitChoisi;
	let qtte = parseInt(quantite);
	let prixProduit =parseFloat(prix);
	let articlePanier = [refProduit,produit,qtte,prixProduit];
	if(panierStorage.length == 0){
		panierStorage.push(articlePanier);
	}else{
		const index = panierStorage.findIndex(function(element){
			return element[1] == produit
		})
		if(index != -1){
			panierStorage[index][2]+=qtte;
		}else{
			panierStorage.push(articlePanier);	
		}
	}
	localStorage.setItem('panierOrinoco',JSON.stringify(panierStorage));
}