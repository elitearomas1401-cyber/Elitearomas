/* ===========================
   DATA — MENU (Simulated DB)
=========================== */
const GRADIENTS = {
  'jean-paul':    'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)',
  'acqua-di-gio': 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
  'fakhar-black': 'linear-gradient(135deg, #000000 0%, #2c3e50 100%)',
  'bharara-king': 'linear-gradient(135deg, #d4af37 0%, #aa8a2e 100%)',
  'stronger-you': 'linear-gradient(135deg, #4e342e 0%, #212121 100%)',
  'ltb-jeans':    'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)',
  'zara-pants':   'linear-gradient(135deg, #303030 0%, #606060 100%)',
  'blue-matrix':  'linear-gradient(135deg, #000428 0%, #004e92 100%)',
  'ltb-jeans-2':  'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)',
  'zara-pants-2': 'linear-gradient(135deg, #303030 0%, #606060 100%)',
};

const MENU = [
  {
    id: 'jean-paul',
    name: 'Jean Paul Gaultier',
    desc: 'Una fragancia magnética y seductora con notas de vainilla, lavanda y menta. El equilibrio perfecto entre frescura y calidez.',
    price: 7800,
    cat: 'perfumes',
    emoji: '✨',
    badge: '💎 Premium',
    image: 'menu Elite Aromas/Jean Paul 7,800.jpeg'
  },
  {
    id: 'acqua-di-gio',
    name: 'Acqua Di Gio',
    desc: 'Clásico atemporal que evoca la frescura del mar. Notas cítricas y acuáticas con un fondo amaderado muy elegante.',
    price: 7500,
    cat: 'perfumes',
    emoji: '🌊',
    badge: '🔥 Top Ventas',
    image: 'menu Elite Aromas/Acgua Di Gio 7,500.jpeg'
  },
  {
    id: 'fakhar-black',
    name: 'Lattafa Fakhar Black',
    desc: 'Una joya de la perfumería árabe. Aroma sofisticado con toques de manzana, jengibre y maderas preciosas.',
    price: 2900,
    cat: 'perfumes',
    emoji: '🖤',
    image: 'menu Elite Aromas/fakhar black 2,900.jpeg'
  },
  {
    id: 'bharara-king',
    name: 'Bharara King',
    desc: 'Potencia y distinción en cada gota. Fragancia cítrica y dulce con una proyección excepcional y larga duración.',
    price: 4800,
    cat: 'perfumes',
    emoji: '👑',
    badge: '✨ Exclusivo',
    image: 'menu Elite Aromas/Baharara king 4,800.jpeg'
  },
  {
    id: 'stronger-you',
    name: 'Stronger With You Absolutely',
    desc: 'Aroma intenso y amaderado con un toque licoroso de ron y vainilla. La máxima expresión de la masculinidad moderna.',
    price: 7800,
    cat: 'perfumes',
    emoji: '🥃',
    image: 'menu Elite Aromas/Stronger With You Absolutely 7,800.jpeg'
  },
  {
    id: 'ltb-jeans',
    name: 'LTB Jeans',
    desc: 'Jeans de alta calidad con un ajuste perfecto y diseño moderno. Ideal para cualquier ocasión casual.',
    price: 3600,
    cat: 'pantalones',
    emoji: '👖',
    badge: '🆕 Nuevo',
    image: 'menu Elite Aromas/LTB 3600.jpeg'
  },
  {
    id: 'zara-pants',
    name: 'Pantalón Zara',
    desc: 'Elegancia y comodidad en una sola prenda. Pantalones de corte contemporáneo que resaltan tu estilo.',
    price: 3300,
    cat: 'pantalones',
    emoji: '👖',
    badge: '✨ Tendencia',
    image: 'menu Elite Aromas/Zara 3300.jpeg'
  },
  {
    id: 'blue-matrix',
    name: 'Blue Matrix',
    desc: 'Diseño exclusivo y durabilidad. Un básico imprescindible en tu guardarropa para un look impecable.',
    price: 1500,
    cat: 'pantalones',
    emoji: '👖',
    image: 'menu Elite Aromas/Blue Matrix 1500.jpeg'
  },
  {
    id: 'ltb-jeans-2',
    name: 'LTB Jeans (Variedad)',
    desc: 'Otro estilo de nuestra línea LTB. Calidad superior y confort garantizado para tu día a día.',
    price: 3600,
    cat: 'pantalones',
    emoji: '👖',
    image: 'menu Elite Aromas/LTB  3600 .jpeg'
  },
  {
    id: 'zara-pants-2',
    name: 'Pantalón Zara (Modelo B)',
    desc: 'Versión alternativa de nuestra línea Zara. Corte estilizado para un look moderno y profesional.',
    price: 3300,
    cat: 'pantalones',
    emoji: '👖',
    image: 'menu Elite Aromas/Zara  3300.jpeg'
  }
];
