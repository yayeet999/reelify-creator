import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryTabsProps {
  categories: string[];
}

export const CategoryTabs = ({ categories }: CategoryTabsProps) => {
  return (
    <TabsList className="w-full mb-4">
      <TabsTrigger value="all" className="flex-1">1/4</TabsTrigger>
      {categories.map((category, index) => (
        <TabsTrigger 
          key={category} 
          value={category} 
          className="flex-1 capitalize"
        >
          {`${index + 2}/4`}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};