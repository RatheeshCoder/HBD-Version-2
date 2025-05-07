import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import Love from './section/love/Love'
import Intro from './section/Intro/Intro'
import ChildrenIntro from './section/childrenIntro/ChildrenIntro'
import { gsap } from 'gsap'

const App = () => {
  // State to track which page is currently active
  const [currentPage, setCurrentPage] = useState('loading')
  const pageRef = useRef(null)
  
  useEffect(() => {
    // Initial setup to ensure the page is visible
    gsap.set(pageRef.current, { opacity: 1, y: 0 })
    
    // First page appears after 15 seconds
    const introTimer = setTimeout(() => {
      switchPage('intro')
    }, 15000)
    
    // Second page appears after 35 seconds (15 + 20)
    const loveTimer = setTimeout(() => {
      switchPage('love')
    }, 35000)
    
    // Third page appears after 55 seconds (15 + 20 + 20)
    const childrenTimer = setTimeout(() => {
      switchPage('children')
    }, 55000)
    
    // For immediate testing - comment these out in production
    // switchPage('intro')
    
    // Cleanup timers on unmount
    return () => {
      clearTimeout(introTimer)
      clearTimeout(loveTimer)
      clearTimeout(childrenTimer)
    }
  }, [])
  
  // Function to handle page switching with animations
  const switchPage = (newPage) => {
    // Fade out current content
    gsap.to(pageRef.current, {
      duration: 0.8,
      opacity: 0,
      y: -30,
      onComplete: () => {
        // Update the state to change the component
        setCurrentPage(newPage)
        
        // After React has updated the DOM with the new component
        setTimeout(() => {
          // Prepare the new component (off-screen and transparent)
          gsap.set(pageRef.current, { opacity: 0, y: 30 })
          
          // Animate the new component in with custom animation per page
          if (newPage === 'intro') {
            gsap.to(pageRef.current, {
              duration: 1.2,
              opacity: 1,
              y: 0,
              ease: 'power3.out'
            })
          } else if (newPage === 'love') {
            gsap.to(pageRef.current, {
              duration: 1.5,
              opacity: 1,
              y: 0,
              ease: 'back.out(1.7)'
            })
          } else if (newPage === 'children') {
            gsap.set(pageRef.current, { 
              opacity: 0, 
              scale: 0.8, 
              rotation: -5, 
              y: 0 
            })
            gsap.to(pageRef.current, {
              duration: 1.8,
              opacity: 1,
              scale: 1,
              rotation: 0,
              ease: 'elastic.out(1, 0.5)'
            })
          }
        }, 50) // Small delay to ensure DOM update
      }
    })
  }
  
  // Render the appropriate component based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'intro':
        return <Intro />
      case 'love':
        return <Love />
      case 'children':
        return <ChildrenIntro />
      default:
        return (
          <div className="loading-screen">
            <h2>Your presentation will begin shortly...</h2>
            <div className="countdown-timer">
              <div className="timer-fill"></div>
            </div>
          </div>
        )
    }
  }
  
  return (
    <div className="app-container">
      <div ref={pageRef} className="page-content">
        {renderPage()}
      </div>
    </div>
  )
}

export default App