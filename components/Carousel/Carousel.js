import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import s from "./Carousel.css";

class Carousel extends React.Component{
    constructor(props){
        super(props);
    }

    render() {
        let settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 4,
            initialSlide: 0,
            responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                    }
                }, {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        initialSlide: 2,
                        dots:false
                    }
                }, {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: false
                    }
            }]
        };
        return (
            <div className={s.carouselContent}>
              <Slider {...settings}>
                <div><h3>Game 1</h3></div>
                <div><h3>Game 2</h3></div>
                <div><h3>Game 3</h3></div>
                <div><h3>Game 4</h3></div>
                <div><h3>Game 5</h3></div>
                <div><h3>Game 6</h3></div>
              </Slider>
            </div>
        );
    }
}

export default Carousel;