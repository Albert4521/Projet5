let panierPersonnel = document.getElementById("panier");
let tableauIdProduits = [];
let supprimer = document.getElementById('supprimer');
supprimer.addEventListener('click',supprimerArticles)
function ajoutProduitsPanier(){
    for(article of panierStorage){
        let nouvelleLigne = panierPersonnel.insertRow(-1);
        let celluleChoix = nouvelleLigne.insertCell(-1);
        let caseCocher = document.createElement('input');
        caseCocher.setAttribute('type','checkbox');
        caseCocher.setAttribute('name','selectionProduits');
        celluleChoix.appendChild(caseCocher);
        let celluleReference = nouvelleLigne.insertCell(-1);
        celluleReference.innerText = article[0]
        let celluleProduit = nouvelleLigne.insertCell(-1);   
        celluleProduit.innerText = article[1] ;
        let cellulePrixUnitaire = nouvelleLigne.insertCell(-1);
        cellulePrixUnitaire.innerText = article[3] +' €';
        let celluleQuantite = nouvelleLigne.insertCell(-1);
        celluleQuantite.innerText = article[2];
        let celluleMontant = nouvelleLigne.insertCell(-1);
        celluleMontant.innerText = parseFloat(cellulePrixUnitaire.innerText)*parseInt(celluleQuantite.innerText) + '€';
    }
}
function majMontantPanier(){
    let montant = 0;
    for(let i=1; i<panierPersonnel.rows.length;i++){
        let sousTotal = parseInt(panierPersonnel.getElementsByTagName('tr')[i].cells[5].innerText);
        montant += sousTotal;
    }
    document.getElementById('montantPanier').innerText = 'Montant total de votre panier : ' + montant + ' €';
}

function supprimerArticles(){
    let selection = document.getElementsByName('selectionProduits');
    let tableauSelection = []
    //Je parcours tout le panier pour enrgistrer les articles cochés dans "tableauSlection"
    for(let i=0;i<selection.length;i++){
        if(selection[i].checked == true){
            tableauSelection.push(panierPersonnel.rows[i+1].cells[1].innerHTML);
        }
    }
    //Tant qu'il y aura des articles dans "tableauSlection" je parcours toutes les lignes du panier pour retrouver
    // et supprimer le premier article se trouvant dans mon "tableauSlection"
    while(tableauSelection.length>0){
        for(let i=0 ; i<panierStorage.length ; i++){
            if(panierStorage[i][0] == tableauSelection[0]){
                panierStorage.splice(i,1);
                tableauSelection.shift();
                break
            }else{
                continue
            }
        }
    }
    //J'actualise l'espace mémoire LocalStorage d du navigateur alloué à mon panie
    localStorage.setItem('panierOrinoco',JSON.stringify(panierStorage));

    //Je réactualise le tableau récapitulant l'ensemble de mon panier : 

    //Au préalable je supprime toutes les lignes de mon tableau représentant l'ancien panier
    // sauf la ligne de titre
    while(panierPersonnel.rows.length>1){
        panierPersonnel.deleteRow(1);
    }
    //Je créé un nouveau tableau représeant le nouveau panier
    ajoutProduitsPanier()
    //J'actualise l'affichage du montant total de mon panier
    majMontantPanier();
}

ajoutProduitsPanier();
majMontantPanier()

function produitsID(tableau){
    tableau.length = 0;
    for(article of panierStorage){
        tableau.push(article[0]);
    }
    return tableau
}
document.getElementById('firstName');

document.getElementById('formulaireContact').addEventListener('submit',function(evt){
    evt.preventDefault();
    const contact = {
        firstName : document.getElementById('firstName').value,
        lastName : document.getElementById('lastName').value,
        address : document.getElementById('adress').value,
        city : document.getElementById('city').value,
        email : document.getElementById('email').value,
        productID : produitsID(tableauIdProduits)
    }
    if(contact.firstName.trim().length == 0){
        alert('Le champs Prénom est vide')
        return
    }
    console.log(contact.productID);
})