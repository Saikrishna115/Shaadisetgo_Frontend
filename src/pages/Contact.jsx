
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-20 pb-16 section-padding">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-gray-800 mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about planning your wedding? We're here to help make your special day perfect.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-6">
                Get in Touch
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="First Name" className="py-3" />
                  <Input placeholder="Last Name" className="py-3" />
                </div>
                <Input placeholder="Email Address" type="email" className="py-3" />
                <Input placeholder="Phone Number" type="tel" className="py-3" />
                <Input placeholder="Wedding Date" type="date" className="py-3" />
                <textarea 
                  placeholder="Tell us about your dream wedding..."
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
                <Button className="w-full btn-primary py-3">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-8">
                Let's Connect
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">hello@dreamwed.com</p>
                    <p className="text-gray-600">support@dreamwed.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                    <Phone className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                    <p className="text-gray-600">1-800-DREAM-WED</p>
                    <p className="text-gray-600">(1-800-373-2693)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Office</h3>
                    <p className="text-gray-600">123 Wedding Way</p>
                    <p className="text-gray-600">Los Angeles, CA 90210</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9am - 6pm</p>
                    <p className="text-gray-600">Saturday: 10am - 4pm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
