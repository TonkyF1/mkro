import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, Timer, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

type TimerMode = 'stopwatch' | 'countdown' | 'interval';

export const WorkoutTimer = () => {
  const [mode, setMode] = useState<TimerMode>('stopwatch');
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // in seconds
  const [countdownTime, setCountdownTime] = useState(60);
  const [workTime, setWorkTime] = useState(30);
  const [restTime, setRestTime] = useState(10);
  const [currentInterval, setCurrentInterval] = useState<'work' | 'rest'>('work');
  const [intervalCount, setIntervalCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (mode === 'countdown') {
            if (prev <= 1) {
              playBeep();
              setIsRunning(false);
              return 0;
            }
            return prev - 1;
          } else if (mode === 'interval') {
            const targetTime = currentInterval === 'work' ? workTime : restTime;
            if (prev >= targetTime) {
              playBeep();
              setCurrentInterval(curr => curr === 'work' ? 'rest' : 'work');
              setIntervalCount(c => c + 1);
              return 0;
            }
            return prev + 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, currentInterval, workTime, restTime]);

  const playBeep = () => {
    const beep = new Audio('data:audio/wav;base64,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');
    beep.play().catch(() => {});
  };

  const handlePlayPause = () => {
    if (!isRunning && mode === 'countdown' && time === 0) {
      setTime(countdownTime);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setCurrentInterval('work');
    setIntervalCount(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (mode === 'countdown') {
      return ((countdownTime - time) / countdownTime) * 100;
    } else if (mode === 'interval') {
      const targetTime = currentInterval === 'work' ? workTime : restTime;
      return (time / targetTime) * 100;
    }
    return 0;
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 shadow-2xl">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={cn(
          "absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl transition-all duration-1000",
          currentInterval === 'work' && mode === 'interval' 
            ? "bg-gradient-to-br from-emerald-500/30 to-teal-600/30" 
            : "bg-gradient-to-br from-rose-500/30 to-pink-600/30"
        )} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-full blur-3xl" />
      </div>

      <CardContent className="p-8 relative z-10">
        {/* Mode Selector */}
        <div className="flex gap-2 mb-6">
          {(['stopwatch', 'countdown', 'interval'] as TimerMode[]).map((m) => (
            <Button
              key={m}
              variant={mode === m ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setMode(m);
                handleReset();
              }}
              className={cn(
                "flex-1 capitalize transition-all",
                mode === m && "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
              )}
            >
              {m === 'stopwatch' && <Timer className="w-4 h-4 mr-2" />}
              {m === 'interval' && <Zap className="w-4 h-4 mr-2" />}
              {m}
            </Button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="relative mb-8">
          {/* Progress Ring */}
          {(mode === 'countdown' || mode === 'interval') && (
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                strokeDashoffset={2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={currentInterval === 'work' && mode === 'interval' ? '#10b981' : '#ec4899'} />
                  <stop offset="100%" stopColor={currentInterval === 'work' && mode === 'interval' ? '#14b8a6' : '#f43f5e'} />
                </linearGradient>
              </defs>
            </svg>
          )}

          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-8xl font-black text-white mb-2 tracking-tight">
              {formatTime(time)}
            </div>
            {mode === 'interval' && (
              <div className={cn(
                "text-lg font-bold px-4 py-1 rounded-full",
                currentInterval === 'work' 
                  ? "bg-emerald-500/20 text-emerald-400" 
                  : "bg-rose-500/20 text-rose-400"
              )}>
                {currentInterval === 'work' ? '💪 WORK' : '🧘 REST'} • Round {Math.floor(intervalCount / 2) + 1}
              </div>
            )}
          </div>
        </div>

        {/* Settings */}
        {!isRunning && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {mode === 'countdown' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Countdown (seconds)</label>
                <Input
                  type="number"
                  value={countdownTime}
                  onChange={(e) => setCountdownTime(parseInt(e.target.value) || 60)}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
            )}
            {mode === 'interval' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-emerald-400">Work (seconds)</label>
                  <Input
                    type="number"
                    value={workTime}
                    onChange={(e) => setWorkTime(parseInt(e.target.value) || 30)}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-rose-400">Rest (seconds)</label>
                  <Input
                    type="number"
                    value={restTime}
                    onChange={(e) => setRestTime(parseInt(e.target.value) || 10)}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <Button
            size="lg"
            onClick={handlePlayPause}
            className="w-32 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-lg shadow-pink-500/30"
          >
            {isRunning ? (
              <><Pause className="w-5 h-5 mr-2" /> Pause</>
            ) : (
              <><Play className="w-5 h-5 mr-2" /> Start</>
            )}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleReset}
            className="w-32 border-slate-600 hover:bg-slate-800 text-white"
          >
            <RotateCcw className="w-5 h-5 mr-2" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
