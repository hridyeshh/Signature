import { useState, useRef, useEffect } from 'react'
import { Button } from "@/"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SignatureApp() {
    const [textColor, setTextColor] = useState('#000000')
    const [backgroundColor, setBackgroundColor] = useState('#ffffff')
    const [fontSize, setFontSize] = useState('20')
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [lastX, setLastX] = useState(0)
    const [lastY, setLastY] = useState(0)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (ctx) {
            ctx.fillStyle = backgroundColor
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.strokeStyle = textColor
            ctx.lineWidth = parseInt(fontSize)
        }
    }, [textColor, backgroundColor, fontSize])

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true)
        setLastX(e.nativeEvent.offsetX)
        setLastY(e.nativeEvent.offsetY)
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (ctx) {
            ctx.beginPath()
            ctx.moveTo(lastX, lastY)
            ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
            ctx.stroke()
            setLastX(e.nativeEvent.offsetX)
            setLastY(e.nativeEvent.offsetY)
        }
    }

    const endDrawing = () => {
        setIsDrawing(false)
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (ctx) {
            ctx.fillStyle = backgroundColor
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
    }

    const saveSignature = () => {
        const canvas = canvasRef.current
        if (canvas) {
            const dataUrl = canvas.toDataURL('image/png')
            const link = document.createElement('a')
            link.download = 'signature.png'
            link.href = dataUrl
            link.click()
        }
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Signature App</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex-1 min-w-[200px]">
                        <Label htmlFor="textColor">Text Color</Label>
                        <Input
                            id="textColor"
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="h-10 w-full"
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <Label htmlFor="backgroundColor">Background</Label>
                        <Input
                            id="backgroundColor"
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="h-10 w-full"
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <Label htmlFor="fontSize">Font Size</Label>
                        <Select value={fontSize} onValueChange={setFontSize}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select font size" />
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 20, 30, 40, 50].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}px
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={500}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseOut={endDrawing}
                    className="border-2 border-gray-300 w-full h-auto mb-4"
                />
                <div className="flex justify-between gap-4">
                    <Button variant="destructive" onClick={clearCanvas}>Clear</Button>
                    <Button variant="default" onClick={saveSignature}>Save & Download</Button>
                </div>
            </CardContent>
        </Card>
    )
}