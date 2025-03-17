import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'
import CourseTab from './CourseTab'

const EditCourse = () => {
  return (
    <div className='flex-1'>
      <div>
        <h1 className='font-semibold text-xl text-center border-b border-gray-400 capitalize'>Ajouter les details du cours</h1>
      </div><br />
        <div className='flex flex-col md:flex-row items-center justify-around mb-5'>
            
            <Link to="lecture" >
            <Button className=' hover:text-dark-blue hover:bg-gray-200' variant='link'>Ajouter des Lecons</Button>
            </Link>

            <Link to="quiz" >
            <Button className=' hover:text-dark-blue hover:bg-gray-200' variant='link'>Ajouter des Quizs</Button> 
            </Link>

            <Link to="exercise" >
            <Button className=' hover:text-dark-blue hover:bg-gray-200' variant='link'>Ajouter Des Exercices</Button> 
            </Link>       
        </div>
        <CourseTab />
    </div>
  )
}

export default EditCourse