/* eslint-disable no-unused-vars */
import { Edit } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Lecture = ({lecture, courseId, index}) => {

    const navigate=useNavigate();

    const goToUpdateLecture= () =>{
        navigate(`${lecture._id}`)
    }

  return (
    <div className='flex items-center justify-between bg-teal-50 px-4 py-2 rounded-md my-2'>
        <h1 className='font-bold text-gray-800'>Chap-{index+1}: {lecture.lectureTitle}</h1>
        <Edit
        onClick={goToUpdateLecture}
        size={20}
        className='cursor-pointer text-gray-600 hover:text-dark-blue'
        />
    </div>
  )
}

export default Lecture