import React, { useEffect, useRef, useState } from 'react'
import './Love.style.scss'
import Love1 from '../../assets/Love1.jpg'
import Love2 from '../../assets/Love2.jpg'
import Love3 from '../../assets/Love3.jpg'
import Love4 from '../../assets/Love4.jpg'
import gsap from 'gsap'
import PlayIcon from '../../assets/play.svg';
import PauseIcon from '../../assets/pause.svg';
import loveSong from '../../assets/song2.mp3';

const Love = () => {
  // Create refs for animating elements
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const imageContainerRef = useRef(null)
  const imageRefs = useRef([])
  const videoRef = useRef(null);
  const animationIntervalRef = useRef(null);




  const [isPlaying, setIsPlaying] = useState(false);


  // State to track screen size
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  // Function to update window size
  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useEffect(() => {
    // Add resize listener
    window.addEventListener('resize', handleResize)

    // Main timeline for animations
    const masterTl = gsap.timeline({ defaults: { ease: "power3.out" } })

    // Background animation timeline
    const bgTl = gsap.timeline()
    bgTl.to(containerRef.current, {
      backgroundColor: "#d1175a",
      duration: 4,
      ease: "sine.inOut"
    })
      .to(containerRef.current, {
        backgroundColor: "#f11864",
        duration: 4,
        ease: "sine.inOut"
      })
      .to(containerRef.current, {
        backgroundColor: "#e91e63",
        duration: 4,
        ease: "sine.inOut"
      })
      .to(containerRef.current, {
        backgroundColor: "#f11864",
        duration: 4,
        ease: "sine.inOut"
      })

    // Set the background animation to repeat
    masterTl.add(bgTl.repeat(-1), 0)

    // Initial state - set all elements to hidden
    gsap.set(titleRef.current.children, { y: -200, opacity: 0 })
    gsap.set(imageRefs.current, {
      scale: 0,
      opacity: 0,
      rotation: 0,
      y: 300,
      transformOrigin: "center center"
    })

    // Create title animation timeline
    const titleTl = gsap.timeline()

    // Animate the title letters with stagger
    titleTl.to(titleRef.current.children, {
      y: 0,
      opacity: 1,
      duration: 2,
      stagger: 0.3,
      ease: "elastic.out(1, 0.5)"
    })

    // Add title timeline to master timeline
    masterTl.add(titleTl, 0)

    // Title fade-out timeline - will be triggered during image animations
    const titleFadeOutTl = gsap.timeline()
    titleFadeOutTl.to(titleRef.current.children, {
      opacity: 0,
      y: -100,
      scale: 1.2,
      stagger: 0.4,
      duration: 1.5,
      ease: "back.in(1.2)",
      // Reverse order of letters (E-V-O-L)
      onStart: () => {
        // Reorder the stagger by reversing the children array
        gsap.utils.toArray(titleRef.current.children).reverse()
      }
    })

    // Images animation timeline
    const imagesTl = gsap.timeline()

    // First phase: Images fly in from bottom with staggered delay
    imagesTl.to(imageRefs.current, {
      y: 0,
      scale: 0.7,
      opacity: 0.8,
      rotation: gsap.utils.wrap([-15, 15, -15, 15]), // Alternate rotation for each image
      duration: 2.5,
      stagger: 0.6,
      ease: "back.out(1.7)"
    })

      // Add title fade-out at this point - when images start to move to center
      .add(titleFadeOutTl, "+=0.5")

      // Second phase: Images gather in center and spin
      .to(imageRefs.current, {
        x: (i, target) => {
          const centerX = imageContainerRef.current.clientWidth / 2
          const rect = target.getBoundingClientRect()
          return centerX - rect.left - rect.width / 2
        },
        duration: 1.5,
        stagger: 0.2,
        ease: "power1.inOut"
      }, "-=1") // Overlap with title fade-out
      .to(imageRefs.current, {
        rotation: (i) => i % 2 === 0 ? 360 : -360,
        scale: 0.5,
        duration: 2,
        ease: "power2.inOut"
      }, "<")

      // Third phase: Images spread out to final positions
      .to(imageRefs.current, {
        x: 0,
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 2,
        stagger: {
          each: 0.3,
          from: "center",
          ease: "power2.inOut"
        },
        ease: "elastic.out(0.8, 0.5)"
      })

      // Fourth phase: Final subtle floating animation
      .to(imageRefs.current, {
        y: -10,
        duration: 1.5,
        stagger: 0.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 1
      })

    // Add images timeline to master timeline with delay after title animation starts
    masterTl.add(imagesTl, 1)

    // Title reappear at the end with a burst effect
    const titleReappearTl = gsap.timeline()
    titleReappearTl.fromTo(titleRef.current.children,
      {
        opacity: 0,
        y: 50,
        scale: 0.5
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.2,
        duration: 1.2,
        ease: "back.out(1.7)",
        // Reset the stagger order (L-O-V-E)
        onStart: () => {
          gsap.utils.toArray(titleRef.current.children)
        }
      }
    )

    // Add title reappear animation at the end
    masterTl.add(titleReappearTl, 14)

    // Add hover animations for images
    imageRefs.current.forEach((img, index) => {
      img.addEventListener('mouseenter', () => {
        gsap.to(img, {
          scale: 1.1,
          rotation: index % 2 === 0 ? 5 : -5,
          boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
          zIndex: 10,
          duration: 0.4
        })
      })

      img.addEventListener('mouseleave', () => {
        gsap.to(img, {
          scale: 1,
          rotation: 0,
          boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
          zIndex: 5,
          duration: 0.4
        })
      })
    })

    // Return cleanup function
    return () => {
      masterTl.kill()
      window.removeEventListener('resize', handleResize)

      // Clean up event listeners
      imageRefs.current.forEach((img) => {
        img.removeEventListener('mouseenter', () => { })
        img.removeEventListener('mouseleave', () => { })
      })
    }
  }, [])

  // Reset animations on resize
  useEffect(() => {
    // This effect will run when windowSize changes
    // You could refresh animations here if needed
  }, [windowSize])

  // Function to set the image refs
  const addToImageRefs = (el) => {
    if (el && !imageRefs.current.includes(el)) {
      imageRefs.current.push(el)
    }
  }


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
    <div className='Love-section-main-container' ref={containerRef}>
      {/* Decorative particles */}
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>

      <div className="head-title" ref={titleRef}>
        <h1>L</h1>
        <h1>O</h1>
        <h1>V</h1>
        <h1>E</h1>
      </div>

      <div className="image-container" ref={imageContainerRef}>
        <div className="img-content" ref={addToImageRefs}>
          <img src={Love1} alt="Love image 1" />
        </div>

        <div className="img-content" ref={addToImageRefs}>
          <img src={Love4} alt="Love image 4" />
        </div>

        <div className="img-content" ref={addToImageRefs}>
          <img src={Love3} alt="Love image 3" />
        </div>

        <div className="img-content" ref={addToImageRefs}>
          <img src={Love2} alt="Love image 2" />
        </div>
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
        <source src={loveSong} type="audio/mpeg" />
        Your browser does not support the video tag.
      </video>

    </div>
  )
}

export default Love