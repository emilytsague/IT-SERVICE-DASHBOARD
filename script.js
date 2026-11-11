// ==========================================
// IT SERVICE DASHBOARD
// ==========================================


// Gespeicherte Tickets aus dem lokalen Browserspeicher laden
let tickets = JSON.parse(
    localStorage.getItem("tickets")
) || [];


// ==========================================
// TICKET ERSTELLEN
// ==========================================

function addTicket() {

    const title =
        document.getElementById("title").value;

    const category =
        document.getElementById("category").value;

    const priority =
        document.getElementById("priority").value;


    // Prüfen, ob das Titelfeld ausgefüllt ist
    if (title.trim() === "") {

        alert(
            "Bitte beschreiben Sie das Problem."
        );

        return;
    }


    // Neues Ticketobjekt erstellen
    const ticket = {

        title: title,

        category: category,

        priority: priority,

        status: "Offen",

        createdAt: new Date().toLocaleString("de-DE")

    };


    // Ticket zur Liste hinzufügen
    tickets.push(ticket);


    // Tickets im lokalen Browserspeicher speichern
    saveTickets();


    // Eingabefeld zurücksetzen
    document.getElementById("title").value = "";


    // Ticketliste und Dashboard aktualisieren
    displayTickets();

    updateDashboard();
}


// ==========================================
// TICKETS ANZEIGEN
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


    // Tickets anhand der Such- und Filterkriterien auswählen
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


    // Bisherige Ticketanzeige leeren
    ticketList.innerHTML = "";


    // Hinweis anzeigen, wenn keine Tickets gefunden wurden
    if (filteredTickets.length === 0) {

        ticketList.innerHTML = `
            <div class="empty-state">
                <p>Keine Tickets gefunden.</p>
            </div>
        `;

        return;
    }


    // Gefilterte Tickets einzeln darstellen
    filteredTickets.forEach(ticket => {

        const index =
            tickets.indexOf(ticket);


        const ticketElement =
            document.createElement("div");


        ticketElement.className = "ticket";


        // CSS-Klasse entsprechend der Priorität zuweisen
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


        // CSS-Klasse entsprechend dem Bearbeitungsstatus zuweisen
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
// TICKETSTATUS ÄNDERN
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


    // Tickets im lokalen Browserspeicher speichern
    saveTickets();


    // Ticketliste und Dashboard aktualisieren
    displayTickets();

    updateDashboard();
}


// ==========================================
// TICKET LÖSCHEN
// ==========================================

function deleteTicket(index) {

    const confirmation =
        confirm(
            "Möchten Sie dieses Ticket wirklich löschen?"
        );


    if (!confirmation) {

        return;
    }


    // Ausgewähltes Ticket entfernen
    tickets.splice(index, 1);


    // Tickets im lokalen Browserspeicher speichern
    saveTickets();


    // Ticketliste und Dashboard aktualisieren
    displayTickets();

    updateDashboard();
}


// ==========================================
// TICKETS SPEICHERN
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
// INITIALISIERUNG
// ==========================================

displayTickets();

updateDashboard();