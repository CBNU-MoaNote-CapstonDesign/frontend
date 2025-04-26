import toast, {ToastOptions} from "react-hot-toast";

const debug = process.env.DEBUG === 'true';

/**
 * NEXT_PUBLIC_DEBUG = true 일 때 react-hot-toast toast 알람 호출
 */
export default function debugToast(message: string, options?: ToastOptions) {
  if (!debug)
    return;
  if (options)
    toast(message, options);
  else
    toast(message);
}

/**
 * NEXT_PUBLIC_DEBUG = true 일 때 react-hot-toast의 toast.error 알람 호출
 */
debugToast.error = (message: string, options?: ToastOptions) => {
  if (!debug)
    return;
  if (options)
    toast.error(message, options);
  else
    toast.error(message);
}