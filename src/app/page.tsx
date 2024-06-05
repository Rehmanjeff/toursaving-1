import React, { FC } from "react";
import SectionHeroArchivePage from "@/app/(server-components)/SectionHeroArchivePage";
import HeroRightImage from "@/images/hero-right-car.png";
import BackgroundSection from "@/components/BackgroundSection";
import SectionSliderNewCategories from "@/components/SectionSliderNewCategories";
import SectionSubscribe2 from "@/components/SectionSubscribe2";
import BgGlassmorphism from "@/components/BgGlassmorphism";

export interface ListingCarPageProps {}

const ListingCarPage: FC<ListingCarPageProps> = () => {
  return (
   <div className={`nc-ListingCarMapPage relative `}>
      <BgGlassmorphism />
      <div className="container pt-10 pb-24 lg:pt-16 lg:pb-28">
         <SectionHeroArchivePage rightImage={HeroRightImage} currentTab="Transfer" />
      </div>
      <div className="container overflow-hidden">
         <div className="relative py-16">
            <BackgroundSection />
            <SectionSliderNewCategories heading="Explore by types of stays" subHeading="Explore houses based on 10 types of stays" categoryCardType="card5" itemPerRow={5} sliderStyle="style2" />
         </div>

         <SectionSubscribe2 className="py-24 lg:py-28" />
      </div>
   </div>
  );
};

export default ListingCarPage;
