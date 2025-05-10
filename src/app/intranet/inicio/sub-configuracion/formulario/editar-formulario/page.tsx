"use client"

import { toast,Toaster } from "sonner" // Importa la función toast de sonner
import { Button } from "@/components/ui/button"

export default function ToastDemo() {
  return (
    <>
      {/* Renderiza el componente Toaster para mostrar las notificaciones */}
      <Toaster position="bottom-right" />

      <Button
        variant="outline"
        onClick={() => {
          // Usa la función toast de sonner
          toast("Scheduled: Catch up", {
            description: "Friday, February 10, 2023 at 5:57 PM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo clicked"),
            },
          })
        }}
      >
        Add to calendar
      </Button>
    </>
  )
}