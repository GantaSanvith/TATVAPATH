const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Scripture = require('./models/Scripture');
const Adhyaya = require('./models/Adhyaya');
const Verse = require('./models/Verse');
const QuizQuestion = require('./models/QuizQuestion');

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB...');

  // Clear existing data (keeps users!)
  await Scripture.deleteMany();
  await Adhyaya.deleteMany();
  await Verse.deleteMany();
  await QuizQuestion.deleteMany();
  console.log('Cleared old data...');

  // ==================== SCRIPTURE ====================
  const gita = await Scripture.create({
    title: 'Bhagavad Gita',
    description: 'The eternal dialogue of duty, devotion and liberation',
    icon: '🕉️',
    totalAdhyayas: 18,
    totalVerses: 700
  });

  const upanishads = await Scripture.create({
    title: 'Upanishads',
    description: 'Philosophical secrets of the universe and the self',
    icon: '🪔',
    totalAdhyayas: 10,
    totalVerses: 280
  });

  const ramayana = await Scripture.create({
    title: 'Ramayana',
    description: 'The epic journey of Rama — dharma, devotion and righteousness',
    icon: '🏹',
    totalAdhyayas: 7,
    totalVerses: 500
  });

  console.log('✅ Scriptures created...');

  // ==================== ADHYAYAS ====================
  const ch1 = await Adhyaya.create({
    scriptureId: gita._id,
    number: 1,
    title: 'Arjuna Vishada Yoga',
    description: 'The Yoga of Arjuna\'s Grief',
    totalVerses: 4
  });

  const ch2 = await Adhyaya.create({
    scriptureId: gita._id,
    number: 2,
    title: 'Sankhya Yoga',
    description: 'The Yoga of Knowledge',
    totalVerses: 4
  });

  const ch3 = await Adhyaya.create({
    scriptureId: gita._id,
    number: 3,
    title: 'Karma Yoga',
    description: 'The Yoga of Action',
    totalVerses: 4
  });

  // Upanishad chapter
  const upa1 = await Adhyaya.create({
    scriptureId: upanishads._id,
    number: 1,
    title: 'Isha Upanishad',
    description: 'On the nature of the Self and the universe',
    totalVerses: 3
  });

  // Ramayana chapter
  const ram1 = await Adhyaya.create({
    scriptureId: ramayana._id,
    number: 1,
    title: 'Bala Kanda',
    description: 'The story of Rama\'s birth and childhood',
    totalVerses: 3
  });

  console.log('✅ Adhyayas created...');

  // ==================== VERSES ====================

  // --- Chapter 1 Verses ---
  const v1_1 = await Verse.create({
    adhyayaId: ch1._id, scriptureId: gita._id, verseNumber: 1,
    sanskrit: 'धृतराष्ट्र उवाच | धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः | मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ||',
    transliteration: 'dhṛtarāṣṭra uvāca | dharma-kṣetre kuru-kṣetre samavetā yuyutsavaḥ | māmakāḥ pāṇḍavāścaiva kimakurvata sañjaya',
    meaning: 'Dhritarashtra said: O Sanjaya, after assembling in the place of pilgrimage at Kurukshetra, what did my sons and the sons of Pandu do, being desirous to fight?'
  });

  const v1_2 = await Verse.create({
    adhyayaId: ch1._id, scriptureId: gita._id, verseNumber: 2,
    sanskrit: 'सञ्जय उवाच | दृष्ट्वा तु पाण्डवानीकं व्यूढं दुर्योधनस्तदा | आचार्यमुपसङ्गम्य राजा वचनमब्रवीत् ||',
    transliteration: 'sañjaya uvāca | dṛṣṭvā tu pāṇḍavānīkaṁ vyūḍhaṁ duryodhanastadā | ācāryamupasaṅgamya rājā vacanamabravīt',
    meaning: 'Sanjaya said: O King, after looking over the army arranged in military formation by the sons of Pandu, King Duryodhana went to his teacher and spoke the following words.'
  });

  const v1_3 = await Verse.create({
    adhyayaId: ch1._id, scriptureId: gita._id, verseNumber: 3,
    sanskrit: 'पश्यैतां पाण्डुपुत्राणामाचार्य महतीं चमूम् | व्यूढां द्रुपदपुत्रेण तव शिष्येण धीमता ||',
    transliteration: 'paśyaitāṁ pāṇḍuputrāṇāmācārya mahatīṁ camūm | vyūḍhāṁ drupadaputreṇa tava śiṣyeṇa dhīmatā',
    meaning: 'O my teacher, behold the great army of the sons of Pandu, so expertly arranged by your intelligent disciple, the son of Drupada.'
  });

  const v1_4 = await Verse.create({
    adhyayaId: ch1._id, scriptureId: gita._id, verseNumber: 4,
    sanskrit: 'अत्र शूरा महेष्वासा भीमार्जुनसमा युधि | युयुधानो विराटश्च द्रुपदश्च महारथः ||',
    transliteration: 'atra śūrā maheṣvāsā bhīmārjunasamā yudhi | yuyudhāno virāṭaśca drupadaśca mahārathaḥ',
    meaning: 'Here in this army are many heroic bowmen equal in fighting to Bhima and Arjuna — great fighters like Yuyudhana, Virata and Drupada.'
  });

  // --- Chapter 2 Verses ---
  const v2_1 = await Verse.create({
    adhyayaId: ch2._id, scriptureId: gita._id, verseNumber: 1,
    sanskrit: 'सञ्जय उवाच | तं तथा कृपयाविष्टमश्रुपूर्णाकुलेक्षणम् | विषीदन्तमिदं वाक्यमुवाच मधुसूदनः ||',
    transliteration: 'sañjaya uvāca | taṁ tathā kṛpayāviṣṭamaśrupūrṇākulekṣaṇam | viṣīdantamidaṁ vākyamuvāca madhusūdanaḥ',
    meaning: 'Sanjaya said: Seeing Arjuna full of compassion and very sorrowful, his eyes brimming with tears, Madhusudana, Krishna, spoke the following words.'
  });

  const v2_2 = await Verse.create({
    adhyayaId: ch2._id, scriptureId: gita._id, verseNumber: 2,
    sanskrit: 'श्रीभगवानुवाच | कुतस्त्वा कश्मलमिदं विषमे समुपस्थितम् | अनार्यजुष्टमस्वर्ग्यमकीर्तिकरमर्जुन ||',
    transliteration: 'śrī bhagavān uvāca | kutastvā kaśmalamidaṁ viṣame samupasthitam | anāryajuṣṭamasvargyamakīrtikararjuna',
    meaning: 'The Supreme Personality of Godhead said: My dear Arjuna, how have these impurities come upon you? They are not at all befitting a man who knows the value of life. Do not yield to this degrading impotence.'
  });

  const v2_3 = await Verse.create({
    adhyayaId: ch2._id, scriptureId: gita._id, verseNumber: 3,
    sanskrit: 'क्लैब्यं मा स्म गमः पार्थ नैतत्त्वय्युपपद्यते | क्षुद्रं हृदयदौर्बल्यं त्यक्त्वोत्तिष्ठ परन्तप ||',
    transliteration: 'klaibyaṁ mā sma gamaḥ pārtha naitat tvayy upapadyate | kṣudraṁ hṛdaya-daurbalyaṁ tyaktvottiṣṭha parantapa',
    meaning: 'O Arjuna, do not yield to this impotence. It does not become you. Shake off your faint-heartedness and arise, O scorcher of enemies.'
  });

  const v2_4 = await Verse.create({
    adhyayaId: ch2._id, scriptureId: gita._id, verseNumber: 4,
    sanskrit: 'नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः | न चैनं क्लेदयन्त्यापो न शोषयति मारुतः ||',
    transliteration: 'nainaṁ chindanti śastrāṇi nainaṁ dahati pāvakaḥ | na cainaṁ kledayantyāpo na śoṣayati mārutaḥ',
    meaning: 'The soul can never be cut by any weapon, nor burned by fire, nor moistened by water, nor withered by the wind. The soul is eternal, all-pervading, unmoving and primeval.'
  });

  // --- Chapter 3 Verses ---
  const v3_1 = await Verse.create({
    adhyayaId: ch3._id, scriptureId: gita._id, verseNumber: 1,
    sanskrit: 'नियतं कुरु कर्म त्वं कर्म ज्यायो ह्यकर्मणः | शरीरयात्रापि च ते न प्रसिद्ध्येदकर्मणः ||',
    transliteration: 'niyataṁ kuru karma tvaṁ karma jyāyo hyakarmaṇaḥ | śarīrayātrāpi ca te na prasiddhyedakarmaṇaḥ',
    meaning: 'Perform your prescribed duties, for action is better than inaction. Even the maintenance of your body would not be possible through inaction.'
  });

  const v3_2 = await Verse.create({
    adhyayaId: ch3._id, scriptureId: gita._id, verseNumber: 2,
    sanskrit: 'यज्ञार्थात्कर्मणोऽन्यत्र लोकोऽयं कर्मबन्धनः | तदर्थं कर्म कौन्तेय मुक्तसङ्गः समाचर ||',
    transliteration: 'yajñārthāt karmaṇo\'nyatra loko\'yaṁ karmabandhanaḥ | tadarthaṁ karma kaunteya muktasaṅgaḥ samācara',
    meaning: 'Work done as a sacrifice for Vishnu has to be performed, otherwise work binds one to this material world. Therefore, O son of Kunti, perform your prescribed duties for His satisfaction, and in that way you will always remain unattached and free from bondage.'
  });

  const v3_3 = await Verse.create({
    adhyayaId: ch3._id, scriptureId: gita._id, verseNumber: 3,
    sanskrit: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात् | स्वधर्मे निधनं श्रेयः परधर्मो भयावहः ||',
    transliteration: 'śreyān svadharmo viguṇaḥ paradharmāt svanuṣṭhitāt | svadharme nidhanaṁ śreyaḥ paradharmo bhayāvahaḥ',
    meaning: 'It is far better to perform one\'s natural prescribed duty, though tinged with faults, than to perform another\'s prescribed duty, though perfectly. In fact, it is preferable to die in the discharge of one\'s own duty than to follow the path of another.'
  });

  const v3_4 = await Verse.create({
    adhyayaId: ch3._id, scriptureId: gita._id, verseNumber: 4,
    sanskrit: 'इन्द्रियाणि पराण्याहुरिन्द्रियेभ्यः परं मनः | मनसस्तु परा बुद्धिर्यो बुद्धेः परतस्तु सः ||',
    transliteration: 'indriyāṇi parāṇyāhurindriyebhyaḥ paraṁ manaḥ | manasastu parā buddhiryo buddheḥ paratastu saḥ',
    meaning: 'The working senses are superior to dull matter; mind is higher than the senses; intelligence is still higher than the mind; and the soul is even higher than the intelligence.'
  });

  // --- Upanishad Verses ---
  const u1_1 = await Verse.create({
    adhyayaId: upa1._id, scriptureId: upanishads._id, verseNumber: 1,
    sanskrit: 'ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् | तेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ||',
    transliteration: 'īśā vāsyamidaṁ sarvaṁ yatkiñca jagatyāṁ jagat | tena tyaktena bhuñjīthā mā gṛdhaḥ kasyasviddhanam',
    meaning: 'All this — whatever exists in this changing universe — should be covered by the Lord. Protect yourself through that detachment. Do not covet anybody\'s wealth.'
  });

  const u1_2 = await Verse.create({
    adhyayaId: upa1._id, scriptureId: upanishads._id, verseNumber: 2,
    sanskrit: 'कुर्वन्नेवेह कर्माणि जिजीविषेच्छतं समाः | एवं त्वयि नान्यथेतोऽस्ति न कर्म लिप्यते नरे ||',
    transliteration: 'kurvanneveha karmāṇi jijīviṣeccataṁ samāḥ | evaṁ tvayi nānyatheto\'sti na karma lipyate nare',
    meaning: 'By doing deeds in this world, one should wish to live a hundred years. Thus and not otherwise — for you there is no way — action does not cling to a person.'
  });

  const u1_3 = await Verse.create({
    adhyayaId: upa1._id, scriptureId: upanishads._id, verseNumber: 3,
    sanskrit: 'अन्धं तमः प्रविशन्ति येऽविद्यामुपासते | ततो भूय इव ते तमो य उ विद्यायां रताः ||',
    transliteration: 'andhaṁ tamaḥ praviśanti ye\'vidyāmupāsate | tato bhūya iva te tamo ya u vidyāyāṁ ratāḥ',
    meaning: 'Into blinding darkness enter those who worship ignorance. Into even greater darkness enter those who worship knowledge alone.'
  });

  // --- Ramayana Verses ---
  const r1_1 = await Verse.create({
    adhyayaId: ram1._id, scriptureId: ramayana._id, verseNumber: 1,
    sanskrit: 'तपः स्वाध्यायनिरतं तपस्वी वाग्विदां वरम् | नारदं परिपप्रच्छ वाल्मीकिर्मुनिपुङ्गवम् ||',
    transliteration: 'tapaḥ svādhyāyaniratam tapasvī vāgvidāṁ varam | nāradaṁ paripapraccha vālmīkirmunipuṅgavam',
    meaning: 'Valmiki, the sage devoted to austerity and scripture, asked Narada — the foremost among those versed in words — who was ever engaged in penance and self-study.'
  });

  const r1_2 = await Verse.create({
    adhyayaId: ram1._id, scriptureId: ramayana._id, verseNumber: 2,
    sanskrit: 'को न्वस्मिन् साम्प्रतं लोके गुणवान् कश्च वीर्यवान् | धर्मज्ञश्च कृतज्ञश्च सत्यवाक्यो दृढव्रतः ||',
    transliteration: 'ko nvasmin sāmprataṁ loke guṇavān kaśca vīryavān | dharmajñaśca kṛtajñaśca satyavākyo dṛḍhavrataḥ',
    meaning: 'Who in this world today is virtuous, mighty, righteous, grateful, truthful and firm in his vows?'
  });

  const r1_3 = await Verse.create({
    adhyayaId: ram1._id, scriptureId: ramayana._id, verseNumber: 3,
    sanskrit: 'रामो विग्रहवान् धर्मः साधुः सत्यपराक्रमः | राजा सर्वस्य लोकस्य देवानामिव वासवः ||',
    transliteration: 'rāmo vigrahavān dharmaḥ sādhuḥ satyaparākramaḥ | rājā sarvasya lokasya devānāmiva vāsavaḥ',
    meaning: 'Rama is dharma personified, virtuous, of true valor. He is the king of all the worlds just as Indra is the king of the gods.'
  });

  console.log('✅ Verses created...');

  // ==================== QUIZ QUESTIONS ====================
  const allQuestions = [

    // Chapter 1 - Verse 1
    { verseId: v1_1._id, question: 'Who is speaking in the first verse of the Bhagavad Gita?', optionA: 'Arjuna', optionB: 'Krishna', optionC: 'Dhritarashtra', optionD: 'Sanjaya', correctOption: 'C', points: 50 },
    { verseId: v1_1._id, question: 'Where does the battle of the Gita take place?', optionA: 'Hastinapura', optionB: 'Kurukshetra', optionC: 'Vrindavan', optionD: 'Mathura', correctOption: 'B', points: 50 },
    { verseId: v1_1._id, question: 'Who does Dhritarashtra ask about the battle?', optionA: 'Arjuna', optionB: 'Bhishma', optionC: 'Sanjaya', optionD: 'Vidura', correctOption: 'C', points: 50 },

    // Chapter 1 - Verse 2
    { verseId: v1_2._id, question: 'Who did Duryodhana approach after seeing the Pandava army?', optionA: 'Bhishma', optionB: 'His teacher Drona', optionC: 'Karna', optionD: 'His father', correctOption: 'B', points: 50 },
    { verseId: v1_2._id, question: 'What was Duryodhana\'s reaction upon seeing the Pandava formation?', optionA: 'He laughed', optionB: 'He fled', optionC: 'He studied it carefully', optionD: 'He challenged Arjuna', correctOption: 'C', points: 50 },
    { verseId: v1_2._id, question: 'Which name is used for Krishna in this verse?', optionA: 'Govinda', optionB: 'Madhusudana', optionC: 'Vasudeva', optionD: 'Keshava', correctOption: 'B', points: 50 },

    // Chapter 1 - Verse 3
    { verseId: v1_3._id, question: 'Who arranged the Pandava army in this verse?', optionA: 'Arjuna', optionB: 'Bhima', optionC: 'Son of Drupada', optionD: 'Yudhishthira', correctOption: 'C', points: 50 },
    { verseId: v1_3._id, question: 'How does Duryodhana describe the arranger of the army?', optionA: 'Cowardly', optionB: 'Intelligent disciple', optionC: 'Weak warrior', optionD: 'Untrained soldier', correctOption: 'B', points: 50 },
    { verseId: v1_3._id, question: 'Who is Duryodhana speaking to in this verse?', optionA: 'Karna', optionB: 'Bhishma', optionC: 'Drona his teacher', optionD: 'Sanjaya', correctOption: 'C', points: 50 },

    // Chapter 1 - Verse 4
    { verseId: v1_4._id, question: 'Who are the great warriors compared to in verse 4?', optionA: 'Krishna and Balarama', optionB: 'Bhima and Arjuna', optionC: 'Karna and Drona', optionD: 'Yudhishthira and Nakula', correctOption: 'B', points: 50 },
    { verseId: v1_4._id, question: 'What is Drupada\'s title mentioned in this verse?', optionA: 'Maharishi', optionB: 'Maharatha', optionC: 'Mahabali', optionD: 'Maharaja', correctOption: 'B', points: 50 },
    { verseId: v1_4._id, question: 'What kind of warriors are described in verse 4?', optionA: 'Infantry soldiers', optionB: 'Elephant riders', optionC: 'Heroic bowmen', optionD: 'Chariot warriors', correctOption: 'C', points: 50 },

    // Chapter 2 - Verse 1
    { verseId: v2_1._id, question: 'What was Arjuna\'s condition when Krishna spoke?', optionA: 'Angry and aggressive', optionB: 'Full of compassion and sorrowful', optionC: 'Ready to fight', optionD: 'Calm and composed', correctOption: 'B', points: 50 },
    { verseId: v2_1._id, question: 'What name is used for Krishna in verse 2.1?', optionA: 'Govinda', optionB: 'Arjuna', optionC: 'Madhusudana', optionD: 'Vasudeva', correctOption: 'C', points: 50 },
    { verseId: v2_1._id, question: 'What were Arjuna\'s eyes filled with?', optionA: 'Anger', optionB: 'Tears', optionC: 'Determination', optionD: 'Fear', correctOption: 'B', points: 50 },

    // Chapter 2 - Verse 2
    { verseId: v2_2._id, question: 'What does Krishna call the impurities that came upon Arjuna?', optionA: 'Befitting a warrior', optionB: 'Not befitting a man who knows the value of life', optionC: 'Signs of wisdom', optionD: 'Natural emotions', correctOption: 'B', points: 50 },
    { verseId: v2_2._id, question: 'What does Krishna ask Arjuna not to yield to?', optionA: 'Pride', optionB: 'Anger', optionC: 'Degrading impotence', optionD: 'Fear of death', correctOption: 'C', points: 50 },
    { verseId: v2_2._id, question: 'Who speaks verse 2.2?', optionA: 'Arjuna', optionB: 'Sanjaya', optionC: 'Dhritarashtra', optionD: 'The Supreme Lord Krishna', correctOption: 'D', points: 50 },

    // Chapter 2 - Verse 3
    { verseId: v2_3._id, question: 'What does Krishna ask Arjuna to overcome?', optionA: 'His hunger', optionB: 'His faint-heartedness and weakness', optionC: 'His anger', optionD: 'His attachment to weapons', correctOption: 'B', points: 50 },
    { verseId: v2_3._id, question: 'What name does Krishna use for Arjuna in 2.3?', optionA: 'Govinda', optionB: 'Madhava', optionC: 'Partha', optionD: 'Kesava', correctOption: 'C', points: 50 },
    { verseId: v2_3._id, question: 'What does Krishna call Arjuna at the end of verse 2.3?', optionA: 'Coward', optionB: 'Scorcher of enemies', optionC: 'Great warrior', optionD: 'Son of Pandu', correctOption: 'B', points: 50 },

    // Chapter 2 - Verse 4
    { verseId: v2_4._id, question: 'According to this verse, what cannot cut the soul?', optionA: 'Time', optionB: 'Weapons', optionC: 'Words', optionD: 'Illness', correctOption: 'B', points: 50 },
    { verseId: v2_4._id, question: 'How is the soul described in verse 2.4?', optionA: 'Temporary and fragile', optionB: 'Eternal and all-pervading', optionC: 'Limited and mortal', optionD: 'Created by Brahma', correctOption: 'B', points: 50 },
    { verseId: v2_4._id, question: 'What cannot burn the soul?', optionA: 'Water', optionB: 'Wind', optionC: 'Fire', optionD: 'Weapons', correctOption: 'C', points: 50 },

    // Chapter 3 - Verse 1
    { verseId: v3_1._id, question: 'What is better than inaction according to this verse?', optionA: 'Meditation', optionB: 'Action — performing prescribed duties', optionC: 'Renunciation', optionD: 'Prayer', correctOption: 'B', points: 50 },
    { verseId: v3_1._id, question: 'What cannot be maintained through inaction?', optionA: 'Wealth', optionB: 'Relationships', optionC: 'The body', optionD: 'Dharma', correctOption: 'C', points: 50 },
    { verseId: v3_1._id, question: 'What does Krishna prescribe for Arjuna?', optionA: 'Rest and meditation', optionB: 'Perform prescribed duties', optionC: 'Retreat from battle', optionD: 'Pray to the gods', correctOption: 'B', points: 50 },

    // Chapter 3 - Verse 2
    { verseId: v3_2._id, question: 'For whom should work be performed as a sacrifice?', optionA: 'Brahma', optionB: 'Shiva', optionC: 'Vishnu', optionD: 'Indra', correctOption: 'C', points: 50 },
    { verseId: v3_2._id, question: 'What binds one to the material world?', optionA: 'Work done for Vishnu', optionB: 'Work done for any other purpose', optionC: 'Meditation', optionD: 'Renunciation', correctOption: 'B', points: 50 },
    { verseId: v3_2._id, question: 'What name is Arjuna called in this verse?', optionA: 'Partha', optionB: 'Son of Kunti — Kaunteya', optionC: 'Dhananjaya', optionD: 'Bibhatsu', correctOption: 'B', points: 50 },

    // Chapter 3 - Verse 3
    { verseId: v3_3._id, question: 'What is better according to this verse?', optionA: 'Another\'s duty performed perfectly', optionB: 'One\'s own duty even with faults', optionC: 'No duty at all', optionD: 'The easiest duty', correctOption: 'B', points: 50 },
    { verseId: v3_3._id, question: 'What is paradharma described as?', optionA: 'Noble and worthy', optionB: 'Frightening and dangerous', optionC: 'Rewarding and fulfilling', optionD: 'Easy and pleasant', correctOption: 'B', points: 50 },
    { verseId: v3_3._id, question: 'What is preferable to following another\'s path?', optionA: 'Living in luxury', optionB: 'Dying in discharge of one\'s own duty', optionC: 'Gaining wealth', optionD: 'Winning battles', correctOption: 'B', points: 50 },

    // Chapter 3 - Verse 4
    { verseId: v3_4._id, question: 'What is higher than the senses?', optionA: 'Body', optionB: 'Mind', optionC: 'Soul', optionD: 'Intelligence', correctOption: 'B', points: 50 },
    { verseId: v3_4._id, question: 'What is the highest according to this verse?', optionA: 'Intelligence', optionB: 'Mind', optionC: 'Soul beyond intelligence', optionD: 'Senses', correctOption: 'C', points: 50 },
    { verseId: v3_4._id, question: 'In what order are faculties ranked from lowest to highest?', optionA: 'Senses → Body → Mind → Intelligence', optionB: 'Body → Senses → Mind → Intelligence → Soul', optionC: 'Mind → Senses → Intelligence → Soul', optionD: 'Soul → Senses → Mind → Intelligence', correctOption: 'B', points: 50 },

    // Upanishad Verse 1
    { verseId: u1_1._id, question: 'What should cover all that exists according to Isha Upanishad?', optionA: 'Darkness', optionB: 'The Lord', optionC: 'Knowledge', optionD: 'Wealth', correctOption: 'B', points: 50 },
    { verseId: u1_1._id, question: 'What does the verse advise us not to do?', optionA: 'Work hard', optionB: 'Covet another\'s wealth', optionC: 'Meditate', optionD: 'Speak truth', correctOption: 'B', points: 50 },
    { verseId: u1_1._id, question: 'How should we enjoy the world according to this verse?', optionA: 'With great attachment', optionB: 'Through detachment', optionC: 'By accumulating wealth', optionD: 'By renouncing everything', correctOption: 'B', points: 50 },

    // Upanishad Verse 2
    { verseId: u1_2._id, question: 'How many years should one wish to live while doing deeds?', optionA: 'Fifty', optionB: 'Seventy', optionC: 'A hundred', optionD: 'A thousand', correctOption: 'C', points: 50 },
    { verseId: u1_2._id, question: 'Does action cling to a person according to this verse?', optionA: 'Yes always', optionB: 'Only bad actions', optionC: 'No it does not', optionD: 'Only good actions', correctOption: 'C', points: 50 },
    { verseId: u1_2._id, question: 'What is the key message of this verse?', optionA: 'Avoid all work', optionB: 'Live actively without being bound by action', optionC: 'Work only for rewards', optionD: 'Retire early from duties', correctOption: 'B', points: 50 },

    // Upanishad Verse 3
    { verseId: u1_3._id, question: 'Who enters blinding darkness?', optionA: 'Those who worship knowledge', optionB: 'Those who worship ignorance', optionC: 'Those who meditate', optionD: 'Those who work hard', correctOption: 'B', points: 50 },
    { verseId: u1_3._id, question: 'Who enters even greater darkness?', optionA: 'Those who worship ignorance', optionB: 'Those who worship knowledge alone', optionC: 'Those who do no work', optionD: 'Those who covet wealth', correctOption: 'B', points: 50 },
    { verseId: u1_3._id, question: 'What is the balance the Upanishad teaches here?', optionA: 'Only worship ignorance', optionB: 'Only worship knowledge', optionC: 'Neither pure ignorance nor pure knowledge alone', optionD: 'Avoid all learning', correctOption: 'C', points: 50 },

    // Ramayana Verse 1
    { verseId: r1_1._id, question: 'Who asked Narada the question in the first verse?', optionA: 'Brahma', optionB: 'Valmiki', optionC: 'Vishwamitra', optionD: 'Sita', correctOption: 'B', points: 50 },
    { verseId: r1_1._id, question: 'How is Narada described in this verse?', optionA: 'Warrior and king', optionB: 'Foremost among those versed in words', optionC: 'Merchant and traveler', optionD: 'Student of Valmiki', correctOption: 'B', points: 50 },
    { verseId: r1_1._id, question: 'What was Valmiki devoted to?', optionA: 'Warfare and conquest', optionB: 'Austerity and scripture', optionC: 'Trading and farming', optionD: 'Music and dance', correctOption: 'B', points: 50 },

    // Ramayana Verse 2
    { verseId: r1_2._id, question: 'What quality is mentioned first when describing the ideal person?', optionA: 'Strength', optionB: 'Virtuous', optionC: 'Wealthy', optionD: 'Famous', correctOption: 'B', points: 50 },
    { verseId: r1_2._id, question: 'Which of these is NOT asked about in verse 2?', optionA: 'Truthful', optionB: 'Grateful', optionC: 'Wealthy', optionD: 'Firm in vows', correctOption: 'C', points: 50 },
    { verseId: r1_2._id, question: 'What does Valmiki want to find in this world?', optionA: 'A great warrior only', optionB: 'A person with all virtues', optionC: 'The richest king', optionD: 'The strongest soldier', correctOption: 'B', points: 50 },

    // Ramayana Verse 3
    { verseId: r1_3._id, question: 'Rama is described as which personified?', optionA: 'Power', optionB: 'Dharma', optionC: 'Wealth', optionD: 'Victory', correctOption: 'B', points: 50 },
    { verseId: r1_3._id, question: 'Who is Rama compared to as king?', optionA: 'Brahma among creators', optionB: 'Indra among gods', optionC: 'Vishnu among preservers', optionD: 'Shiva among destroyers', correctOption: 'B', points: 50 },
    { verseId: r1_3._id, question: 'How is Rama\'s valor described?', optionA: 'False valor', optionB: 'True valor', optionC: 'Borrowed strength', optionD: 'Divine gift only', correctOption: 'B', points: 50 },
  ];

  await QuizQuestion.insertMany(allQuestions);
  console.log('✅ Quiz questions created...');
  console.log('');
  console.log('🎉 DATABASE FULLY SEEDED!');
  console.log(`📖 Scriptures: 3`);
  console.log(`📚 Adhyayas: 5`);
  console.log(`📜 Verses: ${await Verse.countDocuments()}`);
  console.log(`❓ Questions: ${await QuizQuestion.countDocuments()}`);
  process.exit();
};

seedData().catch(err => {
  console.error('Seeder error:', err);
  process.exit(1);
});