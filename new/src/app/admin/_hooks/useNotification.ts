import { useState, useCallback } from 'react'

type NotificationType = 'success' | 'error' | null

export const useNotification = () => {
   const [notificationMessage, setNotificationMessage] = useState<string>('')
   const [notificationDescription, setNotificationDescription] = useState<string>('')
   const [notificationType, setNotificationType] = useState<NotificationType>(null)
   const [showNotification, setShowNotification] = useState<boolean>(false)

   const showNotificationHandler = useCallback((message: string, description: string, type: NotificationType) => {
      setNotificationMessage(message)
      setNotificationDescription(description)
      setNotificationType(type)
      setShowNotification(true)
   }, [])

   const hideNotificationHandler = useCallback(() => {
      setShowNotification(false)
   }, [])

   return {
      notificationMessage,
      notificationDescription,
      notificationType,
      showNotification,
      showNotificationHandler,
      hideNotificationHandler,
   }
}
