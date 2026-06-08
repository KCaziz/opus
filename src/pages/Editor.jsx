import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCVState, useCVDispatch } from '../store/CVContext'
import { ACTIONS } from '../store/cvReducer'
import WizardLayout from '../components/editor/WizardLayout'
import StepCoordonnees from '../components/editor/steps/StepCoordonnees'
import StepResume      from '../components/editor/steps/StepResume'
import StepExperience  from '../components/editor/steps/StepExperience'
import StepFormation   from '../components/editor/steps/StepFormation'
import StepCompetences from '../components/editor/steps/StepCompetences'
import StepFinaliser   from '../components/editor/steps/StepFinaliser'

const STEPS = [
  StepCoordonnees,
  StepResume,
  StepExperience,
  StepFormation,
  StepCompetences,
  StepFinaliser,
]

export default function Editor() {
  const navigate = useNavigate()
  const state    = useCVState()
  const dispatch = useCVDispatch()
  const step     = state.currentStep

  useEffect(() => {
    if (!state.templateId) navigate('/builder')
  }, [state.templateId, navigate])

  function goTo(idx)   { dispatch({ type: ACTIONS.SET_STEP, payload: idx }) }
  function goNext()    { goTo(Math.min(step + 1, STEPS.length - 1)) }
  function goBack()    { goTo(Math.max(step - 1, 0)) }

  const StepComponent = STEPS[step]

  return (
    <WizardLayout currentStep={step} onStepChange={goTo}>
      <StepComponent
        onNext={goNext}
        onBack={step > 0 ? goBack : undefined}
      />
    </WizardLayout>
  )
}
