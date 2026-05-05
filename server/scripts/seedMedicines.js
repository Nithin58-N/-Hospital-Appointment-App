/**
 * Seed Medicine Database
 * Adds common medicines to the database
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Medicine = require('../src/models/Medicine');

const medicines = [
  // Antibiotics
  {
    name: 'Azithromycin',
    genericName: 'Azithromycin',
    category: 'Antibiotic',
    manufacturer: 'Various',
    strength: ['250mg', '500mg'],
    form: 'tablet',
    commonDosages: ['1 tablet', '2 tablets'],
    commonFrequencies: ['Once daily', 'Twice daily'],
    commonDurations: ['3 days', '5 days', '7 days'],
    sideEffects: ['Nausea', 'Diarrhea', 'Stomach pain'],
    contraindications: ['Liver disease', 'Heart rhythm problems'],
    description: 'Antibiotic used to treat bacterial infections'
  },
  {
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    category: 'Antibiotic',
    manufacturer: 'Various',
    strength: ['250mg', '500mg'],
    form: 'capsule',
    commonDosages: ['1 capsule', '2 capsules'],
    commonFrequencies: ['Three times daily'],
    commonDurations: ['5 days', '7 days', '10 days'],
    sideEffects: ['Nausea', 'Diarrhea', 'Rash'],
    contraindications: ['Penicillin allergy'],
    description: 'Penicillin antibiotic for bacterial infections'
  },
  {
    name: 'Ciprofloxacin',
    genericName: 'Ciprofloxacin',
    category: 'Antibiotic',
    manufacturer: 'Various',
    strength: ['250mg', '500mg', '750mg'],
    form: 'tablet',
    commonDosages: ['1 tablet'],
    commonFrequencies: ['Twice daily'],
    commonDurations: ['7 days', '10 days', '14 days'],
    sideEffects: ['Nausea', 'Diarrhea', 'Dizziness'],
    contraindications: ['Tendon problems', 'Myasthenia gravis'],
    description: 'Fluoroquinolone antibiotic'
  },
  
  // Painkillers
  {
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    category: 'Painkiller',
    manufacturer: 'Various',
    strength: ['500mg', '650mg', '1000mg'],
    form: 'tablet',
    commonDosages: ['1 tablet', '2 tablets'],
    commonFrequencies: ['Three times daily', 'Four times daily', 'As needed'],
    commonDurations: ['3 days', '5 days', '7 days'],
    sideEffects: ['Rare at normal doses'],
    contraindications: ['Severe liver disease'],
    description: 'Pain reliever and fever reducer'
  },
  {
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    category: 'Painkiller',
    manufacturer: 'Various',
    strength: ['200mg', '400mg', '600mg'],
    form: 'tablet',
    commonDosages: ['1 tablet', '2 tablets'],
    commonFrequencies: ['Three times daily', 'As needed'],
    commonDurations: ['3 days', '5 days', '7 days'],
    sideEffects: ['Stomach upset', 'Heartburn', 'Dizziness'],
    contraindications: ['Stomach ulcers', 'Kidney disease'],
    description: 'NSAID for pain and inflammation'
  },
  {
    name: 'Diclofenac',
    genericName: 'Diclofenac',
    category: 'Painkiller',
    manufacturer: 'Various',
    strength: ['50mg', '75mg', '100mg'],
    form: 'tablet',
    commonDosages: ['1 tablet'],
    commonFrequencies: ['Twice daily', 'Three times daily'],
    commonDurations: ['5 days', '7 days', '10 days'],
    sideEffects: ['Stomach upset', 'Headache', 'Dizziness'],
    contraindications: ['Heart disease', 'Stomach ulcers'],
    description: 'NSAID for pain and inflammation'
  },
  
  // Antihistamines
  {
    name: 'Cetirizine',
    genericName: 'Cetirizine',
    category: 'Antihistamine',
    manufacturer: 'Various',
    strength: ['5mg', '10mg'],
    form: 'tablet',
    commonDosages: ['1 tablet'],
    commonFrequencies: ['Once daily at bedtime'],
    commonDurations: ['5 days', '7 days', '14 days'],
    sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue'],
    contraindications: ['Severe kidney disease'],
    description: 'Antihistamine for allergies'
  },
  {
    name: 'Loratadine',
    genericName: 'Loratadine',
    category: 'Antihistamine',
    manufacturer: 'Various',
    strength: ['10mg'],
    form: 'tablet',
    commonDosages: ['1 tablet'],
    commonFrequencies: ['Once daily'],
    commonDurations: ['7 days', '14 days', '30 days'],
    sideEffects: ['Headache', 'Dry mouth', 'Fatigue'],
    contraindications: ['Severe liver disease'],
    description: 'Non-drowsy antihistamine'
  },
  
  // Antacids
  {
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    category: 'Antacid',
    manufacturer: 'Various',
    strength: ['20mg', '40mg'],
    form: 'capsule',
    commonDosages: ['1 capsule'],
    commonFrequencies: ['Once daily before breakfast'],
    commonDurations: ['14 days', '30 days', '60 days'],
    sideEffects: ['Headache', 'Nausea', 'Diarrhea'],
    contraindications: ['Liver disease'],
    description: 'Proton pump inhibitor for acid reflux'
  },
  {
    name: 'Ranitidine',
    genericName: 'Ranitidine',
    category: 'Antacid',
    manufacturer: 'Various',
    strength: ['150mg', '300mg'],
    form: 'tablet',
    commonDosages: ['1 tablet'],
    commonFrequencies: ['Twice daily', 'Once daily at bedtime'],
    commonDurations: ['14 days', '30 days'],
    sideEffects: ['Headache', 'Constipation', 'Diarrhea'],
    contraindications: ['Kidney disease'],
    description: 'H2 blocker for acid reflux'
  },
  
  // Respiratory
  {
    name: 'Salbutamol',
    genericName: 'Albuterol',
    category: 'Respiratory',
    manufacturer: 'Various',
    strength: ['100mcg per puff'],
    form: 'inhaler',
    commonDosages: ['2 puffs'],
    commonFrequencies: ['As needed', 'Four times daily'],
    commonDurations: ['30 days', '60 days'],
    sideEffects: ['Tremor', 'Headache', 'Rapid heartbeat'],
    contraindications: ['Heart rhythm problems'],
    description: 'Bronchodilator for asthma'
  },
  {
    name: 'Montelukast',
    genericName: 'Montelukast',
    category: 'Respiratory',
    manufacturer: 'Various',
    strength: ['4mg', '5mg', '10mg'],
    form: 'tablet',
    commonDosages: ['1 tablet'],
    commonFrequencies: ['Once daily at bedtime'],
    commonDurations: ['30 days', '60 days', '90 days'],
    sideEffects: ['Headache', 'Stomach pain', 'Fatigue'],
    contraindications: ['Liver disease'],
    description: 'Leukotriene receptor antagonist for asthma'
  },
  
  // Vitamins
  {
    name: 'Vitamin D3',
    genericName: 'Cholecalciferol',
    category: 'Vitamin',
    manufacturer: 'Various',
    strength: ['1000 IU', '2000 IU', '5000 IU'],
    form: 'tablet',
    commonDosages: ['1 tablet'],
    commonFrequencies: ['Once daily'],
    commonDurations: ['30 days', '60 days', '90 days'],
    sideEffects: ['Rare at normal doses'],
    contraindications: ['Hypercalcemia'],
    description: 'Vitamin D supplement'
  },
  {
    name: 'Multivitamin',
    genericName: 'Multivitamin',
    category: 'Vitamin',
    manufacturer: 'Various',
    strength: ['Standard'],
    form: 'tablet',
    commonDosages: ['1 tablet'],
    commonFrequencies: ['Once daily'],
    commonDurations: ['30 days', '60 days', '90 days'],
    sideEffects: ['Stomach upset'],
    contraindications: ['Iron overload disorders'],
    description: 'Daily multivitamin supplement'
  },
  
  // Diabetes
  {
    name: 'Metformin',
    genericName: 'Metformin',
    category: 'Diabetes',
    manufacturer: 'Various',
    strength: ['500mg', '850mg', '1000mg'],
    form: 'tablet',
    commonDosages: ['1 tablet', '2 tablets'],
    commonFrequencies: ['Twice daily', 'Three times daily'],
    commonDurations: ['30 days', '60 days', '90 days'],
    sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset'],
    contraindications: ['Kidney disease', 'Liver disease'],
    description: 'Oral diabetes medication'
  },
  
  // Cardiovascular
  {
    name: 'Atorvastatin',
    genericName: 'Atorvastatin',
    category: 'Cardiovascular',
    manufacturer: 'Various',
    strength: ['10mg', '20mg', '40mg', '80mg'],
    form: 'tablet',
    commonDosages: ['1 tablet'],
    commonFrequencies: ['Once daily at bedtime'],
    commonDurations: ['30 days', '60 days', '90 days'],
    sideEffects: ['Muscle pain', 'Headache', 'Nausea'],
    contraindications: ['Liver disease', 'Pregnancy'],
    description: 'Statin for cholesterol'
  },
  {
    name: 'Amlodipine',
    genericName: 'Amlodipine',
    category: 'Cardiovascular',
    manufacturer: 'Various',
    strength: ['2.5mg', '5mg', '10mg'],
    form: 'tablet',
    commonDosages: ['1 tablet'],
    commonFrequencies: ['Once daily'],
    commonDurations: ['30 days', '60 days', '90 days'],
    sideEffects: ['Swelling', 'Fatigue', 'Flushing'],
    contraindications: ['Severe low blood pressure'],
    description: 'Calcium channel blocker for hypertension'
  },
  
  // Syrups
  {
    name: 'Cough Syrup',
    genericName: 'Dextromethorphan',
    category: 'Respiratory',
    manufacturer: 'Various',
    strength: ['10mg/5ml', '15mg/5ml'],
    form: 'syrup',
    commonDosages: ['5ml', '10ml'],
    commonFrequencies: ['Three times daily', 'Four times daily'],
    commonDurations: ['5 days', '7 days'],
    sideEffects: ['Drowsiness', 'Dizziness', 'Nausea'],
    contraindications: ['MAO inhibitor use'],
    description: 'Cough suppressant syrup'
  },
  {
    name: 'Paracetamol Syrup',
    genericName: 'Acetaminophen',
    category: 'Painkiller',
    manufacturer: 'Various',
    strength: ['120mg/5ml', '250mg/5ml'],
    form: 'syrup',
    commonDosages: ['5ml', '10ml', '15ml'],
    commonFrequencies: ['Three times daily', 'Four times daily'],
    commonDurations: ['3 days', '5 days', '7 days'],
    sideEffects: ['Rare at normal doses'],
    contraindications: ['Severe liver disease'],
    description: 'Pain reliever and fever reducer for children'
  },
  {
    name: 'Amoxicillin Suspension',
    genericName: 'Amoxicillin',
    category: 'Antibiotic',
    manufacturer: 'Various',
    strength: ['125mg/5ml', '250mg/5ml'],
    form: 'syrup',
    commonDosages: ['5ml', '10ml'],
    commonFrequencies: ['Three times daily'],
    commonDurations: ['5 days', '7 days', '10 days'],
    sideEffects: ['Nausea', 'Diarrhea', 'Rash'],
    contraindications: ['Penicillin allergy'],
    description: 'Antibiotic suspension for bacterial infections'
  },
  {
    name: 'Cetirizine Syrup',
    genericName: 'Cetirizine',
    category: 'Antihistamine',
    manufacturer: 'Various',
    strength: ['5mg/5ml'],
    form: 'syrup',
    commonDosages: ['5ml', '10ml'],
    commonFrequencies: ['Once daily at bedtime', 'Twice daily'],
    commonDurations: ['5 days', '7 days', '14 days'],
    sideEffects: ['Drowsiness', 'Dry mouth', 'Fatigue'],
    contraindications: ['Severe kidney disease'],
    description: 'Antihistamine syrup for allergies'
  },
  
  // Creams and Ointments
  {
    name: 'Hydrocortisone Cream',
    genericName: 'Hydrocortisone',
    category: 'Other',
    manufacturer: 'Various',
    strength: ['1%', '2.5%'],
    form: 'cream',
    commonDosages: [],
    commonFrequencies: ['Twice daily', 'Three times daily'],
    commonDurations: ['5 days', '7 days', '14 days'],
    sideEffects: ['Skin irritation', 'Burning sensation'],
    contraindications: ['Viral skin infections', 'Fungal infections'],
    description: 'Topical corticosteroid for skin inflammation'
  },
  {
    name: 'Clotrimazole Cream',
    genericName: 'Clotrimazole',
    category: 'Antifungal',
    manufacturer: 'Various',
    strength: ['1%'],
    form: 'cream',
    commonDosages: [],
    commonFrequencies: ['Twice daily', 'Three times daily'],
    commonDurations: ['7 days', '14 days', '21 days'],
    sideEffects: ['Mild burning', 'Itching', 'Redness'],
    contraindications: ['Hypersensitivity to clotrimazole'],
    description: 'Antifungal cream for skin infections'
  },
  {
    name: 'Mupirocin Ointment',
    genericName: 'Mupirocin',
    category: 'Antibiotic',
    manufacturer: 'Various',
    strength: ['2%'],
    form: 'ointment',
    commonDosages: [],
    commonFrequencies: ['Three times daily'],
    commonDurations: ['5 days', '7 days', '10 days'],
    sideEffects: ['Burning', 'Stinging', 'Itching'],
    contraindications: ['Hypersensitivity to mupirocin'],
    description: 'Topical antibiotic for skin infections'
  },
  {
    name: 'Diclofenac Gel',
    genericName: 'Diclofenac',
    category: 'Painkiller',
    manufacturer: 'Various',
    strength: ['1%'],
    form: 'gel',
    commonDosages: [],
    commonFrequencies: ['Three times daily', 'Four times daily'],
    commonDurations: ['7 days', '14 days', '21 days'],
    sideEffects: ['Skin irritation', 'Redness', 'Itching'],
    contraindications: ['Open wounds', 'Broken skin'],
    description: 'Topical NSAID gel for pain and inflammation'
  },
  {
    name: 'Betamethasone Cream',
    genericName: 'Betamethasone',
    category: 'Other',
    manufacturer: 'Various',
    strength: ['0.05%', '0.1%'],
    form: 'cream',
    commonDosages: [],
    commonFrequencies: ['Once daily', 'Twice daily'],
    commonDurations: ['7 days', '14 days'],
    sideEffects: ['Skin thinning', 'Burning', 'Itching'],
    contraindications: ['Viral skin infections', 'Acne'],
    description: 'Potent topical corticosteroid for severe skin conditions'
  }
];

const seedMedicines = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🗑️  Clearing existing medicines...');
    await Medicine.deleteMany({});
    console.log('✅ Cleared\n');

    console.log('🌱 Seeding medicines...');
    const created = await Medicine.insertMany(medicines);
    console.log(`✅ Created ${created.length} medicines\n`);

    console.log('📋 Medicine Categories:');
    const categories = [...new Set(medicines.map(m => m.category))];
    categories.forEach(cat => {
      const count = medicines.filter(m => m.category === cat).length;
      console.log(`   - ${cat}: ${count} medicines`);
    });

    console.log('\n✅ Medicine database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding medicines:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run seed
seedMedicines();
