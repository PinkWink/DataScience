import SectionWrapper from './ui/SectionWrapper'

export default function Contact() {
  return (
    <SectionWrapper id="contact" className="text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Contact</h2>
      <p className="text-gray-400 mb-8">
        함께 일하고 싶으시다면 연락주세요.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="mailto:hello@example.com"
          className="px-6 py-3 border border-gray-700 hover:border-accent rounded-full text-gray-300 hover:text-accent transition-colors"
        >
          hello@example.com
        </a>
        <a
          href="https://linkedin.com/in/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 border border-gray-700 hover:border-accent rounded-full text-gray-300 hover:text-accent transition-colors"
        >
          LinkedIn
        </a>
      </div>
      <p className="mt-16 text-gray-600 text-sm">
        &copy; 2026. All rights reserved.
      </p>
    </SectionWrapper>
  )
}
