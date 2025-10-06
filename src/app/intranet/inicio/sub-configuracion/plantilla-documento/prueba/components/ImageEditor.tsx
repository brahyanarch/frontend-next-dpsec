'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

// Importa glfx-es6 directamente
//import fx from 'glfx-es6'

type FilterType = 'brightness' | 'contrast' | 'saturation' | 'sepia' | 'vignette' | 'swirl' | 'bulgePinch'

const filterConfigs = {
  brightness: { name: 'Brightness', params: { amount: { min: -1, max: 1, default: 0, step: 0.01 } } },
  contrast: { name: 'Contrast', params: { amount: { min: -1, max: 1, default: 0, step: 0.01 } } },
  saturation: { name: 'Saturation', params: { amount: { min: -1, max: 1, default: 0, step: 0.01 } } },
  sepia: { name: 'Sepia', params: { amount: { min: 0, max: 1, default: 0.5, step: 0.01 } } },
  vignette: { name: 'Vignette', params: { size: { min: 0, max: 1, default: 0.5, step: 0.01 }, amount: { min: 0, max: 1, default: 0.5, step: 0.01 } } },
  swirl: { name: 'Swirl', params: { angle: { min: -25, max: 25, default: 3, step: 0.1 } } },
  bulgePinch: { name: 'Bulge / Pinch', params: { strength: { min: -1, max: 1, default: 0.5, step: 0.01 } } },
}

interface ImageEditorProps {
  imageUrl: string
}

export default function ImageEditor({ imageUrl }: ImageEditorProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('brightness')
  const [filterParams, setFilterParams] = useState<any>({})
  const [texture, setTexture] = useState<any>(null)
  const [canvas, setCanvas] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize filter parameters when filter changes
  useEffect(() => {
    const initialParams: any = {}
    Object.entries(filterConfigs[selectedFilter].params).forEach(([key, param]: [string, any]) => {
      initialParams[key] = param.default
    })
    setFilterParams(initialParams)
  }, [selectedFilter])

  // Initialize canvas when image loads
  useEffect(() => {
    if (!imageUrl) return
    setLoading(true)
    setError(null)

    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        /*const glfxCanvas = fx.canvas()
        const glfxTexture = glfxCanvas.texture(img)

        const maxWidth = containerRef.current?.clientWidth || 800
        const scale = img.width > maxWidth ? maxWidth / img.width : 1
        glfxCanvas.width = Math.floor(img.width * scale)
        glfxCanvas.height = Math.floor(img.height * scale)

        setTexture(glfxTexture)
        setCanvas(glfxCanvas)

        if (canvasRef.current?.parentNode) {
          canvasRef.current.parentNode.replaceChild(glfxCanvas, canvasRef.current)
          // @ts-ignore
          canvasRef.current = glfxCanvas
        }*/

        setLoading(false)
      } catch (err) {
        console.error('Failed to initialize GLFX canvas:', err)
        setError('WebGL initialization failed.')
        setLoading(false)
      }
    }

    img.onerror = () => {
      setError('Failed to load image.')
      setLoading(false)
    }

    img.src = imageUrl
  }, [imageUrl])

  // Apply filter when parameters change
  useEffect(() => {
    if (!canvas || !texture) return

    try {
      canvas.draw(texture)

      switch (selectedFilter) {
        case 'brightness':
          canvas.brightnessContrast(filterParams.amount, 0)
          break
        case 'contrast':
          canvas.brightnessContrast(0, filterParams.amount)
          break
        case 'saturation':
          canvas.hueSaturation(filterParams.amount)
          break
        case 'sepia':
          canvas.sepia(filterParams.amount)
          break
        case 'vignette':
          canvas.vignette(filterParams.size, filterParams.amount)
          break
        case 'swirl':
          canvas.swirl(filterParams.angle)
          break
        case 'bulgePinch':
          canvas.bulgePinch(0.5, 0.5, filterParams.strength)
          break
      }

      canvas.update()
    } catch (err) {
      console.error('Failed to apply filter:', err)
    }
  }, [filterParams, canvas, texture, selectedFilter])

  const handleParamChange = (paramName: string, value: number[]) => {
    setFilterParams((prev: any) => ({ ...prev, [paramName]: value[0] }))
  }

  const handleReset = () => {
    if (canvas && texture) {
      canvas.draw(texture).update()
    }
  }

  const handleSave = () => {
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'edited-image.png'
      link.href = dataUrl
      link.click()
    }
  }

  if (loading) return <div>Loading image editor...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <Card className="p-6">
      sdad
    </Card>
  )
}
