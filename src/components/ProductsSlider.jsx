import React from "react";
import Slider from "react-slick";
import styled from 'styled-components';

const ColorBox = styled.div`
  background: ${props => props.background};
  height: 15rem;
  width: 100%;
`;

const SliderArrow = styled.i`
  font-size: 5em;
  z-index: 10;
  cursor: pointer;
`;

const LeftArrow = SliderArrow.extend`
  left: -2.5rem;
`;

const RightArrow = SliderArrow.extend`
  right: -2.5rem;
`;

const SlickPrevArrow = ({ className, onClick }) => (
  <LeftArrow
    className='fa fa-chevron-left'
    onClick={onClick}
  />
);

const SlickNextArrow = ({ className, style, onClick }) => (
  <RightArrow
    className='fa fa-chevron-right'
    onClick={onClick}
  />
);

const ProductSlider = ({products}) => {
  
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: true,
    autoplaySpeed: 3000,
    autoplay: true,
    prevArrow: <SlickPrevArrow />,
    nextArrow: <SlickNextArrow />
  };

  return (
    <Slider style={{position: 'relative', height: '100%'}} {...settings}>
      {products && products.map(item => (
        <ColorBox background={item.product} key={item.key}/>
      ))}
    </Slider>
  );

}

export default ProductSlider;