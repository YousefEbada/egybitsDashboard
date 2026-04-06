// ───────────────────────────────────────────────────────────
//  EgyBits — Central Data Store
//  All site content lives here. Admin dashboard writes to this.
// ───────────────────────────────────────────────────────────

export interface Project {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  desc: string;
  descAr: string;
  tech: string[];
  color: string;
  mainImage?: string;
  galleryImages?: string[];
  projectLink?: string;
  githubUrl?: string;
  client?: string;
  clientAr?: string;
  duration?: string;
  challenge?: string;
  challengeAr?: string;
  solution?: string;
  solutionAr?: string;
  results?: string[];
  resultsAr?: string[];
  screenshots?: string[];
  featured?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  bio: string;
  bioAr: string;
  emoji: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  image?: string;
  skills?: string[];
  social?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  content: string;
  contentAr: string;
  company?: string;
  avatar?: string;
  text?: string;
  rating?: number;
  featured?: boolean;
  country: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  service?: string;
  date: string;
  read: boolean;
}

export interface Service {
  id?: string;
  _id?: string;
  icon: string;
  title: string;
  titleAr: string;
  desc: string;
  descAr: string;
  order?: number;
}

export interface SiteSettings {
  colors: {
    teal: string;
    tealLight: string;
    tealDark: string;
    navy: string;
    navyDark: string;
    navyDeeper: string;
  };
  defaultTheme: 'dark' | 'light';
  logoText: string;

  // Sections
  hero?: {
    badge?: string; badgeAr?: string;
    headline1?: string; headline1Ar?: string;
    headline2?: string; headline2Ar?: string;
    headline3?: string; headline3Ar?: string;
    subheadline?: string; subheadlineAr?: string;
    cta1?: string; cta1Ar?: string;
    cta2?: string; cta2Ar?: string;
  };
  marquee?: {
    items?: string[];
    itemsAr?: string[];
  };
  about?: {
    badge?: string; badgeAr?: string;
    headline?: string; headlineAr?: string;
    headlineAccent?: string; headlineAccentAr?: string;
    body?: string; bodyAr?: string;
    values?: Array<{ title: string; titleAr: string; desc: string; descAr: string }>;
  };
  services_general?: {
    badge?: string; badgeAr?: string;
    headline?: string; headlineAr?: string;
    headlineAccent?: string; headlineAccentAr?: string;
  };
  footer?: {
    tagline?: string; taglineAr?: string;
    copyright?: string; copyrightAr?: string;
    links?: Array<{ label: string; labelAr: string; url: string }>;
  };
}


// ───────────────────────────────────────────────────────────
//  Default Data
// ───────────────────────────────────────────────────────────

export const defaultProjects: Project[] = [
  {
    id: '1', slug: 'finflow',
    title: 'FinFlow Platform', titleAr: 'منصة FinFlow',
    category: 'FinTech · Web App', categoryAr: 'تقنية مالية · تطبيق ويب',
    desc: 'A real-time financial management SaaS for 50,000+ SMEs across MENA with AI-powered insights.',
    descAr: 'منصة SaaS لإدارة مالية بالوقت الفعلي لأكثر من 50,000 شركة صغيرة في منطقة MENA.',
    tech: ['Next.js', 'Golang', 'PostgreSQL', 'AWS'], color: '#00cfbf',
    client: 'FinFlow Inc.', clientAr: 'شركة FinFlow', duration: '8 months',
    challenge: 'The client needed to migrate 50,000+ SMEs from spreadsheets to a unified financial platform, handling real-time transactions, multi-currency support, and regulatory compliance across 6 MENA countries.',
    challengeAr: 'احتاج العميل إلى نقل أكثر من 50,000 شركة صغيرة من استخدام جداول البيانات إلى منصة مالية موحدة.',
    solution: 'We built a microservices architecture with event-driven data pipelines, deployed on AWS with multi-region failover. AI insights powered by a custom LSTM model trained on anonymized transaction data.',
    solutionAr: 'بنينا معمارية microservices مع pipelines بيانات مدفوعة بالأحداث، منشورة على AWS.',
    results: ['50,000 SMEs onboarded in 3 months', '99.99% uptime since launch', 'AI insights reduced bad debt by 34%', '$2M saved in operational costs annually'],
    resultsAr: ['تم إعداد 50,000 شركة صغيرة في 3 أشهر', 'تشغيل بدون انقطاع منذ الإطلاق', 'تحسن 34% في تقليل الديون المعدومة'],
    featured: true,
  },
  {
    id: '2', slug: 'mediconnect',
    title: 'MediConnect', titleAr: 'MediConnect',
    category: 'HealthTech · Mobile', categoryAr: 'تقنية صحية · جوال',
    desc: 'Telemedicine platform connecting 200+ doctors with patients across Egypt and KSA.',
    descAr: 'منصة طب عن بُعد تربط أكثر من 200 طبيب بالمرضى في مصر والسعودية.',
    tech: ['React Native', 'Node.js', 'MongoDB', 'WebRTC'], color: '#1e2e8a',
    client: 'MediHealth UAE', clientAr: 'MediHealth الإمارات', duration: '6 months',
    challenge: 'Building a HIPAA-compliant telemedicine platform with sub-500ms video latency, available in both Egypt and KSA where network conditions vary significantly.',
    challengeAr: 'بناء منصة طب عن بُعد متوافقة مع HIPAA مع كمون فيديو أقل من 500 مللي ثانية.',
    solution: 'Leveraged WebRTC with adaptive bitrate streaming and a custom signaling server. Built an offline-first mobile app with background sync for prescription management.',
    solutionAr: 'استخدمنا WebRTC مع بث معدل البت التكيفي وخادم إشارة مخصص.',
    results: ['200+ doctors onboarded', '150k+ consultations completed', '4.9/5 patient satisfaction', 'ISO 27001 certified'],
    resultsAr: ['أكثر من 200 طبيب', 'أكثر من 150,000 استشارة مكتملة', '4.9/5 رضا المرضى'],
    featured: true,
  },
  {
    id: '3', slug: 'logitrack',
    title: 'LogiTrack Pro', titleAr: 'LogiTrack Pro',
    category: 'Logistics · Enterprise', categoryAr: 'لوجستيات · مؤسسي',
    desc: 'End-to-end supply chain visibility platform processing 1M+ events per day.',
    descAr: 'منصة رؤية شاملة لسلسلة التوريد تعالج أكثر من مليون حدث يومياً.',
    tech: ['React', 'Kafka', 'Kubernetes', 'GCP'], color: '#00bfb3',
    client: 'LogiCorp KSA', clientAr: 'LogiCorp السعودية', duration: '12 months',
    challenge: 'Processing and visualizing 1M+ logistics events per day across 15 countries, with real-time anomaly detection and predictive ETAs.',
    challengeAr: 'معالجة وتصور أكثر من مليون حدث لوجستي يوميا عبر 15 دولة.',
    solution: 'Apache Kafka for event streaming, Kubernetes for auto-scaling, custom ML pipeline for ETA prediction with 94% accuracy.',
    solutionAr: 'Apache Kafka لبث الأحداث، Kubernetes للتوسع التلقائي، pipeline ML مخصص للتنبؤ.',
    results: ['1M+ events/day processed', '94% ETA prediction accuracy', '40% reduction in delayed shipments', '15 countries coverage'],
    resultsAr: ['معالجة أكثر من مليون حدث يومياً', 'دقة 94% في التنبؤ بمواعيد التسليم'],
    featured: true,
  },
  {
    id: '4', slug: 'eduverse',
    title: 'EduVerse', titleAr: 'EduVerse',
    category: 'EdTech · Platform', categoryAr: 'تقنية تعليمية · منصة',
    desc: 'Gamified e-learning platform with AI tutoring serving 300k+ students.',
    descAr: 'منصة تعلم إلكتروني تفاعلية بتعليم مدعوم بالذكاء الاصطناعي لأكثر من 300 ألف طالب.',
    tech: ['Vue.js', 'Python', 'TensorFlow', 'Azure'], color: '#3d52af',
    client: 'EduVerse Ltd.', clientAr: 'EduVerse', duration: '14 months',
    challenge: 'Creating a gamified learning platform that could personalize curriculum for 300k+ students with varying learning speeds, languages, and subject areas.',
    challengeAr: 'إنشاء منصة تعليمية تفاعلية يمكنها تخصيص المناهج لأكثر من 300,000 طالب.',
    solution: 'Adaptive learning engine using collaborative filtering and knowledge graphs. Gamification system with 50+ achievement types and real-time leaderboards.',
    solutionAr: 'محرك تعلم تكيفي باستخدام التصفية التعاونية ورسوم المعرفة.',
    results: ['300k+ active students', '87% course completion rate (vs 15% industry avg)', '3x engagement vs traditional LMS', 'Best EdTech Startup MENA 2024'],
    resultsAr: ['أكثر من 300,000 طالب نشط', 'معدل إتمام الدورات 87%'],
    featured: false,
  },
  {
    id: '5', slug: 'propsphere',
    title: 'PropSphere', titleAr: 'PropSphere',
    category: 'PropTech · Web', categoryAr: 'عقارات · ويب',
    desc: 'AI-powered real estate marketplace with 3D virtual tours and smart matching.',
    descAr: 'سوق عقاري بالذكاء الاصطناعي مع جولات افتراضية ثلاثية الأبعاد.',
    tech: ['Next.js', 'Three.js', 'FastAPI', 'Redis'], color: '#00cfbf',
    client: 'PropSphere Holdings', clientAr: 'PropSphere Holdings', duration: '10 months',
    challenge: 'Real estate buyers need to shortlist properties efficiently. 3D tours require high performance streaming while AI matching must understand subjective preferences.',
    challengeAr: 'يحتاج مشتري العقارات إلى ترتيب الممتلكات بكفاءة.',
    solution: 'Three.js WebGL renderer with progressive LOD for smooth 3D tours. Preference learning model using implicit feedback from browsing patterns.',
    solutionAr: 'معالج WebGL مع LOD تدريجي لجولات ثلاثية الأبعاد سلسة.',
    results: ['500k+ properties listed', '3x faster property shortlisting', '25% higher conversion vs competitors', '40% of users complete virtual tours'],
    resultsAr: ['أكثر من 500,000 عقار مدرج', 'تسريع 3x في اختيار العقارات'],
    featured: false,
  },
  {
    id: '6', slug: 'retailpulse',
    title: 'RetailPulse', titleAr: 'RetailPulse',
    category: 'Retail · Analytics', categoryAr: 'تجزئة · تحليلات',
    desc: 'Computer vision retail analytics system for shelf monitoring and customer behavior.',
    descAr: 'نظام تحليل تجزئة برؤية الحاسوب لمراقبة الرفوف وسلوك العملاء.',
    tech: ['Python', 'OpenCV', 'TensorFlow', 'React'], color: '#1e2e8a',
    client: 'RetailGroup Egypt', clientAr: 'RetailGroup مصر', duration: '9 months',
    challenge: 'Brick-and-mortar retailers lacked real-time insight into product placement effectiveness, customer flow, and shelf stockout events.',
    challengeAr: 'كان التجار يفتقرون إلى رؤى فورية حول فعالية وضع المنتجات.',
    solution: 'Multi-camera CV system with edge processing for real-time shelf analytics. Custom CNN for product recognition with 96% accuracy, heatmap generation for customer flow.',
    solutionAr: 'نظام رؤية حاسوبية متعدد الكاميرات مع معالجة طرفية للتحليل الفوري.',
    results: ['96% product recognition accuracy', '18% increase in sales through placement optimization', '35% reduction in stockout events', 'Deployed across 50+ stores'],
    resultsAr: ['دقة تعرف 96% على المنتجات', 'زيادة 18% في المبيعات'],
    featured: false,
  },
];

export const defaultTeam: TeamMember[] = [
  { id: '1', name: 'Ahmed Khalil', nameAr: 'أحمد خليل', role: 'CEO & Co-Founder', roleAr: 'الرئيس التنفيذي والمؤسس المشارك', bio: 'Full-stack architect with 12+ years in enterprise software.', bioAr: 'مهندس برمجيات كامل الطيف بخبرة +12 عاماً.', emoji: '👨‍💼' },
  { id: '2', name: 'Sara Mostafa', nameAr: 'سارة مصطفى', role: 'CTO & Co-Founder', roleAr: 'المدير التقني والمؤسسة المشاركة', bio: 'ML engineer and distributed systems specialist.', bioAr: 'متخصصة في تعلم الآلة والأنظمة الموزعة.', emoji: '👩‍💻' },
  { id: '3', name: 'Omar Hassan', nameAr: 'عمر حسان', role: 'Head of Design', roleAr: 'رئيس قسم التصميم', bio: 'Award-winning UX designer with roots in fine arts.', bioAr: 'مصمم UX حائز على جوائز بجذور في الفنون الجميلة.', emoji: '🎨' },
  { id: '4', name: 'Nour Abdelaziz', nameAr: 'نور عبدالعزيز', role: 'Lead Backend Engineer', roleAr: 'كبير مهندسي الواجهة الخلفية', bio: 'Golang evangelist and cloud infrastructure expert.', bioAr: 'خبير Golang ومختص بالبنية التحتية السحابية.', emoji: '⚡' },
  { id: '5', name: 'Youssef Ramadan', nameAr: 'يوسف رمضان', role: 'Head of Mobile', roleAr: 'رئيس قسم الجوال', bio: 'React Native & Swift specialist since 2013.', bioAr: 'متخصص React Native وSwift منذ 2013.', emoji: '📱' },
  { id: '6', name: 'Mariam Samir', nameAr: 'مريم سمير', role: 'AI/ML Lead', roleAr: 'رئيسة قسم الذكاء الاصطناعي', bio: 'PhD in Computer Vision, published researcher in NLP.', bioAr: 'دكتوراه في رؤية الحاسوب وباحثة منشورة في معالجة اللغة.', emoji: '🤖' },
];

export const defaultTestimonials: Testimonial[] = [
  { id: '1', name: 'Karim El-Masry', nameAr: 'كريم المصري', role: 'CEO, FinFlow Inc.', roleAr: 'الرئيس التنفيذي، FinFlow', content: "EgyBits transformed our vision into a platform that now serves 50k businesses. Their technical depth is unmatched in the region.", contentAr: 'حوّلت إيجي بيتس رؤيتنا إلى منصة تخدم الآن 50 ألف شركة. عمقهم التقني لا مثيل له في المنطقة.', rating: 5, country: '🇪🇬' },
  { id: '2', name: 'Sarah Johnson', nameAr: 'سارة جونسون', role: 'CTO, MediHealth UAE', roleAr: 'المدير التقني، MediHealth الإمارات', content: 'The team delivered a flawless telemedicine platform under an aggressive timeline. Quality and communication were exceptional.', contentAr: 'قدّم الفريق منصة طب عن بُعد مثالية في جدول زمني صارم.', rating: 5, country: '🇦🇪' },
  { id: '3', name: 'Mohammed Al-Rashid', nameAr: 'محمد الراشد', role: 'VP Product, LogiCorp KSA', roleAr: 'نائب رئيس المنتج، LogiCorp السعودية', content: "I've worked with agencies worldwide. EgyBits stands among the very best — proactive, brilliant, and deeply invested in outcomes.", contentAr: 'عملت مع وكالات حول العالم. إيجي بيتس تقف في مصاف الأفضل.', rating: 5, country: '🇸🇦' },
  { id: '4', name: 'Aisha Brennan', nameAr: 'عائشة برينان', role: 'Founder, EduVerse', roleAr: 'مؤسسة، EduVerse', content: "From concept to 300k users in 18 months. EgyBits wasn't just a vendor — they were a strategic partner.", contentAr: 'من الفكرة إلى 300 ألف مستخدم في 18 شهراً.', rating: 5, country: '🇮🇪' },
];

export const defaultSettings: SiteSettings = {
  colors: {
    teal: '#00cfbf', tealLight: '#4dded4', tealDark: '#008f87',
    navy: '#1e2e8a', navyDark: '#060c50', navyDeeper: '#030820',
  },
  defaultTheme: 'dark',
  logoText: 'EgyBits',
};

export const defaultContacts: ContactMessage[] = [];
