import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

export default defineNuxtPlugin(() => {
  toastr.options = {
    "positionClass": "toast-top-right",
    "closeButton": true,
    "progressBar": true
  }
  return {
    provide: {
      toast: toastr
    }
  }
})