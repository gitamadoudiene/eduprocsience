/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from "@/features/api/courseApi";
import { toast } from "sonner";

const CourseTab = () => {
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });
  const params = useParams();
  const courseId = params.courseId;
  const { data: courseByIdData, isLoading: courseByIdLoading, refetch } = useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });

  const course = courseByIdData?.course;

  const [publishCourse, {}] = usePublishCourseMutation();

  useEffect(() => {
    if (course) {
      const course = courseByIdData?.course;
      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: "",
      });
    }
  }, [courseByIdData]);

  const [prewiewThumbnail, setPrewiewThumbnail] = useState("");
  const navigate = useNavigate();

  const [editCourse, { data, isLoading, error, isSuccess }] = useEditCourseMutation();
  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPrewiewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);
    await editCourse({ courseId, formData });
  };

  const publishStatusHandler = async (action) => {
    try {
      const response = await publishCourse({ courseId, query: action });
      if (response.data) {
        toast.success(response.data.message);
        navigate("/admin/course");
        refetch();
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du cours");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Cours mis à jour avec succès.");
      
    }
    if (error) {
      toast.error(error.data.message || "Erreur lors de la mise à jour du Cours");
    }
  }, [isSuccess, error]);

  if (courseByIdLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="">
      <Card>
        <CardHeader className="flex flex-col md:flex-row justify-between">
          <div>
            <CardTitle>Informations du cours</CardTitle>
            <CardDescription>
              Apportez des modifications à votre Cours ici. Cliquez sur
              Enregistrer lorsque vous avez terminé.
            </CardDescription>
          </div>
          <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
            <Button
              disabled={courseByIdData?.course.lectures.length === 0}
              variant="outline"
              onClick={() => publishStatusHandler(courseByIdData?.course.isPublished ? "false" : "true")}
            >
              {courseByIdData?.course.isPublished ? "Dépublier" : "Publier"} 

            
            </Button>
            <Button variant="destructive">Supprimer</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mt-5">
            <div>
              <Label>Titre</Label>
              <Input
                type="text"
                name="courseTitle"
                value={input.courseTitle}
                onChange={changeEventHandler}
                placeholder="Titre du cours"
              />
            </div>
            <div>
              <Label>Sous-titre</Label>
              <Input
                type="text"
                name="subTitle"
                value={input.subTitle}
                onChange={changeEventHandler}
                placeholder="Sous-titre du cours"
              />
            </div>
            <div>
              <Label>Description</Label>
              <RichTextEditor input={input} setInput={setInput} />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <div className="w-full md:w-1/3">
                <Label>Catégorie</Label>
                <Select onValueChange={selectCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Catégorie</SelectLabel>
                      <SelectItem value="SVT Terminal S2">SVT Terminal S2</SelectItem>
                      <SelectItem value="SVT Première S2">SVT Première S2</SelectItem>
                      <SelectItem value="SVT Seconde S2">SVT Seconde S2</SelectItem>
                      <SelectItem value="SVT Cycle Secondaire">SVT Cycle Secondaire</SelectItem>
                      <SelectItem value="Math Terminal S2">Math Terminal S2</SelectItem>
                      <SelectItem value="Math Première S2">Math Première S2</SelectItem>
                      <SelectItem value="Math Seconde S2">Math Seconde S2</SelectItem>
                      <SelectItem value="Math Cycle Secondaire">Math Cycle Secondaire</SelectItem>
                      <SelectItem value="PC Terminal S2">PC Terminal S2</SelectItem>
                      <SelectItem value="PC Première S2">PC Première S2</SelectItem>
                      <SelectItem value="PC Seconde S2">PC Seconde S2</SelectItem>
                      <SelectItem value="PC Cycle Secondaire">PC Cycle Secondaire</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/3">
                <Label>Niveau</Label>
                <Select onValueChange={selectCourseLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Niveau</SelectLabel>
                      <SelectItem value="Facile">Facile</SelectItem>
                      <SelectItem value="Moyen">Moyen</SelectItem>
                      <SelectItem value="Difficile">Difficile</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/3">
                <Label>Prix en (XOF)</Label>
                <Input
                  type="number"
                  name="coursePrice"
                  value={input.coursePrice}
                  onChange={changeEventHandler}
                  placeholder="Prix du cours"
                />
              </div>
            </div>
            <div>
              <Label>Image du cours</Label>
              <Input
                onChange={selectThumbnail}
                type="file"
                accept="image/*"
                placeholder="Image du cours"
              />
              {prewiewThumbnail && (
                <img src={prewiewThumbnail} alt="" className="w-64 my-2" />
              )}
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Button
                onClick={() => {
                  navigate("/admin/course");
                  refetch(); // Rafraîchir les données
                }}
                variant="outline"
              >
                Retour
              </Button>
              <Button disabled={isLoading} onClick={updateCourseHandler}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Patientez...
                  </>
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseTab;