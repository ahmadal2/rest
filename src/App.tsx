
import React, { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Components
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import AdminPanel from './pages/AdminPanel'
import LoadingScreen from './components/LoadingScreen'
import RestaurantVideoIntro from './components/RestaurantVideoIntro'

// Types
interface Dessert {
  id: string
  name: { en: string; ar: string; de: string }
  description: { en: string; ar: string; de: string }
  price: number
  image: string
  category: string
  featured?: boolean
  rating?: number
  time?: string
  ingredients?: string[]
  allergens?: string[]
  spicy?: boolean
}

interface Admin {
  id: string
  email: string
  password: string
  role: 'main' | 'secondary'
  name: string
  number?: number
}

interface SiteSettings {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    cardBg: string
    buttonPrimary: string
    buttonSecondary: string
    navbarBg: string
    footerBg: string
    footerText: string
    footerAccent: string
    footerIcon: string
    heroBg: string
    headerBg: string
  }
  images: {
    heroBackground: string
    aboutImage: string
    logoUrl: string
    favicon: string
  }
  content: {
    siteName: { en: string; ar: string; de: string }
    heroTitle: { en: string; ar: string; de: string }
    heroSubtitle: { en: string; ar: string; de: string }
    aboutTitle: { en: string; ar: string; de: string }
    aboutDescription: { en: string; ar: string; de: string }
    footerDescription: { en: string; ar: string; de: string }
    contactInfo: {
      address: string
      phone: string
      email: string
    }
    // Navigation
    nav: {
      home: { en: string; ar: string; de: string }
      about: { en: string; ar: string; de: string }
      menu: { en: string; ar: string; de: string }
      testimonials: { en: string; ar: string; de: string }
      contact: { en: string; ar: string; de: string }
      admin: { en: string; ar: string; de: string }
    }
    // Hero Section
    hero: {
      cta: {
        reservation: { en: string; ar: string; de: string }
        location: { en: string; ar: string; de: string }
      }
      stats: {
        years: { en: string; ar: string; de: string }
        customers: { en: string; ar: string; de: string }
        rating: { en: string; ar: string; de: string }
      }
    }
    // Menu Section
    menu: {
      title: { en: string; ar: string; de: string }
      description: { en: string; ar: string; de: string }
      categories: {
        featured: { en: string; ar: string; de: string }
        appetizers: { en: string; ar: string; de: string }
        mains: { en: string; ar: string; de: string }
        desserts: { en: string; ar: string; de: string }
      }
      addToOrder: { en: string; ar: string; de: string }
      viewFullMenu: { en: string; ar: string; de: string }
    }
    // Testimonials Section
    testimonials: {
      title: { en: string; ar: string; de: string }
      description: { en: string; ar: string; de: string }
      reviews: Array<{
        role: { en: string; ar: string; de: string }
        content: { en: string; ar: string; de: string }
      }>
      stats: {
        rating: { en: string; ar: string; de: string }
        reviews: { en: string; ar: string; de: string }
        satisfaction: { en: string; ar: string; de: string }
      }
    }
    // Contact Section
    contact: {
      title: { en: string; ar: string; de: string }
      description: { en: string; ar: string; de: string }
      info: {
        address: { en: string; ar: string; de: string }
        phone: { en: string; ar: string; de: string }
        email: { en: string; ar: string; de: string }
        hours: { en: string; ar: string; de: string }
      }
      form: {
        name: { en: string; ar: string; de: string }
        email: { en: string; ar: string; de: string }
        subject: { en: string; ar: string; de: string }
        message: { en: string; ar: string; de: string }
        send: { en: string; ar: string; de: string }
        namePlaceholder: { en: string; ar: string; de: string }
        emailPlaceholder: { en: string; ar: string; de: string }
        subjectPlaceholder: { en: string; ar: string; de: string }
        messagePlaceholder: { en: string; ar: string; de: string }
      }
      reservation: {
        title: { en: string; ar: string; de: string }
        date: { en: string; ar: string; de: string }
        time: { en: string; ar: string; de: string }
        guests: { en: string; ar: string; de: string }
        name: { en: string; ar: string; de: string }
        phone: { en: string; ar: string; de: string }
        notes: { en: string; ar: string; de: string }
        button: { en: string; ar: string; de: string }
        confirm: { en: string; ar: string; de: string }
      }
    }
    // Footer
    footer: {
      description: { en: string; ar: string; de: string }
      quickLinks: { en: string; ar: string; de: string }
      contact: { en: string; ar: string; de: string }
      links: {
        about: { en: string; ar: string; de: string }
        menu: { en: string; ar: string; de: string }
        reservations: { en: string; ar: string; de: string }
        contact: { en: string; ar: string; de: string }
      }
      newsletter: {
        title: { en: string; ar: string; de: string }
        description: { en: string; ar: string; de: string }
        placeholder: { en: string; ar: string; de: string }
        subscribe: { en: string; ar: string; de: string }
        success: { en: string; ar: string; de: string }
      }
      rights: { en: string; ar: string; de: string }
      madeWith: { en: string; ar: string; de: string }
      privacy: { en: string; ar: string; de: string }
      terms: { en: string; ar: string; de: string }
      cookies: { en: string; ar: string; de: string }
    }
    // Admin
    admin: {
      title: { en: string; ar: string; de: string }
      welcome: { en: string; ar: string; de: string }
      login: {
        title: { en: string; ar: string; de: string }
        email: { en: string; ar: string; de: string }
        password: { en: string; ar: string; de: string }
        login: { en: string; ar: string; de: string }
        error: { en: string; ar: string; de: string }
      }
      desserts: {
        title: { en: string; ar: string; de: string }
        add: { en: string; ar: string; de: string }
        edit: { en: string; ar: string; de: string }
        name: { en: string; ar: string; de: string }
        description: { en: string; ar: string; de: string }
        price: { en: string; ar: string; de: string }
        image: { en: string; ar: string; de: string }
        save: { en: string; ar: string; de: string }
        delete: { en: string; ar: string; de: string }
        success: {
          added: { en: string; ar: string; de: string }
          updated: { en: string; ar: string; de: string }
          deleted: { en: string; ar: string; de: string }
        }
      }
    }
  }
  layout: {
    borderRadius: string
    spacing: string
    fontSize: {
      small: string
      medium: string
      large: string
      hero: string
    }
  }
}

// Context for theme, language, and admin
interface AppContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  language: 'en' | 'ar' | 'de'
  setLanguage: (lang: 'en' | 'ar' | 'de') => void
  isAuthenticated: boolean
  currentAdmin: Admin | null
  admins: Admin[]
  login: (email: string, password: string) => boolean
  logout: () => void
  addAdmin: (email: string, password: string, name: string) => boolean
  deleteAdmin: (adminId: string) => boolean
  updateAdminNumber: (adminId: string, number: number) => boolean
  desserts: Dessert[]
  addDessert: (dessert: Omit<Dessert, 'id'>) => void
  updateDessert: (id: string, dessert: Partial<Dessert>) => void
  deleteDessert: (id: string) => void
  favorites: string[]
  addToFavorites: (dessertId: string) => void
  removeFromFavorites: (dessertId: string) => void
  isFavorite: (dessertId: string) => boolean
  siteSettings: SiteSettings
  updateSiteSettings: (settings: Partial<SiteSettings>) => void
  // In-Place Editing
  isEditMode: boolean
  setEditMode: (enabled: boolean) => void
  updateContent: (path: string, value: any) => void
  canEdit: () => boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [language, setLanguage] = useState<'en' | 'ar' | 'de'>('de')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)
  const [showIntro, setShowIntro] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])
  const [isEditMode, setIsEditMode] = useState(false)

  // Restaurant Theme Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    colors: {
      primary: '#e31837', // Restaurant red
      secondary: '#2c5f2d', // Restaurant green
      accent: '#f1c40f', // Gold accent
      background: 'linear-gradient(135deg, #fff7f0, #ff9f4d)',
      text: '#212529',
      cardBg: 'rgba(255, 255, 255, 0.9)',
      buttonPrimary: '#e31837',
      buttonSecondary: '#2c5f2d',
      navbarBg: 'rgba(255, 255, 255, 0.95)',
      footerBg: '#000000',
      footerText: '#ffffff',
      footerAccent: '#f4a261',
      footerIcon: '#e76f51',
      heroBg: 'linear-gradient(135deg, #e31837 0%, #c41e3a 100%)',
      headerBg: 'rgba(0, 0, 0, 0.7)'
    },
    images: {
      heroBackground: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
      aboutImage: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg',
      logoUrl: '/im/logo.png',
      favicon: '/im/logo.png'
    },
    content: {
      siteName: {
        en: 'Restaurant Elite',
        ar: 'مطعم النخبة',
        de: 'Restaurant Elite'
      },
      heroTitle: {
        en: 'Culinary Excellence',
        ar: 'التميز الطهوي',
        de: 'Kulinarische Exzellenz'
      },
      heroSubtitle: {
        en: 'Experience the finest dining with our exquisite desserts and exceptional service',
        ar: 'استمتع بأفضل تجربة طعام مع حلوياتنا الرائعة وخدمتنا الاستثنائية',
        de: 'Erleben Sie feinste Küche mit unseren exquisiten Desserts und außergewöhnlichem Service'
      },
      aboutTitle: {
        en: 'About Our Restaurant',
        ar: 'عن مطعمنا',
        de: 'Über unser Restaurant'
      },
      aboutDescription: {
        en: 'We are passionate about creating unforgettable culinary experiences with the finest ingredients and exceptional service.',
        ar: 'نحن متحمسون لخلق تجارب طهوية لا تُنسى بأجود المكونات وخدمة استثنائية.',
        de: 'Wir sind leidenschaftlich dabei, unvergessliche kulinarische Erlebnisse mit den besten Zutaten und außergewöhnlichem Service zu schaffen.'
      },
      footerDescription: {
        en: 'Creating memorable dining experiences with passion and excellence.',
        ar: 'نخلق تجارب طعام لا تُنسى بشغف وتميز.',
        de: 'Wir schaffen unvergessliche kulinarische Erlebnisse mit Leidenschaft und Exzellenz.'
      },
      contactInfo: {
        address: '123 Gourmet Street, Culinary District, New York, NY 10001',
        phone: '+1 (555) 123-4567',
        email: 'info@restaurantelite.com'
      },
      // Navigation
      nav: {
        home: { en: 'Home', ar: 'الرئيسية', de: 'Startseite' },
        about: { en: 'About', ar: 'عنّا', de: 'Über Uns' },
        menu: { en: 'Menu', ar: 'القائمة', de: 'Speisekarte' },
        testimonials: { en: 'Reviews', ar: 'التقييمات', de: 'Bewertungen' },
        contact: { en: 'Contact', ar: 'اتصل بنا', de: 'Kontakt' },
        admin: { en: 'Admin', ar: 'المسؤول', de: 'Admin' }
      },
      // Hero Section
      hero: {
        cta: {
          reservation: { en: 'Make Reservation', ar: 'احجز طاولة', de: 'Reservierung vornehmen' },
          location: { en: 'View Location', ar: 'عرض الموقع', de: 'Standort anzeigen' }
        },
        stats: {
          years: { en: 'Years Experience', ar: 'سنوات الخبرة', de: 'Jahre Erfahrung' },
          customers: { en: 'Happy Customers', ar: 'عملاء سعداء', de: 'Zufriedene Kunden' },
          rating: { en: 'Rating', ar: 'التقييم', de: 'Bewertung' }
        }
      },
      // Menu Section
      menu: {
        title: { en: 'Our Menu', ar: 'قائمتنا', de: 'Unsere Speisekarte' },
        description: { en: 'Discover our carefully curated selection of extraordinary dishes', ar: 'اكتشف مجموعتنا المختارة بعناية من الأطباق الاستثنائية', de: 'Entdecken Sie unsere sorgfältig zusammengestellte Auswahl an außergewöhnlichen Gerichten' },
        categories: {
          featured: { en: 'Featured', ar: 'مميز', de: 'Empfohlen' },
          appetizers: { en: 'Appetizers', ar: 'المقبلات', de: 'Vorspeisen' },
          mains: { en: 'Main Courses', ar: 'الأطباق الرئيسية', de: 'Hauptgerichte' },
          desserts: { en: 'Desserts', ar: 'الحلويات', de: 'Desserts' }
        },
        addToOrder: { en: 'Add to Order', ar: 'أضف إلى الطلب', de: 'Zur Bestellung hinzufügen' },
        viewFullMenu: { en: 'View Full Menu', ar: 'عرض القائمة الكاملة', de: 'Vollständige Speisekarte anzeigen' }
      },
      // Testimonials Section
      testimonials: {
        title: { en: 'What Our Guests Say', ar: 'ما يقوله ضيوفنا', de: 'Was unsere Gäste sagen' },
        description: { en: 'Read what our valued customers have to say about their dining experiences', ar: 'اقرأ ما يقوله عملاؤنا القيمون عن تجاربهم في الطعام', de: 'Lesen Sie, was unsere geschätzten Kunden über ihre kulinarischen Erlebnisse sagen' },
        reviews: [
          {
            role: { en: 'Food Critic', ar: 'ناقد طعام', de: 'Essenskritiker' },
            content: { en: 'An absolutely extraordinary culinary experience. The attention to detail and innovative flavors are unmatched.', ar: 'تجربة طهي استثنائية تماماً. لا يمكن مطابقة الاهتمام بالتفاصيل والنكهات المبتكرة.', de: 'Eine absolut außergewöhnliche kulinarische Erfahrung. Die Liebe zum Detail und die innovativen Aromen sind unübertroffen.' }
          },
          {
            role: { en: 'Business Executive', ar: 'مدير أعمال', de: 'Geschäftsführer' },
            content: { en: 'Perfect venue for important dinners. The service is impeccable and the food is consistently outstanding.', ar: 'مكان مثالي للعشاء المهم. الخدمة لا تشوبها شائبة والطعام متميز باستمرار.', de: 'Perfekter Veranstaltungsort für wichtige Abendessen. Der Service ist einwandfrei und das Essen ist durchweg außergewöhnlich.' }
          },
          {
            role: { en: 'Chef & Restaurateur', ar: 'شيف ومالك مطعم', de: 'Koch & Restaurantbesitzer' },
            content: { en: 'As a fellow chef, I am impressed by the creativity and execution. This is fine dining at its absolute best.', ar: 'كشيف زميل، أنا منبهر بالإبداع والتنفيذ. هذا هو الطعام الراقي في أفضل حالاته.', de: 'Als Kollege-Koch bin ich von der Kreativität und Ausführung beeindruckt. Das ist Haute Cuisine in ihrer absolut besten Form.' }
          },
          {
            role: { en: 'Food Blogger', ar: 'مدون طعام', de: 'Essensblogger' },
            content: { en: 'Every dish tells a story. The presentation is art, and the taste is pure magic. Highly recommended!', ar: 'كل طبق يحكي قصة. العرض فن،والطعم سحر خالص. موصى به بشدة!', de: 'Jedes Gericht erzählt eine Geschichte. Die Präsentation ist Kunst, und der Geschmack ist reine Magie. Sehr empfehlenswert!' }
          }
        ],
        stats: {
          rating: { en: 'Average Rating', ar: 'متوسط التقييم', de: 'Durchschnittliche Bewertung' },
          reviews: { en: 'Customer Reviews', ar: 'مراجعات العملاء', de: 'Kundenbewertungen' },
          satisfaction: { en: 'Satisfaction Rate', ar: 'معدل الرضا', de: 'Zufriedenheitsrate' }
        }
      },
      // Contact Section
      contact: {
        title: { en: 'Visit Us', ar: 'زورنا', de: 'Besuchen Sie uns' },
        description: { en: 'Experience culinary excellence in our elegant dining space', ar: 'استمتع بالتميز الطهي في مساحة الطعام الأنيقة لدينا', de: 'Erleben Sie kulinarische Exzellenz in unserem eleganten Speiseraum' },
        info: {
          address: { en: '123 Gourmet Street, Culinary District', ar: '123 شارع الجورمي، حي الطهي', de: '123 Gourmet Straße, Kulinarik Viertel' },
          phone: { en: '+1 (555) 123-4567', ar: '+1 (555) 123-4567', de: '+1 (555) 123-4567' },
          email: { en: 'info@restaurant.com', ar: 'info@restaurant.com', de: 'info@restaurant.com' },
          hours: { en: 'Daily 6:00 PM - 11:00 PM', ar: 'يومياً 6:00 م - 11:00 م', de: 'Täglich 18:00 - 23:00 Uhr' }
        },
        form: {
          name: { en: 'Your Name', ar: 'اسمك', de: 'Ihr Name' },
          email: { en: 'Email Address', ar: 'عنوان البريد الإلكتروني', de: 'E-Mail-Adresse' },
          subject: { en: 'Subject', ar: 'الموضوع', de: 'Betreff' },
          message: { en: 'Message', ar: 'الرسالة', de: 'Nachricht' },
          send: { en: 'Send Message', ar: 'إرسال الرسالة', de: 'Nachricht senden' },
          namePlaceholder: { en: 'Enter your name', ar: 'أدخل اسمك', de: 'Geben Sie Ihren Namen ein' },
          emailPlaceholder: { en: 'Enter your email', ar: 'أدخل بريدك الإلكتروني', de: 'Geben Sie Ihre E-Mail ein' },
          subjectPlaceholder: { en: 'Enter subject', ar: 'أدخل الموضوع', de: 'Geben Sie den Betreff ein' },
          messagePlaceholder: { en: 'Enter your message', ar: 'أدخل رسالتك', de: 'Geben Sie Ihre Nachricht ein' }
        },
        reservation: {
          title: { en: 'Make a Reservation', ar: 'احجز طاولة', de: 'Eine Reservierung vornehmen' },
          date: { en: 'Date', ar: 'التاريخ', de: 'Datum' },
          time: { en: 'Time', ar: 'الوقت', de: 'Uhrzeit' },
          guests: { en: 'Number of Guests', ar: 'عدد الضيوف', de: 'Anzahl der Gäste' },
          name: { en: 'Your Name', ar: 'اسمك', de: 'Ihr Name' },
          phone: { en: 'Phone Number', ar: 'رقم الهاتف', de: 'Telefonnummer' },
          notes: { en: 'Special Requests', ar: 'طلبات خاصة', de: 'Besondere Wünsche' },
          button: { en: 'Book Table', ar: 'احجز طاولة', de: 'Tisch reservieren' },
          confirm: { en: 'Confirm Reservation', ar: 'تأكيد الحجز', de: 'Reservierung bestätigen' }
        }
      },
      // Footer
      footer: {
        description: { en: 'Experience culinary excellence that combines traditional techniques with modern innovation', ar: 'استمتع بالتميز الطهي الذي يجمع بين التقنيات التقليدية والابتكار الحديث', de: 'Erleben Sie kulinarische Exzellenz, die traditionelle Techniken mit moderner Innovation verbindet' },
        quickLinks: { en: 'Quick Links', ar: 'روابط سريعة', de: 'Schnelllinks' },
        contact: { en: 'Contact Info', ar: 'معلومات الاتصال', de: 'Kontaktinformationen' },
        links: {
          about: { en: 'About Us', ar: 'عنّا', de: 'Über uns' },
          menu: { en: 'Our Menu', ar: 'قائمتنا', de: 'Unsere Speisekarte' },
          reservations: { en: 'Reservations', ar: 'الحجوزات', de: 'Reservierungen' },
          contact: { en: 'Contact', ar: 'اتصل بنا', de: 'Kontakt' }
        },
        newsletter: {
          title: { en: 'Newsletter', ar: 'النشرة الإخبارية', de: 'Newsletter' },
          description: { en: 'Subscribe to receive our latest news and special offers', ar: 'اشترك لتستلم أحدث أخبارنا والعروض الخاصة', de: 'Abonnieren Sie, um unsere neuesten Nachrichten und Sonderangebote zu erhalten' },
          placeholder: { en: 'Enter your email', ar: 'أدخل بريدك الإلكتروني', de: 'Geben Sie Ihre E-Mail ein' },
          subscribe: { en: 'Subscribe', ar: 'اشترك', de: 'Abonnieren' },
          success: { en: 'Successfully subscribed to newsletter!', ar: 'تم الاشتراك في النشرة الإخبارية بنجاح!', de: 'Erfolgreich für den Newsletter angemeldet!' }
        },
        rights: { en: 'All rights reserved.', ar: 'جميع الحقوق محفوظة.', de: 'Alle Rechte vorbehalten.' },
        madeWith: { en: 'Made with', ar: 'مصنوع مع', de: 'Hergestellt mit' },
        privacy: { en: 'Privacy Policy', ar: 'سياسة الخصوصية', de: 'Datenschutzrichtlinie' },
        terms: { en: 'Terms of Service', ar: 'شروط الخدمة', de: 'Nutzungsbedingungen' },
        cookies: { en: 'Cookie Policy', ar: 'سياسة ملفات تعريف الارتباط', de: 'Cookie-Richtlinie' }
      },
      // Admin
      admin: {
        title: { en: 'Admin Dashboard', ar: 'لوحة تحكم المسؤول', de: 'Admin-Dashboard' },
        welcome: { en: 'Welcome', ar: 'مرحباً', de: 'Willkommen' },
        login: {
          title: { en: 'Admin Login', ar: 'تسجيل دخول المسؤول', de: 'Admin-Anmeldung' },
          email: { en: 'Email', ar: 'البريد الإلكتروني', de: 'E-Mail' },
          password: { en: 'Password', ar: 'كلمة المرور', de: 'Passwort' },
          login: { en: 'Login', ar: 'تسجيل الدخول', de: 'Anmelden' },
          error: { en: 'Invalid credentials', ar: 'بيانات الاعتماد غير صحيحة', de: 'Ungültige Anmeldedaten' }
        },
        desserts: {
          title: { en: 'Dessert Management', ar: 'إدارة الحلويات', de: 'Dessert-Verwaltung' },
          add: { en: 'Add New Dessert', ar: 'إضافة حلوى جديدة', de: 'Neues Dessert hinzufügen' },
          edit: { en: 'Edit Dessert', ar: 'تعديل الحلوى', de: 'Dessert bearbeiten' },
          name: { en: 'Dessert Name', ar: 'اسم الحلوى', de: 'Dessert-Name' },
          description: { en: 'Description', ar: 'الوصف', de: 'Beschreibung' },
          price: { en: 'Price', ar: 'السعر', de: 'Preis' },
          image: { en: 'Image URL', ar: 'رابط الصورة', de: 'Bild-URL' },
          save: { en: 'Save Dessert', ar: 'حفظ الحلوى', de: 'Dessert speichern' },
          delete: { en: 'Delete', ar: 'حذف', de: 'Löschen' },
          success: {
            added: { en: 'Dessert added successfully!', ar: 'تمت إضافة الحلوى بنجاح!', de: 'Dessert erfolgreich hinzugefügt!' },
            updated: { en: 'Dessert updated successfully!', ar: 'تم تحديث الحلوى بنجاح!', de: 'Dessert erfolgreich aktualisiert!' },
            deleted: { en: 'Dessert deleted successfully!', ar: 'تم حذف الحلوى بنجاح!', de: 'Dessert erfolgreich gelöscht!' }
          }
        }
      }
    },
    layout: {
      borderRadius: '16px',
      spacing: '24px',
      fontSize: {
        small: '14px',
        medium: '16px',
        large: '24px',
        hero: '64px'
      }
    }
  })

  // Haupt-Admin mit aktualisierten Zugangsdaten
  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: '1',
      email: 'ahmedgamer748@gmail.com',
      password: 'Ahmed.000',
      role: 'main',
      name: 'Ahmed - Haupt-Administrator',
      number: 0 // Haupt-Admin hat immer Nummer 0
    }
  ])

  // Erweiterte Desserts mit mehr Details
  const [desserts, setDesserts] = useState<Dessert[]>([
    {
      id: '1',
      name: {
        en: 'Chocolate Lava Cake',
        ar: 'كيك الشوكولاتة البركاني',
        de: 'Schokoladen-Lavakuchen'
      },
      description: {
        en: 'Warm chocolate cake with molten center, served with vanilla ice cream and fresh berries',
        ar: 'كيك الشوكولاتة الدافئ مع مركز ذائب، يُقدم مع آيس كريم الفانيليا والتوت الطازج',
        de: 'Warmer Schokoladenkuchen mit flüssigem Kern, serviert mit Vanilleeis und frischen Beeren'
      },
      price: 12.99,
      image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
      category: 'Hot Desserts',
      featured: true,
      rating: 4.9,
      time: '25 min',
      ingredients: ['Dunkle Schokolade', 'Butter', 'Eier', 'Zucker', 'Mehl', 'Vanilleeis'],
      allergens: ['Gluten', 'Eier', 'Milch']
    },
    {
      id: '2',
      name: {
        en: 'Tiramisu',
        ar: 'تيراميسو',
        de: 'Tiramisu'
      },
      description: {
        en: 'Classic Italian dessert with coffee-soaked ladyfingers, mascarpone cream and cocoa powder',
        ar: 'حلوى إيطالية كلاسيكية مع أصابع الست المنقوعة بالقهوة وكريم الماسكاربوني ومسحوق الكاكاو',
        de: 'Klassisches italienisches Dessert mit kaffeegetränkten Löffelbiskuits, Mascarpone-Creme und Kakaopulver'
      },
      price: 9.99,
      image: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg',
      category: 'Cold Desserts',
      featured: true,
      rating: 4.8,
      time: '15 min',
      ingredients: ['Löffelbiskuits', 'Mascarpone', 'Kaffee', 'Zucker', 'Eier', 'Kakao'],
      allergens: ['Gluten', 'Eier', 'Milch']
    },
    {
      id: '3',
      name: {
        en: 'Crème Brûlée',
        ar: 'كريم بروليه',
        de: 'Crème Brûlée'
      },
      description: {
        en: 'Rich vanilla custard with caramelized sugar crust and seasonal fruit garnish',
        ar: 'كاسترد الفانيليا الغني مع قشرة السكر المكرملة وزينة الفواكه الموسمية',
        de: 'Reichhaltige Vanille-Creme mit karamellisierter Zuckerkruste und saisonaler Fruchtgarnitur'
      },
      price: 8.99,
      image: 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg',
      category: 'Cold Desserts',
      featured: false,
      rating: 4.7,
      time: '20 min',
      ingredients: ['Sahne', 'Eigelb', 'Zucker', 'Vanille', 'Brauner Zucker'],
      allergens: ['Eier', 'Milch']
    }
  ])

  const [loginAttempts, setLoginAttempts] = useState(0)
  const [lastAttemptTime, setLastAttemptTime] = useState(0)

  // Initialisierung
  useEffect(() => {
    // Lade gespeicherte Daten
    const savedTheme = localStorage.getItem('restaurant_theme') as 'light' | 'dark' | null
    const savedLanguage = localStorage.getItem('restaurant_language') as 'en' | 'ar' | 'de' | null
    const savedAdmins = localStorage.getItem('restaurant_admins')
    const savedDesserts = localStorage.getItem('restaurant_desserts')
    const savedAuth = localStorage.getItem('restaurant_auth')
    const savedFavorites = localStorage.getItem('restaurant_favorites')
    const savedSiteSettings = localStorage.getItem('restaurant_site_settings')
    
    if (savedTheme) {
      setTheme(savedTheme)
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
    
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Fehler beim Laden der Favoriten:', error)
      }
    }

    if (savedSiteSettings) {
      try {
        const parsedSettings = JSON.parse(savedSiteSettings)
        setSiteSettings(prev => ({ ...prev, ...parsedSettings }))
      } catch (error) {
        console.error('Fehler beim Laden der Website-Einstellungen:', error)
      }
    }
    
    // Lade secondary admins aus localStorage
    let loadedAdmins: Admin[] = [
      {
        id: '1',
        email: 'ahmedgamer748@gmail.com',
        password: 'Ahmed.000',
        role: 'main',
        name: 'Ahmed - Haupt-Administrator',
        number: 0 // Haupt-Admin hat immer Nummer 0
      }
    ];
    
    if (savedAdmins) {
      try {
        const parsedAdmins: Admin[] = JSON.parse(savedAdmins)
        // Füge die geladenen secondary admins hinzu
        loadedAdmins = [...loadedAdmins, ...parsedAdmins]
      } catch (error) {
        console.error('Fehler beim Laden der Admins:', error)
      }
    }
    
    setAdmins(loadedAdmins)

    if (savedDesserts) {
      try {
        const parsedDesserts = JSON.parse(savedDesserts)
        setDesserts(prev => [...prev, ...parsedDesserts.filter((d: Dessert) => !prev.find(existing => existing.id === d.id))])
      } catch (error) {
        console.error('Fehler beim Laden der Desserts:', error)
      }
    }

    // Setze einen Timeout, um sicherzustellen, dass die Admins geladen sind, bevor die Authentifizierung geprüft wird
    setTimeout(() => {
      // Prüfe Authentifizierungsstatus nachdem alle Admins geladen wurden
      if (savedAuth) {
        try {
          const authData: Admin = JSON.parse(savedAuth)
          // Prüfe ob der Admin (Haupt- oder Secondary) noch existiert
          const adminExists = loadedAdmins.some(a => a.id === authData.id)
          if (adminExists) {
            setIsAuthenticated(true)
            setCurrentAdmin(authData)
          } else {
            // Wenn der Admin nicht existiert, entferne die Authentifizierungsdaten
            localStorage.removeItem('restaurant_auth')
          }
        } catch (error) {
          console.error('Fehler beim Laden der Authentifizierung:', error)
          localStorage.removeItem('restaurant_auth')
        }
      }
      setLoading(false)
    }, 100)
  }, [])

  // Thema anwenden
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('restaurant_theme', theme)
  }, [theme])

  // Sprache anwenden
  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', language)
    localStorage.setItem('restaurant_language', language)
  }, [language])

  // CSS-Variablen für Website-Einstellungen anwenden
  useEffect(() => {
    const root = document.documentElement
    
    // Farben anwenden
    root.style.setProperty('--color-primary', siteSettings.colors.primary)
    root.style.setProperty('--color-secondary', siteSettings.colors.secondary)
    root.style.setProperty('--color-accent', siteSettings.colors.accent)
    root.style.setProperty('--color-background', siteSettings.colors.background)
    root.style.setProperty('--color-text', siteSettings.colors.text)
    root.style.setProperty('--color-card-bg', siteSettings.colors.cardBg)
    root.style.setProperty('--color-button-primary', siteSettings.colors.buttonPrimary)
    root.style.setProperty('--color-button-secondary', siteSettings.colors.buttonSecondary)
    root.style.setProperty('--color-navbar-bg', siteSettings.colors.navbarBg)
    root.style.setProperty('--color-footer-bg', siteSettings.colors.footerBg)
    root.style.setProperty('--color-footer-text', siteSettings.colors.footerText)
    root.style.setProperty('--color-footer-accent', siteSettings.colors.footerAccent)
    root.style.setProperty('--color-footer-icon', siteSettings.colors.footerIcon)
    root.style.setProperty('--hero-bg', siteSettings.colors.heroBg)
    
    // Layout anwenden
    root.style.setProperty('--border-radius', siteSettings.layout.borderRadius)
    root.style.setProperty('--spacing', siteSettings.layout.spacing)
    root.style.setProperty('--font-size-small', siteSettings.layout.fontSize.small)
    root.style.setProperty('--font-size-medium', siteSettings.layout.fontSize.medium)
    root.style.setProperty('--font-size-large', siteSettings.layout.fontSize.large)
    root.style.setProperty('--font-size-hero', siteSettings.layout.fontSize.hero)

    // Favicon aktualisieren
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    if (favicon) {
      favicon.href = siteSettings.images.favicon
    }
  }, [siteSettings])

  // Edit Mode CSS
  useEffect(() => {
    if (isEditMode) {
      document.body.classList.add('edit-mode')
    } else {
      document.body.classList.remove('edit-mode')
    }
  }, [isEditMode])

  // Speichere Daten
  useEffect(() => {
    // Speichere nur secondary admins (nicht den Haupt-Admin)
    const secondaryAdmins = admins.filter(a => a.role === 'secondary')
    localStorage.setItem('restaurant_admins', JSON.stringify(secondaryAdmins))
  }, [admins])

  useEffect(() => {
    const customDesserts = desserts.filter(d => !['1', '2', '3'].includes(d.id))
    localStorage.setItem('restaurant_desserts', JSON.stringify(customDesserts))
  }, [desserts])

  useEffect(() => {
    localStorage.setItem('restaurant_favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('restaurant_site_settings', JSON.stringify(siteSettings))
  }, [siteSettings])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const login = (email: string, password: string): boolean => {
    // Implement rate limiting to prevent brute force attacks
    const currentTime = Date.now()
    const timeSinceLastAttempt = currentTime - lastAttemptTime
    
    // If there have been 3 failed attempts and less than 30 seconds have passed, reject the attempt
    if (loginAttempts >= 3 && timeSinceLastAttempt < 30000) {
      console.log('Too many login attempts. Please wait before trying again.')
      return false
    }
    
    // Suche nach Admin in allen Admins (Haupt- und Secondary)
    const admin = admins.find(a => a.email === email && a.password === password)
    if (admin) {
      // Reset login attempts on successful login
      setLoginAttempts(0)
      setLastAttemptTime(0)
      
      setIsAuthenticated(true)
      setCurrentAdmin(admin)
      // Speichere Authentifizierungsdaten in localStorage
      localStorage.setItem('restaurant_auth', JSON.stringify(admin))
      return true
    } else {
      // Increment login attempts on failed login
      setLoginAttempts(prev => prev + 1)
      setLastAttemptTime(currentTime)
      return false
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setCurrentAdmin(null)
    setIsEditMode(false)
    // Entferne Authentifizierungsdaten aus localStorage
    localStorage.removeItem('restaurant_auth')
  }

  const addAdmin = (email: string, password: string, name: string): boolean => {
    // Nur Haupt-Admin kann neue Admins hinzufügen
    if (currentAdmin?.role !== 'main') return false
    
    // Prüfe ob Email bereits existiert
    if (admins.find(a => a.email === email)) return false
    
    // Finde die nächste verfügbare Nummer
    const existingNumbers = admins.filter(a => a.role === 'secondary').map(a => a.number || 0)
    let nextNumber = 1
    while (existingNumbers.includes(nextNumber)) {
      nextNumber++
    }
    
    const newAdmin: Admin = {
      id: Date.now().toString(),
      email,
      password,
      role: 'secondary',
      name,
      number: nextNumber
    }
    
    setAdmins(prev => [...prev, newAdmin])
    return true
  }

  const deleteAdmin = (adminId: string): boolean => {
    // Nur Haupt-Admin kann Admins löschen
    if (currentAdmin?.role !== 'main') return false
    
    // Haupt-Admin kann nicht gelöscht werden
    const adminToDelete = admins.find(a => a.id === adminId)
    if (!adminToDelete || adminToDelete.role === 'main') return false
    
    setAdmins(prev => prev.filter(a => a.id !== adminId))
    
    // Falls der gelöschte Admin aktuell angemeldet ist, abmelden
    if (currentAdmin?.id === adminId) {
      logout()
    }
    
    return true
  }

  const updateAdminNumber = (adminId: string, number: number): boolean => {
    // Nur Haupt-Admin kann Admin-Nummern ändern
    if (currentAdmin?.role !== 'main') return false
    
    // Prüfe ob die Nummer bereits vergeben ist
    const existingAdmin = admins.find(a => a.number === number && a.id !== adminId)
    if (existingAdmin) return false
    
    setAdmins(prev => prev.map(admin => 
      admin.id === adminId ? { ...admin, number } : admin
    ))
    
    return true
  }

  const addDessert = (dessertData: Omit<Dessert, 'id'>) => {
    const newDessert: Dessert = {
      ...dessertData,
      id: 'dessert_' + Date.now().toString(),
      rating: 4.5,
      time: '20 min'
    }
    setDesserts(prev => [...prev, newDessert]);
  }

  const updateDessert = (id: string, updates: Partial<Dessert>) => {
    setDesserts(prev => prev.map(dessert => 
      dessert.id === id ? { ...dessert, ...updates } : dessert
    ))
  }

  const deleteDessert = (id: string) => {
    setDesserts(prev => prev.filter(dessert => dessert.id !== id))
    // Entferne auch aus Favoriten
    setFavorites(prev => prev.filter(fav => fav !== id))
  }

  // Favoriten-Funktionen
  const addToFavorites = (dessertId: string) => {
    setFavorites(prev => {
      if (!prev.includes(dessertId)) {
        return [...prev, dessertId]
      }
      return prev
    })
  }

  const removeFromFavorites = (dessertId: string) => {
    setFavorites(prev => prev.filter(id => id !== dessertId))
  }

  const isFavorite = (dessertId: string): boolean => {
    return favorites.includes(dessertId)
  }

  const updateSiteSettings = (newSettings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({
      ...prev,
      ...newSettings,
      colors: { ...prev.colors, ...newSettings.colors },
      images: { ...prev.images, ...newSettings.images },
      content: { ...prev.content, ...newSettings.content },
      layout: { ...prev.layout, ...newSettings.layout }
    }))
  }

  // In-Place Editing Funktionen
  const setEditMode = (enabled: boolean) => {
    if (currentAdmin?.role === 'main' || (currentAdmin?.role === 'secondary' && currentAdmin.number && currentAdmin.number <= 3)) {
      setIsEditMode(enabled)
    }
  }

  const updateContent = (path: string, value: any) => {
    if (!canEdit()) return

    const pathParts = path.split('.')
    const newSettings = { ...siteSettings }
    
    // Navigiere durch den Pfad und aktualisiere den Wert
    let current: any = newSettings
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {}
      }
      current = current[pathParts[i]]
    }
    
    current[pathParts[pathParts.length - 1]] = value
    setSiteSettings(newSettings)
  }

  const canEdit = (): boolean => {
    return currentAdmin?.role === 'main' || (currentAdmin?.role === 'secondary' && currentAdmin.number !== undefined && currentAdmin.number <= 3)
  }

  const contextValue: AppContextType = {
    theme,
    toggleTheme,
    language,
    setLanguage,
    isAuthenticated,
    currentAdmin,
    admins,
    login,
    logout,
    addAdmin,
    deleteAdmin,
    updateAdminNumber,
    desserts,
    addDessert,
    updateDessert,
    deleteDessert,
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    siteSettings,
    updateSiteSettings,
    isEditMode,
    setEditMode,
    updateContent,
    canEdit
  }

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return (
      <div className="min-h-screen">
        <RestaurantVideoIntro onIntroComplete={handleIntroComplete} />
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full cursor-pointer hover:bg-white/30 transition-all duration-300"
          onClick={() => setShowIntro(false)}
        >
          Skip Intro
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className="min-h-screen relative overflow-hidden modern-2026">
          {/* Edit Mode Overlay */}
          {isEditMode && (
            <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 text-center font-semibold shadow-lg">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-pulse">✏️</div>
                <span className="text-sm md:text-base">Edit mode active - Click on any element to edit</span>
                <button
                  onClick={() => setEditMode(false)}
                  className="ml-3 bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition-all duration-300 font-medium text-sm"
                >
                  Exit
                </button>
              </div>
            </div>
          )}

          {/* Modern Restaurant Background - Updated with requested gradient */}
          <div className="fixed inset-0 -z-10" style={{ background: 'linear-gradient(135deg, #fff7f0, #ff9f4d)' }}>
            {/* Subtle restaurant-themed patterns with muted orange tones */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,162,97,0.1),transparent_40%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(231,111,81,0.1),transparent_40%)]"></div>
            
            {/* Static decorative elements for restaurant theme with muted orange tones */}
            <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-amber-200/20"></div>
            <div className="absolute top-1/4 right-20 w-12 h-12 rounded-full bg-orange-200/20"></div>
            <div className="absolute bottom-1/3 left-1/4 w-16 h-16 rounded-full bg-amber-300/10"></div>
            <div className="absolute bottom-20 right-1/3 w-20 h-20 rounded-full bg-orange-300/10"></div>
          </div>

          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/admin" 
              element={
                isAuthenticated ? (
                  <AdminPanel />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#212529',
                border: '1px solid #f0e6e1',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#f4a261',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AppContext.Provider>
  )
}

export default App
