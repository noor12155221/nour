
const apiUrl = "https://68271b1d397e48c913189bdc.mockapi.io/V1/MedicalCenter";
let editingId = null;

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, loading patients...");
    loadPatients();
});

function loadPatients() {
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector("#patientsTable tbody");
            tbody.innerHTML = "";
            data.forEach(patient => {
                const date = new Date(patient.createdAt || Date.now()).toLocaleDateString();
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${patient.id}</td>
                    <td>${patient.name}</td>
                    <td>${patient.age}</td>
                    <td>${patient.diagnosis}</td>
                    <td>${date}</td>
                    <td>
                        <button onclick="editPatient('${patient.id}', '${patient.name}', ${patient.age}, '${patient.diagnosis}')">Update</button>
                        <button onclick="deletePatient('${patient.id}')">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(err => console.error("Failed to fetch patients:", err));
}

function showAddForm() {
    editingId = null;
    document.getElementById("formTitle").innerText = "Add Patient";
    document.getElementById("patientForm").reset();
    document.getElementById("formContainer").classList.remove("hidden");
}

function hideForm() {
    document.getElementById("formContainer").classList.add("hidden");
}

function handleFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const age = parseInt(document.getElementById("age").value);
    const diagnosis = document.getElementById("diagnosis").value;

    const patient = { name, age, diagnosis, createdAt: new Date().toISOString() };

    if (editingId) {
        fetch(`${apiUrl}/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patient)
        }).then(() => {
            console.log("Patient updated");
            loadPatients();
            hideForm();
        }).catch(err => console.error("Update failed:", err));
    } else {
        fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patient)
        }).then(() => {
            console.log("Patient added");
            loadPatients();
            hideForm();
        }).catch(err => console.error("Addition failed:", err));
    }
}

function editPatient(id, name, age, diagnosis) {
    editingId = id;
    document.getElementById("name").value = name;
    document.getElementById("age").value = age;
    document.getElementById("diagnosis").value = diagnosis;
    document.getElementById("formTitle").innerText = "Edit Patient";
    document.getElementById("formContainer").classList.remove("hidden");
}

function deletePatient(id) {
    fetch(`${apiUrl}/${id}`, { method: "DELETE" })
        .then(() => {
            console.log("Patient deleted");
            loadPatients();
        })
        .catch(err => console.error("Deletion failed:", err));
}
