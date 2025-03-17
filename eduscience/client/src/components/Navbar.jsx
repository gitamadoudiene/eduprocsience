/* eslint-disable no-unused-vars */
import { GraduationCap, Menu } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { assets } from "@/assets/assets";
import { Search, Home, BookOpen, LayoutDashboard } from "lucide-react"; // Exemple avec Lucide icon

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false); // État pour gérer l'ouverture/fermeture de la barre de recherche
  const searchRef = useRef(null); // Référence pour détecter les clics en dehors de la barre de recherche
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
    setIsSearchOpen(false); // Fermer la barre de recherche après la soumission
  };

  // Fermer la barre de recherche lors d'un clic en dehors
  useEffect(() => {
    // Ajouter l'écouteur d'événement
  }, [searchRef]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Déconnexion réussie");
      navigate("/");
// Rafraîchir la page après la déconnexion
    }
  }, [isSuccess]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-16 dark:bg-[#0A0A0A] bg-dark-blue border-b dark:border-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10 shadow-lg"
    >
      {/* Version ordinateur */}
      <div className="max-w-7xl mx-auto hidden md:flex items-center justify-between gap-10 h-full">
        <div className="flex items-center gap-2">
          <GraduationCap
            size={"30"}
            className="text-white hover:text-teal-200 transition-colors duration-300"
          />
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="hidden md:block font-extrabold text-2xl text-white cursor-pointer"
            onClick={() => navigate("/")}
          >
            Edu-Pro-Science
          </motion.h1>
        </div>

        {/* Barre de recherche */}

        {/* Icône utilisateur et mode nuit */}
        <div className="flex items-center gap-24">
          <div className="flex items-center gap-2 ">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-2" ref={searchRef}></div>
              <div className="flex items-center gap-9 text-white font-bold text-xl ">
                {user &&
                (user.role === "Élève" || user.role === "Proffesseur") ? (
                  isSearchOpen ? (
                    <motion.form
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="max-w-xl w-full md:h-10 h-12 flex items-center rounded-full bg-white border border-gray-300 shadow-sm"
                      onSubmit={searchHandler}
                    >
                      <img
                        src={assets.search_icon}
                        alt="search_icon"
                        className="md:w-auto w-10 px-3 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher un Cours"
                        className="w-full h-full outline-none text-gray-500/80 placeholder-gray-400"
                      />
                      <Button
                        type="submit"
                        className="h-9 bg-dark-blue rounded-full text-white md:px-4 px-7 md:py-2 py-3 mx-1 hover:bg-medium-blue transition-colors duration-300"
                      >
                        Rechercher
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setIsSearchOpen(true)}
                      className="cursor-pointer"
                    >
                      <Search className="w-7 h-7 text-white cursor-pointer" />
                    </motion.div>
                  )
                ) : null}

                {user
                  ? (user.role === "Élève" || user.role === "Proffesseur") && (
                      <motion.h1
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 border-b border-gray-500 "
                      >
                        <Home size={24} />
                        <Link to="/" className="w-full ">
                          <span>Accueil</span>
                        </Link>
                      </motion.h1>
                    )
                  : null}

                {user
                  ? user.role === "Élève" && (
                      <motion.h1
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 border-b border-gray-500"
                      >
                        <BookOpen size={24} />
                        <Link to="my-learning" className="w-full ">
                          <span>Mes Cours</span>
                        </Link>
                      </motion.h1>
                    )
                  : null}

                {user
                  ? user.role === "Proffesseur" && (
                      <motion.h1 whileHover={{ scale: 1.05 }}>
                        <Link
                          to="/admin/dashboard"
                          className="w-full border-b border-gray-500 flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-5 h-5" />{" "}
                          {/* Icône Dashboard */}
                          <span>Dashboard</span>
                        </Link>
                      </motion.h1>
                    )
                  : null}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={user?.photoUrl || assets.user_icon}
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild></DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="profile" className="w-full">
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                  {user.role === "Proffesseur" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild></DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    variant="outline"
                    className="text-dark-blue dark:text-white hover:bg-gray-700 hover:text-dark-blue transition-colors duration-300"
                    onClick={() => navigate("/login")}
                  >
                    Connexion
                  </Button>
                </motion.div>
              </div>
            )}
            <DarkMode />
          </div>
        </div>
      </div>

      {/* Version mobile */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        {/* Condition pour masquer "Edu-Pro-Science" lorsque la loupe est cliquée */}
        {!isSearchOpen && (
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="font-extrabold text-2xl text-white cursor-pointer"
            onClick={() => navigate("/")}
          >
            Edu-Pro-Science
          </motion.h1>
        )}

        <div className="flex items-center gap-3 pt-2">
        {user &&
                (user.role === "Élève" || user.role === "Proffesseur") ? (
                  isSearchOpen ? (
                    <motion.form
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="max-w-xl w-full md:h-10 h-9 flex items-center rounded-full bg-white border border-gray-300 shadow-sm"
                      onSubmit={searchHandler}
                    >
                      <img
                        src={assets.search_icon}
                        alt="search_icon"
                        className="md:w-auto w-10 px-3 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher un Cours"
                        className="w-full h-full outline-none text-gray-500/80 placeholder-gray-400 placeholder:text-sm"
                      />
                      <Button
                        type="submit"
                        className="h-8 bg-dark-blue rounded-full text-white md:px-4 px-4 md:py-2 py-2 text-sm hover:bg-medium-blue transition-colors duration-300"
                      >
                        Rechercher
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setIsSearchOpen(true)}
                      className="cursor-pointer"
                    >
                      <Search className="w-7 h-7 text-white cursor-pointer" />
                    </motion.div>
                  )
                ) : null}
          <MobileNavbar />
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;

const MobileNavbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  // Référence pour fermer le menu
  const sheetCloseRef = useRef(null);

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Déconnexion réussie");
      navigate("/login");
 // Rafraîchir la page après la déconnexion
    }
  }, [isSuccess]);

  return (
    <Sheet>
      <SheetTrigger>
        <motion.div whileHover={{ scale: 1.1 }}>
          <Button
            size="icon"
            className="rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-300"
            variant="outline"
          >
            <Avatar className="h-8 w-8 cursor-pointer ">
              <AvatarImage
                src={user?.photoUrl || assets.user_icon}
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
        </motion.div>
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-white dark:bg-[#0A0A0A]">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle className="text-dark-blue dark:text-white">
            Edu-Pro-Science
          </SheetTitle>
          <DarkMode />
        </SheetHeader>

        <Separator />

        <nav className="flex flex-col space-y-4">
          {user ? (
            <>
              {/* Lien "Mes Cours" */}
              <SheetClose asChild>
                <Link
                  to="my-learning"
                  className="text-dark-blue dark:text-white hover:text-teal-200 transition-colors duration-300"
                  onClick={() => sheetCloseRef.current?.click()} // Fermer le menu après la navigation
                >
                  <span>Mes Cours</span>
                </Link>
              </SheetClose>

              {/* Lien "Profil" */}
              <SheetClose asChild>
                <Link
                  to="profile"
                  className="text-dark-blue dark:text-white hover:text-teal-200 transition-colors duration-300"
                  onClick={() => sheetCloseRef.current?.click()} // Fermer le menu après la navigation
                >
                  <span>Profil</span>
                </Link>
              </SheetClose>

              {/* Bouton "Se déconnecter" */}
              <SheetClose asChild>
                <span
                  onClick={() => {
                    logoutHandler(); // Appel de la fonction de déconnexion
                    sheetCloseRef.current?.click(); // Fermer le menu
                  }}
                  className="text-dark-blue dark:text-white hover:text-teal-200 transition-colors duration-300 cursor-pointer"
                >
                  Se déconnecter
                </span>
              </SheetClose>
            </>
          ) : (
            /* Lien "Connexion" */
            <SheetClose asChild>
              <Link
                to="/login"
                className="text-dark-blue dark:text-white hover:text-teal-200 transition-colors duration-300"
                onClick={() => sheetCloseRef.current?.click()} // Fermer le menu après la navigation
              >
                <span>Connexion</span>
              </Link>
            </SheetClose>
          )}
        </nav>

        {/* Bouton "Dashboard" pour les instructeurs */}
        {user?.role === "Proffesseur" && (
          <SheetClose asChild>
            <Link
              to="/admin/dashboard"
              className="w-full bg-dark-blue text-white hover:bg-dark-blue/90 transition-colors duration-300 flex justify-center items-center py-2 rounded-md mt-4"
              onClick={() => sheetCloseRef.current?.click()} // Fermer le menu après la navigation
            >
              <span>Dashboard</span>
            </Link>
          </SheetClose>
        )}
      </SheetContent>
    </Sheet>
  );
};
