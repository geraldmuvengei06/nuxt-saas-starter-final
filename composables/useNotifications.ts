export const useNotifications = () => {
  const { add } = useToast()

  const showSuccess = (message: string, title = 'Success') => {
    add({
      title,
      description: message,
      color: 'green',
      timeout: 5000,
    })
  }

  const showError = (message: string, title = 'Error') => {
    add({
      title,
      description: message,
      color: 'red',
      timeout: 5000,
    })
  }

  const showInfo = (message: string, title = 'Info') => {
    add({
      title,
      description: message,
      color: 'blue',
      timeout: 5000,
    })
  }

  const showWarning = (message: string, title = 'Warning') => {
    add({
      title,
      description: message,
      color: 'yellow',
      timeout: 5000,
    })
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  }
}
