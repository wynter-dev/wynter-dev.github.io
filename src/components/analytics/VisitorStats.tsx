'use client';

import {useEffect, useState} from 'react';

export default function VisitorStats() {
  const [today, setToday] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [active, setActive] = useState<number>(0);

  useEffect(() => {
    fetch('/api/analytics/visitors')
      .then(res => res.json())
      .then(data => {
        setToday(data.today);
        setTotal(data.total);
      });

    fetch('/api/analytics/active')
      .then(res => res.json())
      .then(data => setActive(data.active30m));
  }, []);

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span className="md:flex hidden  items-center gap-1 whitespace-nowrap">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <strong className="font-medium text-foreground">{active.toLocaleString()}</strong>
      </span>

      <span className="whitespace-nowrap">
        Today: <strong className="font-medium text-foreground">{today.toLocaleString()}</strong>
      </span>

      <span className="whitespace-nowrap">
        Total: <strong className="font-medium text-foreground">{total.toLocaleString()}</strong>
      </span>
    </div>
  );
}
