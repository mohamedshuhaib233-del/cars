// SCUDERIA VELOCE // ACCESSORIES & FITTED VEHICLES DATABASE
// Genuine Supercar Accessories Catalog with Pure Supercar Studio 360 Inspection

const WHEELS = [
  {
    id: 'wheel-ferrari-corsa',
    brand: 'ferrari',
    brandLabel: 'FERRARI ORIGINAL',
    title: 'Ferrari SF90 Stradale 20" Forged Diamond-Cut',
    desc: "Official Ferrari Maranello forged lightweight alloy wheel. Precision milled from 6061-T6 aluminum with Scuderia Giallo Modena center cap and Brembo CCM brake clearance.",
    defaultImage: 'assets/wheel_ferrari_silver.jpg',
    finishImages: {
      'silver': 'assets/wheel_ferrari_silver.jpg',
      'gold': 'assets/wheel_lambo_gold.jpg',
      'rose-gold': 'assets/wheel_rose_gold.jpg',
      'black': 'assets/wheel_bugatti_black.jpg',
      'chrome': 'assets/wheel_chrome.jpg'
    },
    specs: [{ label: 'WEIGHT', val: '8.4 KG' }, { label: 'SIZE', val: '20" / 21"' }, { label: 'BOLT PATTERN', val: '5x114.3 / C-Lock' }],
    defaultFinish: 'silver',
    detailedSpecs: [
      { prop: 'PART NUMBER', val: 'Ferrari OEM #342891-CORSA' },
      { prop: 'MATERIAL', val: 'Forged 6061-T6 Aerospace Aluminum' },
      { prop: 'FRONT FITMENT', val: '20" x 9.5J ET35' },
      { prop: 'REAR FITMENT', val: '21" x 12.0J ET42' },
      { prop: 'WEIGHT DELTA', val: '-3.8 kg Per Corner vs Factory Cast' },
      { prop: 'BRAKE CLEARANCE', val: 'Ferrari 398mm Carbon Ceramic Rotors' },
      { prop: 'TIRES FITTED', val: 'Michelin Pilot Sport Cup 2 (255/35 ZR20)' },
      { prop: 'CENTER EMBLEM', val: 'Prancing Horse Giallo Modena Cap' },
      { prop: 'LOAD RATING', val: '890 kg TUV / JWL Certified' }
    ],
    compatible: ['Ferrari SF90 Stradale / Spider', 'Ferrari 296 GTB / GTS', 'Ferrari 812 Superfast / Competizione', 'Ferrari F8 Tributo', 'Ferrari Roma'],
    fittedCar: {
      name: 'Ferrari SF90 Stradale',
      subtitle: 'Assetto Fiorano // 1000 CV V8 Hybrid — Pure Supercar Studio',
      brand: 'ferrari',
      badgeClass: 'ferrari-badge',
      brandLogo: '🐎',
      type: 'turntableStudio',
      frontImg: 'assets/ferrari_sf90_fitted_wheel.png',
      rearImg: 'assets/ferrari_sf90_fitted_spoiler.png',
      fittedHeroImg: 'assets/ferrari_sf90_fitted_wheel.png',
      frontWheelHub: { x: 0.575, y: 0.638, r: 0.152 },
      rearWheelHub: { x: 0.880, y: 0.540, r: 0.098 },
      hotspot: { x: 57, y: 64, title: '20" FORGED DIAMOND-CUT', oem: 'OEM #342891-CORSA' }
    }
  },
  {
    id: 'wheel-lambo-hex',
    brand: 'lamborghini',
    brandLabel: 'LAMBORGHINI ORIGINAL',
    title: 'Lamborghini Revuelto Hex-Forged Centerlock',
    desc: "Original Sant'Agata Bolognese factory forged alloy wheel in 24K Champagne Gold. Features sharp hexagonal spoke geometry and racing centerlock spindle mount.",
    defaultImage: 'assets/wheel_lambo_gold.jpg',
    finishImages: {
      'gold': 'assets/wheel_lambo_gold.jpg',
      'silver': 'assets/wheel_ferrari_silver.jpg',
      'rose-gold': 'assets/wheel_rose_gold.jpg',
      'black': 'assets/wheel_bugatti_black.jpg',
      'chrome': 'assets/wheel_chrome.jpg'
    },
    specs: [{ label: 'WEIGHT', val: '8.8 KG' }, { label: 'SIZE', val: '20" / 21" / 22"' }, { label: 'CENTERLOCK', val: 'OEM Compatible' }],
    defaultFinish: 'gold',
    detailedSpecs: [
      { prop: 'PART NUMBER', val: 'Lamborghini OEM #4M0601-HEX' },
      { prop: 'MATERIAL', val: 'Forged 6061-T6 Monoblock' },
      { prop: 'FRONT FITMENT', val: '20" x 9.5J Centerlock' },
      { prop: 'REAR FITMENT', val: '21" x 12.5J Centerlock' },
      { prop: 'FINISH COAT', val: '24K Champagne Gold High-Lustre Clear' },
      { prop: 'BRAKE CLEARANCE', val: 'Brembo Carbon CCM-R 400mm Calipers' },
      { prop: 'TIRES FITTED', val: 'Michelin Pilot Sport Cup 2 R' },
      { prop: 'LOAD CAPACITY', val: '920 kg High-Downforce Approved' }
    ],
    compatible: ['Lamborghini Revuelto V12 Hybrid', 'Lamborghini Huracán STO / Tecnica', 'Lamborghini Aventador SVJ', 'Lamborghini Urus Performante'],
    fittedCar: {
      name: 'Lamborghini Revuelto',
      subtitle: "Sant'Agata Bolognese // 1015 CV V12 Hybrid",
      brand: 'lamborghini',
      badgeClass: 'lambo-badge',
      brandLogo: '🐂',
      type: 'turntableStudio',
      frontImg: 'assets/lambo_revuelto_fitted_wheel.jpg',
      rearImg: 'assets/lambo_revuelto_fitted_spoiler.jpg',
      fittedHeroImg: 'assets/lambo_revuelto_fitted_wheel.jpg',
      frontWheelHub: { x: 0.582, y: 0.600, r: 0.150 },
      rearWheelHub: { x: 0.902, y: 0.535, r: 0.100 },
      hotspot: { x: 58, y: 60, title: 'HEX-FORGED CENTERLOCK', oem: 'OEM #4M0601-HEX' }
    }
  },
  {
    id: 'wheel-bugatti-w16',
    brand: 'bugatti',
    brandLabel: 'BUGATTI ORIGINAL',
    title: 'Bugatti Chiron Pur Sport W16 Turbine Aero',
    desc: 'Original Molsheim factory magnesium-alloy turbine wheel in Obsidian Satin Black. Engineered for 450+ km/h aerodynamic cooling and French Racing Blue brake clearance.',
    defaultImage: 'assets/wheel_bugatti_black.jpg',
    finishImages: {
      'black': 'assets/wheel_bugatti_black.jpg',
      'silver': 'assets/wheel_ferrari_silver.jpg',
      'gold': 'assets/wheel_lambo_gold.jpg',
      'rose-gold': 'assets/wheel_rose_gold.jpg',
      'chrome': 'assets/wheel_chrome.jpg'
    },
    specs: [{ label: 'LOAD RATING', val: '1,150 KG' }, { label: 'MAX SPEED', val: '450+ KM/H' }, { label: 'SIZE', val: '20" Front / 21" Rear' }],
    defaultFinish: 'black',
    detailedSpecs: [
      { prop: 'PART NUMBER', val: 'Bugatti OEM #BUG-79011-TURBINE' },
      { prop: 'MATERIAL', val: 'Ultra-High Tensile Forged Billet' },
      { prop: 'AERO FUNCTION', val: 'Active Turbine Heat Evacuation' },
      { prop: 'FRONT FITMENT', val: '20" x 10.0J High-Torque' },
      { prop: 'REAR FITMENT', val: '21" x 13.5J High-Torque' },
      { prop: 'CENTER CAP', val: 'Ettore Bugatti (EB) Royal Blue Enamel' },
      { prop: 'TIRES FITTED', val: 'Michelin Pilot Sport Cup 2R Bugatti Specific' },
      { prop: 'SPEED CERTIFIED', val: 'V-Max 490.48 km/h Rated' }
    ],
    compatible: ['Bugatti Chiron / Chiron Super Sport 300+', 'Bugatti Tourbillon V16 Hybrid', 'Bugatti Divo', 'Bugatti Bolide'],
    fittedCar: {
      name: 'Bugatti Chiron Pur Sport',
      subtitle: 'Molsheim Atelier // 1500 PS W16 Quad-Turbo',
      brand: 'bugatti',
      badgeClass: 'bugatti-badge',
      brandLogo: '⚡',
      type: 'turntableStudio',
      frontImg: 'assets/bugatti_chiron_fitted_wheel.jpg',
      rearImg: 'assets/spoiler_bugatti_airbrake.jpg',
      fittedHeroImg: 'assets/bugatti_chiron_fitted_wheel.jpg',
      frontWheelHub: { x: 0.605, y: 0.580, r: 0.145 },
      rearWheelHub: { x: 0.842, y: 0.505, r: 0.095 },
      hotspot: { x: 61, y: 58, title: 'W16 TURBINE AERO WHEEL', oem: 'OEM #BUG-79011-TURBINE' }
    }
  },
  {
    id: 'wheel-ferrari-apex',
    brand: 'ferrari',
    brandLabel: 'FERRARI ORIGINAL',
    title: 'Ferrari Daytona SP3 Apex Centerlock',
    desc: 'Official Ferrari Icona series centerlock track forged wheel in Bespoke Copper Rose Gold. Direct motorsport spindle with reduced gyroscopic rotational inertia.',
    defaultImage: 'assets/wheel_rose_gold.jpg',
    finishImages: {
      'rose-gold': 'assets/wheel_rose_gold.jpg',
      'silver': 'assets/wheel_ferrari_silver.jpg',
      'gold': 'assets/wheel_lambo_gold.jpg',
      'black': 'assets/wheel_bugatti_black.jpg',
      'chrome': 'assets/wheel_chrome.jpg'
    },
    specs: [{ label: 'WEIGHT', val: '7.9 KG' }, { label: 'FINISH', val: 'Bespoke Copper Rose' }, { label: 'SERIES', val: 'Icona Motorsport' }],
    defaultFinish: 'rose-gold',
    detailedSpecs: [
      { prop: 'PART NUMBER', val: 'Ferrari OEM #SP3-88210-APEX' },
      { prop: 'MATERIAL', val: 'Aerospace Forged Magnesium Composite' },
      { prop: 'FRONT FITMENT', val: '20" x 9.5J Racing Centerlock' },
      { prop: 'REAR FITMENT', val: '21" x 12.5J Racing Centerlock' },
      { prop: 'ROTATIONAL INERTIA', val: '-19% Acceleration Throttle Response' },
      { prop: 'COATING', val: 'Electro-Chemical Rose Gold PVD Lustre' },
      { prop: 'CENTRAL NUT', val: 'Anodized Red Aluminum Safety Locking Pin' },
      { prop: 'CALIPER COMPATIBILITY', val: 'Ferrari Grembo Extrema 6-Pot' }
    ],
    compatible: ['Ferrari Daytona SP3', 'Ferrari SF90 Stradale / Spider', 'Ferrari 296 GTB Assetto Fiorano', 'Ferrari 488 Pista'],
    fittedCar: {
      name: 'Ferrari SF90 Stradale',
      subtitle: 'Assetto Fiorano // Fitted with Rose Gold Apex Forged',
      brand: 'ferrari',
      badgeClass: 'ferrari-badge',
      brandLogo: '🐎',
      type: 'turntableStudio',
      frontImg: 'assets/ferrari_sf90_fitted_wheel.png',
      rearImg: 'assets/ferrari_sf90_fitted_spoiler.png',
      fittedHeroImg: 'assets/ferrari_sf90_fitted_wheel.png',
      frontWheelHub: { x: 0.575, y: 0.638, r: 0.152 },
      rearWheelHub: { x: 0.880, y: 0.540, r: 0.098 },
      hotspot: { x: 57, y: 64, title: 'APEX CENTERLOCK FORGED', oem: 'OEM #SP3-88210-APEX' }
    }
  },
  {
    id: 'wheel-lambo-superleggera',
    brand: 'lamborghini',
    brandLabel: 'LAMBORGHINI ORIGINAL',
    title: 'Lamborghini Aventador SVJ Mirror Chrome Forged',
    desc: 'Official Lamborghini factory mirror polished high-chrome forged alloy wheel. Designed with signature Y-spoke profile for high-speed aerodynamics.',
    defaultImage: 'assets/wheel_chrome.jpg',
    finishImages: {
      'chrome': 'assets/wheel_chrome.jpg',
      'silver': 'assets/wheel_ferrari_silver.jpg',
      'gold': 'assets/wheel_lambo_gold.jpg',
      'rose-gold': 'assets/wheel_rose_gold.jpg',
      'black': 'assets/wheel_bugatti_black.jpg'
    },
    specs: [{ label: 'WEIGHT', val: '8.6 KG' }, { label: 'FINISH', val: 'Mirror Chrome' }, { label: 'SPOKES', val: 'Directional Y-Spoke' }],
    defaultFinish: 'chrome',
    detailedSpecs: [
      { prop: 'PART NUMBER', val: 'Lamborghini OEM #4T0601-SVJ' },
      { prop: 'MATERIAL', val: 'Forged Aluminum Billet // Mirror Buffed' },
      { prop: 'FRONT FITMENT', val: '20" x 9.0J ET40 Centerlock' },
      { prop: 'REAR FITMENT', val: '21" x 13.0J ET66 Centerlock' },
      { prop: 'SURFACE PROCESS', val: 'Triple Nickel-Chromium Electro-Dip' },
      { prop: 'CENTRAL CAP', val: 'Black Raging Bull 3D Metal Crest' },
      { prop: 'BRAKE SETUP', val: 'Lamborghini CCB Carbon Ceramic System' }
    ],
    compatible: ['Lamborghini Aventador SVJ / Ultimae', 'Lamborghini Huracán Tecnica / EVO', 'Lamborghini Revuelto V12 Hybrid'],
    fittedCar: {
      name: 'Lamborghini Revuelto',
      subtitle: "Sant'Agata Bolognese // Fitted with Chrome Y-Forged Rims",
      brand: 'lamborghini',
      badgeClass: 'lambo-badge',
      brandLogo: '🐂',
      type: 'turntableStudio',
      frontImg: 'assets/lambo_revuelto_fitted_wheel.jpg',
      rearImg: 'assets/lambo_revuelto_fitted_spoiler.jpg',
      fittedHeroImg: 'assets/lambo_revuelto_fitted_wheel.jpg',
      frontWheelHub: { x: 0.582, y: 0.600, r: 0.150 },
      rearWheelHub: { x: 0.902, y: 0.535, r: 0.100 },
      hotspot: { x: 58, y: 60, title: 'MIRROR CHROME FORGED', oem: 'OEM #4T0601-SVJ' }
    }
  },
  {
    id: 'wheel-ferrari-fitted',
    brand: 'ferrari',
    brandLabel: 'FERRARI ON-CAR FITTED',
    title: 'Ferrari SF90 Showroom Wheel Assembly',
    desc: 'Direct camera inspection shot of the authentic 20" Forged Diamond-Cut wheel mounted on the Ferrari SF90 Stradale in the Maranello showroom with carbon brake assembly.',
    defaultImage: 'assets/ferrari_sf90_fitted_wheel.png',
    finishImages: {
      'silver': 'assets/ferrari_sf90_fitted_wheel.png',
      'gold': 'assets/wheel_lambo_gold.jpg',
      'rose-gold': 'assets/wheel_rose_gold.jpg',
      'black': 'assets/wheel_bugatti_black.jpg',
      'chrome': 'assets/wheel_chrome.jpg'
    },
    specs: [{ label: 'CAMERA ANGLE', val: 'Showroom Zoom' }, { label: 'STATUS', val: 'Factory Fitted' }, { label: 'BRAKE', val: 'Brembo Carbon' }],
    defaultFinish: 'silver',
    detailedSpecs: [
      { prop: 'VEHICLE', val: 'Ferrari SF90 Stradale Assetto Fiorano' },
      { prop: 'WHEEL ASSEMBLY', val: '20" Forged Diamond-Cut Factory Option' },
      { prop: 'BRAKE SYSTEM', val: 'Brembo 398mm Carbon Ceramic Discs' },
      { prop: 'CALIPERS', val: 'Rosso Scuderia 6-Piston Monobloc' },
      { prop: 'CENTER CAP', val: 'Original Ferrari Giallo Modena Emblem' },
      { prop: 'SOURCE', val: 'Original Studio Photography' }
    ],
    compatible: ['Ferrari SF90 Stradale', 'Ferrari SF90 Spider', 'Ferrari 296 GTB'],
    fittedCar: {
      name: 'Ferrari SF90 Stradale',
      subtitle: 'Showroom Mounted Spec // Maranello Atelier',
      brand: 'ferrari',
      badgeClass: 'ferrari-badge',
      brandLogo: '🐎',
      type: 'turntableStudio',
      frontImg: 'assets/ferrari_sf90_fitted_wheel.png',
      rearImg: 'assets/ferrari_sf90_fitted_spoiler.png',
      fittedHeroImg: 'assets/ferrari_sf90_fitted_wheel.png',
      frontWheelHub: { x: 0.575, y: 0.638, r: 0.152 },
      rearWheelHub: { x: 0.880, y: 0.540, r: 0.098 },
      hotspot: { x: 57, y: 64, title: 'ORIGINAL SF90 WHEEL ASSEMBLY', oem: 'OEM #342891-CORSA' }
    }
  }
];

const SPOILERS = [
  {
    id: 'spoiler-ferrari-gurney',
    brand: 'ferrari',
    brandLabel: 'FERRARI ORIGINAL',
    title: 'Ferrari SF90 Active Shut-Off Gurney Carbon Wing',
    desc: 'Original Ferrari Maranello pre-preg dry carbon active rear wing. Electro-actuated shut-off flap shifts under 200ms between Low Drag (LD) and High Downforce (HD) modes.',
    image: 'assets/spoiler_ferrari_active.jpg',
    downforce: '390 KG @ 250 KM/H',
    specs: [{ label: 'ACTUATION', val: '<200ms Dual Servo' }, { label: 'MATERIAL', val: 'Pre-Preg Carbon' }, { label: 'DOWNFORCE', val: '390 KG' }],
    detailedSpecs: [
      { prop: 'ORIGINAL PART', val: 'Ferrari Genuine #SF90-AERO-01' },
      { prop: 'DOWNFORCE AT 250 KM/H', val: '390 kg (High Downforce Mode)' },
      { prop: 'LOW DRAG TRANSITION', val: 'Reduces Drag by 32% on High-Speed Straights' },
      { prop: 'MATERIAL', val: 'Autoclaved High-Modulus Pre-Preg Carbon Fiber' },
      { prop: 'ACTUATOR MOTORS', val: 'Twin High-Speed Brushless Servos (<200ms Shift)' },
      { prop: 'WEIGHT', val: '2.9 kg Total Assembly' },
      { prop: 'ENDPLATE BADGING', val: 'Prancing Horse & SF90 Inset Carbon Emblems' },
      { prop: 'WIND TUNNEL CERT', val: 'Maranello Aerodynamic Wind Tunnel Calibrated' }
    ],
    compatible: ['Ferrari SF90 Stradale / Spider', 'Ferrari 296 GTB / GTS Assetto', 'Ferrari F8 Tributo', 'Ferrari 488 Pista'],
    fittedCar: {
      name: 'Ferrari SF90 Stradale',
      subtitle: 'Active Shut-Off Aerodynamics // Maranello Atelier',
      brand: 'ferrari',
      badgeClass: 'ferrari-badge',
      brandLogo: '🐎',
      type: 'turntableStudio',
      frontImg: 'assets/ferrari_sf90_fitted_wheel.png',
      rearImg: 'assets/ferrari_sf90_fitted_spoiler.png',
      fittedHeroImg: 'assets/ferrari_sf90_fitted_spoiler.png',
      frontWheelHub: { x: 0.575, y: 0.638, r: 0.152 },
      rearWheelHub: { x: 0.880, y: 0.540, r: 0.098 },
      hotspot: { x: 48, y: 44, title: 'ACTIVE SHUT-OFF GURNEY FLAP', oem: 'OEM #SF90-AERO-01' }
    }
  },
  {
    id: 'spoiler-lambo-trofeo',
    brand: 'lamborghini',
    brandLabel: 'LAMBORGHINI ORIGINAL',
    title: 'Lamborghini Huracán STO Swan-Neck Carbon GT Wing',
    desc: 'Official Lamborghini Squadra Corse carbon fiber GT wing with billet aluminum swan-neck pylons. High-downforce airfoil generating 550kg of cornering downforce.',
    image: 'assets/spoiler_lambo_swan_neck.jpg',
    downforce: '550 KG @ 280 KM/H',
    specs: [{ label: 'ATTACK ANGLE', val: '0° to +14° Manual' }, { label: 'WEIGHT', val: '4.2 KG Complete' }, { label: 'AERO BALANCE', val: '+34% Rear Grip' }],
    detailedSpecs: [
      { prop: 'ORIGINAL PART', val: 'Lamborghini Squadra Corse #4T0827-STO' },
      { prop: 'DOWNFORCE AT 280 KM/H', val: '550 kg (Maximum Attack Position)' },
      { prop: 'MOUNTING SYSTEM', val: 'CNC Billet Aircraft Aluminum Swan-Neck Pylons' },
      { prop: 'BLADE COMPOSITION', val: 'Full Carbon Fiber Monocoque with Foam Core' },
      { prop: 'ENDPLATES', val: 'STO Squadra Corse Crest Carbon Endplates' },
      { prop: 'ADJUSTABILITY', val: '3-Position Manual Attack Angle (Low / Mid / High)' },
      { prop: 'WEIGHT', val: '4.2 kg (Including CNC Pylons & Hardware)' }
    ],
    compatible: ['Lamborghini Huracán STO / Tecnica', 'Lamborghini Revuelto V12 Hybrid', 'Lamborghini Huracán EVO', 'Lamborghini Aventador SVJ'],
    fittedCar: {
      name: 'Lamborghini Revuelto',
      subtitle: "Squadra Corse GT Aerodynamics // Sant'Agata",
      brand: 'lamborghini',
      badgeClass: 'lambo-badge',
      brandLogo: '🐂',
      type: 'turntableStudio',
      frontImg: 'assets/lambo_revuelto_fitted_wheel.jpg',
      rearImg: 'assets/lambo_revuelto_fitted_spoiler.jpg',
      fittedHeroImg: 'assets/lambo_revuelto_fitted_spoiler.jpg',
      frontWheelHub: { x: 0.582, y: 0.600, r: 0.150 },
      rearWheelHub: { x: 0.902, y: 0.535, r: 0.100 },
      hotspot: { x: 67, y: 35, title: 'SWAN-NECK CARBON GT WING', oem: 'OEM #4T0827-STO' }
    }
  },
  {
    id: 'spoiler-bugatti-airbrake',
    brand: 'bugatti',
    brandLabel: 'BUGATTI ORIGINAL',
    title: 'Bugatti Chiron Super Sport Hydraulic Airbrake Wing',
    desc: 'Authentic Bugatti Molsheim carbon fiber active hydraulic rear wing. Dual telescopic pistons deploy up to a 49-degree airbrake posture with 750kg stopping downforce.',
    image: 'assets/spoiler_bugatti_airbrake.jpg',
    downforce: '750 KG @ 350 KM/H',
    specs: [{ label: 'AIRBRAKE ANGLE', val: 'Up to 49° Tilt' }, { label: 'HYDRAULICS', val: 'Dual Piston Ram' }, { label: 'TOP SPEED DRS', val: '0° Top Speed' }],
    detailedSpecs: [
      { prop: 'ORIGINAL PART', val: 'Bugatti Atelier Genuine #CHIRON-AERO-AIRBRAKE' },
      { prop: 'AIRBRAKE LOAD AT 350 KM/H', val: '750 kg Dynamic Deceleration Load' },
      { prop: 'ACTUATION SYSTEM', val: 'Dual Electro-Hydraulic Telescopic Pistons' },
      { prop: 'ACCENTS', val: 'Exposed Gloss Carbon Weave with French Racing Blue Pinstripes' },
      { prop: 'MODES', val: 'EB (Standard), Handling (Downforce), Top Speed (DRS), Airbrake' },
      { prop: 'CONSTRUCTION', val: 'Aerospace-Grade Carbon Composite & Titanium Hinges' }
    ],
    compatible: ['Bugatti Chiron / Chiron Sport', 'Bugatti Chiron Super Sport 300+', 'Bugatti Tourbillon V16', 'Bugatti Divo'],
    fittedCar: {
      name: 'Bugatti Chiron Super Sport',
      subtitle: 'Hydraulic Airbrake System // Molsheim Atelier',
      brand: 'bugatti',
      badgeClass: 'bugatti-badge',
      brandLogo: '⚡',
      type: 'turntableStudio',
      frontImg: 'assets/bugatti_chiron_fitted_wheel.jpg',
      rearImg: 'assets/spoiler_bugatti_airbrake.jpg',
      fittedHeroImg: 'assets/spoiler_bugatti_airbrake.jpg',
      frontWheelHub: { x: 0.605, y: 0.580, r: 0.145 },
      rearWheelHub: { x: 0.842, y: 0.505, r: 0.095 },
      hotspot: { x: 50, y: 38, title: 'ACTIVE HYDRAULIC AIRBRAKE WING', oem: 'OEM #CHIRON-AERO-AIRBRAKE' }
    }
  },
  {
    id: 'spoiler-ferrari-ducktail',
    brand: 'ferrari',
    brandLabel: 'FERRARI ORIGINAL',
    title: 'Ferrari 812 Competizione Carbon Rear Spoiler',
    desc: 'Official Maranello OEM carbon fiber trunk spoiler plinth assembly. High-kick aerodynamic rear blade that optimizes high-speed rear axle vortex distribution.',
    image: 'assets/spoiler_ferrari_ducktail.jpg',
    downforce: '280 KG @ 240 KM/H',
    specs: [{ label: 'WEIGHT', val: '1.8 KG' }, { label: 'WEAVE', val: '2x2 Twill High-Gloss' }, { label: 'MOUNT', val: 'Trunkline OEM' }],
    detailedSpecs: [
      { prop: 'ORIGINAL PART', val: 'Ferrari OEM #812-COMP-SPOILER-CARB' },
      { prop: 'DOWNFORCE AT 240 KM/H', val: '280 kg High-Speed Stance' },
      { prop: 'BADGE', val: 'Ferrari Yellow Prancing Horse Inset Medallion' },
      { prop: 'MATERIAL', val: 'Dry Pre-Preg Carbon Fiber with UV-Protective Clearcoat' },
      { prop: 'INSTALLATION', val: 'Direct OEM Factory Bolt-on Mounting' },
      { prop: 'WEIGHT', val: '1.8 kg Ultra-Lightweight' }
    ],
    compatible: ['Ferrari 812 Competizione / Superfast', 'Ferrari Roma / Roma Spider', 'Ferrari F8 Tributo', 'Ferrari Portofino M'],
    fittedCar: {
      name: 'Ferrari SF90 Stradale',
      subtitle: 'High-Downforce Aero Package // Maranello',
      brand: 'ferrari',
      badgeClass: 'ferrari-badge',
      brandLogo: '🐎',
      type: 'turntableStudio',
      frontImg: 'assets/ferrari_sf90_fitted_wheel.png',
      rearImg: 'assets/ferrari_sf90_fitted_spoiler.png',
      fittedHeroImg: 'assets/ferrari_sf90_fitted_spoiler.png',
      frontWheelHub: { x: 0.575, y: 0.638, r: 0.152 },
      rearWheelHub: { x: 0.880, y: 0.540, r: 0.098 },
      hotspot: { x: 48, y: 44, title: '812 COMPETIZIONE REAR PLINTH', oem: 'OEM #812-COMP-SPOILER-CARB' }
    }
  },
  {
    id: 'spoiler-lambo-ala',
    brand: 'lamborghini',
    brandLabel: 'LAMBORGHINI ORIGINAL',
    title: 'Lamborghini Aventador SVJ ALA 2.0 Forged Carbon Wing',
    desc: "Official Sant'Agata Bolognese factory ALA 2.0 active forged carbon fiber rear wing. Internal micro-flap vectoring channels air to the left or right side in cornering.",
    image: 'assets/spoiler_lambo_ala.jpg',
    downforce: '490 KG @ 260 KM/H',
    specs: [{ label: 'AERO VECTORING', val: 'Active Left / Right' }, { label: 'MATERIAL', val: 'Forged Carbon Matrix' }, { label: 'DRAG DELTA', val: '-28% in Low Drag' }],
    detailedSpecs: [
      { prop: 'ORIGINAL PART', val: 'Lamborghini ALA 2.0 #SVJ-AERODINAMICA-ATTIVA' },
      { prop: 'DOWNFORCE AT 260 KM/H', val: '490 kg Peak Cornering Load' },
      { prop: 'INTERNAL FLAPS', val: 'Electro-Magnetic Actuation (<500ms Response)' },
      { prop: 'MATERIAL COMPOSITION', val: 'Forged Carbon Fiber Composite Matrix' },
      { prop: 'INSCRIPTION', val: 'Embossed ALA 2.0 & Lamborghini Script' },
      { prop: 'WEIGHT', val: '3.6 kg Complete Module' }
    ],
    compatible: ['Lamborghini Aventador SVJ / Ultimae', 'Lamborghini Huracán Performante', 'Lamborghini Revuelto V12 Hybrid'],
    fittedCar: {
      name: 'Lamborghini Revuelto',
      subtitle: "Aerodinamica Lamborghini Attiva 2.0 // Sant'Agata",
      brand: 'lamborghini',
      badgeClass: 'lambo-badge',
      brandLogo: '🐂',
      type: 'turntableStudio',
      frontImg: 'assets/lambo_revuelto_fitted_wheel.jpg',
      rearImg: 'assets/lambo_revuelto_fitted_spoiler.jpg',
      fittedHeroImg: 'assets/lambo_revuelto_fitted_spoiler.jpg',
      frontWheelHub: { x: 0.582, y: 0.600, r: 0.150 },
      rearWheelHub: { x: 0.902, y: 0.535, r: 0.100 },
      hotspot: { x: 67, y: 35, title: 'ALA 2.0 FORGED CARBON WING', oem: 'OEM #SVJ-AERODINAMICA-ATTIVA' }
    }
  },
  {
    id: 'spoiler-ferrari-fitted',
    brand: 'ferrari',
    brandLabel: 'FERRARI ON-CAR FITTED',
    title: 'Ferrari SF90 Showroom Active Aero Wing Assembly',
    desc: 'Direct camera inspection shot of the authentic Ferrari SF90 carbon active rear wing mounted on the vehicle in the Maranello showroom, showing the aerodynamic integration.',
    image: 'assets/ferrari_sf90_fitted_spoiler.png',
    downforce: '390 KG @ 250 KM/H',
    specs: [{ label: 'CAMERA ANGLE', val: 'Rear Close-up' }, { label: 'STATUS', val: 'Factory Installed' }, { label: 'CAR', val: 'Ferrari SF90' }],
    detailedSpecs: [
      { prop: 'VEHICLE', val: 'Ferrari SF90 Stradale' },
      { prop: 'COMPONENT', val: 'Active Rear Aerodynamic Wing & Inconel Exhaust Deck' },
      { prop: 'FINISH', val: 'Gloss Carbon Fiber with Rosso Corsa Body Integration' },
      { prop: 'AERO REGULATION', val: 'Dynamic High Downforce Stance' },
      { prop: 'SOURCE', val: 'Original Studio Photography' }
    ],
    compatible: ['Ferrari SF90 Stradale', 'Ferrari SF90 Spider'],
    fittedCar: {
      name: 'Ferrari SF90 Stradale',
      subtitle: 'Factory Mounted Dynamic Wing Assembly',
      brand: 'ferrari',
      badgeClass: 'ferrari-badge',
      brandLogo: '🐎',
      type: 'turntableStudio',
      frontImg: 'assets/ferrari_sf90_fitted_wheel.png',
      rearImg: 'assets/ferrari_sf90_fitted_spoiler.png',
      fittedHeroImg: 'assets/ferrari_sf90_fitted_spoiler.png',
      frontWheelHub: { x: 0.575, y: 0.638, r: 0.152 },
      rearWheelHub: { x: 0.880, y: 0.540, r: 0.098 },
      hotspot: { x: 48, y: 44, title: 'SF90 ACTIVE REAR WING ASSEMBLY', oem: 'OEM #SF90-AERO-01' }
    }
  }
];


const EXHAUSTS = [
  {
    id: 'exhaust-ducati-panigale',
    brand: 'ducati',
    brandLabel: 'DUCATI CORSE ORIGINAL',
    title: 'Ducati Panigale V4 Akrapovič Full Titanium Racing Exhaust',
    desc: 'Official Ducati Corse racing exhaust manufactured by Akrapovič. Dual low-mount slash-cut silencers engineered exclusively for the Desmosedici Stradale V4 engine with dedicated racing ECU map.',
    image: 'assets/bike_ducati_panigale_v4.png',
    video: 'ducati panigale/ducati panigale.mp4',
    videoPoster: 'assets/bike_ducati_panigale_v4.png',
    exhaustType: 'Under-Belly Dual Slash-Cut Titanium',
    soundLevel: '108 dB Track Spec',
    specs: [
      { label: 'WEIGHT DELTA', val: '-6.2 KG' },
      { label: 'POWER GAIN', val: '+12.5 HP' },
      { label: 'MATERIAL', val: 'Full Titanium' }
    ],
    detailedSpecs: [
      { prop: 'PART NUMBER', val: 'Ducati OEM #96481381A' },
      { prop: 'SYSTEM TYPE', val: 'Full Racing System (Headers + Underbelly Silencers)' },
      { prop: 'MATERIAL', val: 'Proprietary High-Temp Grade Titanium' },
      { prop: 'CARBON DETAILS', val: 'Pre-Preg Carbon Fiber Heat Shields Included' },
      { prop: 'WEIGHT DELTA', val: '-6.2 kg (-48% reduction vs stock exhaust)' },
      { prop: 'POWER OUTPUT', val: '+12.5 hp @ 13,500 rpm / +7% midrange torque' },
      { prop: 'ECU CALIBRATION', val: 'Ducati Corse Dedicated Race Map Key Included' },
      { prop: 'DB KILLERS', val: 'Removable 102 dB Sound Dampening Inserts' }
    ],
    compatible: ['Ducati Panigale V4', 'Ducati Panigale V4 S', 'Ducati Panigale V4 R', 'Ducati Streetfighter V4 / V4 SP'],
    fittedCar: {
      name: 'Ducati Panigale V4 S',
      subtitle: 'Borgo Panigale // 1,103cc Desmosedici Stradale V4 (214 HP)',
      brand: 'ducati',
      badgeClass: 'ducati-badge',
      brandLogo: '🏍️',
      type: 'turntableStudio',
      frontImg: 'assets/bike_ducati_panigale_v4.png',
      rearImg: 'assets/bike_ducati_panigale_v4.png',
      fittedHeroImg: 'assets/bike_ducati_panigale_v4.png',
      video: 'ducati panigale/ducati panigale.mp4',
      frontWheelHub: { x: 0.65, y: 0.70, r: 0.16 },
      hotspot: { x: 55, y: 72, title: 'AKRAPOVIČ TITANIUM DUAL EXHAUST', oem: 'OEM #96481381A' }
    }
  },
  {
    id: 'exhaust-bmw-m1000rr',
    brand: 'bmw',
    brandLabel: 'BMW MOTORRAD M ORIGINAL',
    title: 'BMW M 1000 RR Akrapovič M-Performance Titanium Hex Exhaust',
    desc: 'Official BMW Motorrad M-Performance titanium exhaust system. Features hydroformed conical collectors, hexagonal carbon end-cap, and laser-etched BMW M logo.',
    image: 'assets/bike_bmw_m1000rr.png',
    video: 'bmw m 1000 rr/bmw m 100 rr.mp4',
    videoPoster: 'assets/bike_bmw_m1000rr.png',
    exhaustType: 'High-Mount Titanium Hexagonal with Carbon End-Cap',
    soundLevel: '105 dB High-Rev Roar',
    specs: [
      { label: 'WEIGHT DELTA', val: '-5.4 KG' },
      { label: 'POWER GAIN', val: '+10.8 HP' },
      { label: 'MATERIAL', val: 'Aerospace Titanium' }
    ],
    detailedSpecs: [
      { prop: 'PART NUMBER', val: 'BMW Motorrad M OEM #77119468500' },
      { prop: 'SYSTEM TYPE', val: '4-into-2-into-1 High-Mount Racing Manifold & Silencer' },
      { prop: 'MATERIAL', val: 'Special High-Durability Titanium Alloy' },
      { prop: 'END CAP', val: 'M-Performance Autoclaved Carbon End-Cap' },
      { prop: 'WEIGHT DELTA', val: '-5.4 kg vs factory stainless catalytic unit' },
      { prop: 'POWER GAIN', val: '+10.8 hp @ 14,000 rpm' },
      { prop: 'TORQUE DELTA', val: '+8.2 Nm across 7,000 - 11,000 rpm' },
      { prop: 'HOMOLOGATION', val: 'FIM Superbike World Championship Approved' }
    ],
    compatible: ['BMW M 1000 RR (2021-2025)', 'BMW S 1000 RR (K67)', 'BMW M 1000 R', 'BMW S 1000 R'],
    fittedCar: {
      name: 'BMW M 1000 RR Competition',
      subtitle: 'Munich M Division // 999cc ShiftCam Inline-4 (212 HP)',
      brand: 'bmw',
      badgeClass: 'bmw-badge',
      brandLogo: '🏁',
      type: 'turntableStudio',
      frontImg: 'assets/bike_bmw_m1000rr.png',
      rearImg: 'assets/bike_bmw_m1000rr.png',
      fittedHeroImg: 'assets/bike_bmw_m1000rr.png',
      video: 'bmw m 1000 rr/bmw m 100 rr.mp4',
      frontWheelHub: { x: 0.72, y: 0.65, r: 0.16 },
      hotspot: { x: 26, y: 58, title: 'M-PERFORMANCE TITANIUM EXHAUST', oem: 'OEM #77119468500' }
    }
  },
  {
    id: 'exhaust-kawasaki-h2',
    brand: 'kawasaki',
    brandLabel: 'KAWASAKI RACING ORIGINAL',
    title: 'Kawasaki Ninja H2 Supercharged Megaphone Flame Exhaust',
    desc: 'Ultra-lightweight slash-cut megaphone racing exhaust for the supercharged Kawasaki Ninja H2. Unlocks the unfiltered supercharger turbine flutter and high-flow flame expulsion.',
    image: 'assets/bike_kawasaki_ninja_h2.png',
    video: 'Ninja h2/ninja h2.mp4',
    videoPoster: 'assets/bike_kawasaki_ninja_h2.png',
    exhaustType: 'Shorty Slash-Cut Supercharged Megaphone System',
    soundLevel: '112 dB Supercharged Scream',
    specs: [
      { label: 'WEIGHT DELTA', val: '-7.1 KG' },
      { label: 'POWER GAIN', val: '+16.4 HP' },
      { label: 'MATERIAL', val: 'Hand-TIG Titanium' }
    ],
    detailedSpecs: [
      { prop: 'PART NUMBER', val: 'Kawasaki Performance OEM #99994-0847' },
      { prop: 'SYSTEM TYPE', val: 'Decat Supercharged Race Slip-On & Link Pipe' },
      { prop: 'MATERIAL', val: 'Hand-TIG Welded Grade 1 Titanium' },
      { prop: 'SUPERCHARGER SOUND', val: 'Acoustically tuned for centrifugal supercharger chirp' },
      { prop: 'WEIGHT DELTA', val: '-7.1 kg (Replaces heavy factory double-chamber canister)' },
      { prop: 'POWER OUTPUT', val: '+16.4 hp with ram-air boost' },
      { prop: 'HEAT SHIELD', val: 'Mirror-Coated Carbon Composite Shield' },
      { prop: 'FIRE BACKFIRE', val: 'Decat configuration with blue titanium flame expulsion' }
    ],
    compatible: ['Kawasaki Ninja H2 / H2 Carbon', 'Kawasaki Ninja H2R', 'Kawasaki Ninja H2 SX / SE', 'Kawasaki Z H2'],
    fittedCar: {
      name: 'Kawasaki Ninja H2 Carbon',
      subtitle: 'Akashi Supercharged // 998cc Supercharged Inline-4 (231 HP)',
      brand: 'kawasaki',
      badgeClass: 'kawasaki-badge',
      brandLogo: '⚡',
      type: 'turntableStudio',
      frontImg: 'assets/bike_kawasaki_ninja_h2.png',
      rearImg: 'assets/bike_kawasaki_ninja_h2.png',
      fittedHeroImg: 'assets/bike_kawasaki_ninja_h2.png',
      video: 'Ninja h2/ninja h2.mp4',
      frontWheelHub: { x: 0.68, y: 0.65, r: 0.16 },
      hotspot: { x: 26, y: 55, title: 'SUPERCHARGED MEGAPHONE EXHAUST', oem: 'OEM #99994-0847' }
    }
  }
];

if (typeof window !== 'undefined') {
  window.WHEELS = WHEELS;
  window.SPOILERS = SPOILERS;
  window.EXHAUSTS = EXHAUSTS;
}

export { WHEELS, SPOILERS, EXHAUSTS };

