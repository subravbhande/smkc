import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { useCasesStore } from '../store/store';
import { StatusBadge, PriorityBadge } from './ui';
import { fmtDate } from '../utils/helpers';
import { Filter, Layers, Download, Navigation } from 'lucide-react';

// Fix Leaflet default marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Color-coded markers by priority
function createMarker(priority, status) {
  const colors = {
    'Critical': '#dc2626',
    'High': '#ea580c',
    'Medium': '#ca8a04',
    'Low': '#16a34a',
  };
  const specialColors = {
    'Closed': '#64748b',
    'Under Review': '#3b82f6',
    'Encroachment': '#7c3aed',
  };
  const color = status === 'Closed' ? specialColors['Closed'] :
    status === 'Under Review' ? specialColors['Under Review'] :
      colors[priority] || '#1d4ed8';

  return L.divIcon({
    html: `<div style="
      width:28px;height:28px;border-radius:50% 50% 50% 0;
      background:${color};
      border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      transform:rotate(-45deg);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    className: '',
  });
}

function MapLegend() {
  const items = [
    { color: '#dc2626', label: 'Critical Priority' },
    { color: '#ea580c', label: 'High Priority' },
    { color: '#ca8a04', label: 'Medium Priority' },
    { color: '#16a34a', label: 'Low / Resolved' },
    { color: '#3b82f6', label: 'Under Review' },
    { color: '#64748b', label: 'Closed' },
  ];
  return (
    <div className="absolute bottom-6 left-4 z-[999] bg-white rounded-xl shadow-lg p-4 border border-slate-200">
      <div className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wide">Map Legend</div>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 mb-1.5">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
          <span className="text-xs text-slate-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function MapModule({ height = '600px', showControls = true, filterStatus = null }) {
  const { cases } = useCasesStore();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ type: '', status: filterStatus || '', priority: '', showClosed: true });
  const [showFilters, setShowFilters] = useState(false);

  const filteredCases = cases.filter((c) => {
    if (!filters.showClosed && c.status === 'Closed') return false;
    if (filters.type && c.type !== filters.type) return false;
    if (filters.status && c.status !== filters.status) return false;
    if (filters.priority && c.priority !== filters.priority) return false;
    return true;
  });

  // Center on SMKC region
  const center = [16.845, 74.605];

  return (
    <div className="relative" style={{ height }}>
      {/* Controls overlay */}
      {showControls && (
        <div className="absolute top-4 right-4 z-[999] flex flex-col gap-2">
          <button onClick={() => setShowFilters(!showFilters)}
            className="btn btn-sm bg-white shadow-lg border border-slate-200">
            <Filter size={14} /> Filters
          </button>
          {showFilters && (
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-56">
              <div className="text-xs font-bold text-slate-600 mb-3">Filter Cases</div>
              <div className="space-y-3">
                <div>
                  <label className="form-label text-xs">Type</label>
                  <select className="form-input text-xs py-1.5" value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
                    <option value="">All Types</option>
                    <option>Illegal Hoarding</option>
                    <option>Encroachment</option>
                    <option>Unauthorized Advertisement</option>
                  </select>
                </div>
                <div>
                  <label className="form-label text-xs">Status</label>
                  <select className="form-input text-xs py-1.5" value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
                    <option value="">All Statuses</option>
                    <option>New</option>
                    <option>Under Review</option>
                    <option>Field Verification</option>
                    <option>Verified</option>
                    <option>Notice Issued</option>
                    <option>Action Ordered</option>
                    <option>Closed</option>
                  </select>
                </div>
                <div>
                  <label className="form-label text-xs">Priority</label>
                  <select className="form-input text-xs py-1.5" value={filters.priority} onChange={e => setFilters({...filters, priority: e.target.value})}>
                    <option value="">All Priorities</option>
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filters.showClosed} onChange={e => setFilters({...filters, showClosed: e.target.checked})} />
                  <span className="text-xs text-slate-600">Show Closed Cases</span>
                </label>
                <button className="btn btn-secondary btn-sm w-full justify-center text-xs"
                  onClick={() => setFilters({ type: '', status: filterStatus || '', priority: '', showClosed: true })}>
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Hotspot circles */}
        <Circle center={[16.8524, 74.5815]} radius={1500} pathOptions={{ color: '#dc2626', fillColor: '#dc2626', fillOpacity: 0.05, weight: 1, dashArray: '5,5' }} />
        <Circle center={[16.8277, 74.6502]} radius={1000} pathOptions={{ color: '#ea580c', fillColor: '#ea580c', fillOpacity: 0.05, weight: 1, dashArray: '5,5' }} />

        {filteredCases.map((c) => (
          <Marker
            key={c.id}
            position={[c.lat, c.lng]}
            icon={createMarker(c.priority, c.status)}
          >
            <Popup maxWidth={280}>
              <div className="p-3 min-w-[240px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-blue-700">{c.id}</span>
                  <StatusBadge status={c.status} />
                </div>
                <div className="font-semibold text-slate-800 text-sm mb-1">{c.type}</div>
                <div className="text-slate-500 text-xs mb-2">📍 {c.location}</div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <PriorityBadge priority={c.priority} />
                  <span className="text-slate-400">{fmtDate(c.reportedAt)}</span>
                </div>
                {c.aiConfidence > 0 && (
                  <div className="text-xs text-purple-700 mb-3 font-medium">🤖 AI Confidence: {c.aiConfidence}%</div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/cases/${c.id}`)}
                    className="btn btn-primary btn-sm flex-1 justify-center text-xs"
                  >
                    View Case
                  </button>
                  <a href={`https://www.openstreetmap.org/?mlat=${c.lat}&mlon=${c.lng}&zoom=17`}
                    target="_blank" rel="noreferrer"
                    className="btn btn-secondary btn-sm px-2">
                    <Navigation size={12} />
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <MapLegend />
      <div className="absolute bottom-6 right-4 z-[999] bg-white rounded-lg shadow-lg px-3 py-2 text-xs text-slate-600 border border-slate-200">
        <strong>{filteredCases.length}</strong> cases shown
      </div>
    </div>
  );
}
