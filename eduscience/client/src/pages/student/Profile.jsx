import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const { data, isLoading, refetch } = useLoadUserQuery();
  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);

    await updateUser(formData);
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (data?.user) {
      setName(data.user.name || "");
      setProfilePhoto(data.user.photoUrl || "");
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(updateUserData?.message || "Profil mis à jour avec succès");
    }
    if (isError) {
      toast.error(error?.message || "Erreur lors de la mise à jour du profil");
    }
  }, [isSuccess, isError, updateUserData, error]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const user = data?.user;

  return (
    <div className="my-10 max-w-4xl mx-auto px-4">
      <h1 className="font-bold text-2xl text-center md:text-left">
        Mon Profil
      </h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex items-center flex-col">
          <Avatar className="h-24 w-24 md:h-32 md:w-32">
            <AvatarImage
              src={user?.photoUrl || "https://github.com/shadcn.png"}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div>
            <h1 className="font-semibold text-lg text-gray-900 dark:text-white">
              Nom:
              <span className="font-normal text-gray-700 ml-2 dark:text-white">
                {user?.name}
              </span>
            </h1>
          </div>

          <div>
            <h1 className="font-semibold text-lg text-gray-900 dark:text-white">
              E-mail:
              <span className="font-normal text-gray-700 ml-2 dark:text-white">
                {user?.email}
              </span>
            </h1>
          </div>

          <div>
            <h1 className="font-semibold text-lg text-gray-900 dark:text-white">
              Rôle:
              <span className="font-normal text-gray-700 ml-2 dark:text-white">
                {user?.role}
              </span>
            </h1>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-2" size="sm">
                Editer Profil
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Editer profil</DialogTitle>
                <DialogDescription>
                  Fais des modifications à ton profil ici. Clique sur
                  "Enregistrer" lorsque tu as terminé.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nom
                  </Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="profilePhoto" className="text-right">
                    Photo de profil
                  </Label>
                  <Input
                    type="file"
                    onChange={onChangeHandler}
                    accept="image/*"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={updateUserLoading}
                  onClick={updateUserHandler}
                >
                  {updateUserLoading ? (
                    
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  
                  ) : (
                    "Enregistrer"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <h1 className="font-bold text-lg">Cours auxquels vous êtes inscrit</h1>
        <div className="my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {user?.enrolledCourses?.length === 0 ? (
            <p>Aucun cours en cours</p>
          ) : (
            user?.enrolledCourses.map((course) => (
              <Course course={course} key={course.id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
