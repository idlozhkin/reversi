import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Animated,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

let arrField = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];
let field = {
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  10: 0,
  11: 0,
  12: 0,
  13: 0,
  14: 0,
  15: 0,
  16: 0,
  17: 0,
  20: 0,
  21: 0,
  22: 0,
  23: 0,
  24: 0,
  25: 0,
  26: 0,
  27: 0,
  30: 0,
  31: 0,
  32: 0,
  33: 1,
  34: -1,
  35: 0,
  36: 0,
  37: 0,
  40: 0,
  41: 0,
  42: 0,
  43: -1,
  44: 1,
  45: 0,
  46: 0,
  47: 0,
  50: 0,
  51: 0,
  52: 0,
  53: 0,
  54: 0,
  55: 0,
  56: 0,
  57: 0,
  60: 0,
  61: 0,
  62: 0,
  63: 0,
  64: 0,
  65: 0,
  66: 0,
  67: 0,
  70: 0,
  71: 0,
  72: 0,
  73: 0,
  74: 0,
  75: 0,
  76: 0,
  77: 0,
};

let numOfBlue = 0;

export default function Game({ navigation }) {
  const [blueOpacity] = useState(new Animated.Value(0));
  const [firstAction, setFirstAction] = useState(null);
  const [modalWid, setModalWid] = useState(true);
  const [turn, setTurn] = useState(-1);
  const [state, setState] = useState(1);
  const [end, setEnd] = useState(0);

  const getCellType = (cell) => {
    if (field[cell] === 0) {
      if (canClickSpot(cell)) {
        numOfBlue++;
        if ((turn == -1 && firstAction) || (turn == 1 && !firstAction)) {
          return (
            <TouchableOpacity
              style={styles.cell}
              onPress={() => {
                if (
                  (turn == -1 && firstAction) ||
                  (turn == 1 && !firstAction)
                ) {
                  doTurn(cell);
                }
              }}
            >
              <Animated.View style={[styles.blue, { opacity: blueOpacity }]} />
            </TouchableOpacity>
          );
        } else {
          return <View style={styles.cell} />;
        }
      } else {
        return <View style={styles.cell} />;
      }
    } else if (field[cell] === -1) {
      return (
        <View style={styles.cell}>
          <View style={styles.black} />
        </View>
      );
    } else if (field[cell] === 1) {
      return (
        <View style={styles.cell}>
          <View style={styles.white} />
        </View>
      );
    }
  };

  const doTurn = (cell) => {
    numOfBlue = 0;
    let affectedCells = getAffectedCells(cell);
    flipCells(affectedCells);
    field[cell] = turn;
    setTurn(-1 * turn);
    setState(-1 * state);
  };

  const canClickSpot = (cell) => {
    if (field[cell] === -1 || field[cell] === 1) return false;
    return getAffectedCells(cell).length !== 0;
  };

  const flipCells = (affectedCells) => {
    for (let i = 0; i < affectedCells.length; i++) {
      field[+(affectedCells[i].row + "" + affectedCells[i].column)] *= -1;
    }
  };

  const getAffectedCells = (cell) => {
    var affectedCells = [];

    mapToArr();
    let col = cell % 10;
    let row;
    if (cell < 10) {
      row = 0;
    } else {
      row = (cell - col) / 10;
    }

    //raycast right
    let couldBeAffected = [];
    let cellIterator = col;
    while (cellIterator < 7) {
      cellIterator++;
      let cellValue = arrField[row][cellIterator];
      if (cellValue === 0 || cellValue === turn) {
        if (cellValue === turn) {
          affectedCells = affectedCells.concat(couldBeAffected);
        }
        break;
      } else {
        couldBeAffected.push({ row: row, column: cellIterator });
      }
    }

    //left
    couldBeAffected = [];
    cellIterator = col;
    while (cellIterator > 0) {
      cellIterator--;
      let cellValue = arrField[row][cellIterator];
      if (cellValue === 0 || cellValue === turn) {
        if (cellValue === turn) {
          affectedCells = affectedCells.concat(couldBeAffected);
        }
        break;
      } else {
        couldBeAffected.push({ row: row, column: cellIterator });
      }
    }

    //up
    couldBeAffected = [];
    cellIterator = row;
    while (cellIterator > 0) {
      cellIterator--;
      let cellValue = arrField[cellIterator][col];
      if (cellValue === 0 || cellValue === turn) {
        if (cellValue === turn) {
          affectedCells = affectedCells.concat(couldBeAffected);
        }
        break;
      } else {
        couldBeAffected.push({ row: cellIterator, column: col });
      }
    }

    //down
    couldBeAffected = [];
    cellIterator = row;
    while (cellIterator < 7) {
      cellIterator++;
      let cellValue = arrField[cellIterator][col];
      if (cellValue === 0 || cellValue === turn) {
        if (cellValue === turn) {
          affectedCells = affectedCells.concat(couldBeAffected);
        }
        break;
      } else {
        couldBeAffected.push({ row: cellIterator, column: col });
      }
    }

    //down right
    couldBeAffected = [];
    cellIterator = row;
    let cell2Iterator = col;
    while (cellIterator < 7 && cell2Iterator < 7) {
      cellIterator++;
      cell2Iterator++;
      let cellValue = arrField[cellIterator][cell2Iterator];
      if (cellValue === 0 || cellValue === turn) {
        if (cellValue === turn) {
          affectedCells = affectedCells.concat(couldBeAffected);
        }
        break;
      } else {
        couldBeAffected.push({ row: cellIterator, column: cell2Iterator });
      }
    }

    //down left
    couldBeAffected = [];
    cellIterator = row;
    cell2Iterator = col;
    while (cellIterator < 7 && cell2Iterator > 0) {
      cellIterator++;
      cell2Iterator--;
      let cellValue = arrField[cellIterator][cell2Iterator];
      if (cellValue === 0 || cellValue === turn) {
        if (cellValue === turn) {
          affectedCells = affectedCells.concat(couldBeAffected);
        }
        break;
      } else {
        couldBeAffected.push({ row: cellIterator, column: cell2Iterator });
      }
    }

    //up left
    couldBeAffected = [];
    cellIterator = row;
    cell2Iterator = col;
    while (cellIterator > 0 && cell2Iterator > 0) {
      cellIterator--;
      cell2Iterator--;
      let cellValue = arrField[cellIterator][cell2Iterator];
      if (cellValue === 0 || cellValue === turn) {
        if (cellValue === turn) {
          affectedCells = affectedCells.concat(couldBeAffected);
        }
        break;
      } else {
        couldBeAffected.push({ row: cellIterator, column: cell2Iterator });
      }
    }

    //up right
    couldBeAffected = [];
    cellIterator = row;
    cell2Iterator = col;
    while (cellIterator > 0 && cell2Iterator < 7) {
      cellIterator--;
      cell2Iterator++;
      let cellValue = arrField[cellIterator][cell2Iterator];
      if (cellValue === 0 || cellValue === turn) {
        if (cellValue === turn) {
          affectedCells = affectedCells.concat(couldBeAffected);
        }
        break;
      } else {
        couldBeAffected.push({ row: cellIterator, column: cell2Iterator });
      }
    }

    return affectedCells;
  };

  const mapToArr = () => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        arrField[row][col] = field[+(row + "" + col)];
      }
    }
  };

  const startGame = () => {
    setEnd(0);
    numOfBlue = 0;
    field = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      10: 0,
      11: 0,
      12: 0,
      13: 0,
      14: 0,
      15: 0,
      16: 0,
      17: 0,
      20: 0,
      21: 0,
      22: 0,
      23: 0,
      24: 0,
      25: 0,
      26: 0,
      27: 0,
      30: 0,
      31: 0,
      32: 0,
      33: 1,
      34: -1,
      35: 0,
      36: 0,
      37: 0,
      40: 0,
      41: 0,
      42: 0,
      43: -1,
      44: 1,
      45: 0,
      46: 0,
      47: 0,
      50: 0,
      51: 0,
      52: 0,
      53: 0,
      54: 0,
      55: 0,
      56: 0,
      57: 0,
      60: 0,
      61: 0,
      62: 0,
      63: 0,
      64: 0,
      65: 0,
      66: 0,
      67: 0,
      70: 0,
      71: 0,
      72: 0,
      73: 0,
      74: 0,
      75: 0,
      76: 0,
      77: 0,
    };
  };

  const EndGame = () => {
    if (end === 2) {
      let white = 0;
      let black = 0;
      mapToArr();
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (arrField[i][j] === 1) {
            white++;
          } else if (arrField[i][j] === -1) {
            black++;
          }
        }
      }
      let win;
      if (white > black) {
        win = "white win";
      } else if (white < black) {
        win = "black win";
      } else {
        win = "draw";
      }
      startGame();
      navigation.navigate("Main", [
        `white score: ${white}, black score: ${black}, ${win}`,
        firstAction ? black : white,
      ]);
    }
  };
  const getSS = (cell) => {
    let col = cell % 10;
    let row;
    if (cell < 10) {
      row = 0;
    } else {
      row = (cell - col) / 10;
    }
    if (
      (row == 0 && col == 0) ||
      (row == 7 && col == 7) ||
      (row == 0 && col == 7) ||
      (row == 7 && col == 0)
    ) {
      return 0.8;
    } else if (row == 0 || col == 0 || row == 7 || col == 7) {
      return 0.4;
    }
    return 0;
  };

  const getSSI = (cell) => {
    if (getSS(cell) == 0) {
      return 1;
    } else if (getSS(cell) == 0.4) {
      return 2;
    }
    return 0;
  };

  const easyBot = () => {
    let maxR = 0;
    let maxRCell;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        let cell = +(row + "" + col);
        if (canClickSpot(cell)) {
          let locMaxR = 0;
          locMaxR += getSS(cell);
          getAffectedCells(cell).forEach((el) => (locMaxR += getSSI(el)));
          if (locMaxR > maxR) {
            maxR = locMaxR;
            maxRCell = cell;
          }
        }
      }
    }
    doTurn(maxRCell);
  };

  useEffect(() => {
    if (!modalWid) {
      if (numOfBlue === 0 && end !== 2) {
        setEnd(end + 1);
        setTurn(-1 * turn);
        setState(-1 * state);
      } else if (numOfBlue !== 0) {
        setEnd(0);
      }
      if ((turn == -1 && !firstAction) || (turn == 1 && firstAction)) {
        setTimeout(() => easyBot(), 0);
      }
      EndGame();
    }
  });

  useEffect(() => {
    startGame();
  }, [modalWid]);

  useEffect(() => {
    blueOpacity.setValue(-2);
    Animated.timing(blueOpacity, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, [numOfBlue]);

  return (
    <View style={styles.main}>
      <Modal visible={modalWid}>
        <View style={styles.modal}>
          <TouchableOpacity
            style={styles.whiteButton}
            onPress={() => {
              setFirstAction(false);
              setModalWid(false);
            }}
          />
          <TouchableOpacity
            style={styles.blackButton}
            onPress={() => {
              setFirstAction(true);
              setModalWid(false);
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setFirstAction(!Math.round(Math.random()));
              setModalWid(false);
            }}
          >
            <AntDesign name="questioncircle" size={100} color="#f60" />
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.board}>
        <FlatList
          numColumns={8}
          data={Object.keys(field)}
          extraData={state}
          renderItem={({ item }) => getCellType(item)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#333",
    flex: 1,
  },
  board: {
    marginTop: "40%",
    alignSelf: "center",
    backgroundColor: "#333",
    width: Dimensions.get("screen").width - 20,
    height: Dimensions.get("screen").width - 20,
  },
  cell: {
    backgroundColor: "#f60",
    width: (Dimensions.get("screen").width - 20) / 8 - 2,
    height: (Dimensions.get("screen").width - 20) / 8 - 2,
    margin: 1,
  },
  black: {
    borderRadius: 20,
    backgroundColor: "#000",
    width: "60%",
    height: "60%",
    margin: "20%",
  },
  white: {
    borderRadius: 20,
    backgroundColor: "#fff",
    width: "60%",
    height: "60%",
    margin: "20%",
  },
  blue: {
    borderRadius: 20,
    backgroundColor: "blue",
    width: "20%",
    height: "20%",
    margin: "40%",
  },
  green: {
    borderRadius: 20,
    backgroundColor: "green",
    width: "20%",
    height: "20%",
    margin: "40%",
  },
  modal: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#333f",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: "70%",
  },
  whiteButton: {
    width: 100,
    height: 100,
    backgroundColor: "white",
    borderRadius: 100,
  },
  blackButton: {
    width: 100,
    height: 100,
    backgroundColor: "black",
    borderRadius: 100,
  },
});
