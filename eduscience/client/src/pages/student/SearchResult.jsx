import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {
  return (
    <div className="flex flex-col border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <Link
        to={`/course-detail/${course._id}`}
        className="flex flex-col h-full"
      >
        <img
          src={course.courseThumbnail}
          alt="course-thumbnail"
          className="h-48 w-full object-cover"
        />
        <div className="p-4 flex flex-col flex-grow">
          <h1 className="font-bold text-lg md:text-xl">{course.courseTitle}</h1>
          <p className="text-sm text-gray-600 mt-2">{course.subTitle}</p>
          <p className="text-sm text-gray-700 mt-2">
            Instructeur: <span className="font-bold">{course.creator?.name}</span>
          </p>
          <Badge className="w-fit mt-2">{course.courseLevel}</Badge>
        </div>
        <div className="p-4 border-t border-gray-200">
          <h1 className="font-bold text-lg md:text-xl text-right">
            {course.coursePrice} XOF
          </h1>
        </div>
      </Link>
    </div>
  );
};

export default SearchResult;