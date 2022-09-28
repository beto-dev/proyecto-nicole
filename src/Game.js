import React, { useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import Modal from "react-modal";
import Tesseract from "tesseract.js";
import undo from "./undo.png";
import erase from "./erase.png";
import change from "./change.png";
import sound from "./ñ.mp3";

const Game = () => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const games = ["draw", "form"];
  const [currentGame, setCurrentGame] = useState(games[0]);
  const [showSound, setShowSound] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [showCanvas, setShowCanvas] = useState(true);
  const [showChar, setShowChar] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDrawInput, setShowDrawInput] = useState(true);
  const [showDrawOptions, setShowDrawOptions] = useState(true);
  const [charInput, setCharInput] = useState("");
  const [charValue] = useState("ñ");
  const canvasRef = useRef(null);

  const handleCharInputChange = (event) => {
    const result = event.target.value.replace(/[^a-z ñ]/gi, "");
    setCharInput(result);
  };

  const handleCharSubmit = (event) => {
    event.preventDefault();

    if (charInput === charValue) {
      openModal();
    }
  };

  const handleDrawSubmit = async (event) => {
    event.preventDefault();

    const dataURL = canvasRef.current.getDataURL();

    const result = await Tesseract.recognize(dataURL, "spa", {
      logger: (response) => console.log(response),
    });

    if (
      result.data.text.toLowerCase().trim() === charValue.toLowerCase().trim()
    ) {
      setShowSound(true);
      openModal();
    }
  };

  const eraseDraw = (event) => {
    event.preventDefault();
    setShowSound(false);
    canvasRef.current.eraseAll();
  };

  const undoDraw = (event) => {
    event.preventDefault();
    setShowSound(false);
    canvasRef.current.undo();
  };

  const playSound = (event) => {
    event.preventDefault();
    document.getElementById("audio").play();
  };

  const changeGame = (event) => {
    event.preventDefault();
    if (currentGame === games[0]) {
      setShowForm(true);
      setShowCanvas(false);
      setShowChar(true);
      setShowDrawInput(false);
      setShowDrawOptions(false);
      setCurrentGame(games[1]);
      setShowSound(false)
    } else {
      setShowForm(false);
      setShowCanvas(true);
      setShowChar(false);
      setShowDrawInput(true);
      setShowDrawOptions(true);
      setCurrentGame(games[0]);
      setShowSound(false)
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    if (currentGame === games[0]) {
      setShowForm(true);
      setShowCanvas(false);
      setShowChar(true);
      setShowDrawInput(false);
      setShowDrawOptions(false);
      setCurrentGame(games[1]);
    } else {
      //form
      setShowForm(false);
      setShowCanvas(true);
      setShowChar(false);
      setShowDrawInput(true);
      setShowDrawOptions(true);
      setCurrentGame(games[0]);
    }
  };

  return [
    <div className="game-container" id="game-container">
      <button
        onClick={changeGame}
        type=""
        value=""
        style={{
          backgroundColor: "white",
          border: "2px solid rgb(161, 194, 152)",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        Cambiar Juego
        <img
          src={change}
          style={{
            width: "20px",
            height: "20px",
            paddingLeft: "10px",
          }}
        />
      </button>
      <div
        className="canvas-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <div
          className="canvas-container"
          style={{
            width: 400,
            height: 400,
            border: "10px solid rgb(251, 242, 207)",
            backgroundColor: "white",
          }}
        >
          {showCanvas ? (
            <CanvasDraw hideInterface="true" ref={canvasRef} />
          ) : null}
          {showChar ? (
            <p
              className="char"
              style={{
                fontSize: 200,
                color: "black",
                height: "100%",
                margin: 70,
              }}
            >
              {charValue}
            </p>
          ) : null}
        </div>
        {showDrawOptions ? (
          <div
            className="draw-options"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {showSound ? (
              <button
                type="button"
                value="Play"
                onClick={playSound}
                style={{
                  backgroundColor: "white",
                  border: "2px solid rgb(161, 194, 152)",
                }}
              >
                <audio id="audio" src={sound}></audio>
                <img
                  src="https://static.vecteezy.com/system/resources/previews/003/611/805/original/sound-speaker-icon-on-white-background-free-vector.jpg"
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                />
              </button>
            ) : null}
            <button
              onClick={undoDraw}
              type=""
              value=""
              style={{
                backgroundColor: "white",
                border: "2px solid rgb(161, 194, 152)",
              }}
            >
              <img
                src={undo}
                style={{
                  width: "40px",
                  height: "40px",
                }}
              />
            </button>
            <button
              onClick={eraseDraw}
              type=""
              value=""
              style={{
                backgroundColor: "white",
                border: "2px solid rgb(161, 194, 152)",
              }}
            >
              <img
                src={erase}
                style={{
                  width: "40px",
                  height: "40px",
                }}
              />
            </button>
          </div>
        ) : null}
      </div>
      {showDrawInput ? (
        <div className="draw-form">
          <h2>
            Dibuje la letra{" "}
            <b>
              <u>{charValue}</u>
            </b>{" "}
            y luego haga clic en Comprobar
          </h2>
          <button
            value="Comprobar"
            name="submit-draw"
            onClick={handleDrawSubmit}
            style={{
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Comprobar
          </button>
        </div>
      ) : null}
      {showForm ? (
        <div className="options">
          <form onSubmit={handleCharSubmit}>
            <h2>
              Escriba la letra que aparece en la imágen y luego haga clic en
              Comprobar
            </h2>
            <label>
              <input
                id="char-input"
                name="char-input"
                type="text"
                value={charInput}
                onChange={handleCharInputChange}
                style={{
                  fontSize: "18px",
                }}
              />
            </label>
            <input
              type="submit"
              value="Comprobar"
              name="submit-char"
              style={{
                fontSize: "18px",
                fontWeight: "bold",
              }}
            />
          </form>
        </div>
      ) : null}
    </div>,
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <h2>Felicidades, acertaste! 🎉🎉🎉</h2>
    </Modal>,
  ];
};

export default Game;
