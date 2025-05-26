import { useRef } from 'react';

export function useRingtone(ringtoneUrl: string) {
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);

  const playRingtone = () => {
    if (!ringtoneRef.current) {
      ringtoneRef.current = new Audio(ringtoneUrl);
      ringtoneRef.current.loop = true; 
    } else {
      ringtoneRef.current.src = ringtoneUrl; 
    }

    ringtoneRef.current.play().catch((e) => {
      console.warn("Error playing ringtone:", e);
    });
  };

  const stopRingtone = () => {
    const audio = ringtoneRef.current;
    if (audio) {
      try {
        audio.pause();
        
        audio.removeAttribute('src'); // prevent earbuds/system resume
        audio.load(); // reset audio element
      } catch (e) {
        console.warn("Error stopping ringtone:", e);
      }
    }
  };

  return { playRingtone, stopRingtone };
}
