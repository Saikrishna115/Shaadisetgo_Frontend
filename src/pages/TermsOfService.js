import React from 'react';
import './TermsOfService.css';

const TermsOfService = () => {
  return (
    <div className="terms-container">
      <section className="terms-hero">
        <div className="terms-hero-content">
          <h1>Terms of Service</h1>
          <p>Last Updated: June 1, 2023</p>
        </div>
      </section>

      <section className="terms-content">
        <div className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the ShaadiSetGo platform, website, and services, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, then you may not access or use our services.
          </p>
        </div>

        <div className="terms-section">
          <h2>2. Description of Service</h2>
          <p>
            ShaadiSetGo provides an online platform that connects wedding vendors with individuals planning their weddings. Our services include but are not limited to vendor listings, booking management, and wedding planning tools.
          </p>
        </div>

        <div className="terms-section">
          <h2>3. User Accounts</h2>
          <p>
            To access certain features of our platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access our services and for any activities or actions under your password. We encourage you to use a strong password (using a combination of upper and lower case letters, numbers, and symbols) with your account.
          </p>
        </div>

        <div className="terms-section">
          <h2>4. User Conduct</h2>
          <p>You agree not to engage in any of the following prohibited activities:</p>
          <ul>
            <li>Copying, distributing, or disclosing any part of our platform in any medium, including without limitation by any automated or non-automated "scraping".</li>
            <li>Using any automated system, including without limitation "robots," "spiders," "offline readers," etc., to access our platform.</li>
            <li>Transmitting spam, chain letters, or other unsolicited email.</li>
            <li>Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running our platform.</li>
            <li>Taking any action that imposes, or may impose at our sole discretion an unreasonable or disproportionately large load on our infrastructure.</li>
            <li>Uploading invalid data, viruses, worms, or other software agents through our platform.</li>
            <li>Collecting or harvesting any personally identifiable information, including account names, from our platform.</li>
            <li>Using our platform for any commercial solicitation purposes.</li>
            <li>Impersonating another person or otherwise misrepresenting your affiliation with a person or entity, conducting fraud, hiding or attempting to hide your identity.</li>
            <li>Interfering with the proper working of our platform.</li>
            <li>Accessing any content on our platform through any technology or means other than those provided or authorized by the platform.</li>
            <li>Bypassing the measures we may use to prevent or restrict access to our platform, including without limitation features that prevent or restrict use or copying of any content or enforce limitations on use of our platform or the content therein.</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2>5. Intellectual Property Rights</h2>
          <p>
            The platform and its original content, features, and functionality are and will remain the exclusive property of ShaadiSetGo and its licensors. The platform is protected by copyright, trademark, and other laws of both India and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of ShaadiSetGo.
          </p>
        </div>

        <div className="terms-section">
          <h2>6. User Content</h2>
          <p>
            Our platform may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post to our platform, including its legality, reliability, and appropriateness.
          </p>
          <p>
            By posting content to our platform, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through our platform. You retain any and all of your rights to any content you submit, post, or display on or through our platform and you are responsible for protecting those rights.
          </p>
        </div>

        <div className="terms-section">
          <h2>7. Payments and Billing</h2>
          <p>
            Certain aspects of our service may be provided for a fee. You will be required to select a payment plan and provide accurate information regarding your payment method. You agree to promptly update your account information with any changes in your payment information.
          </p>
          <p>
            We use third-party payment processors to bill you through a payment account linked to your account. The processing of payments will be subject to the terms, conditions, and privacy policies of the payment processors in addition to these Terms.
          </p>
        </div>

        <div className="terms-section">
          <h2>8. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to our platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </p>
          <p>
            If you wish to terminate your account, you may simply discontinue using our platform, or notify us that you wish to delete your account.
          </p>
        </div>

        <div className="terms-section">
          <h2>9. Limitation of Liability</h2>
          <p>
            In no event shall ShaadiSetGo, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use our platform.
          </p>
        </div>

        <div className="terms-section">
          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
          <p>
            By continuing to access or use our platform after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use our platform.
          </p>
        </div>

        <div className="terms-section">
          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>
          <p>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
          </p>
        </div>

        <div className="terms-section">
          <h2>12. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p>
            Email: legal@shaadisetgo.com<br />
            Phone: +91 98765 43210<br />
            Address: 123 Wedding Street, Celebration City, India 500001
          </p>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;