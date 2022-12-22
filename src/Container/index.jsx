import React, { useState } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'


export default function Container() {
  const [state, setState] = useState("");
  const [duplicatesData, setduplicatesData] = useState([]);
  const [error, setError] = useState([]);

  const handleNext = () => {
    const err = [];
    const duplicates = [];
    state
      .replaceAll(" ", "*")
      .replaceAll("=", "*")
      .replaceAll(",", "*").split("\n").forEach((item, i) => {
      const strArr = item.split("*");
      if (strArr.length === 2) {
        if (`${Number(strArr[1])}` === "NaN") {
          err.push(`Line ${i + 1} wrong amount`);
        } else {
          const match = duplicates.find((a) => a?.char === strArr[0]);
          if (match) {
            match.line.push(match.line[0] ? i + 1 : 1);
            match.count = [...match.count, +strArr[1]];
            match.originalChr = item;
            match.char = strArr[0];
          } else {
            duplicates.push({
              line: [i + 1],
              count: [+strArr[1]],
              originalChr: item,
              char: strArr[0],
            });
          }
        }
      } else {
        err.push(`Line ${i + 1} invalid address`);
      }
    });
    if (err[0] || duplicates[0]) {
      const isDuplicated = err[0] ? true : false;
      setError({
        isDuplicated,
        errorList: isDuplicated
          ? err
          : duplicates
              .filter(({ line }) => line.length > 1)
              .map(
                ({ char, line }) =>
                  `Address ${char} encountered duplicate in Line:${line}`
              ),
      });
    }
    setduplicatesData(duplicates);
  };

  /**
   * This is handleFilerString fun 
   * @param {Boolean} type Only accept boolean value.
   * return (undefined) 
   */

  const handleFilerString = (type = false) => {
    const strArry = [];
    duplicatesData.forEach(({ char, count }) => {
      if (type) {
        strArry.push(`${char} ${count.reduce((a, b) => a + b, 0)}`);
      } else {
        strArry.push(`${char} ${count[0]}`);
      }});
    setState(strArry.join('\n'));
    setError([])
  };
 
  return (
    <div>
      <div className="container mt-3" style={{ padding: "38px" }}>
        <div>Addresses with Amounts</div>
        <div className="row">
          <CodeMirror
           height="200px"
             value={state}
            onChange={(s) => {
              setState(s);
            }}
          />
        </div>
        <div className="row">
          <div className="col-sm-10">Separated by ',' or ' ' or '='</div>
          <div
            className="col-sm-2 d-flex  justify-content-end"
            data-bs-toggle="modal"
            data-bs-target="#myModal"
          >
            Show Example
          </div>
        </div>
        <br />
        {error?.errorList && error?.errorList[0] && (
          <div>
            {error.isDuplicated === false && (
              <div className="row">
                <div className="text-danger col-sm-8">Duplicated</div>
                <div className="col-sm-4 d-flex  justify-content-end">
                  <div className="text-danger" onClick={() => handleFilerString()}>
                    keep the first one
                  </div>
                  &nbsp;<div className="text-danger">|</div>&nbsp;
                  <div  className="text-danger" onClick={() => handleFilerString(true)}>
                    Combine Balance
                  </div>
                </div>
              </div>
            )}
            <div className="alert border-danger text-danger mt-2">
              {(error?.errorList || []).map((a) => (
                <div key={a}><FontAwesomeIcon icon={faCircleExclamation} /> {a}</div>
              ))}
            </div>
          </div>
        )}
        <br />
        <div className="row">
          <button
            type="button"
            className="btn btn-primary btn-lg py-2"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
      <div className="modal" id="myModal">
        <div className="modal-dialog   modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="row pl-4 mr-4">
                <button type="button" className="btn btn-light width100 round">
                  <div className="scatter__example-head padB10">
                    Example
                    <br />
                    <span className="app-clr">
                      0xD50ba32a4098C075dC2Z52f9130C5F04a72b11AF 5.565
                      0x6C9a2aF2f6C8f808BE6aE89A5B3C80f2414480dc,4.242
                      0x3c32F97E9398A6cc97VASfaA37b3Aa5E068b9C4c=100
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
