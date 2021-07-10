let panierPersonnel = document.getElementById("panier");
let messagePanierVide = document.getElementById("messagePanierVide").textContent;
let tableauIdProduits = [];
let supprimer = document.getElementById('supprimer');
supprimer.addEventListener('click',supprimerArticles)

/*Affichage ou non du panier du client selon qu'il contienne ou non des articles */
affichagePagePanier();

function affichagePagePanier(){
    if(panierStorage.length == 0){
        document.querySelector('h1').style.display = 'none';
        while(panierPersonnel.rows.length>0){
            panierPersonnel.deleteRow(0);
        }
        document.getElementById('montantPanier').innerText ='';
        supprimer.style.display = 'none';
        messagePanierVide.innerText ='Votre panier est vide ! Laissez-vous tenter par nos produits';
    }else{
        ajoutProduitsPanier();
        majMontantPanier()
    }    
}

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
    affichagePagePanier();    
    /*//Je réactualise le tableau récapitulant l'ensemble de mon panier : 

    //Au préalable je supprime toutes les lignes de mon tableau représentant l'ancien panier
    // sauf la ligne de titre
    while(panierPersonnel.rows.length>1){
        panierPersonnel.deleteRow(1);
    }
    //Je créé un nouveau tableau représeant le nouveau panier
    ajoutProduitsPanier()
    //J'actualise l'affichage du montant total de mon panier
    majMontantPanier();*/
}

function produitsID(tableau){
    tableau.length = 0;
    for(article of panierStorage){
        tableau.push(article[0]);
    }
    return tableau
}


/*Envoi des données de la commande client */
document.getElementById('formulaireContact').addEventListener('submit',async function(evt){
    /*On évite que le formulaire soit vidé une fois le bouton submit cliqué */
    evt.preventDefault();
    /*On créé notre objet contact reprenant les 5 données du formulaire de contact ainsi que le tableau des ID des produits commandés*/
    const envoi = {
        contact : {
            firstName : document.getElementById('firstName').value,
            lastName : document.getElementById('lastName').value,
            address : document.getElementById('adress').value,
            city : document.getElementById('city').value,
            email : document.getElementById('email').value,    
        },
        products : produitsID(tableauIdProduits)
    }
    /*On vérifie les données saisies par l'utilisateur avant l'envoi de celles-ci */
    if(envoi.contact.firstName.trim().length == 0){
        alert('Le champs Prénom est vide')
        return
    }
    if(envoi.contact.lastName.trim().length == 0){
        alert('Le champs Prénom est vide')
        return
    }
    if(envoi.contact.address.trim().length == 0){
        alert('Le champs Prénom est vide')
        return
    }
    if(envoi.contact.city.trim().length == 0){
        alert('Le champs Prénom est vide')
        return
    }
    /*On procède à l'envoi des données */
    const reponseBrute = await fetch('http://localhost:3000/api/furniture/order',{
        method : 'POST',
        headers : {
            'Content-Type':'application/json'
        },
        body : JSON.stringify(envoi)
        });
    const content = await reponseBrute.json(reponseBrute);
    console.log(content.order_id);
})