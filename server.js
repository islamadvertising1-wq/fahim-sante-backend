const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Données des médecins (à remplacer par une vraie base de données plus tard)
const doctors = [
  {
    id: 1,
    name: "Dr. Ahmed Benali",
    arabic_name: "د. أحمد بن علي",
    specialty: "Cardiologue",
    arabic_specialty: "أخصائي أمراض القلب",
    city: "Alger",
    address: "15 Rue Didouche Mourad, Alger Centre",
    arabic_address: "15 شارع ديدوش مراد، وسط الجزائر",
    rating: 4.8,
    reviews_count: 124
  },
  {
    id: 2,
    name: "Dr. Fatima Zohra",
    arabic_name: "د. فاطمة الزهراء",
    specialty: "Pédiatre",
    arabic_specialty: "طبيبة أطفال",
    city: "Oran",
    address: "8 Boulevard de la Soummam, Oran",
    arabic_address: "8 شارع سومام، وهران",
    rating: 4.9,
    reviews_count: 203
  },
  {
    id: 3,
    name: "Dr. Karim Messaoudi",
    arabic_name: "د. كريم مسعودي",
    specialty: "Dermatologue",
    arabic_specialty: "أخصائي أمراض الجلدية",
    city: "Constantine",
    address: "22 Rue Larbi Ben M'hidi, Constantine",
    arabic_address: "22 شارع العربي بن مهيدي، قسنطينة",
    rating: 4.7,
    reviews_count: 89
  }
];

// Stockage temporaire des rendez-vous
let appointments = [];

// Route de santé (pour tester que le backend fonctionne)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend Fahim Santé fonctionnel',
    timestamp: new Date().toISOString()
  });
});

// Route pour obtenir tous les médecins
app.get('/api/doctors', (req, res) => {
  try {
    res.json(doctors);
  } catch (error) {
    console.error('Erreur dans /api/doctors:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour obtenir un médecin par ID
app.get('/api/doctors/:id', (req, res) => {
  try {
    const doctorId = parseInt(req.params.id);
    const doctor = doctors.find(d => d.id === doctorId);
    
    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404).json({ error: 'Médecin non trouvé' });
    }
  } catch (error) {
    console.error('Erreur dans /api/doctors/:id:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour créer un rendez-vous
app.post('/api/appointments', (req, res) => {
  try {
    const { doctor_id, patient_name, patient_phone, appointment_date, appointment_time } = req.body;
    
    // Validation basique
    if (!doctor_id || !patient_name || !patient_phone || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    
    // Vérifier si le médecin existe
    const doctor = doctors.find(d => d.id === parseInt(doctor_id));
    if (!doctor) {
      return res.status(404).json({ error: 'Médecin non trouvé' });
    }
    
    const newAppointment = {
      id: appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1,
      doctor_id: parseInt(doctor_id),
      patient_name,
      patient_phone,
      appointment_date,
      appointment_time,
      status: 'confirmed',
      created_at: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    res.status(201).json(newAppointment);
    
  } catch (error) {
    console.error('Erreur dans /api/appointments:', error);
    res.status(500).json({ error: 'Erreur lors de la création du rendez-vous' });
  }
});

// Route pour obtenir tous les rendez-vous
app.get('/api/appointments', (req, res) => {
  try {
    res.json(appointments);
  } catch (error) {
    console.error('Erreur dans /api/appointments:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});
// Stockage temporaire des utilisateurs
let users = [];

// Route d'inscription
app.post('/api/register', (req, res) => {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }
    
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password, // ⚠️ En production, utilise bcrypt pour hasher
        role,
        created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    res.status(201).json({ 
        message: 'Inscription réussie', 
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } 
    });
});

// Route de connexion
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    res.json({ 
        message: 'Connexion réussie', 
        user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
});
// Démarrer le serveur - CONFIGURATION RENDER CORRECTE
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Serveur Fahim Santé démarré sur le port ${PORT}`);
  console.log(`📋 Routes disponibles:`);
  console.log(`   GET  /health`);
  console.log(`   GET  /api/doctors`);
  console.log(`   GET  /api/doctors/:id`);
  console.log(`   POST /api/appointments`);
  console.log(`   GET  /api/appointments`);
});