// utils/notifier.ts
import { Notyf, NotyfNotification } from 'notyf';
import 'notyf/notyf.min.css';

let notyfInstance: Notyf | null = null;
let activeNotification: NotyfNotification | null = null;

interface Options {
  type: NotificationType;
  message: string;
}

type NotificationType = "success" | "error" | "warning";

const getNotyfInstance = (): Notyf => {
  if (!notyfInstance) {
    notyfInstance = new Notyf({
      duration: 3000,
      position: { x: 'right', y: 'top' },
      dismissible: false,
      ripple: false,
      types: [
        { type: 'success', background: '#004ad2ff', icon: false },
        { type: 'error',   background: '#ED3D3D',   icon: false },
        { type: 'warning', background: '#FFC107',   icon: false },
      ],
    });
  }
  return notyfInstance;
};

export const showNotyf = (
  type: NotificationType,
  message: string,
): void => {
  const notyf = getNotyfInstance();

  if (activeNotification) {
    notyf.dismissAll();
    activeNotification = null;
  }

  if (type === 'success') {
    activeNotification = notyf.success(message);
  } else if (type === 'error') {
    activeNotification = notyf.error(message);
  } else {
    const options: Options = { type, message };
    activeNotification = notyf.open(options);
  }
};