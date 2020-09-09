import React, { useRef, memo } from "react";
import mem from "mem";
import Draggable from "react-draggable";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { randomBetween } from "./utils";

const boxIdsState = atom({
  key: "boxIdsState",
  default: [],
});

const getBoxPosition = mem((id) =>
  atom({
    key: `box-pos-${id}`,
    default: {
      x: randomBetween(0, window.innerWidth - 100),
      y: randomBetween(0, window.innerHeight - 100),
    },
  })
);

const totalBoxes = selector({
  key: "total-boxes",
  get: ({ get }) => {
    const boxes = get(boxIdsState);

    return boxes.length;
  },
});

export default function WithRecoil() {
  return (
    <RecoilRoot>
      <Create />
      <Boxes />
      <BigNumber />
    </RecoilRoot>
  );
}

function BigNumber() {
  const total = useRecoilValue(totalBoxes);
  return <div className="big-number">{total}</div>;
}

function Boxes() {
  const boxIds = useRecoilValue(boxIdsState);
  return (
    <>
      {boxIds.map((id) => {
        return <DrawBox key={id} id={id} />;
      })}
    </>
  );
}

const DrawBox = memo(({ id }) => {
  const [boxPos, setBoxPosition] = useRecoilState(getBoxPosition(id));
  const ref = useRef();

  return (
    <Draggable
      nodeRef={ref}
      position={{ x: boxPos.x, y: boxPos.y }}
      onDrag={(event, data) => {
        setBoxPosition({ ...boxPos, x: data.x, y: data.y });
      }}
    >
      <div ref={ref} className="box">
        Box
      </div>
    </Draggable>
  );
});

function Create() {
  const [boxIds, setBoxIds] = useRecoilState(boxIdsState);
  return (
    <button
      className="add"
      onClick={() => {
        const id = new Date().toISOString();
        setBoxIds([...boxIds, id]);
      }}
    >
      Add
    </button>
  );
}
