export default function CareerCard({ company, period, position, details }: any) {
  return (
    <div className="rounded-xl border p-5 bg-muted/20 space-y-2">
      <h3 className="font-medium text-lg">{company}</h3>
      <p className="text-sm text-foreground">{period} · {position}</p>
      <ul className="text-sm text-foreground list-disc pl-5 space-y-1">
        {details.map((d: string, i: number) => <li key={i}>{d}</li>)}
      </ul>
    </div>
  );
}
