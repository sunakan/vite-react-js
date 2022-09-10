import React, { useState } from "react";
import './App.css'

const empty = "";
const batsu = "X";
const maru  = "O";

/**
 * 勝者判定
 *
 * "O" or "X" が1直線になっているか比較
 */
const calculateWinner = (squares) => {
  const lines =[
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] !== empty && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // 勝った方
    }
  }
  return null; // まだ勝負はついていない
};

/**
 * Squareコンポーネント
 *
 * OXゲームの1マス
 */
const Square = ({ value, onClick }) => {
  return (
    <button className="square" onClick={() => onClick() }>
      {value}
    </button>
  );
}

/**
 * Boardコンポーネント
 *
 * OXゲーム盤
 */
const Board = ({ squares, onClick }) => {
  /**
   * 1マスをrender
   */
  const renderSquare = (i) => {
    return <Square value={squares[i]} onClick={() => onClick(i)} />;
  };

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
};

/**
 * Gameコンポーネント
 *
 * OXゲーム全体
 */
const Game = () => {
  const [history, setHistory] = useState([{ squares: Array(9).fill(empty) }]);
  const [xIsNext, setXIsNext] = useState(true);
  const [stepNumber, setStepNumber] = useState(0);

  /**
   * 1マスをクリックした時の挙動
   */
  const handleClick = (i) => {
    const _history = history.slice(0, stepNumber + 1);
    const current = _history[_history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)) {// 勝者が決定している -> 何もしない
      return;
    }
    if (squares[i] !== empty) {// クリックした箇所は既に埋まっている -> 何もしない
      return;
    }
    squares[i] = xIsNext ? batsu : maru;

    setHistory(_history.concat([{ squares: squares }]));
    setXIsNext(!xIsNext);
    setStepNumber(_history.length);
  };

  const _history = history;
  const current = _history[stepNumber];
  const winner = calculateWinner(current.squares);
  const status = (() => {
    if (winner) {
      return "Winner: " + winner;
    } else {
      return "Next player: " + (xIsNext ? batsu : maru);
    }
  })();

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  /**
   * 履歴ボタン コンポーネント郡
   */
  const renderMoves = () => {
    return _history.map((oneHistory, step) => {
      const oneHistoryLine = oneHistory.squares.map((e, idx) => { return e===empty ? "--" : e});
      const desc = `履歴${step+1}: ${oneHistoryLine}`
      return (
        <li key={step}>
          <button onClick={() => jumpTo(step)}>{desc}</button>
        </li>
      );
    });
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={(i) => handleClick(i)} status={status} />
      </div>
      <div className="game-info">
        <div>{ status }</div>
        <ol>{ renderMoves() }</ol>
      </div>
    </div>
  );
}

/**
 * App
 */
function App() {
  return <Game />
}

export default App
