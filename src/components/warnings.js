import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function noRes() {
  toast.warning('No results');
}

export function err(err) {
  toast.error(`There's an error: ${err.message}`);
}

export function fin(page, hits) {
  if (page * 12 > hits && page !== 1) {
    toast.warning('Thats all!');
  }
}
