import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle, XCircle } from 'lucide-react';
import { validateDiscountCode } from '@/api/partners';
import type { DiscountValidationResult } from '@/types';

interface DiscountCodeInputProps {
  onCodeValidated: (code: string | null, result: DiscountValidationResult | null) => void;
}

const DiscountCodeInput: React.FC<DiscountCodeInputProps> = ({ onCodeValidated }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiscountValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const validationResult = await validateDiscountCode(code.trim());
      setResult(validationResult);
      onCodeValidated(code.trim(), validationResult);
    } catch (err: any) {
      const errorMsg = err.data?.code?.[0] || err.message || 'Invalid discount code.';
      setError(errorMsg);
      onCodeValidated(null, null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setResult(null);
    setError(null);
    onCodeValidated(null, null);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Discount Code</label>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter discount code"
          disabled={!!result || isLoading}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
        />
        {result ? (
          <Button variant="outline" onClick={handleClear} type="button">
            Clear
          </Button>
        ) : (
          <Button onClick={handleApply} disabled={!code.trim() || isLoading} type="button">
            {isLoading ? <Spinner className="h-4 w-4" /> : 'Apply'}
          </Button>
        )}
      </div>

      {result && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span>
            Code from <strong>{result.partner_name}</strong> applied! ${Number(result.discount_amount).toFixed(2)} off.
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <XCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default DiscountCodeInput;
