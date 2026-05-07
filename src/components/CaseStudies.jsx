import SectionWrapper from './ui/SectionWrapper'
import CaseCard from './CaseCard'
import { loadCaseStudies } from '../data/caseStudies'

export default function CaseStudies() {
  const studies = loadCaseStudies()

  return (
    <SectionWrapper id="case-studies">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Case Studies</h2>
      <div className="space-y-8 max-w-3xl mx-auto">
        {studies.map((study) => (
          <CaseCard key={study.id} study={study} />
        ))}
      </div>
    </SectionWrapper>
  )
}
