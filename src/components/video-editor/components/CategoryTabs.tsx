import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryTabsProps {
  categories: string[];
}

export const CategoryTabs = ({ categories }: CategoryTabsProps) => {
  return (
    <TabsList className="w-full mb-4 p-1 bg-slate-100/80 rounded-xl">
      <TabsTrigger 
        value="all" 
        className="flex-1 px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg transition-all"
      >
        1/6
      </TabsTrigger>
      {categories.map((category, index) => (
        <TabsTrigger 
          key={category} 
          value={category} 
          className="flex-1 px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg transition-all"
        >
          {`${index + 2}/6`}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};