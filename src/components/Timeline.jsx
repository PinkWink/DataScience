import { motion } from 'framer-motion'
import SectionWrapper from './ui/SectionWrapper'
import { loadCaseStudies } from '../data/caseStudies'

export default function Timeline() {
  const studies = loadCaseStudies()

  const scrollToCase = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <SectionWrapper id="timeline" className="overflow-hidden">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Journey</h2>

      <div className="overflow-x-auto pb-4 -mx-6 px-6">
        <div className="flex items-center justify-center min-w-max gap-0">
          {studies.map((study, index) => (
            <div key={study.id} className="flex items-center">
              {/* Node */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToCase(study.id)}
                className="flex flex-col items-center gap-3 px-6 md:px-10 cursor-pointer group"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center text-2xl md:text-3xl group-hover:bg-accent/30 transition-colors">
                  {study.icon}
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-sm md:text-base">{study.title}</p>
                  <p className="text-gray-500 text-xs">{study.period}</p>
                </div>
              </motion.button>

              {/* Connector line */}
              {index < studies.length - 1 && (
                <div className="w-16 md:w-24 h-0.5 bg-gradient-to-r from-accent to-accent/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
