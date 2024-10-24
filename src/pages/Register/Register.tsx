import { FC } from 'react';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FirstStepForm } from './FirstStepForm';
import { SecondStepForm } from './SecondStepForm';
import { ThirdStepForm } from './ThirdStepForm';
import useFormStore from '@/store/states/useFormStore';

interface FirstStepFormProps {
  onNextStep: () => void;
}

interface SecondStepFormProps {
  onPrevious: () => void;
  onNext: () => void;
}

interface ThirdStepFormProps {
  onPrevious: () => void;
  onFinish: () => void;
}

type StepProps = FirstStepFormProps | SecondStepFormProps | ThirdStepFormProps;

const steps = [
  { component: FirstStepForm },
  { component: SecondStepForm },
  { component: ThirdStepForm, hasFinish: true }
];

const FormRegister: FC = () => {
  const { currentStep, nextStep, prevStep, resetForm } = useFormStore();

  const StepComponent = steps[currentStep]?.component;

  if (!StepComponent) {
    return <div>Error: Paso no encontrado.</div>;
  }

  // Definir las props adecuadas para cada paso
  let stepProps: StepProps = {} as StepProps;
  if (currentStep === 0) {
    stepProps = { onNextStep: nextStep };
  } else if (currentStep === 1) {
    stepProps = {
      onPrevious: prevStep,
      onNext: nextStep,
    };
  } else if (currentStep === 2) {
    stepProps = {
      onPrevious: prevStep,
      onFinish: resetForm,
    };
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Registrarse</CardTitle>
            <CardDescription>Ingresa tus credenciales para crear una cuenta</CardDescription>
            <Separator className="my-8" />
            
            {/* Barra de progreso */}
            <Progress value={((currentStep + 1) / steps.length) * 100} className="mb-6" />
            
            {/* Indicador de paso actual */}
            <div className="flex justify-center mb-6 py-3">
              <Label className="px-4 py-2 bg-primary text-primary-foreground rounded-full">
                Paso {currentStep + 1} de {steps.length}
              </Label>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Pasar las props específicas para cada paso */}
            <StepComponent {...stepProps} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormRegister;
