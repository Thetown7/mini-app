
// ==================== INIZIALIZZAZIONE TELEGRAM ====================
// Connette l'app web a Telegram
let tg = window.Telegram.WebApp;
tg.expand(); // Espande l'app a schermo intero

// ==================== VARIABILI GLOBALI ====================
// Array per memorizzare i prodotti nel carrello
let carrello = [];
// Totale del carrello
let totaleCarrello = 0;

// ==================== FUNZIONE ORDINA PRODOTTO ====================
// Viene chiamata quando l'utente clicca su "Ordina"
function ordinaProdotto(nome, prezzo) {
    // Aggiungi il prodotto al carrello
    carrello.push({
        nome: nome,
        prezzo: prezzo
    });
    
    // Aggiorna il totale
    totaleCarrello += prezzo;
    
    // Aggiorna l'interfaccia grafica
    aggiornaCarrello();
    
    // Mostra messaggio di conferma
    mostraConferma(nome, prezzo);
    
    // Invia i dati a Telegram (al bot)
    tg.sendData(JSON.stringify({
        azione: 'ordine',
        prodotto: nome,
        prezzo: prezzo,
        carrello: carrello,
        totale: totaleCarrello
    }));
}

// ==================== AGGIORNA CARRELLO ====================
// Aggiorna l'indicatore del carrello in basso a destra
function aggiornaCarrello() {
    const cartInfo = document.getElementById('cartInfo');
    const cartCount = document.getElementById('cartCount');
    
    if (carrello.length > 0) {
        // Se ci sono prodotti, mostra l'indicatore
        cartInfo.style.display = 'block';
        cartCount.textContent = carrello.length;
    } else {
        // Se il carrello è vuoto, nascondi l'indicatore
        cartInfo.style.display = 'none';
    }
}

// ==================== MOSTRA CONFERMA ====================
// Crea una notifica temporanea quando si aggiunge un prodotto
function mostraConferma(nome, prezzo) {
    // Crea un elemento div per la notifica
    const notifica = document.createElement('div');
    notifica.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    
    // Testo della notifica
    notifica.innerHTML = `✅ ${nome} aggiunto al carrello!`;
    
    // Aggiungi la notifica alla pagina
    document.body.appendChild(notifica);
    
    // Rimuovi la notifica dopo 3 secondi
    setTimeout(() => {
        notifica.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            document.body.removeChild(notifica);
        }, 300);
    }, 3000);
}

// ==================== ANIMAZIONI CSS ====================
// Aggiunge le animazioni per le notifiche
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== INIZIALIZZAZIONE FINALE ====================
// Dice a Telegram che l'app è pronta
tg.ready();


// ==================== CLICK AUTOMATICO SU TUTTE LE CARD ====================
// Si attiva automaticamente quando la pagina è caricata
document.addEventListener('DOMContentLoaded', function() {
    // Trova tutte le card prodotto
    const productCards = document.querySelectorAll('.product');
    
    // Aggiungi il click a ogni card automaticamente
    productCards.forEach(function(card) {
        // Trova il nome del prodotto dentro la card
        const nomeElement = card.querySelector('.product-name');
        const nome = nomeElement.textContent.trim();
        
        // Trova il tipo (premium, top, ecc.)
        const badgeElement = card.querySelector('.frozen-badge');
        const tipo = badgeElement ? badgeElement.textContent.trim() : 'standard';
        
        // Aggiungi il click alla card
        card.addEventListener('click', function() {
            apriDettaglio(nome, tipo);
        });
        
        // Cambia il cursore per far capire che è cliccabile
        card.style.cursor = 'pointer';
    });
});
// ==================== APRI DETTAGLIO PRODOTTO ====================
function apriDettaglio(nome, tipo) {
    // Salva i dati del prodotto per la pagina dettagli
    const prodottoData = {
        nome: nome,
        tipo: tipo,
        timestamp: Date.now()
    };
    
    sessionStorage.setItem('prodottoSelezionato', JSON.stringify(prodottoData));
    
    // Vai alla pagina dettagli
    window.location.href = 'product-detail.html';
}