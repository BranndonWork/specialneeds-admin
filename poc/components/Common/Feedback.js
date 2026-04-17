import {useTranslations} from 'next-intl';
import React from "react";
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

const Feedback = ({ bgColor, bgImage }) => {
  const t = useTranslations('feedback');
  const testimonials = t.raw('testimonials');

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="bx bxs-star"></i>);
      } else if (i - rating === 0.5) {
        stars.push(<i key={i} className="bx bxs-star-half"></i>);
      } else {
        stars.push(<i key={i} className="bx bx-star"></i>);
      }
    }
    return stars;
  };
  return (
    <>
      <div className={`feedback-area ${bgImage} ${bgColor} ptb-100`}>
        <div className="container">
          <div className="section-title">
            <h2>{t('title')}</h2>
            <p>{t('description')}</p>
          </div>

          <Swiper
            spaceBetween={25}
            pagination={{ clickable: true }}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
            modules={[Pagination]}
            className="feedback-slides"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="single-feedback-box">
                  <div className="rating">{renderStars(testimonial.rating)}</div>
                  <p>{testimonial.text}</p>
                  <div className="client-info">
                    <div className="d-flex align-items-center">
                      <Image src={testimonial.image} alt={`${t('imgAlt')} ${testimonial.name}`} width={60} height={60} />
                      <div className="title">
                        <h3>{testimonial.name}</h3>
                        <span>{testimonial.position}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default Feedback;
