import { create } from 'zustand';

interface FormState {
  username: string;
  password: string;
  role: string;
  teamName: string;
  inviteCode: string;
  setUsernameAndPassword: (data: { username: string; password: string }) => void;
  setTeamName: (teamName: string) => void;
  setInviteCode: (inviteCode: string) => void;
  setRole: (role: string) => void;
  resetForm: () => void;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
}

const useFormStore = create<FormState>((set) => ({
  username: '',
  password: '',
  role: 'student', // Por defecto será "student"
  teamName: '',
  inviteCode: '', // Para almacenar el código de invitación
  currentStep: 0,

  // Guardar username y password
  setUsernameAndPassword: (data) =>
    set({ username: data.username, password: data.password }),

  // Guardar el nombre del equipo
  setTeamName: (teamName) => set({ teamName }),

  // Guardar el código de invitación
  setInviteCode: (inviteCode) => set({ inviteCode }),

  // Guardar el rol (opcional, ya que es siempre "student")
  setRole: (role) => set({ role }),

  // Avanzar al siguiente paso
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

  // Retroceder al paso anterior
  prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),

  // Restablecer el formulario
  resetForm: () =>
    set({
      username: '',
      password: '',
      role: 'student',
      teamName: '',
      inviteCode: '', // Restablecer inviteCode
      currentStep: 0,
    }),
}));

export default useFormStore;
