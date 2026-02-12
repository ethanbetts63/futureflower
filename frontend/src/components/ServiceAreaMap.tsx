import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Slider } from '@/components/ui/slider';

// Fix default marker icon issue with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface ServiceAreaMapProps {
  latitude: number | null;
  longitude: number | null;
  radiusKm: number;
  onLocationChange: (lat: number, lng: number) => void;
  onRadiusChange: (radius: number) => void;
}

const DraggableMarker: React.FC<{
  position: [number, number];
  onDragEnd: (lat: number, lng: number) => void;
}> = ({ position, onDragEnd }) => {
  const markerRef = useRef<L.Marker>(null);

  return (
    <Marker
      position={position}
      draggable
      ref={markerRef}
      eventHandlers={{
        dragend: () => {
          const marker = markerRef.current;
          if (marker) {
            const { lat, lng } = marker.getLatLng();
            onDragEnd(lat, lng);
          }
        },
      }}
    />
  );
};

const MapClickHandler: React.FC<{
  onClick: (lat: number, lng: number) => void;
}> = ({ onClick }) => {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const FitToRadius: React.FC<{ center: [number, number]; radiusKm: number }> = ({ center, radiusKm }) => {
  const map = useMap();
  useEffect(() => {
    // ~0.009 degrees latitude per km; longitude adjusted by cos(lat)
    const latOffset = (radiusKm / 111) * 2;
    const lngOffset = (radiusKm / (111 * Math.cos((center[0] * Math.PI) / 180))) * 2;
    const bounds: L.LatLngBoundsExpression = [
      [center[0] - latOffset, center[1] - lngOffset],
      [center[0] + latOffset, center[1] + lngOffset],
    ];
    map.flyToBounds(bounds, { duration: 1.5 });
  }, [center, radiusKm, map]);
  return null;
};

const ServiceAreaMap: React.FC<ServiceAreaMapProps> = ({
  latitude,
  longitude,
  radiusKm,
  onLocationChange,
  onRadiusChange,
}) => {
  const hasPin = latitude !== null && longitude !== null;

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">Service Area</label>
      <div className="h-[300px] rounded-lg overflow-hidden border">
        <MapContainer center={[20, 0]} zoom={1} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler onClick={onLocationChange} />
          {hasPin && (
            <>
              <FitToRadius center={[latitude!, longitude!]} radiusKm={radiusKm} />
              <DraggableMarker
                position={[latitude!, longitude!]}
                onDragEnd={onLocationChange}
              />
              <Circle
                center={[latitude!, longitude!]}
                radius={radiusKm * 1000}
                pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1 }}
              />
            </>
          )}
        </MapContainer>
      </div>

      {!hasPin && (
        <p className="text-sm text-muted-foreground">Click on the map to set your location, then drag to adjust.</p>
      )}

      {/* Radius slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Delivery Radius</label>
          <span className="text-sm text-muted-foreground">{radiusKm} km</span>
        </div>
        <Slider
          value={[radiusKm]}
          min={1}
          max={250}
          step={1}
          onValueChange={(value) => onRadiusChange(value[0])}
        />
      </div>
    </div>
  );
};

export default ServiceAreaMap;
