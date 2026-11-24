const contactForm = document.getElementById("contactForm");
const message = document.getElementById("message");
const contactsList = document.getElementById("contactsList");
const contactsSection = document.getElementById("contactsSection");

const STORAGE_KEY = "contact_list_data";

let contacts = [];

try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    contacts = Array.isArray(saved) ? saved : [];
} catch (error) {
    contacts = [];
}

function saveContacts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

function displayContacts() {
    contactsList.innerHTML = "";
    contactsSection.hidden = contacts.length === 0;

    contacts.forEach((contact) => {
        const card = document.createElement("div");
        card.className = "contact-card";

        const fields = [
            ["Name", contact.firstName],
            ["Lastname", contact.lastName],
            ["Phone", contact.phone],
            ["City", contact.city],
            ["Address", contact.address],
            ["Gender", contact.gender]
        ];

        fields.forEach(([label, value]) => {
            const paragraph = document.createElement("p");
            paragraph.textContent = `${label}: ${value}`;
            card.appendChild(paragraph);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", () => {
            contacts = contacts.filter(item => item.id !== contact.id);
            saveContacts();
            displayContacts();
        });

        card.appendChild(deleteButton);
        contactsList.appendChild(card);
    });
}

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const selectedGender = document.querySelector(
        'input[name="gender"]:checked'
    );

    const newContact = {
        id: crypto.randomUUID(),
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        city: document.getElementById("city").value.trim(),
        address: document.getElementById("address").value.trim(),
        gender: selectedGender ? selectedGender.value : ""
    };

    if (
        !newContact.firstName ||
        !newContact.lastName ||
        !newContact.phone ||
        !newContact.city ||
        !newContact.address ||
        !newContact.gender
    ) {
        message.textContent = "Please complete all fields.";
        return;
    }

    contacts.push(newContact);
    saveContacts();
    displayContacts();

    contactForm.reset();
    message.textContent = "Contact added successfully!";
});

displayContacts();