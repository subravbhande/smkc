import { PageHeader } from '../components/ui';
import MapModule from '../components/MapModule';

export default function MapPage({ title = 'GIS Map' }) {
  return (
    <div className="p-6 animate-fade-in">
      <PageHeader title={title} subtitle="Live case locations · OpenStreetMap · Demo Data" />
      <div className="card overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
        <MapModule height="100%" showControls={true} />
      </div>
    </div>
  );
}
