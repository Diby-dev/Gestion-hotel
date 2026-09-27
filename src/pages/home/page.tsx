import Hero from '../../components/Hero';
import Stat from '../../components/Stat';
import CommuneSearch from '../../components/CommuneSearch';
import SidebarreZonne from '../../components/SidebarreZonne';
import PourquoiNous from '../../components/PourquoiNous';
import Avis from '../../components/Avis';
import Partennaire from '../../components/Patennaire';

export default function HomePage() {
  return (
    <main className="grow">
      <Hero />
      <Stat />
      <CommuneSearch />
      <SidebarreZonne />
      <PourquoiNous />
      <Avis />
      <Partennaire />
    </main>
  );
}
