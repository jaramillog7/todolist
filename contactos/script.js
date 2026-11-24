const contactForm = document.getElementById("contactForm");
const message = document.getElementById("message");
const contactsList = document.getElementById("contactsList");
const contactsSection = document.getElementById("contactsSection");

let contacts = [];
let operationPending = false;
let editingId = null;
const formMode = document.getElementById("formMode");
const addButton = document.getElementById("addButton");
const cancelEdit = document.getElementById("cancelEdit");

function resetEditing() {
    editingId = null;
    contactForm.reset();
    formMode.textContent = "Add contact";
    addButton.textContent = "ADD";
    cancelEdit.hidden = true;
}

cancelEdit.addEventListener("click", () => {
    if (operationPending) return;
    resetEditing();
    message.textContent = "";
    document.getElementById("firstName").focus();
});

function editContact(contact) {
    if (operationPending) return;
    editingId = contact.id;
    for (const field of ["firstName", "lastName", "phone", "city", "address"]) {
        document.getElementById(field).value = contact[field];
    }
    contactForm.querySelectorAll('input[name="gender"]').forEach(input => {
        input.checked = input.value === contact.gender;
    });
    formMode.textContent = `Editing contact: ${contact.firstName} ${contact.lastName}`;
    addButton.textContent = "SAVE CHANGES";
    cancelEdit.hidden = false;
    message.textContent = "";
    document.getElementById("firstName").focus();
}

async function requestContacts(route = "", method = "GET", data) {
    const response = await fetch(`/api/contactos${route}`, {
        method,
        ...(data === undefined ? {} : {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
    });
    if (!response.ok) throw new Error("Request failed");
    return response.status === 204 ? null : response.json();
}

async function runOperation(action) {
    if (operationPending) return;
    operationPending = true;
    message.textContent = "";
    const controls = [...document.querySelectorAll("input, button")];
    controls.forEach(control => { control.disabled = true; });
    try {
        await action();
    } catch (error) {
        message.textContent = "Could not confirm the operation with the server. Please try again.";
    } finally {
        controls.forEach(control => { control.disabled = false; });
        operationPending = false;
    }
}

function displayContacts() {
    contactsList.replaceChildren();
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

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.className = "edit-button";
        editButton.setAttribute("aria-label", `Edit contact: ${contact.firstName} ${contact.lastName}`);
        editButton.addEventListener("click", () => editContact(contact));
        card.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", () => {
            runOperation(async () => {
                await requestContacts(`/${encodeURIComponent(contact.id)}`, "DELETE");
                if (editingId === contact.id) resetEditing();
                contacts = contacts.filter(item => item.id !== contact.id);
                displayContacts();
            });
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
        !["Female", "Male"].includes(newContact.gender)
    ) {
        message.textContent = "Please complete all fields.";
        return;
    }

    runOperation(async () => {
        const id = editingId;
        const savedContact = await requestContacts(id ? `/${encodeURIComponent(id)}` : "", id ? "PUT" : "POST", newContact);
        if (id) {
            contacts = contacts.map(contact => contact.id === id ? savedContact : contact);
        } else {
            contacts.push(savedContact);
        }
        displayContacts();
        resetEditing();
        message.textContent = id ? "Contact updated successfully!" : "Contact added successfully!";
    });
});

displayContacts();
runOperation(async () => {
    const receivedContacts = await requestContacts();
    contacts = receivedContacts;
    displayContacts();
});
