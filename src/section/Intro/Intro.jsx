import React, { useEffect, useRef, useState } from 'react'
import './Intro.scss'
import img1 from '../../assets/polaroid-photo.png'
import img2 from '../../assets/polaroid-photo2.png'
import img3 from '../../assets/polaroid-photo.png'
import img4 from '../../assets/polaroid-photo2.png'
import { gsap } from 'gsap'
import birthdaySong from '../../assets/Lover-Thaensudare-Bgm.mp3'
import PlayIcon from '../../assets/play.svg'
import PauseIcon from '../../assets/pause.svg'

const Intro = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [soundBars, setSoundBars] = useState(Array(40).fill(4));
    const [isMobile, setIsMobile] = useState(false);
    // State for typing animation
    const [typedWords1, setTypedWords1] = useState([]);
    
    const imageRefs = useRef([]);
    const containerRef = useRef(null);
    const audioRef = useRef(null);
    const animationIntervalRef = useRef(null);
    const typingSpeedRef = useRef(200); // typing speed in milliseconds per word
    const images = [img1, img2, img3, img4];
    
    // Full text for typing animation - split into words
    const words1 = 'உங்கள் பிறந்தநாளில் மகிழ்ச்சியும், நலமும், செழிப்பும் நிறைந்திருக்க வாழ்த்துகிறேன். இந்த சிறப்பான நாளில் உங்கள் அனைத்து கனவுகளும் நனவாக வாழ்த்துக்கள்!'.split(' ');

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    useEffect(() => {
        imageRefs.current = imageRefs.current.slice(0, images.length);

        imageRefs.current.forEach((img, index) => {
            if (img) {
                const position = getPositionByIndex(index, currentIndex, images.length);
                gsap.set(img, {
                    x: position.x,
                    y: position.y,
                    rotation: position.rotation,
                    scale: position.scale,
                    opacity: position.opacity,
                    zIndex: position.zIndex
                });
            }
        });

        const audioTimer = setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play()
                    .then(() => {
                        setIsPlaying(true);
                        startSoundAnimation();
                    })
                    .catch(err => {
                        console.error("Audio play failed:", err);
                    });
            }
        }, 0); 

        return () => {
            clearTimeout(audioTimer);
            if (animationIntervalRef.current) {
                clearInterval(animationIntervalRef.current);
            }
        };
    }, []);

    // Typing animation effect
    useEffect(() => {
        let timeoutId;
        
        // Start typing the first sentence
        const typeFirstSentence = () => {
            if (typedWords1.length < words1.length) {
                setTypedWords1(prevWords => [...prevWords, words1[prevWords.length]]);
                timeoutId = setTimeout(typeFirstSentence, typingSpeedRef.current);
            }
        };
        
        
        
        // Start the typing animation after a delay
        timeoutId = setTimeout(typeFirstSentence, 1000);
        
        return () => {
            clearTimeout(timeoutId);
        };
    }, [typedWords1.length, ]);

    const getPositionByIndex = (imgIndex, activeIndex, totalImages) => {
        let relativePosition = imgIndex - activeIndex;

        if (relativePosition < -Math.floor(totalImages / 2)) {
            relativePosition += totalImages;
        } else if (relativePosition > Math.floor(totalImages / 2)) {
            relativePosition -= totalImages;
        }

        // Adjust values for mobile
        const mobileScaleFactor = isMobile ? 0.6 : 1;
        const mobileXOffset = isMobile ? 0.7 : 1;

        let position = {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1 * mobileScaleFactor,
            opacity: 1,
            zIndex: 10
        };

        if (relativePosition === -1) {
            position = {
                x: 150 * mobileXOffset,
                y: 30,
                rotation: 15,
                scale: 0.8 * mobileScaleFactor,
                opacity: 0.8,
                zIndex: 5
            };
        }
        else if (relativePosition === -2 || relativePosition === totalImages - 2) {
            position = {
                x: 250 * mobileXOffset,
                y: 60,
                rotation: 25,
                scale: 0.6 * mobileScaleFactor,
                opacity: 0.6,
                zIndex: 1
            };
        }
        else if (relativePosition === 1) {
            position = {
                x: -150 * mobileXOffset,
                y: 30,
                rotation: -15,
                scale: 0.8 * mobileScaleFactor,
                opacity: 0.8,
                zIndex: 5
            };
        }
        else if (relativePosition === 2 || relativePosition === -(totalImages - 2)) {
            position = {
                x: -250 * mobileXOffset,
                y: 60,
                rotation: -25,
                scale: 0.6 * mobileScaleFactor,
                opacity: 0.6,
                zIndex: 1
            };
        }

        return position;
    };

    const startSoundAnimation = () => {
        if (animationIntervalRef.current) {
            clearInterval(animationIntervalRef.current);
        }
        
        animationIntervalRef.current = setInterval(() => {
            setSoundBars(prevBars =>
                prevBars.map(() => Math.floor(Math.random() * 80) + 10)
            );
        }, 800); 
    };

    const togglePlay = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                if (animationIntervalRef.current) {
                    clearInterval(animationIntervalRef.current);
                }
            } else {
                audioRef.current.play()
                    .then(() => {
                        startSoundAnimation();
                    })
                    .catch(err => {
                        console.error("Audio play failed:", err);
                    });
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        imageRefs.current.forEach((img, index) => {
            if (img) {
                const position = getPositionByIndex(index, currentIndex, images.length);

                gsap.to(img, {
                    duration: 0.8,
                    x: position.x,
                    y: position.y,
                    rotation: position.rotation,
                    scale: position.scale,
                    opacity: position.opacity,
                    zIndex: position.zIndex,
                    ease: "power2.inOut",
                    immediateRender: false
                });
            }
        });

        const changeImageInterval = setTimeout(() => {
            const nextIndex = (currentIndex + 1) % images.length;
            setCurrentIndex(nextIndex);
        }, (2 + Math.random() * 2) * 1000);

        return () => {
            clearTimeout(changeImageInterval);
        };
    }, [currentIndex, isMobile]);

    // Adjust number of sound bars for mobile
    const displayBars = isMobile ? Math.min(20, soundBars.length) : soundBars.length;

    return (
        <section className='Intro-section-main-container'>
            <div className="left-container">
                <div className="polaroid-flow" ref={containerRef}>
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className={`polaroid ${index === currentIndex ? 'active' : ''}`}
                            ref={el => imageRefs.current[index] = el}
                        >
                            <img src={img} alt={`Polaroid photo ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="right-container">
                <div className="head">
                    <h1>இனிய பிறந்தநாள் வாழ்த்துக்கள்!</h1>
                </div>

                <div className="text-content">
                    <p>
                        {typedWords1.join(' ')}
                        <span className="cursor-blink"></span>
                    </p>
                    
                  
                </div>
                <div className="sound-wave-container">
                    {soundBars.slice(0, displayBars).map((height, index) => (
                        <div
                            key={index}
                            className="sound-bar"
                            style={{ height: `${height}px` }}
                        ></div>
                    ))}
                </div>
            </div>

            <button className="audio-control" onClick={togglePlay}>
                <img src={isPlaying ? PauseIcon : PlayIcon} alt={isPlaying ? "Pause" : "Play"} />
            </button>

            <audio ref={audioRef} loop>
                <source src={birthdaySong} type="audio/mpeg" />
            </audio>
        </section>
    )
}

export default Intro