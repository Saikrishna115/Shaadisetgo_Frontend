
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState([]);


  const toggleItem = () => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "How does ShaadiSetGo work?",
      answer: "ShaadiSetGo connects you with verified wedding vendors in your area. Simply search for the services you need, compare quotes from multiple vendors, and book directly through our platform. We handle the coordination to make your planning process seamless."
    },
    {
      question: "Is ShaadiSetGo free to use?",
      answer: "Yes! ShaadiSetGo is completely free for couples. We earn a small commission from vendors when you book through our platform, but there are no fees for browsing, comparing quotes, or using our planning tools."
    },
    {
      question: "How are vendors verified?",
      answer: "All vendors go through a thorough verification process including business license verification, insurance confirmation, portfolio review, and background checks. We also monitor customer reviews and feedback to maintain quality standards."
    },
    {
      question: "Can I get quotes from multiple vendors?",
      answer: "Absolutely! We encourage you to get quotes from multiple vendors to compare pricing, services, and availability. Our platform makes it easy to request and compare quotes side-by-side."
    },
    {
      question: "What if I need to cancel or reschedule?",
      answer: "Cancellation and rescheduling policies vary by vendor. Each vendor's specific terms are clearly outlined in their profile and contract. Our customer support team is available to help mediate any issues that arise."
    },
    {
      question: "Do you offer wedding planning services?",
      answer: "While we don't provide direct planning services, we connect you with professional wedding planners and coordinators. We also offer planning tools, checklists, and resources to help you stay organized throughout the process."
    },
    {
      question: "How far in advance should I book vendors?",
      answer: "We recommend booking key vendors (venue, photographer, caterer) 9-12 months in advance, especially for popular dates. Other services can typically be booked 3-6 months ahead, but it varies by location and season."
    },
    {
      question: "What areas do you serve?",
      answer: "ShaadiSetGo operates in over 500 cities across the United States. Use our location search to find vendors in your specific area. We're constantly expanding to new markets based on demand."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-20 pb-16 section-padding">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-gray-800 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about planning your wedding with ShaadiSetGo.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 pr-4">
                      {faq.question}
                    </h3>
                    {openItems.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-gold flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gold flex-shrink-0" />
                    )}
                  </button>
                  {openItems.includes(index) && (
                    <div className="px-8 pb-6">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-600 mb-8">
              Our customer support team is here to help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn-primary inline-flex items-center justify-center px-6 py-3 rounded-lg">
                Contact Support
              </a>
              <a href="mailto:hello@ShaadiSetGo.com" className="btn-outline inline-flex items-center justify-center px-6 py-3 rounded-lg">
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
