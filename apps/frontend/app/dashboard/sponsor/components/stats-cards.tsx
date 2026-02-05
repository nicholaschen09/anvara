interface StatsCardsProps {
  campaigns: Array<{
    budget: number;
    spent: number;
    status: string;
  }>;
}

export function StatsCards({ campaigns }: StatsCardsProps) {
  const totalBudget = campaigns.reduce((sum, c) => sum + Number(c.budget), 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + Number(c.spent), 0);
  const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE').length;
  const spendRate = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const stats = [
    {
      label: 'Total Campaigns',
      value: campaigns.length,
      icon: '📊',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Active Campaigns',
      value: activeCampaigns,
      icon: '🚀',
      color: 'bg-green-50 text-green-700',
    },
    {
      label: 'Total Budget',
      value: `$${totalBudget.toLocaleString()}`,
      icon: '💰',
      color: 'bg-purple-50 text-purple-700',
    },
    {
      label: 'Budget Used',
      value: `${spendRate.toFixed(1)}%`,
      icon: '📈',
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
        </div>
      ))}
    </div>
  );
}
