interface StatsCardsProps {
  adSlots: Array<{
    basePrice: number;
    isAvailable: boolean;
    type: string;
  }>;
}

export function StatsCards({ adSlots }: StatsCardsProps) {
  const totalSlots = adSlots.length;
  const availableSlots = adSlots.filter((s) => s.isAvailable).length;
  const bookedSlots = totalSlots - availableSlots;
  const potentialRevenue = adSlots.reduce((sum, s) => sum + Number(s.basePrice), 0);
  const bookedRevenue = adSlots
    .filter((s) => !s.isAvailable)
    .reduce((sum, s) => sum + Number(s.basePrice), 0);

  const stats = [
    {
      label: 'Total Ad Slots',
      value: totalSlots,
      icon: '📦',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Available',
      value: availableSlots,
      icon: '✅',
      color: 'bg-green-50 text-green-700',
    },
    {
      label: 'Booked',
      value: bookedSlots,
      icon: '📅',
      color: 'bg-purple-50 text-purple-700',
    },
    {
      label: 'Monthly Revenue',
      value: `$${bookedRevenue.toLocaleString()}`,
      subtext: `of $${potentialRevenue.toLocaleString()} potential`,
      icon: '💵',
      color: 'bg-orange-50 text-orange-700',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-lg border border-[--color-border] p-4 ${stat.color}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">{stat.icon}</span>
            <span className="text-2xl font-bold">{stat.value}</span>
          </div>
          <p className="mt-2 text-sm font-medium opacity-80">{stat.label}</p>
          {'subtext' in stat && stat.subtext && (
            <p className="text-xs opacity-60">{stat.subtext}</p>
          )}
        </div>
      ))}
    </div>
  );
}
