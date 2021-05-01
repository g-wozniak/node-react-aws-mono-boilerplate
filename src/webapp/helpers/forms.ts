import { FormDetails } from '@webapp/intf/Forms'


export const isReadyToDisplay = (form: FormDetails, currentStep: number): boolean => {
  return form.step === currentStep && form.transition === false
}
