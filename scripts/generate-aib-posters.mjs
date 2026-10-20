import sharp from "sharp";
import fs from "fs";
import path from "path";

// 1. Dizi Afişi (580x820)
async function generateSeriesCover() {
  const width = 580;
  const height = 820;

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0a0714" />
      <stop offset="40%" stop-color="#180b18" />
      <stop offset="75%" stop-color="#0d040a" />
      <stop offset="100%" stop-color="#030104" />
    </linearGradient>
    <radialGradient id="laser" cx="50%" cy="15%" r="65%">
      <stop offset="0%" stop-color="#ff1a40" stop-opacity="0.65" />
      <stop offset="35%" stop-color="#ff0033" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff0d4" />
      <stop offset="50%" stop-color="#e0b878" />
      <stop offset="100%" stop-color="#b88636" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)" />
  <rect width="${width}" height="${height}" fill="url(#laser)" />

  <!-- Laser Beam from Sky -->
  <line x1="290" y1="0" x2="290" y2="430" stroke="#ff1a40" stroke-width="5" opacity="0.95" filter="url(#glow)" />
  <line x1="290" y1="0" x2="290" y2="430" stroke="#ffffff" stroke-width="2" opacity="0.9" />

  <!-- Shibuya Crossing Grid Lines -->
  <g stroke="#ff1a40" stroke-width="1" opacity="0.2">
    <line x1="0" y1="620" x2="580" y2="620" />
    <line x1="0" y1="680" x2="580" y2="680" />
    <line x1="0" y1="740" x2="580" y2="740" />
    <line x1="290" y1="430" x2="40" y2="820" stroke-width="1.4" />
    <line x1="290" y1="430" x2="180" y2="820" />
    <line x1="290" y1="430" x2="290" y2="820" stroke-width="1.8" />
    <line x1="290" y1="430" x2="400" y2="820" />
    <line x1="290" y1="430" x2="540" y2="820" stroke-width="1.4" />
  </g>

  <!-- Big Neon Card Suits in Sky -->
  <g font-family="system-ui, sans-serif" font-size="75" font-weight="900" text-anchor="middle" opacity="0.25">
    <text x="145" y="340" fill="#ff1a40">♠</text>
    <text x="240" y="315" fill="#ff1a40">♥</text>
    <text x="340" y="315" fill="#ff1a40">♦</text>
    <text x="435" y="340" fill="#ff1a40">♣</text>
  </g>

  <!-- Glowing Central Joker Card -->
  <rect x="235" y="185" width="110" height="165" rx="12" fill="#0d0814" stroke="#e0b878" stroke-width="2.5" filter="url(#glow)" />
  <rect x="242" y="192" width="96" height="151" rx="8" fill="none" stroke="rgba(224,184,120,0.3)" stroke-width="1" />
  <text x="290" y="265" font-family="system-ui, sans-serif" font-size="50" font-weight="bold" fill="#ff1a40" text-anchor="middle">♥</text>
  <text x="290" y="315" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="4">JOKER</text>

  <!-- Top Netflix Badge -->
  <rect x="180" y="45" width="220" height="32" rx="16" fill="rgba(255,26,64,0.18)" stroke="#ff1a40" stroke-width="1.2" />
  <text x="290" y="66" font-family="system-ui, sans-serif" font-size="11.5" font-weight="800" fill="#ff8095" text-anchor="middle" letter-spacing="3">NETFLIX ORİJİNAL DİZİSİ</text>

  <!-- Japanese Kanji Subtitle -->
  <text x="290" y="475" font-family="serif" font-size="16" font-weight="600" fill="#e0b878" text-anchor="middle" letter-spacing="8">今際の国のアリス</text>

  <!-- Series Title -->
  <text x="290" y="525" font-family="system-ui, sans-serif" font-size="36" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="3">ALICE IN</text>
  <text x="290" y="572" font-family="system-ui, sans-serif" font-size="38" font-weight="900" fill="url(#gold)" text-anchor="middle" letter-spacing="6">BORDERLAND</text>

  <!-- Accent Divider -->
  <rect x="200" y="595" width="180" height="3" fill="#ff1a40" rx="1.5" filter="url(#glow)" />

  <text x="290" y="632" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="rgba(255,255,255,0.85)" text-anchor="middle">16 Karakterin Tam Psikolojik &amp; Klinik Dosyası</text>

  <!-- Card Category Badges -->
  <g font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">
    <rect x="65" y="665" width="105" height="30" rx="8" fill="rgba(224,184,120,0.14)" stroke="rgba(224,184,120,0.4)" stroke-width="1" />
    <text x="117" y="684" fill="#fce7c8">♠ MAÇA</text>

    <rect x="180" y="665" width="105" height="30" rx="8" fill="rgba(255,26,64,0.18)" stroke="rgba(255,26,64,0.5)" stroke-width="1" />
    <text x="232" y="684" fill="#ff8095">♥ KUPA</text>

    <rect x="295" y="665" width="105" height="30" rx="8" fill="rgba(224,184,120,0.14)" stroke="rgba(224,184,120,0.4)" stroke-width="1" />
    <text x="347" y="684" fill="#fce7c8">♦ KARO</text>

    <rect x="410" y="665" width="105" height="30" rx="8" fill="rgba(0,230,168,0.14)" stroke="rgba(0,230,168,0.4)" stroke-width="1" />
    <text x="462" y="684" fill="#a7f3d0">♣ SİNEK</text>
  </g>

  <!-- Bottom Details -->
  <text x="290" y="735" font-family="system-ui, sans-serif" font-size="12" font-weight="500" fill="rgba(255,255,255,0.6)" text-anchor="middle">Varoluşsal Nihilizm • Survivor Guilt • Travma Sonrası Büyüme</text>
  <text x="290" y="785" font-family="system-ui, sans-serif" font-size="10.5" font-weight="700" fill="rgba(224,184,120,0.65)" text-anchor="middle" letter-spacing="3">PSİKOWAY KLİNİK ANALİZ ARŞİVİ</text>
</svg>
`;

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 92 })
    .toFile("public/series/alice-in-borderland.jpg");
  console.log("Created public/series/alice-in-borderland.jpg");
}

// 2. Karakter Portre Afişleri (500x700)
const CHARACTERS = [
  {
    id: "ryohei-arisu",
    name: "Ryohei Arisu",
    kanji: "有栖 良平",
    actor: "Kento Yamazaki",
    role: "ANA KARAKTER",
    suit: "♥",
    cardNum: "7♥",
    color: "#ff2a4b",
    secondaryColor: "#e0b878",
    badge: "Hayatta Kalan Suçluluğu",
    archetype: "İsteksiz Vizyoner",
  },
  {
    id: "yuzuha-usagi",
    name: "Yuzuha Usagi",
    kanji: "宇佐己 柚葉",
    actor: "Tao Tsuchiya",
    role: "ANA KARAKTER",
    suit: "♠",
    cardNum: "Q♠",
    color: "#00e6a8",
    secondaryColor: "#38bdf8",
    badge: "Kompleks TSSB & Güvensizlik",
    archetype: "Yalnız Dağcı & Savaşçı",
  },
  {
    id: "shuntaro-chishiya",
    name: "Shuntaro Chishiya",
    kanji: "苣屋 駿太郎",
    actor: "Nijiro Murakami",
    role: "KİLİT KARAKTER",
    suit: "♦",
    cardNum: "K♦",
    color: "#ffb800",
    secondaryColor: "#ffffff",
    badge: "Oyun Teorisi Nihilizmi",
    archetype: "Soğuk Akıl & Beyaz Tavşan",
  },
  {
    id: "hikari-kuina",
    name: "Hikari Kuina",
    kanji: "水鶏 光",
    actor: "Aya Asahina",
    role: "KİLİT KARAKTER",
    suit: "♠",
    cardNum: "10♠",
    color: "#e024c3",
    secondaryColor: "#ff70a6",
    badge: "Kimlik Özgürleşmesi",
    archetype: "Dönüşen Anka",
  },
  {
    id: "suguru-niragi",
    name: "Suguru Niragi",
    kanji: "韮木 傑",
    actor: "Dori Sakurada",
    role: "BAŞ KÖTÜ / YAN KARAKTER",
    suit: "♣",
    cardNum: "8♣",
    color: "#ff5500",
    secondaryColor: "#ff0033",
    badge: "Malign Sadizm",
    archetype: "Yaralı Canavar",
  },
  {
    id: "ann-rizuna",
    name: "Ann Rizuna",
    kanji: "安 梨鶴",
    actor: "Ayaka Miyoshi",
    role: "KİLİT KARAKTER",
    suit: "♦",
    cardNum: "Q♦",
    color: "#00b4d8",
    secondaryColor: "#90e0ef",
    badge: "Adli Mantık & Rasyonalite",
    archetype: "Soğukkanlı Bilimci",
  },
  {
    id: "mira-kano",
    name: "Mira Kano",
    kanji: "加納 未来",
    actor: "Riisa Naka",
    role: "KUPA KRALİÇESİ",
    suit: "♥",
    cardNum: "Q♥",
    color: "#d90429",
    secondaryColor: "#ffd166",
    badge: "Patolojik Gaslighting",
    archetype: "Karanlık Zihin Kuklacısı",
  },
  {
    id: "takeru-danma-hatter",
    name: "Takeru Danma (Hatter)",
    kanji: "弾間 剛",
    actor: "Nobuaki Kaneko",
    role: "BEACH LİDERİ",
    suit: "♥",
    cardNum: "10♥",
    color: "#ffd60a",
    secondaryColor: "#f77f00",
    badge: "Megalomanik Kült Lideri",
    archetype: "Çılgın Şapkacı",
  },
  {
    id: "morizono-aguni",
    name: "Morizono Aguni",
    kanji: "粟国 杜園",
    actor: "Sho Aoyagi",
    role: "KİLİT YAN KARAKTER",
    suit: "♠",
    cardNum: "K♠",
    color: "#778da9",
    secondaryColor: "#ff4d6d",
    badge: "Travmatik Yas & Suçluluk",
    archetype: "Trajik Muhafız",
  },
  {
    id: "daikichi-karube",
    name: "Daikichi Karube",
    kanji: "苅部 大吉",
    actor: "Keita Machida",
    role: "KİLİT YAN KARAKTER",
    suit: "♥",
    cardNum: "7♥",
    color: "#f77f00",
    secondaryColor: "#ff0054",
    badge: "Özgecil Sadakat",
    archetype: "Sadık Koruyucu",
  },
  {
    id: "chota-segawa",
    name: "Chota Segawa",
    kanji: "勢川 張太",
    actor: "Yuki Morinaga",
    role: "YAN KARAKTER",
    suit: "♥",
    cardNum: "7♥",
    color: "#9d4edd",
    secondaryColor: "#c77dff",
    badge: "Kurbanın Aşkınlığı",
    archetype: "Kırılgan Masum",
  },
  {
    id: "ginji-kyuma",
    name: "Ginji Kyuma",
    kanji: "久間 欣治",
    actor: "Tomohisa Yamashita",
    role: "SİNEK KRALI",
    suit: "♣",
    cardNum: "K♣",
    color: "#ff7b00",
    secondaryColor: "#ffe6a7",
    badge: "Radikal Otantiklik",
    archetype: "Özgür Dionisos",
  },
  {
    id: "keiichi-kuzuryu",
    name: "Keiichi Kuzuryu",
    kanji: "九頭龍 慧一",
    actor: "Tsuyoshi Abe",
    role: "KARO KRALI",
    suit: "♦",
    cardNum: "K♦",
    color: "#06d6a0",
    secondaryColor: "#118ab2",
    badge: "Radikal Eşitlikçilik",
    archetype: "Adil Yargıç",
  },
  {
    id: "akane-heiya",
    name: "Akane Heiya",
    kanji: "塀谷 朱音",
    actor: "Yuri Tsunematsu",
    role: "KİLİT YAN KARAKTER",
    suit: "♠",
    cardNum: "7♠",
    color: "#ff007f",
    secondaryColor: "#ff758f",
    badge: "Travma Sonrası Direnç",
    archetype: "Yaralı Amazon",
  },
  {
    id: "takatora-samura-last-boss",
    name: "Takatora Samura",
    kanji: "佐村 隆寅",
    actor: "Shuntaro Yanagi",
    role: "YAN KARAKTER",
    suit: "♠",
    cardNum: "Last Boss",
    color: "#c1121f",
    secondaryColor: "#780000",
    badge: "Hikikomori Yabancılaşması",
    archetype: "Gölge Ronin",
  },
  {
    id: "kodai-tatta",
    name: "Kodai Tatta",
    kanji: "竜田 康大",
    actor: "Yutaro Watanabe",
    role: "YAN KARAKTER",
    suit: "♣",
    cardNum: "4♣",
    color: "#e9c46a",
    secondaryColor: "#f4a261",
    badge: "Sessiz Kahramanlık",
    archetype: "Sadık Çırak",
  },
];

async function generateCharacterPosters() {
  const width = 500;
  const height = 700;

  const esc = (str) => String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  for (const c of CHARACTERS) {
    const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0a0812" />
      <stop offset="45%" stop-color="#150a18" />
      <stop offset="80%" stop-color="#0b030b" />
      <stop offset="100%" stop-color="#030104" />
    </linearGradient>
    <radialGradient id="charGlow" cx="50%" cy="30%" r="55%">
      <stop offset="0%" stop-color="${c.color}" stop-opacity="0.45" />
      <stop offset="50%" stop-color="${c.color}" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="textGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="60%" stop-color="#fce7c8" />
      <stop offset="100%" stop-color="${c.secondaryColor}" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)" />
  <rect width="${width}" height="${height}" fill="url(#charGlow)" />

  <!-- Background Laser / Geometric Accents -->
  <g stroke="${c.color}" stroke-width="0.8" opacity="0.25">
    <circle cx="250" cy="240" r="140" fill="none" stroke-dasharray="4,6" />
    <circle cx="250" cy="240" r="180" fill="none" opacity="0.5" />
    <line x1="250" y1="30" x2="250" y2="450" stroke-dasharray="6,4" />
    <line x1="50" y1="240" x2="450" y2="240" stroke-dasharray="6,4" />
  </g>

  <!-- Big Watermark Playing Card Symbol -->
  <text x="250" y="320" font-family="system-ui, sans-serif" font-size="200" font-weight="900" fill="${c.color}" opacity="0.12" text-anchor="middle">${esc(c.suit)}</text>

  <!-- Central Card Frame Silhouette -->
  <rect x="180" y="120" width="140" height="210" rx="14" fill="#0d0716" stroke="${c.color}" stroke-width="2" filter="url(#glow)" />
  <rect x="188" y="128" width="124" height="194" rx="10" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
  
  <!-- Card Corner Markers -->
  <text x="198" y="152" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="${c.color}">${esc(c.suit)}</text>
  <text x="302" y="312" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="${c.color}" text-anchor="end">${esc(c.suit)}</text>

  <!-- Main Card Emblem inside Card Frame -->
  <text x="250" y="220" font-family="system-ui, sans-serif" font-size="52" font-weight="900" fill="${c.color}" text-anchor="middle" filter="url(#glow)">${esc(c.suit)}</text>
  <text x="250" y="270" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="3">${esc(c.cardNum)}</text>

  <!-- Top Series Tag -->
  <rect x="140" y="35" width="220" height="26" rx="13" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
  <text x="250" y="52" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#e0b878" text-anchor="middle" letter-spacing="3">ALICE IN BORDERLAND</text>

  <!-- Japanese Kanji -->
  <text x="250" y="405" font-family="serif" font-size="20" font-weight="700" fill="${c.color}" text-anchor="middle" letter-spacing="6" opacity="0.9">${esc(c.kanji)}</text>

  <!-- Character Name -->
  <text x="250" y="445" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="url(#textGold)" text-anchor="middle" letter-spacing="1">${esc(c.name.toUpperCase())}</text>

  <!-- Actor Name -->
  <text x="250" y="475" font-family="system-ui, sans-serif" font-size="13.5" font-weight="600" fill="rgba(255,255,255,0.7)" text-anchor="middle">Canlandıran: ${esc(c.actor)}</text>

  <!-- Role Badge -->
  <rect x="140" y="500" width="220" height="28" rx="14" fill="${c.color}22" stroke="${c.color}66" stroke-width="1.2" />
  <text x="250" y="518" font-family="system-ui, sans-serif" font-size="11" font-weight="800" fill="${c.color}" text-anchor="middle" letter-spacing="2">${esc(c.role)}</text>

  <!-- Clinical Badge Box -->
  <rect x="40" y="550" width="420" height="52" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
  <text x="250" y="572" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">${esc(c.badge)}</text>
  <text x="250" y="591" font-family="system-ui, sans-serif" font-size="11" font-weight="500" fill="rgba(224,184,120,0.85)" text-anchor="middle">Arketip: ${esc(c.archetype)}</text>

  <!-- Bottom PsikoWay Mark -->
  <text x="250" y="660" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="rgba(255,255,255,0.35)" text-anchor="middle" letter-spacing="3">PSİKOWAY KLİNİK KARAKTER DOSYASI</text>
</svg>
`;

    const outPath = `public/characters/${c.id}.jpg`;
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 90 })
      .toFile(outPath);
    console.log(`Created ${outPath}`);
  }
}

async function main() {
  console.log("Generating Alice in Borderland series cover and 16 character posters...");
  await generateSeriesCover();
  await generateCharacterPosters();
  console.log("All posters successfully generated!");
}

main().catch(console.error);
