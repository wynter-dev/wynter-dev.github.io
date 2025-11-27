'use client';

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';


interface PageSizeSelectProps {
  pageSize: number;
}

export default function PageSizeSelect({pageSize}: PageSizeSelectProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">보기 개수</span>

      <Select
        defaultValue={String(pageSize)}
        onValueChange={(val) => {
          window.location.href = `?pageSize=${val}`;
        }}
      >
        <SelectTrigger className="h-8 px-2.5 text-sm border rounded-md">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="text-sm rounded-md min-w-[110px]">
          {[10, 20, 30, 50].map((opt: number) => (
            <SelectItem key={opt} value={opt.toString()}>
              {opt}개
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
