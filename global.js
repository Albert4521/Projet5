let panier = localStorage.getItem('panierOrinoco');

(function (){
	if(panier == null){
		panier = [];
	}else{
		panier = JSON.parse(panier);
	}
})()