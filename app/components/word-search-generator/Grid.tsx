import React, { useCallback, useMemo, useRef, useState } from "react";
import { Row } from "./Row";
import WSGenerator, { IBox, ICell } from "./wsGen";
import classNames from "classnames";
import { Button } from "flowbite-react";
import { toJpeg } from "html-to-image";

interface GridProps {
  words: string[];
  gridSize?: number;
  mysteryPhrase?: string;
  regen?: number;
}
function useSplitList<T>({ list, max = 5 }: { list?: T[]; max?: number }) {
  const splitList = useMemo(() => {
    if (!list) {
      return [];
    }
    const maxCount = list.length > max * 4 ? Math.ceil(list.length / 4) : max;
    return list.reduce(
      (p: any[][], c: any) => {
        const i = p.length - 1;
        if (p[i].length < maxCount) {
          p[i].push(c);
        } else {
          p.push([c]);
        }
        return p;
      },
      [[]]
    );
  }, [list, max]);

  return splitList;
}
export const Grid: React.FC<GridProps> = ({ words, gridSize = 20, mysteryPhrase, regen }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string>(null);
  const [reveal, setReveal] = useState<boolean>(false);
  const ws = useMemo(() => {
    return new WSGenerator({ words, gridSize, mysteryPhrase });
  }, [words, gridSize, mysteryPhrase, regen]);

  const groups = useSplitList<IBox>({ list: ws.keyedList });
  const handleCreateImage = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toJpeg(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `word-search-${reveal ? "key" : "board"}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref, reveal]);
  return (
    <>
      <div ref={ref} className='flex flex-col justify-center gap-6 bg-white p-8 align-middle'>
        <div className='word-generator m-auto'>
          {ws.gridArr.map((row: any) => (
            <Row row={row} key={row.id} selected={selected} reveal={reveal} />
          ))}
        </div>
        <div className='m-auto flex justify-center' style={{ maxWidth: 650, minWidth: ws.colCount * 30 }}>
          {groups?.map((subList: IBox[], s: number) => (
            <div key={s} className={classNames({ "w-1/4": words.length > 19, "w-1/3": words.length < 20 })}>
              <ul className={classNames("mx-4 mb-0 mt-0 text-sm ")}>
                {subList.map((l) => (
                  <li
                    className={classNames("my-1 text-center", {
                      "text-slate-500": !reveal,
                      "font-bold": ws.wordsFound.includes(l.originalWord),
                    })}
                    key={l.originalWord}
                    style={{ color: reveal && l.color }}
                    onMouseLeave={() => setSelected(null)}
                    onMouseEnter={() => setSelected(l.originalWord)}
                  >
                    {l.originalWord}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {mysteryPhrase && (
          <div className='m-auto flex flex-col gap-4' style={{ maxWidth: 650, minWidth: ws.colCount * 28 }}>
            <div className='m-1 text-center text-2xl text-slate-800'>Mystery Phrase</div>
            <div className='m-1 text-center text-xs text-slate-600'>
              After finding all the words in the list above, copy the remaining letters beginning at the top left, row
              by row, into the boxes below to reveal the mystery phrase. After the mystery phrase is revealed, count the
              remaining letters and enter the number in the box below.
            </div>
            <div className='flex flex-wrap justify-center align-middle'>
              {mysteryPhrase
                ?.split(" ")
                .filter((m) => m)
                .map((mp, i) => (
                  <div key={`${mp}-${i}`} className='mb-1 ml-5 flex space-x-1 align-middle'>
                    {mp.split("").map((m, i) => (
                      <span
                        key={`${m}-${i}`}
                        style={{ width: 30, height: 30 }}
                        className={classNames(
                          "flex flex-col justify-center border border-slate-900 text-center align-middle",
                          {
                            "text-white": !reveal,
                          }
                        )}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                ))}
            </div>
            <div className='flex flex-wrap justify-center gap-1 text-slate-600'>
              <span style={{ height: 40, lineHeight: "40px" }}>Number of letters left over: </span>
              <span
                style={{ width: 40, height: 40 }}
                className={classNames("flex flex-col justify-center border border-slate-900 text-center align-middle", {
                  "text-white": !reveal,
                })}
              >
                {ws.lettersLeft}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className='m-auto flex flex-row-reverse gap-2' style={{ width: ws.colCount * 24 }}>
        <Button onClick={handleCreateImage}>Create Image</Button>
        <Button
          onClick={() => {
            setReveal((h) => !h);
          }}
        >
          Toggle Key
        </Button>
      </div>
    </>
  );
};
