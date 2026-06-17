import {Hero} from './../components/landing/hero';
import {TrustSection} from './../components/landing/trust';
import {Features} from './../components/landing/features';
import {HowItWorks} from './../components/landing/how-work';
import {Pricing} from './../components/landing/pricing';
import {Testimonials} from './../components/landing/testimonial';
import {FAQ} from './../components/landing/FAQ';
import {CTA} from './../components/landing/CTA';
// ─── App ──────────────────────────────────────────────────────────────────────
const AzmoonPage: React.FC = () => (
  <div style={{ fontFamily:"'Segoe UI',Tahoma,sans-serif", minHeight:"100vh" }}>
    <style>{`
      @keyframes blobFloat { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-18px) scale(1.04);} }
      @keyframes cardFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
      @keyframes ping { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.5;transform:scale(1.4);} }
      * { box-sizing:border-box; margin:0; padding:0; }
      html { scroll-behavior:smooth; }
      ::placeholder { color:#A8A29E !important; }
    `}</style>
    <Hero />
    {/*<TrustSection />*/}
    <Features />
    <HowItWorks />
    <Pricing />
    <Testimonials />
    <FAQ />
    <CTA />
  </div>
);

export default AzmoonPage;
