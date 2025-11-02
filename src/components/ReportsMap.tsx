import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

export function ReportsMap() {
  const reports = useQuery(api.analytics.getReportsByLocation) || [];

  const defaultCenter: [number, number] = reports.length > 0 && reports[0].location
    ? [reports[0].location.lat, reports[0].location.lng]
    : [40.7128, -74.0060];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Reports Map</h3>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-white/70">Critical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-white/70">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white/70">Low</span>
          </div>
        </div>
      </div>

      <div className="relative h-72 rounded-lg overflow-hidden">
        <MapContainer center={defaultCenter} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {reports.map((report: any) => {
            const lat = report.location?.lat ?? defaultCenter[0];
            const lng = report.location?.lng ?? defaultCenter[1];
            const color = report.priority === 'critical' ? '#ef4444' : report.priority === 'medium' ? '#f59e0b' : report.priority === 'green' ? '#10b981' : '#f97316';
            return (
              <CircleMarker
                key={report.id}
                center={[lat, lng]}
                radius={8}
                pathOptions={{ color: color, fillColor: color, fillOpacity: 0.9 }}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{report.title}</strong>
                    <div className="text-xs text-slate-700">{report.status}</div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      <div className="mt-4 text-center">
        <p className="text-white/60 text-sm">
          Interactive map showing {reports.length || 0} active reports across the city
        </p>
      </div>
    </div>
  );
}
