const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

const doctors = [
  {
    id: 1,
    name: "Dr. Ahmed Benali",
    specialty: "Cardiologue",
    city: "Alger",
    address: "15 Rue Didouche Mourad, Alger Centre",
    rating: 4.8,
    reviews_count: 124
  }
];

app.use(cors());
app.use(express.json());

app.get('/api/doctors', (req, res) => {
  res.json(doctors);
});

app.listen(PORT, () => {
  console.log('✅ Serveur démarré sur http://localhost:3000');
});
// Stockage en mémoire des rendez-vous
let appointments = [];

// Route pour créer un rendez-vous
app.post('/api/appointments', (req, res) => {
    const { doctor_id, patient_name, patient_phone, appointment_date, appointment_time } = req.body;
    
    if (!doctor_id || !patient_name || !patient_phone || !appointment_date || !appointment_time) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    
    const newAppointment = {
        id: appointments.length + 1,
        doctor_id: parseInt(doctor_id),
        patient_name,
        patient_phone,
        appointment_date,
        appointment_time,
        status: 'confirmed'
    };
    
    appointments.push(newAppointment);
    res.status(201).json(newAppointment);
});

// Route pour obtenir tous les rendez-vous (optionnel)
app.get('/api/appointments', (req, res) => {
    res.json(appointments);
});