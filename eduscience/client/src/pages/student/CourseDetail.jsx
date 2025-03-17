/* eslint-disable no-unused-vars */
import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { BadgeInfo, Book, BookOpen, Loader, Lock, PlayCircle } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { assets } from "@/assets/assets";
import LoadingSpinner from "@/components/LoadingSpinner";

const CourseDetail = () => {
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // État pour gérer l'ouverture/fermeture du menu

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !data || !data.course) {
    return <p>Erreur : Impossible de charger le cours.</p>;
  }

  const { course, purchased } = data;

  const handleContinueCourse = () => {
    if (purchased || course.coursePrice === 0) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="space-y-5">
      {/* En-tête du cours */}
      <div className="bg-gray-800 text-white">
        <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl break-words">
            {course.courseTitle}
          </h1>
          <p className="text-sm sm:text-base md:text-lg underline italic break-words">
            {course.subTitle}
          </p>
          <p className="break-words">
            Créé par{" "}
            <span className="font-bold underline">{course.creator?.name}</span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p className="font-bold break-words">
              Dernière mise à jour {course.updatedAt?.split("T")[0]}
            </p>
          </div>
          <p className="break-words">Élèves inscrits: {course.enrolledStudents?.length || 0}</p>
        </div>
      </div>

      {/* Bouton Hamburger pour mobile */}
      <button
        onClick={toggleMenu}
        className={`md:hidden fixed top-16 left-4 transform -translate-y-1/2 z-50 p-1 transition-transform duration-300 ease-in-out text-white ${
          isMenuOpen ? "translate-x-64" : "translate-x-0"
        }`}
      >
        <BookOpen className="w-8 h-8" />
       
      </button>

      {/* Overlay pour fermer le menu en cliquant à l'extérieur */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Menu coulissant pour mobile */}
      <div
        className={`md:hidden fixed top-11 left-0 h-screen w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } z-40 shadow-lg`}
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-2xl mb-4 underline">Contenu du Cours</h2>
        </div>
        <div className="overflow-y-auto h-full p-4">
          {course.lectures?.map((lecture, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm">
              <span>
                {purchased || course.coursePrice === 0 ? (
                  <PlayCircle size={14} />
                ) : (
                  <Lock size={14} />
                )}
              </span>
              <p>{lecture.lectureTitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="w-full max-w-7xl mx-auto my-5 px-4 sm:px-6 md:px-8 flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Sidebar pour desktop */}
        <div className="hidden md:block sticky top-0 h-[calc(100vh-4rem)] w-full lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Contenu du Cours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 overflow-y-auto max-h-[calc(100vh-8rem)]">
              {course.lectures?.map((lecture, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span>
                    {purchased || course.coursePrice === 0 ? (
                      <PlayCircle size={14} />
                    ) : (
                      <Lock size={14} />
                    )}
                  </span>
                  <p>{lecture.lectureTitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Section principale (description, vidéo, etc.) */}
        <div className="w-full lg:w-2/3 space-y-4">
          <h1 className="text-lg md:text-xl font-semibold break-words border p-1">
             {course.subTitle}
          </h1>
          <Card>
  <CardContent className="p-4 flex flex-col">
    {/* Conteneur pour l'image ou la vidéo */}
    <div className="w-full aspect-video mb-2 min-h-[150px] sm:min-h-[250px] md:min-h-[300px] flex items-center justify-center bg-gray-100 overflow-hidden">
      {course.lectures?.length > 0 ? (
        purchased || course.coursePrice === 0 ? (
          <ReactPlayer
            width="100%"
            height="100%"
            url={course.lectures[0].videoUrl}
            controls={true}
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
            <img
              src={course.courseThumbnail}
              alt="Miniature du cours"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
              <Lock size={40} className="mb-2" />
              <p className="text-lg text-center">
                Achetez ce Cours pour accéder à cette vidéo.
              </p>
            </div>
          </div>
        )
      ) : (
        <p>Aucune vidéo disponible</p>
      )}
    </div>

    <Separator className="my-2" />
    <h1 className="text-lg md:text-xl font-semibold break-words">
      Prix :{" "}
      {course.coursePrice === 0
        ? "Gratuit"
        : `${course.coursePrice} XOF`}
    </h1>
  </CardContent>
  <CardFooter className="flex justify-center p-4">
    {purchased || course.coursePrice === 0 ? (
      <Button
        onClick={handleContinueCourse}
        className="w-full hover:bg-dark-blue"
      >
        {course.coursePrice === 0 ? " Gratuit" : "Continuer le Cours"}
      </Button>
    ) : (
      <BuyCourseButton courseId={courseId} />
    )}
  </CardFooter>
</Card>

          {/* Description du cours */}
          <Card>
            <CardContent className="p-4">
              <h1 className="font-bold text-xl sm:text-2xl md:text-3xl underline break-words">
                Description:
              </h1>
              <p
                className="text-sm sm:text-base md:text-lg break-words"
                dangerouslySetInnerHTML={{
                  __html: course.description || "Pas de description disponible",
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;