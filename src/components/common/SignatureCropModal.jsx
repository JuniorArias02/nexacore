import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { XMarkIcon, CheckIcon, PlusIcon, MinusIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

const SignatureCropModal = ({ isOpen, image, onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const onCropChange = (crop) => setCrop(crop)
    const onZoomChange = (zoom) => setZoom(zoom)
    const onRotationChange = (rotation) => setRotation(rotation)

    const onCropCompleteInternal = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleConfirm = async () => {
        try {
            const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation)
            onCropComplete(croppedImage)
        } catch (e) {
            console.error("Error cropping image:", e)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <PlusIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Recortar Firma</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ajuste profesional de imagen</p>
                        </div>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="relative h-96 bg-slate-50">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={16 / 5}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteInternal}
                        onZoomChange={onZoomChange}
                        onRotationChange={onRotationChange}
                        classes={{
                            containerClassName: 'bg-slate-50',
                            mediaClassName: 'bg-white',
                            cropAreaClassName: 'border-2 border-indigo-600 rounded-lg shadow-[0_0_0_9999px_rgba(255,255,255,0.7)]'
                        }}
                    />
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Zoom Control */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zoom</span>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setZoom(Math.max(1, zoom - 0.1))} className="p-1 text-slate-400 hover:text-indigo-600 transition-colors">
                                        <MinusIcon className="h-4 w-4" />
                                    </button>
                                    <span className="text-xs font-bold text-indigo-600 w-8 text-center">{Math.round(zoom * 100)}%</span>
                                    <button onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="p-1 text-slate-400 hover:text-indigo-600 transition-colors">
                                        <PlusIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        {/* Rotation Control */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rotación</span>
                                <button onClick={() => setRotation((rotation + 90) % 360)} className="text-indigo-600 hover:text-indigo-700 transition-colors">
                                    <ArrowPathIcon className="h-4 w-4" />
                                </button>
                            </div>
                            <input
                                type="range"
                                value={rotation}
                                min={0}
                                max={360}
                                step={1}
                                aria-labelledby="Rotation"
                                onChange={(e) => setRotation(Number(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleConfirm}
                            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2"
                        >
                            <CheckIcon className="h-4 w-4" />
                            Aplicar Recorte
                        </button>
                        <button
                            onClick={onCancel}
                            className="px-8 py-4 bg-white text-slate-400 border border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Utility function to crop image
const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url
    })

async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const maxSize = Math.max(image.width, image.height)
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

    canvas.width = safeArea
    canvas.height = safeArea

    ctx.translate(safeArea / 2, safeArea / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.translate(-safeArea / 2, -safeArea / 2)

    ctx.drawImage(
        image,
        safeArea / 2 - image.width * 0.5,
        safeArea / 2 - image.height * 0.5
    )

    const data = ctx.getImageData(0, 0, safeArea, safeArea)

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.putImageData(
        data,
        Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
        Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    )

    return new Promise((resolve, reject) => {
        canvas.toBlob((file) => {
            resolve(file)
        }, 'image/png')
    })
}

export default SignatureCropModal
