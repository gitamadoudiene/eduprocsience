import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ReactPlayer from "react-player";
import parse from "html-react-parser";
import { assets } from "@/assets/assets";
import LoadingSpinner from "@/components/LoadingSpinner";
import { HelpCircle } from "lucide-react";
import YouTubePlayer from "react-player/youtube";

const CourseProgress = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [
    completeCourse,
    { data: markCompleteData, isSuccess: completedSuccess },
  ] = useCompleteCourseMutation();

  const [currentLecture, setCurrentLecture] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (data?.data?.courseDetails?.lectures?.length > 0) {
      setCurrentLecture(data.data.courseDetails.lectures[0]);
    }
  }, [data]);

  useEffect(() => {
    if (completedSuccess) {
      refetch();
      toast.success(markCompleteData.message);
    }
  }, [completedSuccess]);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !data || !data.data)
    return <p>Failed to load course details</p>;

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle, lectures, quizzes, subTitle } = courseDetails;

  const isLectureCompleted = (lectureId) =>
    progress.some((prog) => prog.lectureId === lectureId && prog.viewed);

  const isCourseCompleted = () => {
    return lectures.every((lecture) => isLectureCompleted(lecture._id));
  };

  const handleLectureComplete = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    setIsMenuOpen(false);
  };

  const handleCompleteCourse = async () => {
    if (!completed) {
      await completeCourse(courseId);
    }
  };

  

  const isYouTubeUrl = (url) => {
    return url?.includes("youtube.com") || url?.includes("youtu.be");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleStartQuiz = () => {
    navigate(`/courses/${courseId}/quiz`); // Redirige vers la page de quiz
  };

  return (
    <div className="max-w-8xl mx-auto md:pt-4 pt-10 md:px-16 px-2">
      <div className="mt-4">
        <h3 className="font-medium text-lg text-right">
          {`Progression : ${
            lectures.findIndex((lec) => lec._id === currentLecture?._id) + 1
          } / ${lectures.length}`}
        </h3>
        <h1 className="text-2xl font-bold text-center border-b-4 border-gray-300">
          {subTitle}
        </h1>
      </div>
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <Button
          className="dark:text-white dark:bg-gray-800"
          onClick={handleCompleteCourse}
          variant={completed ? "outline" : "default"}
          disabled={completed}
        >
          {completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" /> <span>Terminé</span>
            </div>
          ) : (
            "Marquer comme terminé"
          )}
        </Button>
      </div>

      <button
        onClick={toggleMenu}
        className={`md:hidden fixed top-20 left-4 transform -translate-y-1/2 z-50 p-1 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-64" : "translate-x-0"
        }`}
      >
        <img src={assets.lesson_icon} alt="" className="w-8 h-8" />
      </button>

      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMenu}
        ></div>
      )}

      <div
        className={`md:hidden fixed top-16 left-0 h-screen w-64 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } z-40 shadow-lg`}
      >
        <div className="overflow-y-auto h-full p-4">
          {lectures.map((lecture) => (
            <Card
              key={lecture._id}
              className={`mb-3 hover:cursor-pointer transition transform ${
                lecture._id === currentLecture?._id
                  ? "bg-gray-200 dark:bg-gray-800"
                  : ""
              }`}
              onClick={() => handleSelectLecture(lecture)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  {isLectureCompleted(lecture._id) ? (
                    <CheckCircle2 size={24} className="text-green-500 mr-2" />
                  ) : (
                    <CirclePlay
                      size={24}
                      className="text-gray-500 mr-2 dark:text-gray-100"
                    />
                  )}
                  <div>
                    <CardTitle className="text-lg font-medium">
                      {lecture.lectureTitle}
                    </CardTitle>
                  </div>
                </div>
                {isLectureCompleted(lecture._id) && (
                  <Badge
                    variant={"outline"}
                    className="bg-green-200 text-green-600"
                  >
                    Terminé
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
          {quizzes && quizzes.length > 0 && isCourseCompleted() && (
            <div className="mt-8">
              <Button
                onClick={handleStartQuiz}
                className="w-full bg-blue-500 text-white"
              >
                Lancer le Quiz
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        <div className="hidden md:block sticky top-0 h-screen flex-col w-full md:w-2/6 border-t md:border-t-0 md:border-r border-gray-200 md:pr-4 pt-4 md:pt-0">
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-2xl mb-4 underline text-center">
                Contenu du Cours
              </h2>
            </div>
            {lectures.map((lecture) => (
              <Card
                key={lecture._id}
                className={`mb-3 hover:cursor-pointer transition transform ${
                  lecture._id === currentLecture?._id
                    ? "bg-gray-200 dark:bg-gray-800"
                    : ""
                }`}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay
                        size={24}
                        className="text-gray-500 mr-2 dark:text-gray-100"
                      />
                    )}
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {lecture.lectureTitle}
                      </CardTitle>
                    </div>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <Badge
                      variant={"outline"}
                      className="bg-green-200 text-green-600"
                    >
                      Terminé
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
            {quizzes && quizzes.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Button
                  disabled={!isCourseCompleted()}
                  onClick={handleStartQuiz}
                  className="flex items-center gap-2 w-full bg-dark-blue text-white text-lg px-4 py-2 rounded-lg"
                >
                  <HelpCircle size={24} />
                  Lancer le Quiz
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 h-fit rounded-lg shadow-lg bg-white dark:bg-gray-700">
          {currentLecture ? (
            isYouTubeUrl(currentLecture.videoUrl) ? (
              <div className="relative w-full h-0 pb-[56.25%]">
                <ReactPlayer
                  url={currentLecture.videoUrl}
                  controls
                  width="100%"
                  height="100%"
                  className="absolute top-0 left-0"
                  onEnded={() => handleLectureComplete(currentLecture._id)}
                  config={{
                    youtube: {
                      playerVars: {
                        modestbranding: 1,
                        rel: 0,
                        showinfo: 0,
                        controls: 1,
                        
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <video
                src={currentLecture.videoUrl}
                controls
                className="w-full h-auto md:rounded-lg"
                onEnded={() => handleLectureComplete(currentLecture._id)}
              />
            )
          ) : (
            <p>Aucune vidéo disponible</p>
          )}
          <div className="mt-4">
            <h3 className="font-medium text-lg">
              {`Chap ${
                lectures.findIndex((lec) => lec._id === currentLecture?._id) + 1
              } : ${currentLecture?.lectureTitle}`}
            </h3>
          </div>
          <Card>
            <CardTitle>
              <h3 className="font-medium text-lg text-center underline">
                Résumé de la vidéo
              </h3>
            </CardTitle>
            <CardContent>
              <div className="mt-2">
                <div>{parse(currentLecture?.description || "")}</div>
              </div>
            </CardContent>
          </Card>

          {/* Bouton pour lancer le quiz */}
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
