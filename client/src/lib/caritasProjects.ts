/**
 * Canonical list of Caritas Mutare projects and partner data.
 * Single file so the bundler can resolve it from anywhere in src/ (no data/ folder dependency).
 */

export interface CaritasProject {
  id: string;
  slug: string;
  acronym?: string;
  title_en: string;
  title_sh: string;
  summary_en: string;
  summary_sh: string;
  description_en: string;
  description_sh: string;
  donors: string[];
  partners: string[];
  donorLogoUrls?: string[];
  partnerLogoUrls?: string[];
  target: string;
  location: string;
  duration: string;
  staff?: string;
  theoryOfChange_en?: string;
  theoryOfChange_sh?: string;
  keyPathways: string[];
  route: string;
  heroImage?: string;
  heroImagePosition?: string;
  galleryImages?: string[];
  status: 'active' | 'completed' | 'ongoing';
  icon?: string;
  color?: string;
}

export const caritasProjects: CaritasProject[] = [
  {
    id: 'serarp',
    slug: 'serarp',
    acronym: 'SERARP',
    title_en: 'Social Economic Resilience and Drought Response Project',
    title_sh: 'Social Economic Resilience and Drought Response Project',
    summary_en: 'Building community resilience against drought and socio-economic vulnerabilities, with focus on women, girls, PWDs, and youth in Ward 7 Bumba.',
    summary_sh: 'Kuvaka kusimba kwenharaunda mukusagadzikana kwemamiriro ekunze uye hupfumi, nechinangwa chevakadzi, vasikana, uye vanhu vane disabilities muWard 7 Bumba.',
    description_en: `The Social Economic Resilience and Drought Response Project (SERARP), implemented by Caritas Mutare in Ward 7 Bumba, aims to build community resilience against drought and socio-economic vulnerabilities, with a special focus on women, girls, persons with disabilities (PWDs), and youth. The project integrates multi-sectoral interventions including micro-irrigation schemes, horticulture and agroforestry training, farmer capacity-building in water harvesting techniques, vocational training for youth, and establishment of community seed banks to strengthen food and income security. Additionally, the project promotes gender equality and social inclusion through gender analysis, training of Gender Champions and Change Agents, community dialogues, and awareness-raising on rights and leadership. Social accountability is enhanced through citizen monitoring and advocacy training, while women and girls are further empowered through the formation of support networks and inclusion in income savings and lending schemes (ISALs).`,
    description_sh: `SERARP inoitwa neCaritas Mutare muWard 7 Bumba, ine chinangwa chekuvaka kusimba kwenharaunda pakurwisa kusanaya kwemvura uye kusagadzikana kwehupfumi, vachinyanya kutarisira vakadzi, vasikana, vanhu vane disabilities, uye vechidiki. Chirongwa chinosanganisira micro-irrigation, ruzivo rwekurima nemiti, kudzidzisa varimi nekuchengetedza mvura, kudzidzisa vechidiki basa, uye kumisikidza mabhengi embeu enharaunda.`,
    donors: ['Oak Foundation', 'CAFOD Zimbabwe'],
    partners: ['CAFOD Zimbabwe'],
    donorLogoUrls: ['/images/partners/oak-foundation-clean.png', '/images/partners/cafod.png'],
    partnerLogoUrls: ['/images/partners/cafod.png'],
    target: '1,200 individuals',
    location: 'Ward 7 Bumba',
    duration: 'Oct 2024 – Oct 2026 (2 years)',
    staff: '6 personnel',
    theoryOfChange_en: 'If communities are equipped with sustainable agricultural practices, vocational and financial skills, access to water and productive assets, and if gender equality and inclusive participation are actively promoted through training and support structures, then women, youth and PWDs in Ward 7 will experience improved social and economic resilience, enabling them to cope better with drought shocks and socio-economic challenges.',
    theoryOfChange_sh: 'Kana nharaunda dzikapiwa nzira dzekurima dzakasimba, hunyanzvi hwebasa nemari, mvura nemidziyo yekuberekesa, uye kana kuenzana kwevanhukadzi nekubatanidzwa kwakasimudzirwa, vanhukadzi, vechidiki nePWDs muWard 7 vachawana kusimba kwehupfumi nenzanga.',
    keyPathways: [
      'Sustainable agricultural practices → food and income security',
      'Vocational and financial skills → livelihood options',
      'Gender equality and inclusion → empowered communities',
      'Community ownership and governance → long-term resilience',
    ],
    route: '/programs/serarp',
    heroImage: '/images/programs/serarp/serarp-mechanics-nyanyadzi-college.png',
    heroImagePosition: 'center 36%',
    galleryImages: [
      '/images/programs/serarp/serarp-mechanics-nyanyadzi-college.png',
      '/images/programs/serarp/serarp-plastering-class.png',
      '/images/programs/serarp/serarp-citizen-monitoring-group.png',
      '/images/programs/serarp/serarp-edutainment-refresh.png',
      '/images/programs/serarp/serarp-gender-champions-family-tree.png',
    ],
    status: 'active',
    icon: 'Agriculture',
    color: 'success.main',
  },
  {
    id: 'cetlrccap',
    slug: 'cetlrccap',
    acronym: 'CETLRCCAP',
    title_en: 'Community Empowerment Through Livelihood Resilience and Climate Change Adaptability Practices',
    title_sh: 'Community Empowerment Through Livelihood Resilience and Climate Change Adaptability Practices',
    summary_en: 'Empowering poor and marginalized communities in Makoni (Wards 27 & 30) through biodiversity conservation, natural resource management, and climate-resilient agriculture; 60% women farmers.',
    summary_sh: 'Kusimudzira nharaunda dzine urombo muMakoni kuburikidza nekuchengetedza zvipenyu, kutonga zviwanikwa, uye kurima kwakasimba pamamiriro ekunze.',
    description_en: `The project empowers poor and marginalized communities, especially women and youth, in Makoni district to achieve sustainable lives with diverse food sources and economic well-being. Focusing on community-led biodiversity conservation, natural resource management, and environmental protection, key activities include gulley reclamation and wetland protection, small grain seed distributions for climate-resilient agriculture, establishing environmental management committees, training on Disaster Risk Management, solar-powered water schemes, and tree planting. The process prioritizes Gender Empowerment and Social Inclusion, with 60% of participants being women farmers.`,
    description_sh: `Chirongwa chinosimudzira nharaunda dzine urombo muMakoni, kunyanya vakadzi nevechidiki, kuti vawane hupenyu hwakasimba nezvokudya zvakasiyana. Zvinosanganisira kudzorera migero, kuchengetedza nzvimbo dzine mvura, kuparadzira mbeu, masolar mvura, uye kudyara miti.`,
    donors: ['Irish Civil Partnership Society'],
    partners: ['Trocaire Zimbabwe'],
    donorLogoUrls: ['/images/partners/government-ireland.png', '/images/partners/trocaire.png'],
    partnerLogoUrls: ['/images/partners/trocaire.png'],
    target: '500 households',
    location: 'Wards 27 and 30, Makoni District',
    duration: '4 years',
    staff: '5 personnel',
    theoryOfChange_en: 'If the project establishes and trains Environmental Management Committees who implement community-led initiatives like gulley reclamation, wetland protection, small grain seed distributions, tree planting, and advocacy for environmental management and biodiversity protection in Makoni, then communities will protect and enhance biodiversity, access reliable water, and build resilience to disasters, leading to sustainable lives with diverse food sources and economic well-being.',
    theoryOfChange_sh: 'Kana mapurojekiti akamisa uye akadzidzisa Environmental Management Committees anoita zvekuchengetedza nharaunda, mvura, mbeu, miti, uye kukurudzira kutonga kwezvakatipoteredza, nharaunda dzichachengetedza zvipenyu, kuwana mvura, uye kusimba pakurwisa njodzi.',
    keyPathways: [
      'Community-led conservation → enhanced biodiversity',
      'Climate-resilient agriculture → food security',
      'Water access and DRM → reduced vulnerability',
      'Empowerment of women and youth → inclusive development',
    ],
    route: '/programs/cetlrccap',
    heroImage: '/images/programs/cetlrccap/icsp-gallery-01.png',
    heroImagePosition: 'center 42%',
    galleryImages: [
      '/images/programs/cetlrccap/icsp-gallery-01.png',
      '/images/programs/cetlrccap/icsp-gallery-02.png',
      '/images/programs/cetlrccap/icsp-gallery-03.png',
      '/images/programs/cetlrccap/icsp-gallery-04.png',
    ],
    status: 'active',
    icon: 'Eco',
    color: 'success.main',
  },
  {
    id: 'didrr',
    slug: 'didrr',
    acronym: 'DiDRR',
    title_en: 'Disability-Inclusive Disaster Risk Reduction Project',
    title_sh: 'Disability-Inclusive Disaster Risk Reduction Project',
    summary_en: 'Strengthening community preparedness and inclusive response to disasters for persons with disabilities in Chipinge and Chimanimani.',
    summary_sh: 'Kusimbaradza kugadzirira nharaunda uye mhinduro inosanganisa vanhu vane disabilities muChipinge neChimanimani.',
    description_en: `The Disability-Inclusive Disaster Risk Reduction (DiDRR) Project is implemented in Chipinge and Chimanimani Districts through a consortium of Caritas Mutare, QUAPAZ, and FODPZ to strengthen community preparedness, resilience, and inclusive response to disasters. These districts are highly prone to climate-related hazards (floods, cyclones, landslides), which disproportionately affect persons with disabilities. The project ensures PWDs are actively included in disaster risk reduction planning, early warning systems, and emergency response at community level. Key interventions include capacity building of DRR committees, training on disability inclusion, accessible early warning communication, and inclusive contingency planning. The project supports communities to identify risks, map vulnerabilities, and develop locally appropriate preparedness and response plans that address the specific needs of PWDs and their caregivers.`,
    description_sh: `DiDRR inoitwa muChipinge neChimanimani neCaritas Mutare, QUAPAZ, neFODPZ kusimbaradza kugadzirira nharaunda uye mhinduro inosanganisa vanhu vane disabilities. Nharaunda idzi dzinowanzoitirwa mafashama, madutu, uye kukoromoka kwepasi. Chirongwa chinoita kuti vanhu vane disabilities vabatanidzwe mukugadzirira njodzi, masisitimu ekunyevera, uye mhinduro dzechimbichimbi.`,
    donors: ['CBM Global Switzerland'],
    partners: ['CBM Global Zimbabwe', 'QUAPAZ', 'FODPZ'],
    donorLogoUrls: ['/images/partners/cbm-global.png'],
    partnerLogoUrls: [
      '/images/partners/cbm-global-zimbabwe.png',
      '/images/partners/quapaz.png',
      '/images/partners/fodpz.png',
    ],
    target: '8,000 individuals',
    location: 'Chipinge and Chimanimani Districts',
    duration: 'April 2024 – April 2027 (3 years)',
    staff: '5 personnel',
    theoryOfChange_en: 'If the project builds capacity of DRR committees, promotes inclusive participation, and implements accessible interventions in Chipinge and Chimanimani, then persons with disabilities will be actively included in disaster risk reduction planning, early warning systems, and emergency response, leading to safer, more resilient communities where PWDs are recognized as active agents of change.',
    theoryOfChange_sh: 'Kana chirongwa chikavaka kugona kwemakomiti eDRR, kukurudzira kubatanidzwa, uye kuita zvinosanganisa vanhu vane disabilities, vanhu vane disabilities vachabatanidzwa mukugadzirira njodzi uye mhinduro dzechimbichimbi.',
    keyPathways: [
      'Inclusive DRR planning → reduced vulnerability',
      'Accessible early warning → timely response',
      'Capacity building → empowered communities',
      'Challenging stigma → improved inclusion',
    ],
    route: '/programs/didrr',
    heroImage: '/images/programs/didrr/didrr-gallery-01.png',
    heroImagePosition: 'center 34%',
    galleryImages: ['/images/programs/didrr/didrr-gallery-01.png', '/images/programs/didrr/didrr-gallery-02.png'],
    status: 'active',
    icon: 'Accessibility',
    color: 'primary.main',
  },
  {
    id: 'ilp',
    slug: 'ilp',
    acronym: 'ILP',
    title_en: 'Inclusive Livelihoods Project',
    title_sh: 'Inclusive Livelihoods Project',
    summary_en: 'Improving economic resilience and food security for persons with disabilities and their caregivers in Chipinge (Wards 26, 27, 29, 30) through group-based seed capital and training.',
    summary_sh: 'Kuvandudza hupfumi nekudya kwakachengeteka kune vanhu vane disabilities nevano vachengeta muChipinge kuburikidza nemari yekutanga nemadzidziso emapoka.',
    description_en: `The Inclusive Livelihoods Project is implemented in Chipinge District (Wards 26, 27, 29, 30) with funding from CBM Global. It improves economic resilience, food security, and wellbeing of persons with disabilities and their caregivers, who often face exclusion from mainstream livelihood opportunities. The project targets 200 households, clustering beneficiaries into groups of 10 for peer support and collective decision-making. Each group receives USD 4,500 seed capital to establish two income-generating activities (e.g. broiler production, goat production, layers). Beneficiaries receive training in business management, animal husbandry, and group governance. Income is used for food security, household needs, reinvestment, and health expenses, improving dignity and challenging stigma.`,
    description_sh: `ILP inoitwa muChipinge neCBM Global. Inovandudza hupfumi nekudya kwakachengeteka kune vanhu vane disabilities nevano vachengeta. Vanhu 200 mhuri vanopindwa mumapoka e10; boka rega rega rinowana USD 4,500 yekutanga mabasa emari (huku, mbudzi, mazai). Vanodzidziswa manejimendi uye kuchengeta mhuka.`,
    donors: ['CBM Global United Kingdom'],
    partners: ['CBM Global Zimbabwe'],
    donorLogoUrls: ['/images/partners/cbm-global.png'],
    partnerLogoUrls: ['/images/partners/cbm-global.png'],
    target: '200 households',
    location: 'Wards 26, 27, 29, 30, Chipinge District',
    duration: 'August 2024 – April 2027 (2 years 6 months)',
    staff: '5 personnel',
    theoryOfChange_en: 'If the project provides seed capital, training, and group-based support to persons with disabilities and their caregivers in Chipinge, then they will establish sustainable income-generating activities, improve food security, and increase household incomes, leading to enhanced economic resilience, dignity, and self-reliance while challenging stigma and promoting community inclusion.',
    theoryOfChange_sh: 'Kana chirongwa chikapa mari yekutanga, kudzidzisa, uye rutsigiro rwemapoka kune vanhu vane disabilities nevano vachengeta, vachatanga mabasa anobudisa mari, kudya kwakachengeteka, uye kuwana mari, zvichikonzera kusimba, chiremera, uye kuzvimirira.',
    keyPathways: [
      'Inclusive economic participation → increased incomes',
      'Group-based support → strengthened social cohesion',
      'Skills training → improved livelihoods',
      'Disability-inclusive development → reduced stigma',
    ],
    route: '/programs/ilp',
    heroImage: '/images/programs/ilp/ilp-gallery-01.png',
    heroImagePosition: 'center 48%',
    galleryImages: ['/images/programs/ilp/ilp-gallery-01.png', '/images/programs/ilp/ilp-gallery-02.png'],
    status: 'active',
    icon: 'Work',
    color: 'warning.main',
  },
  {
    id: 'soup-kitchen',
    slug: 'soup-kitchen',
    title_en: 'Soup Kitchen',
    title_sh: 'Soup Kitchen',
    summary_en: 'Monthly nutritious meals and a safe space for the hungry, elderly, people with disabilities, and vulnerable in Mutare urban.',
    summary_sh: 'Kudya kwemwedzi wega wega uye nzvimbo yakachengeteka kune vane nzara, vakura, vanhu vane disabilities, uye vanotambudzika muMutare.',
    description_en: `Caritas Mutare's Soup Kitchen is a beacon of hope for the vulnerable in Mutare, serving hot, balanced meals to the hungry, elderly, people with disabilities, and anyone in need. Guided by Catholic Social Teaching principles of Solidarity and Option for the Poor, it is not just a meal service—it is a movement towards dignity and transformation. Surviving on community donations and volunteer efforts, the Soup Kitchen provides nutrition support once a month, creating a "Community of Care" where marginalized individuals feel safe, valued, and connected. The initiative has visibly reduced hunger and physical distress among Mutare's vulnerable populations and serves as a "front door" to deeper social transformation and psychological healing.`,
    description_sh: `Soup Kitchen yeCaritas Mutare inopa chikafu chinodziya uye chakabatana kune vane nzara, vakura, vanhu vane disabilities, uye ani nani anoshaya. Inotungamirwa neCatholic Social Teaching yeSolidarity neOption for the Poor. Inobatsira kamwe chete pamwedzi nemari yezvinopihwa nenharaunda nevanozvipira.`,
    donors: ['Caritas Mutare'],
    partners: [],
    target: 'Vulnerable communities within Mutare urban',
    location: 'Mutare urban (e.g. Holy Trinity Cathedral)',
    duration: 'Ongoing',
    staff: 'All Caritas Staff',
    theoryOfChange_en: 'If the Soup Kitchen provides nutritious meals and a safe space to vulnerable groups (hungry, elderly, disabled, marginalized) in Mutare, guided by Catholic Social Teaching, then these individuals will experience reduced hunger, improved nutrition, and restored dignity, leading to enhanced physical and psychological well-being, social inclusion, and potential pathways to deeper social transformation.',
    theoryOfChange_sh: 'Kana Soup Kitchen ikapa chikafu chine utano uye nzvimbo yakachengeteka kune vanotambudzika muMutare, ivo vanhu vachadzikama nzara, kudya kwakanaka, uye chiremera chadzorwa.',
    keyPathways: [
      'Nutritious meals → reduced hunger and distress',
      'Dignified environment → restored self-worth',
      'Community of Care → social connections and support',
      'Solidarity and Option for the Poor → empowerment and transformation',
    ],
    route: '/programs/soup-kitchen',
    heroImage: '/images/programs/soup-kitchen/soup-kitchen-gallery-01.png',
    heroImagePosition: 'center 40%',
    galleryImages: [
      '/images/programs/soup-kitchen/soup-kitchen-gallery-01.png',
      '/images/programs/soup-kitchen/soup-kitchen-gallery-02.png',
      '/images/programs/soup-kitchen/soup-kitchen-gallery-03.png',
      '/images/programs/soup-kitchen/soup-kitchen-gallery-04.png',
      '/images/programs/soup-kitchen/soup-kitchen-gallery-05.png',
      '/images/programs/soup-kitchen/soup-kitchen-gallery-06.png',
    ],
    status: 'ongoing',
    icon: 'Restaurant',
    color: 'primary.main',
  },
  {
    id: 'st-theresa-preschool',
    slug: 'st-theresa-preschool',
    title_en: 'Caritas St. Theresa Pre-School (Sakubva)',
    title_sh: 'Caritas St. Theresa Pre-School (Sakubva)',
    summary_en: 'Quality early childhood education for ECD A and B learners (capacity 70) in Sakubva high-density suburb, led by Sister Angeline.',
    summary_sh: 'Dzidzo yepamusoro yevana vadiki (ECD A neB) muSakubva, inotungamirwa naSister Angeline.',
    description_en: `Caritas St. Theresa Pre-school, founded in 2000, is a beacon of quality early childhood education in the community. It caters for ECD A and B learners with a capacity of 70 children and is led by dedicated teachers under the guidance of Sister Angeline. The curriculum focuses on holistic development—play-based learning, foundational literacy and numeracy—and emphasizes values like empathy, kindness, and respect. The school's well-equipped facilities provide a safe and stimulating space for children to explore and grow. St Theresa's commitment to excellence extends beyond academics, setting students up for a lifetime of success and happiness.`,
    description_sh: `Chikoro cheCaritas St. Theresa Pre-school chakavambwa muna 2000. Chinopa dzidzo yepamusoro yevana vadiki (ECD A neB), vana 70, chichitungamirirwa naSister Angeline. Chinoomesesa kukura kwakazara, kutamba uye kudzidza, uye hunhu hwakadai sekunzwira vamwe tsitsi.`,
    donors: ['Caritas Mutare'],
    partners: [],
    target: '70 young learners (ECD A and B)',
    location: 'Sakubva high-density suburb, Mutare',
    duration: 'Ongoing',
    staff: 'Sister Angeline, Finance Officer, M&E Officer, Programs Manager, Caritas Coordinator',
    route: '/programs/education',
    heroImage: '/images/programs/education/st-theresa-preschool-graduation-2025.png',
    heroImagePosition: 'center 32%',
    galleryImages: [
      '/images/programs/education/st-theresa-preschool-graduation-2025.png',
      '/images/programs/education/st-theresa-preschool-performance-2025.png',
    ],
    status: 'ongoing',
    icon: 'School',
    color: 'primary.main',
    keyPathways: [],
  },
  {
    id: 'mai-maria-village',
    slug: 'mai-maria-village',
    title_en: 'Mai Maria Village',
    title_sh: 'Mai Maria Village',
    summary_en: 'Self-sustaining community and social enterprise in Mutare Dangamvura: leased housing, Caritas offices, and revenue supporting soup kitchen, pre-school, and livelihood projects.',
    summary_sh: 'Nharaunda inozviriritira muMutare Dangamvura: dzimba dzekurenda, mahofisi eCaritas, uye mari inotsigira soup kitchen, pre-school, nemapurojekiti ehupenyu.',
    description_en: `Mai Maria Village is a Caritas Mutare asset—a self-sustaining community in Mutare Dangamvura led by Sister Angeline. It comprises houses leased to tenants (13 occupied units, 2 vacant) and houses Caritas Mutare's offices on site. Revenue from rentals supports Caritas Mutare's social programs: soup kitchen, pre-school, and livelihood projects for vulnerable groups. Sister Angeline ensures the village runs smoothly, balancing mission goals with tenant needs. Mai Maria Village fosters community among residents, many of whom connect with Caritas support services. It exemplifies Caritas Mutare's holistic approach: serving people, building community, and advancing mission through innovative social enterprise.`,
    description_sh: `Mai Maria Village inzvimbo yeCaritas Mutare muMutare Dangamvura. Ine dzimba dzekurenda (13 dzakagarwa, 2 dzisina vanhu) uye mahofisi eCaritas. Mari inobva kurenda inotsigira soup kitchen, chikoro chevana vadiki, nemapurojekiti. Inotungamirirwa naSister Angeline.`,
    donors: ['Caritas Mutare'],
    partners: [],
    target: '13 occupied units; office space for Caritas',
    location: 'Mutare Dangamvura',
    duration: 'Ongoing',
    staff: 'Sister Angeline, Finance Officer, Programs Manager, Caritas Coordinator',
    route: '/programs/mai-maria-village',
    status: 'ongoing',
    icon: 'Home',
    color: 'info.main',
    keyPathways: [],
  },
  {
    id: 'cfnshpp',
    slug: 'cfnshpp',
    acronym: 'CFNSHPP',
    title_en: 'Community Food and Nutrition Security Health Promotion Programme',
    title_sh: 'Community Food and Nutrition Security Health Promotion Programme',
    summary_en: 'Food and nutrition security and health promotion in Chimanimani Wards 7 and 17: micro-irrigation, livestock pass-on, dip tank, conservation farming, and health awareness.',
    summary_sh: 'Kudya kwakachengeteka uye hutano muChimanimani Wards 7 ne17: irrigation, zvipfuyo, dip tank, kurima kwakachengetedzwa, uye ruzivo rwehutano.',
    description_en: `The Community Food Nutrition Security and Health Promotion Programme (CFNSHPP), launched in April 2022 in Chimanimani District (Wards 7 and 17), enhances household food and nutrition security and promotes health and well-being, aligned with SDGs 1 (No Poverty) and 5 (Gender Equality). Key interventions include a 4.5-hectare gravity-fed micro irrigation scheme, small livestock pass-on scheme, construction of Chibvuna Dip Tank for livestock health, conservation farming, farmer training in market access, sand filters for clean irrigation water, and community awareness on HIV/AIDS, gender equality, nutrition, income generation, and savings.`,
    description_sh: `CFNSHPP yakatangwa muna April 2022 muChimanimani (Wards 7 ne17). Inosimudzira kudya kwemhuri uye hutano. Zvinosanganisira micro irrigation, zvipfuyo, Chibvuna Dip Tank, kurima kwakachengetedzwa, uye ruzivo rwehutano, gender, uye mari.`,
    donors: [],
    partners: [],
    target: '1,000 households',
    location: 'Chimanimani Wards 7 and 17',
    duration: 'From April 2022',
    theoryOfChange_en: 'If communities are equipped with improved agricultural infrastructure (irrigation, dip tanks), trained in sustainable farming and market skills, and empowered through knowledge on health, gender, and income generation, then households—especially vulnerable groups—will achieve improved food and nutrition security, economic resilience, and healthier, gender-equitable communities.',
    theoryOfChange_sh: 'Kana nharaunda dzikapiwa zvivakwa zvekurima, kudzidziswa kurima uye kutengesa, uye ruzivo rwehutano negender, dzichawana kudya kwakachengeteka uye hutano hwakanaka.',
    keyPathways: [
      'Irrigation and livestock → food and income',
      'Health and gender awareness → informed choices',
      'Market skills and savings → economic resilience',
    ],
    route: '/programs/cfnshpp',
    heroImage: '/images/programs/cfnshpp/cfnshpp-gallery-01.png',
    heroImagePosition: 'center 46%',
    galleryImages: [
      '/images/programs/cfnshpp/cfnshpp-gallery-01.png',
      '/images/programs/cfnshpp/cfnshpp-gallery-02.png',
      '/images/programs/cfnshpp/cfnshpp-gallery-03.png',
      '/images/programs/cfnshpp/cfnshpp-gallery-04.png',
    ],
    status: 'active',
    icon: 'LocalHospital',
    color: 'success.main',
  },
];

export const generalImpactImages: { src: string; alt: string; objectPosition?: string }[] = [
  { src: '/images/general/promoting-dignified-lives-1.png', alt: 'Promoting dignified lives in a safe environment', objectPosition: 'center center' },
  { src: '/images/programs/serarp/serarp-mechanics-nyanyadzi-college.png', alt: 'Mechanics class in progress at Nyanyadzi College (SERARP)', objectPosition: 'center 36%' },
  { src: '/images/general/community-gathering-1.png', alt: 'Community engagement and learning', objectPosition: 'center 35%' },
  { src: '/images/general/community-impact-1.png', alt: 'Community impact event', objectPosition: 'center center' },
  { src: '/images/general/construction-1.png', alt: 'Community infrastructure construction', objectPosition: 'center 40%' },
  { src: '/images/general/workshop-planning.png', alt: 'Community workshop and planning session', objectPosition: 'center 38%' },
  { src: '/images/general/beneficiary-with-food.png', alt: 'Beneficiary with food support', objectPosition: 'center 30%' },
  { src: '/images/programs/agriculture/woman-okra-field.png', alt: 'Woman in agricultural field', objectPosition: 'center 44%' },
  { src: '/images/programs/infrastructure/water-bridge-construction.png', alt: 'Water and bridge construction project', objectPosition: 'center 45%' },
  { src: '/images/programs/didrr/didrr-gallery-01.png', alt: 'DiDRR Project Mid-Term Review', objectPosition: 'center 34%' },
];

/**
 * Partner logos displayed in the public site strip.
 *
 * Only include entries whose asset actually ships in client/public/images/.
 * Adding a row here without dropping the corresponding file in place will
 * render as a blank card — PartnerLogoStrip has a runtime fallback that
 * hides broken entries, but prevention is better than cure.
 */
export const partnerLogosForSite: { name: string; logoUrl: string }[] = [
  { name: 'Caritas Mutare', logoUrl: '/images/logo/caritas-mutare-new-logo.png' },
  { name: 'CRS', logoUrl: '/images/partners/crs.png' },
  { name: 'Trócaire', logoUrl: '/images/partners/trocaire.png' },
  { name: 'CCJP Mutare Diocese', logoUrl: '/images/partners/ccjp-mutare.png' },
  { name: 'Zimbabwe Government', logoUrl: '/images/partners/zimbabwe-government.png' },
];

export function getProjectBySlug(slug: string): CaritasProject | undefined {
  return caritasProjects.find((p) => p.slug === slug);
}

export function getProjectByRoute(path: string): CaritasProject | undefined {
  return caritasProjects.find((p) => p.route === path);
}

export function getActiveProjects(): CaritasProject[] {
  return caritasProjects.filter((p) => p.status === 'active' || p.status === 'ongoing');
}

export function getDonorFundedProjects(): CaritasProject[] {
  return caritasProjects.filter(
    (p) => p.donors.length > 0 && p.donors[0] !== 'Caritas Mutare'
  );
}
