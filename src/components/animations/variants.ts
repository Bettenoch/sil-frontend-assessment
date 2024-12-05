// Slide-up animation
export const slideUpVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };
  
  // Slide-up animation with delay
  export const slideUpVariantWithDelay = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };
  export const slideUpVariantWithDelay2 = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };
  // Slide-in from the left animation
  export const slideInFromLeftVariant = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };
  
  // Slide-in from the right animation
  export const slideInFromRightVariant = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };
  
  // Slide-in from the bottom animation
  export const slideInFromBottomVariant = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };
  
  // Fade-in animation
  export const fadeInVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    },
  };
  
  // Scale-up animation
  export const scaleUpVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };
  
  // Rotate animation (rotates 360 degrees)
  export const rotateVariant = {
    hidden: { opacity: 0, rotate: 0 },
    visible: {
      opacity: 1,
      rotate: 360,
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
  };
  
  // Bounce animation
  export const bounceVariant = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };
  
  // Stagger animation (for child elements to animate sequentially)
  export const staggerContainerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger delay between child animations
      },
    },
  };
  
  // Pulse animation
  export const pulseVariant = {
    hidden: { opacity: 0.8, scale: 1 },
    visible: {
      opacity: 1,
      scale: [1, 1.05, 1], // Pulsating effect
      transition: {
        duration: 1,
        repeat: Infinity, // Makes it repeat indefinitely
        ease: "easeInOut",
      },
    },
  };
  
  // Hover scale animation (for hover effects)
  export const hoverScaleVariant = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.3,
      },
    },
  };
  