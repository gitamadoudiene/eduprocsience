/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  return (
    <div
      className='flex flex-col items-start justify-center w-full md:pt-10 pt-20 p-20 md:px-0 space-y-7 text-right'
      style={{
        backgroundImage: `url(https://previews.123rf.com/images/dumrongsak/dumrongsak2001/dumrongsak200100087/140425205-joli-scientifique-regardant-%C3%A0-travers-un-microscope-dans-un-laboratoire-de-chimie-science-et.jpg)`, // Utilisez votre image ici
        backgroundSize: 'cover', // Ajuste la taille de l'image pour couvrir tout l'espace
        backgroundPosition: 'center', // Centre l'image
        backgroundRepeat: 'no-repeat', // Empêche la répétition de l'image
      }}
    >
      <div className='flex flex-col items-center md:items-start justify-center w-full m-10  p-8 rounded-lg  dark:bg-gray-900 dark:bg-opacity-80'>
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='md:text-4xl text-xl font-bold text-black max-w-3xl dark:text-white'
        >
          Découvre le monde passionnant des Sciences <br />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='md:block hidden text-gray-700 max-w-2xl text-lg dark:text-white'
        >
          Que tu sois au collège ou au lycée, ici, tu trouveras des cours clairs,
          des exercices interactifs et des ressources pour t’aider à comprendre et réussir.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className='md:block hidden text-gray-600 max-w-2xl space-y-2 text-center'
        >
          <p>🧪 <span className="text-green-600 font-semibold dark:text-white">Apprends à ton rythme</span></p>
          <p>🌍 <span className="text-blue-600 font-semibold dark:text-white">Explore la nature et les sciences</span></p>
          <p>🎯 <span className="text-red-600 font-semibold dark:text-white">Prépare-toi pour tes examens en toute confiance</span></p>
          <p className="mt-4 text-xl font-bold text-gray-800 dark:text-white">Prêt à démarrer ? 🚀</p>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;