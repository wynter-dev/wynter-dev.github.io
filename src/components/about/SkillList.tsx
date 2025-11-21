export default function SkillList({ title, items }: any) {
  return (
    <div className="rounded-xl border p-5 bg-muted/20">
      <h3 className="font-medium mb-3">{title}</h3>
      <ul className="space-y-1 text-sm text-foreground list-disc pl-5">
        {items.map((item: string, i: number) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}
