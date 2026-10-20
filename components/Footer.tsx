import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link href="/" className="logo text-white">
            PsikoWay
          </Link>
          <p className="footer-desc">
            Bireysel ve ilişkisel zihinsel sağlığınızda bilimsel temelli, etik ve şeffaf psikoterapi yaklaşımlarıyla yanınızdayız.
          </p>
          <div className="footer-contact-mini">
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={16} />
              Kahramanmaraş, Türkiye
            </span>
            <a 
              href="tel:+905523283646" 
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "inherit", textDecoration: "none" }}
            >
              <Phone size={16} />
              +90 552 328 36 46
            </a>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <Mail size={16} />
              psikowayresmi@gmail.com
            </span>
          </div>
        </div>

        <div className="footer-nav-col">
          <h4>Hizmet Alanları</h4>
          <Link href="/hizmetler">Bireysel Psikoterapi</Link>
          <Link href="/hizmetler">Bilişsel Davranışçı Terapi</Link>
          <Link href="/hizmetler">Çift ve Aile Terapisi</Link>
          <Link href="/hizmetler">EMDR & Travma Terapisi</Link>
          <Link href="/hizmetler">Online Psikoterapi</Link>
        </div>

        <div className="footer-nav-col">
          <h4>Keşfet & Değerlendir</h4>
          <Link href="/forum">Topluluk & Forum</Link>
          <Link href="/analizler">Karakter & Vaka Analizleri</Link>
          <Link href="/analizler">İçgörü Yazıları</Link>
          <Link href="/testler">Kokoloji Testi</Link>
          <Link href="/testler">Anksiyete Ölçeği</Link>
          <Link href="/testler">Bağlanma Stili Testi</Link>
        </div>

        <div className="footer-nav-col">
          <h4>İletişim & Randevu</h4>
          <Link href="/iletisim">Seans Randevusu Al</Link>
          <Link href="/iletisim#harita">Klinik Konumu</Link>
          <Link href="/iletisim#sss">Sıkça Sorulan Sorular</Link>
          <Link href="/auth">Danışan Girişi</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-info">
          <p>© 2026 PsikoWay Psikolojik Danışmanlık ve Terapi Merkezi. Tüm hakları saklıdır.</p>
          <div className="footer-legal">
            <Link href="#">Gizlilik Politikası</Link>
            <Link href="#">Kullanım Koşulları</Link>
            <Link href="#">Aydınlatma Metni</Link>
          </div>
        </div>

        <div className="footer-developer-section">
          <span className="footer-developer-title">Geliştirildi</span>
          <div className="footer-developer-logo-box" title="BU Studio">
            <Image
              src="/bu-studio.png"
              alt="BU Studio"
              width={130}
              height={124}
              className="footer-developer-img"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
