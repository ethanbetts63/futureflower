// frontend/src/components/EditControl.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

interface EditControlProps {
  editUrl: string;
  locked?: boolean;
}

const EditControl: React.FC<EditControlProps> = ({ editUrl, locked = false }) => {
  if (locked) {
    return (
      <div className="flex items-center gap-1.5 text-black/30">
        <Lock className="h-3 w-3" />
        <span className="text-xs">
          Editing closed —{' '}
          <Link to="/contact" className="underline hover:text-black/50 transition-colors">
            contact us
          </Link>
        </span>
      </div>
    );
  }

  return (
    <Link
      to={editUrl}
      className="text-xs font-semibold text-black/40 hover:text-black underline underline-offset-4 transition-colors"
    >
      Edit
    </Link>
  );
};

export default EditControl;
