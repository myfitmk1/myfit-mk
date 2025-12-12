import React, { useState, useRef } from 'react';
import { GalleryImage } from '../types';
import { Camera, Upload, Trash2, X, Image as ImageIcon, CheckCircle } from 'lucide-react';

interface GalleryProps {
  images: GalleryImage[];
  onAddImage: (img: GalleryImage) => void;
  onDeleteImage: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ images, onAddImage, onDeleteImage }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newImage: GalleryImage = {
          id: Date.now().toString(),
          url: base64String,
          date: new Date().toISOString()
        };
        onAddImage(newImage);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Не можеме да пристапиме до камерата. Проверете ги дозволите.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        const newImage: GalleryImage = {
          id: Date.now().toString(),
          url: dataUrl,
          date: new Date().toISOString()
        };
        onAddImage(newImage);
        stopCamera();
      }
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-5xl font-heading text-white tracking-wide text-glow">ГАЛЕРИЈА</h2>
          <p className="text-brand-400 font-subtitle uppercase tracking-widest text-sm">ТВОЈАТА ТРАНСФОРМАЦИЈА</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 md:flex-none px-5 py-3 bg-[#1a1a1a] border border-[#333] hover:border-brand-500 hover:text-white text-brand-400 rounded-lg font-heading tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm"
            >
                <Upload size={18} /> ПРИКАЧИ
            </button>
            <button 
                onClick={startCamera}
                className="flex-1 md:flex-none px-5 py-3 bg-accent hover:bg-accent-hover text-black rounded-lg font-heading tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/20"
            >
                <Camera size={18} /> СЛИКАЈ
            </button>
        </div>
      </header>

      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg relative bg-black rounded-3xl overflow-hidden shadow-2xl border border-[#333]">
                <video ref={videoRef} autoPlay playsInline className="w-full h-[60vh] object-cover bg-[#121212]"></video>
                <canvas ref={canvasRef} className="hidden"></canvas>
                
                <div className="absolute top-4 right-4">
                    <button onClick={stopCamera} className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-md border border-white/20">
                        <X size={24} />
                    </button>
                </div>

                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                    <button 
                        onClick={capturePhoto} 
                        className="w-20 h-20 bg-white rounded-full border-4 border-[#333] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        <div className="w-16 h-16 bg-white rounded-full border-2 border-black"></div>
                    </button>
                </div>
            </div>
            <p className="text-white mt-4 text-sm font-mono uppercase tracking-widest">Наместете се и сликајте!</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto min-h-[400px]">
        {images.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-brand-600 border-2 border-dashed border-[#262626] rounded-xl bg-[#161616] p-10">
                <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 border border-[#333]">
                    <ImageIcon size={40} className="opacity-50" />
                </div>
                <p className="text-lg font-heading tracking-wide text-brand-400">ПРАЗНО Е ТУКА</p>
                <p className="text-xs font-mono text-center max-w-xs mt-2 uppercase opacity-60">Сликајте се или прикачете слика за да го следите вашиот напредок.</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
                {images.map((img) => (
                    <div key={img.id} className="group relative aspect-[3/4] bg-[#1a1a1a] rounded-xl overflow-hidden shadow-md border border-[#333] hover:border-accent transition-all">
                        <img src={img.url} alt="User upload" className="w-full h-full object-cover" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                            <p className="text-accent text-[10px] font-mono font-bold mb-2 uppercase tracking-widest">
                                {new Date(img.date).toLocaleDateString('mk-MK')}
                            </p>
                            <div className="flex justify-end gap-2">
                                <a 
                                    href={img.url} 
                                    download={`myfit-${img.id}.jpg`}
                                    className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded border border-white/10 text-white transition-colors"
                                >
                                    <CheckCircle size={16} />
                                </a>
                                <button 
                                    onClick={() => onDeleteImage(img.id)}
                                    className="p-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 backdrop-blur-md rounded text-red-500 hover:text-white transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;