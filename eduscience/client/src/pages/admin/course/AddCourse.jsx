import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {  Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue, } from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {

    const [courseTitle, setCourseTitle] = useState("");
    const [category, setCategory] = useState("");

    const [createCourse,{data, isLoading, error, isSuccess}]=useCreateCourseMutation();

    const navigate=useNavigate();
    

    const getSelectedCategory = (value) => {
        setCategory(value);
    };

    const createCourseHandler= async () => {
        await createCourse({courseTitle, category});
    };
    // toast
    useEffect(() => {
      if (isSuccess) {
        toast.success(data?.message || "Cours créé avec succès");
        navigate("/admin/course");
      }
    }, [isSuccess, error]);
  return (
    <div className="flex-1 mx-10 dark:bg-gray-600">
      <div className="mb-4">
        <h1 className="font-bold text-xl">Ajouter un cours</h1>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Titre</Label>
          <Input placeholder="Titre du cours" type="text" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
        </div>
        <div>
          <Label>Catégorie </Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Catégorie </SelectLabel>
                <SelectItem value="SVT Terminal S2">SVT Terminal S2</SelectItem>
                <SelectItem value="SVT Première S2">SVT Première S2</SelectItem>
                <SelectItem value="SVT Seconde S2">SVT Seconde S2</SelectItem>
                <SelectItem value="SVT Cycle Moyen">SVT Cycle Moyen</SelectItem>
                <SelectItem value="Math Terminal S2">Math Terminal S2</SelectItem>
                <SelectItem value="Math Première S2">Math Première S2</SelectItem>
                <SelectItem value="Math Seconde S2">Math Seconde S2</SelectItem>
                <SelectItem value="Math Cycle Moyen">Math Cycle Moyen</SelectItem>
                <SelectItem value="PC Terminal S2">PC Terminal S2</SelectItem>
                <SelectItem value="PC Première S2">PC Première S2</SelectItem>
                <SelectItem value="PC Seconde S2">PC Seconde S2</SelectItem>
                <SelectItem value="PC Cycle Moyen">PC Cycle Moyen</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4 items-center">
            <Button variant="outline" onClick={() => navigate(-1)}>Annuler</Button>
            <Button onClick={createCourseHandler} disabled={isLoading}>
                {
                    isLoading ? (
                       <>
                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                       Chargement...
                       </>
                    ) : "Ajouter"
                }
            </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
