import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Users, 
  ThumbsUp, 
  Clock, 
  MapPin,
  Phone,
  Mail,
  ChevronRight
} from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary-900">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Optical Store"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-poppins">
            About Sri Ragavendra Opticals
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Providing premium eyewear and expert eye care services since 1995
          </p>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-poppins">Our Story</h2>
              <p className="text-gray-600 mb-6">
                Founded in 1995, Sri Ragavendra Opticals has been a trusted name in eye care for over
                25 years. What started as a small optical store in Chennai has grown into a
                comprehensive eye care center, serving thousands of satisfied customers across Tamil Nadu.
              </p>
              <p className="text-gray-600 mb-6">
                Our commitment to providing the highest quality eyewear and exceptional customer
                service has been the cornerstone of our success. We believe that everyone deserves
                clear vision and stylish eyewear at affordable prices.
              </p>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-primary-600 mb-2">25+</div>
                  <div className="text-gray-600">Years of Experience</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-primary-600 mb-2">50K+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Our Store"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <img
                  src="https://images.pexels.com/photos/5752287/pexels-photo-5752287.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Eye Examination"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">
              Why Choose Sri Ragavendra Opticals
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We combine expertise, quality, and care to provide you with the best eye care experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-card text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Products</h3>
              <p className="text-gray-600">
                We offer only genuine, high-quality eyewear from trusted brands
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-card text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Team</h3>
              <p className="text-gray-600">
                Our experienced optometrists provide comprehensive eye care
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-card text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                <ThumbsUp size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Service</h3>
              <p className="text-gray-600">
                Dedicated support and after-sales service for your satisfaction
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-card text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Service</h3>
              <p className="text-gray-600">
                Fast processing and delivery of your eyewear
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Team */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our experienced team of eye care professionals is dedicated to providing you with the
              best care and service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Dr. Rajesh Kumar"
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900">Dr. Rajesh Kumar</h3>
              <p className="text-primary-600 mb-2">Senior Optometrist</p>
              <p className="text-gray-600">
                Over 15 years of experience in comprehensive eye care and contact lens fitting
              </p>
            </div>
            
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Dr. Priya Sharma"
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900">Dr. Priya Sharma</h3>
              <p className="text-primary-600 mb-2">Optometrist</p>
              <p className="text-gray-600">
                Specializes in pediatric eye care and vision therapy
              </p>
            </div>
            
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Mr. Suresh Patel"
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900">Mr. Suresh Patel</h3>
              <p className="text-primary-600 mb-2">Optical Consultant</p>
              <p className="text-gray-600">
                Expert in frame styling and lens recommendations
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Location & Contact */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-poppins">Visit Our Store</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <MapPin size={24} className="text-primary-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">
                      123 Main Street, T. Nagar<br />
                      Chennai, Tamil Nadu 600017
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock size={24} className="text-primary-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Opening Hours</h3>
                    <p className="text-gray-600">
                      Monday - Saturday: 9:00 AM - 8:00 PM<br />
                      Sunday: 10:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone size={24} className="text-primary-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+91 98765 43210</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail size={24} className="text-primary-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">contact@sriragavendraopticals.com</p>
                  </div>
                </div>
              </div>
              
              <Link to="/contact" className="btn btn-primary inline-flex items-center">
                Contact Us
                <ChevronRight size={16} className="ml-2" />
              </Link>
            </div>
            
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              {/* Replace with actual map component or embed */}
              <img
                src="https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Store Location"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4 font-poppins">Ready to Experience Better Vision?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Book an appointment for a comprehensive eye examination or visit our store to explore our
            collection of premium eyewear
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/book-appointment" className="btn btn-secondary">
              Book Appointment
            </Link>
            <Link to="/products" className="btn btn-outline bg-transparent border-white text-white hover:bg-white/10">
              View Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;