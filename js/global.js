let panierStorage = localStorage.getItem('panierOrinoco');
let infosClient = localStorage.getItem('clientOrinoco');

(function (){
	if(panierStorage == null){
		panierStorage = [];
	}else{
		panierStorage = JSON.parse(panierStorage);
	}
	if(infosClient == null){
		infosClient = [];
	}else{
		infosClient = JSON.parse(infosClient);
	}
})()