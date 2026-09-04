// ==========================================
// IT SERVICE DASHBOARD
// ==========================================


// Récupérer les tickets sauvegardés
let tickets = JSON.parse(
    localStorage.getItem("tickets")
) || [];


// ==========================================
// CRÉER UN TICKET
// ==========================================

function addTicket() {

    const title =
        document.getElementById("title").value;

    const category =
        document.getElementById("category").value;

    const priority =
        document.getElementById("priority").value;


    // Vérifier que le titre n'est pas vide
    if (title.trim() === "") {

        alert(
            "Bitte beschreiben Sie das Problem."
        );

        return;
    }


    // Créer le ticket
    const ticket = {

        title: title,

        category: category,

        priority: priority,

        status: "Offen",

        createdAt: new Date().toLocaleString("de-DE")

    };


    // Ajouter le ticket
    tickets.push(ticket);


    // Sauvegarder
    saveTickets();


    // Vider le champ
    document.getElementById("title").value = "";


    // Actualiser l'application
    displayTickets();

    updateDashboard();
}


// ==========================================
// AFFICHER LES TICKETS
// ==========================================

function displayTickets() {

    const ticketList =
        document.getElementById("ticketList");


    const searchText =
        document
            .getElementById("search")
            .value
            .toLowerCase();


    const statusFilter =
        document.getElementById("statusFilter")
            .value;


    const priorityFilter =
        document.getElementById("priorityFilter")
            .value;


    // Filtrer les tickets
    const filteredTickets =
        tickets.filter(ticket => {

            const matchesSearch =
                ticket.title
                    .toLowerCase()
                    .includes(searchText);


            const matchesStatus =
                statusFilter === "Alle" ||
                ticket.status === statusFilter;


            const matchesPriority =
                priorityFilter === "Alle" ||
                ticket.priority === priorityFilter;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
            );

        });


    // Vider la liste
    ticketList.innerHTML = "";


    // Aucun résultat
    if (filteredTickets.length === 0) {

        ticketList.innerHTML = `
            <div class="empty-state">
                <p>Keine Tickets gefunden.</p>
            </div>
        `;

        return;
    }


    // Afficher chaque ticket
    filteredTickets.forEach(ticket => {

        const index =
            tickets.indexOf(ticket);


        const ticketElement =
            document.createElement("div");


        ticketElement.className = "ticket";


        // Classe de priorité
        let priorityClass =
            "priority-low";


        if (ticket.priority === "Hoch") {

            priorityClass =
                "priority-high";

        } else if (
            ticket.priority === "Mittel"
        ) {

            priorityClass =
                "priority-medium";
        }


        // Classe de statut
        let statusClass =
            "status-open";


        if (
            ticket.status === "In Bearbeitung"
        ) {

            statusClass =
                "status-progress";

        } else if (
            ticket.status === "Erledigt"
        ) {

            statusClass =
                "status-done";
        }


        ticketElement.innerHTML = `

            <h3>
                ${ticket.title}
            </h3>

            <p>
                Kategorie:
                <strong>
                    ${ticket.category}
                </strong>
            </p>

            <p>
                Priorität:
                <span class="badge ${priorityClass}">
                    ${ticket.priority}
                </span>
            </p>

            <p>
                Status:
                <span class="badge ${statusClass}">
                    ${ticket.status}
                </span>
            </p>

            <p>
                Erstellt am:
                ${ticket.createdAt || "Unbekannt"}
            </p>

            <button
                onclick="changeStatus(${index})"
            >
                Status ändern
            </button>

            <button
                onclick="deleteTicket(${index})"
            >
                Ticket löschen
            </button>

        `;


        ticketList.appendChild(ticketElement);

    });
}


// ==========================================
// CHANGER LE STATUT
// ==========================================

function changeStatus(index) {

    if (
        tickets[index].status === "Offen"
    ) {

        tickets[index].status =
            "In Bearbeitung";


    } else if (
        tickets[index].status === "In Bearbeitung"
    ) {

        tickets[index].status =
            "Erledigt";


    } else {

        tickets[index].status =
            "Offen";
    }


    // Sauvegarder
    saveTickets();


    // Actualiser
    displayTickets();

    updateDashboard();
}


// ==========================================
// SUPPRIMER UN TICKET
// ==========================================

function deleteTicket(index) {

    const confirmation =
        confirm(
            "Möchten Sie dieses Ticket wirklich löschen?"
        );


    if (!confirmation) {

        return;
    }


    // Supprimer
    tickets.splice(index, 1);


    // Sauvegarder
    saveTickets();


    // Actualiser
    displayTickets();

    updateDashboard();
}


// ==========================================
// SAUVEGARDER LES TICKETS
// ==========================================

function saveTickets() {

    localStorage.setItem(
        "tickets",
        JSON.stringify(tickets)
    );
}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

    const total =
        tickets.length;


    const open =
        tickets.filter(
            ticket =>
                ticket.status === "Offen"
        ).length;


    const progress =
        tickets.filter(
            ticket =>
                ticket.status === "In Bearbeitung"
        ).length;


    const done =
        tickets.filter(
            ticket =>
                ticket.status === "Erledigt"
        ).length;


    document.getElementById(
        "totalTickets"
    ).textContent = total;


    document.getElementById(
        "openTickets"
    ).textContent = open;


    document.getElementById(
        "progressTickets"
    ).textContent = progress;


    document.getElementById(
        "doneTickets"
    ).textContent = done;
}


// ==========================================
// INITIALISATION
// ==========================================

displayTickets();

updateDashboard();