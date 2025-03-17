import React from 'react'
import Course from './Course';
import Footer from '../Footer';
import { useLoadUserQuery } from '@/features/api/authApi';

const MyLearning = () => {
    const {data,isloading}=useLoadUserQuery();

    const myLearning=data?.user.enrolledCourses || [];
  return (
    <div className='max-w-4xl mx-auto my-10 px-4 md-px-0'>
        <h1 className='font-bold text-2xl'>Mes Cours</h1>
        <div className='my-5'>
            {
                isloading ? (
                    <MyLearningSkeleton />
                ) : myLearning.length === 0 ? 
                    (<p>Aucun Cours en cours</p>)
                    : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                            {myLearning.map((course,index)=><Course key={index} course={course}/>)}
                        </div>
                   
                    )
                
            }
        </div>

    </div>
    
  )
  
}

export default MyLearning

const MyLearningSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
        ></div>
      ))}
    </div>
  );
