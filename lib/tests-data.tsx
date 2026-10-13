import React from "react";
import { 
  ClipboardList, 
  Zap, 
  Users, 
  Heart, 
  Activity, 
  Smile, 
  Shield, 
  Sparkles 
} from "lucide-react";

export interface TestOption {
  text: string;
  score?: number;
  personalityKey?: string;
  dimension?: string;
}

export interface TestQuestion {
  question: string;
  options: TestOption[];
}

export interface RecommendedTherapy {
  id: string;
  name: string;
  matchReason: string;
  benefits: string[];
  duration: string;
  format: string;
}

export interface TestResultReport {
  title: string;
  scoreText?: string;
  badge?: string;
  evaluation: string;
  advice: string;
  recommendedTherapy: RecommendedTherapy;
}

export interface TestDefinition {
  id: string;
  icon: React.ReactNode;
  title: string;
  category: "Klinik & Duygudurum" | "Kişilik & Benlik" | "İlişkiler & Bağlanma" | "Stres & Yaşam Dengesi";
  duration: string;
  questionCount: number;
  badge?: string;
  desc: string;
  questions: TestQuestion[];
  getResult: (answers: TestOption[]) => TestResultReport;
}

export const TEST_CATEGORIES = [
  "Tümü",
  "Klinik & Duygudurum",
  "Kişilik & Benlik",
  "İlişkiler & Bağlanma",
  "Stres & Yaşam Dengesi"
] as const;

export const PSYCHOLOGY_TESTS: TestDefinition[] = [
  // ==========================================
  // 1. BECK DEPRESYON ÖLÇEĞİ (21 SORU - KLİNİK STANDART)
  // ==========================================
  {
    id: "beck-depresyon-olcegi",
    icon: <ClipboardList size={32} />,
    title: "Beck Depresyon Düzeyi Ölçeği (BDI)",
    category: "Klinik & Duygudurum",
    duration: "7 Dakika",
    questionCount: 21,
    badge: "21 Soru • Klinik Standart",
    desc: "Bilişsel Davranışçı Terapi'nin kurucusu Aaron T. Beck tarafından geliştirilen, son iki haftadaki duygudurum çökkünlüğü, anhedoni, suçluluk ve enerji kaybını ölçen 21 soruluk tam klinik simülasyon.",
    questions: [
      {
        question: "1. Genel Ruh Hali ve Hüzün: Kendinizi son zamanlarda nasıl hissediyorsunuz?",
        options: [
          { text: "Kendimi üzüntülü veya kederli hissetmiyorum.", score: 0 },
          { text: "Kendimi çoğunlukla hüzünlü ve neşesiz hissediyorum.", score: 1 },
          { text: "Her zaman hüzünlüyüm ve bundan bir türlü kurtulamıyorum.", score: 2 },
          { text: "O kadar kederli ve mutsuzum ki artık dayanamıyorum.", score: 3 },
        ],
      },
      {
        question: "2. Geleceğe Bakış: Geleceğiniz hakkında ne düşünüyorsunuz?",
        options: [
          { text: "Gelecek hakkında karamsar ya da umutsuz değilim.", score: 0 },
          { text: "Geleceğe baktığımda içimi zaman zaman karamsarlık kaplıyor.", score: 1 },
          { text: "Gelecekten hiçbir beklentim yok, hiçbir şey düzelmeyecek gibi.", score: 2 },
          { text: "Gelecek tamamen karanlık ve hiçbir umudum kalmadı.", score: 3 },
        ],
      },
      {
        question: "3. Başarısızlık Hissi: Geçmişinize baktığınızda başarı algınız nedir?",
        options: [
          { text: "Kendimi başarısız bir insan olarak görmüyorum.", score: 0 },
          { text: "Ortalama bir insandan daha çok başarısızlığa uğradığımı hissediyorum.", score: 1 },
          { text: "Geçmişe baktığımda yalnızca başarısızlıklarımı ve hatalarımı görüyorum.", score: 2 },
          { text: "Kendimi bir insan olarak tamamen başarısız ve yetersiz buluyorum.", score: 3 },
        ],
      },
      {
        question: "4. Keyif ve Haz Alma (Anhedoni): Günlük aktivitelerden ne kadar zevk alıyorsunuz?",
        options: [
          { text: "Her zamanki gibi şeylerden zevk almaya devam ediyorum.", score: 0 },
          { text: "Eskiden keyif aldığım şeylerden artık eskisi kadar zevk alamıyorum.", score: 1 },
          { text: "Artık neredeyse hiçbir şeyden gerçek bir tat ya da zevk alamıyorum.", score: 2 },
          { text: "Her şey bana tamamen anlamsız, boş ve sıkıcı geliyor.", score: 3 },
        ],
      },
      {
        question: "5. Suçluluk Duygusu: Kendinizi ne sıklıkla suçlu hissediyorsunuz?",
        options: [
          { text: "Kendimi özel olarak suçlu hissetmiyorum.", score: 0 },
          { text: "Zaman zaman kendimi kötü ya da suçlu hissettiğim oluyor.", score: 1 },
          { text: "Çoğu zaman kendimi derin bir suçluluk duygusu içinde buluyorum.", score: 2 },
          { text: "Her an kendimi affedilemez derecede suçlu ve değersiz hissediyorum.", score: 3 },
        ],
      },
      {
        question: "6. Cezalandırılma Hissi: Hayatın sizi cezalandırdığını düşünüyor musunuz?",
        options: [
          { text: "Cezalandırıldığımı ya da cezayı hak ettiğimi hissetmiyorum.", score: 0 },
          { text: "Sanki başıma kötü bir ceza gelebilirmiş gibi hissediyorum.", score: 1 },
          { text: "Yaşadığım olumsuzluklarla bir şekilde cezalandırıldığımı hissediyorum.", score: 2 },
          { text: "Şu an tam anlamıyla hak ettiğim bir cezayı çekiyorum.", score: 3 },
        ],
      },
      {
        question: "7. Öz-Hoşnutsuzluk: Kendinize karşı tutumunuz nasıldır?",
        options: [
          { text: "Kendimden genel olarak memnunum, kendimle barışığım.", score: 0 },
          { text: "Bazen kendimden hayal kırıklığı duyuyorum.", score: 1 },
          { text: "Kendimden hiç hoşlanmıyorum, kendime tahammülüm azaldı.", score: 2 },
          { text: "Kendimden tamamen nefret ediyorum ve tiksiniyorum.", score: 3 },
        ],
      },
      {
        question: "8. Kendini Eleştirme: Hatalar karşısında kendinize yaklaşımınız:",
        options: [
          { text: "Kendimi başkalarından daha fazla eleştirmem.", score: 0 },
          { text: "Kusurlarım ve zayıflıklarım için kendimi sıkça eleştiririm.", score: 1 },
          { text: "Tüm hatalarım ve aksilikler için sürekli kendimi suçlarım.", score: 2 },
          { text: "Dünyadaki tüm kötü giden şeylerin sorumlusu benmişim gibi kendimi suçlarım.", score: 3 },
        ],
      },
      {
        question: "9. Yaşama Bağlılık ve İstek: Hayata devam etme arzunuz ne durumda?",
        options: [
          { text: "Yaşamayı seviyorum, hayata dair güçlü bir bağım var.", score: 0 },
          { text: "Bazen uyusam ve hiç uyanmasam diye aklımdan geçer ama bir şey yapmam.", score: 1 },
          { text: "Keşke ölsem ya da yok olsam diye sıkça düşünüyorum.", score: 2 },
          { text: "Eğer fırsatını bulursam kendime zarar vermeyi veya hayatımı sonlandırmayı planlıyorum.", score: 3 },
        ],
      },
      {
        question: "10. Ağlama Nöbetleri: Ağlama sıklığınız son dönemde nasıl?",
        options: [
          { text: "Her zamankinden fazla ağlamıyorum.", score: 0 },
          { text: "Şimdilerde eskisine göre çok daha kolay ve sık ağlıyorum.", score: 1 },
          { text: "Sürekli ağlıyorum, kendimi tutamıyorum.", score: 2 },
          { text: "Eskiden ağlayabilirdim ama artık ağlamak istesem bile içim kurudu, ağlayamıyorum.", score: 3 },
        ],
      },
      {
        question: "11. Huzursuzluk ve Ajitasyon: Bedeninizde veya zihninizde bir gerilim var mı?",
        options: [
          { text: "Her zamankinden daha huzursuz veya gergin değilim.", score: 0 },
          { text: "Kendimi biraz daha tedirgin ve huzursuz hissediyorum.", score: 1 },
          { text: "O kadar huzursuzum ki yerimde durmakta ve oturmakta zorlanıyorum.", score: 2 },
          { text: "İçimdeki huzursuzluktan dolayı sürekli kıpırdanmak, volta atmak zorundayım.", score: 3 },
        ],
      },
      {
        question: "12. İnsanlardan Geri Çekilme: Sosyal temas ve insanlarla görüşme arzunuz:",
        options: [
          { text: "İnsanlara ve arkadaşlarıma olan ilgimi kaybetmedim.", score: 0 },
          { text: "İnsanlarla eskisi kadar görüşmek ve konuşmak istemiyorum.", score: 1 },
          { text: "İnsanlara olan ilgimin çoğunu kaybettim, yalnız kalmak istiyorum.", score: 2 },
          { text: "İnsanlarla görüşmeye hiç tahammülüm kalmadı, herkesten tamamen koptum.", score: 3 },
        ],
      },
      {
        question: "13. Karar Verme Güçlüğü: Günlük veya önemli kararları alırken:",
        options: [
          { text: "Kararlarımı eskisi gibi rahatlıkla alabiliyorum.", score: 0 },
          { text: "Karar vermeyi eskisinden daha çok erteliyorum.", score: 1 },
          { text: "Karar vermekte çok büyük güçlük çekiyorum, zihnim kilitleniyor.", score: 2 },
          { text: "Artık hiçbir konuda kendi başıma karar alamıyorum.", score: 3 },
        ],
      },
      {
        question: "14. Değersizlik İnancı: Kendinizin varlığı hakkında ne düşünüyorsunuz?",
        options: [
          { text: "Kendimi değerli ve işe yarar bir insan olarak görüyorum.", score: 0 },
          { text: "Kendimi eskisi kadar değerli ve yararlı hissetmiyorum.", score: 1 },
          { text: "Başkalarıyla karşılaştırıldığında kendimi tamamen değersiz buluyorum.", score: 2 },
          { text: "Kendimi bütünüyle işe yaramaz, lüzumsuz ve boş bir varlık olarak görüyorum.", score: 3 },
        ],
      },
      {
        question: "15. Enerji Düzeyi: Günlük enerjiniz ve dayanıklılığınız nasıl?",
        options: [
          { text: "Her zamanki kadar enerjim var.", score: 0 },
          { text: "Eskisine göre daha az enerjim var, çabuk yoruluyorum.", score: 1 },
          { text: "Pek çok şeyi yapmaya yetecek kadar enerjim kalmadı.", score: 2 },
          { text: "Hiçbir şey yapacak enerjim yok, kıl hissedecek gücüm bile kalmadı.", score: 3 },
        ],
      },
      {
        question: "16. Uyku Düzeni: Uyku kaliteniz ve süreniz nasıl etkilendi?",
        options: [
          { text: "Uyku düzenimde hiçbir değişiklik yok.", score: 0 },
          { text: "Eskisinden biraz daha fazla veya biraz daha az uyuyorum.", score: 1 },
          { text: "Uykuya dalmakta zorlanıyorum veya sabahları saatler önce uyanıp tekrar uyuyamıyorum.", score: 2 },
          { text: "Hemen hemen her gece saatlerce uyanığım veya günün 14 saatini uyuyarak geçiriyorum.", score: 3 },
        ],
      },
      {
        question: "17. Alınganlık ve Sinirlilik: Kolay öfkelenir misiniz?",
        options: [
          { text: "Her zamankinden daha sinirli veya alıngan değilim.", score: 0 },
          { text: "Eskisine göre biraz daha çabuk sinirleniyorum.", score: 1 },
          { text: "Eskisinden çok daha fazla sinirliyim, her şey beni çıldırtıyor.", score: 2 },
        ],
      },
      {
        question: "18. İştah Değişiklikleri: Yemek yeme alışkanlığınız ne durumda?",
        options: [
          { text: "İştahımda belirgin bir değişiklik yok.", score: 0 },
          { text: "İştahım eskisinden biraz daha az ya da biraz daha fazla.", score: 1 },
          { text: "İştahım çok azaldı, zorla yiyorum ya da sürekli tıkınırcasına yiyorum.", score: 2 },
          { text: "Hiç iştahım kalmadı, günlerce yemiyorum ya da kontrolsüzce sürekli yiyorum.", score: 3 },
        ],
      },
      {
        question: "19. Odaklanma ve Zihinsel Berraklık: Bir şeye dikkatinizi verebiliyor musunuz?",
        options: [
          { text: "Eskisi kadar iyi odaklanabiliyorum.", score: 0 },
          { text: "Bir konuya odaklanmak eskisinden biraz daha fazla gayret gerektiriyor.", score: 1 },
          { text: "Zihnimi herhangi bir şeye odaklamakta çok zorlanıyorum, sürekli kopuyorum.", score: 2 },
          { text: "Hiçbir şeye konsantre olamıyorum, beynim tamamen sisli ve durmuş gibi.", score: 3 },
        ],
      },
      {
        question: "20. Yorgunluk ve Bitkinlik: Kendinizi ne kadar yorgun hissediyorsunuz?",
        options: [
          { text: "Her zamankinden daha yorgun değilim.", score: 0 },
          { text: "Eskisine göre daha çabuk yoruluyorum.", score: 1 },
          { text: "Neredeyse yaptığım her şey beni çok fazla yoruyor.", score: 2 },
          { text: "Kendimi hiçbir şey yapamayacak kadar bitkin hissediyorum.", score: 3 },
        ],
      },
      {
        question: "21. Cinsel İlgi ve Yaşam Coşkusu: Libido ve tutkularınız ne durumda?",
        options: [
          { text: "Cinselliğe ve yaşama olan ilgimde bir değişiklik yok.", score: 0 },
          { text: "Cinselliğe olan ilgim eskisinden biraz daha az.", score: 1 },
          { text: "Cinselliğe olan ilgim belirgin ölçüde azaldı.", score: 2 },
          { text: "Cinsel ilgimi ve yaşamsal tutkumu tamamen kaybettim.", score: 3 },
        ],
      },
    ],
    getResult: (answers) => {
      const total = answers.reduce((sum, curr) => sum + (curr.score || 0), 0);
      if (total <= 10) {
        return {
          title: "Minimal / Sağlıklı Duygudurum",
          scoreText: `Toplam Skor: ${total} / 63 • Normal Klinik Sınırlar`,
          badge: "Dengeli",
          evaluation: "Depresif belirtileriniz klinik olarak minimal düzeydedir. Günlük yaşamda zaman zaman üzüntü ya da yorgunluk yaşasanız bile, zihinsel dayanıklılığınız ve geleceğe dönük umut mekanizmanız sağlıklı işlemektedir.",
          advice: "Mevcut dengenizi korumak için doğa yürüyüşleri, kaliteli uyku ve sevdiğiniz dostlarla olan temasınızı canlı tutmaya devam edin.",
          recommendedTherapy: {
            id: "bireysel",
            name: "Bireysel Psikoterapi & Yaşam Dengesi",
            matchReason: "Mevcut zihinsel dayanıklılığı güçlendirmek ve yaşam doyumunu en üst seviyeye çıkarmak için uygundur.",
            benefits: ["Öz-farkındalığın derinleşmesi", "Stres faktörlerine karşı koruyucu zırh inşası", "Kişisel potansiyeli maksimize etme"],
            duration: "50 Dakika",
            format: "Yüz Yüze veya Çevrimiçi (Online)",
          },
        };
      } else if (total <= 18) {
        return {
          title: "Hafif Düzey Depresif Belirtiler (Durgunluk Dönemi)",
          scoreText: `Toplam Skor: ${total} / 63 • Hafif Seviye`,
          badge: "Farkındalık Gerekli",
          evaluation: "Son haftalarda zihninizde keyifsizlik, isteksizlik, enerji düşüklüğü ve karamsar otomatik düşünceler birikmeye başlamış. Bu durum henüz kronikleşmemiş olsa da yaşam kalitenizi hissedilir biçimde aşağı çekmektedir.",
          advice: "Bilişsel Davranışçı Terapi (BDT) ilkelerine göre: Duyguların düzelmesini beklemeden küçük davranışsal eylemler başlatın. Günlük hayatınızda keyif ve başarı hissi veren mikro adımlar atın.",
          recommendedTherapy: {
            id: "bdt",
            name: "Bilişsel Davranışçı Terapi (BDT)",
            matchReason: "Otomatik olumsuz düşünce tuzaklarını (felaketleştirme, ya hep ya hiç) kırmak ve davranışsal aktivasyonla enerjiyi geri kazanmak için birincil kanıta dayalı yöntemdir.",
            benefits: ["Olumsuz düşünce kalıplarını yeniden yapılandırma", "Günlük yaşam enerjisini adım adım geri kazanma", "Duygudurumu kendi kendine regüle etme becerisi"],
            duration: "50 Dakika",
            format: "Yüz Yüze veya Çevrimiçi (Online)",
          },
        };
      } else if (total <= 29) {
        return {
          title: "Orta Düzey Depresif Eğilim (Klinik Müdahale Eşiği)",
          scoreText: `Toplam Skor: ${total} / 63 • Orta Şiddet`,
          badge: "Klinik Destek Önerilir",
          evaluation: "Keyif alamama (anhedoni), suçluluk duyguları, derin yorgunluk ve karar verme felci belirgin bir klinik tablo oluşturmaktadır. Zihniniz olayları karanlık bir filtreden geçirmekte ve bu durum sosyal/iş yaşamınızı zorlamaktadır.",
          advice: "Bu süreç bir irade zayıflığı değil, sinir sisteminin aşırı yüklenme alarmıdır. Yapılandırılmış bir psikoterapi süreci düşünce kalıplarınızı ve biyolojik ritminizi hızla toparlayacaktır.",
          recommendedTherapy: {
            id: "depresyon",
            name: "Depresyon & Bilişsel Davranışçı Terapi (BDT)",
            matchReason: "Orta düzey depresyonda BDT, düşünce döngülerini kırmak ve çökkünlüğü dağıtmak için dünyada en çok tavsiye edilen terapi ekolüdür.",
            benefits: ["Anhedoniyi (zevksizliği) kıran davranışsal aktivasyon", "Suçluluk ve değersizlik inançlarını dönüştürme", "Tekrarlamayı önleyici zihinsel başa çıkma stratejileri"],
            duration: "50 Dakika",
            format: "Yüz Yüze (Klinik) veya Çevrimiçi (Online)",
          },
        };
      } else {
        return {
          title: "Şiddetli Depresyon Tablosu (Öncelikli Klinik Süreç)",
          scoreText: `Toplam Skor: ${total} / 63 • Şiddetli Seviye`,
          badge: "Öncelikli Klinik Destek",
          evaluation: "Bedeniniz ve zihniniz derin bir tükenmişlik, çaresizlik ve anlamsızlık döngüsüne girmiş durumdadır. Yaşamdan kopma hissi ve yoğun suçluluk duyguları tek başınıza taşıyamayacağınız kadar ağırlaşmıştır.",
          advice: "Lütfen bu yükü tek başınıza omuzlamayın. Bu durum tamamen tedavi edilebilir nörobiyolojik ve psikolojik bir süreçtir. Vakit kaybetmeden uzman bir klinik psikolog veya psikiyatrist ile seans planlamanız hayati önemdedir.",
          recommendedTherapy: {
            id: "emdr",
            name: "Bütüncül Klinik Psikoterapi & EMDR",
            matchReason: "Şiddetli depresif durumlarda geçmiş kök travmaları çözümlemek ve bilişsel yapılandırmayı sağlamak için çok yönlü uzman klinik desteği şarttır.",
            benefits: ["Güvenli ve şefkatli bir klinik alanda duygusal yükü boşaltma", "Travmatik anı ağlarını yeniden işleme", "Yaşama yeniden tutunma ve umut inşası"],
            duration: "60 Dakika",
            format: "Öncelikli Yüz Yüze Seans veya Güvenli Online Protokol",
          },
        };
      }
    },
  },

  // ==========================================
  // 2. BECK ANKSİYETE ÖLÇEĞİ (21 SORU - KLİNİK STANDART)
  // ==========================================
  {
    id: "beck-anksiyete-olcegi",
    icon: <Zap size={32} />,
    title: "Beck Anksiyete ve Kaygı Ölçeği (BAI)",
    category: "Klinik & Duygudurum",
    duration: "7 Dakika",
    questionCount: 21,
    badge: "21 Soru • Klinik Standart",
    desc: "Bedeninizin ve sempatik sinir sisteminizin 'tehlike alarmı' seviyesini, somatik uyarılmışlığı, panik belirtilerini ve endişe yoğunluğunu ölçen 21 soruluk altın standart klinik ölçek.",
    questions: [
      {
        question: "1. Bedenin Uyuşması / Karıncalanması: Kollarınızda, bacaklarınızda veya yüzünüzde uyuşma hissi:",
        options: [
          { text: "Hiç hissetmedim (0 Puan)", score: 0 },
          { text: "Hafif düzeyde; beni pek rahatsız etmedi (1 Puan)", score: 1 },
          { text: "Orta düzeyde; rahatsız ediciydi ama katlanabildim (2 Puan)", score: 2 },
          { text: "Çok şiddetli; neredeyse dayanamadım (3 Puan)", score: 3 },
        ],
      },
      {
        question: "2. Sıcak Basması / Ateş Basması: Ani terleme veya bedende sıcak dalgalanmaları:",
        options: [
          { text: "Hiç olmadı (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde (2 Puan)", score: 2 },
          { text: "Çok şiddetli ve bunaltıcı (3 Puan)", score: 3 },
        ],
      },
      {
        question: "3. Bacaklarda Titreme / Halsizlik: Ayakta dururken bacaklarınızın titremesi ya da boşalması:",
        options: [
          { text: "Hiç olmadı (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde (2 Puan)", score: 2 },
          { text: "Çok şiddetli, ayakta durmakta zorlandım (3 Puan)", score: 3 },
        ],
      },
      {
        question: "4. Gevşeyememe / Rahatlayamama: Bedeninizin sürekli kaskatı ve gergin bir yay gibi olması:",
        options: [
          { text: "Hiç hissetmedim, rahatça gevşeyebiliyorum (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde, gevşemekte zorlanıyorum (2 Puan)", score: 2 },
          { text: "Çok şiddetli, bedenim 24 saat kaskatı ve gergin (3 Puan)", score: 3 },
        ],
      },
      {
        question: "5. Çok Kötü Şeyler Olacak Korkusu: Nedensiz bir felaket ve facia beklentisi:",
        options: [
          { text: "Hiç yaşamadım (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde, aklıma sürekli kötü ihtimaller geliyor (2 Puan)", score: 2 },
          { text: "Çok şiddetli, her an bir felaket olacak dehşeti içindeyim (3 Puan)", score: 3 },
        ],
      },
      {
        question: "6. Baş Dönmesi / Sersemlik Hissi: Yer ayaklarınızın altından kayıyor gibi hissetme:",
        options: [
          { text: "Hiç olmadı (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde, başım dönüyor ve sersemliyorum (2 Puan)", score: 2 },
          { text: "Çok şiddetli, düşecek veya bayılacak gibi oluyorum (3 Puan)", score: 3 },
        ],
      },
      {
        question: "7. Kalp Çarpıntısı / Hızlı Atması: Göğsünüzde kalbinizin küt küt atması veya yerinden fırlayacak gibi olması:",
        options: [
          { text: "Hiç olmadı (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde, durduk yere hızlanıyor (2 Puan)", score: 2 },
          { text: "Çok şiddetli, kalp krizi geçiriyorum gibi panikletiyor (3 Puan)", score: 3 },
        ],
      },
      {
        question: "8. Dengeyi Kaybetme / Ayakta Duramama Hissi:",
        options: [
          { text: "Hiç yaşamadım (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde (2 Puan)", score: 2 },
          { text: "Çok şiddetli ve panik verici (3 Puan)", score: 3 },
        ],
      },
      {
        question: "9. Dehşete Kapılma / Panik Hali: Nedensiz yoğun korku patlamaları:",
        options: [
          { text: "Hiç olmadı (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde (2 Puan)", score: 2 },
          { text: "Çok şiddetli panik atak nöbetleri yaşıyorum (3 Puan)", score: 3 },
        ],
      },
      {
        question: "10. Sinirlilik / Gerginlik: Her an patlayacak gibi hissetme:",
        options: [
          { text: "Hiç hissetmedim (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde (2 Puan)", score: 2 },
          { text: "Çok şiddetli, en ufak şeye aşırı tepki veriyorum (3 Puan)", score: 3 },
        ],
      },
      {
        question: "11. Boğulma / Nefes Alamama Hissi: Ciğerlerinize yeterince hava gitmiyor gibi hissetme:",
        options: [
          { text: "Hiç olmadı (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde, sık sık derin nefes alma ihtiyacı duyuyorum (2 Puan)", score: 2 },
          { text: "Çok şiddetli boğulma ve hava açlığı yaşıyorum (3 Puan)", score: 3 },
        ],
      },
      {
        question: "12. Ellerde ve Parmaklarda Titreme:",
        options: [
          { text: "Hiç olmadı (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde (2 Puan)", score: 2 },
          { text: "Çok şiddetli, bardak tutarken bile titriyor (3 Puan)", score: 3 },
        ],
      },
      {
        question: "13. Sallantı / İçsel Titreme Hissi: Bedenin içinde bir motor çalışıyormuş gibi titreme:",
        options: [
          { text: "Hiç hissetmedim (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde (2 Puan)", score: 2 },
          { text: "Çok şiddetli ve tedirgin edici (3 Puan)", score: 3 },
        ],
      },
      {
        question: "14. Kontrolü Kaybetme / Delirme Korkusu: Aklımı kaybedeceğim endişesi:",
        options: [
          { text: "Hiç yaşamadım (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde, aklımı kaçırır mıyım diye korkuyorum (2 Puan)", score: 2 },
          { text: "Çok şiddetli kontrol kaybı ve delirme dehşeti yaşıyorum (3 Puan)", score: 3 },
        ],
      },
      {
        question: "15. Nefes Tıkanıklığı / Göğüste Baskı: Göğsün üstünde ağır bir taş oturuyormuş hissi:",
        options: [
          { text: "Hiç hissetmedim (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde (2 Puan)", score: 2 },
          { text: "Çok şiddetli ve soluksuz bırakıcı (3 Puan)", score: 3 },
        ],
      },
      {
        question: "16. Ölüm Korkusu: Kalp krizi veya ani bir hastalıkla öleceğim korkusu:",
        options: [
          { text: "Hiç yaşamadım (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde, bedenimi sürekli dinliyorum (2 Puan)", score: 2 },
          { text: "Çok şiddetli, her an öleceğim paniği yaşıyorum (3 Puan)", score: 3 },
        ],
      },
      {
        question: "17. Korkuya Kapılma ve Kaçma İsteği: Ortamı terk etme refleksi:",
        options: [
          { text: "Hiç olmadı (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde, kapalı yerlerde hemen çıkış arıyorum (2 Puan)", score: 2 },
          { text: "Çok şiddetli panikleyip kaçıyorum (3 Puan)", score: 3 },
        ],
      },
      {
        question: "18. Mide Bulantısı / Sindirim Rahatsızlığı: Stres anında midede düğümlenme:",
        options: [
          { text: "Hiç hissetmedim (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde, midem bulanıyor veya bağırsaklarım bozuluyor (2 Puan)", score: 2 },
          { text: "Çok şiddetli sindirim krampları ve bulantı yaşıyorum (3 Puan)", score: 3 },
        ],
      },
      {
        question: "19. Baygınlık Hissi / Kendinden Geçme Korkusu:",
        options: [
          { text: "Hiç olmadı (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde (2 Puan)", score: 2 },
          { text: "Çok şiddetli, bayılacak gibi oluyorum (3 Puan)", score: 3 },
        ],
      },
      {
        question: "20. Yüzün Kızarması veya Soğuk Ter Boşanması:",
        options: [
          { text: "Hiç yaşamadım (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde (2 Puan)", score: 2 },
          { text: "Çok şiddetli buz gibi terleme yaşıyorum (3 Puan)", score: 3 },
        ],
      },
      {
        question: "21. Boğazda Düğümlenme / Yutkunma Zorluğu (Globus hissi):",
        options: [
          { text: "Hiç hissetmedim (0 Puan)", score: 0 },
          { text: "Hafif düzeyde (1 Puan)", score: 1 },
          { text: "Orta düzeyde boğazımda bir yumru var gibi (2 Puan)", score: 2 },
          { text: "Çok şiddetli yutkunamama ve boğulma hissi (3 Puan)", score: 3 },
        ],
      },
    ],
    getResult: (answers) => {
      const total = answers.reduce((sum, curr) => sum + (curr.score || 0), 0);
      if (total <= 9) {
        return {
          title: "Minimal Kaygı Seviyesi",
          scoreText: `Toplam Skor: ${total} / 63 • Normal Düzey`,
          badge: "Sağlıklı Aralık",
          evaluation: "Kaygı düzeyiniz sağlıklı biyolojik ve psikolojik sınırlar içindedir. Sempatik sinir sisteminiz stres faktörleri karşısında ölçülü tepkiler vermekte ve tehlike geçince hızla gevşeyebilmektedir.",
          advice: "Mevcut dengeli durumunuzu korumak için düzenli uyku ve diyafram nefesi alışkanlıklarınıza devam edin.",
          recommendedTherapy: {
            id: "bireysel",
            name: "Bireysel Psikoterapi & Farkındalık",
            matchReason: "Genel yaşam dengesini sürdürmek ve stres toleransını daha da artırmak için uygundur.",
            benefits: ["Bedensel farkındalığı koruma", "Öz-düzenleme kapasitesini artırma", "Sağlıklı başa çıkma repertuarı geliştirme"],
            duration: "50 Dakika",
            format: "Yüz Yüze veya Çevrimiçi (Online)",
          },
        };
      } else if (total <= 18) {
        return {
          title: "Hafif Düzey Anksiyete Uyarılmışlığı",
          scoreText: `Toplam Skor: ${total} / 63 • Hafif Seviye`,
          badge: "Farkındalık Gerekli",
          evaluation: "Bedeniniz ve zihniniz belirli dönemlerde aşırı alarm moduna geçiyor. Kalp çarpıntısı, kas gerginliği ve felaket senaryoları ara sıra yaşam kalitenizi zorlamaya başlamış görünüyor.",
          advice: "Kafein tüketimini sınırlandırmak, 4-7-8 nefes tekniği uygulamak ve kaygı düşüncelerini kağıda dökerek somutlaştırmak sinir sisteminizi hızla rahatlatacaktır.",
          recommendedTherapy: {
            id: "panik-kaygi",
            name: "Kaygı & Panik Atak Yönetimi (Somatik & BDT)",
            matchReason: "Hafif-orta düzey kaygının kronikleşmesini önlemek ve bedensel panik sinyallerini sakinleştirmeyi öğrenmek için en etkili yaklaşımdır.",
            benefits: ["Bedensel 'savaş-kaç' alarmını regüle etme", "Nefes ve somatik gevşeme protokolleri", "Kaygı yaratan felaket senaryolarını rasyonalize etme"],
            duration: "50 Dakika",
            format: "Yüz Yüze veya Çevrimiçi (Online)",
          },
        };
      } else if (total <= 29) {
        return {
          title: "Orta Düzey Anksiyete ve Panik Hassasiyeti",
          scoreText: `Toplam Skor: ${total} / 63 • Orta Şiddet`,
          badge: "Klinik Destek Önerilir",
          evaluation: "Sinir sisteminiz yanlış alarmlar üretmeye başlamış. Güvende olduğunuz anlarda bile bedeniniz nefes darlığı, çarpıntı ve kontrolü kaybetme korkusuyla alarm veriyor. Bu durum yaşam alanınızı daraltmaktadır.",
          advice: "Bilişsel Davranışçı Terapi ve Somatik Regülasyon seansları panik döngüsünü kırmada %90'ın üzerinde klinik başarı oranına sahiptir. Bir uzman desteği ile bedeninize güvenmeyi yeniden öğrenebilirsiniz.",
          recommendedTherapy: {
            id: "bdt",
            name: "Bilişsel Davranışçı Terapi (BDT) & Panik Protokolü",
            matchReason: "Panik belirtilerini besleyen felaketleştirici bilişsel inançları çürütmek ve kaygı kaçınmalarını sonlandırmak için altın standart yöntemdir.",
            benefits: ["Panik atak anında bedeni 2 dakikada sakinleştirme", "Agorafobi ve kaçınma davranışlarını yenme", "Kalıcı sinir sistemi regülasyonu"],
            duration: "50 Dakika",
            format: "Yüz Yüze (Klinik) veya Çevrimiçi (Online)",
          },
        };
      } else {
        return {
          title: "Şiddetli Anksiyete ve Panik Bozukluk Tablosu",
          scoreText: `Toplam Skor: ${total} / 63 • Yüksek Şiddet`,
          badge: "Öncelikli Klinik Süreç",
          evaluation: "Sinir sisteminizin 'tehlike alarmı' sürekli açık kalmış durumdadır. Bedensel çarpıntı, boğulma hissi ve ölüm/delirme korkuları günlük hayatınızı, sokağa çıkmanızı veya uyumanızı ciddi biçimde felç etmektedir.",
          advice: "Lütfen yalnız olmadığınızı ve bu durumun tamamen çözülebilir fizyolojik bir alarm hatası olduğunu unutmayın. Vakit kaybetmeden bir klinik psikolog veya psikiyatrist ile iletişime geçmelisiniz.",
          recommendedTherapy: {
            id: "emdr",
            name: "EMDR & Bütüncül Travma/Kaygı Terapisi",
            matchReason: "Yoğun panik atak ve kontrol kaybı dehşetinin kökeninde yatan tetikleyicileri duyarsızlaştırmak ve sinir sistemini yeniden sıfırlamak için en güçlü yöntemdir.",
            benefits: ["Korku merkezini (Amigdala) sakinleştirme", "Beden hafızasındaki panik izlerini silme", "Korkusuzca özgür ve güvende bir yaşama dönüş"],
            duration: "60 Dakika",
            format: "Öncelikli Yüz Yüze Klinik Seansı",
          },
        };
      }
    },
  },

  // ==========================================
  // 3. BÜYÜK BEŞLİ (BIG FIVE - OCEAN) KİŞİLİK ENVANTERİ (20 SORU)
  // ==========================================
  {
    id: "buyuk-besli-kisilik",
    icon: <Users size={32} />,
    title: "Büyük Beşli (Big Five / OCEAN) Kişilik Envanteri",
    category: "Kişilik & Benlik",
    duration: "6 Dakika",
    questionCount: 20,
    badge: "20 Soru • Kişilik Mimarisi",
    desc: "Modern psikolojinin en saygın kişilik modeli: Dışadönüklük, Uyumluluk, Sorumluluk, Nörotisizm (Duygusal Hassasiyet) ve Deneyime Açıklık boyutlarınızı 20 derin soruyla analiz eder.",
    questions: [
      {
        question: "1. Kalabalık bir partiye veya yeni bir sosyal çevreye girdiğinizde enerjiniz ne yönde değişir?",
        options: [
          { text: "Yeni insanlarla konuştukça coşar, enerji dolar ve parlarım.", personalityKey: "E", score: 2 },
          { text: "Duruma göre değişir, bir süre sonra yalnız kalmak isterim.", personalityKey: "D", score: 1 },
          { text: "Kalabalıklar enerjimi hızla tüketir; sessizliği ve az sayıda insanı yeğlerim.", personalityKey: "I", score: 0 },
        ],
      },
      {
        question: "2. Bir projeye başlarken planlama ve zaman yönetimi tarzınız:",
        options: [
          { text: "Her adımı önceden planlar, listeler yapar ve disiplinle bitiririm.", personalityKey: "C", score: 2 },
          { text: "Ana hatları belirler, duruma göre esnerim.", personalityKey: "D", score: 1 },
          { text: "Spontane ve son ana bırakarak çalışırım, kurallar beni boğar.", personalityKey: "P", score: 0 },
        ],
      },
      {
        question: "3. Soyut felsefe, sanat, sıra dışı teoriler ve derin tartışmalar:",
        options: [
          { text: "Beni büyüler; bilinmeyeni ve derin fikirleri keşfetmeye bayılırım.", personalityKey: "O", score: 2 },
          { text: "İlgimi çeker ama pratikte faydasına da bakarım.", personalityKey: "D", score: 1 },
          { text: "Soyut şeylerden ziyade kanıtlanmış, somut ve pratik şeyleri tercih ederim.", personalityKey: "T", score: 0 },
        ],
      },
      {
        question: "4. Biriyle fikir ayrılığına düştüğünüzde temel yaklaşımınız:",
        options: [
          { text: "Karşımdakini kırmamak için empati kurar, ortak yol bulmaya çalışırım.", personalityKey: "A", score: 2 },
          { text: "Kendi fikrimi savunurken nezaketimi korurum.", personalityKey: "D", score: 1 },
          { text: "Haklılığımı sonuna kadar kanıtlarım, taviz vermem ve sorgularım.", personalityKey: "R", score: 0 },
        ],
      },
      {
        question: "5. Hayatta beklenmedik bir kriz çıktığında duygusal dayanıklılığınız:",
        options: [
          { text: "Paniğe kapılmam; sakin, soğukkanlı ve dengeli kalırım.", personalityKey: "S", score: 2 },
          { text: "İlk an biraz sarsılsam da hızla toparlanırım.", personalityKey: "D", score: 1 },
          { text: "Hemen yoğun kaygı, suçluluk hisseder ve en kötü senaryoya odaklanırım.", personalityKey: "N", score: 0 },
        ],
      },
      {
        question: "6. Sosyal ortamlarda sohbeti başlatan ve ortamın havasını değiştiren kişi genellikle siz misiniz?",
        options: [
          { text: "Evet, insanlarla ilk teması kurmaktan ve liderlik etmekten keyif alırım.", personalityKey: "E", score: 2 },
          { text: "Bazen ortamına göre değişir.", personalityKey: "D", score: 1 },
          { text: "Hayır, biri bana konuşmadıkça köşemde sessizce izlemeyi tercih ederim.", personalityKey: "I", score: 0 },
        ],
      },
      {
        question: "7. Odanızın, çalışma masanızın ve hayatınızın genel düzeni nasıldır?",
        options: [
          { text: "Çok düzenlidir; her şeyin yeri bellidir ve dağınıklığa tahammül edemem.", personalityKey: "C", score: 2 },
          { text: "Kendi içinde düzenli bir dağınıklığım vardır.", personalityKey: "D", score: 1 },
          { text: "Kaotik ve dağınıktır; düzen kurmak beni sıkar.", personalityKey: "P", score: 0 },
        ],
      },
      {
        question: "8. Alışılmışın dışındaki radikal fikirlere ve farklı yaşam tarzlarına bakışınız:",
        options: [
          { text: "Büyük bir merak ve hoşgörüyle yaklaşırım, çeşitlilik dünyayı zenginleştirir.", personalityKey: "O", score: 2 },
          { text: "Saygı duyarım ama herkesin kendi yolu vardır.", personalityKey: "D", score: 1 },
          { text: "Geleneksel ve alışılagelmiş değerlerin korunmasını daha güvenli bulurum.", personalityKey: "T", score: 0 },
        ],
      },
      {
        question: "9. Bir insan zor durumda kaldığında ona yardım etmek için kendi zamanınızdan feda eder misiniz?",
        options: [
          { text: "Hiç düşünmeden yardıma koşarım, başkalarının acısına kayıtsız kalamam.", personalityKey: "A", score: 2 },
          { text: "Durumum elveriyorsa yardımcı olurum.", personalityKey: "D", score: 1 },
          { text: "Herkes kendi sorumluluğunu almalıdır, aşırı fedakarlık yapmam.", personalityKey: "R", score: 0 },
        ],
      },
      {
        question: "10. Gün içinde ruh halinizde ani iniş-çıkışlar ve sebepsiz keder dalgaları yaşar mısınız?",
        options: [
          { text: "Hayır, duygusal durumum oldukça istikrarlı ve dingindir.", personalityKey: "S", score: 2 },
          { text: "Bazen stresli günlerde iniş çıkışlar olur.", personalityKey: "D", score: 1 },
          { text: "Evet, küçük bir şey bile beni bir anda neşeden derin kaygıya sürükleyebilir.", personalityKey: "N", score: 0 },
        ],
      },
      {
        question: "11. Grup içinde ilgi odağı olmak sizi nasıl hissettirir?",
        options: [
          { text: "Çok hoşuma gider, sahnede ve göz önünde olmaktan beslenirim.", personalityKey: "E", score: 2 },
          { text: "Fark etmez, ne çok ararım ne de çok kaçarım.", personalityKey: "D", score: 1 },
          { text: "Aşırı rahatsız eder, görünmez olmayı tercih ederim.", personalityKey: "I", score: 0 },
        ],
      },
      {
        question: "12. Verdiğiniz sözleri, randevuları ve görevleri yerine getirme hassasiyetiniz:",
        options: [
          { text: "Kutsaldır; ne olursa olsun sözümde durur ve dakik davranırım.", personalityKey: "C", score: 2 },
          { text: "Genellikle tutarım, bazen aksamalar olabilir.", personalityKey: "D", score: 1 },
          { text: "Zaman kavramım esnektir, sık sık gecikebilir veya erteleyebilirim.", personalityKey: "P", score: 0 },
        ],
      },
      {
        question: "13. Sanat sergileri, şiir, müzik ve estetik deneyimler üzerinizde nasıl bir etki bırakır?",
        options: [
          { text: "Tüylerimi diken diken edecek kadar derin bir duygu ve ilham fırtınası yaratır.", personalityKey: "O", score: 2 },
          { text: "Güzel bulurum ama hayatımın merkezinde değildir.", personalityKey: "D", score: 1 },
          { text: "Sanat bana pek hitap etmez, pratik dünyayla ilgilenirim.", personalityKey: "T", score: 0 },
        ],
      },
      {
        question: "14. İnsanların iyi niyetli olduğuna dair temel inancınız:",
        options: [
          { text: "İnsanların özünde iyi olduğuna inanır ve kolayca güvenirim.", personalityKey: "A", score: 2 },
          { text: "Güvenmeden önce biraz temkinli yaklaşırım.", personalityKey: "D", score: 1 },
          { text: "İnsanların bencil olduğuna inanır, her zaman şüpheci ve tetikte kalırım.", personalityKey: "R", score: 0 },
        ],
      },
      {
        question: "15. Geçmişte yaptığınız bir hata aklınıza geldiğinde:",
        options: [
          { text: "Hatamdan ders çıkarıp hayatıma kaldığım yerden devam ederim.", personalityKey: "S", score: 2 },
          { text: "Biraz canım sıkılır ama geçer.", personalityKey: "D", score: 1 },
          { text: "Günlerce kendimi yer bitirir, utanç ve suçluluk içinde kıvranırım.", personalityKey: "N", score: 0 },
        ],
      },
      {
        question: "16. Yalnız başınıza bir hafta sonu geçirmek sizin için ne ifade eder?",
        options: [
          { text: "Çok sıkıcı ve boğucu; hemen dışarı çıkıp birileriyle buluşmalıyım.", personalityKey: "E", score: 2 },
          { text: "Dengeli bir mola olabilir.", personalityKey: "D", score: 1 },
          { text: "Dünyanın en büyük huzuru ve yenilenme kaynağıdır.", personalityKey: "I", score: 0 },
        ],
      },
      {
        question: "17. Hedeflerinize ulaşmak için gösterdiğiniz irade ve azim dereceniz:",
        options: [
          { text: "Kaya gibi sağlamdır; karşıma çıkan engeller beni durduramaz.", personalityKey: "C", score: 2 },
          { text: "Önemli konularda azimliyimdir.", personalityKey: "D", score: 1 },
          { text: "Çabuk heveslenip zorluğu görünce çabuk pes edebilirim.", personalityKey: "P", score: 0 },
        ],
      },
      {
        question: "18. Yepyeni bir şehre gidip kaybolmak ve bilinmeyen sokakları keşfetmek:",
        options: [
          { text: "Bana inanılmaz bir macera ve heyecan verir.", personalityKey: "O", score: 2 },
          { text: "Güzeldir ama yanımda bir harita olmasını isterim.", personalityKey: "D", score: 1 },
          { text: "Beni aşırı kaygılandırır, bildiğim ve güvenli yerleri tercih ederim.", personalityKey: "T", score: 0 },
        ],
      },
      {
        question: "19. Çatışma anında karşınızdakinin kalbini kırmaktansa haklılığınızdan vazgeçer misiniz?",
        options: [
          { text: "Evet, insan ilişkisi ve sevgi her türlü haklılıktan daha kıymetlidir.", personalityKey: "A", score: 2 },
          { text: "Duruma göre değişir.", personalityKey: "D", score: 1 },
          { text: "Asla; gerçek neyse o söylenmelidir, kimsenin duygusu gerçeğin önüne geçemez.", personalityKey: "R", score: 0 },
        ],
      },
      {
        question: "20. Genel olarak kendinizi stresli ve endişeli bir insan olarak mı tanımlarsınız?",
        options: [
          { text: "Hayır; sakin, dingin ve rahat bir karaktere sahibim.", personalityKey: "S", score: 2 },
          { text: "Ortalama bir düzeydeyim.", personalityKey: "D", score: 1 },
          { text: "Evet; hayatımın büyük bir kısmı içsel kaygılar ve stresle mücadeleyle geçiyor.", personalityKey: "N", score: 0 },
        ],
      },
    ],
    getResult: (answers) => {
      const keys = answers.map((a) => a.personalityKey);
      const openCount = keys.filter((k) => k === "O").length;
      const conscCount = keys.filter((k) => k === "C").length;
      const extraCount = keys.filter((k) => k === "E").length;
      const agreeCount = keys.filter((k) => k === "A").length;
      const neuroCount = keys.filter((k) => k === "N").length;

      if (openCount >= 3 && conscCount >= 3) {
        return {
          title: "Stratejik Vizyoner (Yaratıcı & Disiplinli Mizaç)",
          scoreText: "Yüksek Açıklık & Yüksek Sorumluluk",
          badge: "Üretken Zihin",
          evaluation: "Hem derin soyut fikirler üretebilen hem de bu fikirleri titiz bir özdisiplinle somut projelere dönüştürebilen güçlü bir kişilik dengesine sahipsiniz. Merakınız dağınıklığa değil, organize üretime hizmet ediyor.",
          advice: "Mükemmeliyetçilik tuzağına karşı dikkatli olun; kendinize dinlenme ve plansız anlar bırakmayı ihmal etmeyin.",
          recommendedTherapy: {
            id: "bireysel",
            name: "Bireysel Psikoterapi & Koçluk Dengesi",
            matchReason: "Yüksek potansiyeli korurken mükemmeliyetçi tükenmişliği önlemek için uygundur.",
            benefits: ["İçsel yaratıcılığı sürdürülebilir kılma", "Yaşam dengesi inşası", "Kusursuzluk baskısını hafifletme"],
            duration: "50 Dakika",
            format: "Yüz Yüze veya Çevrimiçi (Online)",
          },
        };
      } else if (neuroCount >= 3) {
        return {
          title: "Derin Duygusal Sezgi & Hassas Sinir Sistemi",
          scoreText: "Yüksek Duygusal Hassasiyet (Nörotisizm)",
          badge: "Hassas Zihin",
          evaluation: "Dünyayı ve insan ilişkilerini diğer insanlardan çok daha yoğun, derin ve hassas hissediyorsunuz. Bu durum muazzam bir sezgi ve empati kapasitesi sunsa da kaygı, alınganlık ve stres yükünüzü artırmaktadır.",
          advice: "Sinir sisteminizi topraklayacak somatik nefes pratikleri ve zihinsel geviş getirmeyi durduran Bilişsel Davranışçı Terapi desteği içsel dinginliğinizi yeniden kuracaktır.",
          recommendedTherapy: {
            id: "bdt",
            name: "Bilişsel Davranışçı Terapi & Somatik Denge",
            matchReason: "Aşırı aktif duygusal hassasiyeti ve olumsuz zihinsel senaryoları sakinleştirmek için en etkili yaklaşımdır.",
            benefits: ["Duygusal dalgalanmaları regüle etme", "Kaygıyı yatıştıran somatik topraklanma", "Aşırı düşünme (overthinking) döngüsünü kırma"],
            duration: "50 Dakika",
            format: "Yüz Yüze veya Çevrimiçi (Online)",
          },
        };
      } else if (agreeCount >= 3) {
        return {
          title: "Empatik Diplomat (Şefkatli & Barışçıl Karakter)",
          scoreText: "Yüksek Uyumluluk & Sosyal Sıcaklık",
          badge: "Şefkatli Kalp",
          evaluation: "İnsan ilişkilerinde güven veren, çatışmaları yatıştıran ve herkesin iyi hissetmesini önemseyen sevgi dolu bir auranız var. Ancak başkalarını memnun etmek uğruna kendi sınırlarınızı feda etme riskiniz yüksektir.",
          advice: "'Hayır' demeyi öğrenmek ve kendi sınırlarınızı korumak sevginizi eksiltmez, ilişkilerinizi daha sahici ve sağlıklı kılar.",
          recommendedTherapy: {
            id: "sema",
            name: "Şema Terapisi & Sınır İnşası",
            matchReason: "Aşırı fedakarlık ve başkalarını memnun etme kalıplarını dönüştürüp sağlıklı sınırlar çekmek için idealdir.",
            benefits: ["Suçluluk duymadan sınır koyabilme", "Kendi ihtiyaçlarını önceliklendirme", "Daha dengeli ve eşit ilişkiler kurma"],
            duration: "50 Dakika",
            format: "Yüz Yüze veya Çevrimiçi (Online)",
          },
        };
      } else {
        return {
          title: "Dengeli ve Esnek Kişilik Mimarisi",
          scoreText: "Uyumlu & Çok Yönlü Profil",
          badge: "Dengeli Kişilik",
          evaluation: "Kişilik boyutlarında aşırılıklara kaçmayan, ortama ve şartlara göre sağlıklı uyum sağlayabilen esnek bir zihinsel altyapıya sahipsiniz.",
          advice: "Bu esnekliğinizi kendinizi daha derin keşfetmek istediğiniz felsefi veya sanatsal ilgi alanlarına yönlendirebilirsiniz.",
          recommendedTherapy: {
            id: "bireysel",
            name: "Bireysel Psikoterapi & Öz-Keşif",
            matchReason: "İçsel potansiyeli keşfetmek ve anlam arayışını derinleştirmek için önerilir.",
            benefits: ["Derin öz-farkındalık", "Anlamlı yaşam hedefleri belirleme", "Duygusal zekayı parlatma"],
            duration: "50 Dakika",
            format: "Yüz Yüze veya Çevrimiçi (Online)",
          },
        };
      }
    },
  },

  // ==========================================
  // 4. İLİŞKİLERDE BAĞLANMA STİLLERİ (20 SORU)
  // ==========================================
  {
    id: "baglanma-stili-testi",
    icon: <Heart size={32} />,
    title: "İlişkilerde Bağlanma Stili Testi (ECR)",
    category: "İlişkiler & Bağlanma",
    duration: "6 Dakika",
    questionCount: 20,
    badge: "20 Soru • Bowlby Kuramı",
    desc: "Romantik ve yakın ilişkilerinizde terk edilme kaygısı, duygusal mesafe, yakınlık kurma ve güven kalıplarınızı 20 derin ilişki senaryosuyla çözen kapsamlı bağlanma envanteri.",
    questions: [
      {
        question: "1. Partnerim mesajıma saatlerce dönmediğinde ilk hissettiğim duygu:",
        options: [
          { text: "Muhtemelen işi vardır, müsait olunca döner diye düşünür sakin kalırım.", personalityKey: "G" },
          { text: "Benden soğudu mu, yanlış bir şey mi yaptım endişesiyle içim içimi yer.", personalityKey: "K" },
          { text: "Umursamam; hatta yazsa bile hemen cevap vermeyip mesafemi korurum.", personalityKey: "A" },
          { text: "Hem yoğun bir öfke hem de terk edilme paniğiyle mesaj yağmuruna tutarım.", personalityKey: "D" },
        ],
      },
      {
        question: "2. Partnerime duygusal olarak savunmasız olmak ve sırlarımı açmak:",
        options: [
          { text: "Doğal ve güven vericidir; sevgi şeffaflıkla büyür.", personalityKey: "G" },
          { text: "Hemen her şeyimi açarım ama sonra 'acaba fazla mı geldim' diye korkarım.", personalityKey: "K" },
          { text: "Beni zayıf ve kontrolsüz hissettirir; duygularımı kendime saklarım.", personalityKey: "A" },
          { text: "Açılmak için can atarım ama açıldığım anda pişman olup kaçmak isterim.", personalityKey: "D" },
        ],
      },
      {
        question: "3. İlişkide bir tartışma veya gerilim çıktığında ilk refleksim:",
        options: [
          { text: "Konuşarak, dinleyerek ve duygularımızı paylaşarak çözmeye odaklanırım.", personalityKey: "G" },
          { text: "Hemen o saniye sarılmak ve barışmak isterim; aksi halde uyuyamam.", personalityKey: "K" },
          { text: "Ortamdan uzaklaşır, odayı terk eder ve sessizlik duvarı örerim.", personalityKey: "A" },
          { text: "Aşırı öfkelenip bağırır, hemen ardından beni terk etmesin diye yalvarırım.", personalityKey: "D" },
        ],
      },
      {
        question: "4. Partnerimin bensiz arkadaşlarıyla tatile veya eğlenceye gitmesi:",
        options: [
          { text: "Onun adına sevinirim; herkesin kendi alanının olması çok sağlıklıdır.", personalityKey: "G" },
          { text: "Onaylasam bile içten içe dışlanmış, önemsiz ve sevilmiyor hissederim.", personalityKey: "K" },
          { text: "Çok rahatlarım, ben de kendi başıma kalmanın tadını çıkarırım.", personalityKey: "A" },
          { text: "Beni aldatacağından ya da unutacağından şüphelenir, kriz çıkartırım.", personalityKey: "D" },
        ],
      },
      {
        question: "5. İlişkide en derin içsel korkum hangisidir?",
        options: [
          { text: "Özel bir korkum yok; ilişki biterse üzülürüm ama hayatıma devam ederim.", personalityKey: "G" },
          { text: "Yeterince sevilmemek, yetersiz kalmak ve günün birinde terk edilmek.", personalityKey: "K" },
          { text: "Özgürlüğümü kaybetmek, birinin kontrolüne girmek ve boğulmak.", personalityKey: "A" },
          { text: "Hem sevilmemekten hem de sevilince canımın çok yanmasından korkarım.", personalityKey: "D" },
        ],
      },
      {
        question: "6. Birisi bana aşırı yakınlaştığında ve beni çok sevdiğini söylediğinde:",
        options: [
          { text: "Mutlu olur ve sevgisine sıcak bir kucak açarım.", personalityKey: "G" },
          { text: "Çok sevinirim ama 'gerçekten beni mi seviyor' diye sürekli test ederim.", personalityKey: "K" },
          { text: "İçimde bir kaçma dürtüsü uyanır, bir anda o kişiden soğuyabilirim.", personalityKey: "A" },
          { text: "Korkudan ne yapacağımı bilemez, garip dengesiz tepkiler veririm.", personalityKey: "D" },
        ],
      },
      {
        question: "7. Partnerimden sevgi, şefkat ve onay talep etme biçimim:",
        options: [
          { text: "İhtiyacımı dürüstçe ve açık bir dille dile getirebilirim.", personalityKey: "G" },
          { text: "Sürekli 'Beni seviyor musun?' diye sorma ve teyit alma ihtiyacım vardır.", personalityKey: "K" },
          { text: "Asla sevgi istemem, kimseye muhtaç görünmekten nefret ederim.", personalityKey: "A" },
          { text: "Önce küsüp trip atar, anlamasını bekler, sonra patlarım.", personalityKey: "D" },
        ],
      },
      {
        question: "8. Geçmiş ilişkilerinizde partner seçimlerinizde genel örüntünüz:",
        options: [
          { text: "Dengeli, güven veren ve açık iletişim kurabilen insanlarla oldum.", personalityKey: "G" },
          { text: "Hep beni duygusal olarak aç bırakan, mesafeli ve kaçan insanlara çekildim.", personalityKey: "K" },
          { text: "Benden çok fazla ilgi ve yakınlık isteyen insanlardan hızla kaçtım.", personalityKey: "A" },
          { text: "Fırtınalı, tutkulu ama yıpratıcı 'ayrıl-barış' döngüleri yaşadım.", personalityKey: "D" },
        ],
      },
      {
        question: "9. İlişkide sınırlar ve bağımsızlık dengeniz nasıldır?",
        options: [
          { text: "Hem biz olmayı hem de ben kalmayı başarabiliyorum.", personalityKey: "G" },
          { text: "İlişkiye girince kendimi tamamen partnerimin hayatına adar, kendimi unuturum.", personalityKey: "K" },
          { text: "Kendi alanımı korumak için partnerimle arama hep görünmez sınırlar çekerim.", personalityKey: "A" },
          { text: "Bir an aşırı yapışık, bir an aşırı kopuk davranırım.", personalityKey: "D" },
        ],
      },
      {
        question: "10. Partneriniz biraz dalgın ya da yorgun olduğunda ilk düşünceniz:",
        options: [
          { text: "Zor bir gün geçirmiş olmalı, ona nasıl destek olabilirim?", personalityKey: "G" },
          { text: "Kesin bana kızgın, kesin ben bir hata yaptım.", personalityKey: "K" },
          { text: "Beni ilgilendirmez, kendi havasına bırakayım.", personalityKey: "A" },
          { text: "Benden uzaklaşıyor diye içten içe öfkelenirim.", personalityKey: "D" },
        ],
      },
      {
        question: "11. 'İlişkilerde insanlar eninde sonunda sizi hayal kırıklığına uğratır' inancı:",
        options: [
          { text: "Katılmıyorum; hayal kırıklıkları olsa da güvenebileceğim insanlar vardır.", personalityKey: "G" },
          { text: "Korktuğum şey bu; bu yüzden sürekli tetikteyim.", personalityKey: "K" },
          { text: "Kesinlikle katılıyorum; bu yüzden kimseye sırtımı tam dayamam.", personalityKey: "A" },
          { text: "Evet, insanlar hem canımı yakar hem de onlarsız yapamam.", personalityKey: "D" },
        ],
      },
      {
        question: "12. Kendi duygusal ihtiyaçlarınızı ifade ederken ne hissedersiniz?",
        options: [
          { text: "İhtiyaçlarımı söylemek çok doğaldır, çekinmem.", personalityKey: "G" },
          { text: "Söylerken 'bencilce mi davranıyorum' diye suçluluk hissederim.", personalityKey: "K" },
          { text: "İhtiyacım olduğunu kabul etmek bile beni aşağılanmış hissettirir.", personalityKey: "A" },
          { text: "İfade edemem, anlaşılmayınca öfke patlaması yaşarım.", personalityKey: "D" },
        ],
      },
      {
        question: "13. Ayrılık veya ilişki bitişi süreçlerinde tepkiniz:",
        options: [
          { text: "Yasını tutarım, acımı yaşar ve zamanla iyileşip hayatıma devam ederim.", personalityKey: "G" },
          { text: "Dünyam başıma yıkılır, yemeden içmeden kesilir, geri dönmesi için çırpınırım.", personalityKey: "K" },
          { text: "Hemen duygularımı kapatır, hiç yaşanmamış gibi işime gücüme bakarım.", personalityKey: "A" },
          { text: "Bir yandan geri dönmesi için yalvarırken diğer yandan ondan nefret ederim.", personalityKey: "D" },
        ],
      },
      {
        question: "14. Partnerinizle fiziksel temas (sarılma, el ele tutuşma):",
        options: [
          { text: "Çok doğal, huzur verici ve sevgi doludur.", personalityKey: "G" },
          { text: "Sürekli temas halinde olmak isterim, temas kesilince endişelenirim.", personalityKey: "K" },
          { text: "Aşırı temastan çabuk sıkılırım, fiziksel alanımı korumak isterim.", personalityKey: "A" },
          { text: "Bazen çok isterim, bazen dokunulmasından bile rahatsız olurum.", personalityKey: "D" },
        ],
      },
      {
        question: "15. Kıskançlık duygunuz ilişkilerde nasıl kendini gösterir?",
        options: [
          { text: "Güven duygum tamdır, gereksiz kıskançlık krizlerine girmem.", personalityKey: "G" },
          { text: "Çok kıskancım; sosyal medyasını takip eder, sürekli şüphelenirim.", personalityKey: "K" },
          { text: "Kıskansam bile asla belli etmem, umursamaz görünürüm.", personalityKey: "A" },
          { text: "Kıskançlık bende devasa kavgalara ve yıkıcı krizlere dönüşür.", personalityKey: "D" },
        ],
      },
      {
        question: "16. Kendi başınıza yalnız bir akşam geçirmek:",
        options: [
          { text: "Çok keyiflidir, kendimle vakit geçirmeyi severim.", personalityKey: "G" },
          { text: "Partnerim yanımda yoksa yalnızlık içimi acıtır, eksik hissederim.", personalityKey: "K" },
          { text: "En sevdiğim zamandır, kimseye hesap vermeden nefes alırım.", personalityKey: "A" },
          { text: "Yalnız kalmak beni ürkütür ama insanlarla olmak da yorar.", personalityKey: "D" },
        ],
      },
      {
        question: "17. 'Ben sevilmeye ve değer görmeye layık biriyim' cümlesine inancınız:",
        options: [
          { text: "Tamamen inanıyorum; öz-değerim başkalarının onayına bağlı değildir.", personalityKey: "G" },
          { text: "Yalnızca birisi beni çok sevdiğinde değerli olduğumu hissederim.", personalityKey: "K" },
          { text: "Değerimi ilişkilerle değil, kendi başarılarımla ve bağımsızlığımla ölçerim.", personalityKey: "A" },
          { text: "Derinlerde bir yerde sevilmeye layık olmadığımı hissederim.", personalityKey: "D" },
        ],
      },
      {
        question: "18. Partnerinizle geleceğe dair evlilik, ortak yaşam gibi planlar konuşmak:",
        options: [
          { text: "Günü geldiğinde heyecanla ve güvenle konuşuruz.", personalityKey: "G" },
          { text: "İlişkinin başında bile hemen netlik ve güvence isterim.", personalityKey: "K" },
          { text: "Beni fena halde ürkütür, hemen konuyu değiştirmek isterim.", personalityKey: "A" },
          { text: "Hem hayalini kurarım hem de o adım yaklaştıkça sabote ederim.", personalityKey: "D" },
        ],
      },
      {
        question: "19. Bir ilişkide kendinizi en çok ne zaman 'güvende' hissedersiniz?",
        options: [
          { text: "Birbirimizi olduğumuz gibi kabul ettiğimiz ve dürüst olduğumuzda.", personalityKey: "G" },
          { text: "Partnerim her an bana ilgisini ve sevgisini gösterdiğinde.", personalityKey: "K" },
          { text: "Bana karışmadığında ve kendi bağımsız alanıma saygı duyduğunda.", personalityKey: "A" },
          { text: "İlişkide tam olarak hiçbir zaman güvende hissedemem.", personalityKey: "D" },
        ],
      },
      {
        question: "20. Çocuklukta ebeveynlerinizle olan duygusal bağınızı nasıl tanımlarsınız?",
        options: [
          { text: "Genel olarak sevecen, tutarlı ve güven veren bir bağ vardı.", personalityKey: "G" },
          { text: "Sevgilerini kazanmak için hep uslu ve başarılı olmak zorundaydım.", personalityKey: "K" },
          { text: "Duygularım pek önemsenmezdi, erken yaşta kendi kendime yetmeyi öğrendim.", personalityKey: "A" },
          { text: "Tutarsızdı; bazen çok sıcak, bazen öfkeli ve korkutucuydu.", personalityKey: "D" },
        ],
      },
    ],
    getResult: (answers) => {
      const keys = answers.map((a) => a.personalityKey);
      const gCount = keys.filter((k) => k === "G").length;
      const kCount = keys.filter((k) => k === "K").length;
      const aCount = keys.filter((k) => k === "A").length;
      const dCount = keys.filter((k) => k === "D").length;

      if (gCount >= 10) {
        return {
          title: "Güvenli Bağlanma (Secure Attachment)",
          scoreText: "Yüksek Güven & Sağlıklı Duygusal Yakınlık",
          badge: "Güvenli Liman",
          evaluation: "İlişkilerinizde yakınlık kurmaktan da bağımsızlığınızı korumaktan da korkmuyorsunuz. Kendi öz-değerinizi partnerinizin anlık tepkilerinden ayrı tutabiliyor, çatışmaları yapıcı bir dille çözebiliyorsunuz.",
          advice: "Bu harika duygusal güvenliğinizi korumaya devam edin; kaygılı ya da kaçıngan partnerlerle karşılaştığınızda da sınırlarınızı şeffaf tutun.",
          recommendedTherapy: {
            id: "cift",
            name: "Çift & İlişki Terapisi (Gottman Modeli)",
            matchReason: "Mevcut sağlıklı ilişki iletişimini daha da derinleştirmek ve ortak yaşam hedeflerini güçlendirmek için uygundur.",
            benefits: ["İletişim kalitesini zirveye taşıma", "Duygusal yakınlık haritasını zenginleştirme", "Ortak anlam ve vizyon inşası"],
            duration: "75 Dakika",
            format: "Çift Olarak Yüz Yüze veya Online",
          },
        };
      } else if (kCount >= aCount && kCount >= dCount) {
        return {
          title: "Kaygılı / Saplantılı Bağlanma (Anxious Attachment)",
          scoreText: "Terk Edilme Hassasiyeti & Sürekli Onay Arayışı",
          badge: "Kaygılı Stil",
          evaluation: "İlişkilerdeki en büyük tetikleyiciniz belirsizlik ve mesafedir. Partnerinizin ilgisindeki en küçük azalma, çocukluktan kalma 'sevilmiyorum, terk edileceğim' yarasını kanatmakta ve panikle güvence aramanıza yol açmaktadır.",
          advice: "Kendi öz-şefkatinizi güçlendirin. Partnerinizin sessizliğinin sizin değerinizle ilgili olmadığını fark etmeyi ve kendi duygusal regülasyonunuzu sağlamayı öğrenmek ilişkilerinizi kurtaracaktır.",
          recommendedTherapy: {
            id: "cift",
            name: "Duygu Odaklı Çift & Bağlanma Terapisi (EFT)",
            matchReason: "Terk edilme kaygısını onarmak ve partnerle güvenli bağlanma köprüsü kurmak için dünyada en çok uygulanan modeldir.",
            benefits: ["Terk edilme panik döngüsünü durdurma", "Öz-değeri partnerin onayından bağımsız kılma", "Gereksiz kıskançlık ve kontrol krizlerini sonlandırma"],
            duration: "50 Dakika",
            format: "Bireysel veya Çift Olarak Seans",
          },
        };
      } else if (aCount >= dCount) {
        return {
          title: "Kaçıngan Bağlanma (Dismissive-Avoidant)",
          scoreText: "Aşırı Bağımsızlık & Duygusal Mesafe Zırhı",
          badge: "Kaçıngan Zırh",
          evaluation: "Duygusal olarak kırılmamak ve incinmemek için yakınlaşmaktan kaçınıyor, bağımsızlığı bir hayatta kalma kalkanı olarak kullanıyorsunuz. Birisi size çok yaklaştığında 'boğulma' hissi yaşayabilirsiniz.",
          advice: "Duygusal yakınlık bir zayıflık ya da teslimiyet değildir. Güvenli adımlarla kalbinizi açmak ilişkilerinizde gerçek doyuma ulaşmanızı sağlayacaktır.",
          recommendedTherapy: {
            id: "bireysel",
            name: "Bireysel Psikodinamik Terapi & Bağlanma Onarımı",
            matchReason: "Duygusal mesafe koyma savunmasını çözmek ve güvenli yakınlaşma kapasitesini geliştirmek için idealdir.",
            benefits: ["Savunmasız kalabilme cesareti geliştirme", "Boğulma korkusunu aşma", "Derin ve samimi sevgi bağları kurabilme"],
            duration: "50 Dakika",
            format: "Yüz Yüze veya Çevrimiçi (Online)",
          },
        };
      } else {
        return {
          title: "Korkulu-Kararsız Bağlanma (Disorganized / Fearful)",
          scoreText: "İkili Çatışma: Hem Yakınlık Arayışı Hem Kaçış Dehşeti",
          badge: "Kararsız Fırtına",
          evaluation: "İç dünyanızda büyük bir paradoks yaşamaktasınız: Derin bir sevilme arzusu, ancak tam o anda incitilme ve ihanete uğrama korkusu. Bu durum ilişkilerde fırtınalı 'yaklaş-kaç' gelgitlerine sebep olur.",
          advice: "Bu bağlanma örüntüsü genellikle çocukluktaki tutarsız veya korkutucu bağlanma figürlerinden miras kalır. Travma odaklı terapi ve şema terapisi güven duygunuzu kökten iyileştirecektir.",
          recommendedTherapy: {
            id: "emdr",
            name: "EMDR & Şema Terapisi (Bağlanma Travması)",
            matchReason: "Çocukluk dönemi güvensiz bağlanma anılarını duyarsızlaştırmak ve yetişkin ilişkilerinde istikrar kazanmak için en derinlikli yöntemdir.",
            benefits: ["İlişkilerdeki fırtınalı gelgitleri durdurma", "Kök travmaları ve güvensizlik hissini temizleme", "Huzurlu ve kalıcı ilişki dengesine kavuşma"],
            duration: "60 Dakika",
            format: "Öncelikli Yüz Yüze veya Güvenli Online",
          },
        };
      }
    },
  },

  // ==========================================
  // 5. MASLACH TÜKENMİŞLİK (BURNOUT) İNDEKSİ (20 SORU)
  // ==========================================
  {
    id: "tukenmislik-indeksi",
    icon: <Activity size={32} />,
    title: "Maslach Tükenmişlik (Burnout) İndeksi",
    category: "Stres & Yaşam Dengesi",
    duration: "6 Dakika",
    questionCount: 20,
    badge: "20 Soru • Yaşam Enerjisi",
    desc: "Christina Maslach'ın üç boyutlu tükenmişlik modeli: Duygusal tükenme, duyarsızlaşma (sinizm) ve kişisel başarı hissindeki aşınmayı 20 kapsamlı soruyla değerlendirir.",
    questions: [
      {
        question: "1. Sabah uyandığınızda güne başlamak için gereken zihinsel enerjiyi bulma durumunuz:",
        options: [
          { text: "Genellikle dinç ve hevesle uyanırım.", score: 0 },
          { text: "Bazen yataktan kalkmak zor gelir ama toparlarım.", score: 1 },
          { text: "Hemen hemen her sabah derin bir isteksizlik ve bitkinlikle uyanırım.", score: 2 },
          { text: "Yataktan çıkmak fiziksel bir acı ve işkence gibi gelir.", score: 3 },
        ],
      },
      {
        question: "2. Günün sonunda kendinizi duygusal olarak tamamen boşalmış hisseder misiniz?",
        options: [
          { text: "Hayır, akşamları da enerjim yeterlidir.", score: 0 },
          { text: "Yoğun günlerde yorulurum.", score: 1 },
          { text: "Neredeyse her akşam pestil gibi olur, kimseyle konuşmak istemem.", score: 2 },
          { text: "Günün daha başında bile duygusal olarak sıfırı tüketmiş haldeyim.", score: 3 },
        ],
      },
      {
        question: "3. İşinize, derslerinize veya insanlara karşı alaycı ve duyarsız (sinizm) bir tutum:",
        options: [
          { text: "İşimi ve insanları samimiyetle önemsemeye devam ediyorum.", score: 0 },
          { text: "Bazen tahammülüm azalıyor.", score: 1 },
          { text: "Sıklıkla 'bana ne, ne halleri varsa görsünler' modundayım.", score: 2 },
          { text: "Tamamen hissizleştim; insanlardan ve sorumluluklardan tiksinme noktasındayım.", score: 3 },
        ],
      },
      {
        question: "4. Küçük aksilikler karşısında öfke veya sabırsızlık patlamaları yaşama sıklığınız:",
        options: [
          { text: "Sakinliğimi korurum.", score: 0 },
          { text: "Bazen canım sıkılır ama geçer.", score: 1 },
          { text: "Çok çabuk parlar, orantısız öfke duyarım.", score: 2 },
          { text: "En ufak şeyde sinir krizi geçirecek gibi olurum.", score: 3 },
        ],
      },
      {
        question: "5. Yaptığınız işin ya da çabalarınızın gerçekten bir anlamı olduğuna dair inancınız:",
        options: [
          { text: "Yaptığım işin değerli ve anlamlı olduğunu hissediyorum.", score: 0 },
          { text: "Bazen rutinleşiyor ama genel olarak memnunum.", score: 1 },
          { text: "Ne yaparsam yapayım hiçbir şey değişmeyecekmiş gibi boş geliyor.", score: 2 },
          { text: "Her şey tamamen anlamsız ve absürt bir zaman kaybı gibi hissettiriyor.", score: 3 },
        ],
      },
      {
        question: "6. Hafta sonu ya da izin günlerinde gerçekten zihinsel olarak dinlenebiliyor musunuz?",
        options: [
          { text: "Evet, işi tamamen unutup yenilenirim.", score: 0 },
          { text: "Kısmen dinlenirim ama yaklaşan haftanın stresi erken başlar.", score: 1 },
          { text: "Bütün gün yatsam bile kemiklerimdeki yorgunluk asla geçmez.", score: 2 },
          { text: "Dinlenmek kavramı hayatımdan tamamen çıktı.", score: 3 },
        ],
      },
      {
        question: "7. Odaklanma güçlüğü, unutkanlık ve 'beyin sisi' (brain fog) yaşama durumunuz:",
        options: [
          { text: "Zihnim berrak ve keskindir.", score: 0 },
          { text: "Bazen dikkatim dağılır.", score: 1 },
          { text: "Sürekli bir sersemlik, unutkanlık ve konsantrasyon kaybı var.", score: 2 },
          { text: "Zihnim tamamen durmuş gibi, en basit şeyi bile hatırlayamıyorum.", score: 3 },
        ],
      },
      {
        question: "8. İnsanların sizden yardım veya ilgi istemesi karşısında hissettiğiniz:",
        options: [
          { text: "Yardım etmekten keyif alırım.", score: 0 },
          { text: "Yoğun değilsem yardım ederim.", score: 1 },
          { text: "Biri benden bir şey istediğinde içimde büyük bir öfke ve tükenmişlik belirir.", score: 2 },
          { text: "İnsanların talepleri beni boğuyor, kaçıp saklanmak istiyorum.", score: 3 },
        ],
      },
      {
        question: "9. Fiziksel belirtiler (kronik baş ağrısı, mide ağrısı, boyun tutulması):",
        options: [
          { text: "Bedenim sağlıklıdır, kronik ağrım yoktur.", score: 0 },
          { text: "Yalnızca çok stresli dönemlerde ağrılarım olur.", score: 1 },
          { text: "Haftanın çoğu günü başım, boynum ya da sırtım ağrır.", score: 2 },
          { text: "Bedenim sürekli ağrılar ve hastalık belirtileriyle çöküş sinyali veriyor.", score: 3 },
        ],
      },
      {
        question: "10. Kendinizi başarılı ve üretken hissetme dereceniz:",
        options: [
          { text: "Başarılarımdan gurur duyarım.", score: 0 },
          { text: "Eskisi kadar coşku vermese de iyi hissederim.", score: 1 },
          { text: "Kendimi yetersiz, verimsiz ve geride kalmış hissediyorum.", score: 2 },
          { text: "Tam bir fiyasko olduğumu ve hiçbir şeyi başaramadığımı düşünüyorum.", score: 3 },
        ],
      },
      {
        question: "11. Eskiden keyif aldığınız hobiler ve eğlenceler artık size nasıl geliyor?",
        options: [
          { text: "Hâlâ aynı heyecanla hobilerimle ilgileniyorum.", score: 0 },
          { text: "Eskisi kadar sık vakit ayıramıyorum.", score: 1 },
          { text: "Hobilerim bile artık külfet ve yorucu bir iş gibi geliyor.", score: 2 },
          { text: "Hiçbir şeye en ufak hevesim kalmadı.", score: 3 },
        ],
      },
      {
        question: "12. Çevrenizdeki insanların dertlerini dinleme kapasiteniz:",
        options: [
          { text: "Empatiyle dinleyebilirim.", score: 0 },
          { text: "Kendi derdim çok değilse dinlerim.", score: 1 },
          { text: "Hiç kimsenin derdini dinleyecek tek bir damla tahammülüm kalmadı.", score: 2 },
          { text: "İnsanların sorunlarını duyunca çığlık atıp kaçmak istiyorum.", score: 3 },
        ],
      },
      {
        question: "13. İş veya okul ortamına adım attığınız andaki bedensel hissiniz:",
        options: [
          { text: "Doğal ve motive bir şekilde girerim.", score: 0 },
          { text: "Bazen biraz isteksizlik olur.", score: 1 },
          { text: "Kapıdan girer girmez göğsüme bir ağırlık çöker, midem bulanır.", score: 2 },
          { text: "Kapıdan girdiğim an panik ve boğulma hissi başlar.", score: 3 },
        ],
      },
      {
        question: "14. Gelecekteki kariyerinize veya yaşamınıza dair heyecanınız:",
        options: [
          { text: "Gelecek hedeflerim beni heyecanlandırır.", score: 0 },
          { text: "Bazen belirsizlik yorar ama hedeflerim var.", score: 1 },
          { text: "Gelecekte hiçbir heyecan görmüyorum, sadece günü kurtarmaya çalışıyorum.", score: 2 },
          { text: "Gelecek kelimesi bile bende derin bir yorgunluk ve panik yaratıyor.", score: 3 },
        ],
      },
      {
        question: "15. Hata yapmaktan veya işleri yetiştirememekten duyduğunuz kaygı:",
        options: [
          { text: "Kontrolü elimde tutarım, sakin planlarım.", score: 0 },
          { text: "Bazen son teslim tarihleri stres yapar.", score: 1 },
          { text: "Sürekli bir şeyleri kaçıracağım ve batıracağım stresiyle kıvranıyorum.", score: 2 },
          { text: "Artık yetişip yetişmemesi bile umurumda değil, felç olmuş durumdayım.", score: 3 },
        ],
      },
      {
        question: "16. Kendinizi iş arkadaşlarınızdan veya sosyal çevrenizden izole etme eğiliminiz:",
        options: [
          { text: "Sosyal iletişimi sürdürürüm.", score: 0 },
          { text: "Bazen kendi köşeme çekilirim.", score: 1 },
          { text: "Öğle yemeklerini bile tek başıma yer, insanlardan köşe bucak kaçarım.", score: 2 },
          { text: "Tamamen izole oldum, kimseyle göz teması bile kurmak istemiyorum.", score: 3 },
        ],
      },
      {
        question: "17. Yaşamınızdaki sorumlulukları sürdürmek için sarf ettiğiniz efor:",
        options: [
          { text: "Doğal akışında sürdürebiliyorum.", score: 0 },
          { text: "Bazen biraz zorlanıyorum.", score: 1 },
          { text: "Her basit görev için kendimi arkadan iteklemek ve zorlamak zorundayım.", score: 2 },
          { text: "Artık kendimi zorlayacak tek bir gram bile iradem kalmadı.", score: 3 },
        ],
      },
      {
        question: "18. Uykudan uyandığınızdaki kas ve çene gerginliğiniz (diş sıkma):",
        options: [
          { text: "Bedenim gevşemiş olarak uyanırım.", score: 0 },
          { text: "Bazen çenemi sıktığımı fark ederim.", score: 1 },
          { text: "Neredeyse her sabah baş ağrısı ve sıkılmış dişlerle uyanırım.", score: 2 },
          { text: "Bedenim uykuda bile savaş veriyor, hiç dinlenemiyorum.", score: 3 },
        ],
      },
      {
        question: "19. Mizah duygunuz ve gülme yeteneğiniz son dönemde nasıl etkilendi?",
        options: [
          { text: "Eskisi gibi kahkaha atabiliyor ve gülebiliyorum.", score: 0 },
          { text: "Bazen gülerim ama eskisi kadar neşeli değilim.", score: 1 },
          { text: "Gerçekten içten bir kahkaha atmayalı aylar oldu gibi hissediyorum.", score: 2 },
          { text: "Gülmek benim için tamamen yabancı bir kavrama dönüştü.", score: 3 },
        ],
      },
      {
        question: "20. 'Eğer böyle devam edersem bir noktada fiziksel veya ruhsal olarak çökeceğim' hissi:",
        options: [
          { text: "Böyle bir hissim yok, dengedeyim.", score: 0 },
          { text: "Bazen yavaşlamam gerektiğini hissediyorum.", score: 1 },
          { text: "Evet, bir uçurumun kenarında yürüyor gibi hissediyorum.", score: 2 },
          { text: "Şu an tam anlamıyla o çöküşün ortasındayım.", score: 3 },
        ],
      },
    ],
    getResult: (answers) => {
      const total = answers.reduce((sum, curr) => sum + (curr.score || 0), 0);
      if (total <= 12) {
        return {
          title: "Dengeli Enerji & Düşük Tükenmişlik",
          scoreText: `Puan: ${total} / 60 • Sağlıklı Batarya`,
          badge: "Dengeli",
          evaluation: "Tükenmişlik seviyeniz sağlıklı sınırlar içindedir. İş ve yaşam dengenizi koruyabiliyor, yorulduğunuzda kendinizi dinlendirecek alanlar açabiliyorsunuz.",
          advice: "Bu harika ritminizi sürdürün; bedeninize ve ruhunuza düzenli aralıklarla nefes alma alanları sağlamaya devam edin.",
          recommendedTherapy: {
            id: "bireysel",
            name: "Bireysel Psikoterapi & Yaşam Dengesi",
            matchReason: "Mevcut yaşam enerjisini korumak ve stres yönetimi tekniklerini parlatmak için uygundur.",
            benefits: ["İş-yaşam dengesini optimize etme", "Kişisel sınırları güçlendirme", "Ruhsal bataryaları dolu tutma"],
            duration: "50 Dakika",
            format: "Yüz Yüze veya Çevrimiçi (Online)",
          },
        };
      } else if (total <= 26) {
        return {
          title: "Erken Aşınma ve Alarm Dönemi (Sarı Işık)",
          scoreText: `Puan: ${total} / 60 • Erken Alarm`,
          badge: "Mola Gerekli",
          evaluation: "Zihniniz kronik yorgunluk ve aşınma sinyalleri veriyor. Dinlenmeden biriktirdiğiniz sorumluluklar, tahammül azlığı ve sinizm belirtileri rezervlerinizin eridiğini gösteriyor.",
          advice: "Sınır koymayı ve 'hayır' demeyi pratik edin. Her işi mükemmel yapmak zorunda değilsiniz; hafta sonlarını gerçekten işten izole geçirin.",
          recommendedTherapy: {
            id: "mindfulness",
            name: "Mindfulness & Stres Azaltma Terapisi (MBSR)",
            matchReason: "Kronik stres uyarılmışlığını kırmak ve sinir sistemini dinlenme moduna geçirmek için en etkili yaklaşımdır.",
            benefits: ["Zihinsel aşırı yükü ve beyin sisini temizleme", "Beden odaklı gevşeme ve uyku kalitesini artırma", "Kronik yorgunluk döngüsünü durdurma"],
            duration: "50 Dakika",
            format: "Yüz Yüze veya Çevrimiçi (Online)",
          },
        };
      } else if (total <= 42) {
        return {
          title: "İleri Düzey Tükenmişlik Eşiği (Burnout Riski)",
          scoreText: `Puan: ${total} / 60 • Ciddi Aşınma`,
          badge: "Ciddi Tükenmişlik",
          evaluation: "Duygusal ve fiziksel rezervleriniz tükenmiş durumdadır. Dinlenseniz bile geçmeyen bir yorgunluk, insanlara karşı hissizleşme ve derin anlamsızlık döngüsü başlamıştır.",
          advice: "Bu aşama bir irade problemi değil, sinir sisteminin aşırı yük korumasıdır. Mutlaka bir uzman desteği alarak yaşam önceliklerinizi yeniden yapılandırmalısınız.",
          recommendedTherapy: {
            id: "bdt",
            name: "Bilişsel Davranışçı Terapi (BDT) & Yaşam Yeniden Yapılandırma",
            matchReason: "Tükenmişliğe yol açan mükemmeliyetçi inançları ve aşırı sorumluluk kalıplarını dönüştürmek için gereklidir.",
            benefits: ["Kronik aşırı sorumluluk duygusunu hafifletme", "Kişisel sınırları ve hayır diyebilmeyi güçlendirme", "Tükenmişlik döngüsünü bilimsel metotlarla kırma"],
            duration: "50 Dakika",
            format: "Yüz Yüze (Klinik) veya Çevrimiçi (Online)",
          },
        };
      } else {
        return {
          title: "Kritik Klinik Burnout (Tükenmişlik Sendromu)",
          scoreText: `Puan: ${total} / 60 • Kritik Seviye`,
          badge: "Acil Müdahale",
          evaluation: "Bedeniniz ve zihniniz acil fren çekmiş durumdadır. Beyin sisi, kronik isteksizlik, fiziksel ağrılar ve derin yabancılaşma günlük fonksiyonlarınızı bloke etmektedir.",
          advice: "Derhal psikolojik ve tıbbi destek alınmalı, gerekirse iş/sorumluluk ortamından uzaklaşarak sinir sisteminin onarımına odaklanılmalıdır.",
          recommendedTherapy: {
            id: "emdr",
            name: "Klinik Travma & Somatik Tükenmişlik Terapisi",
            matchReason: "Sinir sisteminin kilitlendiği şiddetli tükenmişlik tablolarında somatik regülasyon ve kök inançları dönüştürmek için elzemdir.",
            benefits: ["Kilitlenmiş sinir sistemini yeniden regüle etme", "Bedensel kronik ağrı ve baskıyı çözme", "Tükenmişlikten sağlıklı ve canlı yaşama geçiş"],
            duration: "60 Dakika",
            format: "Öncelikli Klinik Seansı",
          },
        };
      }
    },
  },

  // ==========================================
  // 6. ŞEMA TERAPİSİ: İÇSEL ÇOCUK VE İNANÇ KALIPLARI (20 SORU)
  // ==========================================
  {
    id: "sema-terapisi-ic-cocuk",
    icon: <Sparkles size={32} />,
    title: "Şema Terapisi: İçsel Çocuk ve İnanç Kalıpları",
    category: "Klinik & Duygudurum",
    duration: "6 Dakika",
    questionCount: 20,
    badge: "20 Soru • Jeffrey Young",
    desc: "Çocuklukta karşılanmamış temel duygusal ihtiyaçlardan köklenen Terk Edilme, Kusurluluk, Fedakarlık, Duygusal Yoksunluk ve Yüksek Standartlar şemalarını 20 derin soruyla haritalandırır.",
    questions: [
      {
        question: "1. İçinizde 'Gerçekte kim olduğumu görseler beni kimse sevmez ve istemez' inancı yankılanır mı?",
        options: [
          { text: "Hayır; kendimi sevilmeye layık ve değerli biri olarak görürüm.", score: 0 },
          { text: "Bazen yetersiz hissettiğim anlar olur.", score: 1 },
          { text: "Evet; içten içe derin bir kusurluluk ve defolu olma hissi taşırım.", score: 2 },
        ],
      },
      {
        question: "2. Hayatınızdaki sevdiklerinizin eninde sonunda sizi yalnız bırakacağı veya terk edeceği korkusu:",
        options: [
          { text: "Böyle bir kaygım yok; güvenli bağlar kurabiliyorum.", score: 0 },
          { text: "Bazen sevdiklerimi kaybetmekten aşırı korkarım.", score: 1 },
          { text: "Sürekli tetikteyim; en sevdiğim insan bile bir gün beni bırakıp gidecek gibi gelir.", score: 2 },
        ],
      },
      {
        question: "3. Kendi ihtiyaçlarınızı yok sayıp başkalarının ihtiyaçlarını karşılamayı bir görev gibi üstlenir misiniz?",
        options: [
          { text: "Dengeli yardımlaşırım ama kendimi feda etmem.", score: 0 },
          { text: "Çoğu zaman başkalarının işini kendi işimin önüne koyarım.", score: 1 },
          { text: "Sürekli başkalarını kurtarmak zorundayım, aksi halde derin bir suçluluk duyarım.", score: 2 },
        ],
      },
      {
        question: "4. Duygusal olarak kimsenin sizi gerçekten anlamadığı, içinizdeki derin boşluğu kimsenin dolduramayacağı hissi:",
        options: [
          { text: "Hayatımda beni derinden anlayan ve seven insanlar var.", score: 0 },
          { text: "Zaman zaman anlaşılmadığımı düşünürüm.", score: 1 },
          { text: "Kalabalıklar içinde bile derin bir duygusal açlık ve görünmezlik hissederim.", score: 2 },
        ],
      },
      {
        question: "5. Hata yapmaktan, kusursuz olamamaktan ve başarısız olmaktan duyduğunuz dehşet:",
        options: [
          { text: "Hata yapmak insanidir, rahatça kabullenirim.", score: 0 },
          { text: "Hata yapmaktan hoşlanmam ama hayatımı felç etmez.", score: 1 },
          { text: "Standartlarım o kadar yüksek ki, en ufak hata beni değersizlik çukuruna atar.", score: 2 },
        ],
      },
      {
        question: "6. Kendi haklarınızı savunmak yerine çatışma çıkmasın diye başkalarına boyun eğme eğilimi:",
        options: [
          { text: "Kendi fikrimi rahatlıkla savunurum.", score: 0 },
          { text: "Bazen tartışmamak için geri adım atarım.", score: 1 },
          { text: "Başkalarının öfkesinden korktuğum için hep boyun eğer, kendimi silerim.", score: 2 },
        ],
      },
      {
        question: "7. İnsanların size ancak onlara bir faydanız dokunduğu sürece değer verdiğine inanır mısınız?",
        options: [
          { text: "Hayır; sadece var olduğum için de sevilmeye değerim.", score: 0 },
          { text: "Bazen faydalı olmazsam sevilmeyeceğimi düşünürüm.", score: 1 },
          { text: "Evet; bir işe yaramazsam derhal çöpe atılacakmışım gibi hissederim.", score: 2 },
        ],
      },
      {
        question: "8. Kendinizi diğer insanlardan temelde farklı, garip ve hiçbir yere ait değilmiş gibi hisseder misiniz?",
        options: [
          { text: "Topluma ve dostlarıma ait hissederim.", score: 0 },
          { text: "Bazen kendimi biraz farklı hissederim.", score: 1 },
          { text: "Dünyaya yanlışlıkla düşmüş bir uzaylı gibi, hiçbir yere ait değilim.", score: 2 },
        ],
      },
      {
        question: "9. Başınıza her an kötü bir felaket (hastalık, parasızlık, kaza) geleceğine dair kronik tehdit hissi:",
        options: [
          { text: "Hayatın akışına güvenirim.", score: 0 },
          { text: "Bazen kötü ihtimaller aklıma gelir.", score: 1 },
          { text: "Sürekli bir felaketin eşiğindeymişim gibi tedirginim.", score: 2 },
        ],
      },
      {
        question: "10. Bir başarı kazandığınızda bunu şans eseri sayıp 'yakında sahtekar olduğumu anlayacaklar' korkusu (İmpostor):",
        options: [
          { text: "Emeğimin ve yeteneğimin hakkını veririm.", score: 0 },
          { text: "Bazen şansın da rolü olduğunu düşünürüm.", score: 1 },
          { text: "Asla hak ettiğimi düşünmem, bir gün yakalanacağım korkusu yaşarım.", score: 2 },
        ],
      },
      {
        question: "11. Duygularınızı açıkça gösterirseniz insanların sizi zayıf bulup aşağılayacağına dair inancınız:",
        options: [
          { text: "Duygularımı rahatça paylaşırım.", score: 0 },
          { text: "Yalnızca çok yakınlarıma açılırım.", score: 1 },
          { text: "Duygularımı kilitli bir kasada saklarım; ağlamak ya da üzülmek büyük utançtır.", score: 2 },
        ],
      },
      {
        question: "12. Birisi sizi sevdiğinde içten içe 'Beni henüz tam tanımıyor, tanısa sevmez' şüphesi:",
        options: [
          { text: "Beni tanıdıkça daha çok seveceklerini bilirim.", score: 0 },
          { text: "Bazen bu şüphe aklımdan geçer.", score: 1 },
          { text: "Her zaman bu şüpheyi taşırım, gerçek yüzümü görmesinler diye rol yaparım.", score: 2 },
        ],
      },
      {
        question: "13. Dinlenirken ya da hiçbir şey yapmazken içinizi kemiren suçluluk duygusu:",
        options: [
          { text: "Keyifle ve suçluluk duymadan dinlenebilirim.", score: 0 },
          { text: "Bazen çok boş oturunca huzursuz olurum.", score: 1 },
          { text: "Boş durduğum her saniye kendimi tembel ve değersiz bir asalak gibi hissederim.", score: 2 },
        ],
      },
      {
        question: "14. İnsanların söylediklerinin arkasında gizli bir alay veya kötü niyet arama alışkanlığı:",
        options: [
          { text: "İnsanların sözlerine doğrudan güvenirim.", score: 0 },
          { text: "Bazen ima ararım.", score: 1 },
          { text: "Kimsenin samimiyetine inanmam, her iltifatın altında bir tuzak ararım.", score: 2 },
        ],
      },
      {
        question: "15. Yakın ilişkilerde partnerinizin hayatını kontrol etme veya hesap sorma dürtüsü:",
        options: [
          { text: "Partnerime güvenir ve özgürlük tanırım.", score: 0 },
          { text: "Bazen merak edip kontrol ederim.", score: 1 },
          { text: "Kontrolü bir an bıraksam her şey dağılacak ve terk edileceğim korkusu yaşarım.", score: 2 },
        ],
      },
      {
        question: "16. Kendi isteklerinizi dile getirdiğinizde 'Aşırı bencilim' diye kendinizi cezalandırma:",
        options: [
          { text: "İsteklerimi dile getirmek en doğal hakkımdır.", score: 0 },
          { text: "Bazen çekinirim.", score: 1 },
          { text: "Ne zaman bir şey istesem kendimden utanır ve hemen geri adım atarım.", score: 2 },
        ],
      },
      {
        question: "17. 'Bu dünyada tek başınasın, kimseden yardım bekleme' inancıyla kimseye yük olmama çabası:",
        options: [
          { text: "Gerektiğinde güvenle yardım isterim.", score: 0 },
          { text: "Zorlanmadıkça yardım istemem.", score: 1 },
          { text: "Ölsem bile kimseden yardım istemem; kendi kendime yetmek zorundayım.", score: 2 },
        ],
      },
      {
        question: "18. En ufak bir kural ihlalinde ya da hatada kendinize veya başkalarına acımasız öfke duyma:",
        options: [
          { text: "Hoşgörülüyüm ve esneyebilirim.", score: 0 },
          { text: "Bazen katı olabilirim.", score: 1 },
          { text: "Kusursuz kurallarım vardır; çiğnenirse içimde büyük bir nefret uyanır.", score: 2 },
        ],
      },
      {
        question: "19. Sevdikleriniz yanınızdayken bile bir gün onların yok olacağı kederini yaşama (önceden yas tutma):",
        options: [
          { text: "Anın tadını çıkarırım.", score: 0 },
          { text: "Bazen kaybetme korkusu gelir.", score: 1 },
          { text: "Birlikteyken bile sürekli ayrılık acısını yaşayıp kendimi hırpalarım.", score: 2 },
        ],
      },
      {
        question: "20. Çocuklukta anne veya babanızın duygusal ihtiyaçlarını karşılamak zorunda kalmış hissi:",
        options: [
          { text: "Çocukluğumu çocuk gibi özgürce yaşadım.", score: 0 },
          { text: "Bazen erken olgunlaşmam gerekti.", score: 1 },
          { text: "Ben ailemin ebeveyniydim; çocukluğumu hiç yaşayamadan herkesi kurtardım.", score: 2 },
        ],
      },
    ],
    getResult: (answers) => {
      const total = answers.reduce((sum, curr) => sum + (curr.score || 0), 0);
      if (total <= 8) {
        return {
          title: "Sağlıklı Yetişkin Modu (İçsel Bütünlük & Güven)",
          scoreText: `Puan: ${total} / 40 • Uyumlu İnanç Sistemi`,
          badge: "Sağlıklı Yetişkin",
          evaluation: "Çocukluk dönemi duygusal yaralarınızı büyük ölçüde onarmışsınız. Kendi sınırlarınızı koruyabiliyor, hata yapmanın insaniliğini kabul ediyor ve sevilmeye layık olduğunuzu içselleştirmiş durumdasınız.",
          advice: "Bu içsel şefkati hayatınızdaki her alana taşımaya ve içinizdeki neşeli çocuğu beslemeye devam edin.",
          recommendedTherapy: {
            id: "bireysel",
            name: "Bireysel Psikoterapi & Kendini Gerçekleştirme",
            matchReason: "Var olan içsel gücü korumak ve anlamlı yaşam hedeflerini beslemek için uygundur.",
            benefits: ["İçsel şefkati derinleştirme", "Özgün kimliği parlatma", "Derin doyuma ulaşma"],
            duration: "50 Dakika",
            format: "Yüz Yüze veya Çevrimiçi (Online)",
          },
        };
      } else if (total <= 20) {
        return {
          title: "Aktif Erken Dönem Uyumsuz Şemaları (Fedakarlık & Yetersizlik)",
          scoreText: `Puan: ${total} / 40 • Orta Düzey Şema Aktivasyonu`,
          badge: "Farkındalık Gerekli",
          evaluation: "İçinizdeki çocuk, sevilmek ve onaylanmak için sürekli 'faydalı, kusursuz ve sorunsuz' olmak zorunda olduğuna inanıyor. Bu durum yetişkin ilişkilerinizde aşırı fedakarlık ve yetersizlik döngüleri yaratmaktadır.",
          advice: "Kendi ihtiyaçlarınızı dile getirmek bir suç ya da bencillik değildir. Şema terapisi ile içinizdeki yaralı çocuğu şefkatle kucaklayıp yetişkin parçanızı güçlendirebilirsiniz.",
          recommendedTherapy: {
            id: "sema",
            name: "Şema Terapisi (Jeffrey Young Modeli)",
            matchReason: "Çocukluk kökenli fedakarlık, kusurluluk ve terk edilme şemalarını kökten dönüştürmek için dünyadaki en başarılı terapi ekolüdür.",
            benefits: ["Kusurluluk ve suçluluk inancını silme", "İçsel eleştirmene karşı sınır koyma", "Kendi ihtiyaçlarını özgürce yaşayabilme"],
            duration: "50 Dakika",
            format: "Yüz Yüze (Klinik) veya Çevrimiçi (Online)",
          },
        };
      } else {
        return {
          title: "Yoğun Kök İnanç Tuzakları (Kırılgan Çocuk & Katı Ebeveyn)",
          scoreText: `Puan: ${total} / 40 • Yüksek Şema Yükü`,
          badge: "Derin Şema Onarımı",
          evaluation: "İç dünyanızda acımasız bir talepkar ebeveyn sesi sürekli sizi denetliyor; aynı anda derinlerde terk edilmekten ve defolu bulunmaktan korkan kırılgan bir içsel çocuk yaşıyor. Bu durum ilişkilerinizi ve özsaygınızı derinden yıpratmaktadır.",
          advice: "Bu eski inanç bantları sizin kaderiniz değildir; sadece çocukken hayatta kalmak için geliştirdiğiniz savunma mekanizmalarıdır. Şema terapisi ile bu yaraları kalıcı olarak iyileştirebilirsiniz.",
          recommendedTherapy: {
            id: "sema",
            name: "Kapsamlı Şema Terapisi & İçsel Çocuk Onarımı",
            matchReason: "Kök çocukluk yaralarını 'yeniden ebeveynlik' (re-parenting) teknikleriyle iyileştirmek için özel olarak yapılandırılmış uzmanlık alanıdır.",
            benefits: ["Kırılgan içsel çocuğa güvenli liman olma", "Kalıcı terk edilme ve yetersizlik dehşetini bitirme", "Hakiki özsaygı ve sevilme özgürlüğü kazanma"],
            duration: "50 Dakika",
            format: "Öncelikli Yüz Yüze Klinik Seansı",
          },
        };
      }
    },
  },

  // ==========================================
  // 7. ÖZ-ŞEFKAT (SELF-COMPASSION) ÖLÇEĞİ (20 SORU)
  // ==========================================
  {
    id: "oz-sefkat-olcegi",
    icon: <Smile size={32} />,
    title: "Öz-Şefkat ve Kendine Nezaket Ölçeği",
    category: "Kişilik & Benlik",
    duration: "6 Dakika",
    questionCount: 20,
    badge: "20 Soru • Kristin Neff",
    desc: "Dr. Kristin Neff'in bilimsel öz-şefkat ölçeği: Hata yaptığınızda, acı çekerken ve yetersiz hissettiğinizde kendinize acımasız bir kırbaç gibi mi, yoksa şefkatli bir dost gibi mi davrandığınızı 20 soruyla ölçer.",
    questions: [
      {
        question: "1. Çok önemli bir konuda hata yaptığımda kendime karşı anlayışlı ve sabırlı davranırım.",
        options: [
          { text: "Neredeyse her zaman (Yüksek Öz-Şefkat)", score: 2 },
          { text: "Bazen (Orta Düzey)", score: 1 },
          { text: "Neredeyse hiçbir zaman (Sert Eleştiri)", score: 0 },
        ],
      },
      {
        question: "2. Canım çok yandığında veya başarısız olduğumda kendimi acımasızca yargılar ve hırpalarım.",
        options: [
          { text: "Neredeyse hiçbir zaman, kendime şefkatle yaklaşırım.", score: 2 },
          { text: "Bazen kendime kızarım.", score: 1 },
          { text: "Neredeyse her zaman kendimi yerin dibine sokarım.", score: 0 },
        ],
      },
      {
        question: "3. Hayatta bir aksilik yaşadığımda bunun tüm insanların ortak deneyiminin bir parçası olduğunu hatırlarım.",
        options: [
          { text: "Evet, hata yapmanın insan olmanın kumaşı olduğunu bilirim.", score: 2 },
          { text: "Bazen hatırlarım.", score: 1 },
          { text: "Hayır; sanki sadece ben beceriksizmişim gibi yapayalnız hissederim.", score: 0 },
        ],
      },
      {
        question: "4. Kendimi yetersiz hissettiğim anlarda dünyadaki herkesin benden daha başarılı ve mutlu olduğunu sanırım.",
        options: [
          { text: "Hayır, herkesin kendi görünmeyen acıları olduğunu bilirim.", score: 2 },
          { text: "Bazen kıyaslama tuzağına düşerim.", score: 1 },
          { text: "Evet, herkes harika yaşarken sadece ben batırıyormuşum gibi gelir.", score: 0 },
        ],
      },
      {
        question: "5. Bedenimde veya karakterimde kusurlu bulduğum bir yönle yüzleştiğimde kendime şefkatle sarılırım.",
        options: [
          { text: "Kusurlarımla bir bütün olduğumu kabul ederim.", score: 2 },
          { text: "Zaman zaman rahatsız olsam da toparlarım.", score: 1 },
          { text: "Kusurlarımdan derin bir utanç duyar, kendimden nefret ederim.", score: 0 },
        ],
      },
      {
        question: "6. Çok sevdiğim bir dostum aynı hatayı yapsa ona gösterdiğim merhameti kendime gösterir miyim?",
        options: [
          { text: "Evet, bir dostuma nasıl kucak açarsam kendime de öyle yaklaşırım.", score: 2 },
          { text: "Dostuma daha cömertimdir ama kendimi de çok ezmem.", score: 1 },
          { text: "Asla; dostuma sarılırım ama kendimi acımasızca cezalandırırım.", score: 0 },
        ],
      },
      {
        question: "7. Zor bir dönemden geçerken kendime fazladan dinlenme, sevgi ve tolerans tanırım.",
        options: [
          { text: "Evet, kriz anlarında kendime şefkatli bir sığınak olurum.", score: 2 },
          { text: "Elimden geldiğince dikkat ederim.", score: 1 },
          { text: "Kendime 'Zayıf olma, toparlan hemen' diye baskı yapar, duygumu ezerim.", score: 0 },
        ],
      },
      {
        question: "8. İşler ters gittiğinde duygularımın içinden farkındalıkla geçer, ne hissettiğimi kabul ederim.",
        options: [
          { text: "Duygumu bastırmadan şefkatle gözlemlerim.", score: 2 },
          { text: "Bazen duygularımın içinde kaybolurum.", score: 1 },
          { text: "Duygularımdan kaçar ya da aşırı abartıp felaketleştiririm.", score: 0 },
        ],
      },
      {
        question: "9. 'Kusursuz olmak zorunda değilim, yeterince iyi olmak yeterlidir' inancı:",
        options: [
          { text: "Beni özgürleştiren temel hayat ilkemdir.", score: 2 },
          { text: "Bazen mükemmeliyetçilik beni yoklar.", score: 1 },
          { text: "Mükemmel olmazsam sevilmeyeceğime ve çöpe atılacağıma inanırım.", score: 0 },
        ],
      },
      {
        question: "10. Bir şeyi beceremediğimde iç sesimin tonu nasıldır?",
        options: [
          { text: "Sevecen, teşvik edici ve anlayışlı bir dost gibidir.", score: 2 },
          { text: "Bazen sitemkar ama yapıcıdır.", score: 1 },
          { text: "Zehirli, aşağılayıcı ve acımasız bir zorba gibidir.", score: 0 },
        ],
      },
      {
        question: "11. Günlük hayatta kendime 'Şu an neye ihtiyacım var?' sorusunu sorar mıyım?",
        options: [
          { text: "Düzenli olarak sorar ve bedenimin sesini dinlerim.", score: 2 },
          { text: "Bazen aklıma gelir.", score: 1 },
          { text: "Kendi ihtiyaçlarımı hiç düşünmem, sürekli işleri yetiştirmeye çalışırım.", score: 0 },
        ],
      },
      {
        question: "12. Başkalarının takdirini ve onayını alamadığımda öz-değerim yerle bir olur mu?",
        options: [
          { text: "Hayır; kendi değerimi kendi içimden bilirim.", score: 2 },
          { text: "Bazen onaylanmamak üzer ama toparlarım.", score: 1 },
          { text: "Evet; biri beni onaylamazsa kendimi tamamen sıfır hissederim.", score: 0 },
        ],
      },
      {
        question: "13. Kendimi geçmişteki pişmanlıklarım yüzünden affedebildim mi?",
        options: [
          { text: "O zamanki aklımla elimden gelenin en iyisini yaptığımı kabul ettim.", score: 2 },
          { text: "Büyük ölçüde affettim, ara sıra hatırlarım.", score: 1 },
          { text: "Kendimi asla affetmiyorum, geçmişteki hatalarımı her gün yeniden cezalandırıyorum.", score: 0 },
        ],
      },
      {
        question: "14. Yorgun hissettiğimde suçluluk duymadan dinlenebiliyor muyum?",
        options: [
          { text: "Dinlenmek biyolojik bir haktır, keyifle dinlenirim.", score: 2 },
          { text: "Bazen huzursuz olsam da dinlenirim.", score: 1 },
          { text: "Yattığım her an vicdan azabı çeker, kendime tembel derim.", score: 0 },
        ],
      },
      {
        question: "15. Üzüntülü bir günde elinizi kalbinizin üstüne koyup kendinize 'Buradayım, yanındayım' diyebilir misiniz?",
        options: [
          { text: "Evet, bu şefkatli teması kendime vermekten çekinmem.", score: 2 },
          { text: "Biraz garip gelse de deneyebilirim.", score: 1 },
          { text: "Asla, kendime böyle davranmak bana saçma ve zayıflık gibi gelir.", score: 0 },
        ],
      },
      {
        question: "16. Başkalarının kusurlarına karşı gösterdiğim toleransı kendime de gösteririm:",
        options: [
          { text: "Kendime de aynı hoşgörüyü tanırım.", score: 2 },
          { text: "Başkalarına biraz daha toleranslıyımdır.", score: 1 },
          { text: "Başkalarına melek gibi, kendime zalim bir gardiyan gibiyim.", score: 0 },
        ],
      },
      {
        question: "17. Birisi beni haksız yere eleştirdiğinde kendimi savunabilir miyim?",
        options: [
          { text: "Kendi arkamda durur ve sınırımı korurum.", score: 2 },
          { text: "Bazen çekinsem de savunurum.", score: 1 },
          { text: "Hemen karşımdakine hak verir, suçlunun ben olduğuma inanırım.", score: 0 },
        ],
      },
      {
        question: "18. İnsan olmanın doğasında kırılganlığın da bulunduğunu kabul ediyor muyum?",
        options: [
          { text: "Kırılganlık gerçek cesarettir, kabul ederim.", score: 2 },
          { text: "Zaman zaman kabul ederim.", score: 1 },
          { text: "Kırılganlık bir zayıflıktır; hep kaya gibi güçlü görünmek zorundayım.", score: 0 },
        ],
      },
      {
        question: "19. Kötü bir günün ardından kendime ödül ve sıcak bir şefkat ortamı hazırlar mıyım?",
        options: [
          { text: "Sıcak bir çay, güzel bir banyo ve dinlenmeyle kendimi sararım.", score: 2 },
          { text: "Bazen kendimi ödüllendiririm.", score: 1 },
          { text: "Kötü gün geçirdim diye daha da çok çalışarak kendimi cezalandırırım.", score: 0 },
        ],
      },
      {
        question: "20. 'Kendimi koşulsuz olarak seviyor ve kabul ediyorum' cümlesi kalbimde ne hissettirir?",
        options: [
          { text: "Derin bir huzur ve içsel onay hissi.", score: 2 },
          { text: "Ulaşmaya çalıştığım güzel bir hedef.", score: 1 },
          { text: "Büyük bir inançsızlık ve direnç.", score: 0 },
        ],
      },
    ],
    getResult: (answers) => {
      const total = answers.reduce((sum, curr) => sum + (curr.score || 0), 0);
      if (total >= 28) {
        return {
          title: "Yüksek Öz-Şefkat & Güçlü Duygusal Dayanıklılık",
          scoreText: `Puan: ${total} / 40 • Üst Düzey Şefkat`,
          badge: "Şefkatli Kalp",
          evaluation: "Zor zamanlarda kendinize acımasız bir gardiyan değil, güvenli ve şefkatli bir liman olabiliyorsunuz. Hataları ve eksiklikleri insan olmanın doğal bir parçası olarak kabul etme bilgeliğine sahipsiniz.",
          advice: "Bu muazzam içsel sevgiyi ve öz-şefkati hayatınızdaki her alana yaymaya devam edin.",
          recommendedTherapy: {
            id: "bireysel",
            name: "Bireysel Psikoterapi & Öz-Gerçekleştirme",
            matchReason: "Var olan yüksek öz-şefkat temelini yaratıcı projelere ve derin ilişkilere kanalize etmek için uygundur.",
            benefits: ["İçsel huzuru kalıcı kılma", "Başkalarına sağlıklı şefkat sunma", "Yaşam doyumunu maksimize etme"],
            duration: "50 Dakika",
            format: "Yüz Yüze veya Çevrimiçi (Online)",
          },
        };
      } else if (total >= 16) {
        return {
          title: "Koşullu Öz-Kabul & Gelişmekte Olan Nezaket",
          scoreText: `Puan: ${total} / 40 • Orta Seviye`,
          badge: "Farkındalık Dönemi",
          evaluation: "İyi günlerde kendinizle barışık kalabiliyorsunuz ancak işler ters gittiğinde eski eleştirel iç sesler devreye girip kendinizi hırpalamanıza neden olabiliyor.",
          advice: "Kendinize şefkat göstermeyi bir lüks değil, psikolojik sağlığın temel vitamini olarak görün. Neff'in öz-şefkat molası egzersizlerini günlük rutininize dahil edin.",
          recommendedTherapy: {
            id: "mindfulness",
            name: "Mindfulness & Öz-Şefkat Odaklı Terapi (CFT)",
            matchReason: "İçsel eleştirmenin sesini yatıştırmak ve kendinize koşulsuz nezaket göstermeyi öğrenmek için tasarlanmış özel terapi ekolüdür.",
            benefits: ["İçsel acımasız yargıcı susturma", "Zor anlarda elini kalbine koyup kendini sakinleştirme", "Koşulsuz öz-değer inşası"],
            duration: "50 Dakika",
            format: "Yüz Yüze veya Çevrimiçi (Online)",
          },
        };
      } else {
        return {
          title: "Sert İçsel Eleştirmen Tuzağı (Düşük Öz-Şefkat)",
          scoreText: `Puan: ${total} / 40 • Yoğun Öz-Yargılama`,
          badge: "İçsel Barışma Gerekli",
          evaluation: "İçinizde sürekli sizi denetleyen, en ufak hatada acımasızca cezalandıran ve dinlenmenize izin vermeyen sert bir içsel tiran yaşıyor. Sevgiye ancak 'kusursuz ve başarılı' olduğunuzda layık olduğunuza inanıyorsunuz.",
          advice: "Bir dostunuza asla söylemeyeceğiniz zehirli sözleri kendinize söylemeyi bırakın. Şefkat odaklı terapi ile içinizdeki sevecen sesi uyandırmalısınız.",
          recommendedTherapy: {
            id: "sema",
            name: "Şema Terapisi & Şefkat Odaklı Terapi (CFT)",
            matchReason: "Aşırı talepkar ebeveyn sesini susturmak ve yıkıcı öz-eleştiriyi kökten dönüştürmek için en etkili terapi kombinasyonudur.",
            benefits: ["Kendine düşman olmayı bırakma", "Hata yapma özgürlüğünü geri kazanma", "Huzurlu ve şefkatli bir iç dünya kurma"],
            duration: "50 Dakika",
            format: "Yüz Yüze (Klinik) veya Çevrimiçi (Online)",
          },
        };
      }
    },
  },

  // ==========================================
  // 8. İNSANLARI MEMNUN ETME (PEOPLE-PLEASER) VE SINIR TESTİ (20 SORU)
  // ==========================================
  {
    id: "people-pleaser-sinirlar",
    icon: <Shield size={32} />,
    title: "İnsanları Memnun Etme ve Kişisel Sınırlar Testi",
    category: "İlişkiler & Bağlanma",
    duration: "6 Dakika",
    questionCount: 20,
    badge: "20 Soru • Sınır Kuramı",
    desc: "'Hayır' diyebilme gücünüzü, reddedilme ve sevilmeme korkunuzu, başkalarını memnun etmek uğruna kendi hayatınızı feda etme derecenizi 20 detaylı soruyla ortaya çıkarır.",
    questions: [
      {
        question: "1. Gerçekten yapmak istemediğiniz bir ricaya 'Hayır' derken ne hissedersiniz?",
        options: [
          { text: "Nezaketle 'Hayır' derim ve suçluluk duymam; sınırlarım doğaldır.", score: 0 },
          { text: "'Hayır' derim ama sonrasında içten içe gün boyu vicdan azabı çekerim.", score: 1 },
          { text: "'Hayır' diyemem; kırılmasınlar ya da küsmesinler diye istemesem de 'Evet' derim.", score: 2 },
        ],
      },
      {
        question: "2. Birisi size hafifçe soğuk ya da asık suratlı davrandığında ilk düşünceniz:",
        options: [
          { text: "Kendiyle ilgili bir meselesi vardır der, üstüme alınmam.", score: 0 },
          { text: "Acaba farkında olmadan onu kıracak bir şey yaptım mı diye hafızamı yoklarım.", score: 1 },
          { text: "Kesinlikle benim yüzümden olduğunu düşünür, durumu düzeltmek için çırpınırım.", score: 2 },
        ],
      },
      {
        question: "3. Kendi planlarınız ile bir arkadaşınızın ani ricası çatıştığında:",
        options: [
          { text: "Kendi planımı korurum, başka bir zaman için sözleşirim.", score: 0 },
          { text: "Bazen zorlanarak planımı ertelerim.", score: 1 },
          { text: "Kendi planımı hemen iptal eder, onun işini halletmeye koşarım.", score: 2 },
        ],
      },
      {
        question: "4. Günlük hayatta sırf ortam yumuşasın diye gereksiz yere özür dileme refleksiniz:",
        options: [
          { text: "Yalnızca gerçekten hatalı olduğum durumlarda özür dilerim.", score: 0 },
          { text: "Bazen alışkanlıktan özür dilerim.", score: 1 },
          { text: "Neredeyse varlığım için bile sürekli 'özür dilerim' deme refleksim var.", score: 2 },
        ],
      },
      {
        question: "5. Birisi sınırınızı aştığında veya size kaba davrandığında tepkiniz:",
        options: [
          { text: "Sakin ve net bir dille bu davranışın kabul edilemez olduğunu belirtirim.", score: 0 },
          { text: "Önce susarım ama devam ederse bir noktada patlarım.", score: 1 },
          { text: "Çatışmadan korktuğum için gülümser, içime atar ve durumu sineye çekerim.", score: 2 },
        ],
      },
      {
        question: "6. Bir ortamda herkes bir film veya yemek hakkında hemfikirken sizin farklı bir fikriniz varsa:",
        options: [
          { text: "Kendi fikrimi rahatça söylerim, farklılık doğaldır.", score: 0 },
          { text: "Bazen söyler, bazen susarım.", score: 1 },
          { text: "Uyumsuz görünmemek için çoğunluğa katılır, kendi fikrimi gizlerim.", score: 2 },
        ],
      },
      {
        question: "7. Başkalarının sorunlarını kendi sorununuz gibi üstlenip onları kurtarma dürtüsü:",
        options: [
          { text: "Destek olurum ama onların sorumluluğunu sırtlanmam.", score: 0 },
          { text: "Bazen gereğinden fazla üstlenirim.", score: 1 },
          { text: "Herkesi kurtarmak zorundaymışım gibi hissederim, kurtaramazsam suçluluk duyarım.", score: 2 },
        ],
      },
      {
        question: "8. Bir restoranda siparişiniz yanlış geldiğinde tepkiniz:",
        options: [
          { text: "Nezaketle garsonu çağırıp doğru siparişi isterim.", score: 0 },
          { text: "Biraz çekinerek söylerim.", score: 1 },
          { text: "Garson mahcup olmasın ya da sorun çıkmasın diye sesimi çıkarmaz, yanlış yemeği yerim.", score: 2 },
        ],
      },
      {
        question: "9. 'Eğer sınır koyarsam insanlar beni terk eder ve yalnız kalırım' korkusu:",
        options: [
          { text: "Sınırlarım varken beni seven insanların gerçek dost olduğunu bilirim.", score: 0 },
          { text: "Bazen bu korku beni yoklar.", score: 1 },
          { text: "Hayatımın en büyük kabusudur; herkesi memnun etmek zorundayım.", score: 2 },
        ],
      },
      {
        question: "10. Birisine borç para verdikten sonra gününde geri gelmediğinde isteme durumunuz:",
        options: [
          { text: "Günü geldiğinde rahatça hakkımı isterim.", score: 0 },
          { text: "İstemeye biraz utanırım ama isterim.", score: 1 },
          { text: "Asla isteyemem, sanki ben suçluymuşum gibi ezilir büzülürüm.", score: 2 },
        ],
      },
      {
        question: "11. Başkaları mutlu olduğunda ancak kendinizi güvende ve huzurlu hissetme durumu:",
        options: [
          { text: "Başkalarının ruh hali benim iç huzurumu doğrudan belirlemez.", score: 0 },
          { text: "Bazen etraftakilerin gerginliği beni etkiler.", score: 1 },
          { text: "Evdeki veya ortamdaki bir kişi bile mutsuzsa ben asla rahat nefes alamam.", score: 2 },
        ],
      },
      {
        question: "12. Kendi duygularınızı ifade ettiğinizde 'aşırı büyütüyorsun' denmesinden duyduğunuz korku:",
        options: [
          { text: "Duygularımın geçerli olduğunu bilirim.", score: 0 },
          { text: "Bazen çekinirim.", score: 1 },
          { text: "Bu yüzden tüm kırgınlıklarımı içime atar, kimseye hiçbir şey anlatmam.", score: 2 },
        ],
      },
      {
        question: "13. İnsanlar sizi genellikle nasıl tanımlar?",
        options: [
          { text: "Dürüst, net, saygılı ve ilkeli.", score: 0 },
          { text: "Uyumlu ve yardımsever.", score: 1 },
          { text: "Aşırı fedakar, 'asla hayır diyemeyen', herkesin işine koşan.", score: 2 },
        ],
      },
      {
        question: "14. Birisi size bir hediye aldığında veya büyük bir iyilik yaptığında hissettiğiniz:",
        options: [
          { text: "Mutlu olur ve teşekkür ederim.", score: 0 },
          { text: "Hafif bir borçlu kalma hissi oluşur.", score: 1 },
          { text: "Büyük bir eziklik hisseder, hemen daha büyüğünü yapma zorunluluğu duyarım.", score: 2 },
        ],
      },
      {
        question: "15. Kendi bedensel yorgunluğunuzu hiçe sayıp başkalarına hizmet etme alışkanlığı:",
        options: [
          { text: "Yorulduğumda dinlenirim, sınırlarımı koyarım.", score: 0 },
          { text: "Bazen kendimi zorlarım.", score: 1 },
          { text: "Ateşim olsa bile kalkıp başkalarının ihtiyaçlarını karşılarım.", score: 2 },
        ],
      },
      {
        question: "16. Çatışma ve tartışma çıkmasından duyduğunuz dehşet seviyesi:",
        options: [
          { text: "Çatışma iletişimin doğal parçasıdır, çözüme odaklanırım.", score: 0 },
          { text: "Tartışmaktan hoşlanmam ama gerekirse konuşurum.", score: 1 },
          { text: "Çatışma çıkmasın diye her türlü haksızlığı ve aşağılanmayı kabul ederim.", score: 2 },
        ],
      },
      {
        question: "17. 'Hayır' dedikten sonra karşı tarafın kırıldığını hissettiğinizde:",
        options: [
          { text: "Karşı tarafın duygusunu yönetmek benim sorumluluğum değildir.", score: 0 },
          { text: "Biraz üzülürüm ama geri adım atmam.", score: 1 },
          { text: "Hemen geri vites yapar, 'Tamam tamam yaparım' diyerek teslim olurum.", score: 2 },
        ],
      },
      {
        question: "18. Gerçekten ne istediğinizi ve neyi sevdiğinizi unuttuğunuz hissiyatı:",
        options: [
          { text: "Kendi arzularımı ve zevklerimi çok iyi bilirim.", score: 0 },
          { text: "Bazen başkalarına uymaktan kendi zevkimi ertelerim.", score: 1 },
          { text: "Sürekli başkalarına uyduğum için artık gerçekten ne istediğimi bilmiyorum.", score: 2 },
        ],
      },
      {
        question: "19. Birisi sizden yardım istediğinde 'Benim de şu an dinlenmeye ihtiyacım var' diyebilir misiniz?",
        options: [
          { text: "Çok rahatlıkla söylerim.", score: 0 },
          { text: "Bazen zorlanarak söylerim.", score: 1 },
          { text: "Asla söyleyemem, kendimi bencil bir canavar gibi hissederim.", score: 2 },
        ],
      },
      {
        question: "20. 'İnsanlar beni gerçekten ben olduğum için mi, yoksa işlerine yaradığım için mi seviyor?' şüphesi:",
        options: [
          { text: "Beni koşulsuz seven gerçek dostlarım olduğunu bilirim.", score: 0 },
          { text: "Bazen bu şüphe aklımdan geçer.", score: 1 },
          { text: "Sürekli bu acıyı yaşarım; faydam biterse sevgilerinin de biteceğine inanırım.", score: 2 },
        ],
      },
    ],
    getResult: (answers) => {
      const total = answers.reduce((sum, curr) => sum + (curr.score || 0), 0);
      if (total <= 10) {
        return {
          title: "Sağlam ve Şefkatli Kişisel Sınırlar",
          scoreText: `Puan: ${total} / 40 • Sağlıklı Sınırlar`,
          badge: "Sınır Ustası",
          evaluation: "Kendi sınırlarınızı suçluluk duymadan koruyabiliyor, aynı zamanda başkalarına da saygılı ve samimi bir alan açabiliyorsunuz. Sevginin fedakarlıkla satın alınmayacağını içselleştirmişsiniz.",
          advice: "Bu olgun ve şeffaf sınır bilincinizi ilişkilerinizde sürdürün; sınırlarınız sizin güvenli yuvanızdır.",
          recommendedTherapy: {
            id: "bireysel",
            name: "Bireysel Psikoterapi & İletişim Sanatı",
            matchReason: "Sağlıklı sınır bilincini korumak ve ilişkilerde derin yakınlığı artırmak için uygundur.",
            benefits: ["İletişim ustalığı kazanma", "Duygusal netliği koruma", "Eşit ve besleyici dostluklar sürdürme"],
            duration: "50 Dakika",
            format: "Yüz Yüze veya Çevrimiçi (Online)",
          },
        };
      } else if (total <= 24) {
        return {
          title: "Esnek ama Zorlanan Sınırlar (Farkındalık Eşiği)",
          scoreText: `Puan: ${total} / 40 • Kısmi Onay Bağımlılığı`,
          badge: "Sınır Eğitimi Gerekli",
          evaluation: "Sınır koymanın önemini biliyorsunuz ancak yakın ilişkilerde çatışma çıkmasından ve sevilmemekten çekindiğinizde gereğinden fazla taviz verebiliyorsunuz. Bu durum içinizde bastırılmış bir yorgunluk yaratıyor.",
          advice: "Birisi sınırınızı aştığında bunu ertelemeden o an sakin ve kararlı bir dille ifade edin. 'Hayır' demek bir kavga çağrısı değil, kendinize olan saygınızın sesidir.",
          recommendedTherapy: {
            id: "bdt",
            name: "Bilişsel Davranışçı Terapi (BDT) & Atılganlık Eğitimi",
            matchReason: "Suçluluk hissetmeden 'Hayır' diyebilmeyi ve atılgan (assertive) iletişim becerilerini geliştirmek için en pratik yöntemdir.",
            benefits: ["Reddedilme anksiyetesini yenme", "Suçluluk duymadan sınır çekebilme", "Kişisel haklarını güvenle savunma"],
            duration: "50 Dakika",
            format: "Yüz Yüze veya Çevrimiçi (Online)",
          },
        };
      } else {
        return {
          title: "Kronik Onay Arayıcılığı (People-Pleaser Sendromu)",
          scoreText: `Puan: ${total} / 40 • Yüksek Fedakarlık`,
          badge: "Acil Sınır İnşası",
          evaluation: "Terk edilme ve sevilmeme dehşetiyle başkalarının duygusal bakıcısı rolünü üstlenmiş durumdasınız. Kendi kimliğinizi, arzularınızı ve bedeninizi başkalarını memnun etmek uğruna feda ediyorsunuz. Bu durum derin bir tükenmişlik ve gizli bir öfke üretmektedir.",
          advice: "Kendinize bir nefes alanı açın. Şema terapisi ve bireysel terapi desteğiyle 'Ben ancak başkalarına hizmet edersem sevilirim' inancını kökten dönüştürmelisiniz.",
          recommendedTherapy: {
            id: "sema",
            name: "Şema Terapisi & Boyun Eğicilik Onarımı",
            matchReason: "Çocukluk kökenli fedakarlık, boyun eğicilik ve onay arayıcılığı şemalarını kalıcı olarak dönüştürmek için en etkili klinik yöntemdir.",
            benefits: ["Kronik suçluluk duygusundan özgürleşme", "Kendi gerçek kimliğini ve arzularını keşfetme", "Başkalarını memnun etme esaretinden kurtulma"],
            duration: "50 Dakika",
            format: "Yüz Yüze (Klinik) veya Çevrimiçi (Online)",
          },
        };
      }
    },
  },
];
