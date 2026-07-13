const INSTRUCTORS = [
  {
    id: 'evelyn',
    name: 'Evelyn Vance',
    role: 'Lead Watercolorist & Co-Founder',
    bio: 'Evelyn has been teaching art for over 15 years. She believes that watercolor is not about controlling the water, but dancing with it. Her classes focus on relaxing fluid techniques, botanical painting, and capturing light.',
    specialty: 'Watercolor & Wet-on-Wet Techniques',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: 'marcus',
    name: 'Marcus Brody',
    role: 'Acrylic Master & Landscape Painter',
    bio: 'Marcus is a passionate Plein Air landscape artist. With a structured yet playful style, Marcus guides students through color theory, layering, and bold palette-knife textures that make acrylic paintings pop.',
    specialty: 'Acrylic Landscapes & Dynamic Skies',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: 'sarah',
    name: 'Sarah Kim',
    role: 'Sketching & Pen-and-Ink Illustrator',
    bio: 'Sarah turns the everyday world into exquisite illustrations. Specializing in sketching, perspective, and architectural ink wash, she excels at helping complete beginners conquer the fear of the blank page.',
    specialty: 'Pen, Ink, & Urban Perspective Sketching',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200'
  }
];

const ART_CLASSES = [
  {
    id: 'class-1',
    title: 'Dreamy Forest Paths in Watercolor',
    description: 'Explore the delicate play of light through tree canopies. You will learn wet-on-wet background washes, soft layering, and fine dry-brush techniques for branches. Perfect for total beginners wanting a relaxing weekend activity!',
    medium: 'Watercolor',
    date: '2026-07-11',
    time: '1:00 PM - 3:30 PM',
    duration: '2.5 Hours',
    instructor: 'Evelyn Vance',
    location: 'The Willow Cafe Greenhouse',
    locationDetails: '104 Pine Street — A beautiful climate-controlled conservatory filled with hanging ferns and bright ambient light.',
    price: 45,
    maxSeats: 12,
    filledSeats: 7,
    image: 'src/assets/images/watercolor_forest_1782863115766.jpg'
  },
  {
    id: 'class-2',
    title: 'Vibrant Acrylic Mountain Sunset',
    description: 'Capture the dramatic gradient of a mountain sunset using professional acrylic paints. Learn color blending, atmospheric perspective, and how to use palette knives to create textured mountain peaks that catch the eye.',
    medium: 'Acrylic',
    date: '2026-07-08',
    time: '6:00 PM - 8:30 PM',
    duration: '2.5 Hours',
    instructor: 'Marcus Brody',
    location: 'Harvest Ridge Vineyards',
    locationDetails: '442 Wine Country Road — Outdoors on the scenic covered patio overlooking the grapevines. Includes one complimentary glass of wine!',
    price: 50,
    maxSeats: 15,
    filledSeats: 11,
    image: 'src/assets/images/acrylic_sunset_1782863123550.jpg'
  },
  {
    id: 'class-3',
    title: 'Cozy Street Vignettes in Graphite & Ink',
    description: 'Demystify urban perspective sketching! We will cover simple one-point perspective, dynamic fine-liner ink linework, and soft pencil shading to illustrate a beautiful, cozy Parisian street cafe scene.',
    medium: 'Sketching',
    date: '2026-07-15',
    time: '6:30 PM - 8:30 PM',
    duration: '2.0 Hours',
    instructor: 'Sarah Kim',
    location: 'Urban Grind Roastery',
    locationDetails: '89 Main Street — Inside the private back lounge. Surrounded by the aroma of freshly roasted beans. Includes a specialty coffee or craft tea of your choice!',
    price: 40,
    maxSeats: 10,
    filledSeats: 6,
    image: 'src/assets/images/pencil_sketch_1782863132031.jpg'
  },
  {
    id: 'class-4',
    title: 'Wildflowers Bleed Botanical Watercolor',
    description: 'Learn to paint delicate, expressive wildflowers using soft color bleeds, splatters, and organic ink accents. This class celebrates natural imperfections and is highly therapeutic and easy to follow.',
    medium: 'Watercolor',
    date: '2026-07-22',
    time: '6:00 PM - 8:30 PM',
    duration: '2.5 Hours',
    instructor: 'Evelyn Vance',
    location: 'The Bloom Garden Emporium',
    locationDetails: '215 Gardenia Drive — Set inside the beautiful brick courtyard under twinkling fairy lights. Surrounded by fragrant seasonal blooms.',
    price: 45,
    maxSeats: 12,
    filledSeats: 12,
    image: 'src/assets/images/watercolor_forest_1782863115766.jpg'
  },
  {
    id: 'class-5',
    title: 'Ocean Spray & Rocky Coasts in Acrylic',
    description: 'Master the element of moving water. Marcus will show you how to layer deep blues and turquoises, paint swirling frothy seafoam using stippling techniques, and craft majestic dark coastal rocks with dry-brushing.',
    medium: 'Acrylic',
    date: '2026-07-18',
    time: '2:00 PM - 4:30 PM',
    duration: '2.5 Hours',
    instructor: 'Marcus Brody',
    location: 'Harvest Ridge Vineyards',
    locationDetails: '442 Wine Country Road — Outdoors on the scenic covered patio. Enjoy coastal painting in a rustic vineyard. Includes one complimentary beverage.',
    price: 50,
    maxSeats: 15,
    filledSeats: 8,
    image: 'src/assets/images/acrylic_sunset_1782863123550.jpg'
  },
  {
    id: 'class-6',
    title: 'Botanical Sketching & Ink Wash',
    description: 'A quiet, elegant study of flora. You will observe fresh specimens of ferns, eucalyptus, and roses, and translate them into ink sketches using pigment liners and dilute ink washes for stunning vintage-style botanical art.',
    medium: 'Sketching',
    date: '2026-07-29',
    time: '6:00 PM - 8:00 PM',
    duration: '2.0 Hours',
    instructor: 'Sarah Kim',
    location: 'The Bloom Garden Emporium',
    locationDetails: '215 Gardenia Drive — Under the courtyard pergola. Surrounded by beautiful living plants for direct painting inspiration.',
    price: 40,
    maxSeats: 10,
    filledSeats: 3,
    image: 'src/assets/images/pencil_sketch_1782863132031.jpg'
  }
];

export { INSTRUCTORS, ART_CLASSES };
