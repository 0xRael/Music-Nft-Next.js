"use client"
import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js';

// Uses wavesurfer.js to generate a playable waveform from the {audioUrl}
export function Waveform({ audioUrl }) {
    const waveformRef = useRef(null);

    useEffect(() => {
        if (audioUrl && typeof window !== 'undefined') {
            console.log(audioUrl);
            const ws = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: "#bbbbbbbb",
                progressColor: "#ae74cddd",
                url: audioUrl,

                barWidth: 2,

                plugins: [
                    Hover.create({
                    lineColor: '#fed4ff',
                    lineWidth: 2,
                    labelBackground: '#555',
                    labelColor: '#fff',
                    labelSize: '11px',
                    }),
                ],
            });
        
            ws.on('interaction', () => {
                ws.playPause();
            });
            
            return () => ws.destroy();
        }
    }, [audioUrl]);
    
    return <div ref={waveformRef} style={{position:'relative'}}>
    </div>;
};
