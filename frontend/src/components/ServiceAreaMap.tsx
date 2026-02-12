import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

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

const RecenterMap: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const ServiceAreaMap: React.FC<ServiceAreaMapProps> = ({
  latitude,
  longitude,
  radiusKm,
  onLocationChange,
  onRadiusChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const hasPin = latitude !== null && longitude !== null;
  const center: [number, number] = hasPin ? [latitude!, longitude!] : [-25.274398, 133.775136];
  const zoom = hasPin ? 12 : 4;

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.trim())}&limit=1`,
        { headers: { 'User-Agent': 'ForeverFlower/1.0' } }
      );
      const results = await response.json();
      if (results.length > 0) {
        const { lat, lon } = results[0];
        onLocationChange(parseFloat(lat), parseFloat(lon));
      }
    } catch {
      // silently fail
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">Service Area</label>

      {/* Address search */}
      <div className="flex gap-2">
        <Input
          placeholder="Search for an address or suburb..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button type="button" variant="outline" onClick={handleSearch} disabled={isSearching}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Map */}
      <div className="h-[300px] rounded-lg overflow-hidden border">
        <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler onClick={onLocationChange} />
          {hasPin && (
            <>
              <RecenterMap center={[latitude!, longitude!]} />
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
        <p className="text-sm text-muted-foreground">Click on the map or search for an address to set your location.</p>
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
          max={50}
          step={1}
          onValueChange={(value) => onRadiusChange(value[0])}
        />
      </div>
    </div>
  );
};

export default ServiceAreaMap;
