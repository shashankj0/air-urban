import { IndoorDetectiveActivity } from '../types';

export const INDOOR_DETECTIVE_ACTIVITIES: IndoorDetectiveActivity[] = [
  {
    id: 'tadka_cooking',
    title: 'High-Heat Tadka & Deep Frying',
    icon: 'Flame',
    typicalPollutants: ['PM2.5 (Fine Soot)', 'Acrolein', 'Ultrafine Oil Droplets', 'VOCs'],
    exposureRisk: 'Severe',
    problemExplanation: 'When vegetable oil reaches its smoke point (~190°C–230°C), triglycerides rapidly decompose into volatile toxic aldehydes, acrolein, and millions of sub-micron oily aerosol droplets that disperse throughout the entire home.',
    immediateHack: 'Always switch on the kitchen chimney or exhaust fan BEFORE igniting the gas flame. Cover the pan with a splatter lid immediately after adding spices.',
    sustainableFix: 'Install a dedicated ducted range hood with minimum 1000 m³/hr suction and grease baffle filters, or switch to induction cooking with precise temperature control below smoke point.',
    whyItMatters: 'Cooking smoke without ventilation can spike indoor PM2.5 beyond 600 µg/m³—higher than outdoor winter smog—exposing children and homemakers to acute respiratory irritation.',
    ventilationRule: 'Keep kitchen door closed to separate living areas. Run exhaust during cooking and for 7 minutes after extinguishing the flame.'
  },
  {
    id: 'incense_agarbatti',
    title: 'Burning Agarbatti (Incense) or Dhoop',
    icon: 'Sparkles',
    typicalPollutants: ['PM2.5', 'Benzene', 'Formaldehyde', 'Carbon Monoxide', 'Polycyclic Aromatic Hydrocarbons (PAHs)'],
    exposureRisk: 'Severe',
    problemExplanation: 'Incense sticks burn through slow smoldering without flame, which causes incomplete combustion of wood powder, resins, and synthetic perfumes, releasing heavy particulate matter and carcinogenic aromatics.',
    immediateHack: 'Opt for electronic LED prayer lamps, waterless flower offerings, or unheated essential oil aroma stones. If burning incense is customary, place it near a dedicated exhaust window in an isolated space.',
    sustainableFix: 'Switch to 100% natural flower-composted, charcoal-free dhoop, or dry potpourri without combustion.',
    whyItMatters: 'Studies show burning 2 incense sticks in a closed room produces PM2.5 concentrations exceeding 300 µg/m³ within 20 minutes, directly settling in child lung airways.',
    ventilationRule: 'Never burn incense in closed, air-conditioned or winter-sealed bedrooms where families sleep.'
  },
  {
    id: 'dry_sweeping',
    title: 'Dry Broom Sweeping (Traditional Jhadu)',
    icon: 'Brush',
    typicalPollutants: ['Resuspended PM10', 'Fine Dust (PM2.5)', 'Dust Mite Allergens', 'Endotoxins'],
    exposureRisk: 'High',
    problemExplanation: 'Dry brooms flick settled dust off floor tiles into the air. While coarse grit falls back down, fine respirable particles (<10 microns) remain suspended at breathing height for up to 4 hours.',
    immediateHack: 'Damp-mop floors with a microfiber flat mop or spray a light mist of water before sweeping to bind particles.',
    sustainableFix: 'Use a sealed vacuum cleaner with a true HEPA H13 exhaust filter that traps 99.97% of particles down to 0.3 microns without blowing them back into the room.',
    whyItMatters: 'Dry sweeping re-aerosolizes biological dust and road soot, triggering sneezing, allergic rhinitis, and asthma flare-ups.',
    ventilationRule: 'Perform wet mopping in the early afternoon when outdoor air is slightly warmer and indoor humidity can stabilize.'
  },
  {
    id: 'mosquito_coils',
    title: 'Burning Mosquito Coils / Smoldering Repellents',
    icon: 'ShieldAlert',
    typicalPollutants: ['PM2.5', 'Octachlorodipropyl ether (S-2)', 'Bis(chloromethyl) ether', 'Formaldehyde'],
    exposureRisk: 'Severe',
    problemExplanation: 'Mosquito coils are formulated with pyrethroid insecticides and smoldering biomass. One coil burning over 8 hours emits the particulate matter of approximately 75 to 100 commercial cigarettes.',
    immediateHack: 'Install fine mesh insect screens on all windows and balcony doors to physically prevent mosquitoes from entering. Use bedside mosquito netting.',
    sustainableFix: 'Use ultrasonic or electric plug-in repellents with active timers, or apply child-safe plant-derived PMD/citronella balms.',
    whyItMatters: 'Nighttime inhalation of coil smoke during sleep leads to chronic airway inflammation, especially in developing children and senior citizens.',
    ventilationRule: 'Strictly zero indoor combustion in bedrooms during winter inversion.'
  },
  {
    id: 'unvented_gas_stove',
    title: 'Unvented Gas Stove & LPG Water Geysers',
    icon: 'Flame',
    typicalPollutants: ['Nitrogen Dioxide (NO2)', 'Carbon Monoxide (CO)', 'Ultrafine Particles'],
    exposureRisk: 'High',
    problemExplanation: 'Natural gas and LPG combustion produces direct nitrogen dioxide (NO2) and carbon monoxide (CO) gas. In a closed apartment, NO2 levels can rapidly surpass WHO safe 1-hour guidelines within 15 minutes.',
    immediateHack: 'Keep a kitchen window cracked slightly if exhaust fan is unavailable. Never use gas stovetops or open ovens as space heaters in winter.',
    sustainableFix: 'Transition to magnetic induction cooktops and electric BEE 5-star storage water heaters.',
    whyItMatters: 'Children living in households with unvented gas stoves have a 42% increased risk of experiencing childhood asthma symptoms.',
    ventilationRule: 'Exhaust fan must run during the entire duration of gas burner operation.'
  },
  {
    id: 'damp_clothes_indoor',
    title: 'Drying Wet Clothes Indoors with Closed Windows',
    icon: 'Droplets',
    typicalPollutants: ['Aspergillus Mold Spores', 'High Humidity (Dust Mite Proliferation)', 'VOCs from Detergent'],
    exposureRisk: 'Moderate',
    problemExplanation: 'A typical laundry load holds approximately 2 liters of water. Evaporating this moisture inside sealed rooms pushes relative humidity above 75%, creating an ideal breeding ground for toxic mold spores and dust mites.',
    immediateHack: 'Dry clothes in a balcony with mesh, or inside a dedicated laundry bathroom with the exhaust fan running continuously.',
    sustainableFix: 'Use a heat-pump or condenser tumble dryer with outdoor condensation drain, or a compact indoor dehumidifier.',
    whyItMatters: 'Airborne mold spores produce mycotoxins that cause persistent nocturnal coughing, wheezing, and sinus infections during cold weather.',
    ventilationRule: 'Ensure continuous bathroom exhaust evacuation if clothes are hung indoors.'
  },
  {
    id: 'chemical_cleaners',
    title: 'Aerosol Air Fresheners & Scented Cleaners',
    icon: 'Spray',
    typicalPollutants: ['Volatile Organic Compounds (VOCs)', 'Terpenes', 'Secondary Aerosol Formations', 'Limonene'],
    exposureRisk: 'Moderate',
    problemExplanation: 'Fragrance sprays contain terpenes like limonene and pinene. When these volatile compounds contact ambient ozone and nitrogen dioxide, they react to form microscopic secondary organic aerosols (fine smog particles) right inside your living room.',
    immediateHack: 'Substitute synthetic chemical air sprays with natural ventilation during clean hours or simmer cinnamon/orange peels in water.',
    sustainableFix: 'Clean with baking soda, diluted white vinegar, and unscented mild castile soap.',
    whyItMatters: 'Masking foul air with scented aerosols does not purify anything; it increases total toxic chemical lung burden.',
    ventilationRule: 'Never spray aerosols in unventilated or air-conditioned rooms.'
  },
  {
    id: 'unserviced_split_ac',
    title: 'Unserviced Split AC with Clogged Mesh Filters',
    icon: 'Wind',
    typicalPollutants: ['Bacterial Biofilms', 'Fungal Spores', 'Resuspended Fine Dust'],
    exposureRisk: 'Moderate',
    problemExplanation: 'Air conditioner cooling coils collect condensation and dust over months. When neglected, wet coils develop fungal microbial biofilms which blow out into room air whenever the fan starts.',
    immediateHack: 'Slide out the front nylon mesh filters every 2 weeks, rinse under warm running water, let dry completely, and reinstall.',
    sustainableFix: 'Schedule annual professional deep coil antimicrobial cleaning and consider retrofitting with electro-statically charged anti-PM2.5 pre-filter sleeves.',
    whyItMatters: 'Clean AC filters reduce indoor microbial spread and lower compressor power consumption by 12–18%.',
    ventilationRule: 'Recirculate air only in rooms where interior source pollutants have already been controlled.'
  }
];
