import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import type { ServiceAreaInput as ServiceAreaInputType } from '@/types';

interface ServiceAreaInputProps {
  areas: ServiceAreaInputType[];
  onChange: (areas: ServiceAreaInputType[]) => void;
}

const ServiceAreaInput: React.FC<ServiceAreaInputProps> = ({ areas, onChange }) => {
  const [suburb, setSuburb] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('');

  const handleAdd = () => {
    if (!suburb.trim() || !city.trim() || !country.trim()) return;

    onChange([
      ...areas,
      { suburb: suburb.trim(), city: city.trim(), state: state.trim(), postcode: postcode.trim(), country: country.trim() },
    ]);
    setSuburb('');
    setCity('');
    setState('');
    setPostcode('');
    setCountry('');
  };

  const handleRemove = (index: number) => {
    onChange(areas.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Service Areas</label>

      {areas.map((area, i) => (
        <div key={i} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
          <span className="flex-grow">{area.suburb}, {area.city}, {area.country}</span>
          <Button variant="ghost" size="sm" onClick={() => handleRemove(i)} type="button">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="Suburb *" value={suburb} onChange={(e) => setSuburb(e.target.value)} />
        <Input placeholder="City *" value={city} onChange={(e) => setCity(e.target.value)} />
        <Input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
        <Input placeholder="Postcode" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
        <Input placeholder="Country *" value={country} onChange={(e) => setCountry(e.target.value)} />
        <Button variant="outline" onClick={handleAdd} disabled={!suburb.trim() || !city.trim() || !country.trim()} type="button">
          <Plus className="h-4 w-4 mr-1" /> Add Area
        </Button>
      </div>
    </div>
  );
};

export default ServiceAreaInput;
