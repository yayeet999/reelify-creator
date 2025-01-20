import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is notreel.ai and how does it work?",
    answer: "notreel.ai is an AI-powered platform that helps you create engaging video content. Simply choose from our library of authentic creators, customize your video with AI-generated hooks and voiceovers, and download your content instantly."
  },
  {
    question: "Do I need technical skills to use notreel.ai?",
    answer: "Not at all! Our platform is designed to be user-friendly and intuitive. If you can browse the web, you can create professional-looking content with notreel.ai."
  },
  {
    question: "What types of content can I create with notreel.ai?",
    answer: "You can create a wide variety of content including product reviews, testimonials, educational content, and promotional videos. Our green screen technology allows for endless customization possibilities."
  },
  {
    question: "How does the AI voice generation feature work?",
    answer: "Simply type in your script, choose from our selection of AI voices, and our system will generate natural-sounding voiceovers for your videos. You can preview the voice before finalizing your content."
  },
  {
    question: "Are the people in the videos real content creators?",
    answer: "No, our videos feature AI-generated presenters that are indistinguishable from real people. This innovative technology allows us to create highly realistic, customizable content that's both scalable and cost-effective. You get the authenticity of human presenters with the flexibility and efficiency of AI."
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel your subscription anytime with no questions asked. Your access will continue until the end of your current billing period."
  },
  {
    question: "How many videos can I create per month?",
    answer: "This depends on your plan: Starter plan includes 20 videos per month, Pro plan includes 75 videos, and Enterprise plan includes 200 videos per month."
  },
  {
    question: "Do I own the rights to the content I create?",
    answer: "Yes, you own all rights to the content you create using notreel.ai. You're free to use it across your marketing channels and campaigns."
  },
  {
    question: "Can I use notreel.ai for commercial purposes?",
    answer: "Absolutely! notreel.ai is designed for commercial use. You can create content for your business, products, services, or clients."
  },
  {
    question: "What makes notreel.ai different from other video creation tools?",
    answer: "notreel.ai combines hyper-realistic AI presenters, AI-powered hooks generation, and custom voiceovers in one platform. Our focus on quality and ease of use sets us apart, helping you create professional, engaging content quickly."
  }
];

export const FAQ = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get answers to common questions about notreel.ai and how it can help you create engaging content.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border border-gray-200 rounded-lg px-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};