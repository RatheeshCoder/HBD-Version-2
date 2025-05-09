import React, { useEffect, useRef, useState } from 'react';
import './Intro.scss';
import img1 from '../../assets/Img1.svg';
import img2 from '../../assets/Img2.svg';
import img3 from '../../assets/Img3.svg';
import img4 from '../../assets/Img4.svg';
import img5 from '../../assets/Img5.svg';
import img6 from '../../assets/Img6.svg';
import img7 from '../../assets/Img7.svg';
import img8 from '../../assets/Img8.svg';
import img9 from '../../assets/Img9.svg';
import img10 from '../../assets/Img10.svg';
import img11 from '../../assets/Img11.svg';
import img12 from '../../assets/Img12.svg';
import img13 from '../../assets/Img13.svg';
import img14 from '../../assets/Img14.svg';
import img15 from '../../assets/Img15.svg';
import { gsap } from 'gsap';
import birthdaySong from '../../assets/song1.mp3';
import PlayIcon from '../../assets/play.svg';
import PauseIcon from '../../assets/pause.svg';

const Intro = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const imageContainerRef = useRef(null);
    const videoRef = useRef(null);
    const animationIntervalRef = useRef(null);

    const images = [img1, img2, img15, img4, img5, img6,img7, img8, img9, img10, img11, img12,img13, img14, img3];
  



    useEffect(() => {
        const playVideo = async () => {
            try {
                if (videoRef.current) {
                    // Set up video properties
                    videoRef.current.muted = false; // Start with sound
                    videoRef.current.playsInline = true;
                    videoRef.current.loop = true;
                    
                    // Try playing the video
                    await videoRef.current.play();
                    setIsPlaying(true);
                    console.log("Autoplay started successfully");
                }
            } catch (error) {
                console.error("Autoplay failed:", error);
                // If autoplay fails, try again with muted (which has fewer restrictions)
                try {
                    if (videoRef.current) {
                        videoRef.current.muted = true;
                        await videoRef.current.play();
                        setIsPlaying(true);
                        console.log("Muted autoplay started successfully");
                        
                        // Then try to unmute after user interaction
                        const unmute = () => {
                            if (videoRef.current) {
                                videoRef.current.muted = false;
                                document.removeEventListener('click', unmute);
                                document.removeEventListener('touchstart', unmute);
                            }
                        };
                        
                        document.addEventListener('click', unmute);
                        document.addEventListener('touchstart', unmute);
                    }
                } catch (mutedError) {
                    console.error("Even muted autoplay failed:", mutedError);
                }
            }
        };

        playVideo();
        
        // Attempt to play again after a short delay
        const retryTimer = setTimeout(playVideo, 1000);
        
        return () => {
            clearTimeout(retryTimer);
            if (animationIntervalRef.current) {
                clearInterval(animationIntervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const allImages = imageContainerRef.current?.querySelectorAll('.polaroid');
        if (!allImages || allImages.length === 0) return;

        allImages.forEach((img) => {
            gsap.set(img, {
                opacity: 0,
                scale: 1.2,
                display: 'none',
            });
        });

        const currentImage = allImages[currentIndex];
        if (currentImage) {
            gsap.set(currentImage, { display: 'block' });
            gsap.fromTo(
                currentImage,
                { opacity: 0, scale: 1.2 },
                { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
            );
        }

        const timer = setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 2000);

        return () => clearTimeout(timer);
    }, [currentIndex]);





    const togglePlay = (e) => {
        e.stopPropagation();
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                if (animationIntervalRef.current) {
                    clearInterval(animationIntervalRef.current);
                }
            } else {
                videoRef.current.play()
                    
                    .catch((err) => {
                        console.error('Video play failed:', err);
                    });
            }
            setIsPlaying(!isPlaying);
        }
    };


    return (
        <section className="Intro-section-main-container">
            <div className="left-container">
                <div className="polaroid-container" ref={imageContainerRef}>
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className={`polaroid polaroid-${index}`}
                            style={{ display: 'none' }}
                        >
                            <img src={img} alt={`Polaroid photo ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="right-container">
              

            </div>

            <button className="audio-control" onClick={togglePlay}>
                <img src={!isPlaying ? PauseIcon : PlayIcon} alt={isPlaying ? 'Pause' : 'Play'} />
            </button>

            {/* Using video tag for better autoplay support */}
            <video 
                ref={videoRef}
                style={{ display: 'none' }} 
                playsInline 
                preload="auto"
                loop
            >
                <source src={birthdaySong} type="audio/mpeg" />
                Your browser does not support the video tag.
            </video>
        </section>
    );
};

export default Intro;