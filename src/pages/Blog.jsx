import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const Blog = () => {
  const blogPosts = [/* same array as original (omitted here for brevity) */];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blush/10 to-teal/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-gray-800 mb-6">
              Wedding Planning Blog
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Expert tips, inspiration, and advice to help you plan the wedding of your dreams.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <span className="inline-block bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-medium mb-4">
                Featured Post
              </span>
              <h2 className="text-4xl font-playfair font-bold text-gray-800 mb-4">
                {blogPosts[0].title}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {blogPosts[0].excerpt}
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-gray-500 text-sm">
                  <User className="h-4 w-4 mr-2" />
                  {blogPosts[0].author}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {blogPosts[0].date}
                </div>
                <span className="text-gray-500 text-sm">{blogPosts[0].readTime}</span>
              </div>
              <Button className="btn-primary">
                Read More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div>
              <img
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="rounded-2xl shadow-lg w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-padding bg-gradient-to-br from-blush/5 to-teal/5">
        <div className="container mx-auto">
          <h2 className="text-4xl font-playfair font-bold text-gray-800 text-center mb-12">
            Latest Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post, index) => (
              <article key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover">
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center"><User className="h-4 w-4 mr-1" />{post.author}</div>
                    <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" />{post.date}</div>
                  </div>
                  <Button variant="outline" className="w-full">Read Article</Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding bg-white">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-playfair font-bold text-gray-800 mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-8">Subscribe to our newsletter for wedding planning tips and inspiration.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent" />
              <Button className="btn-primary px-6">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
