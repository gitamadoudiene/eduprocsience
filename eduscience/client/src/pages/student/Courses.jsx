import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import Course from "./Course";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetPublishedCourseQuery();

  if (isError) return <h1>Une erreur est survenue</h1>;

  // Limiter l'affichage à 8 cours sur la page actuelle
  const displayedCourses = data?.courses?.slice(0, 8);

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-3xl text-center mb-10">Nos Cours</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : displayedCourses?.map((course, index) => (
                <Course key={index} course={course} />
              ))}
        </div>
        {/* Conteneur pour centrer le bouton */}
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => {
              navigate(`/course/search?query`); // Rediriger vers la page de recherche
              window.scrollTo(0, 0); // Fait défiler la page vers le haut
            }}
            className="rounded bg-dark-blue text-white px-6 py-3 hover:bg-medium-blue transition-colors duration-300"
          >
            Explorer les cours
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Courses;

const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
      <Skeleton className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};