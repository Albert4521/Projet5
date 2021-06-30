let panierStorage = localStorage.getItem('panierOrinoco');

(function (){
	if(panierStorage == null){
		panierStorage = [];
	}else{
		panierStorage = JSON.parse(panierStorage);
	}
})()