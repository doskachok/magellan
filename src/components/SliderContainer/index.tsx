import { ReactElement, useRef, useState } from "react";
import SlickSlider from "react-slick";
import { SliderItemsWrapper, SliderNavItem } from "./index.styled";
import { useTranslation } from "react-i18next";
import { Column } from "components/Containers";

// react-slick is CommonJS; under Vite its default export can arrive wrapped in a module object.
const Slider = (SlickSlider as unknown as { default?: typeof SlickSlider }).default ?? SlickSlider;

interface Props {
  sliderItems?: any[];
  className: string | undefined;
  translationGroup: string;
  children: ReactElement<any>[];
}

const SliderContainer = ({ sliderItems, className, translationGroup, children }: Props) => {
  const { t } = useTranslation(translationGroup);
  const sliderRef = useRef<SlickSlider>(null);
  const [activeSliderItem, setActiveSliderItem] = useState<string>(sliderItems ? sliderItems[0] : '');
  
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    className: className,
    beforeChange: (_: number, next: number) => setActiveSliderItem(sliderItems ? sliderItems[next] : '')
  }; 

  const renderNavigationMenu = (sliderItems: any[]) => {
    return (
      <SliderItemsWrapper>
        {sliderItems.map((item, idx) => {
          return (
            <SliderNavItem 
              key={item}
              isActive={activeSliderItem === item} 
              onClick={() => { setActiveSliderItem(item); sliderRef.current?.slickGoTo(idx); }}
            >
              {t(item + 'SliderItem')}
            </SliderNavItem>
          )
        })}
      </SliderItemsWrapper>
    );
  } 

  return (
    <Column fullHeight fullWidth> 
      {/* Slider navigation bar */}
      { sliderItems ? renderNavigationMenu(sliderItems) : null}

      {/* Slider elements */}
      <Slider {...settings} ref={sliderRef}> {children} </Slider>
    </Column>
  )
}

export default SliderContainer;