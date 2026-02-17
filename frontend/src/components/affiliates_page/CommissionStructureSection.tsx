import React from 'react';
import floristPackingImage from '../../assets/florist_packing.webp'; // TODO: replace with commission-themed image

const rows = [
  { budget: '< $100', commission: '$5',  total: '$15' },
  { budget: '< $150', commission: '$10', total: '$30' },
  { budget: '< $200', commission: '$15', total: '$45' },
  { budget: '< $250', commission: '$20', total: '$60' },
  { budget: '>= $250', commission: '$25', total: '$75' },
];

export const CommissionStructureSection: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* Image Column */}
        <div className="h-64 md:h-full">
          <img
            src={floristPackingImage}
            alt="Florist carefully packing a bouquet"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Text Column */}
        <div className="text-black flex items-center p-8 md:p-16">
          <div className="w-full">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              High value orders, high value payouts.
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              The more your followers invest in the bouquet, the more you earn. Bigger gestures mean bigger payouts — simple as that.
            </p>

            {/* Commission Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-3 py-2 font-semibold text-gray-600 text-xs uppercase tracking-wide">Budget</th>
                    <th className="text-center px-3 py-2 font-semibold text-gray-600 text-xs uppercase tracking-wide">Per Delivery</th>
                    <th className="text-center px-3 py-2 font-semibold text-gray-600 text-xs uppercase tracking-wide">Total (3 Orders)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className={i < rows.length - 1 ? 'border-b border-gray-100' : ''}>
                      <td className="px-3 py-2.5 font-medium text-gray-900">{row.budget}</td>
                      <td className="px-3 py-2.5 text-center font-bold text-green-600">{row.commission}</td>
                      <td className="px-3 py-2.5 text-center font-semibold text-gray-500">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-sm text-gray-500 italic">
              Commissions are paid within 14 days of a successful delivery to account for our refund window.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
