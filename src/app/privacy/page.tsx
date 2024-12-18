import MarkdownRenderer from '@/components/markdown-renderer'

export default function PrivacyPage() {
  return (
    <div>
      <MarkdownRenderer content={`
## Privacy Policy for The Interview Playbook

Effective Date: December 1, 2024

**Introduction**

At The Interview Playbook, we value your privacy and are committed to safeguarding the personal information you provide when using our website and services. This Privacy Policy outlines the types of information we collect, how we use it, and the measures we take to protect it. By using The Interview Playbook’’s services, you agree to the terms outlined in this policy.

### 1. Information We Collect
To provide our personalized interview preparation services, we collect the following types of information:
* **Personal Data:** When you sign up for InterviewPlaybook, you may be asked to provide personal details, such as your name, email address, and job-related information. This may include your resume, job descriptions, and specific data related to the interview process (e.g., answers to mock interview questions).
* **Usage Data:** We collect information about how you interact with our website and services, including your IP address, browser type, device information, and pages visited. This data helps us improve the performance of our services.

### 2. How We Use Your Information
The information we collect is used solely to provide and enhance the services we offer, which include personalized interview preparation guides, mock interview sessions, and tailored feedback. Specifically, we use the data to:
* **Create Personalized Guides:** Using your resume and job descriptions, we generate tailored interview prep materials to help you prepare for interviews effectively.
* **Conduct Mock Interviews:** We simulate interview scenarios based on your job data, offering feedback to help you improve.
* **Provide Analytics and Feedback:** Your data is analyzed to provide personalized recommendations and feedback on how to enhance your interview performance.
All data collected is strictly used to facilitate your interaction with our platform, and no data is shared with third parties for marketing, advertising, or any other purposes outside of the services described.

### 3. Data Security
We take your privacy seriously and use industry-standard measures to protect your data. These include:
* **Encryption:** Data transmitted through our platform is encrypted using SSL/TLS technology to prevent unauthorized access.
* **Access Control:** Only authorized personnel within The Interview Playbook have access to your personal data, and we limit this access to those who need it to provide services.
* **Data Storage:** Your data is securely stored on our servers hosted by Vercel. We employ physical and technical security measures to prevent unauthorized access to stored data.
* **Retention:** We retain your personal data only as long as necessary to provide services to you or as required by law.

### 4. Sharing of Information
At The Interview Playbook, we do not share, sell, or lease your personal data to third parties. All the data you provide (such as your resume, job descriptions, or mock interview responses) is used exclusively to provide the interview prep services on our platform. We do not use your data for advertising or share it with external marketers or partners.

### 5. Third-Party Services
Our platform integrates with certain third-party services to provide the functionality of our interview preparation tools. Specifically, we use OpenAI’s GPT technology to generate personalized interview guides and mock interview sessions. OpenAI processes your data only to provide these services, and they do not retain or use the data for other purposes.
We also use Vercel for hosting our platform and React for building the user interface. Both services adhere to security standards that help ensure your data is protected. However, we are not responsible for the privacy practices or data security policies of third-party service providers.

### 6. Cookies and Tracking Technologies
The Interview Playbook uses cookies and similar tracking technologies to enhance your user experience. Cookies are small files stored on your device that help us remember your preferences and improve our services. You can manage your cookie preferences through your browser settings, including the option to disable cookies. However, disabling cookies may affect your experience with our site.

### 7. Your Data Rights
As a user, you have the following rights regarding your personal data:
* **Access:** You have the right to request a copy of the personal data we hold about you.
* **Correction:** You can request that we update or correct any inaccurate information we have about you.
* **Deletion:** You can request that we delete your personal data from our records, subject to any legal obligations we may have to retain certain data.
* **Data Portability:** You can request to receive your data in a structured, commonly used format for transfer to another service.
* **Withdraw Consent:** If we are processing your data based on consent, you have the right to withdraw that consent at any time.
To exercise any of these rights, please contact us at [support@theinterviewplaybook.com](mailto:support@theinterviewplaybook.com).

### 8. Children's Privacy
The Interview Playbook is not intended for use by children under the age of 13. We do not knowingly collect or solicit personal data from children. If we learn that we have collected personal information from a child under 13, we will take steps to delete that information as soon as possible. If you are a parent or guardian and believe we have collected personal data from a child, please contact us at [support@theinterviewplaybook.com](mailto:support@theinterviewplaybook.com).

### 9. Changes to This Privacy Policy
We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any changes will be posted on this page, and the updated policy will be effective as of the date indicated at the top of this page. We encourage you to review this policy periodically to stay informed about how we are protecting your data.

### 10. Contact Us
If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:

**Email:** [support@theinterviewplaybook.com](mailto:support@theinterviewplaybook.com)

**Address:**<br/>
GreenPen AI Labs<br/>
2625 Middlefield Rd #435<br/>
Palo Alto, CA 94306<br/>

By using The Interview Playbook, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
`} />
    </div>
  );
}
