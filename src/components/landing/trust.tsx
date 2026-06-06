
// ─── Trust ────────────────────────────────────────────────────────────────────
import './../../styles/azmon_landing.css'

export const TrustSection: React.FC = () => {
  const orgs: string[] = ["دانشگاه تهران","دانشگاه شریف","دانشگاه امیرکبیر","دانشگاه علم و صنعت","دانشگاه اصفهان","دانشگاه شیراز"];
  return (
    <section className='trust-section'>
      <div className='trust-inner'>
        <p className='trust-label'>مورد اعتماد بیش از ۵۰۰ موسسه آموزشی در ایران</p>
        <div className='trust-logos'>
          {orgs.map((o) => (
            <span key={o} className='trust-logo'>{o}</span>
          ))}
        </div>
      </div>
    </section>
  );
};