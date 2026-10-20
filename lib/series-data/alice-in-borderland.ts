import { SeriesItem, CharacterAnalysisArticle } from "./types";

export const ALICE_IN_BORDERLAND_SERIES: SeriesItem[] = [
  {
    id: "alice-in-borderland",
    title: "Alice in Borderland",
    genre: "Psikolojik Gerilim • Hayatta Kalma • Distopya • Gizem",
    seasons: "2 Sezon • Netflix",
    coverImage: "/series/alice-in-borderland.jpg",
    tagline: "Ölümcül oyunların ortasında, yaşama arzusu ile varoluşsal nihilizmin en çıplak psikolojik hesaplaşması.",
    psychologicalTheme: "Varoluşsal Nihilizm, Hayatta Kalan Suçluluğu (Survivor's Guilt), Sosyal Darwinizm & Travma Sonrası Büyüme",
    characterCount: 16,
    characterIds: [
      "ryohei-arisu",
      "yuzuha-usagi",
      "shuntaro-chishiya",
      "hikari-kuina",
      "suguru-niragi",
      "ann-rizuna",
      "mira-kano",
      "takeru-danma-hatter",
      "morizono-aguni",
      "daikichi-karube",
      "chota-segawa",
      "ginji-kyuma",
      "keiichi-kuzuryu",
      "akane-heiya",
      "takatora-samura-last-boss",
      "kodai-tatta",
    ],
  },
];

export const ALICE_IN_BORDERLAND_CHARACTERS: CharacterAnalysisArticle[] = [
  // 1. RYOHEI ARISU
  {
    id: "ryohei-arisu",
    seriesId: "alice-in-borderland",
    characterName: "Ryohei Arisu",
    series: "Alice in Borderland",
    actor: "Kento Yamazaki",
    role: "main",
    roleBadge: "Ana Karakter",
    image: "/characters/ryohei-arisu.jpg",
    category: "travma",
    categoryBadge: "Travma & Yas",
    badge: "Hayatta Kalan Suçluluğu & Varoluşsal Uyanış",
    tagline: "Kendi dünyasında kaybolmuş bir oyuncunun, dostlarının kaybı üzerinde inşa ettiği yaşama iradesi.",
    readTime: "9 dk okuma",
    psychologicalProfile: {
      primaryDiagnosis: "Travma Sonrası Stres Bozukluğu (TSSB), Ağır Hayatta Kalan Suçluluğu (Survivor's Guilt) & Varoluşsal Kriz",
      archetype: "İsteksiz Kahraman & Kalp Stratejisti (The Reluctant Visionary)",
      defenseMechanisms: ["Disosiasyon", "İçe Atım (Introjection)", "Yüceltme (Sublimation)"],
      coreConflict: "Gerçek dünyadaki ebeveyn beklentileri ve yetersizlik anksiyetesinden kaçarken, Borderland'de Karube ve Chota'nın onun yaşaması için kendilerini feda etmelerinin yarattığı ezici borçluluk duygusu.",
    },
    summary: "Gerçek dünyada amaçsız bir bilgisayar oyuncusuyken, Borderland'in acımasız kupa ve maça oyunlarında dostlarının fedakarlığıyla empati ve stratejiyi birleştiren, nihilizmden anlam arayışına sıçrayan zihin.",
    fullContent: {
      lead: "Arisu, modern metropol gençliğinin yaşadığı yabancılaşma ve amaçsızlık sendromunun ete kemiğe bürünmüş halidir. Ta ki ölüm, soyut bir kaygıdan arkadaşlarının kanıyla boyanmış bir gerçeğe dönüşene kadar.",
      quote: {
        text: "Yaşamak istiyorum... Sadece nefes almak için değil, onlar neden öldü ve ben neden buradayım anlamak için.",
        context: "Arisu'nun 7 of Hearts (Kupa Yedilisi) trajedisinden sonra içine düştüğü katatonik depresyondan Usagi sayesinde çıkış anı.",
      },
      sections: [
        {
          heading: "1. Metropol Anhedonisi ve Sanal Dünyaya Kaçış",
          body: "Arisu'nun hikayesi klasik bir varoluşsal boşlukla (existential vacuum) başlar. Başarılı babası ve mükemmel erkek kardeşiyle kıyaslanan Arisu, başarısızlık korkusunu yenmek için rekabeti reddetmiş ve video oyunlarının güvenli simülasyonuna sığınmıştır. Borderland'e geçişi, psikanalitik olarak kendi bilinçdışının 'öl ya da gerçek bir birey ol' ultimatomudur.",
        },
        {
          heading: "2. Kupa Yedilisi ve Hayatta Kalan Suçluluğu",
          body: "Yalnızca bir kişinin hayatta kalabileceği 7 of Hearts oyununda Karube ve Chota'nın Arisu'nun yaşaması için saklanarak ölümü seçmeleri, Arisu'nun psişesinde derin bir kırılma yaratır. Klinik olarak 'Survivor's Guilt' yaşayan birey, hayatta kalmayı bir ödül değil, hak edilmemiş bir lanet olarak algılar. Arisu'nun katatonik çöküşü, bu telafisi imkansız kederin sonucudur.",
        },
        {
          heading: "3. Empati Temelli Mantık: Kupa Oyunlarının Çözümü",
          body: "Arisu'yu Chishiya gibi soğuk mantıkçılardan ayıran şey, oyunları insan psikolojisini ve duygusal zaafları hissederek çözmesidir. Kupa oyunları (Hearts) zihinsel manipulasyon üzerine kuruludur ve Arisu, kendi vicdan azabıyla yüzleşebildiği ölçüde bu oyunları bozguna uğratır. Kupa Kraliçesi Mira ile son hesaplaşmasında gerçekliğin manipülasyonuna karşı koyabilmesi, entelektüel değil duygusal bir zaferdir.",
        },
      ],
      clinicalTakeaway: "Varoluşsal anlamsızlık, ölümün ve kaybın yakıcılığıyla yüzleşildiğinde yerini radikal bir yaşam sorumluluğuna bırakır; yas tutulmadan olgunlaşma gerçekleşemez.",
      therapeuticApproach: "Logoterapi (Viktor Frankl temelli anlam arayışı) ve Kabul ve Kararlılık Terapisi (ACT) ile suçluluk duygusunu dostlarının hatırasını yaşatma misyonuna dönüştürme çalışması uygulanırdı.",
    },
  },

  // 2. YUZUHA USAGI
  {
    id: "yuzuha-usagi",
    seriesId: "alice-in-borderland",
    characterName: "Yuzuha Usagi",
    series: "Alice in Borderland",
    actor: "Tao Tsuchiya",
    role: "main",
    roleBadge: "Ana Karakter",
    image: "/characters/yuzuha-usagi.jpg",
    category: "travma",
    categoryBadge: "Travma & Başa Çıkma",
    badge: "Kompleks TSSB & Karşıt-Bağımlılık",
    tagline: "Babasının intiharıyla insanlığa küsen, dağların sertliğiyle ruhunu zırhlayan yalnız hayatta kalan.",
    readTime: "8 dk okuma",
    psychologicalProfile: {
      primaryDiagnosis: "Kompleks Travma Sonrası Stres Bozukluğu (C-PTSD), İntihar İkincil Travması & Karşıt-Bağımlılık (Counter-dependency)",
      archetype: "Yalnız Dağcı & Doğal Savaşçı (The Solitary Survivor)",
      defenseMechanisms: ["Bedenselleştirme/Fizikselleşme", "Duygusal İzolasyon", "Reaksiyon Oluşturma"],
      coreConflict: "Saygın bir dağcı olan babasının medyatik bir itibar suikastı sonucu intihar etmesi; topluma duyduğu derin güvensizlik ile içindeki bağlanma ve korunma arzusunun çatışması.",
    },
    summary: "Fiziksel dayanıklılığı ve dağcılık yetenekleriyle maça oyunlarında hayatta kalan, babasının ölümüyle topluma küsmüşken Arisu ile kurduğu derin bağ sayesinde duygusal buzullarını eriten savaşçı.",
    fullContent: {
      lead: "Usagi, bedenini bir tapınak ve hayatta kalma aracına dönüştürerek zihnindeki acıyı bastıran klasik bir travma mağdurudur. İnsanların riyakarlığına karşı dağların dürüstlüğüne sığınmıştır.",
      quote: {
        text: "Babam bana dağların asla yalan söylemediğini öğretti. Yalan söyleyen, insanlardı. Bu yüzden sadece kendi bedenime güvenirim.",
        context: "Usagi'nin Arisu ile ilk karşılaşmalarında insanlardan neden uzak durduğunu açıkladığı an.",
      },
      sections: [
        {
          heading: "1. Baba İntiharı ve Sosyal Çekilme",
          body: "Usagi'nin babası oksijensiz tırmanış başarısı şüpheye düşürülüp medya tarafından linç edilince intihar etmiştir. Bu olay Usagi'de insan türüne karşı onarılmaz bir tiksinti ve öfke doğurmuştur. Borderland'in acımasızlığı, onun için gerçek dünyanın ikiyüzlülüğünden daha şeffaf ve tolere edilebilir bir arenadır.",
        },
        {
          heading: "2. Karşıt-Bağımlılık ve Bedensel Zırhlama",
          body: "Klinik olarak 'counter-dependency' gösteren Usagi, hiç kimseye muhtaç olmamak için fiziksel çevikliğini sınırlarına kadar zorlar. Tırmanma, koşma ve kas gücü; duygusal kırılganlığını gizleyen somatik bir kalkandır. Birine güvenmek, onun bilinçdışında babasının yaşadığı yıkımın tekrarı demektir.",
        },
        {
          heading: "3. Arisu İle İyileştirici Bağlanma (Corrective Emotional Experience)",
          body: "Arisu'nun savunmasızlığı ve saf şefkati, Usagi'nin sert savunma duvarlarını aşmayı başarır. Arisu'yu koruma motivasyonu, Usagi'nin yalnızlık savunmasını aşarak yeniden bir 'öteki' ile güvenli bağ kurmasını sağlar. Borderland'den çıkış iradesi, artık babasının intikamı değil, Arisu ile yaşama umududur.",
        },
      ],
      clinicalTakeaway: "Duygusal acıdan kaçınmak için bedensel mükemmeliyete sığınmak sürdürülemez; iyileşme ancak başka bir insana yeniden güvenme cesaretiyle başlar.",
      therapeuticApproach: "EMDR terapisi ile babasının intihar anısına bağlı travmatik yükün duyarsızlaştırılması ve Şema Terapi ile 'Kusurluluk/Duygusal Yoksunluk' şemalarının çalışılması gerekirdi.",
    },
  },

  // 3. SHUNTARO CHISIYA
  {
    id: "shuntaro-chishiya",
    seriesId: "alice-in-borderland",
    characterName: "Shuntaro Chishiya",
    series: "Alice in Borderland",
    actor: "Nijiro Murakami",
    role: "supporting",
    roleBadge: "Kilit Karakter",
    image: "/characters/shuntaro-chishiya.jpg",
    category: "antisosyal",
    categoryBadge: "Antisosyal & Akıl",
    badge: "Oyun Teorisi Nihilizmi & Duygusal Anestezi",
    tagline: "İnsan canını soğuk bir olasılık hesabına indirgeyen, beyaz kapüşonunun altında anlam arayan dahi.",
    readTime: "9 dk okuma",
    psychologicalProfile: {
      primaryDiagnosis: "Duygusal Yalıtım (Isolation of Affect), Rasyonel Psikopatik Özellikler & Savunmacı Nihilizm",
      archetype: "Soğuk Akıl & Manipülatif Beyaz Tavşan (The Detached Analyst)",
      defenseMechanisms: ["Aşırı İntellektüalizasyon", "Duygusal Küntleşme", "Makyavelist Bölme"],
      coreConflict: "Tıp fakültesinde çocuk hastaların organ naklinde torpille ölüme terk edilişini izlerken insan hayatının değersizliğine ikna olması; kendi vicdan azabını alaycı bir umursamazlıkla bastırması.",
    },
    summary: "Tıp doktoru geçmişini arkada bırakıp Borderland'de karo oyunlarının mutlak efendisine dönüşen; insanları piyon gibi feda ederken Karo Kralı ve Niragi karşılaşmalarında kendi insanlığını yeniden keşfeden stratejist.",
    fullContent: {
      lead: "Chishiya, elleri cebinde ve yüzünde donuk bir tebessümle ölüm oyunlarında gezinir. Onun için tehlike korkulacak bir şey değil, insan doğasının ikiyüzlülüğünü test eden eğlenceli bir laboratuvardır.",
      quote: {
        text: "İnsanların gerçek yüzünü görmek istiyorsan, onları ölümle tehdit et. Bütün ahlak kuralları saniyeler içinde buharlaşır.",
        context: "Chishiya'nın Beach'teki güç kavgalarını ve insanların çaresizliğini izlerken Arisu'ya fısıldadığı söz.",
      },
      sections: [
        {
          heading: "1. Pediatri Kliniğindeki Moral Kırılma",
          body: "Chishiya'nın geçmişinde pediatrik cerrahi asistanlığı yatar. Fakir bir çocuğun hayatını kurtaracak organın zengin ve nüfuzlu bir ailenin çocuğuna rüşvetle aktarılışına tanık olması, Chishiya'nın içindeki ahlaki pusulayı paramparça etmiştir. 'Eğer hayatın bir değeri yoksa, hiçbir şeyin önemi yoktur' inancını bir kalkan yapmıştır.",
        },
        {
          heading: "2. Karo Oyunları ve Mahkumlar Çıkmazı",
          body: "Chishiya'nın uzmanlık alanı Karo (Diamonds) oyunlarıdır; yani matematik, olasılık ve oyun teorisi. Jack of Hearts (Kupa Valesi) hapishane oyununda kimseye güvenmeden, yalan söyleyenleri tek tek psikolojik olarak elemesi; King of Diamonds (Karo Kralı - Kuzuryu) ile oynadığı denge oyununda ise matematiği ahlaki bir tartışmaya çevirmesi onun dehasının zirvesidir.",
        },
        {
          heading: "3. Niragi Karşısında Fedakarlık: Nihilizmin İflası",
          body: "Chishiya'nın psikolojik dönüşümü, Usagi'yi vurmak üzere olan Niragi'nin kurşunlarının önüne atlamasıyla gerçekleşir. Kendi mantık silsilesine göre tamamen 'irrasyonel' olan bu fedakarlık, Chishiya'nın bastırdığı vicdanın ve insan sevgisinin nihilizm zırhını delip dışarı taşmasıdır.",
        },
      ],
      clinicalTakeaway: "Aşırı rasyonelleştirme ve alaycılık, derin ahlaki hayal kırıklığına karşı geliştirilmiş kırılgan bir savunmadır; empati yok edilemez, sadece bastırılır.",
      therapeuticApproach: "Varoluşsal Psikoterapi ile 'anlamsızlık kalkanının' ardındaki ahlaki yasın açığa çıkarılması ve şefkat odaklı terapi (CFT) ile öz-bağlantının onarılması gerekirdi.",
    },
  },

  // 4. HIKARI KUINA
  {
    id: "hikari-kuina",
    seriesId: "alice-in-borderland",
    characterName: "Hikari Kuina",
    series: "Alice in Borderland",
    actor: "Aya Asahina",
    role: "supporting",
    roleBadge: "Kilit Karakter",
    image: "/characters/hikari-kuina.jpg",
    category: "travma",
    categoryBadge: "Travma & Kimlik",
    badge: "Kimlik Özgürleşmesi & Beden Zırhı",
    tagline: "Babasının dövüş mirasını kadın kimliğiyle birleştiren, sevdikleri için ölüme meydan okuyan savaşçı.",
    readTime: "8 dk okuma",
    psychologicalProfile: {
      primaryDiagnosis: "Cinsiyet Kimliği Uyumsuzluğu Travması, Ailevi Reddedilme & Kompansatuar Savunma",
      archetype: "Dönüşen Anka & Koruyucu Savaşçı (The Transformed Warrior)",
      defenseMechanisms: ["Bedensel Dönüşüm", "Yüceltme", "Dışsallaştırma"],
      coreConflict: "Geleneksel karate ustası babasının 'erkek veliaht' baskısını reddedip trans kadın kimliğini inşa ederken evden kovulması; annesine olan sevgisiyle hayatta kalma arzusu.",
    },
    summary: "Dojo ustası babasının reddettiği geçmişini dreadlock saçları, bikinisi ve elindeki sahte sigarasıyla geride bırakan; Beach katliamında Last Boss'a karşı çıplak elleriyle kimliğini savunan ikonik dövüşçü.",
    fullContent: {
      lead: "Kuina'nın elinde tuttuğu sönük sahte sigara, sigarayı bırakmasını isteyen hasta annesine verdiği sözün sembolüdür. Onun için Borderland, bedeninin ve ruhunun gerçekliğini kanıtladığı nihai arenadır.",
      quote: {
        text: "Babam beni asla kabul etmedi. Ama ben kendimden vazgeçmedim. Bu beden benim ve onunla yaşayacağım!",
        context: "Kuina'nın Beach yangınında samuray kılıçlı Last Boss ile ölümüne düello yaparken içsel seslenişi.",
      },
      sections: [
        {
          heading: "1. Dojo Mirası ve Reddedilen Öz-Benlik",
          body: "Geleneksel bir dojo ustasının tek oğlu olarak yetiştirilen Kuina, babasının katı maskülinite beklentileri altında boğulmuştur. Beden disforisi yaşayan genç, kadınlık kimliğini seçtiğinde babası tarafından mirastan ve aileden silinmiştir. Bu dışlanma, Kuina'da derin bir aidiyetsizlik yarası bırakmıştır.",
        },
        {
          heading: "2. Sahte Sigara ve Anne Sevgisinin Çapası",
          body: "Kuina'yı hayatta tutan yegane şey, onu koşulsuz kabul eden hasta annesidir. Ağzındaki sahte sigara (nikotinsiz çubuk), annesine verdiği 'sağlığına dikkat etme' sözünün psikolojik bir geçiş nesnesidir (transitional object). Borderland'in cehenneminde her nefeste annesinin sıcaklığını hatırlar.",
        },
        {
          heading: "3. Last Boss Düellosu: Kendi Gücünü Geri Alma",
          body: "Beach yangınında kılıçlı katil Last Boss ile dövüşürken Kuina karate tekniklerini kullanmayı reddeder; çünkü karate babasının zorbalığını simgeler. Ancak köşeye sıkıştığında, babasının dövüş sanatını kendi kadın kimliğiyle entegre eder ve 'babamın değil, benim gücüm' diyerek canavarı çıplak yumruklarıyla devirir.",
        },
      ],
      clinicalTakeaway: "Öz-kimliğin inşası çoğu zaman kök aileyle sancılı bir kopuşu gerektirir; birey kendi bedeninde evinde hissettiğinde hiçbir zorbalık onu yıkamaz.",
      therapeuticApproach: "Olumlu Cinsiyet Kimliği Terapisi ve İçsel Aile Sistemleri (IFS) modeliyle babanın içselleştirilmiş cezalandırıcı sesinin ayrıştırılması hedeflenirdi.",
    },
  },

  // 5. SUGURU NIRAGI
  {
    id: "suguru-niragi",
    seriesId: "alice-in-borderland",
    category: "antisosyal",
    categoryBadge: "Antisosyal & Sadizm",
    characterName: "Suguru Niragi",
    series: "Alice in Borderland",
    actor: "Dori Sakurada",
    role: "supporting",
    roleBadge: "Baş Kötü / Yan Karakter",
    image: "/characters/suguru-niragi.jpg",
    badge: "Malign Sadizm & Saldırganla Özdeşim",
    tagline: "Zorbalığın kurbanıyken canavarına dönüşen, dünyanın çirkinliğini yangınla kanıtlamaya çalışan nihilist.",
    readTime: "9 dk okuma",
    psychologicalProfile: {
      primaryDiagnosis: "Antisosyal Kişilik Bozukluğu (ASPD), Malign Sadizm & Travmatik Saldırganla Özdeşim (Identification with the Aggressor)",
      archetype: "Yaralı Canavar & Yıkıcı Kaos (The Traumatized Sadist)",
      defenseMechanisms: ["Yansıtmalı Özdeşim", "Bölme (Splitting)", "Sadomazoşistik Eyleme Vurma (Acting Out)"],
      coreConflict: "Okul hayatında maruz kaldığı ağır akran zorbalığı ve aşağılanmanın intikamını, eline silah geçirince tüm insanlığa aynı işkenceyi çektirerek almaya çalışması.",
    },
    summary: "Gerçek dünyada tuvaletlere kilitlenen ve dövülen zavallı bir lise öğrencisiyken Borderland'de makineli tüfeğiyle bir ölüm teröristine dönüşen, herkesin içinde gizli bir canavar olduğunu kanıtlamaya takıntılı nihilist.",
    fullContent: {
      lead: "Niragi, cehennemin ateşinde yanarken etrafındaki herkesi de o ateşe çekmek isteyen yaralı bir ruhtur. Dili dışarıda, tüfeği omuzunda gezerken aslında içindeki korkmuş çocuğun çığlıklarını kurşunlarla bastırır.",
      quote: {
        text: "Hepiniz benden nefret ediyorsunuz çünkü size gerçekte ne kadar iğrenç olduğunuzu hatırlatıyorum. Medeniyet sadece ince bir maskedir!",
        context: "Niragi'nin Beach katliamında sivilleri tararken yüzlerine haykırdığı varoluşsal manifestosu.",
      },
      sections: [
        {
          heading: "1. Ağır Akran Zorbalığı ve Ruhsal Çöküş",
          body: "Niragi'nin geçmişi fiziksel ve psikolojik şiddetle doludur. Sınıf arkadaşları tarafından dışkı dolu tuvaletlere sokulan, soyulan ve dövülen Niragi; toplumun merhamet ve ahlak kavramlarının sadece güçsüzleri ezmek için bir yalan olduğunu öğrenmiştir. Bu deneyim onda patolojik bir nefret tortusu bırakmıştır.",
        },
        {
          heading: "2. Saldırganla Özdeşim ve Güç Sarhoşluğu",
          body: "Borderland'e düştüğünde eline otomatik tüfek geçen Niragi, Freudyen anlamda 'saldırganla özdeşleşme' yaşar. Artık kurban değil cellattır. Diline taktığı piercing, giydiği gömlek ve pervasız tavırları; bir daha asla ezilmeyeceğine dair dünyaya çektiği saldırgan bir resttir.",
        },
        {
          heading: "3. Yanmış Beden ve Nihai Hesaplaşma",
          body: "Chishiya tarafından ateşe verilip tüm vücudu yandıktan sonra bile ölümü reddetmesi, onun saf hınçla (ressentiment) yaşadığının kanıtıdır. Arisu ve Chishiya ile son üçlü karşılaşmasında onları da kendisi gibi birer katile dönüştürmeye çalışması, kendi iğrençliğini evrenselleştirme çabasıdır.",
        },
      ],
      clinicalTakeaway: "Tedavi edilmeyen mağduriyet hissi, güçle buluştuğunda en vahşi zulüm biçimlerine dönüşür; kötülük çoğu zaman intikam arayan zayıflıktan doğar.",
      therapeuticApproach: "Yoğun Travma Odaklı Bilişsel Davranışçı Terapi (TF-CBT) ve şiddet döngüsünü kırmak için zihinselleştirme temelli terapi (MBT) gerekirdi.",
    },
  },

  // 6. ANN RIZUNA
  {
    id: "ann-rizuna",
    seriesId: "alice-in-borderland",
    category: "obsesif",
    categoryBadge: "Obsesif & Mantık",
    characterName: "Ann Rizuna",
    series: "Alice in Borderland",
    actor: "Ayaka Miyoshi",
    role: "supporting",
    roleBadge: "Kilit Karakter",
    image: "/characters/ann-rizuna.jpg",
    badge: "Adli Mantık & Hiper-Rasyonalite",
    tagline: "Kaosun ve cesetlerin ortasında sadece kanıtlara inanan, duyguyu yasaklamış soğukkanlı bilim kadını.",
    readTime: "8 dk okuma",
    psychologicalProfile: {
      primaryDiagnosis: "Aşırı Rasyonalizasyon, Bastırılmış Duygulanım (Repression) & Obsesif Empirizm",
      archetype: "Soğukkanlı Bilimci & Adli Araştırmacı (The Forensic Mind)",
      defenseMechanisms: ["Aşırı Mantıksallaştırma", "Duygusal Bastırma", "Kompulsif İnceleme"],
      coreConflict: "Ölümün ve vahşetin yarattığı dehşeti, her şeyi parmak izi, kimyasal reaksiyon ve mantık denklemine indirgeyerek hissizleştirmesi.",
    },
    summary: "Tokyo Polis Teşkilatı Adli Tıp uzmanı. Beach'te yürütücü konsey üyesi olarak oyunların ardındaki bilimsel düzeni çözmeye çalışan, Maça Kralı oyununda doğayla bütünleşerek sınırlarını aşan kadın lider.",
    fullContent: {
      lead: "Ann, gözlerindeki şüpheci bakış ve parmak uçlarındaki adli tebeşirle ölüm oyunlarına yaklaşır. Korku onun için zaman kaybıdır; çözülmesi gereken bir delil zinciri vardır.",
      quote: {
        text: "Duygular yanıltır. İnsanlar yalan söyler. Ama parmak izleri ve fizik kuralları asla yalan söylemez.",
        context: "Beach'te Momoka'nın katilini ararken parmak izi analizi yaptığı 10 of Hearts oyunundaki sözü.",
      },
      sections: [
        {
          heading: "1. Adli Tıp Zırhı: Ölümün Nesneleştirilmesi",
          body: "Gerçek dünyada cinayet mahallerini inceleyen Ann, insan bedenini biyolojik bir veri setine indirgemeyi mesleki bir zorunluluk olarak öğrenmiştir. Bu profesyonel deformasyon, Borderland'deki ceset yığınları karşısında paniklemesini engellemiş, ona mutlak bir soğukkanlılık kazandırmıştır.",
        },
        {
          heading: "2. 10 of Hearts: Cadı Avı ve Empirik Doğruluk",
          body: "Beach'te herkes birbirini linç ederken Ann, cinayet aletindeki parmak izlerini alarak kurbanın aslında intihar ettiğini kanıtlamıştır. Bu kriz anında histeriye kapılmayan tek zihin olması, onun aşırı kontrollü obsesif yapısının hayat kurtarıcı bir fonksiyona bürünmesidir.",
        },
        {
          heading: "3. Doğaya Dönüş ve İklimle Savaş",
          body: "İkinci sezonda tek başına dağlara ve ormanlara açılarak Borderland'in coğrafi sınırlarını haritalandırması, onun kontrol arzusunun mekansal bir ifadesidir. Ancak Maça Kralı ile son savaşta aldığı ölümcül yaralar, onu mantığın sınırlarından çıkarıp saf varoluşsal dirençle yüzleştirir.",
        },
      ],
      clinicalTakeaway: "Aşırı rasyonelleştirme kriz anlarında hayat kurtarsa da, duyguların bastırılması bireyi kendi içsel gerçekliğinden koparır.",
      therapeuticApproach: "Duygu Odaklı Terapi (EFT) ile bastırılmış yas ve dehşet duygularının güvenli bir terapötik alanda boşaltılması amaçlanırdı.",
    },
  },

  // 7. MIRA KANO
  {
    id: "mira-kano",
    seriesId: "alice-in-borderland",
    category: "narsisizm",
    categoryBadge: "Narsisizm & Zihin",
    characterName: "Mira Kano",
    series: "Alice in Borderland",
    actor: "Riisa Naka",
    role: "supporting",
    roleBadge: "Kupa Kraliçesi / Baş Düşman",
    image: "/characters/mira-kano.jpg",
    badge: "Kupa Kraliçesi & Patolojik Gaslighting",
    tagline: "Bir fincan çay eşliğinde zihninizi lime lime eden, gerçekliğin illüzyonisti.",
    readTime: "9 dk okuma",
    psychologicalProfile: {
      primaryDiagnosis: "Malign Narsisizm, Patolojik Gaslighting & Psikopatik Zihin Kontrolü",
      archetype: "Kupa Kraliçesi & Kaotik Terapist (The Dark Puppeteer)",
      defenseMechanisms: ["Yansıtmalı Özdeşim", "Manipülatif Gerçeklik Kurgusu", "Grandiyöz Oyunculuk"],
      coreConflict: "İnsan bilincini kırılgan bir oyuncak olarak görmesi; Arisu'nun ruhsal direncini kırmak için gerçekliği defalarca yeniden kurgulayarak tanrıcılık oynaması.",
    },
    summary: "Borderland'in yöneticilerinden biri ve nihai Kupa Kraliçesi. Beach'te yönetici konseyindeyken masum bir psikiyatrist maskesi takan, kriket oyununda Arisu'ya sunduğu çay seremonisiyle gerçeği ve deliliği birbirine katan deha.",
    fullContent: {
      lead: "Mira, şiddete başvurmaz. Onun silahı kelimeler, suskunluklar ve kurbanının en derin suçluluk duygularıdır. Bir fincan siyah çay eşliğinde insanın aklını başından alabilir.",
      quote: {
        text: "Belki de burası bir oyun değil, Arisu. Belki de sen arkadaşlarının ölümünü kaldıramayıp akıl hastanesine kapatılmış bir delisin. Çayını içer misin?",
        context: "Kupa Kraliçesi oyununun finalinde Arisu'ya kurduğu devasa gaslighting tuzağındaki repliği.",
      },
      sections: [
        {
          heading: "1. Psikiyatr Maskesi ve Makyavelist Gözlem",
          body: "Mira gerçek hayatta bir nörolog/psikiyatrdır. Bu mesleki uzmanlık, ona insan beyninin nörolojik zayıflıklarını ve travma anında gerçeklik algısının nasıl manipüle edilebileceğini öğretmiştir. Beach'teki rolü, insanları gözlemlemek ve en uygun kupa oyunlarını tasarlamaktır.",
        },
        {
          heading: "2. Kupa Kraliçesi Oyunu: Saf Zihinsel İşkence",
          body: "Kraliçe oyununun kuralı basittir: Üç set kriket oynamak ve oyundan çekilmemek. Ancak Mira oyunu fiziksel olarak değil, Arisu'nun zihninde oynar. Arisu'ya uzaylı istilası, nükleer savaş ve son olarak 'akıl hastanesindeki şizofren Arisu' senaryolarını öylesine kusursuz anlatır ki, Arisu vazgeçmenin eşiğine gelir.",
        },
        {
          heading: "3. Usagi'nin Müdahalesi ve Mira'nın Yenilgisi",
          body: "Mira'nın gaslighting büyüsünü bozan şey, Usagi'nin Arisu'yu uyandırmak için bileğini keserek kanıt sunduğu saf sevgi jestidir. Mira, planlanamaz bu insan sevgisi karşısında ilk kez büyülenir ve oyunu tamamlamalarına izin vererek zarif bir teslimiyetle ölümü kabul eder.",
        },
      ],
      clinicalTakeaway: "Manipülatif gaslighting, kurbanın suçluluk ve şüphe duygularından beslenir; bu illüzyonu kıran tek güç dışarıdan gelen sorgulanamaz bir sevgi ve gerçeklik temasıdır.",
      therapeuticApproach: "Klinik olarak ileri derece narsistik psikopati sergilediği için klasik psikoterapiye dirençlidir; kurbanlarının gaslighting travmasından arındırılması odaklı çalışılırdı.",
    },
  },

  // 8. TAKERU DANMA / "HATTER"
  {
    id: "takeru-danma-hatter",
    seriesId: "alice-in-borderland",
    category: "narsisizm",
    categoryBadge: "Narsisizm & İktidar",
    characterName: "Takeru Danma (Hatter)",
    series: "Alice in Borderland",
    actor: "Nobuaki Kaneko",
    role: "supporting",
    roleBadge: "Beach Lideri / Yan Karakter",
    image: "/characters/takeru-danma-hatter.jpg",
    badge: "Megalomanik Kült Lideri & Paranoya",
    tagline: "Sahil ütopyasını bikiniler ve uyuşturucuyla inşa eden, paranoyanın pençesinde çöken sahte kral.",
    readTime: "8 dk okuma",
    psychologicalProfile: {
      primaryDiagnosis: "Megalomanik Bipolar Spektrum Özellikleri, Narsisistik Öfke & Paranoid Çözülme",
      archetype: "Çılgın Şapkacı & Düşmüş Kral (The Delusional King)",
      defenseMechanisms: ["Grandiyöz Fanteziler", "Mani / Hiperaktivite", "İnkar"],
      coreConflict: "Babası gibi sıradan bir şapkacı olarak unutulma dehşeti; Borderland'de herkesi kurtaracak tek lider olduğuna inanarak geliştirdiği mesiyanik sanrı.",
    },
    summary: "Beach (Sahil) adındaki hedonistik koloniyi kurarak tüm oyun kartlarını toplayıp tek bir kişiyi kurtarma kuralını getiren; gücünü kaybetme korkusuyla paranoyaya sürüklenip dostu Aguni tarafından öldürülen kurucu.",
    fullContent: {
      lead: "Hatter, gömleği açık, elinde kadehiyle Beach balkonundan binlerce insana seslenirken bir tanrı gibi görünür. Ancak alkışlar kesildiğinde, ölüm korkusuyla titreyen yalnız bir adamdır.",
      quote: {
        text: "Bütün kartları toplayacağız! Ve ben bu cehennemden ilk çıkan olacağım, sonra sizi de kurtaracağım!",
        context: "Hatter'ın Beach sakinlerini manipüle etmek için yaptığı coşkulu balkon konuşması.",
      },
      sections: [
        {
          heading: "1. Sıradanlıktan Kült Liderliğine",
          body: "Gerçek dünyada Şinjuku'da babasından kalan şapka dükkanını batırmamak için çabalayan sönük bir esnafken, Borderland'in kaosunda karizmasını kullanarak 'Beach' ütopyasını kurmuştur. Bu hızlı yükseliş, altta yatan derin yetersizlik duygusunu grandiyöz bir tanrılık sanrısına çevirmiştir.",
        },
        {
          heading: "2. Hedonistik İnkar Kalkanı",
          body: "Beach'in havuz partileri, bikiniler, müzik ve uyuşturucu dolu atmosferi; ölüm dehşetine karşı inşa edilmiş kolektif bir manik savunmadır (manic defense). Hatter insanlara umut satarak onların kartlarını toplar ve bunu yüce bir fedakarlık olarak sunar.",
        },
        {
          heading: "3. Paranoyak Kriz ve Aguni Tarafından İnfaz",
          body: "Kart sayısı azaldıkça ve oyunlar zorlaştıkça Hatter'ın narsisistik dengesi bozulur. En yakın dostu Aguni dahil herkesin ona komplo kurduğuna inanmaya başlar. Oyun alanında dostunu arkadan vurmaya kalkınca, Aguni tarafından nefsi müdafaayla öldürülür.",
        },
      ],
      clinicalTakeaway: "Kontrolsüz kriz ortamlarında karizmatik liderlerin kurduğu kurtarıcı fantezileri, eninde sonunda liderin kendi paranoyasıyla kanlı bir yıkıma sürüklenir.",
      therapeuticApproach: "Narsisistik zedelenme ve mani döngüsü için psikiyatrik stabilizasyon ile Bilişsel Terapi odaklı gerçeklik testi çalışmaları gerekirdi.",
    },
  },

  // 9. MORIZONO AGUNI
  {
    id: "morizono-aguni",
    seriesId: "alice-in-borderland",
    category: "travma",
    categoryBadge: "Travma & Suçluluk",
    characterName: "Morizono Aguni",
    series: "Alice in Borderland",
    actor: "Sho Aoyagi",
    role: "supporting",
    roleBadge: "Kilit Yan Karakter",
    image: "/characters/morizono-aguni.jpg",
    badge: "Travmatik Yas & Cezalandırıcı Öfke",
    tagline: "Kendi dostunu öldürmenin azabıyla dünyayı ateşe veren, kurşun işlemez dev savaşçı.",
    readTime: "8 dk okuma",
    psychologicalProfile: {
      primaryDiagnosis: "Travmatik Yas Bozukluğu, Ağır İkincil Depresyon & Yıkıcı Kendini Cezalandırma (Thanatos Dürtüsü)",
      archetype: "Yaralı Savaşçı & Sadık Muhafız (The Tragic Guardian)",
      defenseMechanisms: ["Dışsallaştırma (Öfke Patlamaları)", "Bölme", "Mazoşistik Kendini Yok Etme"],
      coreConflict: "Deliren ve arkadaşlarını vurmaya kalkan en yakın dostu Hatter'ı öldürmek zorunda kalmanın vicdani ağırlığı; Beach sakinlerini öldürerek kendi infazını hazırlama arzusu.",
    },
    summary: "Japon Öz Savunma Kuvvetleri eski askeri. Beach'in askeri kanat lideri. Hatter'ın ölümünün ardından kederini kör bir şiddete dönüştüren, ancak Heiya ve Arisu ile karşılaştığında koruyucu özünü yeniden kazanan dev cüsseli fedai.",
    fullContent: {
      lead: "Aguni sessiz, kaslı ve ifadesizdir. Konuşmaz, eyleme geçer. Gözlerindeki derin karanlık, hayatta kalma arzusundan değil, ölmek için onurlu bir neden bulma çabasındandır.",
      quote: {
        text: "Hatter'ı ben öldürdüm! Bütün bu katliam benim suçum! Beni vurun, bu acıyı bitirin artık!",
        context: "10 of Hearts oyununda Beach'i ateşe veren canavarın kendisi olduğunu Arisu'ya itiraf ettiği an.",
      },
      sections: [
        {
          heading: "1. Askeri İntizam ve Koşulsuz Sadakat",
          body: "Aguni gerçek dünyada bir askerdir ve hayatını emir komuta zinciri ile sadakat üzerine kurmuştur. Hatter onun çocukluk dostudur. Hatter'ın hayallerine inanmış, Beach'te onun kirli işlerini ve güvenliğini üstlenerek 'gölgedeki kalkan' olmuştur.",
        },
        {
          heading: "2. Dost Katli ve Psikosomatik Dağılma",
          body: "Hatter akıl sağlığını yitirip Aguni'yi vurmaya çalıştığında Aguni'nin refleksi dostunun canına mal olmuştur. Bu cinayet Aguni'nin ahlaki omurgasını kırmıştır. Kendi canına kıyamadığı için 'Cadı Avı' (10 of Hearts) oyununda canavarlaşarak Beach sakinlerinin kendisini öldürmesini beklemiştir.",
        },
        {
          heading: "3. Akane Heiya İle Telafi ve Baba Figürüne Dönüşüm",
          body: "İkinci sezonda bacağını kaybetmiş liseli okçu Heiya Akane ile karşılaşması, Aguni'nin içindeki koruyucu arketipi yeniden uyandırır. Maça Kralı'na karşı vücudunu kurşunlara siper etmesi, artık ölmek için değil, bir genci yaşatmak için yapılan yüce bir fedakarlıktır.",
        },
      ],
      clinicalTakeaway: "Bastırılmış suçluluk duygusu dışarıya kör bir şiddet olarak yansır; birey ancak başka bir masumu koruma sorumluluğu üstlendiğinde kendi affını bulabilir.",
      therapeuticApproach: "Gelişmiş Yas Terapisi ve Şefkat Odaklı Terapi (CFT) ile içselleştirilmiş suçluluğun sağaltılması gerekirdi.",
    },
  },

  // 10. DAIKICHI KARUBE
  {
    id: "daikichi-karube",
    seriesId: "alice-in-borderland",
    category: "travma",
    categoryBadge: "Travma & Fedakarlık",
    characterName: "Daikichi Karube",
    series: "Alice in Borderland",
    actor: "Keita Machida",
    role: "supporting",
    roleBadge: "Kilit Yan Karakter",
    image: "/characters/daikichi-karube.jpg",
    badge: "Özgecil Sadakat & Koruyucu Ağabey",
    tagline: "Kaba dış görünüşünün ardında devasa bir yürek taşıyan, dostu yaşasın diye canını feda eden kahraman.",
    readTime: "8 dk okuma",
    psychologicalProfile: {
      primaryDiagnosis: "Dürtüsel Karşıt-Tepki, Koruyucu Maskülinite & Özgecil Kendini Feda Etme",
      archetype: "Sadık Muhafız & Soylu Şövalye (The Loyal Protector)",
      defenseMechanisms: ["Eyleme Vurma (Action-orientation)", "Bastırma", "Özgecilik (Altruism)"],
      coreConflict: "Kendi geleceğinden umutsuz hissederken Arisu'nun potansiyeline olan sarsılmaz inancı; dostunu yaşatmak için kendi hayallerinden vazgeçmesi.",
    },
    summary: "Arisu'nun çocukluktan beri en sağlam dayanağı. Barmenlik yapan, sokak dövüşçüsü reflekslerine sahip; 7 of Hearts kurt-kuzu oyununda Arisu'nun gözlerinin içine bakarak ölüme gülümseyen asil ruh.",
    fullContent: {
      lead: "Karube, yumrukları sert ama kalbi tertemiz sokak delikanlısıdır. Arisu'nun tereddüt ettiği yerde o ileri atılır; korkuyu değil, dostluğun sorumluluğunu kuşanır.",
      quote: {
        text: "Arisu, dinle beni... Sen yaşamalısın. Sen zekisin, bu dünyayı çözebilirsin. Bizim yerimize de yaşa, tamam mı?",
        context: "7 of Hearts oyununun son saniyelerinde yakasındaki bomba patlamadan önce Arisu'ya telsizden söylediği son sözler.",
      },
      sections: [
        {
          heading: "1. Barmenlikten Maça Oyunlarının Ön Cephesine",
          body: "Gerçek dünyada bar işletmecisinin sevgilisiyle ilişkisi olduğu için işinden atılan Karube, hayatın sillesini erken yemiş bir gençtir. Borderland'e geldiklerinde fiziksel cesareti ve koruyucu içgüdüsüyle ekibin liderliğini üstlenmiş, korkmuş Arisu ve Chota'ya kalkan olmuştur.",
        },
        {
          heading: "2. Toksik Olmayan Maskülinite ve Kardeşlik Bağı",
          body: "Karube'nin sertliği kabadayılık değil, sevdiklerini koruma içgüdüsüdür. Arisu'nun zekasına hayrandır ve onun kendi potansiyelini görememesine kızar. İlişkilerindeki dinamik, rekabete değil karşılıklı eksiği tamamlama ilkesine dayanır.",
        },
        {
          heading: "3. 7 of Hearts: Yüce Özgecilik (Altruism)",
          body: "Kupa Yedilisi oyununda kurdun göz temasıyla geçtiği ve sadece kurdun hayatta kalacağı açıklandığında, Karube başlangıçta yaşamak için savaşır. Ancak Arisu'nun gözyaşlarını gördüğünde, Chota ile birlikte saklanarak sırayı Arisu'ya bırakır. Bu psikolojik olgunluk, saf bir fedakarlık anıtıdır.",
        },
      ],
      clinicalTakeaway: "Gerçek cesaret korkusuzluk değil; sevdiklerinin geleceği için kendi varlığını arka plana itebilme erdemidir.",
      therapeuticApproach: "Karakterin fedakarlığı patolojik bir değersizlikten değil, yüksek bağlılıktan kaynaklandığı için Arisu'nun terapisinde onurlandırıcı bir anı olarak işlenmelidir.",
    },
  },

  // 11. CHOTA SEGAWA
  {
    id: "chota-segawa",
    seriesId: "alice-in-borderland",
    category: "anhedoni",
    categoryBadge: "Anksiyete & Özgüven",
    characterName: "Chota Segawa",
    series: "Alice in Borderland",
    actor: "Yuki Morinaga",
    role: "supporting",
    roleBadge: "Yan Karakter",
    image: "/characters/chota-segawa.jpg",
    badge: "Kurban Kimliğinden Aşkınlığa Geçiş",
    tagline: "Korkularının esiri bir bilişim çalışanıyken, dostluk uğruna korkusunu aşarak devleşen masumiyet.",
    readTime: "7 dk okuma",
    psychologicalProfile: {
      primaryDiagnosis: "Yaygın Anksiyete Bozukluğu (YAB), Düşük Benlik Saygısı & İnsektör Bağlanma",
      archetype: "Kırılgan Masum & Kurbanın Dönüşümü (The Fragile Innocent)",
      defenseMechanisms: ["Regresyon", "Boyun Eğicilik", "Özgecil Aşkınlık (Self-Transcendence)"],
      coreConflict: "Kült tarikatlara para kaptıran annesinin yarattığı utanç ve ekonomik sömürü; hayatı boyunca hissettiği yetersizliği Arisu ve Karube'nin sevgisiyle aşması.",
    },
    summary: "Bilişim şirketinde çalışan, bacağından yaralandığı için oyunlarda fiziksel yük haline geldiğini düşünen; Kupa Yedilisi oyununda Shibuki'yi zapt ederek Arisu'nun yaşamasına izin veren saf yürek.",
    fullContent: {
      lead: "Chota, üçlünün en zayıf halkası gibi görünür. Sürekli titreyen elleri ve panik atakları, modern insanın belirsizlik karşısındaki çıplak dehşetini yansıtır.",
      quote: {
        text: "Ben hayatım boyunca hep korktum. Ama sizinle geçirdiğim günler hayatımın en güzel günleriydi. Artık korkmuyorum.",
        context: "Kupa Yedilisi labirentinde Karube'nin yanına oturup Arisu'nun kurtulmasını beklerken söylediği veda sözleri.",
      },
      sections: [
        {
          heading: "1. Toksik Anne ve Dini Sömürü Travması",
          body: "Chota'nın maaşını elinden alan ve onu sahte dini ritüellerle borç batağına sokan annesi, Chota'da kronik bir utanç ve yetersizlik hissi yaratmıştır. Bu yüzden Borderland'deki ilk oyunlarda da kurtuluşu tanrılara dua etmekte aramıştır.",
        },
        {
          heading: "2. Shibuki'nin Manipülasyonu ve Cinsellik",
          body: "Bacağından yandıktan sonra sığındığı tapınakta Shibuki'nin cinsellik yoluyla onu manipüle etmesi, Chota'nın onaylanma ve sevilme açlığının tipik bir sonucudur. Ancak bu geçici sığınak, dostlarına olan derin bağını unutturmaya yetmemiştir.",
        },
        {
          heading: "3. Son Anda Gelen Kendini Aşma (Self-Transcendence)",
          body: "Kupa Yedilisi oyununda Shibuki Arisu'yu öldürmeye çalışırken, yaralı bacağına rağmen onu kollarından tutarak durduran Chota'dır. Korkak bir çocuğun son nefesinde sevdikleri için hayatını ortaya koyması, hümanistik psikolojide kendini gerçekleştirmenin en çarpıcı örneğidir.",
        },
      ],
      clinicalTakeaway: "En kırılgan bireyler bile doğru sevgi ve aidiyet ortamında en büyük cesaret örneklerini sergileyebilir; fedakarlık korkuyu siler.",
      therapeuticApproach: "Özgüven inşası ve ebeveyn sınırlarının çizilmesi odaklı Bilişsel Davranışçı Terapi (BDT) uygulanabilirdi.",
    },
  },

  // 12. GINJI KYUMA
  {
    id: "ginji-kyuma",
    seriesId: "alice-in-borderland",
    category: "anhedoni",
    categoryBadge: "Varoluşçuluk & Otantiklik",
    characterName: "Ginji Kyuma",
    series: "Alice in Borderland",
    actor: "Tomohisa Yamashita",
    role: "supporting",
    roleBadge: "Sinek Kralı / Yan Karakter",
    image: "/characters/ginji-kyuma.jpg",
    badge: "Sinek Kralı & Radikal Otantiklik",
    tagline: "Kıyafetleri ve sahte unvanları reddeden, çıplak varoluşuyla ölümü bir dost gibi kucaklayan müzisyen.",
    readTime: "9 dk okuma",
    psychologicalProfile: {
      primaryDiagnosis: "Radikal Otantik Kişilik, Varoluşsal Hümanizm & Nüdist Doğallık Arayışı",
      archetype: "Sinek Kralı & Özgür Ruhlu Dionisos (The Authentic Free-Spirit)",
      defenseMechanisms: ["Yüceltme (Müzik & Sanat)", "Felsefi Entegrasyon", "Radikal Kabul"],
      coreConflict: "Modern toplumun dayattığı statü, kıyafet ve sahteliklerin insanı kendi özünden uzaklaştırması; Borderland'de bile düşmanlarına sevgiyle yaklaşarak dürüst bir rekabet sürdürmesi.",
    },
    summary: "Borderland'in ikinci aşamasında Sinek Kralı (King of Clubs) olarak Arisu'nun karşısına çıkan nüdist rock müzisyeni. Puan kapmaca oyununda dürüstlüğü, takımına olan sevgisi ve yenilgiyi gülümseyerek kabul edişiyle Arisu'ya yaşam dersi veren unutulmaz figür.",
    fullContent: {
      lead: "Kyuma çıplaktır; çünkü üzerinde saklayacak hiçbir sırrı, hilesi ya da toplumsal maskesi yoktur. Onun için yaşamak, her saniyesini tüm çıplaklığıyla hissetmektir.",
      quote: {
        text: "Şu an hayattasın, değil mi Arisu? Kalbin atıyor. İşte tek önemli olan bu. Birbirimizin gözlerinin içine bakabiliyorsak, ölüm bile bir zaferdir.",
        context: "Sinek Kralı oyununun finalinde Arisu'nun elini sıkarak mağlubiyeti ve ölümü asaletle karşıladığı an.",
      },
      sections: [
        {
          heading: "1. Müzik Grubu ve Radikal Yoldaşlık",
          body: "Kyuma gerçek hayatta bir rock grubunun solistidir. Borderland'e grup arkadaşlarıyla birlikte gelmiş ve aralarındaki bağı sarsılmaz bir sevgiye dönüştürmüştür. Diğer oyun yöneticilerinin aksine yarışmacıları düşman değil, aynı kaderi paylaşan değerli yol arkadaşları olarak görür.",
        },
        {
          heading: "2. Çıplaklığın Varoluşsal Sembolizmi",
          body: "Kıyafet giymeyi reddetmesi cinsel bir teşhircilik değil, psikanalitik olarak 'persona'nın (toplumsal maske) tamamen lağvedilmesidir. Kıyafet unvanı, parayı ve sınıfı temsil eder; çıplaklık ise herkesin ölüm karşısındaki eşitliğini simgeler.",
        },
        {
          heading: "3. Arisu İle El Sıkışma: Kaybederken Kazanmak",
          body: "Arisu'nun son saniyede Tatta'nın fedakarlığı sayesinde puan farkını kapatıp oyunu kazanması karşısında Kyuma öfkelenmez; aksine Arisu'nun dehasını ve takımının fedakarlığını takdir eder. Elini sıkarak ölümü kucaklaması, onun 'Ölüm Sanatı' (Ars Moriendi) felsefesinin doruk noktasıdır.",
        },
      ],
      clinicalTakeaway: "Ölüm gerçeğiyle barışmış ve anı radikal bir otantiklikle yaşayan bir zihni hiçbir ölüm oyunu korkutamaz.",
      therapeuticApproach: "Varoluşçu psikoterapi kuramlarının (Irvin Yalom ekolü) yaşayan bir örneğidir; ölüm kaygısını aşma seanslarında vaka modeli olarak incelenebilir.",
    },
  },

  // 13. KEIICHI KUZURYU
  {
    id: "keiichi-kuzuryu",
    seriesId: "alice-in-borderland",
    category: "obsesif",
    categoryBadge: "Obsesif Adalet & Vicdan",
    characterName: "Keiichi Kuzuryu",
    series: "Alice in Borderland",
    actor: "Tsuyoshi Abe",
    role: "supporting",
    roleBadge: "Karo Kralı / Yan Karakter",
    image: "/characters/keiichi-kuzuryu.jpg",
    badge: "Karo Kralı & Radikal Eşitlikçilik",
    tagline: "İnsan hayatının değerini sayılarla ölçmeyi reddeden, asit havuzunda vicdanını temize çeken yargıç.",
    readTime: "9 dk okuma",
    psychologicalProfile: {
      primaryDiagnosis: "Ahlaki Felç (Moral Paralysis), Obsesif Adalet Çatışması & Radikal Eşitlikçilik",
      archetype: "Karo Kralı & Trajik Yargıç (The Righteous Arbiter)",
      defenseMechanisms: ["Aşırı İntellektüalizasyon", "Ahlaki Rasyonalizasyon", "Özgecil İntihar"],
      coreConflict: "Uluslararası bir avukatken zengin müvekkillerinin hayatını yoksul insanların hayatına tercih eden kapitalist sisteme hizmet etmiş olmanın yarattığı derin ahlaki tükenmişlik.",
    },
    summary: "Beach'te ikinci adamken ikinci sezonda Karo Kralı (King of Diamonds) olarak ortaya çıkan deha. Güzellik Yarışması (Sülfürik Asit) oyununda Chishiya ile insan hayatının değerini tartışan ve son hamlede eşitliği korumak için kendi üzerine asit dökülmesine izin veren trajik entelektüel.",
    fullContent: {
      lead: "Kuzuryu kravatını hiç çıkarmaz. Çünkü o bir hukukçudur ve aradığı şey galibiyet değil, insan hayatının evrensel, objektif ve pazarlıksız değerini kanıtlayacak bir adalet denklemidir.",
      quote: {
        text: "Bir insanın hayatı diğerinden daha mı değerlidir? Kim karar verecek buna? Eğer adil bir kural koyamıyorsak, hiçbirimizin yaşamaya hakkı yoktur.",
        context: "Karo Kralı oyununun son turunda Chishiya'ya yönelttiği varoluşsal soru.",
      },
      sections: [
        {
          heading: "1. Şirketler Hukuku ve Ahlaki Travma",
          body: "Kuzuryu gerçek dünyada dev enerji şirketlerinin avukatlığını yapmıştır. Şirketin ihmali yüzünden ölen fakir işçilerin tazminatlarını düşürmek ve zengin yöneticileri kurtarmak için yasaları eğip bükmüş; bu süreçte kendi vicdanını katletmiştir. Borderland onun için tarafsız bir adalet arayışıdır.",
        },
        {
          heading: "2. Güzellik Yarışması ve Sayıların Terazisi",
          body: "0 ile 100 arasında sayı seçilen ve ortalamanın 0.8 katına en yakın sayıyı seçenin hayatta kaldığı oyunda, her kaybedenin üzerine tavandan sülfürik asit dökülür. Kuzuryu bu oyunu tasarlamıştır çünkü matematik rüşvet kabul etmez; kurallar herkes için mutlak derecede eşittir.",
        },
        {
          heading: "3. Chishiya Karşısında Bilinçli Yenilgi",
          body: "Son turda Chishiya bilerek 100 sayısını seçerek Kuzuryu'ya iki seçenek bırakır: Ya 0 seçip Chishiya'yı asitle eritecek ve hayatta kalacak, ya da kendi hayatına son verecektir. Kuzuryu, 'başkalarının hayatı üzerinde karar verme hakkını' reddederek kendi üzerine asit dökülmesini seçer; böylece hayatında ilk kez mutlak adil davranmış olur.",
        },
      ],
      clinicalTakeaway: "Ahlaki yaralanma (moral injury), bireyin kendi değerlerini çiğnemesiyle oluşan en ağır travmadır; kefaret ödenmeden iç huzur bulunamaz.",
      therapeuticApproach: "Ahlaki Onarım Terapisi (Moral Repair Therapy) ve Değerler Odaklı Eylemlilik yaklaşımıyla incelenmesi gereken kusursuz bir klinik vakadır.",
    },
  },

  // 14. AKANE HEIYA
  {
    id: "akane-heiya",
    seriesId: "alice-in-borderland",
    category: "travma",
    categoryBadge: "Travma Sonrası Büyüme",
    characterName: "Akane Heiya",
    series: "Alice in Borderland",
    actor: "Yuri Tsunematsu",
    role: "supporting",
    roleBadge: "Kilit Yan Karakter",
    image: "/characters/akane-heiya.jpg",
    badge: "Travma Sonrası Büyüme & Mekanik Direnç",
    tagline: "Kopan bacağının yerine protez ve yay kuşanan, acısını vahşi bir hayatta kalma enerjisine dönüştüren liseli okçu.",
    readTime: "8 dk okuma",
    psychologicalProfile: {
      primaryDiagnosis: "Travma Sonrası Büyüme (Post-Traumatic Growth), Somatik Dayanıklılık & Erotize Edilmiş Hayatta Kalma Dürtüsü",
      archetype: "Yaralı Amazon & İsankar Okçu (The Resilient Hunter)",
      defenseMechanisms: ["Hiper-Bağımsızlık", "Mizahi Baş Etme", "Karşıt-Fobi"],
      coreConflict: "Gerçek dünyadaki yüzeysel ilişkiler ve duygusal boşluğu; Borderland'de fiziksel organ kaybı yaşamasına rağmen saf hayatta kalma arzusuyla anlamlandırması.",
    },
    summary: "Kaynayan suyla dolu stadyum oyununda bacağını kaybedip kendi bacağını keserek kurtulan lise öğrencisi. Geliştirdiği okçuluk yeteneği ve Aguni ile kurduğu derin güven bağıyla Maça Kralı'na karşı ölümüne savaşan asi savaşçı.",
    fullContent: {
      lead: "Heiya'nın mini eteği, mekanik protez bacağı ve sırtındaki olimpik yayı; onun kırılgan bir genç kızdan yenilmez bir ölüm makinesine dönüşümünün anıtıdır.",
      quote: {
        text: "Bacağımı kaybettim diye öldüğümü mü sandınız? Ben bu dünyada ilk kez gerçekten nefes aldığımı hissettim!",
        context: "Heiya'nın Aguni ile ormanda karşılaştığında sergilediği vahşi yaşama azmini ifade ettiği an.",
      },
      sections: [
        {
          heading: "1. Kaynayan Gayzer ve Kendi Bacağını Ampute Etme",
          body: "Heiya'nın ilk oyunu bir stadyumda gerçekleşmiş ve yer altından fışkıran kaynar sular bacağını eritmiştir. Çöküşe teslim olmak yerine can havliyle sağlam bacağıyla sürünmüş, kangren olan bacağını kendi elleriyle keserek hayatta kalmıştır. Bu deneyim onda aşırı bir acı eşiği ve ölüm korkusuzluğu yaratmıştır.",
        },
        {
          heading: "2. Okçuluk ve Beden Bütünlüğü Kompansasyonu",
          body: "Okul kulübündeki okçuluk deneyimini bir savunma silahına dönüştüren Heiya, protez bacağını bir handikap değil, düşmanlarını şaşırtan bir avantaja çevirmiştir. Psikanalitik olarak organ kaybını aşırı kompanse (overcompensation) ederek zihinsel kontrol sağlamıştır.",
        },
        {
          heading: "3. Aguni İle Güven İlişkisi",
          body: "Sert ve yabani tavırlarının altında Aguni'nin baba şefkatine sığınan Heiya, onun intihar eğilimini sezmiş ve onu hayata bağlamak için elinden geleni yapmıştır. Maça Kralı ile yakın dövüşte Aguni'yi korumak için defalarca vurulmasına rağmen tetiği çekmeye devam etmiştir.",
        },
      ],
      clinicalTakeaway: "Fiziksel uzuv kaybı gibi felaketler, doğru psikolojik direnç (resilience) ile travma sonrası büyümeye (PTG) evrilebilir.",
      therapeuticApproach: "Beden İmgesi Terapisi ve Travma Sonrası Yeniden Bütünleşme protokolleriyle çalışılması gerekirdi.",
    },
  },

  // 15. TAKATORA SAMURA / "THE LAST BOSS"
  {
    id: "takatora-samura-last-boss",
    seriesId: "alice-in-borderland",
    category: "antisosyal",
    categoryBadge: "Antisosyal & Yabancılaşma",
    characterName: "Takatora Samura (The Last Boss)",
    series: "Alice in Borderland",
    actor: "Shuntaro Yanagi",
    role: "supporting",
    roleBadge: "Yan Karakter",
    image: "/characters/takatora-samura-last-boss.jpg",
    badge: "Hikikomori Yabancılaşması & Somatik Dövme Zırhı",
    tagline: "Karanlık bir odada unutulmuş bir hayaletken, katanasıyla tüm dünyayı kan gölüne çeviren dilsiz gölge.",
    readTime: "7 dk okuma",
    psychologicalProfile: {
      primaryDiagnosis: "Şizoid İzolasyon (Ağır Hikikomori), Dissosiyatif Yabancılaşma & Katatonik Öfke",
      archetype: "Yıkıcı Ronin & Sessiz Kıyıcı (The Shadow Recluse)",
      defenseMechanisms: ["Somatik Dışsallaştırma (Tüm Vücut Dövmesi)", "Duygusal Hissizleşme", "Yıkıcı Eyleme Vurma"],
      coreConflict: "Gerçek dünyada yıllarca odasından çıkamayan, ailesinin bile yok saydığı bir parazitken; Borderland'de acımasız bir samuraya dönüşerek varlığını sadece öldürerek kanıtlayabilmesi.",
    },
    summary: "Beach'in askeri kanadının en tehlikeli tetikçisi. Tüm vücudu dövmelerle kaplı, tek kelime konuşmayan, samuray kılıcıyla insanları doğrayan; Kuina ile yangın ortasında yaptığı düelloda geçmişinin hayaletiyle yüzleşen karanlık figür.",
    fullContent: {
      lead: "Last Boss konuşmaz. Gözlerinde ne nefret ne de korku vardır; sadece derin, dipsiz bir hiçlik parlar. Kılıcı savururken sanki insanları değil, kendi geçmişinin utancını keser.",
      quote: {
        text: "...",
        context: "Sessizliği ve sadece kılıcının sesiyle konuşması, onun insan dilini ve iletişimini tamamen terk ettiğinin göstergesidir.",
      },
      sections: [
        {
          heading: "1. Hikikomori İzolasyonu ve Kimliksizlik",
          body: "Gerçek hayatta Japonya'nın en ağır toplumsal yaralarından biri olan 'hikikomori' (toplumdan tamamen izole olup odasından çıkmama) vakasıdır. Yıllarca bilgisayar ekranı karşısında annesinin kapısına bıraktığı yemeklerle yaşamış, toplum için bir 'yaşayan ölü' haline gelmiştir.",
        },
        {
          heading: "2. Tüm Vücut Dövmesi: Kimliği Yeniden Yazma Çabası",
          body: "Borderland'e geldiğinde tüm vücudunu ve yüzünü kaplayan dövmeler yaptırmıştır. Bu ekstrem somatik modifikasyon, eski zayıf ve utanç verici bedenini derisinin altından kazıma ve üzerine korkutucu bir zırh giyme çabasıdır.",
        },
        {
          heading: "3. Kuina İle Karşılaşma: İki Dışlanmışın Çatışması",
          body: "Kuina ile yaptığı dövüş tesadüf değildir. İkisi de toplum tarafından dışlanmış ve bedenlerini dönüştürmüştür; ancak Kuina sevgiyi ve yaşamı seçerken, Last Boss ölümü ve yok etmeyi seçmiştir. Kuina'nın yaşama arzusu, Last Boss'un nihilizmini mağlup etmiştir.",
        },
      ],
      clinicalTakeaway: "Aşırı sosyal izolasyon ve reddedilme, bireyin empatisini tamamen yok ederek onu yaşayan bir şiddet makinesine çevirebilir.",
      therapeuticApproach: "Sosyal Geri Çekilme (Hikikomori) rehabilitasyonu ve Duygu İfadesi Odaklı Sanat Terapisi ile travmanın dışa vurumu gerekirdi.",
    },
  },

  // 16. KODAI TATTA
  {
    id: "kodai-tatta",
    seriesId: "alice-in-borderland",
    category: "anhedoni",
    categoryBadge: "Yetersizlik & Bağlanma",
    characterName: "Kodai Tatta",
    series: "Alice in Borderland",
    actor: "Yutaro Watanabe",
    role: "supporting",
    roleBadge: "Yan Karakter",
    image: "/characters/kodai-tatta.jpg",
    badge: "Yetersizlik Kompleksi & Sessiz Kahramanlık",
    tagline: "Kendini hep bir yük gibi gören oto tamircisinin, dostları uğruna sergilediği en acı fedakarlık.",
    readTime: "7 dk okuma",
    psychologicalProfile: {
      primaryDiagnosis: "Aşağılık Kompleksi (Inferiority Complex), Bağımlı Kişilik Eğilimi & Özgecil Telafi",
      archetype: "Sadık Çırak & Sessiz Kahraman (The Unsung Helper)",
      defenseMechanisms: ["Aşağılık Duygusunu Kompanse Etme", "Aşırı Uyumluluk", "Fedakarlık"],
      coreConflict: "Gerçek dünyada tamirhanede sürekli hata yapıp ustasından azar işiten bir çırakken; Borderland'de Arisu'nun ekibine faydalı olabilmek için canını ortaya koyması.",
    },
    summary: "Beach'te Arisu ile tanışıp ekibe katılan, daima şapkası ve iyi niyetiyle tanınan genç. Sinek Kralı (Kyuma) oyununda takımın yenilgisini engellemek için kendi elini taşla ezerek puan bileziğini Arisu'ya veren ve kan kaybından ölen gizli kahraman.",
    fullContent: {
      lead: "Tatta'nın gözlerinde daima 'ben yine bir hata mı yaptım?' endişesi vardır. Ancak kritik an geldiğinde, onun yüreği en güçlü savaşçılardan bile daha büyüktür.",
      quote: {
        text: "Arisu... Ben hayatım boyunca hiçbir işe yaramadım. Ama bugün, bugün sizin sayenizde bir işe yarayabilirim. Al bu bileziği!",
        context: "Sinek Kralı oyununun son saniyelerinde kendi el bileğini taşla parçalayarak puan transferini sağladığı an.",
      },
      sections: [
        {
          heading: "1. Tamirhane Çıraklığı ve Kronik Yetersizlik",
          body: "Gerçek dünyada bir oto tamircisinde çalışan Tatta, dalgınlığı yüzünden bir müşterinin arabasının cıvatalarını sıkmayı unutmuş ve ustanın elinin ezilmesine sebep olmuştur. Bu kaza Tatta'da telafisi imkansız bir suçluluk ve 'ben sakarım, ben bir işe yaramam' inancı yerleştirmiştir.",
        },
        {
          heading: "2. Arisu'nun Ekibinde Aidiyet Bulma",
          body: "Arisu onu asla küçümsememiş, ona eşit bir dost gibi davranmıştır. Bu koşulsuz kabul, Tatta için hayatında tattığı ilk gerçek aidiyet duygusudur. Bu aidiyet hissi, onun çekingen kişiliğinin içinde uyuyan fedakarlık tohumlarını filizlendirmiştir.",
        },
        {
          heading: "3. Elini Parçalayarak Puanı Aktarma Fedakarlığı",
          body: "Sinek Kralı oyununda puan bileziği koldan çıkmaz kuralını aşmak için, elini bir taşla ezerek kemiklerini kıran ve bileziği Arisu'ya uzatan Tatta; kendi hayatı pahasına oyunu kazandırmıştır. Bu eylem, onun geçmişteki yetersizlik travmasına verdiği nihai ve asil bir cevaptır.",
        },
      ],
      clinicalTakeaway: "Aşağılık kompleksi yaşayan bireyler, kendilerine değer verilen bir grupta dünyanın en asil fedakarlıklarını yapabilecek içsel bir adanmışlığa sahiptir.",
      therapeuticApproach: "Bilişsel Terapi ile 'Temel Değersizlik' inancının çalışılması ve Öz-Şefkat Eğitimi (Self-Compassion Training) uygulanabilirdi.",
    },
  },
];
