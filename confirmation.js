const recupDataUrl = location.search;
const recupParametres = new URLSearchParams(recupDataUrl);
const refCommande = recupParametres.get('id');
const prenomClient = infosClient[0];
const nomClient = infosClient[1];
const mailClient = infosClient[2];

if(typeof(infosClient[0]) == 'undefined'){
    alert('Merci de votre visite. Vous allez être redirigé vers la page d\'accueil de notre site');
    window.location.href = `index.html`;
}else{
    document.getElementById('messageOrinoco').innerText = `Merci ${prenomClient} ${nomClient} pour votre commande.
    Votre commande porte la référence n°${refCommande}.
    Un email de confirmation vous a été envoyé à l'adresse suivante :
    ${mailClient}`;    
}

localStorage.removeItem('panierOrinoco');
localStorage.removeItem('clientOrinoco');