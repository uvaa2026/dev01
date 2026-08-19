import { createContext, useContext, useMemo, useState, useCallback } from 'react'

// In-memory only — deliberately not persisted to localStorage/sessionStorage,
// matching the FRD's session-management requirement (assessment state should
// live server-side once a backend exists; this resets on refresh, which is
// the correct behaviour for a skeleton with no backend yet).
const AssessmentContext = createContext(null)

export function AssessmentProvider({ children }) {
  const [gunaAnswers, setGunaAnswers] = useState({})
  const [gunaResult, setGunaResult] = useState(null)
  const [constructAnswers, setConstructAnswers] = useState({})

  const answerGuna = useCallback((vignetteId, optionKey) => {
    setGunaAnswers((prev) => ({ ...prev, [vignetteId]: optionKey }))
  }, [])

  const answerConstruct = useCallback((scenarioId, optionKey) => {
    setConstructAnswers((prev) => ({ ...prev, [scenarioId]: optionKey }))
  }, [])

  const resetAssessment = useCallback(() => {
    setGunaAnswers({})
    setGunaResult(null)
    setConstructAnswers({})
  }, [])

  const value = useMemo(
    () => ({
      gunaAnswers,
      answerGuna,
      gunaResult,
      setGunaResult,
      constructAnswers,
      answerConstruct,
      resetAssessment,
    }),
    [gunaAnswers, answerGuna, gunaResult, constructAnswers, answerConstruct, resetAssessment],
  )

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext)
  if (!ctx) throw new Error('useAssessment must be used inside <AssessmentProvider>')
  return ctx
}
