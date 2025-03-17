
/* eslint-disable no-unused-vars */
import React from 'react'


const Footer = () => {
  return (
   <div className='bg-gray-800 md:px-36 text-left w-full mt-10'>
    <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-30 md:py-10 sm:py-4 border-b border-white/30'>
      <div className='flex flex-col md:items-start items-center w-full'>
      <span className="text-xs sm:text-2xl md:text-3xl font-bold  cursor-pointer  text-white"  >Edu-Pro-Sciences</span>
        <p className='hidden sm:block mt-6 text-white text-sm text-center md:text-left '>
        L'apprentissage est la clé qui ouvre les portes de la connaissance.
         Explore, découvre et grandis avec nous dans le monde fascinant des sciences
        </p>
      </div>
      <div className='hidden sm:block  flex-col md:items-start items-center w-full '>
        <h2 className='text-white mb-5 font-semibold'>Liens utiles</h2>
      <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>
        <li><a href="/">Acceuil"</a></li>
        <li><a href='/my-enrollments'>Mes Cours</a></li>
        <li><a href="#">Conditions d'utilisation</a></li>
        
      </ul>
      </div>
      <div className='hidden md:flex flex-col items-start  w-full'>
        <h2 className='font-semibold text-white mb-5'>
          Souscriver à notre newsletter
        </h2>
        <p className='text-sm text-white/80'>
          Inscrivez-vous pour recevoir les derniers articles et les offres exclusives.
        </p>
         <div className='flex items-center gap-2 pt-4'>
        <input type="email" placeholder="Votre adresse email" className='border border-gray-500/30
         bg-gray-800 text-white placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm' />
        <button className='bg-dark-blue w-24 h-9 text-white rounded'>Souscrire</button>
      </div>
      </div>

      
    </div>
    <p className='text-white/60 text-center py-2 text-xs md-text-sm'> © 2025 Edu-Pro-Sciences Tous droits reservés	</p>
   </div>
  )
}

export default Footer