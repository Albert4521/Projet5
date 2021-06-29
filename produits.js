const recupDataUrl = location.search;
const recupParametres = new URLSearchParams(recupDataUrl);
const produitID = recupParametres.get('id');
let prix = 0;
let quantite = 0;
let montant = 0;
let nomProduitChoisi ='';
let article ;

document.getElementById('Ajouter').addEventListener('click',ajoutProduit);

(async function (){
	article = await getArticle();
	displayArticle();
	nomProduitChoisi = await recupNomProduit();
})()

function getArticle(){
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

function displayArticle(){
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



function recupNomProduit(){
	const getNomProduit = new Promise(function(resolve,reject){
		let nomProduit = document.getElementById('nomProduit').innerHTML;
		if(typeof nomProduit !== 'undefined'){
			resolve(nomProduit)
		}else{
			reject('Une erreur est survenue')
		}
	})
	return getNomProduit.then(function(succes){
		return succes
	}).catch(function(){
		console.log('erreur')
	})	
}


function ajoutProduit(){
	let refProduit = produitID;
	let produit = nomProduitChoisi;
	let qtte = parseInt(quantite);
	let prixProduit =parseFloat(prix);
	let articlePanier = [refProduit,produit,qtte,prixProduit];
	if(panier.length == 0){
		panier.push(articlePanier);
	}else{
		const index = panier.findIndex(function(element){
			return element[1] == produit
		})
		if(index != -1){
			panier[index][2]+=qtte;
		}else{
			panier.push(articlePanier);	
		}
	}
	localStorage.setItem('panierOrinoco',JSON.stringify(panier))	
	ajoutProduitPanier();	
}