import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Chat = () => {
  // Remove unused searchParams declaration
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen">
      <Header />

      <section className="pt-20 pb-16 bg-gradient-to-br from-blush/5 to-teal/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-playfair font-bold text-gray-800 mb-8 text-center">
              Messages
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
              {/* Chat Rooms List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Conversations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 text-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-sm mt-2">Start by contacting a vendor</p>
                </CardContent>
              </Card>

              {/* Chat Messages */}
              <Card className="lg:col-span-2">
                <CardContent className="flex items-center justify-center h-[520px]">
                  <div className="text-center text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Chat;
