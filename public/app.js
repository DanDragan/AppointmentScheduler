const form = document.getElementById('appointment-form');
const lastNameInput = document.getElementById('last-name');
const firstNameInput = document.getElementById('first-name');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const appointmentsList = document.getElementById('appointments');

let appointments = []; // Store appointments locally

// Set min date to today's date
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today); // Restrict past dates
}

document.addEventListener("DOMContentLoaded", function() {
    // Initialize Flatpickr on the date input field
    flatpickr("#date", {
        locale: "ro",  // Set locale to Romanian
        dateFormat: "Y-m-d",  // Format the date as YYYY-MM-DD
        placeholder: "Selectează zi",  // Custom placeholder text
        minDate: "today",  // Disable past dates
    });
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const lastName = lastNameInput.value;
    const firstName = firstNameInput.value;
    const name = `${lastName} ${firstName}`;
    const date = dateInput.value;
    const time = timeInput.value;

    const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, date, time }),
    });

    const data = await response.json();
    if (response.ok) {
        alert('Appointment booked!');
        loadAppointments();
    } else {
        alert(data.message);
    }
});

async function loadAppointments() {
    const response = await fetch('/api/appointments');
    const data = await response.json();
    appointments = data; // Update local appointments

    appointmentsList.innerHTML = '';
    data.forEach(appointment => {
        const li = document.createElement('li');
        li.innerHTML = `${appointment.name} - ${appointment.date} ora ${appointment.time}
            <div class="del-btn">
                <button onclick="deleteAppointment('${appointment._id}')">
                    Delete
                </button>
            </div>`;
        appointmentsList.appendChild(li);
    });

    updateAvailableTimes(); // Update time slots
}

async function deleteAppointment(id) {
    const response = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    if (response.ok) {
        alert('Appointment deleted');
        loadAppointments();
    } else {
        alert('Error deleting appointment');
    }
}

function updateAvailableTimes() {
    const selectedDate = dateInput.value;

    const timeSlots = [
        "9:00", "10:00", "11:00", "12:00", "13:00",
        "14:00", "15:00", "16:00", "17:00", "18:00",
        "19:00", "20:00"
    ];

    timeInput.innerHTML = '<option value="">Selectează ora</option>'; // Reset options

    timeSlots.forEach(time => {
        const isBooked = appointments.some(
            (appointment) => appointment.date === selectedDate && appointment.time === time
        );

        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;

        if (isBooked) {
            option.className = 'booked';
            option.disabled = true;
        } else {
            option.className = 'available';
        }

        timeInput.appendChild(option);
    });
}

dateInput.addEventListener('change', updateAvailableTimes);

setMinDate(); // Restrict past dates on page load
loadAppointments(); // Initial load
