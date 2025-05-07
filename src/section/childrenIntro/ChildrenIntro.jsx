import React, { useEffect, useRef, useState } from 'react';
import './ChildrenIntro.scss';
import child1 from '../../assets/child1.jpg';
import child2 from '../../assets/child2.jpg';
import child3 from '../../assets/child3.jpg';
import child4 from '../../assets/child4.jpg';
import child5 from '../../assets/child5.jpg';
import child6 from '../../assets/child6.jpg';
import { gsap } from 'gsap';

import PlayIcon from '../../assets/play.svg';
import PauseIcon from '../../assets/pause.svg';
import childSong from '../../assets/song3.mp3';

const ChildrenIntro = () => {
    const sectionRef = useRef(null);
    const imagesRef = useRef([]);
    const timelineRef = useRef(null);

    const videoRef = useRef(null);
    const animationIntervalRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const addToImagesRef = (el) => {
        if (el && !imagesRef.current.includes(el)) {
            imagesRef.current.push(el);
        }
    };

    const colorThemes = [
        { background: '#97a38f', shadow: 'rgba(0, 0, 0, 0.3)' },
        { background: '#ffcf8c', shadow: 'rgba(255, 150, 0, 0.3)' },
        { background: '#a8d8ea', shadow: 'rgba(0, 150, 255, 0.3)' },
        { background: '#ffdfd3', shadow: 'rgba(255, 100, 100, 0.3)' },
        { background: '#d5ecc2', shadow: 'rgba(100, 200, 100, 0.3)' }
    ];

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });

            if (timelineRef.current && !timelineRef.current.isActive()) {
                repositionElements();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const repositionElements = () => {
        imagesRef.current.forEach((img, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);

            const gridSpacing = getResponsiveGridSpacing();

            gsap.to(img, {
                left: `calc(50% - ${gridSpacing.totalWidth / 2}px + ${col * gridSpacing.itemWidth + gridSpacing.itemWidth / 2}px - ${img.offsetWidth / 2}px)`,
                top: `calc(50% - ${gridSpacing.totalHeight / 2}px + ${row * gridSpacing.itemHeight + gridSpacing.itemHeight / 2}px - ${img.offsetHeight / 2}px)`,
                duration: 0.5
            });
        });
    };

    const getResponsiveGridSpacing = () => {
        const width = windowSize.width;
        const height = windowSize.height;

        let totalWidth, totalHeight, imgScale;

        if (width < 480) {
            totalWidth = Math.min(width - 40, 300);
            totalHeight = Math.min(height - 100, 400);
            imgScale = 0.6;
        } else if (width < 768) {
            totalWidth = Math.min(width - 80, 500);
            totalHeight = Math.min(height - 150, 500);
            imgScale = 0.7;
        } else {
            totalWidth = Math.min(width - 200, 900);
            totalHeight = Math.min(height - 200, 600);
            imgScale = 0.9;
        }

        return {
            totalWidth,
            totalHeight,
            itemWidth: totalWidth / 3,
            itemHeight: totalHeight / 2,
            imgScale
        };
    };

    const getResponsiveImageSize = () => {
        const width = windowSize.width;

        if (width < 480) {
            return {
                maxWidth: '100px',
                borderWidth: '4px'
            };
        } else if (width < 768) {
            return {
                maxWidth: '150px',
                borderWidth: '6px'
            };
        } else {
            return {
                maxWidth: '250px',
                borderWidth: '8px'
            };
        }
    };

    const createSparkle = (container) => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
        sparkle.style.animationDelay = `${Math.random() * 2}s`;

        if (windowSize.width < 480) {
            sparkle.style.width = '8px';
            sparkle.style.height = '8px';
        } else if (windowSize.width < 768) {
            sparkle.style.width = '10px';
            sparkle.style.height = '10px';
        } else {
            sparkle.style.width = '15px';
            sparkle.style.height = '15px';
        }

        container.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 3000);
    };

    useEffect(() => {
        const imgSize = getResponsiveImageSize();
        const gridSpacing = getResponsiveGridSpacing();

        const getAnimationRadius = () => {
            const minDimension = Math.min(windowSize.width, windowSize.height);
            if (windowSize.width < 480) {
                return minDimension * 0.2;
            } else if (windowSize.width < 768) {
                return minDimension * 0.25;
            } else {
                return minDimension * 0.3;
            }
        };

        const animationRadius = getAnimationRadius();

        imagesRef.current.forEach((img, index) => {
            img.style.position = 'absolute';
            img.style.opacity = '0';
            img.style.maxWidth = imgSize.maxWidth;
            img.style.borderRadius = windowSize.width < 480 ? '10px' : '20px';
            img.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
            img.style.border = `${imgSize.borderWidth} solid white`;
            img.style.zIndex = index;
        });

        timelineRef.current = gsap.timeline({
            repeat: 0,
            onComplete: () => {
                imagesRef.current.forEach(img => {
                    gsap.to(img, {
                        y: '-=15',
                        duration: 0.3,
                        yoyo: true,
                        repeat: 3,
                        ease: 'power1.inOut'
                    });
                });
            }
        });

        const tl = timelineRef.current;

        tl.fromTo(imagesRef.current,
            {
                scale: 0,
                rotation: -15,
                opacity: 0
            },
            {
                scale: 1,
                rotation: () => Math.random() * 20 - 10,
                opacity: 1,
                duration: 1.5,
                ease: 'elastic.out(1, 0.5)',
                stagger: 0.3,
                onComplete: function () {
                    for (let j = 0; j < 5; j++) {
                        createSparkle(sectionRef.current);
                    }
                }
            }
        )

            .to(imagesRef.current, {
                left: (i, el) => {
                    const angle = (i / imagesRef.current.length) * Math.PI * 2;
                    return `calc(50% + ${Math.cos(angle) * animationRadius}px - ${el.offsetWidth / 2}px)`;
                },
                top: (i, el) => {
                    const angle = (i / imagesRef.current.length) * Math.PI * 2;
                    return `calc(50% + ${Math.sin(angle) * animationRadius}px - ${el.offsetHeight / 2}px)`;
                },
                duration: 2,
                ease: 'power2.inOut',
                stagger: 0.1,
                onUpdate: function () {
                    if (Math.random() < 0.1) {
                        createSparkle(sectionRef.current);
                    }
                }
            })

            .to(imagesRef.current, {
                left: (i, el) => {
                    const angle = ((i / imagesRef.current.length) * Math.PI * 2) + Math.PI; // Half rotation
                    return `calc(50% + ${Math.cos(angle) * animationRadius}px - ${el.offsetWidth / 2}px)`;
                },
                top: (i, el) => {
                    const angle = ((i / imagesRef.current.length) * Math.PI * 2) + Math.PI; // Half rotation
                    return `calc(50% + ${Math.sin(angle) * animationRadius}px - ${el.offsetHeight / 2}px)`;
                },
                rotation: (i) => i % 2 === 0 ? 10 : -10,
                duration: 4,
                ease: 'sine.inOut'
            })

            .to(imagesRef.current[0], {
                left: 'calc(50% - 125px)',
                top: 'calc(50% - 125px)',
                scale: windowSize.width < 768 ? 1.2 : 1.3,
                rotation: 0,
                zIndex: 10,
                duration: 1,
                ease: 'back.out(1.7)'
            })
            .to(imagesRef.current[0], {
                scale: 1,
                left: (i, el) => {
                    const angle = Math.PI * 0.5; 
                    return `calc(50% + ${Math.cos(angle) * animationRadius}px - ${el.offsetWidth / 2}px)`;
                },
                top: (i, el) => {
                    const angle = Math.PI * 0.5; 
                    return `calc(50% + ${Math.sin(angle) * animationRadius}px - ${el.offsetHeight / 2}px)`;
                },
                duration: 1
            }, '+=0.7')
            .to(imagesRef.current[1], {
                left: 'calc(50% - 125px)',
                top: 'calc(50% - 125px)',
                scale: windowSize.width < 768 ? 1.2 : 1.3,
                rotation: 0,
                zIndex: 11,
                duration: 1,
                ease: 'back.out(1.7)'
            }, '-=0.3')
            .to(imagesRef.current[1], {
                scale: 1,
                left: (i, el) => {
                    const angle = Math.PI * 1.5; 
                    return `calc(50% + ${Math.cos(angle) * animationRadius}px - ${el.offsetWidth / 2}px)`;
                },
                top: (i, el) => {
                    const angle = Math.PI * 1.5; 
                    return `calc(50% + ${Math.sin(angle) * animationRadius}px - ${el.offsetHeight / 2}px)`;
                },
                duration: 1
            }, '+=0.7')

            .to(sectionRef.current, {
                backgroundColor: colorThemes[1].background,
                duration: 1,
            }, '-=1')
            .to(imagesRef.current, {
                boxShadow: `0 10px 20px ${colorThemes[1].shadow}`,
                duration: 1,
            }, '-=1')
            .to(imagesRef.current, {
                y: (i) => i % 2 === 0 ? '-=20' : '+=20',
                duration: 2,
                ease: 'sine.inOut',
                repeat: 1,
                yoyo: true
            }, '-=1')
            .to(sectionRef.current, {
                backgroundColor: colorThemes[2].background,
                duration: 1,
            }, '-=3')
            .to(imagesRef.current, {
                boxShadow: `0 10px 20px ${colorThemes[2].shadow}`,
                duration: 1,
            }, '-=3')

            .to(imagesRef.current, {
                left: (i, el) => {
                    const col = i % 3;
                    return `calc(50% - ${gridSpacing.totalWidth / 2}px + ${col * gridSpacing.itemWidth + gridSpacing.itemWidth / 2}px - ${el.offsetWidth / 2}px)`;
                },
                top: (i, el) => {
                    const row = Math.floor(i / 3);
                    return `calc(50% - ${gridSpacing.totalHeight / 2}px + ${row * gridSpacing.itemHeight + gridSpacing.itemHeight / 2}px - ${el.offsetHeight / 2}px)`;
                },
                rotation: 0,
                scale: gridSpacing.imgScale,
                duration: 2,
                ease: 'power3.inOut',
                stagger: {
                    from: 'center',
                    amount: 0.5
                },
            })
            .to(sectionRef.current, {
                backgroundColor: colorThemes[3].background,
                duration: 1,
            }, '-=2')
            .to(imagesRef.current, {
                boxShadow: `0 10px 20px ${colorThemes[3].shadow}`,
                duration: 1,
            }, '-=2');

        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
        };
    }, [windowSize]);

    const handleMouseEnter = (index) => {
        if (!timelineRef.current.isActive()) {
            const scale = windowSize.width < 768 ? 1.05 : 1.1;
            const rotation = windowSize.width < 768 ? (index % 2 === 0 ? '+=3' : '-=3') : (index % 2 === 0 ? '+=5' : '-=5');

            gsap.to(imagesRef.current[index], {
                scale,
                rotation,
                duration: 0.3
            });

            for (let i = 0; i < 3; i++) {
                createSparkle(sectionRef.current);
            }
        }
    };

    const handleMouseLeave = (index) => {
        if (!timelineRef.current.isActive()) {
            gsap.to(imagesRef.current[index], {
                scale: getResponsiveGridSpacing().imgScale,
                rotation: 0,
                duration: 0.3
            });
        }
    };

    const handleTouchStart = (index) => {
        handleMouseEnter(index);
    };



    useEffect(() => {
        const playVideo = async () => {
            try {
                if (videoRef.current) {
                    videoRef.current.muted = false;
                    videoRef.current.playsInline = true;
                    videoRef.current.loop = true;

                    await videoRef.current.play();
                    setIsPlaying(true);
                    console.log("Autoplay started successfully");
                }
            } catch (error) {
                console.error("Autoplay failed:", error);
                try {
                    if (videoRef.current) {
                        videoRef.current.muted = true;
                        await videoRef.current.play();
                        setIsPlaying(true);
                        console.log("Muted autoplay started successfully");

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

        const retryTimer = setTimeout(playVideo, 0);

        return () => {
            clearTimeout(retryTimer);
            if (animationIntervalRef.current) {
                clearInterval(animationIntervalRef.current);
            }
        };
    }, []);







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
        <section className='children-section-main-container' ref={sectionRef}>
            <img
                src={child1}
                alt="Happy child"
                ref={addToImagesRef}
                onMouseEnter={() => handleMouseEnter(0)}
                onMouseLeave={() => handleMouseLeave(0)}
                onTouchStart={() => handleTouchStart(0)}
            />
            <img
                src={child2}
                alt="Happy child"
                ref={addToImagesRef}
                onMouseEnter={() => handleMouseEnter(1)}
                onMouseLeave={() => handleMouseLeave(1)}
                onTouchStart={() => handleTouchStart(1)}
            />
            <img
                src={child3}
                alt="Happy child"
                ref={addToImagesRef}
                onMouseEnter={() => handleMouseEnter(2)}
                onMouseLeave={() => handleMouseLeave(2)}
                onTouchStart={() => handleTouchStart(2)}
            />
            <img
                src={child4}
                alt="Happy child"
                ref={addToImagesRef}
                onMouseEnter={() => handleMouseEnter(3)}
                onMouseLeave={() => handleMouseLeave(3)}
                onTouchStart={() => handleTouchStart(3)}
            />
            <img
                src={child5}
                alt="Happy child"
                ref={addToImagesRef}
                onMouseEnter={() => handleMouseEnter(4)}
                onMouseLeave={() => handleMouseLeave(4)}
                onTouchStart={() => handleTouchStart(4)}
            />
            <img
                src={child6}
                alt="Happy child"
                ref={addToImagesRef}
                onMouseEnter={() => handleMouseEnter(5)}
                onMouseLeave={() => handleMouseLeave(5)}
                onTouchStart={() => handleTouchStart(5)}
            />


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
                <source src={childSong} type="audio/mpeg" />
                Your browser does not support the video tag.
            </video>

        </section>
    );
};

export default ChildrenIntro;