import { useState, useEffect } from 'react';
import { PlayerData, GameState, Anomaly } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const useAegisLive = () => {
  const [game, setGame] = useState<GameState>({ winProbability: 50, tempo: 50, anomalies: [] });
  const [telemetry, setTelemetry] = useState<any>(null);
  const [players, setPlayers] = useState<PlayerData[]>([
    { id: 1, name: 'Zven', role: 'ADC', stress: 20, impact: 98, status: 'optimal', recentErrors: 0 },
    { id: 2, name: 'Blaber', role: 'Jungle', stress: 25, impact: 95, status: 'optimal', recentErrors: 0 },
    { id: 3, name: 'Jojopyun', role: 'Mid', stress: 30, impact: 92, status: 'optimal', recentErrors: 0 },
    { id: 4, name: 'Berserker', role: 'Top', stress: 22, impact: 96, status: 'optimal', recentErrors: 0 },
    { id: 5, name: 'Vulcan', role: 'Support', stress: 28, impact: 94, status: 'optimal', recentErrors: 0 },
  ]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const connectToStream = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/stream-telemetry`, {
          signal: controller.signal
        });
        
        const reader = response.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();

        while (isMounted) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const data = JSON.parse(line);
              if (!isMounted) break;

              setTelemetry(data);

              // Update game state with real-time win probability
              if (data.win_prob) {
                setGame(prev => ({
                  ...prev,
                  winProbability: data.win_prob
                }));
              }

              // If predictions are available, we could update players' impact/status
              if (data.predictions) {
                const newAnomalies: Anomaly[] = [];
                
                setPlayers(prev => prev.map((p, idx) => {
                  const pred = data.predictions[idx];
                  if (pred) {
                    const impactValue = Math.round(pred.high_assist_probability * 100);
                    
                    // Generate a tactical suggestion (anomaly) if probability is high/low
                    if (pred.high_assist_probability > 0.8) {
                        newAnomalies.push({
                            id: `anom-${Date.now()}-${p.id}`,
                            type: 'macro',
                            message: `${pred.name}: ${pred.recommendation}. Model predicts high utility impact.`,
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                            impact: 5,
                            playerTarget: pred.name
                        });
                    }

                    return {
                      ...p,
                      impact: impactValue,
                      status: pred.high_assist_probability > 0.6 ? 'optimal' : (pred.high_assist_probability > 0.3 ? 'warning' : 'critical')
                    };
                  }
                  return p;
                }));

                if (newAnomalies.length > 0) {
                    setGame(prev => ({
                        ...prev,
                        anomalies: [...prev.anomalies, ...newAnomalies].slice(-10)
                    }));
                }
              }
            } catch (e) {
              console.error("Error parsing telemetry line:", e);
            }
          }
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Error fetching data stream:", error);
          // Retry after a delay
          setTimeout(() => {
            if (isMounted) connectToStream();
          }, 5000);
        }
      }
    };

    connectToStream();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return { game, players, telemetry };
};
