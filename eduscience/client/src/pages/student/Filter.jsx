import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";

const categories = [
  { id: "SVT Terminal S2", label: "SVT Terminal S2" },
  { id: "SVT Première S2", label: "SVT Première S2" },
  { id: "SVT Seconde S2", label: "SVT Seconde S2" },
  { id: "SVT Cycle Moyen", label: "SVT Cycle Moyen" },
  { id: "Math Terminal S2", label: "Math Terminal S2" },
  { id: "Math Première S2", label: "Math Première S2" },
  { id: "Math Seconde S2", label: "Math Seconde S2" },
  { id: "Math Cycle Moyen", label: "Math Cycle Moyen" },
  { id: "PC Terminal S2", label: "PC Terminal S2" },
  { id: "PC Première S2", label: "PC Première S2" },
  { id: "PC Seconde S2", label: "PC Seconde S2" },
  { id: "PC Cycle Moyen", label: "PC Cycle Moyen" },
];

const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId];

        handleFilterChange(newCategories, sortByPrice);
        return newCategories;
    });
  };

  const selectByPriceHandler = (selectedValue) => {
    setSortByPrice(selectedValue);
    handleFilterChange(selectedCategories, selectedValue);
  }
  return (
    <div className="w-full md:w-[20%]">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-semibold text-lg md:text-xl ">Trier</h1>
        <Select onValueChange={selectByPriceHandler}>
          <SelectTrigger>
            <SelectValue placeholder="Trier par prix" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Trier par prix</SelectLabel>
              <SelectItem value="low">Croissant</SelectItem>
              <SelectItem value="high">Decroissant</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator className="my-4" />
      <div>
        <h1 className="font-semibold mb-2">CATÉGORIE</h1>
        {categories.map((category) => (
          <div className="flex items-center space-x-2 my-2">
            <Checkbox
              id={category.id}
              onCheckedChange={() => handleCategoryChange(category.id)}
            />
            <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {category.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;