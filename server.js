const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// Données en mémoire (à remplacer par une vraie base de données)
let doctors = [
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

let appointments = [];
let users = [];

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend fonctionnel' });
});

// Route des médecins
app.get('/api/doctors', (req, res) => {
  try {
    const { search, specialty, city } = req.query;
    let filteredDoctors = [...doctors];
    
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm) ||
        doctor.specialty.toLowerCase().includes(searchTerm)
      );
    }
    
    if (specialty) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.specialty === specialty
      );
    }
    
    if (city) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.city === city
      );
    }
    
    res.json(filteredDoctors);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route d'inscription
app.post('/api/register', (req, res) => {
  try {
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
      password, // ⚠️ En production, utiliser bcrypt
      role,
      created_at: new Date().toISOString()
    };
    
    users.push(newUser);
    res.status(201).json({ 
      message: 'Inscription réussie', 
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

// Route de connexion
app.post('/api/login', (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

// Route de création de rendez-vous
app.post('/api/appointments', (req, res) => {
  try {
    const { doctor_id, patient_name, patient_phone, appointment_date, appointment_time } = req.body;
    
    if (!doctor_id || !patient_name || !patient_phone || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    
    const doctor = doctors.find(d => d.id === parseInt(doctor_id));
    if (!doctor) {
      return res.status(404).json({ error: 'Médecin non trouvé' });
    }
    
    const newAppointment = {
      id: appointments.length + 1,
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
    res.status(500).json({ error: 'Erreur lors de la création du rendez-vous' });
  }
});

// Démarrage du serveur - CONFIGURATION RENDER
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});