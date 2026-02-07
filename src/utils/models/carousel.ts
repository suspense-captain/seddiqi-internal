export interface CarouselProps {
    slides: any; 
    setSwiper: any; 
    setActiveIndex: (index: number) => void; 
    setTransition: any; 
    setSpeed: any; 
    isAnimated: any
    opacity?: number; 
    className?: any; 
    imgClass?: any; 
    children?: React.ReactNode;
  }
  