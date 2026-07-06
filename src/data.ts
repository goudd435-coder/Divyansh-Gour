import { GymService, MembershipPlan, Trainer, Testimonial, FaqItem, GalleryItem } from './types';

export const SERVICES: GymService[] = [
  {
    id: 1,
    title: 'Personal Training',
    description: 'Work 1-on-1 with certified trainers to build a customized routine tailored specifically to your body type, goals, and schedule.',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',
    features: ['Customized meal plan', 'Weekly progress review', '1-on-1 coaching', 'Form & technique guidance']
  },
  {
    id: 2,
    title: 'Muscle Gain',
    description: 'High-intensity hypertrophic workouts focused on progressive overload, heavy compound lifts, and nutritional tracking.',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop',
    features: ['Strength benchmarking', 'Hypertrophy programs', 'Supplements guidance', 'Body composition tracking']
  },
  {
    id: 3,
    title: 'Weight Loss',
    description: 'High calorie-burning HIIT workouts combined with specialized metabolic diet planning to shed fat rapidly while keeping muscle.',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    features: ['Caloric deficit planning', 'HIIT & circuit training', 'Cardio interval routines', 'Daily habits checklist']
  },
  {
    id: 4,
    title: 'CrossFit',
    description: 'Functional high-intensity training involving Olympic lifting, gymnastics, kettlebells, and metabolic conditioning in a supportive team environment.',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    features: ['Workout of the Day (WOD)', 'Olympic barbell training', 'Agility & speed circuits', 'Community challenges']
  },
  {
    id: 5,
    title: 'Cardio & Stamina',
    description: 'Build robust lung capacity, lower resting heart rate, and enhance stamina with top-tier treadmills, air bikes, and rowing machines.',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop',
    features: ['VO2 max tracking', 'Endurance routines', 'Heart-rate zone training', 'Rowing & cycling clinics']
  },
  {
    id: 6,
    title: 'Yoga & Flexibility',
    description: 'Improve balance, core strength, mental clarity, and somatic muscle recovery with experienced yoga and flexibility coaches.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
    features: ['Vinyasa & Hatha flows', 'Breathing exercises', 'Joint mobility routines', 'Somatic recovery sessions']
  }
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 1,
    name: 'Monthly',
    price: '₹1,499',
    originalPrice: '₹1,999',
    features: [
      'Full Gym Access',
      'Locker & Shower Access',
      'Free Fitness Assessment',
      'General Trainer Support'
    ],
    popular: false
  },
  {
    id: 2,
    name: 'Quarterly',
    price: '₹3,499',
    originalPrice: '₹5,999',
    savings: 'Save 41%',
    features: [
      'Full Gym Access',
      'Locker & Shower Access',
      '2 Personal Trainer Sessions',
      'Customized Diet Consultation',
      'Priority Support & BMI Analysis'
    ],
    popular: true
  },
  {
    id: 3,
    name: 'Yearly',
    price: '₹9,999',
    originalPrice: '₹17,999',
    savings: 'Save 44%',
    features: [
      'Full Gym & Cardio Access',
      'Locker & Dedicated Shower Access',
      '8 Personal Trainer Sessions',
      'Monthly Diet Chart Upgrades',
      'Full Body Assessment (Monthly)',
      '1 Complimentary Guest Pass/Month',
      'Access to special Zumba/Yoga clinics'
    ],
    popular: false
  }
];

export const TRAINERS: Trainer[] = [
  {
    id: 1,
    name: 'Shyam Rajput',
    role: 'Head Trainer & Founder',
    experience: '8+ Years',
    specialization: ['Bodybuilding', 'Strength Training', 'Dietetics'],
    imageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=600&auto=format&fit=crop',
    rating: 4.9
  },
  {
    id: 2,
    name: 'Vikram Singh',
    role: 'CrossFit Coach',
    experience: '5+ Years',
    specialization: ['HIIT', 'Functional Movements', 'Kettlebell'],
    imageUrl: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=600&auto=format&fit=crop',
    rating: 4.8
  },
  {
    id: 3,
    name: 'Nisha Verma',
    role: 'Yoga & Pilates Specialist',
    experience: '6+ Years',
    specialization: ['Asanas', 'Flexibility Training', 'Pranayama'],
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
    rating: 4.9
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    category: 'interior',
    title: 'Modern Front Façade',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 2,
    category: 'equipment',
    title: 'Preacher Curl Station',
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 3,
    category: 'interior',
    title: 'Cardio and Spin Zone',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 4,
    category: 'workout',
    title: 'Deadlift & Squat Racks',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 5,
    category: 'transformation',
    title: 'Rajeev’s 6-Month Transformation',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 6,
    category: 'workout',
    title: 'Heavy Dumbbell Station',
    imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?q=80&w=1000&auto=format&fit=crop'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Rajeev Sharma',
    role: 'Software Engineer',
    feedback: 'Royal Fitness Club completely changed my perspective on fitness. Shyam Sir guided my form and diet perfectly. I lost 18kg in 6 months while building significant lean muscle.',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    transformation: {
      before: 'Before: 94 kg (Inactive, constant lower back pain)',
      after: 'After: 76 kg (Atheletic, fully active, pain-free)'
    }
  },
  {
    id: 2,
    name: 'Priyanka Joshi',
    role: 'Teacher',
    feedback: 'I joined the Yoga and Cardio program. The wooden floor studio is always clean and serene. The instructors are incredibly polite and push you to improve your flexibility safely every session!',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Amit Patel',
    role: 'Business Owner',
    feedback: 'Royal Fitness Club is hands-down the best gym in Sarangpur. Excellent heavy equipment, clean lockers, energetic crowd, and Shyam Rajput Sir is always helpful. Highly recommended!',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  }
];

export const FAQS: FaqItem[] = [
  {
    id: 1,
    question: 'What are the gym operating hours?',
    answer: 'We are open Monday to Saturday. Morning Batch: 5:00 AM - 10:00 AM. Evening Batch: 4:00 PM - 9:00 PM. Sundays are closed for maintenance.'
  },
  {
    id: 2,
    question: 'Are general trainers included in standard memberships?',
    answer: 'Yes! Our certified general trainers are always available on the floor to assist you with machine setups, exercises, spot-lifting, and general posture feedback.'
  },
  {
    id: 3,
    question: 'Do you offer a free trial before registration?',
    answer: 'Absolutely! We offer a 1-day complimentary guest pass for residents of Sarangpur. Contact us on WhatsApp or fill out the membership form to schedule yours.'
  },
  {
    id: 4,
    question: 'Do you provide dietary and nutrition charts?',
    answer: 'Yes! Our Quarterly and Yearly membership packages include personalized monthly diet plans, body fat composition analysis, and calorie tracking guides.'
  },
  {
    id: 5,
    question: 'What is your refund policy?',
    answer: 'Memberships are non-refundable but can be paused up to 15 days for Quarterly plans and 45 days for Yearly plans in case of emergency or medical reasons.'
  }
];
