import CategoryManager from '@/components/admin/category/CategoryManager';

export default function CategoriesPage() {
  return (
    <div className="flex flex-col max-w-5xl">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">카테고리 관리</h1>
      <CategoryManager />
    </div>
  );
}