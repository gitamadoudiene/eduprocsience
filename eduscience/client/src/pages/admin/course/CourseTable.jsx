import LoadingSpinner from '@/components/LoadingSpinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow, } from '@/components/ui/table'
import { useGetCreatorCoursesQuery } from '@/features/api/courseApi'
import { Edit } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'


const CourseTable = () => {

  const {data, isLoading} = useGetCreatorCoursesQuery();

    const navigate=useNavigate();

    if (isLoading) {
      return <LoadingSpinner />;
    }

    
  return (
    
    <div >
        <Button className='text-teal-100 hover:bg-dark-blue dark:text-black'
        onClick={() => navigate("create")}>Ajouter un Cours</Button>
        <Table>
      <TableCaption>Une liste de vos Cours récentes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Prix</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Titre</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="dark:text-white">
        {data.courses.map((course) => (
          <TableRow key={course._id}>
            <TableCell className="font-medium">{course?.coursePrice || "N/A"}</TableCell>
            <TableCell><Badge>{course.isPublished ? "Publier" : "Dépublier"}</Badge></TableCell>
            <TableCell>{course.courseTitle}</TableCell>
            <TableCell className="text-right">
             <Button size="sm" variant="ghost" onClick={()=> navigate(`${course._id}`)}><Edit /></Button>
              </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  )
}

export default CourseTable