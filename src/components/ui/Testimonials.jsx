import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah & John',
    role: 'Newlyweds',
    image: '/testimonials/couple1.jpg',
    content: 'ShaadiSetGo made our wedding planning journey so much easier. We found amazing vendors who turned our dream wedding into reality.',
    rating: 5
  },
  {
    name: 'Priya & Rahul',
    role: 'Married in 2023',
    image: '/testimonials/couple2.jpg',
    content: 'The platform helped us discover unique vendors who perfectly understood our vision. Highly recommend for any couple planning their wedding!',
    rating: 5
  },
  {
    name: 'Aisha & Omar',
    role: 'Recently Engaged',
    image: '/testimonials/couple3.jpg',
    content: 'As an engaged couple, we love how easy it is to browse and compare different vendors. The booking process is seamless!',
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Love Stories from Happy Couples
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover how ShaadiSetGo has helped couples create their perfect wedding day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-card rounded-xl p-6 shadow-lg relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/10" />
              
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-accent overflow-hidden">
                  {/* Replace with actual images */}
                  <div className="h-full w-full bg-primary/10" />
                </div>
                <div>
                  <h3 className="font-medium">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-foreground/80 leading-relaxed">
                {testimonial.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 