/* eslint-disable no-unused-vars */
import { ChartNoAxesColumn, SquareLibrary, Menu } from "lucide-react";
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"; // Assurez-vous d'importer Sheet depuis shadcn/ui

const Sidebar = () => {

  return (
    <div className="flex">
      {/* Bouton hamburger pour les petits écrans */}
    

      {/* Sidebar pour les grands écrans */}
      <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 p-5 sticky top-0 h-screen">
        <div className="space-y-4">
          <Link to="dashboard" className="flex items-center gap-2">
            <ChartNoAxesColumn size={22} />
            <h1>Dashboard</h1>
          </Link>
          <Link to="course" className="flex items-center gap-2">
            <SquareLibrary size={22} />
            <h1>Courses</h1>
          </Link>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;