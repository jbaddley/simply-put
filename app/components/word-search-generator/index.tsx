"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Grid } from "./Grid"; // Assuming Grid is in the same directory
import { Button, TextInput, Textarea } from "flowbite-react";
import useLocalStorage from "use-local-storage";
import _ from "lodash";

interface WordSearchProps {}

export const WordSearchGenerator: React.FC<WordSearchProps> = () => {
  // Initialization logic for wsGenerator
  const [wordText, setWordText] = useLocalStorage<string>("ws-word-text-2", "");
  const [mysteryPhrase, setMysteryPhrase] = useLocalStorage<string>("ws-mystery-phrase", "");
  const [gridSize, setGridSize] = useLocalStorage<number>("ws-grid-size", 20);
  const [regen, setRegen] = useState<number>(0);

  const words = useMemo(() => {
    return _.uniq(wordText?.split("\n").filter((w) => w.trim()) || []);
  }, [wordText]);

  return (
    <div className='flex flex-row p-8'>
      <div className='w-2/3'>
        <Grid words={words} gridSize={gridSize} mysteryPhrase={mysteryPhrase} regen={regen} />
      </div>
      <div className='w-1/3'>
        <div>
          <label>Mystery Phrase</label>
          <TextInput value={mysteryPhrase} onChange={(e) => setMysteryPhrase(e.target.value)} />
          <label>Grid Size</label>
          <TextInput type='number' value={gridSize} onChange={(e) => setGridSize(parseInt(e.target.value))} />
        </div>
        <Textarea rows={20} value={wordText} onChange={(e) => setWordText(e.target.value)} />
        <span>Word count: {words.length}</span>
        <Button onClick={() => setRegen((i) => i + 1)}>Regen</Button>
      </div>
    </div>
  );
};
