"use client";

import { addDays, format } from "date-fns";
import { useState } from "react";

import DatePickerRange from "~/app/_components/(admin)/transfers/DatePickerRange";
import { TransfersTable } from "~/app/_components/(admin)/transfers/TransfersTable";

export default function Page() {
  const [dateRange, setDateRange] = useState<{ from: string; to?: string }>({
    from: format(new Date(), "yyyy-MM-dd"),
    to: format(addDays(new Date(), 1), "yyyy-MM-dd"),
  });

  return (
    <div>
      <div className="flex gap-3 flex-wrap mb-4">
        <DatePickerRange onSelect={setDateRange} />
      </div>
      <TransfersTable range={dateRange} />
    </div>
  );
}
