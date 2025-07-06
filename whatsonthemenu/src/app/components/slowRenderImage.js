// components/ImageGrid.js
import { useEffect } from 'react';
import profileImage from "./img/account_profile_user_avatar_icon_219236.jpg";
import Image from 'next/image';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const SlowRenderImage = () => {
  useEffect(() => {
    // Fade in all images
    const fadeInImages = () => {
      setTimeout(() => {
        const images = document.querySelectorAll('.fade-in');
        images.forEach(img => {
          img.classList.add('loaded');
        });
      }, 100);
    };

    // Responsive behavior
    const handleResize = () => {
      const grid = document.querySelector('.grid');
      if (window.innerWidth < 768) {
        grid.classList.add('grid-cols-1');
        grid.classList.remove('grid-cols-2');
      } else {
        grid.classList.add('grid-cols-2');
        grid.classList.remove('grid-cols-1');
      }
    };

    // Initial check
    handleResize();
    fadeInImages();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="p-4 flex justify-center items-center align-center">
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* First row */}
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Image
              src={profileImage.src}
              alt="Profile image showing a professional headshot"
              className="w-full h-auto fade-in"
              id="img1"
              width={100}
              height={100}
            />
            <p className="mt-2 text-gray-700">Professional profile image</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Image
              src={profileImage.src}
              alt="Profile image showing a professional headshot"
              className="w-full h-auto fade-in"
              id="img1"
              width={100}
              height={100}
            />
            <p className="mt-2 text-gray-700">Casual portrait</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Image
              src={profileImage.src}
              alt="Profile image showing a professional headshot"
              className="w-full h-auto fade-in"
              id="img1"
              width={100}
              height={100}
            />
            <p className="mt-2 text-gray-700">Casual portrait</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Image
              src={profileImage.src}
              alt="Profile image showing a professional headshot"
              className="w-full h-auto fade-in"
              id="img1"
              width={100}
              height={100}
            />
            <p className="mt-2 text-gray-700">Casual portrait</p>
          </div>

          {/* Second row */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Image
              src={profileImage.src}
              alt="Profile image showing a professional headshot"
              className="w-full h-auto fade-in"
              id="img1"
              width={100}
              height={100}
            />
            <p className="mt-2 text-gray-700">Smiling portrait</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
           <Image
              src={profileImage.src}
              alt="Profile image showing a professional headshot"
              className="w-full h-auto fade-in"
              id="img1"
              width={100}
              height={100}
            />
            <p className="mt-2 text-gray-700">Work environment</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .fade-in {
          opacity: 0;
          transition: opacity 1s ease-in-out;
        }
        .fade-in.loaded {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default SlowRenderImage;
