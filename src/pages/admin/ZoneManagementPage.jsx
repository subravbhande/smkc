import { DemoDataBanner, PageHeader } from '../../components/ui';
import { DEMO_ZONES } from '../../data/mockData';
import { MapPin, Users, Activity } from 'lucide-react';
import MapModule from '../../components/MapModule';

export default function ZoneManagementPage() {
  return (
    <div className="p-6 animate-fade-in">
      <DemoDataBanner />
      <PageHeader title="Zone / Ward Management" subtitle="SMKC administrative zones · Demo Data" />

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {DEMO_ZONES.map((zone) => (
          <div key={zone.id} className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <MapPin size={20} className="text-blue-700" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{zone.name}</h3>
                <p className="text-xs text-slate-400">Zone</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ['Zone Officer', zone.officer],
                ['Active Cases', zone.activeCases],
                ['Closed Cases', zone.closedCases],
                ['Area', zone.area],
                ['Population (est.)', zone.population],
                ['Wards', zone.wards.join(', ')],
              ].map(([k,v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-semibold text-slate-800 text-right max-w-36 truncate" title={String(v)}>{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn btn-outline btn-sm flex-1 justify-center text-xs">Edit Zone</button>
              <button className="btn btn-secondary btn-sm flex-1 justify-center text-xs">View Cases</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Zone Map View</h3>
          <p className="text-xs text-slate-400 mt-0.5">Hotspot circles show zone boundaries (approximate)</p>
        </div>
        <div style={{ height: 400 }}>
          <MapModule height="400px" showControls={true} />
        </div>
      </div>
    </div>
  );
}
