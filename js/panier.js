let panierPersonnel = document.getElementById("panier");
let messagePanierVide = document.getElementById("messagePanierVide");
let tableauIdProduits = [];
let supprimer = document.getElementById('supprimer');
supprimer.addEventListener('click',supprimerArticlesPanier);
let formulaire = document.getElementById('formulaireContact');

/*Affichage ou non du panier du client selon qu'il contienne ou non des articles */
affichagePagePanier();
document.getElementById('formulaireContact').addEventListener('submit',validationCommande);

function affichagePagePanier(){
    while(panierPersonnel.rows.length>1){
        panierPersonnel.deleteRow(1);
    }
    if(panierStorage.length == 0){
        while(panierPersonnel.rows.length>0){
            panierPersonnel.deleteRow(0);
        }
        document.querySelector('h1').style.display = 'none';
        document.getElementById('montantPanier').innerText ='';
        panierPersonnel.style.border = 0;
        supprimer.style.display = 'none';
        messagePanierVide.textContent ='Votre panier est vide ! Laissez-vous tenter par nos produits';
        messagePanierVide.style.display ='block';
        messagePanierVide.style.top = '8rem';
        formulaire.style.display = 'none';
    }else{
        ajoutProduitTableau();
        majMontantTotal()
    }    
}

function ajoutProduitTableau(){
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
        cellulePrixUnitaire.innerText = article[3] +' ???';
        let celluleQuantite = nouvelleLigne.insertCell(-1);
        celluleQuantite.innerText = article[2];
        let celluleMontant = nouvelleLigne.insertCell(-1);
        celluleMontant.innerText = parseFloat(cellulePrixUnitaire.innerText)*parseInt(celluleQuantite.innerText) + '???';
    }
}
function majMontantTotal(){
    let montant = 0;
    for(let i=1; i<panierPersonnel.rows.length;i++){
        let sousTotal = parseInt(panierPersonnel.getElementsByTagName('tr')[i].cells[5].innerText);
        montant += sousTotal;
    }
    document.getElementById('montantPanier').innerText = 'TOTAL : ' + montant + ' ???';
}

function supprimerArticlesPanier(){
    let selection = document.getElementsByName('selectionProduits');
    let tableauSelection = []
    //On r??cup??re les articles coch??s pour les stocker dans "tableauSlection"
    for(let i=0;i<selection.length;i++){
        if(selection[i].checked == true){
            tableauSelection.push(panierPersonnel.rows[i+1].cells[1].innerHTML);
        }
    }
    //Tant qu'il y aura des articles dans "tableauSlection" je parcours toutes les lignes du tableau 
    //repr??sentant le panier pour retrouveret supprimer le premier article se trouvant dans "tableauSlection"
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
    //J'actualise l'espace m??moire LocalStorage du navigateur allou?? ?? mon panier
    localStorage.setItem('panierOrinoco',JSON.stringify(panierStorage));
    affichagePagePanier();    
}

function produitsID(tableau){
    tableau.length = 0;
    for(article of panierStorage){
        tableau.push(article[0]);
    }
    return tableau
}

async function validationCommande(evt){
    /*On ??vite que le formulaire soit vid?? une fois le bouton submit cliqu?? */
    evt.preventDefault();
    /*On cr???? notre objet contact reprenant les 5 donn??es du formulaire de contact ainsi que le tableau des ID des produits command??s*/
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
    const motifMail= /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const motifTexte = /^[A-Za-z????????]+$/
    const motifAdresse = /([0-9])*([a-zA-Z])+/
    /*On v??rifie les donn??es saisies par l'utilisateur avant l'envoi de celles-ci */
    if(panierStorage.length == 0){
        alert('Votre panier est vide. S??lectionnez au minimum un produit.');
        return
    }
    if(envoi.contact.firstName.trim().length == 0 || motifTexte.test(envoi.contact.firstName.trim()) == false){
        alert('Le champs Pr??nom est invalide');
        return
    }
    if(envoi.contact.lastName.trim().length == 0 || motifTexte.test(envoi.contact.lastName.trim()) == false){
        alert('Le champs Nom est invalide');
        return
    }
    if(envoi.contact.address.trim().length == 0 || motifAdresse.test(envoi.contact.address.trim()) == false){
        alert('Le champs adresse est invalide');
        return
    }
    if(envoi.contact.city.trim().length == 0 || motifTexte.test(envoi.contact.city.trim()) == false){
        alert('Le champs ville est invalide');
        return
    }
    if(motifMail.test(envoi.contact.email.trim()) == false){
        alert('Adresse mail invalide');
        return
    }
    /*On proc??de ?? l'envoi des donn??es */
    const reponseBrute = await fetch('http://localhost:3000/api/furniture/order',{
        method : 'POST',
        headers : {
            'Content-Type':'application/json'
        },
        body : JSON.stringify(envoi)
        });
    const content = await reponseBrute.json(reponseBrute);
    infosClient =[];
    infosClient.push(envoi.contact.firstName,envoi.contact.lastName,envoi.contact.email);
    localStorage.setItem('clientOrinoco',JSON.stringify(infosClient));

    window.location.href = `../pages/confirmation.html?id=${content['orderId']}`;
}