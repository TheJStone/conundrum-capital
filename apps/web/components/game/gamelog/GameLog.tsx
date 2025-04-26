import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { GameLogEntry } from '@/types';


interface GameLogProps {
  logs: GameLogEntry[];
}

export function GameLog({ logs }: GameLogProps) {
  return (
     <Card className="bg-neutral-850 border-neutral-700">
       <CardHeader className="p-2">
        <CardTitle className="text-sm text-neutral-300">Game Log</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <ScrollArea className="h-15 px-3">
          <div className="space-y-2 text-sm text-neutral-400 pb-3">
             {logs.map((log, index) => (
              <React.Fragment key={log.id}>
                <p>{log.message}</p>
                {index < logs.length - 1 && <Separator className="bg-neutral-700 my-1"/>}
              </React.Fragment>
            ))}
            {logs.length === 0 && <p>No moves yet.</p>}
          </div>
        </ScrollArea>
      </CardContent>
     </Card>
  );
}