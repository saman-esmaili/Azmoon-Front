import {AboutHero} from './../components/about/hero'
import {Stats} from './../components/about/stats'
import {Values} from './../components/about/values'
import {Mission} from './../components/about/mission'
import {Timeline} from './../components/about/timeline'
import {CTA} from './../components/about/CTA'
import {Team} from './../components/about/team'
import "./../styles/about_page.css";

const AboutPage: React.FC = () => (
  <div className="about-page">
    <AboutHero />
    <Stats />
    <Mission />
    <Timeline />
    <Team />
    <Values />
    <CTA />
  </div>
);

export default AboutPage;
