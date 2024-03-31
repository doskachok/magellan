import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Column, PageWrapper } from 'components/Containers';
import Header from 'components/Header';

import { useLazyGetTransactionGroupByIdQuery } from '../api';

import GroupForm from './groupForm';
import Members from '../Members';

import { ROUTES } from 'constants/routes';

import { ReactComponent as BackIconSVG } from 'assets/images/back-icon.svg';
import { SliderItemsWrapper, SliderNavItem } from './index.styled';

import Slider from "react-slick";

const Edit = () => {
  const { t } = useTranslation('groups');
  const navigate = useNavigate();
  const { groupId } = useParams();
  const sliderItems = ["mainInfo", "members", "statistics"];

  const [getGroup, { data: group }] = useLazyGetTransactionGroupByIdQuery();
  const [activeSliderItem, setActiveSliderItem] = useState<string>(sliderItems[0]);

  const handleBackAction = useCallback(() => {
    navigate(ROUTES.GROUPS.ROOT, { replace: true });
  }, [navigate]);


  useEffect(() => {
    if (groupId) {
      getGroup(groupId);
    }
  }, [groupId, getGroup]);

  let sliderRef = useRef<Slider>(null);

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    className: "w-100",
    beforeChange: (current: number, next: number) => setActiveSliderItem(sliderItems[next])
    //afterChange: (current: number) => setActiveSliderItem(sliderItems[current])
  };

  const sliderPagesList = (sliderItems: Array<string>) => {
    return <SliderItemsWrapper>
      {sliderItems.map((item, idx) => {
        return (
          <SliderNavItem isActive={activeSliderItem == item} onClick={() => { setActiveSliderItem(item); sliderRef.current?.slickGoTo(idx); }}>
            {t(item + 'SliderItem')}
          </SliderNavItem>)
      })}
    </SliderItemsWrapper>

  }

  //sliderRef && sliderRef.slickGoTo(e.target.value)

  return (<>
    <PageWrapper>
      <>
        <Header
          text={t(groupId ? 'updateGroup' : 'createGroup')}
          leftActionComponent={<BackIconSVG onClick={handleBackAction} />}
        />

        <Column fullHeight fullWidth> <>
          {sliderPagesList(sliderItems)}
          <Slider {...settings} ref={sliderRef}>
            <GroupForm group={group} />

            {groupId ? <Members groupId={groupId} /> : null}
            {groupId ? <div>Not implemented</div> : null}
          </Slider>
        </>
        </Column>
      </>
    </PageWrapper>
  </>
  );
};

export default Edit;
